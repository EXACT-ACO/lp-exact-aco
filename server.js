/**
 * Servidor da Landing Page da Exact Aço.
 *
 * Faz duas coisas:
 *   1. Serve o estático (index.html + assets/), com range requests pro vídeo
 *      e cache longo/imutável nos assets.
 *   2. POST /api/lead — recebe o formulário do navegador e faz PROXY pro CRM
 *      (closeu), injetando o segredo de ingestão do lado servidor. O segredo
 *      NUNCA vai pro browser (por isso o proxy) e, como a chamada CRM é
 *      server-to-server, não há CORS envolvido.
 *   3. POST /api/wa-click — registra no CRM o clique no WhatsApp (código
 *      EX-XXXX + origem da visita), pra medir as campanhas. Mesmo proxy.
 *
 * Env:
 *   PORT               porta (Railway injeta)
 *   CRM_LEAD_URL       URL absoluta do endpoint do CRM (…/api/public/leads)
 *   LP_INGEST_SECRET   mesmo segredo configurado no CRM (Bearer)
 */

const path = require("path");
const express = require("express");

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true); // atrás do proxy da Railway (x-forwarded-*)

const ROOT = __dirname;
const CRM_LEAD_URL = process.env.CRM_LEAD_URL;
const LP_INGEST_SECRET = process.env.LP_INGEST_SECRET;

// Headers de segurança básicos (leves, sem dependência).
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

app.get("/healthz", (_req, res) => res.json({ ok: true }));

// ---- Atribuição de marketing (UTM, clique do Google/Meta, site de origem) ----
// Só as chaves conhecidas, texto curto. O CRM revalida (tolerante).
const ATTR_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "gclid", "gbraid", "wbraid", "fbclid", "fbc", "fbp",
  "referrer", "landing_path", "ts",
];
function cleanToque(t) {
  if (!t || typeof t !== "object") return undefined;
  const out = {};
  for (const k of ATTR_KEYS) {
    const v = t[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, k === "referrer" ? 1000 : 300);
  }
  return out;
}
function cleanAtribuicao(a) {
  if (!a || typeof a !== "object") return undefined;
  return { ultimo: cleanToque(a.ultimo), primeiro: cleanToque(a.primeiro) };
}

// URL do CRM pro clique no WhatsApp: mesmo endpoint base do lead + /whatsapp-click.
const CRM_WA_CLICK_URL = CRM_LEAD_URL ? CRM_LEAD_URL.replace(/\/+$/, "") + "/whatsapp-click" : null;
const REF_RE = /^EX-[A-HJ-NP-Z2-9]{4}$/;

// ---- Clique no WhatsApp → proxy pro CRM (best-effort; o visitante já foi pro WhatsApp) ----
app.post("/api/wa-click", express.json({ limit: "16kb", type: () => true }), async (req, res) => {
  const b = req.body || {};
  const ref = typeof b.ref === "string" ? b.ref.trim().toUpperCase() : "";
  if (!REF_RE.test(ref)) return res.status(400).json({ ok: false });
  if (!CRM_WA_CLICK_URL || !LP_INGEST_SECRET) return res.status(503).json({ ok: false });
  try {
    const r = await fetch(CRM_WA_CLICK_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${LP_INGEST_SECRET}`,
        "x-forwarded-for": (req.headers["x-forwarded-for"] || req.ip || "").toString(),
      },
      body: JSON.stringify({
        ref,
        cta: typeof b.cta === "string" ? b.cta.slice(0, 40) : undefined,
        atribuicao: cleanAtribuicao(b.atribuicao),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) console.error("[lp] wa-click: CRM respondeu %d", r.status);
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok });
  } catch (e) {
    console.error("[lp] wa-click: erro ao chamar o CRM:", e && e.message ? e.message : e);
    return res.status(502).json({ ok: false });
  }
});

// ---- Captura de lead → proxy pro CRM ----
app.post("/api/lead", express.json({ limit: "32kb" }), async (req, res) => {
  const b = req.body || {};
  const clean = (v) => (typeof v === "string" ? v.trim() : "");
  const lead = {
    nome: clean(b.nome),
    empresa: clean(b.empresa),
    telefone: clean(b.telefone),
    email: clean(b.email),
    cidade: clean(b.cidade),
    obra: clean(b.obra),
    mensagem: clean(b.mensagem),
  };

  // Validação leve (o CRM revalida com zod). Não perde lead por bobagem.
  if (!lead.nome || !lead.empresa || !lead.telefone) {
    return res
      .status(400)
      .json({ ok: false, error: "Preencha nome, empresa e telefone." });
  }

  if (!CRM_LEAD_URL || !LP_INGEST_SECRET) {
    // Sem config, não conseguimos gravar — o front cai no fallback do WhatsApp.
    console.error("[lp] CRM_LEAD_URL/LP_INGEST_SECRET ausente — proxy desligado.");
    return res.status(503).json({ ok: false, error: "capture_unavailable" });
  }

  try {
    const r = await fetch(CRM_LEAD_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${LP_INGEST_SECRET}`,
        "x-forwarded-for": (req.headers["x-forwarded-for"] || req.ip || "").toString(),
      },
      body: JSON.stringify({ ...lead, atribuicao: cleanAtribuicao(b.atribuicao) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      console.error("[lp] CRM respondeu %d", r.status);
      return res.status(502).json({ ok: false, error: "crm_error" });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error("[lp] erro ao chamar o CRM:", e && e.message ? e.message : e);
    return res.status(502).json({ ok: false, error: "crm_unreachable" });
  }
});

// ---- Estático ----
// Assets: cache longo e imutável (nomes de arquivo estáveis).
app.use(
  "/assets",
  express.static(path.join(ROOT, "assets"), {
    maxAge: "365d",
    immutable: true,
    fallthrough: true,
  })
);

// index.html: sem cache agressivo, pra mudanças de copy/head propagarem.
function sendIndex(_req, res) {
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
  res.sendFile(path.join(ROOT, "index.html"));
}
app.get("/", sendIndex);
// Página única: qualquer GET desconhecido cai na LP (evita 404 em deep link).
app.get("*", sendIndex);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`[lp] no ar em :${port} — proxy CRM ${CRM_LEAD_URL ? "ligado" : "DESLIGADO (sem CRM_LEAD_URL)"}`);
});
