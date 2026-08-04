# Create Landing Page

You are helping the user create a marketing landing page for their project at the level of award-tier sites (landonorris.com, byredo.com, linear.app, aman.com). This is the entrypoint skill — orchestrate the full flow end-to-end.

> **The corpus** — 12 reference sites with screenshots, computed-style fingerprints, and pattern analysis — lives at `<plugin-corpus>/raw/` and `<plugin-corpus>/analysis/`. The path is in `.claude/ordoplugin.config.json`. Read it before doing anything.

> **Quality bar**: read [`.claude/ordoplugin-docs/quality-bar.md`](.claude/ordoplugin-docs/quality-bar.md) before generating any code. This is non-negotiable — if a section doesn't meet it, redo it.

---

## Step 0 — Load context

1. Read `.claude/ordoplugin.config.json` to find `corpus_path` and `output_target`.
2. Read `<corpus_path>/analysis/00-pattern-synthesis.md` end-to-end. This is the cross-cutting bible.
3. Read [`.claude/ordoplugin-docs/reference-corpus.md`](.claude/ordoplugin-docs/reference-corpus.md) (niche → reference mapping).
4. Read [`.claude/ordoplugin-docs/block-catalog.md`](.claude/ordoplugin-docs/block-catalog.md) (14 block types you can use).
5. Auto-detect the consumer project's framework by reading `package.json`:
   - Next.js (`next` dep) → emit `app/(marketing)/<route>/page.tsx` + Tailwind classes
   - Astro (`astro` dep) → emit `src/pages/<route>.astro`
   - Vite + React (`vite` + `react`) → emit `src/pages/<route>.tsx`
   - SvelteKit (`@sveltejs/kit`) → emit `src/routes/<route>/+page.svelte`
   - Plain HTML / unknown → emit `marketing/<route>.html`
   Tell the user what you detected. If wrong, ask.

## Step 1 — Brand brief

Use the **AskUserQuestion** tool to gather the brief, **one question per call** unless explicitly batching related ones. Ask in the user's language (default pt-BR if their last message was Portuguese, else en).

Required answers:

- **Niche / category** — free text (e.g. "barbearia premium", "SaaS de CRM B2B", "cafeteria de especialidade", "clínica de estética")
- **Brand name**
- **Tagline / 1-line promise** (optional — you can suggest 3 if they don't have one yet, then let them pick)
- **Primary CTA** (e.g. "Agendar", "Começar grátis", "Comprar", "Reservar")
- **Target page route** (e.g. `/`, `/landing`, `/precos`)
- **Optional inputs** (ask in one batched AskUserQuestion call):
  - **Vibe** — luxe / energetic / calm / techy / editorial / radical
  - **Palette preference** — dark+accent / cream+charcoal / image-led black-white / cool serif (or "let the reference decide")
  - **Brand colors** — if they have hex codes already (else inherit from matched reference)
  - **Locations** — if it's a service business with physical presence

After you have the brief, write it to `marketing/_brief.md` (within the consumer project) so subsequent runs of any skill can re-read it.

## Step 2 — Match reference + load DEEP design system

Apply the niche-to-reference mapping from [`.claude/ordoplugin-docs/reference-corpus.md`](.claude/ordoplugin-docs/reference-corpus.md). Pick:

1. **Primary reference** — closest niche match
2. **Secondary reference** — for cross-pollination (typically a different palette family, same tone)

### Load order — READ ALL THREE per reference

For the **primary** reference, Read in this order:

1. **`<corpus_path>/raw/<primary-slug>/design-system/raw-extract.json`** — THIS IS YOUR PRIMARY SOURCE. Contains:
   - Complete CSS variables grouped by category (color, typography, spacing, radius, shadow, easing, font, layer)
   - Canonical computed styles (body, h1, h2_more, h3_more, btn_primary, btn_ghost, section, nav, footer)
   - Spacing/gap/radius/shadow/transition top frequency lists
   - Font size/weight/line-height/letter-spacing distributions
   - Color usage (text, bg, border) frequency
   - z-index distribution
   - hover_pattern + keyframes_names
   - design_system_signature (human-distilled summary of the philosophy)
2. **`<corpus_path>/raw/<primary-slug>/live-capture/style-fingerprint.json`** — older summary file. Use only as backup if raw-extract is missing.
3. **`<corpus_path>/raw/<primary-slug>/live-capture/screenshots/desktop-fullpage-1440.png`** — Read as IMAGE to see the design. If file missing locally (slim npm install), use https://github.com/parisgroup-ai/ordoplugin/tree/main/references/raw/<primary-slug>/live-capture/screenshots

Do the same for **secondary** reference.

### Reference summary to show the user

```
→ Primary: <slug> — <category>
  Why: <one-line reason — palette match / niche match / tone match>
  Design system: <css_vars_total> tokens · <key signature like "9 named title sizes" or "single typeface flex" or "2px universal letter-spacing">
  Screenshot: <corpus_path>/raw/<slug>/live-capture/screenshots/desktop-fullpage-1440.png

→ Secondary: <slug> (cross-pollination for <one specific pattern they're borrowing>)
```

**Ask once** with AskUserQuestion: "Vai com essas referências, ou quer trocar?" Offer 2-3 alternative primary candidates.

## Step 3 — Design tokens (DEEP inheritance — copy EXACT values)

This is the step where most landings fall short. Don't paraphrase. Don't approximate. **Copy the exact values from the primary's `raw-extract.json`** so the new brand inherits its full design language, not just a vibe.

Output as `marketing/_tokens.json` in the consumer project:

```json
{
  "_meta": {
    "primary_reference": "<slug>",
    "secondary_reference": "<slug>",
    "design_system_inheritance": "<one paragraph: which exact tokens were inherited and which were brand-overridden>"
  },
  "color": {
    "ink": "<EXACT hex from raw-extract canonical_elements.body.color>",
    "bg": "<EXACT from canonical_elements.body.background-color>",
    "bg_marketing": "<if reference has bg-marketing var that differs from bg, use that for marketing pages>",
    "surface": "<from css_vars bg-level-2 / surface-2 / panel — slightly elevated bg>",
    "surface_2": "<even more elevated — bg-level-3 if exists>",
    "accent": "<reference's signature accent — Linear=indigo #5e6ad2, Lando=lime #d2ff00, Off Brand=orange #ff642f, Barry's=red #d6001a, Onyx=brass #89704a, Apa=cyan-blue #a2d1dc, etc. If brand has its own accent, swap here BUT keep the same RELATIONSHIP (high-contrast vs bg).>",
    "muted": "<text-tertiary or text-quaternary from reference>",
    "muted_2": "<even more muted>",
    "border": "<border-primary from reference>",
    "border_translucent": "<border-translucent if exists, else rgba(255,255,255,0.05) for dark or rgba(0,0,0,0.05) for light>"
  },
  "type": {
    "display": "<Google Font equivalent — see mapping table below>",
    "body": "<Google Font equivalent>",
    "mono": "<optional, if reference uses one>"
  },
  "scale": {
    "h1_px": "<from canonical h1 font-size — Linear=64, Off Brand=102, Onyx hero=68, Aman=31, Apa=28, Lando=97 (Brier)>",
    "h2_px": "<from canonical h2 — Linear=48, Off Brand=76, Aman=31, Apa=24, etc>",
    "h3_px": "<from canonical h3>",
    "eyebrow_px": "<small uppercase label size — typically 10-12px>",
    "body_px": "<from canonical body — Linear=16, Aman=14, Noma=18, Apa=18>",
    "body_lg_px": "<larger body variant if exists>"
  },
  "tracking": {
    "display_em": "<from letter_spacing_by_size at the h1/h2 size — Linear=-0.022 on huge, Aman=0.016 on serif display, Apa=0.071>",
    "h2_em": "<usually same as display>",
    "body_em": "<from canonical body letter-spacing — Linear=-0.011, Aman=0.057, Byredo=0.025>",
    "eyebrow_em": "<positive tracking on uppercase eyebrow — typically 0.1 to 0.2em>"
  },
  "line_height": {
    "display_ratio": "<h1 line-height divided by font-size — Linear h1 64/64=1.0, Aman h2 31/45=1.45, Lando Brier 97/79=0.81>",
    "h2_ratio": "<>",
    "body_ratio": "<body line-height divided by font-size — Linear=1.5, Aman=1.45, Apa=1.4>"
  },
  "weight": {
    "regular": "<usually 400, but Linear uses 510, Apa uses 400 universal>",
    "medium": "<Linear=510, Bottega=700, default=500>",
    "semibold": "<Linear=590, Onyx=600, default=600>",
    "bold": "<Linear=680, default=700>",
    "comment": "Use NON-STANDARD weights when the reference does (Linear's 510/590 trick with Inter Variable, Lando's 800 for impact text). Otherwise default to 400/600/700."
  },
  "radius": {
    "small_px": "<from raw-extract css_vars radius scale or radius_top frequency — Linear=4-8, Apa/Aman/Bottega/Noma=0, Nothing=8 cards / 9999 buttons>",
    "med_px": "<>",
    "large_px": "<>",
    "pill_px": "<9999 if reference uses pills (Linear, Nothing, Barry's, Lando 7.2px slight). 0 if hard-edge luxury (Aman, Apa, Noma, Bottega).>"
  },
  "shadow": {
    "low": "<copy reference's shadow-low EXACTLY if exists. Linear=0px 2px 4px rgba(0,0,0,0.1). If reference has none, omit.>",
    "medium": "<>",
    "high": "<>",
    "stack_low_inset_micro": "<Linear's 5-layer micro-stack used on buttons — copy exactly if matching tier>"
  },
  "motion": {
    "duration_quick": "<reference's --speed-quickTransition or fastest hover — Linear=0.1s, Apa=0.1s, Aman=0.1s for shadow>",
    "duration_standard": "<dominant transition duration — Linear=0.16s, Byredo=0.3s, Aman=0.4s, Lando=0.75s>",
    "duration_slow": "<for atmospheric reveals — Onyx=1.7s, Lando=0.75s baseline, Off Brand=1.2s>",
    "ease_default": "<dominant cubic-bezier — Linear='cubic-bezier(0.25,0.46,0.45,0.94)', Lando='cubic-bezier(0.65,0.05,0,1)', Material='cubic-bezier(0.4,0,0.2,1)'>",
    "ease_emphasis": "<used on key reveal — Off Brand uses cubic-bezier(0.165,0.84,0.44,1) quart-out>"
  },
  "container": {
    "max_px": "<reference's --max-width or homepage-max-width — Linear=1024 (page), 1436 (homepage); Lando=1920; Aman=1920>",
    "prose_max_px": "<for long-form text columns — Linear=624, default=640>",
    "gutter_px": "<page-padding-inline — Linear=24, Lando=20, Apa=20>"
  },
  "section_padding": {
    "py_top_px": "<from section_paddings observation — Linear top=96, Apa top=20-40, Aman top varies>",
    "py_bottom_px": "<Linear bottom=128 (asymmetric!), Apa bottom=40, etc>",
    "asymmetric": "<true if reference uses different top/bottom (Linear), else false>"
  },
  "z_layers": {
    "footer": 50,
    "scrollbar": 75,
    "header": 100,
    "overlay": 500,
    "popover": 600,
    "dialog": 700,
    "toast": 800,
    "tooltip": 1100,
    "max": 10000,
    "comment": "Inherit Linear's z-layer system unless reference has its own (most don't have a complete layer system)"
  },
  "font_features": "<from reference body font-feature-settings — Linear=\\\"cv01\\\", \\\"ss03\\\", default=normal>"
}
```

### Font mapping (reference's typeface → free Google Font equivalent)

When the reference uses a proprietary typeface, map to the closest free Google Font:

| Reference typeface | Google Font alternative | Why |
|---|---|---|
| `Inter Variable` (Linear) | `Inter` (variable, weights 100-900) | Same family, free version |
| `Mona Sans Variable` (Lando) | `Inter` (variable) | Mona Sans is similar geometric sans |
| `Brier` display (Lando) | `Bebas Neue` or `Anton` | Condensed display |
| `Reckless / Reckless-Neue / Lyon Display / Lyon Text` (Noma, Aman) | `Cormorant Garamond` or `Playfair Display` | Editorial serif with similar negative tracking response |
| `Bajern` (Onyx) | `Playfair Display` | Display serif with ornate detail |
| `Room-205` (Onyx — uppercase tracked) | `Bebas Neue` | Condensed uppercase |
| `Antenna` (Barry's) + `Benton Sans Pro` (Barry's body) | `Bebas Neue` + `Inter` | Condensed display + neutral body |
| `byredoSans` + `byredoStencil` (Byredo) | `Inter` + `Italiana` | Body sans + stencil display feel |
| `bottegaveneta-regular-webfont` (Bottega) | `Inter` | Unbranded restrained sans |
| `Ndot-Regular` (Nothing dot-matrix) | `VT323` or `Major Mono Display` | Pixel/mono dot-matrix feel |
| `NType82` (Nothing body) | `Inter` weight 100-400 | Geometric thin sans |
| `LatteraMonoLL` (Nothing UI mono) | `JetBrains Mono` or `IBM Plex Mono` | UI monospace |
| `Times / Times New Roman` (Rosalía) | Use `Times New Roman` literally (system font — that's the point) | Anti-design statement |
| `Ataero Retina OB Edition` (Off Brand) | `Inter` weight 700-800 + tight tracking | Heavy geometric |
| `D-DIN` (Apa display) | `DM Sans` or `Inter` | Engineered uppercase sans |
| `brandon-grotesque` (Apa body) | `Inter` or `DM Sans` | Soft humanist sans |
| `Roobert` (Noma alt) | `Inter` | Geometric sans |
| `Berkeley Mono` (Linear mono) | `JetBrains Mono` | Engineering mono |

If the user provided brand colors, override `ink/bg/accent` with those, but **keep the relationships** the reference established:
- If reference is dark+accent, ensure new accent contrasts the dark bg (>4.5:1)
- If reference is cream+charcoal, keep warm bg even if user wants slightly different cream
- If reference is image-led black/white, keep the chrome restrained — don't suddenly add a brand purple if Bottega uses none

## Step 4 — Plan blocks

Pick a block sequence from [`.claude/ordoplugin-docs/block-catalog.md`](.claude/ordoplugin-docs/block-catalog.md) appropriate to the niche. Use this default sequencing:

| Niche family | Block sequence (omit any irrelevant ones) |
|---|---|
| Service business (barbershop, dental, salon, fitness) | nav · hero · manifesto · pillars · process · trust_bar · testimonials · founder_quote · locations · cta_final · footer |
| E-commerce (coffee, fragrance, apparel) | nav · hero · manifesto · trust_bar · story · catalog · process · founder_quote · cta_final · footer |
| SaaS / digital product | nav · hero · trust_bar · pillars · story · process · testimonials · cta_final · footer |
| Personal brand / creator | nav · hero · gallery · story · pillars · cta_final · footer |
| Luxury hospitality | nav · hero · manifesto · gallery · story · catalog · cta_final · footer |
| Studio / agency | nav · hero · manifesto · catalog · trust_bar · cta_final · footer |

For each block, draft a **content outline** in `marketing/_plan.md`:

```markdown
## hero
- Eyebrow: "DESDE 2018"
- Headline (2 alternatives — pick one):
  1. "Cortes de autor para quem trata cabelo como obra"
  2. "O ofício do corte. Levado a sério desde 2018."
- Subhead: <2 lines>
- Primary CTA: "Agendar"
- Secondary CTA: "Conhecer o estúdio"
- Media: <type — describe what photo / video / nothing>

## manifesto
- Headline: "..."
- Body: <one paragraph, the philosophical anchor>

(... and so on for every block)
```

**Headline tone families** (pick ONE family per page based on primary reference's `copy_tone`):

- **manifesto** (Lando, Onyx, Off Brand, Barry's) — declarative, "we redefine X", verb-rich
- **philosophical** (Apa) — "It's not about X; it's about Y" structure
- **feature_spec** (Nothing, Linear) — feature → benefit, terse
- **editorial** (Aman, Noma, Byredo, Bottega) — atmospheric, sentence case, poetic
- **functional** (Linear) — direct capability statement
- **wordmark_split** (Rosalía) — letter-by-letter typography, system serif, ceremonial

After drafting, **ask the user** to review the plan with AskUserQuestion: "Plano OK ou ajustar headlines/blocos?"

## Step 5 — Write the page

Now generate the actual code in the consumer project's framework.

### Core rules (all non-negotiable)

1. **Token fidelity** — every color, font-size, font-family, letter-spacing, line-height, radius, shadow, transition value comes from `_tokens.json`. Never hardcode a value that isn't in tokens. If you need a new value, ADD IT TO _tokens.json first, then reference it.

2. **Apply the reference's full motion system, not just `transition: all`** — the reference's `motion.ease_default` cubic-bezier MUST appear in your CSS. The reference's `duration_standard` MUST be the dominant timing. If the reference uses Linear's 0.16s + 7-property simultaneous transition, replicate that on buttons. If Onyx's 1.7s slow reveal, use that on scroll-reveal elements. The motion is half the brand.

3. **Apply non-standard weight values when the reference uses them** — Linear uses 510 (not 500) and 590 (not 600) via Inter Variable. If you're inheriting Linear, use those exact weights, not nearest standard. Lando uses 800 for impact text. Apply.

4. **Preserve the reference's letter-spacing system** —
   - If the reference tracks body POSITIVELY (Aman 0.057em, Byredo 0.025em), do that.
   - If display uses NEGATIVE tracking (Linear -0.022em, Lando -0.036em), do that.
   - If H1=H2=H3 share the SAME tracking (Apa 2px universal), do that.
   - If the reference uses extreme tracking on buttons (Rosalía 10.92px), respect or omit but never gently average.

5. **Apply the section padding tier exactly** — Linear's 96px top + 128px bottom (asymmetric) is signature. Most others are symmetric 80-160px range. Use the reference's exact values.

6. **Apply the reference's hover_pattern explicitly** — read the `hover_pattern` array from raw-extract:
   - Linear: 0.16s on 7 props (border, bg, color, box-shadow, opacity, filter, transform)
   - Lando: hover triggers `transform: scale(1.1)` + `clip-path: ellipse(...)` — copy the clip-path approach
   - Aman: subtle 6%-black bg darkening, 0.4s duration
   - Apa: cyan accent #a2d1dc replaces text color on hover
   - Off Brand: card bg swaps from main-light to main-dark in dark mode
   - Onyx: scale 1.1 on menu, peach accent on big-link
   Add at least 3 :hover rules at this fidelity.

7. **Inherit reference's z-index system** — use the layered values from the design system rather than ad-hoc 1/2/100.

8. **Respect the reference's radius philosophy** —
   - HARD EDGE 0px (Aman, Apa, Noma, Bottega, Onyx) → never add radius creeping.
   - PILL 9999px (Linear, Nothing, Barry's) → consistent across all buttons.
   - SLIGHT 2-7px (Rosalía 3px, Lando 7.2px) → subtle softness, no full pills.

9. **Apply font-feature-settings if reference uses them** — Linear uses `"cv01", "ss03"` on EVERY element. If you inherit Linear, set this on body and inherit.

10. **Self-contained page** — the page must work without imports from other parts of the consumer project. Embedded `<style>` with CSS variables generated from `_tokens.json`.

11. **No external CSS frameworks unless the consumer project uses them** — if Tailwind, use utility classes derived from tokens via `@theme` (Tailwind 4) or `tailwind.config.ts`. If plain CSS, embed `<style>` with CSS variables.

12. **Image placeholders** — for any image slot, use a `<div>` with `aspect-ratio` + tokenized background, and include a clear `alt` or comment with TODO for the real photo. NEVER use Pexels, Unsplash, or AI-generated images. Real photos are the conversion lever.

13. **Smooth scroll + reveal-on-scroll with safety net** — IntersectionObserver-based fade-in. ALWAYS include the 1.2s safety-net timeout that force-reveals all elements (so screenshots/SSR work even if observer doesn't fire). Use the reference's `motion.duration_slow` for the reveal duration if defined.

14. **Accessibility** — semantic HTML5 (header/main/section/footer), proper heading hierarchy, alt text on all images, `aria-label` on icon buttons, `prefers-reduced-motion` respect.

15. **Responsive** — desktop-first design at 1440px, mobile at 390px. Use `clamp()` for fluid sizing on hero typography. The reference's hero h1 size is the upper bound; clamp down to ~40-48px for mobile.

16. **NO emojis in copy** unless the user explicitly asks for them. (Pedro's standing rule.)

17. **Portuguese accents must be correct** if the page is in pt-BR (não / é / ção / etc.).

### After writing, run a sanity pass

- Type-check if the framework supports it (`npx tsc --noEmit` or framework equivalent — read CLAUDE.md/AGENTS.md if the project has a preferred command)
- Open the page in the browser via the project's dev server (read package.json scripts)
- Compare the generated CSS variables against `_tokens.json` — they must match exactly, no drift

## Step 6 — Visual validation (chain into `/ordoplugin:validate-page`)

After the page is written, **invoke the validation skill** to verify UI quality:

```
Read the contents of [`.claude/commands/ordoplugin/validate-page.md`](.claude/commands/ordoplugin/validate-page.md) and execute its flow now.
```

The validation skill will:
1. Auto-start the dev server (or reuse if running)
2. Open the page in chrome-devtools (or playwright) MCP
3. Take desktop (1440x900) + mobile (390x844) fullpage screenshots
4. Read screenshots back AS IMAGES so you (Claude) literally SEE the page
5. Run a 9-section quality checklist (visual integrity, typography, color/palette, spacing/layout, imagery, motion, accessibility, copy/brand voice, quality-bar final pass)
6. Generate `marketing/_validation.md` report with verdict (🟢/🟡/🔴) and findings
7. Optionally chain into `/ordoplugin:refine-section` for any 🔴 critical items

If validation MCP unavailable, the skill will tell you what to install. **Don't skip validation** — pages that don't pass visual review are not done.

## Step 7 — Hand-off

Write `marketing/README.md` with:

```markdown
# Marketing landing — <brand>

Generated by ordoplugin from reference: **<primary-slug>** (+ secondary: **<secondary-slug>**).

## Files

- `app/.../page.tsx` (or wherever the page was emitted)
- `marketing/_brief.md` — original brand brief
- `marketing/_tokens.json` — design tokens
- `marketing/_plan.md` — block plan + copy outline

## Customizing

- **Replace placeholders**: <list image / video / quote slots>
- **Re-run review**: `/ordoplugin:refine-section <block-name>` to iterate on any block
- **Update tokens**: edit `marketing/_tokens.json` and re-run `/ordoplugin:create-landing` (it'll detect existing files and offer to refresh in place)

## Reference inheritance

The page inherits palette/typography from the **<primary-slug>** archetype. Major patterns borrowed:
- <pattern 1>
- <pattern 2>
- <pattern 3>
```

End with a tight summary to the user (3-5 lines): what was generated, where it lives, what to do next (replace placeholders, run dev server).

---

## Re-run behavior

If `marketing/_brief.md` already exists, read it first. Then ask the user: "Existe brief anterior — refresh com mesmo brief, ajustar brief, ou refazer do zero?"

If only some placeholders need updates, prefer `/ordoplugin:refine-section` instead of running the full skill.
