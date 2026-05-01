# /design-references — READ_FIRST
**Mandatory reading for every visual agent before writing or modifying any TKG surface.**

This folder holds the canonical visual references for the Toxicology Knowledge Garden. **Do not invent visuals from prose descriptions when these references exist.** The pattern is reusable across HKG, NatureMark, OKG, and all future Knowledge Gardens.

---

## Why this exists
Earlier in the sprint, every agent received text descriptions of "BKG killer-app pattern" and "orchid species-experience" and built from those descriptions alone. The result missed the actual visual identity. Reference fidelity was discarded in favor of feature breadth. This folder is the durable fix.

## The rule
**No visual surface is "done" until it has been compared, side-by-side, against the relevant reference here.** If you can't put the rendered surface and the reference next to each other and have them feel like the same product, the surface is not done.

---

## Asset inventory

### `caduceus.png` — the brand emblem (canonical)
> Located at `/public/emblem-caduceus.png` for runtime use. Original upload preserved by Chilly.

A hand-drawn engineering-blueprint-style caduceus:
- Two **intertwined serpents**:
  - One is deep oceanic **teal-blue**, sinuous, with smooth scaly fluid loops
  - One is golden **tan/yellow**, knotted and segmented like aged wood or rope
- Central **rod** in deep teal with a small engraved finial/pommel at top
- A wide canopy of **soft blue-gray botanical leaves** at the top, spreading outward like wings
- **Hand-drawn engineering annotations** scattered around — dotted lines, tiny letters, dimensional callouts (style: technical illustration / botanical specimen plate)
- **Cream/parchment** background with subtle paper grain

This is the canonical TKG emblem. **Use the PNG directly via `next/image`** — do not retrace or re-style. Use cases:
- Hero on Loom (large, ~280–320px wide)
- Inline next to TKG branding (~48–60px)
- Watermark in PDFs (low opacity)

The previous SVG approximations at `/public/emblem-caduceus.svg` and `-watermark.svg` are **abandoned** — kept only for reference. New work uses `/public/emblem-caduceus.png`.

---

## Surface references

These three reference visuals were generated and approved earlier in the project. They define the visual vocabulary Chilly wants. Each surface in TKG must clearly descend from its reference.

### `tidepool.png` — Tidepool landing reference (`/welcome`)
**Theme:** dark.
**Background:** very dark teal-green (`#0e1b1a` to `#1a2826`), with subtle organic grain.
**Top of screen:** a pill segmented nav with the label *"Bloom for:"* (Cormorant body), followed by 4 pills — Ambient (active, white pill on dark) / Consumer / Clinician / Counsel. Pills sit on the dark surface but are paper-warm beige themselves, with crisp borders.
**Center stage:** a **dark rounded rectangle frame** (think glassy core sample cylinder seen from above) containing:
- A small `TIDEPOOL · TKG` Space-Mono eyebrow at top-left, inside the frame
- Each substance is rendered as a **bioluminescent organism**:
  - Glyphosate = **teal jellyfish** (bright luminous teal `#3ec5b8`-ish, with a soft radial glow halo, a smaller bright nucleus inside)
  - Microplastics = **orange jellyfish** (warm peach-orange `#ec9a4a`-ish, larger glow halo — significantly larger than Glyphosate's, indicating its prominence)
- Around each organism, smaller **bloom orbs** (claim dots) drift at varied distances, in muted teal/peach. They have small italic Cormorant text labels attached: *"NHL · contested"* (red bloom for contested), *"urine · >80%"*, *"plaque · provisional"*, *"phthalate · cert."*, *"aquatic · cert."*, *"bottled H₂O · cert."*, *"marine · cert."*
- Dotted **trace lines** descend from each substance organism down toward...
- A **substrate grid** at the bottom of the frame — copper-orange grid lines (horizontal + vertical) with small dot intersections, evoking an engineering blueprint or schema substrate. Eyebrows in Space Mono on the left: `SCHEMA` and `SUBSTRATE`. Two substance labels appear in italic Cormorant gold: *Glyphosate* (5 CLAIMS · 11 SOURCES) and *Microplastics* (5 CLAIMS · 15 SOURCES) — these are the named "anchors" planted in the substrate grid.
**Bottom of frame:** a small circular **down-arrow scroll button** in cream against the frame edge — continuity hint to scroll.
**Below the frame:** a *"Write a message"* input begins, partially visible.

Visual character: **luminous, observational, scientific-poetic.** The reader feels they're looking at a microscopic dish or a stargazing chart.

### `loom.png` — Loom homepage reference (`/`)
**Theme:** light, paper.
**Background:** very subtle warm paper texture (`#f6f1e8` close).
**Top of screen:** pill segmented nav with the label *"Highlight weft for:"* (Cormorant body) followed by 4 pills — All (active, paper-warm with darker border) / Consumer / Clinician / Counsel. Same pill style as Tidepool, just on a light surface.
**Center:** a **rounded rectangle card** containing the woven **substance × endpoint matrix**:
- **Top accent stripes** above each substance column header — copper-gold thin gradient bars (~3px tall), evoking the threading on a loom or copper engineering markings.
- **Column headers (warp axis):** four substance names in **italic Cormorant**, large (~28px): *Glyphosate*, *Microplastics*, *Polyethylene*, *PET*.
- **Row labels (weft axis):** uppercase Space Mono with letter-spacing, in ink-mute: `EXPOSURE`, `CARCINOGENICITY`, `CARDIOVASCULAR`, etc.
- **Cells:** white rounded rectangles with hairline border, subtle drop shadow, **subtle pastel status backgrounds when populated**:
  - Certified cells = mint/sage tinted bg (`#dff0e5`-ish)
  - Contested cells = blush/rose tinted bg (`#f5dada`-ish)
  - Provisional cells = peach/cream tinted bg (`#f8e6d2`-ish)
  - Empty cells = pure white with a small `—` em-dash centered
- Each populated cell shows: a Space Mono uppercase **status pill** at top (`CERTIFIED · 0.91`, `CONTESTED`, `PROVISIONAL · 0.50`) in a small badge color matching the cell tint, then the **effect summary** in Cormorant body underneath — short, clinical, e.g. *">80% urine detection (US population)"*, *"NHL: IARC 2A vs EPA not likely"*, *"Plaque MNPs → MACE HR 4.53 (Marfella)"*.
- Each row has a **vertical dotted guide line** running through it from the column header to the substrate (engineering callout vibe).
**Bottom of card:** the same circular **down-arrow scroll button**.
**Below the card:** the page continues — likely with the AI chat input, audience cards, or next section.

Visual character: **woven, surveyable, clinical-precise.** The reader can scan a whole landscape of evidence at once and immediately distinguish certified/contested/provisional by tone. The pastels are subtle — they support readability rather than scream status.

### `stratigraph.png` — substance detail reference (`/substance/[slug]`)
**Theme:** light, paper.
**Top of screen:**
- Left side: pill segmented nav labeled *"Viewing as:"* with three pills — Consumer (active) / Clinician / Counsel
- Right side: the substance name *"Glyphosate"* in **italic Cormorant**, large, with `CAS 1071-83-6` in Space Mono next to it (paper-warm muted)
**Below header:** a Space Mono eyebrow — `CORE SAMPLE · DEPTH 0—460mm` — geological metaphor: the substance detail IS a core sample drilled through layers of evidence.
**Main content:** a **vertical stack of layered cards**, like horizontal strata in a geological core. Each card has:
- A **left margin tick** (small dot + `0mm`, `120mm`, `240mm` etc. depth markers in Space Mono ink-mute) — evokes the depth scale on a core sample log
- A **top accent stripe** in a tier-specific color (3px tall):
  - SURFACE / CONSUMER tier = green/teal stripe (`#2ea4a3`)
  - CLINICAL · BIOMARKERS & MECHANISM tier = orange/peach stripe
  - REGULATORY · CONTESTED tier = red/crimson stripe
  - PRIMARY EVIDENCE tier = ink-gray stripe
- A **tier eyebrow** in Space Mono uppercase, color-matched to the stripe (`SURFACE · CONSUMER`, `CLINICAL · BIOMARKERS & MECHANISM`, `REGULATORY · CONTESTED`, `PRIMARY EVIDENCE · 11 SOURCES`)
- A **bold title** in Cormorant body weight (about 22px) — the lay-summary of that tier
- A **descriptive paragraph** in Cormorant — 1–2 sentences of plain language
- A **textured background** on the card body — subtly patterned per tier:
  - SURFACE tier = small dot grid pattern
  - CLINICAL tier = diagonal pinstripes (light orange)
  - REGULATORY tier = wavy lines (light red, evoking interference / disagreement)
  - PRIMARY EVIDENCE tier = horizontal lines (gray)
- A **right-side info bubble** (small inline card, paper-warm bg, color-matched border):
  - SURFACE bubble: claim counts ("5 CLAIMS / 3 certified / 1 contested")
  - CLINICAL bubble: cross-garden links ("→ HKG LINKS / urinary_glyphosate / urinary_AMPA")
  - REGULATORY bubble: contested tag + sides ("CONTESTED / IARC + Zhang 2019 / EPA + EFSA + AHS")
  - PRIMARY EVIDENCE: citation list ("IARC Mono. 112 (2015) · EPA Reg. Review (2020) / EFSA (2023) · Zhang Meta-analysis (2019)")
- A small `—` separator between cards, with an italic mini-eyebrow (e.g. *Surface*, *Clinical*, *Regulatory*).
**Bottom:** the same circular **down-arrow scroll button**.

Visual character: **stratigraphic, archival, evidentiary.** The reader literally drills down through tiers of knowledge — surface (consumer plain-speak) → clinical (biomarkers + mechanism) → regulatory (contested both sides) → primary evidence (the source bedrock). Each tier's texture and color signals what kind of knowledge lives there.

---

## Brand vocabulary derived from these references

**Color (corrections to the abstract spec):**
- Status backgrounds are **subtle tinted pastels**, not saturated jewel solids:
  - Certified bg ≈ `#e3efe5` (mint), badge ≈ `#2a8b6e` text
  - Contested bg ≈ `#f5dadd` (blush), badge ≈ `#b8243f` text
  - Provisional bg ≈ `#fbe7d2` (peach cream), badge ≈ `#a05a18` text
- Saturated jewel tones (teal `#2ea4a3`, crimson `#e83759`, peach `#ffb166`) are reserved for organisms in Tidepool, accent stripes, and inline icons.
- **Copper / gold** is the engineering-frame color — used for the column-header threading bars, the substrate grid in Tidepool, and the geological depth markers in Stratigraph.

**Typography:**
- Substance names — *italic Cormorant Garamond, 28–48px* depending on context
- Section eyebrows — Space Mono uppercase, letter-spacing 0.18em, ink-mute color
- Body — Cormorant Garamond regular 17–18px, line-height ~1.7
- Status pills — Space Mono uppercase, 11–13px, letter-spacing tight inside small color-tinted pills
- CAS numbers, DOIs, dates — Space Mono regular, 13–14px

**Component vocabulary:**
- **Pill segmented nav** ("Highlight weft for", "Bloom for", "Viewing as") — paper-warm pills with hairline border, filled state inverts to dark/active
- **Card frames** with hairline borders + 1–2px shadow, generous internal padding (24–32px)
- **Copper accent stripe** above column heads on the Loom (~3px gradient bar)
- **Depth markers** on the left edge of Stratigraph cards (Space Mono dot+number)
- **Right-side info bubble** in Stratigraph (small color-tinted secondary card)
- **Down-arrow circular scroll button** appears at the bottom of major content sections
- **Hatched / textured backgrounds** per tier in Stratigraph (dot grid, pinstripe, wavy lines, horizontal lines)

**Metaphors per surface:**
- Loom = woven matrix, warp and weft
- Stratigraph = geological core sample, depth markers, tiered strata
- Tidepool = bioluminescent ecosystem, organisms above substrate
- Counsel flow = dossier, exhibit pack
- Consumer flow = personal field guide
- Clinician flow = chart-side workup

---

## How to use this folder

1. **Before editing or creating a visual surface**, read the relevant section above. If a screenshot file (`tidepool.png`, `loom.png`, `stratigraph.png`) exists alongside this `READ_FIRST.md`, open it and look at it.
2. **When writing markup**, lift directly from the description here — the language ("CORE SAMPLE · DEPTH", "Highlight weft for", "Bloom for", `pdf-keep-together`, etc.) is part of the brand and should appear verbatim in component code.
3. **When done**, render the surface and place it next to the reference. If they don't feel like the same product, iterate.
4. **Do not deviate** from these references without an explicit lesson logged in `tasks.lessons.md`.

---

## BKG canonical grammar — every garden inherits this skeleton

Reference: builders.theknowledgegardens.com/killerapp screenshots (Code Compliance Lookup, AI Estimating Gate, Sub Management, Supply Ordering). Toxicology is a sibling to BKG, not a redesign.

### Edge-to-edge top frame
- Far left: small workflow-emblem image + lowercase garden name (`builder's knowledge garden`, here it's `toxicology knowledge garden`) + a `‹ All Workflows` text-back link
- Far right: a horizontal pill nav of the **seven stages** in lowercase Cormorant. Pills are paper-warm with hairline borders. Active stage gets a stronger fill or outline.
- The frame stretches edge-to-edge of the viewport — no left/right max-width on this row.

### TIME MACHINE band
- A wide horizontal panel directly under the top frame.
- Background: faint paper-grid texture (engineering grid).
- Inside, on the left: the seven stages rendered as small icons (compass · lock · triangle/ruler · hammer · refresh · money-bag · book) with the stages' lowercase labels under them. Current stage's icon highlighted in copper. A thin curved blue arc connects them like a sweep through time.
- In the middle of the band: a `TIME MACHINE` Space-Mono eyebrow, plus a horizontal blue line that stretches across the band — like a progress sweep or scope line.
- On the right: a small status callout — `No budget yet →` (or for tox: `No exposure logged yet →` / `0 of 7 stages complete →`).

### Stage breadcrumb strip
- Below the time machine band, an inline breadcrumb of the seven stages — checkmarked completed ones, the current stage as a colored pill with `(you're here)` underneath, future stages dim.
- Format: `✓ Identify ⌂ → ✓ Assess 🔒 → [Plan] (you're here) → ⚒ Act → ↻ Adapt → 💰 Resolve → 📖 Reflect`

### Hero image area (per workflow)
- Below the stage strip, a full-bleed hero image — BKG examples: padlock photo for Code Compliance, eagle for AI Estimating Gate, geometric construction art for Sub Management / Supply Ordering.
- Breadcrumb in the lower-left corner of the hero: `Killer App / Workflows / [name]`
- `PRO: OFF` toggle pill in the upper-right corner of the hero
- Centered overlay content: optional eyebrow + bold title

### Suggestion cards row
- Three cards labeled `Try one of these:` under the hero — each is a paper-warm rounded rectangle with a single-line suggestion.
- BKG examples: `Size up a new job` · `Check code for something` · `Sequence a build`.
- For TKG: `Look up a compound` · `Decode a label` · `Build an exposure profile` · `Spec PPE`.

### Ask box (the central voice/text input)
- Wider rounded input pill, with a mic icon on the left and a green-mint `Ask` button on the right.
- Placeholder: `say what you need and where you are by plain old talking turkey and we can figure out how to get you a pro result!` — inheritable to TKG with tox phrasing.
- Hint underneath in Space Mono: `⌘ + Enter to send · 🎤 to dictate · coexists with the bottom-right AI for anything-else`.

### Lanes (TRADE / LANE pattern)
- Below the Ask box on workflow pages, two columns of segmented pills: `TRADE` (workflow vertical: General/GC, Structural, Electrical, Plumbing, Mechanical, Landscape/Hardscape) and `LANE` (audience: General Contractor, DIY/Owner-Builder, Specialty Trade, Crew/Field, Supplier, Equipment Fleet, Service Provider, Agent/Broker).
- For TKG: `WORKFLOW` (Compound Lookup, GHS Classifier, Label Decoder, SDS Retrieval) and `LANE` (Consumer / Clinician / Counsel / Hygienist / Inspector).

### Workflow card with XP gamification
- Bold workflow title + a small `q5` Space-Mono identifier
- A "0 of 7 complete · 75 XP available · Jurisdiction: ibc-2024" subline
- Numbered question rows below, each as a pill: a circle with the number, the title, an `+11 XP` reward on the right, and a chevron.

### Right-side floating panel
- BKG has a small black circular icon at right-edge that opens a side panel ("Ask the garden" / "Workflow Q2") — a contextual chat that coexists with the in-page Ask.
- TKG can inherit this same pattern.

### Centering rule
- The TopFrame and TimeMachine are edge-to-edge full-width.
- Body content (hero, suggestions, Ask box, lanes, workflow card) sits inside `max-w-6xl mx-auto` so it always reads centered on any viewport from 375px to 2560px.
- This is what fixes the "pushed-left" feeling.

### Toxicology-specific accent
- LOCKED: `--tox: #3B4F6B` (slate blue, scientific neutrality). Used for active-state pills, current-stage outline, primary CTA fills. Pairs with the umbrella copper + parchment + teal.
- See `tasks.lessons.md` for the lock entry.

---

## Reusable across gardens

This pattern is portable to HKG, NatureMark, OKG. For each garden:
1. Start its repo with `/design-references/READ_FIRST.md` cloned from this one
2. Replace the screenshots with that garden's references
3. Adapt the metaphor table (loom / stratigraph / tidepool become whatever fits that garden's vocabulary)
4. Keep the rule: no surface is done until it matches its reference

That's the durable fix.
