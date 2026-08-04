# Validate Page

Open the generated landing page in a real browser, capture screenshots desktop + mobile, and validate the UI is **perfect** before signing off. This skill is the visual gate — pass it or send the page back to `/ordoplugin:refine-section`.

> **Filosofia**: não comparamos pixel-a-pixel com a referência. Validamos se a página está IMPECÁVEL por si só — copy correto, layout firme, sem broken states, motion fluido, mobile sem horizontal scroll, sem placeholders sobrando.

> **Pré-requisito**: você precisa de UMA das ferramentas de browser MCP. Em ordem de preferência:
> 1. `chrome-devtools` MCP (já usado pra capturar referências) — `mcp__chrome-devtools__navigate_page`, `take_screenshot`, etc.
> 2. `playwright` MCP — `mcp__playwright__browser_navigate`, `browser_take_screenshot`.
> 3. Manual fallback: `open http://localhost:3000` + Pedro reporta findings.
>
> Se nenhum estiver disponível, output the EXACT block:
>
> ```
> Pra validar visualmente preciso de uma MCP de browser. Roda um destes:
>
>   claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
>
> ou
>
>   claude mcp add playwright npx @playwright/mcp@latest
>
> Reinicia a sessão e roda /ordoplugin:validate-page de novo.
> ```

---

## Step 0 — Load context

1. Read `.claude/ordoplugin.config.json` to get `output_target`, `package_manager`, `framework`.
2. Read `marketing/_brief.md`, `marketing/_tokens.json`, `marketing/_plan.md` (so you know what was supposed to be on the page).
3. Read `marketing/README.md` if it exists (matched reference info).

## Step 1 — Start the dev server (if not running)

Auto-start. Don't ask the user to do it.

```bash
# Detect framework + package manager and start in background
case "$framework" in
  next|astro|sveltekit|nuxt|remix|vite-react|vite-vue|vite)
    npm run dev &  # OR pnpm dev / yarn dev based on config.package_manager
    ;;
  plain-html)
    # Use python -m http.server 3000 OR npx serve marketing/
    ;;
esac
```

Wait until `curl -sf http://localhost:3000 > /dev/null` returns 200. Try ports `3000`, `3001`, `5173`, `4321` (default for next/vite/astro). Use the one that works.

If dev server already running on a port, detect via `lsof -i :3000` etc. and reuse.

If user typed a custom URL (e.g. `--url http://localhost:8080`), use that.

## Step 2 — Capture screenshots

Use chrome-devtools MCP (preferred — same tool used to extract references):

```ts
// Desktop 1440x900
mcp__chrome-devtools__new_page({ url: 'http://localhost:3000' });
mcp__chrome-devtools__resize_page({ width: 1440, height: 900 });
// wait for hero text to appear
mcp__chrome-devtools__wait_for({ text: ['<brand_name>'], timeout: 15000 });
// dismiss any cookie banner if present (try common patterns):
//   click first .accept | #accept-cookies | [aria-label*="Accept"]
// capture
mcp__chrome-devtools__take_screenshot({
  filePath: '<absolute_path>/marketing/screenshots/desktop-fullpage-1440.png',
  fullPage: true,
});

// Mobile 390x844
mcp__chrome-devtools__resize_page({ width: 390, height: 844 });
mcp__chrome-devtools__take_screenshot({
  filePath: '<absolute_path>/marketing/screenshots/mobile-fullpage-390.png',
  fullPage: true,
});
```

If chrome-devtools MCP sandbox restricts the path, save to `/tmp/<brand>-desktop.png` and `cp` to `marketing/screenshots/`.

If using playwright MCP instead: substitute equivalent calls (`mcp__playwright__browser_navigate`, `browser_resize`, `browser_take_screenshot` with `fullPage: true`).

## Step 3 — Read screenshots back AS IMAGES

Use the Read tool on the saved PNG files. Both Read and the chrome-devtools screenshot tool return images that you (Claude) can SEE. Look at them with multimodal vision and run the checklist below.

This is critical: you will literally **see** the page. Don't skip looking — text description is no substitute.

## Step 4 — Quality checklist (run for desktop + mobile)

Read `.claude/ordoplugin-docs/quality-bar.md` and apply the self-review checklist verbatim. In addition, do the following multimodal checks:

### A. Visual integrity (eyeball the screenshot)

- [ ] **Header / nav** is visible at the top and not obstructing content
- [ ] **Hero headline** is readable, not clipped, not overflowing the viewport
- [ ] **Product mock / hero media** is rendered (not a blank box / not a broken-image placeholder)
- [ ] **Every section** declared in `_plan.md` is visually present (count them)
- [ ] **Footer** is at the bottom, not floating mid-page
- [ ] **No content is invisible** (e.g. ink color matches bg color → text disappears)
- [ ] **No overlapping elements** (text under buttons, images stacked wrong)
- [ ] **No "FOUC"** flash of unstyled content artifacts visible
- [ ] **No huge gaps** (content suddenly stops then resumes 800px later — usually a broken section)
- [ ] **Reveal animations completed** (nothing stuck at opacity 0)

### B. Typography

- [ ] **Custom display font loaded** (not falling back to system serif/sans — would look generic)
- [ ] **Hero h1 hierarchy clear** (visibly larger than body)
- [ ] **No text overflow** (words breaking weirdly mid-letter, no `[...] ` truncation in places that shouldn't have it)
- [ ] **Eyebrows readable** (small uppercase tracked labels visible at intended size)
- [ ] **No emojis** in copy (unless explicitly in brief)
- [ ] **Portuguese accents correct** if pt-BR (`não`, `é`, `ção`, `é`, `ô`, etc.)
- [ ] **No "Lorem ipsum"** / `placeholder` / `tbd` / `xxx` / `TODO` literal strings visible

### C. Color / palette

- [ ] **Page palette matches `_tokens.json`** — bg, ink, accent visible at expected places
- [ ] **No bright primaries** that don't appear in tokens (purple where coral expected, blue where amber expected — drift)
- [ ] **Accent appears max 2-3 times** on the page (primary CTA + 1-2 highlights — not splattered)
- [ ] **Buttons are visible** against background (sufficient contrast)
- [ ] **Hover states exist** (test by hovering one button — color/border should shift)

### D. Spacing / layout

- [ ] **Section padding generous** (not cramped) — at least 80px top/bottom on most sections
- [ ] **Hero has dramatic vertical breathing room** (>20% viewport height of empty space above headline)
- [ ] **No element touching viewport edges** without intentional full-bleed treatment
- [ ] **Mobile (390px viewport)**: NO horizontal scroll. If there is, find the offending element and report.
- [ ] **Mobile**: nav collapsed appropriately (links hidden in hamburger or stacked)
- [ ] **Mobile**: hero headline fits (clamp() probably)
- [ ] **Cards in grids stack at mobile** (not 4-col squished)

### E. Imagery

- [ ] **Real photos OR clean placeholder slots** (NOT obviously stock — Pexels/Unsplash watermarks)
- [ ] **Image aspect ratios stable** (no jumping during scroll)
- [ ] **All images have `alt` attribute** (inspect DOM if unsure)
- [ ] **No broken image icons** (404 placeholder URLs)

### F. Motion (Test by scrolling)

- [ ] **Smooth scroll active** (Lenis or native — page glides, not janky)
- [ ] **Scroll-triggered reveals fire** (sections fade up as you reach them; nothing stuck at 0 opacity)
- [ ] **Transitions on hover are smooth** (~160ms typical, not abrupt)
- [ ] **No motion sickness** (no excessive parallax, no rotating elements at high speed)
- [ ] **`prefers-reduced-motion` respected** if testable

### G. Accessibility

- [ ] **Tab order matches visual order** (test by pressing Tab; should follow nav → hero CTAs → page → footer)
- [ ] **Focus rings visible** when tabbing to buttons/links
- [ ] **Skip nav exists** (visible only on Tab from page top)
- [ ] **Min tap size 44px** on all primary CTAs
- [ ] **Heading hierarchy** (one h1, then h2s for sections, then h3s for subsections — no skips)

### H. Copy / brand voice

- [ ] **Tone matches brief** (manifesto / philosophical / functional / editorial / etc.)
- [ ] **No generic AI phrases**: "Welcome to", "We are X", "Transform your business", "Take it to the next level", "Empowering X"
- [ ] **CTAs use brand-flavored verbs** ("Agendar avaliação", "Reservar", "Começar grátis" — not just "Get started")
- [ ] **Stats/numbers feel realistic** (not "+1,000,000 clientes" if it's a small biz)
- [ ] **Testimonials have plausible names + roles** (not "John Doe / CEO at FakeCorp")
- [ ] **Press wall logos make sense for the niche** (don't put MIT Tech Review on a barbearia page)

### I. Quality bar — final pass

Run the full checklist from `.claude/ordoplugin-docs/quality-bar.md`. Any unchecked item from the "Self-review checklist before claiming done" section is a fail.

## Step 5 — Generate validation report

Write the findings to `marketing/_validation.md` (timestamp + checks + verdict + next steps):

```markdown
# Validation report — <YYYY-MM-DD HH:MM>

**Page**: `<output_target>`
**Brand**: <brand_name>
**Verdict**: 🟢 APROVADO / 🟡 ATENÇÃO / 🔴 REPROVADO

## Screenshots

- Desktop: `marketing/screenshots/desktop-fullpage-1440.png`
- Mobile: `marketing/screenshots/mobile-fullpage-390.png`

## Findings

### 🔴 Critical (must fix before ship)

- [ ] (e.g.) Hero h1 invisible — text color matches bg color. Inspect line 142 of `page.tsx`. Suggest setting `color: var(--ink)` explicitly.
- [ ] (e.g.) Mobile horizontal scroll caused by `.hero__mock` overflowing 100vw at 390px. Fix: add `max-width: 100%`.

### 🟡 Polish (nice to fix)

- [ ] (e.g.) Hero subhead has 67ch — slightly wider than ideal 56ch.
- [ ] (e.g.) Press wall section bottom padding feels tight.

### ✅ Passed

- 11 of 13 sections rendered as expected.
- Tokens applied correctly (palette + typography matching `_tokens.json`).
- Smooth scroll active (Lenis).
- 0 horizontal scroll on mobile.
- All images have alt text.
- Reveal animations firing.

## Suggested fixes

If 🔴 critical items present, run:

```
/ordoplugin:refine-section <block-name>
```

with prompts like "fix the hero h1 visibility — currently white-on-white" or "fix mobile horizontal scroll on hero mock".

## Sign-off

If 🟢, the page is ready for the user to populate placeholders (real photos, real testimonials, real address) and ship.
```

## Step 6 — Iterate (optional)

If 🔴 critical items found:

1. Ask user via AskUserQuestion: "Encontrei <N> problemas críticos. Quer que eu chame `/ordoplugin:refine-section` pra cada um, ou prefere ler o relatório primeiro?"
2. If user says "fix":
   - For each critical item, internally invoke the `/ordoplugin:refine-section` flow with a focused prompt: "Fix this specific issue: <description from validation>"
   - After each fix, re-screenshot the affected section only (use `clip` parameter on screenshot if MCP supports it, else fullPage)
3. After all fixes, re-run validation Step 4 selectively on the fixed sections.

## Step 7 — Sign-off message

End with a short summary to user (3-5 lines):

> 🟢 Validação OK. Página em `<output_target>` passou em <N> de <N> checks.
> Screenshots em `marketing/screenshots/`.
> Relatório completo em `marketing/_validation.md`.
> Próximo: substituir placeholders (fotos reais, depoimentos reais, endereço).
> Pra revalidar depois de mudanças, roda `/ordoplugin:validate-page` de novo.

OR

> 🔴 <N> problemas críticos encontrados em <areas>.
> Detalhes em `marketing/_validation.md`.
> Roda `/ordoplugin:refine-section <block>` pra cada item, ou aceita "fix all" e eu chamo refine pra cada um sequencialmente.

---

## Notes for the LLM

- **Lookout for chrome MCP sandbox path errors**: if "Access denied" on save path, fall back to `/tmp/<brand>-<viewport>.png` and `cp` after.
- **Don't skip the multimodal Read step**. The whole point is for YOU (Claude) to SEE the page. Without that, validation is empty.
- **The CSS class `.reveal:not(.is-visible)`** is a known false-positive — those elements appear hidden in screenshots if the IntersectionObserver hasn't fired. The `quality-bar.md` mandates a 1.2s safety net — confirm `_tokens.json` includes that.
- **Cookie banners** can obscure content in screenshots. Always try to dismiss before capture.
- **For dynamic content** (counters animating, marquees scrolling), you may capture mid-animation. Run a second screenshot 2s after the first to compare — if visibly different, the page is alive (good); if frozen at opacity 0, something broke.
