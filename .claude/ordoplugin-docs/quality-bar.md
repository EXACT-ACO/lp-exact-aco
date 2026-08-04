# Quality Bar — what "Lando-tier" means

> If a section doesn't meet this bar, you redo it. There is no "good enough" middle ground for marketing pages.

## The 12 references all share these traits

1. **Photography is real and original** — never Pexels, Unsplash, or AI-generated. Every image carries the brand's actual story. If the user has no real photos yet, leave clean placeholder slots with sized aspect ratios + a TODO comment in the code.

2. **Typography has at least one custom voice** — display font is intentional, body font supports it. The two fonts must contrast in voice (serif × sans, condensed × geometric, etc.). System Times New Roman is a flex (Rosalía) — only pick it on purpose.

3. **Palette is restrained** — 4 colors max. ink + bg + accent + muted/surface. No bright primaries that fight the reference. The accent is used SPARINGLY — usually only on the primary CTA and 1-2 highlights.

4. **Background is not pure white** — luxury sites use cream `#fafaf4 / #f3eee7 / #fbfaf3` or near-black `#08090a / #1d1d1d / #282c20`. Pure `#ffffff` is for tech-image-led brands like Byredo and Bottega where photos do the chromatic work.

5. **Tracking matters**:
   - Display headlines (big text): negative letter-spacing (`-0.02em` to `-0.04em`)
   - Eyebrow / tiny uppercase: positive tracking (`0.12em` to `0.18em`, sometimes `0.2em+`)
   - Body text: 0 to `0.01em`, but luxury sites add `0.02em` even at 14-18px

6. **Headlines hit at least one tonal anchor**:
   - Manifesto-declarative: "We don't X. We Y." | "Redefining X."
   - Philosophical: "It's not about X; it's about Y."
   - Editorial-poetic: "Summer's warm embrace." | "What is happening at X?"
   - Functional-direct: "The X for Y." (Linear pattern)
   - Feature-spec: "Cut out background noise with the new Super Mic." (Nothing pattern)

   Avoid generic AI phrases: "Welcome to X", "We are X", "Transform your business", "Your journey starts here", "Empowering X", "Take your X to the next level". If a phrase could appear on a generic Wix template, scrap it.

7. **Negative space is generous** — section padding is `clamp(64px, 10vw, 140px)` minimum. Hero has `clamp(72px, 12vh, 140px)` top padding minimum. Don't cram.

8. **Smooth scroll and reveal animations** — every reference has scroll-triggered fade-in/slide-up at minimum. Implement with IntersectionObserver + safety net (force-reveal after 1.2s in case observer doesn't fire — important for SSR/screenshots).

9. **Mobile is not an afterthought** — at 390px viewport: nav collapses to hamburger or hides links, hero `clamp()`s down to 40px headline, sections stay readable, no horizontal scroll. Test it.

10. **CTAs use brand-flavored verbs** — "Reserve" (Aman), "Schedule a consultation" (Apa), "Book your first class" (Barry's), "Discover" (Bottega), "Listen" (Rosalía). Avoid "Get started" / "Learn more" / "Sign up" unless the brand voice genuinely supports it.

11. **Footer carries weight** — multi-column dense navigation + locations (if applicable) + tagline + social. Footers are 200-400px tall on the references; don't shortchange them.

12. **No emojis in copy** unless the brand explicitly is emoji-heavy (rare). Pedro's standing rule.

13. **Portuguese accents are correct** if the page is in pt-BR. `não` not `nao`, `é` not `e`, `ção` not `cao`. No exceptions.

14. **No placeholders that ship** — every "Lorem ipsum" or "Logo here" placeholder must be replaced before declaring the page done. If a slot needs the user's real content (photo, testimonial, address), surface it explicitly in the hand-off README so they know what to fill in.

## Self-review checklist before claiming done

> **Static list ≠ visual proof.** After running through this checklist, ALWAYS chain into `/ordoplugin:validate-page` — that skill opens the rendered page in chrome-devtools, takes desktop+mobile screenshots, and reads them back AS IMAGES so Claude literally SEES the page. The list below is the contract; validate-page is the gate.

Run through this list. If any item fails, fix it.

- [ ] Page loads in browser without console errors
- [ ] Type-checks pass (if framework supports)
- [ ] Mobile (390px) layout has no horizontal scroll
- [ ] Desktop (1440px) hero has dramatic vertical breathing room (>20% viewport height of empty space above headline)
- [ ] Display font and body font are visibly different voices
- [ ] No more than 4 distinct colors in use (count manually if unsure)
- [ ] Accent color appears at most 3 times on the page
- [ ] Every image has alt text or aria-label
- [ ] No `console.log` or debug code left
- [ ] No `lorem ipsum`, `placeholder`, `tbd`, `xxx` literal strings in shipped copy
- [ ] No emojis (unless explicitly authorized)
- [ ] Portuguese accents correct (if applicable)
- [ ] Reveal-on-scroll works (with safety net)
- [ ] Primary CTA is visible above the fold
- [ ] Page has both desktop and mobile screenshot in `marketing/screenshots/` for regression reference

## Failure modes to avoid

- **AI-template look**: cards with rounded corners + drop shadows + emoji + pastel gradients = generic AI output. None of the 12 references look like this.
- **Bootstrap-era tropes**: hero with "left text + right image" 50/50 split, three perfectly equal feature cards with icons, oversized footer link grid. These read as 2018 SaaS templates.
- **Faux luxury**: black + gold serif on every section without restraint. Real luxury brands use restraint.
- **Stock photography**: any image that could appear on iStock has lost the brand. Better to ship a clean placeholder slot than a stock photo.
- **Fake testimonials**: don't invent customer names. Either use real ones the brand provides, or mark testimonials as `<placeholder for real testimonial>` in the code.
- **Two competing accent colors**: pick ONE. Lime + orange + indigo at the same time = not a brand, a swatch sample.
