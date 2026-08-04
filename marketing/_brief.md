# Brief — Exact Aço (LP de captação, lp.exactaco.com.br)

> Gerado no pipeline ordoplugin (redesign do miolo visual da LP existente).
> Restrições inegociáveis: formulário + POST /api/lead intactos; tracking completo
> (GTM-TNFKRW99, gtag AW-18345228340, Meta Pixel 1489433913199448, helper track()
> com cta_whatsapp / form_submit / scroll_50 / scroll_90); server Express e deploy
> intocados; nenhuma promessa comercial nova (preço, prazo, garantia).

## Nicho / categoria

Indústria de aço para construção civil — **corte e dobra de vergalhão (CA-50/CA-60)
e ferragens armadas** sob projeto. B2B: construtoras, incorporadoras e obras
industriais/infraestrutura. Base em Chapecó/SC, atende Oeste catarinense, litoral
de SC, PR e RS.

## Marca

- **Nome**: Exact Aço (Comercial Exact Aço Ltda, desde 2018)
- **Tom âncora da marca**: navy **#2c2858** (logo e propostas comerciais)
- **Tipografia da marca (já na LP)**: Mont (300/400/600/700) corpo + Space Grotesk display
- **Logo**: assets/img/logo_branco_c.png (branco, para fundos escuros)

## Tagline / promessa (existente — manter substância)

"Cronograma em dia. Sem dor de cabeça." — aço cortado, dobrado e armado entregue
no dia em que a obra pede, com preço travado e perda zero no canteiro.

## CTA primário

- **"Solicitar orçamento"** → WhatsApp (49) 3199-3164 (todos os .wa com data-ctx)
- Formulário de orçamento (nome, empresa, telefone, email, cidade, obra, mensagem)
  → POST /api/lead (proxy CRM) + fallback WhatsApp

## Rota alvo

`/` → `index.html` (página única, servida pelo server.js Express)

## Vibe

Industrial B2B de engenharia: técnico, sóbrio, premium — "techy" com pacing
editorial. Dark + accent (arquétipo A), calibrado para o setor de aço
(referências industriais capturadas: ver `_plan.md`).

## Paleta preferida

Dark + accent, com o **navy #2c2858 como tom âncora** (superfícies e véus),
mantendo textos "bone" claros e um único accent frio (azul-gelo da LP atual).

## Conteúdo factual disponível (não inventar além disto)

- SINAPI assume 11% de perda de aço no corte em canteiro (comp. 92803/92762)
- Capacidade produtiva 1.200 t/mês; prazo máximo 5 dias úteis; 98% das entregas
  de 2026 no prazo; 18–25% menos horas de armador
- CA-50 Ø 6,3–40 mm; CA-60 Ø 4,2–5,0 mm; NBR 7480; rastreabilidade por corrida
- Entrega futura: preço travado no fechamento, recebimento conforme cronograma
- Clientes: Santa Maria, Nostra Casa, Alumbra, Dall, ABC, Nestlé, Adami, Stara,
  Legacy, Rodovia 282, Elevado da Bandeira, +300 obras
- Endereço: Av. Leopoldo Sander, 2011-E, Cristo Rei, Chapecó/SC · CNPJ 48.809.852/0001-50
- Contato: WhatsApp/tel (49) 3199-3164 · contato@exactaco.com.br · @exact_aco
