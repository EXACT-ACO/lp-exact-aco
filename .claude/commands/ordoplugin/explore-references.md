# Explore References

Browse the 12-site corpus without committing to a full landing-page generation. Use this when the user wants to study the references first, or pick a specific reference manually.

## Step 1 — Load

Read `.claude/ordoplugin.config.json` for `corpus_path`. Read [`.claude/ordoplugin-docs/reference-corpus.md`](.claude/ordoplugin-docs/reference-corpus.md) for the catalog.

## Step 2 — Filter

Ask the user via AskUserQuestion how they want to browse:

1. **By niche** — they describe their use case, you suggest 2-3 references
2. **By aesthetic** — they pick a palette family (dark+accent / cream+charcoal / image-led / cool serif)
3. **Show all 12** — list them with thumbnails

## Step 3 — Show

For each reference being shown, use the Read tool on:
- `<corpus_path>/raw/<slug>/live-capture/screenshots/desktop-fullpage-1440.png` — so you can SEE the design
- `<corpus_path>/raw/<slug>/live-capture/style-fingerprint.json` — for the palette/typography summary

Present each as a compact bullet:

```
**<slug>** — <category>
  Palette: <kind> (<hex bg> + <hex ink> + <hex accent>)
  Typography: <display> / <body>
  Tone: <copy_tone>
  Page height: <px> · Sections: <count>
  Best for: <niches it covers>
  Notable patterns:
    - <feature 1>
    - <feature 2>
```

## Step 4 — Action

Ask the user what they want next:

1. **Generate a landing using this reference** → chain into `/ordoplugin:create-landing` with the chosen slug pre-filled
2. **See another** → loop back to Step 3
3. **Just browsing** → end the skill, provide a link to the corpus folder for manual exploration
