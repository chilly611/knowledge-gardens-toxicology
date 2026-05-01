# Midjourney prompt set — TKG icon system
**For Chilly to generate, then drop into `/public/icons/`.**

The site currently renders these as inline SVGs (clean monoline placeholders) so it ships *now*. When you have time, run these prompts in Midjourney and replace the SVG files. The component code reads from `/public/icons/{slug}.png` and falls back to the inline SVG if the asset is missing — so you can swap one at a time.

## Constraints we want every icon to share (for the "brothers and sisters" feel)
- Square 1:1, transparent or off-white background (parchment `#f5f0e8`)
- Single-line monoline drawing in **deep slate-blue `#3B4F6B`** (the Toxicology accent)
- A **second copper-deep `#8a5524` accent stroke** for callouts / annotations
- Style: Victorian botanical herbarium meets engineering blueprint (the umbrella style)
- Negative space dominant — icon ~60% of the canvas
- Hand-drawn ink feel, 1.5–2px stroke weight, no fill
- A few faint dotted-line "annotation marks" with tiny letters (a, b, c) around the icon — like an engineering plate
- No text labels in the icon itself — the label sits beside it in the UI

## Master suffix to append to every prompt
```
--style raw --ar 1:1 --stylize 50 --quality 2
```

(Adjust `--stylize` 0–250 to taste. Lower = more literal, higher = more interpretation. 50 is a good starting point for engineering-blueprint icons.)

---

## The seven stages (in order)

### 01 · identify
A magnifying glass crossed with a fingerprint pattern, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper annotation marks, faint dotted callout lines with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, generous white space, --style raw --ar 1:1 --stylize 50 --quality 2

### 02 · assess
A balance scale with a small flask on one side and a chemical hex ring on the other, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper annotation marks, faint dotted callout lines with tiny letter labels a/b/c, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, generous white space, --style raw --ar 1:1 --stylize 50 --quality 2

### 03 · plan
A drafting compass laid over a folded blueprint, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper annotation marks and a small triangle ruler in copper, faint dotted callout lines with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, generous white space, --style raw --ar 1:1 --stylize 50 --quality 2

### 04 · act
A small mason hammer striking an anvil, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper sparks rendered as tiny dotted radial lines, faint annotation marks with letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### 05 · adapt
A circular arrow forming a closed loop with a small dial gauge in the center, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper tick marks at quarters, faint dotted callout lines with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### 06 · resolve
A sealed wax-stamped folder being slid into a drawer, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper wax seal as a small circle with a botanical sprig, faint dotted annotation marks with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### 07 · reflect
An open ledger book with a small magnifying glass resting on a page, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper ribbon bookmark, faint dotted callout lines with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

---

## UI controls (top-frame)

### `pro: off` / `pro: on` — toggle
A small horizontal slide toggle drawn in engineering-blueprint style, deep slate-blue ink on parchment, copper indicator dot, faint dotted dimension line above with the letters "PRO" in tiny serif type, Victorian instrument label aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Search
A magnifying glass with a small caduceus emblem reflected in the lens, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper hairline reticle inside the lens, faint dotted callout lines with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

---

## Audience emblems (used in Loom + AudienceInvitations cards)

### Consumer
A simple human silhouette holding up a glass of water to the light, hand-drawn engineering-blueprint style, deep teal ink on parchment, faint dotted callout lines with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Clinician
A stethoscope laid over a small bound case-history journal, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper annotation marks with tiny letter labels, Victorian medical instrument plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Counsel
A stack of legal exhibit folders bound with a copper ribbon and a quill resting beside them, hand-drawn engineering-blueprint style, deep crimson-deep ink on parchment, faint dotted annotation marks with tiny letter labels, Victorian legal specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Hygienist
A 4-gas detector held in a gloved hand, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper dial markings, faint dotted callout lines with tiny letter labels, Victorian instrument plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Inspector
A clipboard with a stamp poised above it, hand-drawn engineering-blueprint style, deep slate-blue ink on parchment, copper seal silhouette in the corner, faint dotted callout lines with tiny letter labels, Victorian regulatory plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

---

## Garden emblem set (cross-garden link cards)

### TKG (caduceus) — already exists
You already have `chillyprojects_Medical_emblem_logo_elegant_caduceus_redesigned__a9ee...png` in workspace. That's the current emblem. No regeneration needed.

### HKG (Health Knowledge Garden)
A red caduceus with a single drop of blood at the base of the rod, hand-drawn engineering-blueprint style, deep crimson ink on parchment, faint dotted annotation marks with tiny letter labels, Victorian medical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### NatureMark
A single oak leaf with delicate veining and a small wax-sealed identification tag attached by a copper string, hand-drawn engineering-blueprint style, deep gold ink on parchment, faint dotted annotation marks with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Builder's Knowledge Garden (BKG)
A copper hammer crossed with a folded set of architectural plans, hand-drawn engineering-blueprint style, deep copper ink on parchment, faint dotted annotation marks with tiny letter labels, Victorian construction specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

### Orchid Knowledge Garden (OKG)
A single Cattleya orchid bloom with a copper specimen-pin label dangling from the stem, hand-drawn engineering-blueprint style, deep teal ink on parchment, faint dotted annotation marks with tiny letter labels, Victorian botanical specimen plate aesthetic, single 1.5px stroke weight, monoline, no fill, --style raw --ar 1:1 --stylize 50 --quality 2

---

## How to drop them in
1. Generate each prompt in Midjourney. Pick the variation you like best, upscale.
2. Save as PNG (transparent if possible) into `/public/icons/{slug}.png`. Naming convention:
   - Stages: `stage-identify.png`, `stage-assess.png`, ..., `stage-reflect.png`
   - Top-frame: `ui-pro-toggle.png`, `ui-search.png`
   - Audiences: `audience-consumer.png`, `audience-clinician.png`, `audience-counsel.png`, `audience-hygienist.png`, `audience-inspector.png`
   - Gardens: `garden-tkg.png`, `garden-hkg.png`, `garden-naturemark.png`, `garden-bkg.png`, `garden-okg.png`
3. The `<StageIcon id="identify" />` component will pick up `/icons/stage-identify.png` automatically. Until then it renders the inline SVG fallback.

## Pre-flight tip
If a prompt comes back too literal or too fantasy, dial `--stylize` up (try 250) for more artistic interpretation, or down (try 0) for stricter literal rendering. For consistency across the set, pick a stylize value that works for one icon and use it for all of them.
