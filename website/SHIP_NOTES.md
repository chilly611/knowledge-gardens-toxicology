# SHIP_NOTES.md — TKG Sprint feature/sprint-april30
**Date:** 2026-04-30
**Sprint coordinator:** Claude (Cowork main session)
**Status:** All 14 agent tracks landed. Ready for Chilly to validate locally and deploy to Vercel preview branch.

---

## What you'll do (in this order)
1. Open the codebase locally, install deps, run a dev build.
2. Walk every surface and confirm it renders against live TOX.
3. Fix anything that didn't survive integration.
4. Push to `feature/sprint-april30` → Vercel auto-builds the preview.
5. Send the partner URLs.

## Step 1 — install & build
```bash
cd "/Users/chillydahlgren/Documents/Claude/Projects/Knowledge Gardens Umbrella/TheKnowledgeGardens PC 1/toxicology-db/website"

# pull latest sprint branch (you're already on it)
git status
git diff --stat | tail -5

# install deps
npm install

# run TOX smoke test before anything else
npx tsx src/lib/__test_queries.ts
# expect: "11 passed · 0 failed"  (or close — see L-009 in tasks.lessons.md)

# dev build
npm run dev
# open http://localhost:3000 — Loom homepage should render
```

## Step 2 — walk every surface
Open these in order and spot-check:

| Route | What to see |
|---|---|
| `/` | Loom — caduceus + audience cards + substance×endpoint grid w/ live data |
| `/_brand` | Brand QA — caduceus emblem at 3 sizes, full palette, status badges |
| `/welcome` | Tidepool — dark theme, drifting organisms, scroll manifesto |
| `/substance/glyphosate` | 4 tabs (Overview / Mechanism / Regulatory / Evidence) populated |
| `/substance/microplastics` | Same tab structure, different schematic |
| `/substance/pcbs` | Same |
| `/case/sky-valley` | Header with Dr. Dahlgren callout, party graph, doc register, timeline |
| `/search?q=Roundup` | Permalink search returns Glyphosate via alias |
| Cmd-K from any page | Search overlay opens; "Marfella", "Erickson", "NHL" all return hits |
| `/flow/consumer` | 5 stages with URL state persistence; "Generate briefing" opens preview |
| `/flow/clinician` | 5 stages; differential ranks contested above certified |
| `/flow/counsel?case=sky-valley` | Sky Valley scenario auto-prefills end-to-end |
| `/pdf-preview/consumer?selected=...` | Print-ready briefing; click Print to verify watermark + page breaks |
| `/pdf-preview/clinician?...` | Same |
| `/pdf-preview/counsel?case=sky-valley` | 7-page exhibit packet |
| `/demo` | Autoplay walkthrough (29s total) with share buttons |
| `/legacy/health-effects` | Old EWG surface still renders |
| `/legacy/substances` | 329-substance EWG list still renders |
| `/health-effects` | Vercel rewrite → identical to /legacy/health-effects |
| `/substances` | Vercel rewrite → identical to /legacy/substances |

If any flow page imports from `@/components/flow/StageStepper` (or similar) and that component doesn't exist, C2/C3 may have referenced shapes that didn't materialize. Quick fix list lives in `tasks.lessons.md` if anything broke.

## Step 3 — fix likely build issues
Things to watch for during `npm run build`:

1. **Two AudienceCards components.** There's `src/components/loom/AudienceCards.tsx` (B1) AND `src/components/tidepool/AudienceCards.tsx` (B3). They're different files — no name collision in imports, but if you see TS confusion, check the import path uses the right one.
2. **`src/components/HeaderWithSearch.tsx` injection in layout.tsx.** E1 modified `src/app/layout.tsx` to wrap the header. If layout looks wrong, restore from `git diff src/app/layout.tsx` and re-integrate manually.
3. **`@react-pdf/renderer` is intentionally absent.** PDF generation uses browser print, not react-pdf. See `tasks.lessons.md` L-010 for upgrade path.
4. **Old GearOrnament.tsx and SubstanceDetail.tsx remain at `src/components/`.** Dead code; permission issues prevented deletion from the sandbox. Run `rm src/components/GearOrnament.tsx` locally to remove the duplicate; keep `SubstanceDetail.tsx` (legacy uses it).
5. **TypeScript errors.** Subagents wrote clean TS but couldn't compile. Run `npx tsc --noEmit` and fix any issues — most likely candidates: missing prop types on shared flow components, or null-handling in PDF preview pages reading `useSearchParams`.
6. **Dotenv not in deps.** `src/lib/__test_queries.ts` imports `dotenv` — it's listed only in devDependencies once installed, OR may not be at all. If the smoke test errors `Cannot find module 'dotenv'`, run `npm install --save-dev dotenv tsx` first.

## Step 4 — push & preview
```bash
git add -A
git commit -m "TKG sprint feature/sprint-april30: all 14 tracks landed

Wave 0: recon, planning files, env hygiene
Wave 1: A1 brand+caduceus, A2 supabase-tox+queries-tox, A3 legacy migration
Wave 2: B1 Loom, B2 substance/[slug], B3 Tidepool, D1 case/sky-valley, E1 search, F1 anim hooks
Wave 3: C1 consumer flow+PDF, C2 clinician flow+PDF, C3 counsel flow+PDF, E2 cross-garden links, F2 PDFShell polish
Wave 4: F3 demo walkthrough, G1 ship notes

Coexisting brand systems: legacy parchment palette (--color-*) untouched for /legacy/* routes; new TKG paper+jewel (--paper, --teal, --indigo, --crimson, --peach) layered in :root.

Print-friendly PDF strategy (no @react-pdf/renderer): browser print dialog renders /pdf-preview/[type]?... routes via the shared PDFShell.

See README.md, MIGRATION_NOTES.md, tasks.todo.md, tasks.lessons.md."

git push origin feature/sprint-april30

# Vercel auto-builds preview from the push.
# Check status:
npx vercel ls --scope chillyd-2693s-projects | head -10
# Get the preview URL:
npx vercel inspect $(npx vercel ls --scope chillyd-2693s-projects | grep feature-sprint-april30 | head -1 | awk '{print $2}')
```

## Step 5 — partner URLs (after preview is green)
Once the preview is up at `https://app-feature-sprint-april30-chillyd-2693s-projects.vercel.app` (or whatever Vercel returns), the share-tracked URLs are:

```
Dr. Dahlgren  → <preview-url>/flow/counsel?case=sky-valley&from=dahlgren
John Bou      → <preview-url>/flow/clinician?from=bou
Demo (anyone) → <preview-url>/demo
```

The `/demo` autoplay tour also has a "Share with [name]" button that copies these to clipboard.

---

## Lighthouse targets
Run after preview deploys:
```bash
npx lighthouse https://<preview-url>/ --only-categories=performance,accessibility,best-practices,seo --quiet
```
Targets: Perf ≥ 90 · A11y ≥ 95 · Best Practices ≥ 95 · SEO ≥ 95.

If perf falls short, the most likely culprit is large iframes on `/demo` — disable autoplay during Lighthouse runs, or make the iframes lazy.

---

## What got built — by the numbers
- **65 source files** (tsx/ts) under `src/`
- **3 audience flow pages** + **3 PDF preview routes** (browser-print pattern)
- **1 case page** with party graph + timeline + document register
- **4-tab substance detail** (Overview, Mechanism, Regulatory, Evidence)
- **2-color caduceus emblem** in 3 sizes (hero, inline, watermark)
- **2 coexisting brand palettes** (legacy parchment + TKG v2 paper-jewel)
- **9 lessons** documented in `tasks.lessons.md` covering brief contradictions, naming collisions, PDF strategy
- **2 Supabase projects** wired (PROD legacy + TOX evidence-graph)
- **Cmd-K global search** with 250ms debounced live results from `searchEverything`

## Merge to main (when satisfied)
```bash
git checkout main
git pull
git merge --no-ff feature/sprint-april30 -m "Merge TKG sprint April 30 — production launch"
git push origin main
```

That triggers the production deploy on Vercel. The domain `toxicology.theknowledgegardens.com` will swap from the 329-substance EWG surface to the new Loom homepage. Old EWG URLs continue to resolve via `/legacy/*` rewrites.
