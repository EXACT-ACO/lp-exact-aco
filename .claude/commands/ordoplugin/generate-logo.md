# Generate Logo

Gere um conjunto de **logos SVG** para uma marca a partir de um brief. Output: 3 conceitos vetoriais distintos (mark + wordmark + lockup vertical/horizontal), escaláveis, prontos para produção, salvos em `marketing/logos/`.

This skill is invoked:
- **Standalone**: `/ordoplugin:generate-logo` — gathers brief, generates 3 logo concepts, user picks one.
- **From `/ordoplugin:create-landing`** Step 3: after design tokens are derived, automatically invoke this to generate a brand mark before writing the page. The picked logo is then used in nav + footer + hero badge.

---

## Step 0 — Load context

1. Read `.claude/ordoplugin.config.json` for `corpus_path` and `output_target`.
2. If `marketing/_brief.md` exists, read it (re-use the brief from `/ordoplugin:create-landing`). Otherwise gather a tight brief via AskUserQuestion:
   - **Brand name** (required)
   - **Niche / category** (e.g. "barbearia premium", "SaaS de CRM", "café especialidade")
   - **Tone descriptors** — pick 1-3: minimalist · editorial · technical · organic · geometric · brutalist · playful · monumental · serif-classical · sans-modern · pixel-grid · handwritten
   - **Reference brand or visual mood** (free text — e.g. "tipo Linear, mas mais quente" / "como Onyx Coffee mas sem o serif")
3. Read [`.claude/ordoplugin-docs/quality-bar.md`](.claude/ordoplugin-docs/quality-bar.md) — the bar applies to logos too.

## Step 1 — Match a logo archetype to the niche

Choose ONE archetype as the primary direction (the LLM can blend two for cross-pollination):

| Archetype | When to use | Visual signature | Reference (corpus) |
|---|---|---|---|
| **Geometric monogram** | tech, SaaS, modern services, single-letter brands | Single letter inscribed in circle/triangle/hex; sharp vertices; mathematical proportions | Linear (square mark + Inter wordmark) |
| **Cursive wordmark** | beauty, salon, fashion, premium services | Hand-drawn-feel script; one unbroken stroke; sometimes underline-finial | Apa (cursive `apa` over uppercase `AESTHETIC`) |
| **Stencil/uppercase wordmark** | luxury, fragrance, fashion-bold | All-caps tracked uppercase; minimal kerning interventions; sometimes split letters | Byredo, Bottega Veneta |
| **Editorial serif wordmark** | restaurant, hospitality, fine dining | Display serif (Lyon/Reckless/Cormorant feel); negative tracking; lowercase often | Noma (`noma` lowercase serif), Aman |
| **Pixel/dot-matrix mark** | tech-hardware, dev tool, retro-future | LED/dot grid letterforms; geometric primitives; mono | Nothing (Ndot) |
| **Manifesto-strong mono** | studio, agency, architecture | Heavy single weight; tight tracking; sometimes plus-sign or asterisk decoration | Off Brand (`OFF+BRAND.`), Linear |
| **Athletic monogram** | personal brand, athlete, creator | Initials integrated into geometric form; bold weight; often with accent color shape | Lando Norris (LN inside helmet silhouette) |
| **System serif anti-design** | music drop, art, ceremonial | System Times in radical letterspacing; colons/punctuation as graphic elements | Rosalía LUX (`:ROSALÍA:LUX:`) |
| **Manifest-condensed** | fitness, energy, action | Condensed display sans (Antenna/Bebas-style); uppercase; strong color accent | Barry's Bootcamp (`BARRY'S` red) |
| **Editorial-organic** | craft brands, coffee, ceramics, slow goods | Hand-feel serif or warm sans; lowercase often; single accent color (cream/brass) | Onyx (Bajern serif `Onyx`) |

For each match, sketch in your head: what's the SHAPE first (mark), what's the WORDMARK (typography), how do they LOCKUP together (mark + wordmark side-by-side OR mark above wordmark).

## Step 2 — Generate 3 distinct concepts

Generate **3 concepts** that explore different directions within or across archetypes. Each concept:

- Should be SVG (vector), not raster
- Use ONLY 2 colors max (1 primary + optionally 1 accent that fits brand palette)
- Work at 24px (favicon) AND 240px (display)
- Have a clear FOCAL POINT (don't overdesign)
- Have a SUBTRACTABLE quality — if you remove anything, it gets worse, not better

For each concept, produce:

### Concept N — `<descriptor name>`

**Name** (one-word descriptor): e.g. "Aperture", "Compass", "Threshold", "Knot"

**Rationale** (one line): why this direction fits the brand

**Mark** (the symbol alone) — 80x80 SVG viewBox, transparent bg

```svg
<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brand mark">
  <!-- markup here -->
</svg>
```

**Wordmark** (text only) — auto-sized SVG, baseline-aligned

```svg
<svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Brand wordmark">
  <!-- text element with the brand name in chosen typeface -->
</svg>
```

**Lockup horizontal** (mark + wordmark side-by-side):

```svg
<svg viewBox="0 0 480 80" xmlns="http://www.w3.org/2000/svg">...</svg>
```

**Lockup vertical** (mark above wordmark):

```svg
<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg">...</svg>
```

**Tokens used**:
```yaml
primary_color: "#xxxxxx"
accent_color: "#xxxxxx (optional)"
typeface: "Inter | Fraunces | Cormorant | Bebas Neue | Times | <other>"
weight: 400-900
letter_spacing: "<value>em"
```

### Logo construction guidelines (apply per concept)

- **Mark geometry**: build from circles/triangles/squares/lines — never freehand. Document the construction grid (e.g. "3 concentric circles, 30°/60°/90° rotations, golden ratio gap").
- **Wordmark tracking**: typically -0.04 to -0.08em for compressed (Linear), 0 to 0.02em for editorial (Aman), +0.05 to +0.15em for tracked uppercase (Byredo/Aman eyebrow).
- **Optical alignment**: round shapes need slight overshoot above/below the cap-height baseline (e.g. `cy="40.8"` not `cy="40"` for an O at 80px height).
- **Single color discipline**: If you can't render the logo in single color and have it still feel "right", add another concept option.
- **Stroke vs fill**: prefer `fill` over `stroke` for the mark unless the brand voice is delicate/thin (Apa cursive). Stroke widths should be tied to mark size: `stroke-width="2"` at 80px = 1.5px at 60px = 3px at 120px (think proportional).
- **No gradients in mark** unless the brand explicitly allows. Solid colors render better at all sizes and in monochrome.
- **Wordmark spacing matters**: include `letter-spacing` attribute on `<text>`. Use `font-feature-settings="'cv01','ss01'"` if Inter Variable to access stylistic alternates.

## Step 3 — Save outputs

Write the 3 concepts to disk:

```
marketing/logos/
├── concept-1-aperture/
│   ├── mark.svg
│   ├── wordmark.svg
│   ├── lockup-h.svg          (horizontal)
│   ├── lockup-v.svg          (vertical)
│   ├── favicon.svg           (16-32px optimized)
│   └── tokens.yaml
├── concept-2-compass/
│   └── ... (same structure)
├── concept-3-threshold/
│   └── ... (same structure)
└── README.md                  (rationale + comparison table)
```

The `README.md` should:
- Show all 3 marks side-by-side as embedded SVG
- Compare each concept's archetype, mood, primary color
- Recommend a default (the LLM's pick) and explain why

## Step 4 — Apply (if invoked from create-landing)

If this skill was invoked by `/ordoplugin:create-landing` (i.e. before the page is written):

1. Ask the user via AskUserQuestion which concept to use (offer 3 + "let me iterate" + "skip — placeholder geometric mark"). Show inline previews.
2. Replace the placeholder geometric mark in the nav + footer with the picked SVG.
3. Update `_tokens.json` with `brand.logo` references pointing to the chosen files.
4. Continue back into the create-landing flow.

If standalone:
1. Just write the 3 concepts to `marketing/logos/`.
2. Tell the user where to find them.
3. Suggest copy-paste integration: `<img src="marketing/logos/concept-1-aperture/lockup-h.svg" alt="...">`.

## Step 5 — Quality bar checklist

Before claiming done, verify each concept:

- [ ] Renders correctly at 16px, 32px, 80px, 240px (zoom in/out mentally)
- [ ] Single primary color version still works (test by graying out accent)
- [ ] Mark doesn't rely on subtle 1-pixel details that disappear at small sizes
- [ ] Wordmark spacing reads naturally (no jarring gaps or crowding)
- [ ] Lockups have appropriate breathing room between mark and wordmark (rule of thumb: gap = 25-50% of mark width)
- [ ] No clipping issues at SVG boundaries (add 4-8px padding inside viewBox)
- [ ] Has a `<title>` element inside SVG for screen readers
- [ ] Mark works on light AND dark backgrounds (or the README explicitly notes "dark only" / "light only")

## Examples — opening moves per archetype

When generating concepts, here are good starting moves:

### Geometric monogram (Linear-style)
```svg
<!-- A square with the brand initial cut out, accent triangle slot -->
<svg viewBox="0 0 80 80">
  <rect x="8" y="8" width="64" height="64" rx="14" fill="#5e6ad2"/>
  <path d="M 22 56 L 34 28 L 46 56 L 22 56 Z" fill="white"/>
</svg>
```

### Editorial serif lowercase wordmark (Noma-style)
```svg
<svg viewBox="0 0 200 80">
  <text x="100" y="58" text-anchor="middle"
        font-family="Cormorant Garamond, serif"
        font-size="72" font-weight="500"
        letter-spacing="-0.04em" fill="#22283a">noma</text>
</svg>
```

### Pixel/dot-matrix (Nothing-style)
Render each letter as a 5x7 grid of circles, each circle 6px radius, gap 2px.

### Cursive script (Apa-style)
Use a connected single-stroke `<path>` with `stroke="black"` `fill="none"` `stroke-width="3.5"` `stroke-linecap="round"` traced from a script font's outline.

### Off Brand-style with `+` decoration
```svg
<svg viewBox="0 0 480 100">
  <text x="0" y="72" font-family="Inter, sans-serif" font-size="64" font-weight="800"
        letter-spacing="-0.04em" fill="#e5e4e0">OFF</text>
  <text x="180" y="72" font-family="Inter, sans-serif" font-size="64" font-weight="800"
        letter-spacing="-0.04em" fill="#ff642f">+</text>
  <text x="220" y="72" font-family="Inter, sans-serif" font-size="64" font-weight="800"
        letter-spacing="-0.04em" fill="#e5e4e0">BRAND</text>
  <text x="425" y="72" font-family="Inter, sans-serif" font-size="64" font-weight="800"
        fill="#e5e4e0">.</text>
</svg>
```

## Don't

- Don't use bitmap/photo-trace logos. Vector only.
- Don't use 4+ colors.
- Don't add tagline INSIDE the logo lockup (taglines live in the page, not the mark).
- Don't use shadow/glow on the mark — keep it flat. Glow effects come from the page treatment, not the asset.
- Don't generate a logo without offering at least 3 conceptually distinct alternatives.
- Don't blend more than 2 archetypes.
