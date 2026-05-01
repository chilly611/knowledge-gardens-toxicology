# Toxicology Knowledge Garden — website

The application layer over a live, claim-centric evidence graph. Three audiences
(Consumer, Clinician, Counsel), each with a five-stage workflow producing a
real downloadable PDF deliverable.

## Reading order
1. `02_COWORK_MASTER_PROMPT.md` (in workspace) — vision + brand v2
2. `01_AGENT_BRIEFS.md` (in workspace) — per-track briefs
3. `MIGRATION_NOTES.md` — actual stack, what each agent owns, naming conventions
4. `tasks.todo.md` — wave-by-wave progress (live)
5. `tasks.lessons.md` — corrections, deviations, rules-for-self
6. `/_brand` (after A1) — brand QA
7. `/demo` (after F3) — autoplay tour with 7 stages + presenter script in `docs/DEMO_SCRIPT.md`
8. Vercel preview URL on `feature/sprint-april30` (after G1)

## Stack
Next.js 16.1.6 · React 19 · Tailwind v4 (`@theme inline`, no JS config) · TypeScript 5.9.3 · Supabase JS 2.98 · two Supabase projects:
- **PROD** (`vlezoyalutexenbnzzui`) — legacy EWG 329-substance surface, behind `/legacy/*`
- **TOX** (`tkhlxbdviiqivenpkhmc`) — new evidence graph, every TKG route reads from this

## Local dev
```bash
npm install
npx vercel env pull .env.local   # only Chilly can run this; others use .env.local.example
npm run dev
```

## Branches
- `main` — protected; nothing merges here automatically
- `feature/sprint-april30` — sprint integration branch; preview deploys land here
- `feature/{agent-id}-{slug}` — per-agent work branches, PR back to sprint

## Deploy (Chilly runs these by hand)
```bash
git push origin feature/sprint-april30
npx vercel --prod=false           # preview deploy on the sprint branch
# walk the build, then merge to main when satisfied:
git checkout main && git merge feature/sprint-april30 && git push
```

## What lives where
See `MIGRATION_NOTES.md`. Short version:
- Brand tokens: `src/app/globals.css` (`@theme inline` block)
- Supabase clients: `src/lib/supabase-{prod,tox}.ts`
- Queries: `src/lib/queries-{prod,tox}.ts`
- Route components: `src/app/<route>/page.tsx`
- Shared decorative: `src/components/shared/`
- Surface-specific: `src/components/{loom,substance,tidepool,case,flow,search}/`
- PDF templates: `src/lib/pdf/`
- Legacy routes (do not touch): `src/app/legacy/`
