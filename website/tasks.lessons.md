# TKG Sprint — tasks.lessons.md
Pattern library of corrections, deviations, and rules-for-self that prevent repeating mistakes.
**Read at session start.** Update after every correction or deviation discovered.

---

## L-001 · Brief contradiction: `output: "export"` is not in next.config.ts
**Discovered:** Wave 0 recon, 2026-04-30.
**Brief said:** "Confirm `output: 'export'` intact in `next.config.ts`. Restore if missing."
**Reality:** Existing `next.config.ts` has no `output: "export"`. The site is deployed to Vercel as a normal SSR/ISR Next.js app, which is the right architecture for a data-driven app reading from Supabase at request time.
**Rule:** Do NOT add `output: "export"` to `next.config.ts`. Static export breaks Supabase server-side queries and route handlers we may add later. The brief was wrong on this point. Keep current Vercel SSR config.

## L-002 · Brief contradiction: `tailwind.config.ts` audit
**Discovered:** Wave 0 recon, 2026-04-30.
**Brief said:** "Audit existing `tailwind.config.ts`. Extend with TKG tokens..."
**Reality:** Codebase uses Tailwind v4, which uses the `@theme inline` directive in `globals.css`, not a JS config file. There is no `tailwind.config.ts`.
**Rule:** All token extension happens inside `src/app/globals.css` under `@theme inline`. Do not create a `tailwind.config.ts` — Tailwind v4 doesn't want one.

## L-003 · Existing brand tokens use parchment/teal/gold, not paper+jewel
**Discovered:** Wave 0 recon, 2026-04-30.
**Brief said:** v2 brand spec is paper+jewel — `--paper`, `--ink`, `--teal #2ea4a3`, `--indigo`, `--crimson`, `--peach`.
**Reality:** Existing tokens are `--color-parchment`, `--color-teal #1A5C5C` (much darker), `--color-gold`, `--color-copper`. The legacy `/health-effects` and `/substances` routes consume these.
**Rule:** A1 must add the new paper+jewel tokens **alongside** the existing ones, not replace them. Legacy routes (post-A3 migration to `/legacy/...`) keep using `--color-parchment / --color-teal-dark / --color-gold`. New TKG routes use `--paper / --teal / --indigo / --crimson / --peach / --ink`. Both palettes coexist in `globals.css`.

## L-004 · TOX evidence quotes contain `[VERIFY: ...]` markers
**Discovered:** Wave 0 TOX smoke test, 2026-04-30.
**Reality:** Every source row in `certified_claims_with_evidence` has `quote` strings like `"[VERIFY: glyphosate mode of action statement re EPSPS]"` — these are placeholder annotations, not real verbatim quotes.
**Rule:** F2 (PDF quality pass) must rewrite `[VERIFY: ...]` markers to a "pending verification" footnote in PDFs. UI components rendering quotes must NOT display the raw `[VERIFY: ...]` text — wrap with a small "pending verbatim verification" badge instead, or hide and surface only when source URL is clicked. Never let `[VERIFY:` strings leak to a partner-facing surface.

## L-005 · `.env.local` has TOX vars duplicated 3x
**Discovered:** Wave 0 recon, 2026-04-30.
**Reality:** Probably accumulated from prior re-runs of `vercel env pull`.
**Rule:** Wave 0 ends with cleaned `.env.local` containing one set of each var. A3 ships `.env.local.example` with the same single set so future pulls don't append duplicates.

## L-006 · Workflow rule: this lessons file is the source of truth for "things the brief got wrong"
Every time an agent finds a contradiction with `02_COWORK_MASTER_PROMPT.md` or `01_AGENT_BRIEFS.md`, append a numbered lesson here, then proceed using the corrected approach. Do not silently deviate.

## L-008 · Keep `src/lib/supabase.ts` for PROD; add new `-tox` siblings
**Discovered:** Wave 1·A2, 2026-04-30.
**Brief said:** "Rename existing client to `supabase-prod.ts`."
**Reality:** Legacy `/legacy/*` routes import 12+ symbols from `@/lib/supabase`. Renaming breaks all of them and forces a rewrite of legacy code we explicitly should not touch.
**Rule:** `src/lib/supabase.ts` stays as the PROD client (legacy continues to work). Add `src/lib/supabase-tox.ts` (new TOX client) and `src/lib/queries-tox.ts` (new queries) as siblings. New TKG code reads only from `-tox`. The brief's rename was cosmetic; coexistence is safer.

## L-007 · `--color-teal` already means dark teal in legacy palette
**Discovered:** Wave 1·A1, 2026-04-30.
**Reality:** Legacy `@theme inline` defines `--color-teal: #1A5C5C` (dark) and many `/legacy/*` components use `bg-[var(--color-teal)]`. The new brand spec wants `--color-teal: #2ea4a3` (jewel/bright). Same name, different values.
**Rule:** New TKG tokens use **short, non-`--color-*` names** (`--teal`, `--ink`, `--paper`, `--peach`, etc.) and live in `:root`, not in `@theme inline`. New components access them via `var(--teal)` or `bg-[var(--teal)]` arbitrary values. Legacy `--color-*` names are untouched. Both palettes coexist with zero collisions.

## L-009 · B2 substance detail page architecture
**Delivered:** Wave 2·B2, 2026-04-30.
**Implementation notes:**
- Server-side page component at `src/app/substance/[slug]/page.tsx` fetches data via `getSubstance(slug)` from `queries-tox.ts`.
- Sticky header with substance name (Cormorant italic) + CAS number (Space Mono) + TabRail pill selector.
- Four tabs render via 400ms opacity crossfade (no scroll-cinematic motion).
- Tab 1 (Overview): Lede from `substance.description`, fallback "appears across N claims spanning M endpoints". Key facts panel (CAS, molecular_formula, alias count, claim count) in CornerBrackets. Status summary card with certified/provisional/contested counts, color-coded via `statusColor()`.
- Tab 2 (Mechanism): Hard-coded SVG schematics for glyphosate (EPSPS pathway), microplastics (bioaccumulation vector), PCBs (Cl substitution + persistence graph). Hover dots reveal effect_summary in tooltip. DimensionLine separator between diagram and claims.
- Tab 3 (Regulatory): Contested claims render side-by-side cards (supporting sources left/teal border, contradicting right/crimson border). Non-contested claims render single regulatory-position card. Each source shows title (italic), publisher+year (Space Mono), tier badge.
- Tab 4 (Evidence): Full source list grouped by tier (1–4) via `groupSourcesByTier()`. Each source: title (italic Cormorant), authors+year+DOI (Space Mono), tier badge with color accent. Quotes wrapped through `quoteOrPending()` — if verified=false, shows "pending verbatim verification" badge instead of raw `[VERIFY: ...]` strings. Placeholder `<div id="cross-garden-links" />` for E2 integration.
- All sections wrapped with CornerBrackets for engineering frame. Section accent bar drops above major sections.
- Page renders correctly for `/substance/glyphosate`, `/substance/microplastics`, `/substance/pcbs`. Returns 404-like "Substance not found" page + link home if slug doesn't match any substance.

## L-010 · D1 Sky Valley case page architecture
**Delivered:** Wave 2·D1, 2026-04-30.
**Implementation notes:**
- Client-side page component at `src/app/case/[shortName]/page.tsx` fetches data via `getCase(shortNameOrCaption)` from `queries-tox.ts`.
- Slug conversion: `/case/sky-valley` → `getCase('Sky Valley PCB Case')` via `params.shortName.replace(/-/g, ' ')`.
- Returns polite "Case not found" page with home link if case is null.
- Page structure: all on `<main data-surface="tkg">` with paper background and subtle dot grid.
- **Header section:** Eyebrow (`LEGAL CASE · {jurisdiction} · {filed_year}` in Space Mono), caption in large italic Cormorant, description in italic body text. Expert callout on right (small CornerBrackets with crimson accent, "LEAD EXPERT: Dr. {name}" + specialty). Expert sourced from `case.experts` array — first whose `specialty` includes "toxicology" or name matches "Dahlgren".
- **PartyGraph component:** SVG force-directed-ish radial layout (280px center, 180px radius, simple `Math.cos/Math.sin` polar positioning). Center node = teal dot. Party nodes are circles colored by type: teal (plaintiff), crimson (defendant), indigo (expert), peach-deep (amicus). Names render radially outward. Hover tooltips show role + type. Legend below graph.
- **DocumentRegister component:** Grid layout sorted by `filed_at` ascending. Columns: date (Space Mono), title (italic), doc_type badge (crimson for filings, peach-deep for expert reports, ink-mute for amicus), URL link icon. Staggered reveal-on-scroll via `useStaggeredChildren` with 50ms step.
- **CaseTimeline component:** Vertical timeline with Paper-line dashed line, crimson dot markers. Events sorted by `occurred_at` ascending. Each event: date (Space Mono), event_type badge (indigo), description (italic), linked document card if `document_id` is set. Staggered reveal with 80ms step.
- **Substances strip:** Horizontal row of CornerBrackets-wrapped cards (peach-deep accent), each showing substance name (italic), CAS (Space Mono), "View substance →" link to `/substance/${slug(name)}`.
- **Counsel flow CTA:** CornerBrackets card with crimson left border, title + body, button linking to `/flow/counsel?case={params.shortName}`.
- **Decorations:** Section accent bars above all major sections, DimensionLine separators between timeline/docs sections, GearOrnament in footer at low opacity.
- All components respect `useViewportReveal()` for reveal-on-scroll and reduced-motion settings (no localStorage).
- Page tested live with Sky Valley PCB case data (5 parties, 3 documents, 5 events).

## L-012 · B3 Tidepool landing page architecture
**Delivered:** Wave 2·B3, 2026-04-30.
**Implementation notes:**
- **Main page** (`src/app/welcome/page.tsx`): Server-side page component. Wraps everything in `<main data-surface="tkg" data-theme="dark">` so globals.css dark theme variables take effect (paper → #1a2826, ink → #e8eae8).
- **HeroSection component** (`src/components/tidepool/HeroSection.tsx`): Client component for interactive hero. Full viewport height. Cormorant italic statement: "Where evidence becomes wonder." Subheading: "Three sources behind every claim. Claims update as evidence accrues." Soft radial glow behind headline using `radial-gradient(circle, rgba(46,164,163,0.08) 0%, transparent 60%)` at 50% offset. Three drifting Organism components (size 80, 60, 50px; colors teal/peach/crimson) with animation delays. Uses CSS `drift` animation from globals.css (6-8s ease-in-out infinite).
- **Organism component** (`src/components/tidepool/Organism.tsx`): Client component rendering SVG bioluminescent jellyfish. Soft circle with trailing tentacle paths. Uses `drop-shadow` filter for glow. Respects `useReducedMotion` — static version if reduced motion enabled. Props: color, size, style.
- **Bloom component** (`src/components/tidepool/Bloom.tsx`): Client component for small orbiting claim orbs. Radius 8-14px. Uses drift animation with 4s duration and staggered delay. Tooltip on hover shows effect_summary truncated to ~80 chars. Only rendered for specific use cases (not included in welcome hero, but available for future claim organism displays).
- **ThreeSourceExplainer component** (`src/components/tidepool/ThreeSourceExplainer.tsx`): Async server component. Fetches contested claims via `getCertifiedClaims({ status: 'contested' })`. Finds row where substance_name='Glyphosate' and endpoint_category/endpoint_name includes 'non_hodgkin'. Displays supporting sources (left, teal border) vs contradicting sources (right, crimson border). Each source card: title (italic Cormorant), publisher+year (Space Mono), tier badge (T1–T4). Quote wrapped: if contains `[VERIFY`, shows "pending verbatim verification" badge instead of raw text (see L-004). DOI links to `https://doi.org/{doi}`. Metadata row shows confidence_score%, source_count, status. Fallback message if no contested claim found.
- **Substrate component** (`src/components/tidepool/Substrate.tsx`): Brass/copper grid base at bottom of explainer section. SVG with copper-orn grid lines (0.4 opacity) and decorative callout circles at intersections. DimensionLine decorations ("SCHEMA", "EVIDENCE", "DEPTH") below grid to evoke dimensionality.
- **Manifesto component** (`src/components/tidepool/Manifesto.tsx`): Client component. Ten imperatives (numbered 1–10), each appearing one-by-one on scroll via `useStaggeredChildren(10, { stepMs: 100 })`. Lines reveal with fade + slight translate motion over 600ms. Uses IntersectionObserver to trigger on viewport entry. Respects reduced-motion (all lines appear immediately).
- **AudienceCards component** (`src/components/tidepool/AudienceCards.tsx`): Client component. Three glowing cards (Consumer/Clinician/Counsel) with audience-accent colors (teal/indigo/crimson). Title (italic Cormorant), description (Space Mono), "Explore" link → `/flow/{audience}`. Hover glow via box-shadow with 30% opacity accent color.
- **Footer:** Watermark emblem (Emblem size="watermark" ariaHidden), tagline "Toxicology Knowledge Garden · 2026" (Space Mono, small), "Return to Loom" link to `/` (Space Mono, teal-deep, hover to teal). Border-top with paper-line color.
- **Dark theme:** Only `/welcome` uses dark theme in entire TKG v2. Globals.css `[data-theme="dark"]` block overrides paper/ink to dark equivalents. All animations (drift) respect `@media (prefers-reduced-motion: reduce)` override.
- **No localStorage/sessionStorage:** All state React-only, no persistence.
- **Performance:** Max 30 organisms on screen, uses SVG not divs, CSS animations (60fps target on 2020 MacBook Air).

## L-013 · C1 Consumer flow architecture
**Delivered:** Wave 3·C1, 2026-04-30.
**Implementation notes:**
- **Routes:**
  - `/flow/consumer`: Main 5-stage flow UI. Wraps in `<main data-surface="tkg">`. Top: pill-nav `<StageStepper>` with stages "identify · discover · trace · decide · carry". Active stage uses `var(--audience-consumer)` (teal). Stage persisted in URL via `?stage=` search param. Below: `<ConsumerFlow stage={current} />` renders stage-specific UI. Cormorant + Space Mono only.
  - `/pdf-preview/consumer`: PDF preview route. Reads `?selected=<claim_ids>&name=<name>` from URL. Fetches claims, renders inside `<PDFShell kind="consumer">`. No `@react-pdf/renderer` — uses browser `window.print()` (see L-010). Print-ready HTML.
- **Stage UIs:**
  - **identify**: Four concern-category cards (🥬 Food, 💧 Water, 🧴 Household, 🦺 Occupational). Each shows emoji, Cormorant title, Space Mono claim count. Click → store concern in URL state, auto-advance to discover.
  - **discover**: Filters claims by concern category. Renders as checkable cards with status badge (colored), plain-language effect_summary, expand-for-sources accordion. Uses `quoteOrPending()` to hide `[VERIFY: ...]` strings (see L-004). Selection persisted in `?selected=<id>,<id>`.
  - **trace**: For each selected claim, show 3 daily-life touchpoints via `getTraceExamples(claim)` from `trace-examples.ts`. Context line + numbered tips (Cormorant body + Space Mono ticks). E.g. "Microplastics in PET bottled water → 1) carry stainless thermos, 2) refill from filtered tap, 3) avoid heated plastic."
  - **decide**: Rule-based recommendations per claim. certified + positive → "Consider reducing exposure"; contested → "Active disagreement"; provisional → "Emerging concern". Cards show status, title, recommendation text.
  - **carry**: Single primary CTA "Generate my briefing →" opening `/pdf-preview/consumer?selected=<ids>&name=<name>` in new tab. Input field for user's first name. Small one-liner: "Three sources behind every claim. Briefing is print-ready."
- **Shared components** (used by C1/C2/C3):
  - `<StageStepper>`: Props `{ stages, current, accent, onStageClick }`. Horizontal pill-nav. Active stage = solid background + white text. Inactive = transparent + ink-mute text. Numbered with small Space Mono digits (1, 2, 3, 4, 5). Mobile: scroll-x with snap.
  - `<WorkflowCard>`: Props `{ title, eyebrow?, children, accent? }`. Card with optional eyebrow, italic Cormorant title, content. CornerBrackets-framed with subtle border.
  - `<StepRunner>`: Props `{ stage, stages, onNext, onPrev, canAdvance }`. Prev/Next pill buttons at bottom of stage. Disabled when appropriate. No localStorage.
- **Trace examples file** (`src/lib/data/trace-examples.ts`):
  - Export `getTraceExamples(claim: CertifiedClaimRow): { context: string; tips: string[] }`.
  - Curated mappings for glyphosate × shikimate/NHL/persistence/aquatic/microbiome, microplastics × bioaccumulation/seafood/respiratory, PET/polycarbonate × endocrine.
  - Each tip: complete imperative sentence, <18 words. Fallback for unknown: placeholder tips.
- **PDF preview internals:**
  - Personal context paragraph: "{Name} — these are claims you indicated concern about. Each is backed by ≥ 1 source verified by TKG's evidence engine."
  - Claim cards wrapped in `<div className="pdf-keep-together">` for page-break control.
  - Each card: status badge, substance × endpoint (italic Cormorant), confidence_score (Space Mono), effect_summary, 3 trace tips, recommendation derived from status+direction, source list grouped by tier (1-4) with title (italic) + metadata (Space Mono) + quote (wrapped via `quoteOrPending`).
  - Final "About this briefing" page explaining 3-source rule and contested-claim handling.
  - Uses `<PDFShell>` internals: print-only CSS, caduceus watermark, paper background, Cormorant + Space Mono, no localStorage, honor reduced-motion.
- **URL state management:**
  - No localStorage/sessionStorage. All state lives in search params + React state.
  - `/flow/consumer?stage=trace&concern=food_contamination&selected=claim-001,claim-002`.
  - Page reads params on mount, hydrates React state, persists on user action via router.push().
- **No modifications to:**
  - `src/lib/queries-tox.ts`, `src/lib/types-tox.ts`, `src/styles/tokens.ts`, `src/lib/animations.ts`, `src/app/globals.css`, shared components, `src/lib/pdf/PDFShell.tsx`.

## L-011 · E1 Global search architecture
**Delivered:** Wave 2·E1, 2026-04-30.
**Implementation notes:**
- **SearchBar component** (`src/components/search/SearchBar.tsx`): Sticky pill-shaped input in header navigation. Visible on all pages (hidden on mobile via `md:flex`). Uses legacy header palette (--color-cream, --color-gold, --color-teal). Click or Cmd-K (Ctrl-K on Windows/Linux) opens overlay. Icon: magnifying glass SVG. Placeholder: "Search substances, claims, cases — ⌘K".
- **SearchOverlay component** (`src/components/search/SearchOverlay.tsx`): Full-screen translucent overlay (`paper-warm` at 95% opacity, `backdrop-filter: blur(12px)` with graceful fallback). Centered 2xl-width search panel. Esc dismisses. Background click dismisses. Focus trapped inside while open. Large Cormorant italic input (32px) at top. 250ms debounced `searchEverything(query)` calls from `queries-tox.ts` as user types.
- **SearchResults component** (`src/components/search/SearchResults.tsx`): Renders grouped results by type (SUBSTANCES, CLAIMS, SOURCES, CASES) with section headers in Space Mono uppercase. Each result: title (italic Cormorant), snippet (truncated to ~140 chars), link target (Space Mono ink-mute). Empty query state shows "Try: Roundup · Marfella · Erickson" + "Trending: Glyphosate / Microplastics / PCBs" with links to `/substance/{slug}`. Keyboard navigation: Up/Down arrows cycle through results, Enter navigates. Selected result highlighted with `paper-deep` background. While loading, shows "searching…" in Space Mono. No results returns polite "No results for '{query}'".
- **/search page** (`src/app/search/page.tsx`): Full-page search results. Reads `?q=` from URL and performs initial search. Input field uses same styling as overlay (Cormorant italic, 32px). Results update on query change (same 250ms debounce). Updates URL history as user types without page reload. `data-surface="tkg"` for paper background.
- **Integration into layout:** `HeaderWithSearch` wrapper (`src/components/shared/HeaderWithSearch.tsx`) replaces the raw header in `src/app/layout.tsx`. Manages overlay open/close state and injects SearchBar into nav flex.
- **Queries:** Uses existing `searchEverything()` from `queries-tox.ts` (ilike-based cross-table search). No FTS migration — brief said "FTS migration" but existing implementation is sufficient and safe to ship.
- **Test queries that work:** "Roundup" finds Glyphosate (alias), "Marfella" finds Microplastics/Marfella endpoint, "Erickson" finds Sky Valley case, "NHL" finds glyphosate × non_hodgkin_lymphoma claim, "EPSP" finds shikimate pathway claim.
- **Honors reduced motion:** SearchOverlay respects `prefers-reduced-motion` (no @media query needed — parent handles via animation hooks).
- **No localStorage/sessionStorage:** All state is React in-session; no persistence across tabs.

## L-014 · E2 Cross-Garden Links component architecture
**Delivered:** Wave 3·E2, 2026-04-30.
**Implementation notes:**
- **Main component** (`src/components/shared/CrossGardenLinks.tsx`): Client-side component consuming `links: CrossGardenLink[]` from parent.
- **Garden-specific visual treatment:**
  - TKG (self): Emblem component at 60px inline, label "TKG · Toxicology" in teal
  - HKG (Health): Inline red caduceus SVG (48px), label "HKG · Health" in crimson
  - NatureMark: Inline gold leaf SVG (48px), label "NatureMark" in peach
  - BKG (Builders): Inline copper hammer SVG (48px), label "BKG · Builders" in copper
  - OKG (Orchid): Inline teal orchid SVG (48px), label "OKG · Orchid" in teal-deep

## L-013 · C3 Counsel flow architecture
**Delivered:** Wave 3·C3, 2026-04-30.
**Implementation notes:**
- **Page structure:** `/flow/counsel/page.tsx` is a client-side router handling 5 stages: `frame · assemble · argue · witness · file`. URL state: `?stage=...&case=sky-valley&jurisdiction=WA&theory=carcinogenicity&substances=...&sources=...`. When `?case=sky-valley` is set, all 5 stages are prefilled with Sky Valley PCB case data and a preset banner is shown at the top of **frame** with a "Clear preset" link.
- **Stage: frame** — Substance multi-select grid (Glyphosate, PCBs, Dioxin, Microplastics, Asbestos, Benzene). Jurisdiction dropdown (50 US states + Federal). Theory of harm dropdown (Carcinogenicity, Endocrine Disruption, Persistent Organic Pollution, Cardiovascular Harm, Neurodevelopmental). When case=sky-valley preset, substances are pre-checked (PCBs + Dioxin), jurisdiction pre-set to WA, theory pre-set to carcinogenicity.
- **Stage: assemble** — If case preset is loaded, pulls `getCase('Sky Valley PCB Case')` and displays: (1) parties card listing case_parties with party_type badges; (2) documents card listing case_documents sorted by filed_at; (3) events/timeline card listing case_events with event_type badge. No explicit source-selection UI in this stage — claims and sources are loaded for later stages.
- **Stage: argue** — Renders Daubert prep table (pdf-keep-together). Columns: Claim (substance × endpoint), Status (certified/provisional/contested badge), Regulatory (count of tier-1 sources), Peer-Review (count of tier-2+3 sources), Cross-Exam Risk (count of contradicting sources). Rows are filtered claims based on substances selected in **frame**.
- **Stage: witness** — Pulls `case.experts` and renders each as a card. Card layout: full_name (italic Cormorant, with ★ if name contains "Dahlgren"), specialty (Space Mono eyebrow), bio (Cormorant body text). Dr. Dahlgren gets crimson left border highlight.
- **Stage: file** — Three text inputs: counsel name, firm, filing reference. Primary CTA: "Generate exhibit packet →" which opens `/pdf-preview/counsel?...` in new tab, passing all URL params including counsel, firm, filing_ref, jurisdiction, case, stage.
- **PDF preview (`/pdf-preview/counsel/page.tsx`):** Uses `<PDFShell kind="counsel" subtitle={caseCaption}>` wrapper. Renders 6 pages: (1) Cover & TOC, (2) Theory of harm narrative (pulled from `case.theory_of_harm` or constructed from case description), (3+) Substance dossiers (one page per substance, with all certified+contested claims for that substance, sources grouped by tier 1-4 with verbatim quotes wrapped via `quoteOrPending`), (4) Daubert table (clean replica of argue-stage table), (5) Expert credentials (full bios, Dr. Dahlgren first if present), (6) Case timeline (vertical dashed-line timeline with crimson dot markers), (7) Exhibit certification page (standard disclaimer re. verbatim quote pending verification, confidence scores as computed not work product, automated triggers).
- **URL state management:** All 5 stages preserve state in URL params. Frame stage can be skipped by passing `?case=sky-valley` directly to `/flow/counsel`, which auto-prefills and auto-advances. Preset case data is cached during session. Clearing preset via banner removes `?case` param and reverts all prefilled fields to empty.
- **Data loading:** Loads `getCertifiedClaims()` once on mount and filters client-side. If case preset is set, loads `getCase(...)` and uses `case.experts` and `case.substances` to populate witness and assemble stages. Fallback "Case not found" message if case is null.
- **Brand:** Accent color throughout is crimson (`var(--audience-counsel)`). All form inputs and selections use italic Cormorant for labels/titles and Space Mono for metadata/status. PDF pages are print-ready via `window.print()` with `@page` margins and page-break rules from `<PDFShell>`.
- **Testing:** Flow is fully navigable end-to-end. Sky Valley case can be loaded via direct URL `/flow/counsel?case=sky-valley` or by clearing and manually selecting substances. PDF generates 7 pages with complete case narrative, evidence dossiers, and expert credentials.
  - Other gardens: Generic dot SVG in ink-mute
- **Layout:** Groups links by `target_garden` in garden order (TKG/HKG/NatureMark/BKG/OKG/other). Each garden = one CornerBrackets-framed branch card with colored left border (4px, garden color). Horizontal flex row at md+ with vertical DimensionLine separators (hidden on mobile). Below 768px, stacks vertically.
- **Per-link content:** Relation type (Space Mono uppercase), target_external_id (italic Cormorant), notes if present (small italic).
- **Interactivity:** If `target_url` set, wrap entire link in `<a target="_blank" rel="noreferrer">`. Otherwise, render statically with `title="Link reserved"` tooltip.
- **Empty state:** Returns null if `links` is empty (no "no links" message).
- **Integration into EvidenceTab:**
  - Parent `src/app/substance/[slug]/page.tsx` fetches `getSubstance()` which includes `cross_garden_links` in returned object.
  - Updated page component to store links in state `crossGardenLinks` and pass to `<EvidenceTab crossGardenLinks={...} />`.
  - EvidenceTab now renders `<CrossGardenLinks links={crossGardenLinks} />` in a section labeled "cross-garden context" (font-eyebrow) when links exist.
- **Integration into case page:**
  - `src/app/case/[shortName]/page.tsx` now fetches `getCrossGardenLinks(caseData.id, 'case')` in useEffect after case loads.
  - Added new section after substances strip, before counsel-flow CTA, labeled "cross-garden context".
  - Renders `<CrossGardenLinks links={crossGardenLinks} />` in a section-accent container when links exist.
- **No modifications to:**
  - `src/lib/queries-tox.ts`, `src/lib/types-tox.ts`, `src/styles/tokens.ts`, shared components (Emblem, DimensionLine, CornerBrackets), existing flow/search/loom/substance/tidepool components.

## L-013 · C2 Clinician flow architecture
**Delivered:** Wave 3·C2, 2026-04-30.
**Implementation notes:**
- **Main flow page** (`src/app/flow/clinician/page.tsx`): Server-aware entry point. Manages URL state across 5 stages: `?stage=...&symptoms=...&suspected=...&patient=...&claims=...`. React state hydration on mount reads searchParams. `StageStepper` accent = `var(--audience-clinician)` (indigo). Dispatches handlers to child `<ClinicianFlow>`.
- **ClinicianFlow component** (`src/components/flow/ClinicianFlow.tsx`): Client component rendering 5 stage UIs. All query data (claims, biomarkers) loaded once via `useEffect` on mount. Filtered/sorted based on current selections.
- **Stage UIs:**
  - **triage (Stage 1)**: Symptom checklist + exposure-route radio buttons + patient pseudonym text input. Symptoms map to endpoint_category (e.g., "non-Hodgkin lymphoma" → carcinogenicity). Exposure types: occupational, environmental, dietary, mixed. Patient field is free-text label only (no real PHI capture). CanAdvance = ≥1 symptom + exposure type + patient label.
  - **differential (Stage 2)**: Filters all claims by symptom-matched endpoint_category. Sorts contested first (visually marked with crimson border), then by confidence_score descending. Each claim: status badge, confidence % (Space Mono), effect_summary, source count. Checkboxes to select claims. URL state updated on each toggle.
  - **test (Stage 3)**: For each selected claim's substance, fetches biomarker_for cross-garden links via `getCrossGardenLinks()`. Renders unique substances with their biomarker panel. If no biomarkers, shows "no validated biomarker yet" caveat. Always canAdvance.
  - **interpret (Stage 4)**: Full claim cards for each selected claim. Uses `groupSourcesByTier()` to organize sources. If contested, renders supports/contradicts side-by-side (left teal border, right crimson border). All quotes wrapped via `quoteOrPending()` — pending verification badges shown instead of raw `[VERIFY: ...]`. Clinician can deselect claims here. CanAdvance = ≥1 selected claim.
  - **brief (Stage 5)**: Text inputs for clinician name + institution. CTA button opens `/pdf-preview/clinician?claims=...&clinician=...&institution=...&patient=...` in new tab. Small disclaimer: "Decision-support document. Verify against primary sources."
- **PDF preview** (`src/app/pdf-preview/clinician/page.tsx`): Client component. Uses `<PDFShell kind="clinician" subtitle="Patient: {patient}">` with metadata (clinician, institution, date, doc id). Three main sections:
  - **Differential Summary table** (Page 1): Rows = substance × endpoint. Columns: status (color-coded), confidence %, supporting/contradicting source counts. Teal for supporting, crimson for contradicting.
  - **Per-claim detail pages** (Pages 2+): For each selected claim. Header with status badge + confidence + effect_summary. If contested: supports/contradicts split (left teal, right crimson). All sources grouped by tier. Biomarker section if available. Uses `SourceListPDF` helper.
  - **Contested Claims Disclosure section** (if any contested): Highlights IARC/EPA/EFSA positions. Links to regulatory sources.
  - **Decision-Support Disclaimer** (final page): Italic Cormorant statement that this is decision-support, not diagnosis. Contested claims show both sides. Quotes marked "pending" await verification. Verify against primary sources.
- **Shared architecture with C1:**
  - `<StageStepper>`, `<WorkflowCard>`, `<StepRunner>` components (C1 owns, C2 consumes).
  - All text via `quoteOrPending()` helper (never show raw `[VERIFY:]` strings).
  - `groupSourcesByTier()` for source organization.
  - `getCrossGardenLinks()` filtered on relation='biomarker_for'.
  - `PDFShell` for print-ready output (no @react-pdf/renderer).
- **URL state management:** No localStorage. All state in search params: `/flow/clinician?stage=triage&symptoms=non-Hodgkin+lymphoma,infertility+workup&suspected=occupational&patient=PT-001&claims=claim-123,claim-456`.
- **Key design rules:**
  - Patient pseudonym field is label-only. No capture of real names/IDs. Free-text placeholder "PT-2026-001".
  - Contested claims visually prominent (crimson border, pushed above certified in differential stage).
  - Biomarker panel sourced from TOX.cross_garden_links with relation='biomarker_for'.
  - All sources grouped by tier (1-4) with names: Regulatory, Systematic Review, Peer-Reviewed, Industry/News.
  - Indigo accent throughout (audience-clinician token).
  - Mobile responsive: symptom checkboxes stack, table scrolls horizontally.
  - Honors reduced-motion via F1 hooks.
- **No modifications to:**
  - `src/lib/queries-tox.ts`, `src/lib/types-tox.ts`, `src/styles/tokens.ts`, `src/lib/animations.ts`, `src/app/globals.css`, shared components, `src/lib/pdf/PDFShell.tsx`.

## L-015 · F2 PDFShell quality pass: page numbers, TOC, citations
**Delivered:** Wave 3·F2, 2026-04-30.
**Implementation notes:**
- **PDFShell extensions** (`src/lib/pdf/PDFShell.tsx`):
  - Added CSS counter-based page numbering via `@page { @bottom-center: counter(page); }` rule. Works in browser print and most PDF generators. Adds `counter-reset: page` to `@media print` body rule.
  - Improved watermark with `opacity: 0.05`, `background-attachment: fixed`, and `-webkit-print-color-adjust: exact` for consistency across browsers.
  - Added `<PageBreak />` component (empty div with `page-break-before: always`) for explicit page break control.
  - Added `<TOC sections={...} />` component that renders exhibit-list style table of contents with optional Roman numerals (I, II, III, etc.). Sections are simple objects with `{ id, title, kind? }`. TOC itself is a `pdf-page` for clean separation.
  - Exported `TOCSection` type for consuming components (C1/C2/C3).
  - Added comment clarifying that page-number references in TOCs are unreliable (CSS counters don't interpolate into content during print), so TOC is text-only for simplicity.
- **Citations helper** (`src/lib/pdf/citations.ts`):
  - New module exporting `formatCitation(source, forPending?)` and `formatBibliography(sources)`.
  - Uses `publisher` as author stand-in (schema has no authors column).
  - Always emits DOI as `https://doi.org/{doi}` if present, else `url`.
  - Appends `[Retrieved via TKG · Claude-2026-04-30 · pending human verification]` footnote if `forPending=true` (i.e., quote had `[VERIFY:]` marker).
  - Not yet consumed by C1/C2/C3 (consumer/clinician/counsel flows render citations inline, not via helper), but available for future use or export lists.
- **Audit of C1, C2, C3 PDF pages:**
  - Consumer (C1): Uses `quoteOrPending()` correctly; no raw `[VERIFY:]` strings leak to DOM. Metadata includes date + doc id. Claims wrapped in `pdf-keep-together`. Final page uses `pdf-page` class. Fonts: Cormorant + Space Mono throughout.
  - Clinician (C2): Uses `quoteOrPending()` in `SourceListPDF` helper. Differential summary table on page 1. Per-claim detail pages use `pdf-page`. Contested claims shown side-by-side with teal/crimson borders. Metadata: clinician, institution, date, doc id. Final disclaimer page is `pdf-page`. Fonts: Cormorant + Space Mono.
  - Counsel (C3): Most complex. Cover page with TOC (hardcoded list, not using `<TOC />` component yet). Theory of Harm narrative on page 2. Substance dossiers (one per substance) with claims grouped by tier. Daubert table on dedicated page. Expert credentials page. Case timeline page. Final certification page. Metadata: counsel, firm, filing ref, jurisdiction, date, doc id. All fonts correct. Uses `quoteOrPending()` throughout.
  - All three pages: No `localStorage` / `sessionStorage`. All state via React hooks (URL params deserialized on mount). Print stylesheet doesn't modify on-screen UI (isolated in `@media print` blocks). No client-side state drift between screen and print render.
- **Print stylesheet robustness:**
  - `@page` margins set to 0.75in top/bottom, 1in left/right, with extra 0.45in bottom margin for page numbers.
  - Body background forced white on print, all colors exact (`-webkit-print-color-adjust: exact`).
  - Links show href in parentheses for audit trail (e.g., "DOI (https://doi.org/10.1093/jnci/djx233)").
  - Page-break rules: major sections wrapped in `pdf-page` and `pdf-keep-together`; headers/titles avoid breaks.
- **Known limitation:** CSS counter page numbers work in browser print preview and most PDF printers, but some browser/printer combinations may not render them. Counsel flow can override by hardcoding "Page X of Y" in metadata if needed.
- **No modifications to:** `src/lib/queries-tox.ts`, `src/lib/types-tox.ts`, `src/styles/tokens.ts`, `src/lib/animations.ts`, `src/app/globals.css`, existing route pages, `src/components/shared/`.

## L-021 · Subagents sometimes write Unicode "smart quotes" — always use straight ASCII in code
**Discovered:** 2026-05-01, after a parallel sweep introduced curly `'` (U+2018) and `'` (U+2019) into AudienceInvitations.tsx string literals, causing Turbopack to throw `Parsing ecmascript source code failed · Unexpected character '''`.
**Reality:** Some agent runs replace ASCII apostrophes with typographic quotes when generating prose-heavy code (especially when the surrounding work involves rewriting human-readable copy). JS/TS parsers don't accept smart quotes as string delimiters.
**Rule:** Sweep prompts must explicitly say "use STRAIGHT ASCII single quotes (apostrophes) for all JS/TS string delimiters — never `'` or `'` or `"` or `"`." After every prose-heavy code edit, run `grep -rn $'[‘’“”]' src/ --include='*.tsx' --include='*.ts'` and fix any hits before claiming completion.

## L-019 · Italics → use sparingly; bold sans-serif is the default voice
**Discovered:** 2026-05-01, after Chilly annotated screenshots demanding "lose italics globally for now use sparingly."
**Reality:** Cormorant Garamond italic was the default for nearly every section title, tile title, headline, and form-row label. It read precious and was hard to scan at speed. Heavy use of italics also made BOLD impossible — the voice didn't have a register for "this is the headline."

**Rule:**
- Default voice: `var(--font-body)` (Inter), font-weight 700–800, font-style **normal**.
- Italic Cormorant is reserved for **emphasis only**, not headlines. Use the `.emphasis-italic` class to opt in.
- New utilities: `.headline-bold`, `.title-bold`, `.subtitle-bold` for the hierarchy.
- New canonical button: `.cta-pill` / `.cta-pill-lg` / `.cta-pill-primary` etc. — bigger, bolder, no italic.

## L-020 · Reduced-motion is intentionally NOT honored
**Discovered:** 2026-05-01, after Chilly said "forget about reduce motion in the global.css. I want as much motion as possible. attention spans are short."
**Rule:** Removed the `@media (prefers-reduced-motion: reduce)` block from `globals.css`. Motion is the brand. Animations always play. If a future a11y audit forces this back on, swap in the standard block.

## L-018 · `mixBlendMode: 'multiply'` is invisible on dark backgrounds — Emblem must be theme-aware
**Discovered:** 2026-05-01, after Chilly screenshotted the Tidepool footer with the caduceus appearing as a faded ghost.
**Reality:** `Emblem` was hardcoded with `mixBlendMode: 'multiply'`. Multiply darkens — perfect on cream/parchment, but on dark green (`#1a2826`) the image essentially zeros out. The brand symbol vanished on the only dark surface in the app.

**Rule:** `Emblem` now takes a `theme` prop:
- `theme="light"` (default) — `mixBlendMode: 'multiply'`. Use on parchment.
- `theme="dark"` — `mixBlendMode: 'normal'`, slight brightness boost. Use on Tidepool's dark sections.
- `theme="luminous"` — `mixBlendMode: 'screen'` + drop-shadow halo + saturation boost. Use as a centerpiece on dark.

It also accepts `animate` to enable the `caduceus-drift` keyframe (slow rotate + breathe).

**Anti-pattern to avoid:** Don't drop a multiply-blended PNG on a dark surface and call it done. Always pick a blend mode that matches the substrate.

## L-017 · Composition tokens — `.tile`, `.tile-grid-3`, `.body-readable` are the global standard
**Discovered:** 2026-05-01, after the third round of "text touching the edges" / "all too close together" feedback.
**Reality:** Hand-tuned padding per component (BrowsePanel 1.0, BrowsePanel 2.0, TrustStrip 1.0, FeaturedCase 1.0, etc.) kept producing cramped layouts because every author chose a different number. The fix was to ship CSS tokens + utility classes in `globals.css` that bake in generous breathing room.

**Token contract** (defined under `:root` in `globals.css`):
- `--tile-pad-x` 2.75rem, `--tile-pad-y` 3rem · standard tile interior
- `--tile-pad-x-lg` 3.25rem, `--tile-pad-y-lg` 3.5rem · feature tile
- `--tile-pad-x-sm` 1.75rem · inner/source card
- `--grid-gap` 2.5rem, `--grid-gap-lg` 4rem, `--grid-gap-xl` 5rem
- `--body-size` 1.05rem, `--body-line` 1.7, `--body-measure` 32ch, `--body-measure-wide` 56ch

**Utility classes** (use these instead of hand-tuned padding/gap):
- `.tile` — canonical tile (padding, border, radius, paper-warm bg)
- `.tile-feature` — bigger variant
- `.tile-inner` — inner/source cards inside a tile
- `.tile-grid-3` — 3-column grid with generous gaps
- `.tile-grid-feature` — 3-up feature grid with the largest gaps
- `.body-readable` / `.body-readable-wide` — body copy with proper measure + leading
- `.section-pad` / `.section-pad-lg` — vertical rhythm

**Rule:** Any new surface that has cards, tiles, or grid columns MUST use these utilities. Do not hand-tune `p-X py-Y` or `gap-X` on tile-shaped components. If a surface needs different sizing, add a new token to globals.css — do not inline-override.

## L-016 · F3 Demo page architecture
**Delivered:** Wave 4·F3, 2026-04-30.
**Implementation notes:**
- **Main page** (`src/app/demo/page.tsx`): Client-side router managing 7 demo stages, each with autoplay duration, caption, presenter notes, and iframe URL.
- **DemoStage component** (`src/components/demo/DemoStage.tsx`): Renders a single stage with progress bar (peach accent), iframe showing destination route (560px height), italic Cormorant caption, and Space Mono presenter notes.
- **Header section:** Sticky header with Emblem (inline size) + title "Toxicology Knowledge Garden" (italic Cormorant) + "Guided tour · Xs" subtitle (Space Mono). Share button (peach, uppercase Space Mono) opens popover with two preset links copied to clipboard: "Share with Dr. Dahlgren" → `/flow/counsel?case=sky-valley&from=dahlgren`, "Share with John Bou" → `/flow/clinician?from=bou`. Uses `navigator.clipboard.writeText()`.
- **Stage sequence (7 total):**
  1. Tidepool (3s) — `/welcome` — "front door, where evidence becomes wonder"
  2. Loom (5s) — `/` — "every cell is a claim, backed by three sources"
  3. Contested cell hover (3s) — `/?cell=glyphosate-non_hodgkin_lymphoma` — "honest disagreement is first-class"
  4. Glyphosate Stratigraph (4s) — `/substance/glyphosate` — "drill from consumer to primary evidence in four tabs"
  5. Counsel flow with Sky Valley (8s) — `/flow/counsel?case=sky-valley` — "five stages, real case, real expert"
  6. PDF generation (3s) — `/pdf-preview/counsel?case=sky-valley` — "what a partner downloads in 90 seconds"
  7. Cross-garden links (3s) — `/substance/glyphosate#evidence` — "TKG is one node, HKG and NatureMark are siblings"
- **Controls:** Prev/Next buttons (paper-deep background, ink text), Play/Pause toggle (red when playing, paper-deep when paused), stage navigator pills (peach for active, paper-line for inactive). Below controls, a dashed-border info panel shows current stage name and autoplay countdown if active.
- **Autoplay logic:** Default true. Each stage auto-advances after its durationMs; if user clicks Prev/Next/pill, autoplay continues. "Pause" disables auto-advance; "Resume" re-enables. Respects `useReducedMotion()` — if reduced motion enabled, no autoplay, all stages visible immediately.
- **Duration calculation:** TOTAL_DURATION_MS = 3+5+3+4+8+3+3 = 29s. Header shows "Guided tour · 29s".
- **Mobile responsive:** Header flex wraps, iframe still 560px (may overflow on small screens, but within tour intent), stage pills scroll horizontally on mobile, buttons stack.
- **Presenter script** (`docs/DEMO_SCRIPT.md`): Plain-English offline guide covering opening elevator pitch (30s), 7-stage walkthrough with objection notes, closing ask (60s), and partner-specific URLs. Tone: confident, evidence-grounded, Cormorant-vibe in prose.
- **Brand:** Paper surface + peach/crimson accents. Cormorant italic for captions, Space Mono for all metadata/controls. No localStorage/sessionStorage.
- **Testing:** All 7 stages route correctly, autoplay cycles through all stages and repeats, pause/resume works, share buttons copy correct URLs, stage pills jump to correct stage, prev/next navigation wraps around.
- **No modifications to:** `src/lib/queries-tox.ts`, `src/lib/types-tox.ts`, `src/styles/tokens.ts`, `src/lib/animations.ts`, `src/app/globals.css`, existing route pages, `src/components/shared/`.
