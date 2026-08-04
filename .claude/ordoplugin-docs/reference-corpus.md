# Reference Corpus — niche → reference mapping

The corpus lives at `<corpus_path>/raw/<slug>/`. Each folder contains:
- **`design-system/raw-extract.json` — DEEP token extract (PRIMARY SOURCE — read this first)**
- `live-capture/style-fingerprint.json` — older surface summary (backup only)
- `live-capture/screenshots/desktop-fullpage-1440.png` — full desktop screenshot
- `live-capture/screenshots/mobile-fullpage-390.png` — full mobile screenshot
- (Lando only) `webarchive-extracted/` — full HTML+CSS+JS+fonts+images of the site

## The 12 references

| Slug | Category | Palette | Type | Tone | Best match for |
|---|---|---|---|---|---|
| `lando-norris` | athlete personal brand | dark+accent (lime on dark green) | variable sans | manifesto | Athletes, creators, personal brands, esports, F1, DJ, public figure |
| `byredo` | luxury fragrance | image-led (black/white, photo-first) | proprietary | editorial | Beauty luxury, fragrance, premium cosmetics, candles, skincare |
| `bottega-veneta` | luxury fashion | image-led | proprietary | editorial | Fashion luxury, leather goods, designer apparel, luxury accessories |
| `noma` | fine dining | cool serif (deep blue ink on cream) | editorial serif | editorial | Restaurants, chefs, tasting menus, wine bars, Michelin-tier |
| `onyx-coffee-lab` | specialty coffee | cream+charcoal (warm cream + brass) | editorial serif | manifesto | Coffee roaster, tea, chocolate craft, craft beverages, roastery |
| `barrys-bootcamp` | fitness chain | dark+accent (red on black) | manifest condensed | manifesto | Gym, fitness studio, yoga, pilates, HIIT, crossfit, dance, spin |
| `linear` | SaaS / dev tool | dark+accent (indigo on near-black) | variable sans | functional | SaaS, developer tools, AI products, fintech, B2B software, agent platforms |
| `rosalia-lux` | music artist drop | image-led (system serif radical) | system radical | wordmark split | Album drops, single releases, concert tours, campaign microsites |
| `nothing` | tech hardware | image-led (mono/pixel) | proprietary (Ndot) | feature spec | Consumer electronics, hardware brands, audio products, smart devices |
| `offbrand` | creative studio | dark+accent (orange on near-black) | manifest condensed | manifesto | Agency, design studio, creative studio, branding agency, production house |
| `aman` | luxury hospitality | cream+charcoal (warm cream + charcoal) | editorial serif | editorial | Hotels, resorts, spa-wellness, destination travel, retreats, villa rental |
| `apa-aesthetic` | boutique clinic | cream+charcoal | manifest condensed | philosophical | Cosmetic dentistry, dermatology, aesthetics clinics, plastic surgery, IV therapy |

## Niche keywords / aliases (Portuguese-friendly)

When matching the user's niche text, normalize these aliases:

```
barbearia, barbershop                 → personal-brand / boutique-clinic / creative-studio
salao, salon-beleza                   → beauty-luxury / fashion-luxury / boutique-clinic
estetica, clinica-estetica            → aesthetics-clinic / boutique-clinic / beauty-luxury
personal-trainer                      → personal-brand / fitness-studio / athlete
yoga, pilates, academia               → fitness-studio
cafeteria, cafe-especialidade         → specialty-coffee
restaurante, fine-dining, bistro      → restaurant-fine-dining
hotel, pousada, boutique-hotel        → hotel-luxury
dentista, clinica-odonto              → cosmetic-dentistry
dermatologia                          → dermatology
saas, startup, app, produto-digital   → saas / saas_product
loja-virtual, ecom, ecommerce         → fragrance / fashion-luxury / specialty-coffee (depends on what they sell)
joalheria                             → fashion-luxury
fotografia, agencia, estudio          → creative-studio
artista, musico, banda                → album-drop / music-artist
influencer, criador                   → personal-brand
crm, b2b-saas, plataforma             → saas
consultoria                           → creative-studio (positioning) or saas (if productized)
```

## Matching algorithm

1. Normalize the user's niche string to lowercase, strip accents (`á→a`).
2. Look up in the alias table; if matched, get the candidate categories.
3. Score each reference: +10 if its `category` exactly matches a candidate; +5 if a keyword overlaps; +8 if user's `palette_preference` matches the reference's `palette_kind`.
4. Pick top score as **primary**.
5. Pick second-highest, but **prefer one with a different `palette_kind`** for cross-pollination, as **secondary**.
6. If the user supplied `vibe`, use this override map:
   - `luxe` → prefer `cream_charcoal` or `image_led` palettes
   - `energetic` → prefer `dark_accent`
   - `calm` → prefer `cream_charcoal` or `cool_serif`
   - `techy` → prefer `dark_accent` (variable sans)
   - `editorial` → prefer `cool_serif` or `cream_charcoal`
   - `radical` → prefer `image_led` (system_radical type)

## How to load a reference (DEEP — read in this order)

```
1. PRIMARY (deep extract — your source of truth):
   ${corpus_path}/raw/${slug}/design-system/raw-extract.json
2. SECONDARY (older summary — backup only):
   ${corpus_path}/raw/${slug}/live-capture/style-fingerprint.json
3. VISUAL (Read as image to SEE the design):
   ${corpus_path}/raw/${slug}/live-capture/screenshots/desktop-fullpage-1440.png
   ${corpus_path}/raw/${slug}/live-capture/screenshots/mobile-fullpage-390.png
```

### What's in `design-system/raw-extract.json`

Each reference's deep extract contains (varying depth — Linear has the most, Bottega the least):

- **css_vars_total** — total number of CSS custom properties at `:root`
- **css_vars_by_category** — grouped vars: color, bg, border, text, font, size, space, radius, shadow, duration, easing, layer (z-index), other
- **canonical_elements** — exact computed styles of body, h1, h2 (multiple variants), h3, h4, p, a, btn_primary, btn_ghost, section_first, nav, footer
- **spacing_top** — top frequency padding/margin values across the page (with counts)
- **gap_top** — flex/grid gap frequencies
- **radius_top** — border-radius frequencies
- **shadow_top** — box-shadow frequencies (rare/empty for flat sites)
- **transition_top** — transition declarations (with cubic-bezier signatures)
- **font_size_top / font_weight_top / line_height_top / letter_spacing_top** — distributions with counts
- **font_family_top** — typeface usage frequency
- **lh_by_fs / ls_by_fs** — line-height-by-font-size and letter-spacing-by-font-size pairs
- **color_text_top / color_bg_top** — color frequency in text and bg context
- **z_index_top** — non-zero z-indexes used
- **hover_pattern** — actual `:hover` CSS rules captured
- **focus_rules** — :focus / :focus-visible rules
- **keyframes_names** — declared @keyframes
- **loaded_fonts** — fonts that actually rendered
- **design_system_signature** — destilled human-readable summary (color philosophy, type system, motion, hover signature, differentiator from neighbors)

### Reference depth (how much token system each has)

| Slug | css_vars | What's notable |
|---|---|---|
| `linear` | 561 | 9 named title sizes, 18 easings, 4 shadows + micro-stack, 9 surfaces, 17 z-layers — **deepest** |
| `barrys-bootcamp` | 199 | 21-step type scale, 13-step spacing, 9-step radius, semantic surfaces |
| `noma` | 138 | Reckless serif scale, 14-col grid, fluid clamp() sizes |
| `byredo` | 137 | Tailwind base + universal 0.025em letter-spacing |
| `nothing` | 66 | --cell-size 113px grid + HSL accents |
| `apa-aesthetic` | 62 | WP defaults + universal 2px headline tracking |
| `lando-norris` | 61 | Webflow + single 0.75s motion default |
| `offbrand` | 26 | Single typeface + 3D perspective |
| `aman` | 19 | Sparse — Drupal inline styles |
| `onyx-coffee-lab` | 17 | clamp h1-huge, Bajern + Room-205 + Montserrat |
| `rosalia-lux` | 6 | RADICAL minimalism (Times serif + 2 golds) |
| `bottega-veneta` | 3 | Almost nothing — Salesforce inline styles |

When inheriting: copy EXACT values from raw-extract — non-standard weights, exact cubic-beziers, asymmetric padding, font-feature-settings, micro-shadow stacks. Don't paraphrase.

## Pattern synthesis

Read `<corpus_path>/analysis/00-pattern-synthesis.md` for cross-cutting patterns (color archetypes, typography archetypes, block sequences per niche family, copy tone families). It's the design-system distillation across all 12 references.
