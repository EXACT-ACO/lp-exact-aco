# Marketing landing — Exact Aço

Redesign do miolo visual gerado pelo pipeline **ordoplugin** (parisgroup-ai/ordoplugin, skill bundle local) a partir das referências: **linear** (primária) + **offbrand** (secundária), com calibração industrial por capturas próprias de **nucor** e **gerdau** (setor aço, ausente no corpus consumer/luxo).

## Files

- `index.html` — a página (HTML puro, servida por `server.js`)
- `marketing/_brief.md` — brief da marca + fatos permitidos na copy
- `marketing/_tokens.json` — design tokens (herança documentada em `_meta`)
- `marketing/_plan.md` — plano de blocos + racional
- `marketing/_validation.md` — relatório de validação (score 14/14)
- `marketing/screenshots/` — desktop/mobile da nova + desktop da atual (main)

## Inegociáveis preservados (LP é destino fixo de anúncio pago)

- Formulário + `POST /api/lead` (proxy CRM) intactos, mesmos campos
- GTM-TNFKRW99 (head+noscript), gtag AW-18345228340, Meta Pixel 1489433913199448
- `track()`: cta_whatsapp, form_submit, scroll_50, scroll_90, produto_tab, lead_ok/lead_fail
- `server.js`/`Dockerfile`/deploy Railway intocados
- Copy: mesmos fatos e promessas da v8 (nada comercial novo)

## Reference inheritance

- **linear**: escala tipográfica com tracking −0.022em, pesos 510/590, botões com transição de 7 propriedades a 0.16s, micro-stack de sombra, seções assimétricas 96/128px, z-layers, header blur 20px + hairline
- **offbrand**: display uppercase em escala grande, hierarquia por tamanho, tabela numerada 01–05, reveal 1.2s quart-out
- **nucor/gerdau** (industrial): hard-edge radius 0, traço de accent nos eyebrows, molduras 1px, navy como tom âncora do aço BR (#2c2858 da marca)

## Customizing

- Rodar `/ordoplugin:refine-section <bloco>` para iterar um bloco isolado
- Tokens: editar `marketing/_tokens.json` e refletir no `<style>` do `index.html`
- O corpus (symlink `.claude/ordoplugin-corpus`) é local — recriar com clone de parisgroup-ai/ordoplugin se necessário
