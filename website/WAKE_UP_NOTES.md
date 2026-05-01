# Wake-up notes — what shipped while you slept
**Time:** 2026-05-01, ~3:45am-ish your local time.
**TS:** zero errors. Hard-refresh `Cmd+Shift+R` and walk the demo loop below.

## The demo loop — start here
1. **`/`** — Cinematic Loom homepage. Eight scroll-through sections. Hover the seven stage icons in the top bar — your Midjourney MP4s play, snap back to PNG poster on mouse-out.
2. **`/`** → click "Look up a compound" CTA in the hero → `/workflow/identify/compound-lookup` — the interactive **Compound Lookup workflow** with five expandable questions (Q1 pre-loaded with live Glyphosate data), TimeMachine band, BKG-grammar pattern.
3. **`/`** → scroll to "The substances" → click "Open the index" → **`/compound`** — substance index with hover-MP4 cards.
4. **`/compound/glyphosate`** — the **Stratigraph showpiece**. Four layered core-sample cards: Hazard (consumer plain-English) → Profile (clinical mechanism) → Response (regulatory contested) → Citations (primary evidence). Depth markers on left margin, tier-tinted backgrounds, real live data. This is the page Dr. D will react to.
5. **`/compound/microplastics`**, **`/compound/pcbs`**, **`/compound/pet`** — same template, different live data.
6. **`/case/sky-valley`** — Erickson v. Monsanto case dossier.
7. **`/flow/counsel?case=sky-valley`** — Counsel flow (placeholder, but visible).
8. **`/welcome`** — Tidepool dark-theme marketing landing. The runtime error you saw is fixed (added `'use client'` to the page).
9. **`/demo`** — existing autoplay tour from earlier sprint.

## What got built tonight (in priority order)

### Showpieces
- **`/compound/[slug]`** Stratigraph (the wow page) — `src/app/compound/[slug]/page.tsx` and ~7 supporting tier components. 4 layers, color-coded, textured, live data via `getSubstance()` and `getCertifiedClaims()`.
- **`/compound`** index — 4 hover-animated cards.
- **`/workflow/identify/compound-lookup`** — interactive 5-question workflow with live Glyphosate data in Q1.

### Placeholder pages so nothing 404s
- `/case` (index)
- `/flow` (index)
- `/workflow` (index)
- `/workflow/identify`, `/workflow/assess`, `/workflow/plan`, `/workflow/act`, `/workflow/adapt`, `/workflow/resolve`, `/workflow/reflect` (7 stage indexes — each with the stage MP4 prominent)
- `/workflow/identify/ghs-classifier`, `/workflow/identify/label-decoder`, `/workflow/identify/sds-retrieval` ("coming soon" stubs)

### Polish
- **Padding bumped** across every home section — `p-8` minimum, `p-10` on featured cards. AudienceInvitations, BrowsePanel, TrustStrip, FeaturedCase, LoomCell, LoomGrid all audited. No more text touching box edges.
- **Global rail system** — `.rail-tight` (640) / `.rail-default` (1024) / `.rail-wide` (1280) / `.rail-canvas` (1536). Body never sprawls.
- **Stage MP4 icons** wired with hover-to-play, PNG poster fallback, SVG fallback if both missing.

## Three things you can fix if you want before showing your team

### 1. The two combined-name UI files
You uploaded:
- `ui-pro-toggle.png, ui-search.mp4`
- `ui-pro-toggle.png, ui-search.png`

Re-export them split into FOUR files and drop in:
- `ui-pro-toggle.png`
- `ui-pro-toggle.mp4`
- `ui-search.png`
- `ui-search.mp4`

Once split, the PRO toggle and Search button in the top bar will pick them up automatically.

### 2. If any page looks janky
Hard-refresh first (Cmd+Shift+R). If it still looks off, paste me a screenshot in the morning and I'll fix the specific thing — not by overhauling structure again.

### 3. Smoke-test the Stratigraph
Open `/compound/glyphosate`. Scroll through the four layers. Hover the lane pills at the top. Read the Citations layer at the bottom — every quote should say "pending verbatim verification" (NOT raw `[VERIFY: ...]` strings). If any `[VERIFY:` leaks, that's a bug.

## Numbers
- 65+ source files now in the codebase (pre-cleanup)
- 7 stage MP4 + PNG icons wired
- 4 substances rendered as full Stratigraphs with live data
- 1 active case (Sky Valley)
- ~17 newly-created placeholder pages so the demo loop has zero dead ends
- 4 named width rails so this never breaks again across gardens

## The pitch your team will hear
> "This is the toxicology garden. Three audiences — consumer, clinician, counsel — each with their own lane. One canonical evidence graph behind every claim, with three sources required, contested claims surfaced both ways. Watch — I click Glyphosate, drop into the Stratigraph, four layers from plain-English summary down to the primary evidence bedrock. Click into the Counsel flow with Sky Valley pre-loaded, walk the seven stages, end with a Daubert-grade exhibit packet. Same skeleton across every garden — Builder's, Orchid, Health, NatureMark, Toxicology — different verbs, same shape. **The umbrella is the engine; the gardens are the inputs.**"

Sleep well. Check `/compound/glyphosate` first when you wake up.
