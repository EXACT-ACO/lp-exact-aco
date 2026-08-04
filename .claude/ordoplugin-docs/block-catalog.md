# Block Catalog — 14 reusable section types

Every landing page is a sequence of blocks. Pick the ones that fit the niche; skip the rest. Order matters — they must read narratively top-to-bottom.

## 1. nav

Sticky top bar.

**Required**: logo (text or SVG), 3-5 links, primary CTA.
**Optional**: secondary CTA (e.g. login link), language switcher.

**Style notes**: 18-22px logo (display font), 12-14px tracked uppercase links, primary CTA visually dominant.

```html
<nav class="nav">
  <a class="nav__logo" href="#top">{brand}</a>
  <ul class="nav__links">{links}</ul>
  <a class="btn btn--accent" href="{cta.href}">{cta.label}</a>
</nav>
```

## 2. hero

Top-of-page statement. Pick ONE of three variants:

- **`big_type`** — large display headline + subhead + CTAs (Lando, Linear, Off Brand). Use this 70% of the time.
- **`video`** — autoplay muted loop covering hero (Aman, Bottega, Apa). Use for atmosphere-led brands (luxury, hospitality, restaurants).
- **`widget`** — embedded interactive element (Barry's location finder, Rosalía Laylo tour dates). Use when the primary action needs immediate input.

**Required**: headline.
**Optional**: eyebrow (tiny tracked uppercase line), subhead, primary CTA, secondary CTA, media (image or video URL).

**Style notes**: headline = display font, font-size `clamp(40px, 8vw, h1_token)`, max-width 16ch, line-height 1.04, negative letter-spacing. Subhead = body font 17-20px, color muted, max-width 56ch.

## 3. manifesto

A short philosophical statement. ONE sentence headline, optional one-paragraph body.

Use for: bold positioning ("Cada detalhe é intencional", "It doesn't matter where you start, it's how you progress").

```
[headline — max 22ch]
[body — max 60ch, muted color]
```

## 4. trust_bar

Social proof. Three sub-types:

- **`logos`** — array of `{name}` logos (8-12 logos, marquee or grid).
- **`stat`** — array of `{value, label}` (3-4 big numbers: "+5,400 clients" / "4.9★ Google" / "12 awards").
- **`press_quote`** — array of `{outlet, quote}` (Apa-style press wall).

Wrapped in a surface (slightly different bg from page).

## 5. pillars

The "what we offer / what we believe" 3-4-card grid. Each card:

- `label` — tiny tracked uppercase eyebrow ("CRAFT", "CARE", "SPEED")
- `title` — h3-sized headline
- `body` — 1-3 sentence muted paragraph

Use for: service businesses, SaaS feature differentiation. NOT for restaurants/hospitality.

## 6. story

Long-form editorial section. Multi-paragraph body.

Use for: brands that have a real story (Noma's "What is happening at noma?", Aman's destination narratives, Onyx's coffee origin write-ups).

```
[eyebrow — optional]
[headline]
[paragraph 1]
[paragraph 2]
[paragraph 3]
```

Single-column, max-width 64ch, generous line-height (1.6).

## 7. catalog

Product/service grid. Each item:

- `name`
- `subtitle` (optional)
- `price` (optional)
- `image_alt` (placeholder slot)
- `href`

Use for: e-commerce, restaurants with menu items, service menus. NOT for SaaS/personal brand.

## 8. process

Numbered steps. Each step:

- `n` — step number (typically 1, 2, 3)
- `title` — short
- `body` — 1-2 sentences

Use for: service businesses with a clear flow (consultation → execution → care). Apa's "Schedule → Transform → Experience" is canonical. NOT for e-com.

## 9. testimonials

Customer quotes. Each:

- `quote`
- `author`
- `role` (optional)

Layout: grid (2-3) or carousel. NEVER mix testimonials with founder_quote in the same section.

## 10. founder_quote

A quote from the brand's founder/expert/practitioner. Long-form (2-3 sentences). Different visual treatment than testimonials — usually inverted (light text on dark bg) to feel weighty.

Use for: service businesses where the practitioner IS the brand (Apa, restaurants with named chefs, boutique studios).

## 11. gallery

Image grid. Two sub-types:

- **`portfolio`** — work showcase (creator brands, agencies, photographers)
- **`before_after`** — transformation pairs (cosmetic dentistry, fitness, design)

Each item: `alt`, optional `caption`. Real photo placeholders only — never AI/Pexels.

## 12. locations

Multi-location service businesses. Each:

- `city` (uppercase tracked)
- `address` (multi-line, white-space pre-line)
- `phone` (tel: link)

Use for: clinics, hotels, gym chains, restaurants with multiple branches. Skip if single-location or digital-only.

## 13. cta_final

Closing call to action. Centered, high-impact.

- `headline` — large display
- `subhead` (optional)
- `cta_primary`, `cta_secondary`

Style: `clamp(48px, 8vw, 96px)` headline, full-width centered.

## 14. footer

Multi-column links + tagline + social + legal.

- `tagline` (optional, big display tagline at top of footer)
- `columns` — array of `{title, links}` (2-4 columns)
- `social` — array of `{platform, href}`
- `legal` — copyright + reserved rights string

---

## Block sequence rules

1. **Always start with `nav`** (unless explicitly headless).
2. **Always end with `footer`**.
3. **Always include `hero` as second block**.
4. **Always include `cta_final` second-to-last**.
5. Between hero and cta_final, pick 4-9 blocks based on niche family (see `create-landing.md` Step 4 table).
6. Don't duplicate block types unless intentional (e.g. two `pillars` blocks at different scales).
7. Don't put `testimonials` and `founder_quote` adjacent — they compete.
8. `trust_bar` works well right after `hero` (immediate proof) OR right before `cta_final` (final push).

## Forbidden combinations

- `gallery: portfolio` + `catalog` in same page → looks confused. Pick one.
- 3+ CTAs in `hero` → pick max 2.
- `testimonials` with fewer than 2 items → looks lonely; either get more or skip.
- `locations` for digital-only product → wrong signal.
