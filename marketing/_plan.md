# Plano de blocos — redesign LP Exact Aço (ordoplugin)

Referência primária: **linear** (dark+accent, tom functional-direct, B2B).
Secundária: **offbrand** (display uppercase gigante, tabela numerada, reveal 1.2s).
Calibração industrial: **nucor** (hard-edge, barra de accent nos títulos, CTA caixa+seta) e **gerdau** (navy nativo do aço BR).

Sequência (service business B2B): nav · hero · trust_bar(stat) · manifesto/precisão · catalog(produtos) · pillars(por que) · story(previsibilidade) · trust(obras+clientes) · faq · process+cta_final(form) · footer.

Regras duras: formulário e POST /api/lead intactos; GTM+gtag+Pixel no head (e noscript);
track() com cta_whatsapp/form_submit/scroll_50/scroll_90 (e produto_tab nas abas);
copy sem promessa nova — só o que já está na LP/planilha de fatos do `_brief.md`.

## nav
- Logo branco à esquerda; 5 links (Precisão · Produtos · Por que a Exact · Preço · Dúvidas); CTA "Solicitar orçamento" (.wa data-ctx=header).
- Fixo, blur 20px, border hairline (assinatura Linear). Hamburger < 1000px (overlay full).
- Skip-nav antes do header.

## hero (big_type sobre vídeo — mantém g_hero_fall.mp4 + poster macro)
- Eyebrow: "CHAPECÓ/SC · AÇO PARA CONSTRUÇÃO · DESDE 2018"
- H1 (mantida — é a promessa validada dos anúncios): "Cronograma em dia. Sem dor de cabeça."
- Sub: corte, dobra e ferragens armadas no dia em que a obra pede — peça a peça identificada, preço travado.
- CTAs: "Solicitar orçamento" (sólido, .wa data-ctx=hero) + "Ver como funciona" (ghost, âncora).
- Scrim vertical p/ legibilidade; respiro topo clamp(72px,12vh,140px).

## trust_bar (stat — prova imediata pós-hero, regra 8 do block-catalog)
- 4 números (contadores existentes): 11%→0 perda SINAPI · 1.200 t/mês · 18–25% menos horas de armador · 98% das entregas de 2026 no prazo.
- Moldura 1px hard-edge sobre surface (Nucor).

## manifesto / precisão (vídeo da armadura g_cage_spin.mp4 em painel)
- Padrão Linear de ênfase: intro muted com spans em branco.
- Conteúdo SINAPI 11% (fonte citada) + klist de especificação (CA-50/CA-60, norma, rastreabilidade por corrida).

## catalog / produtos (abas mantidas — evento produto_tab preservado + troca de fundo)
- Aba 01 Aço cortado e dobrado (p_corte_dobra_dark.png) / Aba 02 Aço armado (p_armado_dark.png).
- Copy e listas de ganho existentes, sem mudança de promessa.

## pillars / por que a Exact (tabela numerada 01-05, Off Brand + hover Linear)
- 5 compromissos existentes, texto SEMPRE visível (sem colapso por hover — mobile).
- Fundo sede_corner_dark.png com véu navy.

## story / preço e previsibilidade (g_bobinas_dark.png)
- Copy existente (INCC/FGV citado) + klist entrega futura.

## trust / obra recorrente
- Rail marquee de clientes (drag + setas + loop, existente) sobre sede_side_dark.png.

## faq
- 5 perguntas existentes (details/summary).

## process + cta_final (form)
- Esquerda: "Envie seu projeto." + botão WhatsApp (49) 3199-3164 (.wa data-ctx=final) + 4 passos numerados.
- Direita: formulário idêntico em campos e fluxo (POST /api/lead → painel de confirmação → WhatsApp pós-form).

## footer
- Tagline + 3 colunas (marca/contato/endereço) + legal. WhatsApp footer (.wa data-ctx=footer).

## float
- Botão flutuante WhatsApp (pill, .wa data-ctx=float) — única exceção de radius.

## Motion
- Reveals IntersectionObserver 1.2s quart-out + safety-net 1.2s (quality bar #8/13).
- Botões: 7 propriedades a 0.16s ease_default. Contadores nos stats. Marquee no rail.
- REMOVIDO do v8: scroll-snap "slides", compactação 100svh por seção, hero-shine, parallax data-plx (restraint Linear + regra de motion sickness).
- prefers-reduced-motion respeitado (reveals instantâneos, vídeos pausados, marquee estático).
