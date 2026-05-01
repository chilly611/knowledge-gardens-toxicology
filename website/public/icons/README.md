# /public/icons — Midjourney drop folder

Drop your generated icon PNGs in here. The site auto-swaps to your art and falls
back to the inline SVG placeholder if the file is missing — so you can replace
icons one at a time, no rebuild required.

## Filenames the site expects

### Seven stages
- `stage-identify.png`
- `stage-assess.png`
- `stage-plan.png`
- `stage-act.png`
- `stage-adapt.png`
- `stage-resolve.png`
- `stage-reflect.png`

### Top-frame UI
- `ui-pro-toggle.png`
- `ui-search.png`

### Audience emblems
- `audience-consumer.png`
- `audience-clinician.png`
- `audience-counsel.png`
- `audience-hygienist.png`
- `audience-inspector.png`

### Garden emblems (cross-garden links)
- `garden-tkg.png`
- `garden-hkg.png`
- `garden-naturemark.png`
- `garden-bkg.png`
- `garden-okg.png`

## Format
- **Square 1:1**
- Transparent PNG preferred. If MJ doesn't give you transparent, plain PNG on
  the parchment `#f5f0e8` background is fine.
- Any resolution ≥ 256×256. They render at 16–52px in the UI but bigger source
  PNGs hold up better on retina displays.

## Generation prompts
See `/design-references/MIDJOURNEY_PROMPTS.md` — every icon has a tuned prompt
that locks the same style across the set.
