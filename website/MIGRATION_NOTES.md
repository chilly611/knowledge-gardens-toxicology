# TKG Migration Notes — Wave 0 inventory
**For downstream agents (A1, A2, B-track, etc.). Read before touching files.**

## Stack — actual, not aspirational
| Component | Version | Notes |
|---|---|---|
| Next.js | 16.1.6 | App router, **no** `output: "export"` (see L-001) |
| React | 19.2.3 | Server components default |
| Tailwind | v4 | `@theme inline` in `globals.css`, **no** `tailwind.config.ts` (see L-002) |
| TypeScript | 5.9.3 | Strict mode |
| Supabase JS | 2.98.0 | Already wired for PROD only; A2 adds TOX |

## Existing routes (pre-Wave 1)
```
src/app/
├─ page.tsx                        ← homepage, EWG-driven, will be replaced by B1
├─ layout.tsx                      ← shared header/footer with GearIcon
├─ globals.css                     ← Tailwind v4 @theme tokens (parchment/teal/gold)
├─ about/page.tsx
├─ health-effects/
│  ├─ page.tsx                     ← legacy
│  └─ [slug]/page.tsx              ← legacy
└─ substances/
   ├─ page.tsx                     ← legacy (329-substance EWG list)
   └─ [slug]/page.tsx              ← legacy substance detail
```

## A3's exact migration plan
1. `src/app/health-effects/` → `src/app/legacy/health-effects/`
2. `src/app/substances/` → `src/app/legacy/substances/`
3. `src/app/page.tsx` replaced with thin shell (caduceus + headline) — B1 replaces it later with the real Loom.
4. `src/app/layout.tsx` keeps existing structure but A1 adds the new font/token wiring.
5. `vercel.json` adds rewrites:
   - `/health-effects/*` → `/legacy/health-effects/*`
   - `/substances/*` → `/legacy/substances/*`
   So old EWG share-links still resolve.

## Files A1 owns (brand)
- `src/app/globals.css` — extend with paper+jewel tokens **alongside** existing parchment tokens (see L-003)
- `src/styles/tokens.ts` — new file, typed const exports
- `public/emblem-caduceus.svg` — convert from PNG in workspace
- `public/emblem-caduceus-watermark.svg`
- `src/components/shared/Emblem.tsx`
- `src/components/shared/DimensionLine.tsx`
- `src/components/shared/CornerBrackets.tsx`
- `src/components/shared/GearOrnament.tsx` — moved from `src/components/GearOrnament.tsx`
- `src/app/_brand/page.tsx` — QA route at `/_brand`

## Files A2 owns (data)
- `src/lib/supabase-prod.ts` — renamed from `src/lib/supabase.ts`, exports preserved for legacy routes
- `src/lib/supabase-tox.ts` — new client pointing at TOX project
- `src/lib/types-prod.ts` — generated types for PROD
- `src/lib/types-tox.ts` — generated types for TOX
- `src/lib/queries-prod.ts` — moved from `src/lib/supabase.ts` query helpers
- `src/lib/queries-tox.ts` — new helpers for TOX
- `src/lib/__test_queries.ts` — runnable smoke test

## Naming conventions (locked)
- Components: `PascalCase.tsx`
- Hooks: `useThing()` in `src/lib/hooks/` or `src/lib/animations.ts`
- Types: `types-<source>.ts`
- Queries: `queries-<source>.ts`
- Loom-specific components: `src/components/loom/`
- Substance-detail components: `src/components/substance/`
- Tidepool components: `src/components/tidepool/`
- Case components: `src/components/case/`
- Flow components: `src/components/flow/`
- Search components: `src/components/search/`
- Shared decorative: `src/components/shared/`
- PDF templates: `src/lib/pdf/`

## Two coexisting brand systems
After Wave 1:
- **Legacy** (`/legacy/health-effects/*`, `/legacy/substances/*`): parchment/teal-dark/gold/copper. Untouched by Wave 2/3.
- **TKG v2** (everything else): paper/ink/teal/indigo/crimson/peach.
Both use Cormorant Garamond + Space Mono — only the colors split.

## Forbidden in this codebase
1. Inline hex colors. All colors come from `var(--token)`.
2. `localStorage` / `sessionStorage` (per Cowork artifact rule, transitively for safety).
3. Service-role Supabase keys in any client bundle.
4. New routes outside the structure documented above without updating this file.
5. Modifying TOX schema. Read-only.

## TOX data sanity
Smoke-tested 2026-04-30 — `certified_claims_with_evidence` returns live Glyphosate + Microplastics + PCB rows. **Quote fields contain `[VERIFY: ...]` placeholder strings** — see L-004 in tasks.lessons.md.
