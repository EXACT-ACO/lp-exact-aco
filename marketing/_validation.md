# Validation report — 2026-08-04

**Page**: `index.html` (servida por `server.js`, porta local 3310 durante a validação)
**Brand**: Exact Aço
**Verdict**: 🟢 APROVADO (aguardando aprovação VISUAL do founder no PR)

## Screenshots

- Desktop 1440 (nova): `marketing/screenshots/lp-nova-desktop.jpg`
- Mobile 390 (nova): `marketing/screenshots/lp-nova-mobile.jpg`
- Desktop 1440 (atual/main, para comparação): `marketing/screenshots/lp-atual-desktop.jpg`

## Quality bar — 14 pontos (`.claude/ordoplugin-docs/quality-bar.md`)

| # | Critério | Resultado |
|---|---|---|
| 1 | Fotografia real/original (zero stock/AI novo) | ✅ só assets já existentes da marca |
| 2 | Tipografia com duas vozes | ✅ Space Grotesk display × Mont corpo |
| 3 | Paleta contida (≤4 cores) | ✅ ink · fundos navy-cast · accent gelo · muted |
| 4 | Fundo não-branco-puro | ✅ near-black com cast navy #2c2858 |
| 5 | Tracking tipográfico | ✅ display −0.02em · eyebrow +0.18em · corpo −0.011em |
| 6 | Headline com âncora tonal (sem frase genérica de IA) | ✅ functional-direct ("O aço chega pronto. A perda fica na fábrica.") |
| 7 | Espaço negativo generoso | ✅ seções 96/128px assimétricas (linear), hero clamp(96px,14vh,160px) |
| 8 | Smooth scroll + reveal com safety net | ✅ IO + força-revelação em 1,2s |
| 9 | Mobile de verdade (390px) | ✅ 0px de overflow horizontal, hamburger, CTAs empilhados |
| 10 | CTAs com verbo da marca | ✅ "Solicitar orçamento" · "Envie seu projeto" · "Falar no WhatsApp" |
| 11 | Footer com peso | ✅ tagline display + 3 colunas + legal |
| 12 | Sem emojis | ✅ |
| 13 | Acentos pt-BR corretos | ✅ |
| 14 | Sem placeholder shipando | ✅ (comentários [VALIDAR]/[SLA] são notas internas pré-existentes de conferência de conteúdo, invisíveis na página) |

**Score: 14/14**

## Self-review checklist (quality-bar)

- [x] Página carrega sem erros de console (verificado via puppeteer — `[]`)
- [x] Type-check n/a (HTML puro)
- [x] Mobile 390px sem scroll horizontal (0px medido)
- [x] Hero desktop com respiro vertical dramático
- [x] Fontes display e corpo com vozes distintas
- [x] ≤4 cores em uso
- [x] Accent usado com parcimônia (traço do eyebrow, aba ativa, focus/hover)
- [x] Toda imagem com alt (vídeos com aria-label/aria-hidden)
- [x] Sem console.log (o debug do track() da v8 foi removido)
- [x] Sem lorem ipsum/placeholder/tbd
- [x] Sem emojis
- [x] Acentos corretos
- [x] Reveal-on-scroll com safety net 1,2s (também nos contadores)
- [x] CTA primário acima da dobra (desktop e mobile — screenshots de viewport conferidos)
- [x] Screenshots desktop+mobile em `marketing/screenshots/`

## Regressão funcional (inegociáveis da LP)

- [x] GTM-TNFKRW99 no head + noscript após `<body>`
- [x] gtag AW-18345228340 (script + config)
- [x] Meta Pixel 1489433913199448 (init + PageView + noscript img)
- [x] `track()` empurra para dataLayer + fbq + gtag
- [x] Eventos ligados: `cta_whatsapp` (header/menu/hero/final/footer/float/pos_form via data-ctx), `form_submit`, `scroll_50`, `scroll_90`, `produto_tab` (abas), `lead_ok`/`lead_fail`
- [x] Form POST `/api/lead` com os mesmos 7 campos (nome, empresa, telefone, email, cidade, obra, mensagem) — E2E: request POST emitido com JSON correto, painel de confirmação renderiza, botão WhatsApp pós-form presente, `form_submit` + `lead_fail` no dataLayer (fail é o esperado local, sem CRM_LEAD_URL; em prod vira `lead_ok`)
- [x] `server.js`, `Dockerfile`, `package.json` intocados
- [x] Copy sem promessa comercial nova — mesmos fatos da v8 (SINAPI 11%, 1.200 t/mês, 5 dias úteis, 98%, 18–25%, entrega futura, clientes)

## Findings

### 🔴 Critical
(nenhum)

### 🟡 Polish (corrigidos durante a validação)
- H1 do hero quebrava em 4 linhas no desktop (max-width 15ch) → removido o cap, agora 2 linhas limpas
- Lead do hero em cinza muted pouco legível sobre o vídeo → elevado para text-secondary
- Screenshot mobile em dpr2 estourava o limite de textura do Chromium (artefato de captura, não da página) → captura em dpr1

## Sign-off

🟢 14/14 no quality bar + regressão funcional completa. Próximo passo: aprovação
visual do founder no PR (draft) antes do merge.
