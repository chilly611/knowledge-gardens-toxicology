# TKG Sprint — tasks.todo.md
**Sprint:** feature/sprint-april30
**Started:** 2026-04-30
**Coordinator:** Claude (Cowork main session) running waves through subagents.
**Source of truth for status:** this file. Update on every wave gate.

---

## Wave 0 — Recon (this main session)
- [x] Mount existing codebase
- [x] Inventory routes/config/lib (Next 16 + React 19 + Tailwind v4 + Supabase 2.98)
- [x] Confirm sprint branch exists (`feature/sprint-april30`)
- [x] Smoke-test TOX `certified_claims_with_evidence` → live
- [x] Write tasks.todo.md / tasks.lessons.md / MIGRATION_NOTES.md
- [x] Clean duplicated TOX env vars in `.env.local`

## Wave 1 — Foundation (parallel)
- [x] **A3** scaffolding — legacy migration, page.tsx shell, env example, vercel.json rewrites
- [x] **A1** brand — caduceus SVG, paper+jewel tokens (extend, not replace), shared decorative components, /_brand QA
- [x] **A2** Supabase — rename to supabase-prod, add supabase-tox, queries-tox.ts, smoke test

## Wave 2 — Surfaces (parallel after Wave 1)
- [x] **B1** Loom homepage (BKG hero + audience cards + grid + drawer)
- [x] **B2** Substance detail (4-tab orchid analog)
- [x] **B3** Tidepool landing (`/welcome`, dark theme exception)
- [x] **D1** Sky Valley case page (`/case/sky-valley`)
- [x] **E1** Global search (FTS migration + Cmd-K overlay)
- [x] **F1** Animation hooks (useViewportReveal, useCountUp, useTabCrossfade…)

## Wave 3 — Killer-app flows (parallel after Wave 2)
- [x] **C1** Consumer flow + Personal Briefing PDF (teal)
- [x] **C2** Clinician flow + Clinical Brief PDF (indigo)
- [x] **C3** Counsel flow + Case-Prep Packet PDF (crimson, Sky Valley default)
- [x] **E2** Cross-garden link UI (HKG/NatureMark/BKG/OKG branches)
- [x] **F2** PDFShell quality pass (watermark, TOC, citations)

## Wave 4 — Demo & ship
- [x] **F3** /demo walkthrough + DEMO_SCRIPT.md + tracked partner URLs
- [x] **G1** Smoke test, Lighthouse, SHIP_NOTES.md (commands Chilly runs by hand)

---

## Rebuild · design fidelity recovery — 2026-04-30 (later)
After Chilly saw the v1 build and (rightly) found the visuals didn't match the BKG/orchid references, we paused, set up `/design-references/READ_FIRST.md` with detailed visual specs for Loom / Stratigraph / Tidepool screenshots, embedded the actual caduceus PNG, and started rebuilding from real references.

- [x] **R0** /design-references/ folder + READ_FIRST.md + caduceus PNG copied to /public
- [x] **R1** Loom homepage rebuild (segmented pills, copper accent stripes, italic Cormorant column heads, subtle pastel cell tints, ScrollDownButton, three Continue-Exploring doorways, stat strip, paper-warm sticky header with caduceus)
- [ ] **R2** Substance detail rebuild — Stratigraph layered cards (CORE SAMPLE eyebrow, depth markers, tier accent stripes, hatched backgrounds, right-side info bubbles)
- [ ] **R3** Tidepool rebuild — bioluminescent organisms, brass schema substrate, "Bloom for" pills
- [ ] **R4** Propagate quality bar to flows + case + demo

**Action for Chilly:** save the three reference screenshots from chat into `/design-references/loom.png`, `/design-references/stratigraph.png`, `/design-references/tidepool.png` so future agents can open them directly (the textual description in READ_FIRST.md is the fallback).

---

## G15 — Global composition standard rollout — 2026-05-01
After three rounds of "text touches the edges" / "all too close together" feedback on hand-tuned padding, we shipped composition tokens + utility classes in `globals.css` (see L-017) and applied them across every tile/card/grid surface.

- [x] Define `.tile`, `.tile-feature`, `.tile-inner`, `.tile-grid-3`, `.tile-grid-feature`, `.body-readable` utilities in `globals.css`
- [x] Apply to BrowsePanel (3 tiles)
- [x] Apply to TrustStrip (3-column demo + center claim card + source cards)
- [x] Apply to FeaturedCase DossierMockup
- [x] Apply to LoomGrid + LoomCell wrappers
- [x] Apply to compound index + Stratigraph LayerCard tiles
- [x] Apply to home AudienceInvitations + SevenStages + tidepool AudienceCards
- [x] Apply to flow + workflow page tiles
- [x] TypeScript clean (`npx tsc --noEmit`)

**Rule for future agents:** Never hand-tune `p-N py-N` on a card-shaped div. Use `.tile` / `.tile-feature` / `.tile-inner`. If a new surface needs different spacing, add a new token to `globals.css`, don't inline-override.

---

## Wave gate rules
1. No Wave-N+1 task starts until all Wave-N tasks check off here.
2. Every agent updates this file when its work merges.
3. Coordinator reviews `tasks.lessons.md` after every wave for lessons that should become rules going forward.
