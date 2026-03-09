# TOXICOLOGY KNOWLEDGE GARDEN — WEBSITE PROJECT
# Last Updated: 2026-03-08 Session 1 — Planning & Scaffold
# ⚠️ EVERY NEW CLAUDE SESSION: READ THIS FILE FIRST ⚠️

---

## MISSION
Build a user-friendly, publicly accessible Next.js website for the Toxicology Knowledge Garden.
People at ALL levels of understanding — from concerned parents checking their tap water to
researchers looking up regulatory limits — should be able to interact with the data meaningfully.

## FOUNDATION (ALREADY BUILT)
The database is fully shipped (see TOXICOLOGY_DB_PROJECT.md). What exists:
- **329 substances** in 12 normalized Postgres tables (Supabase)
- **297/329 enriched** with PubChem data (CAS, SMILES, molecular weight, 5,947 aliases)
- **8 RPC search functions** (FTS, fuzzy, CAS lookup, alias, hybrid cascade)
- **REST API** via PostgREST with OpenAPI 3.0 spec
- **MCP Server** (7 AI tools, registered in Claude Desktop)
- **JSON-LD SEO pages** (329 substance pages + sitemap + robots.txt)
- **Prototype frontend** (toxicology-experience.html — 361 lines, React via CDN)

## SUPABASE CREDENTIALS
- Project: vlezoyalutexenbnzzui
- URL: https://vlezoyalutexenbnzzui.supabase.co
- Anon key: in ewg-data/.env
- All tables have RLS with public read access


## TECH STACK
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + custom Knowledge Gardens design tokens
- **Data:** Supabase JS client (@supabase/supabase-js)
- **Rendering:** Static generation (SSG) for substance pages, server components for search
- **Typography:** Cormorant Garamond (display) + Space Mono (technical)
- **Deployment:** Vercel (connects to GitHub repo)
- **Repo:** chilly611/knowledge-gardens-toxicology (existing, add website/ subfolder or new repo)

## BRAND RULES (from parent Knowledge Gardens — adapted for toxicology)
- Background: Light parchment (#f5f0e8), cream (#FBF8F3) — NEVER dark
- Primary: Teal (#1A5C5C), Gold (#C9A84C), Copper (#B87333), Steel (#71797E), Ink (#2C2C2C)
- Aesthetic: Victorian engineering meets analytical chemistry
- Decorative: Gear ornaments, dimension lines, hazard iconography, molecular diagrams
- Fonts: Cormorant Garamond (headings, body), Space Mono (data, labels, code)
- Interaction model: Tab-based detail views, NOT scroll-based cinematic sections

## AUDIENCE LEVELS
1. **Concerned citizen** — "Is my water safe?" Wants plain-language summaries, risk levels, action items
2. **Student/educator** — Wants chemistry data, health effect explanations, regulatory context
3. **Researcher/professional** — Wants CAS numbers, molecular data, regulatory comparisons, API access
4. **AI agent** — Wants structured JSON-LD, MCP tools, OpenAPI endpoints

## INFORMATION ARCHITECTURE

### Pages
```
/                           — Landing page (hero, search, featured substances, value prop)
/substances                 — Browse all 329 substances (filterable grid, search bar)
/substances/[slug]          — Individual substance detail (tabbed: Overview, Chemistry, Health, Regulations)
/search?q=                  — Search results page (hybrid search via RPC)
/health-effects             — Browse by health effect (Cancer, Liver damage, etc.)
/health-effects/[slug]      — All substances linked to a specific health effect
/classifications            — Browse by category (PFAS, Heavy Metals, VOC, etc.)
/about                      — Methodology, data sources, how to read the data
/api-docs                   — Interactive API documentation (Redoc/Swagger)
```


### Key Components (shared design system)
```
<SubstanceCard>         — Card in browse grid (name, CAS, hazard chips, classification badges)
<SubstanceDetail>       — Full tabbed detail view (4 tabs: Overview, Chemistry, Health, Regulations)
<SearchBar>             — Hybrid search input (calls search_substances_hybrid RPC)
<HealthRing>            — Radial SVG chart of health effects (from prototype)
<WaterGauge>            — Circular fill gauge for contamination data (from prototype)
<ClassificationChips>   — Colored badge chips for PFAS, VOC, Heavy Metal, etc.
<EvidenceBadge>         — Color-coded evidence level indicator (known/probable/possible)
<RegulatoryTable>       — Agency comparison table with limit values
<FormulaDisplay>        — Molecular formula with proper subscripts
<GearOrnament>          — Spinning copper gear SVG (brand decoration)
<Breadcrumbs>           — Navigation trail
<FilterPanel>           — Classification + health effect filter sidebar
```

### Substance Detail Tabs (the "Species Experience" for toxicology)
1. **Overview** — Plain-language description, water contamination gauges, classifications, quick facts
2. **Chemistry** — Molecular formula, weight, CAS, SMILES, InChI, PubChem link, structure diagram
3. **Health Effects** — Health Ring visualization, evidence levels, effect descriptions
4. **Regulations** — Multi-agency comparison table (EPA, WHO, EWG, EU), limit values, compliance status

---

## EXECUTION PLAN — 6 CHUNKS

### Chunk 1: Next.js Scaffold + Supabase Integration
- Initialize Next.js 14 project with App Router, Tailwind CSS
- Configure Supabase client with environment variables
- Set up Tailwind with Knowledge Gardens design tokens (colors, fonts, spacing)
- Create basic layout (header, footer, brand typography)
- Build and verify: `npm run dev` shows styled landing shell
- **Files:** package.json, tailwind.config, app/layout.tsx, app/page.tsx, lib/supabase.ts

### Chunk 2: Substance Browse + Search
- Build /substances page with grid of SubstanceCards
- Implement SearchBar component calling search_substances_hybrid RPC
- Build FilterPanel with classification chips (PFAS, Heavy Metal, VOC, etc.)
- Pagination or infinite scroll for 329 substances
- **Files:** app/substances/page.tsx, components/SubstanceCard, components/SearchBar, components/FilterPanel

### Chunk 3: Substance Detail Pages (Static Generation)
- Build /substances/[slug] with getStaticPaths + getStaticProps (all 329 substances)
- 4-tab interface: Overview, Chemistry, Health Effects, Regulations
- Port WaterGauge, HealthRing, FormulaDisplay, RegulatoryTable from prototype
- JSON-LD structured data in <head> for each page
- **Files:** app/substances/[slug]/page.tsx, components/SubstanceDetail, components/HealthRing, etc.

### Chunk 4: Health Effects + Classifications Browse Pages
- Build /health-effects index (18 health effects with substance counts)
- Build /health-effects/[slug] (substances linked to that effect)
- Build /classifications index and detail pages
- Cross-linking between substance pages, health effects, classifications
- **Files:** app/health-effects/*, app/classifications/*

### Chunk 5: Landing Page + About + Polish
- Hero section with search, animated stats, value proposition
- Featured substances or "What's in your water?" entry point
- About page: methodology, data sources, reading guide
- Responsive design pass (mobile, tablet, desktop)
- Loading states, error boundaries, 404 page
- **Files:** app/page.tsx (enhanced), app/about/page.tsx, error/loading components

### Chunk 6: Deployment + SEO + Performance
- Connect to Vercel, configure environment variables
- Sitemap generation (next-sitemap)
- OpenGraph meta tags for all pages
- Performance optimization (image lazy loading, ISR for substance pages)
- API docs page (embed Redoc)
- Final testing and launch
- **Files:** next-sitemap.config.js, vercel.json, app/api-docs/page.tsx


---

## PROMPT LIST — COPY-PASTE FOR EACH SESSION

### Before ANY prompt:
```
Read C:\Users\kmacn\Desktop\TheKnowledgeGardens\toxicology-db\TOXICOLOGY_WEBSITE_PROJECT.md
— that's your master state for the website build. You are the CTO. Pick up where we left off.
You have god-level access to my machine. The Supabase database is already fully built.
```

### Chunk 1: Scaffold
```
Execute CHUNK 1: Next.js Scaffold + Supabase Integration.
Initialize the project in toxicology-db/website/, set up Tailwind with KG design tokens,
wire Supabase client, create the layout shell with header/footer.
Supabase creds in C:\Users\kmacn\Desktop\TheKnowledgeGardens\ewg-data\.env
```

### Chunk 2: Browse + Search
```
Execute CHUNK 2: Substance Browse + Search.
Build the /substances page with filterable grid, SearchBar calling hybrid RPC,
classification filter chips. Make it work with all 329 substances from Supabase.
```

### Chunk 3: Detail Pages
```
Execute CHUNK 3: Substance Detail Pages.
Build /substances/[slug] with 4 tabs (Overview, Chemistry, Health, Regulations).
Port the WaterGauge, HealthRing, FormulaDisplay from the prototype.
Generate static paths for all 329 substances. Add JSON-LD.
```

### Chunk 4: Browse by Effect/Class
```
Execute CHUNK 4: Health Effects + Classifications pages.
Build the /health-effects and /classifications index and detail pages.
Wire cross-links between substances, effects, and classifications.
```

### Chunk 5: Landing + Polish
```
Execute CHUNK 5: Landing Page, About page, responsive polish.
Build the hero with search, animated stats, featured substances.
About page with methodology. Mobile responsive pass.
```

### Chunk 6: Deploy
```
Execute CHUNK 6: Deployment to Vercel, SEO (sitemap, OG tags),
performance optimization, API docs embed. Final testing.
```

---

## SESSION LOG

### 2026-03-08 — Session 1 (Planning)
- Reviewed full project state: orchid KG demo fleet + toxicology DB (all 8 chunks complete)
- Decision: Next.js production site for long-term scalability
- Orchid and toxicology gardens remain separate projects
- Created this project file with 6-chunk execution plan
- **Next: Execute Chunk 1 (Next.js Scaffold + Supabase Integration)**

### 2026-03-08 — Session 2 (Chunk 1 completion + Chunk 2 start)
- Previous session scaffolded Next.js, installed Supabase, wrote globals.css, lib/supabase.ts, GearOrnament.tsx
- This session: Replaced default layout.tsx with KG branded header/footer/nav
- Replaced default page.tsx with landing page: hero+search, stats bar, featured substances, classification chips, CTA
- Fixed TypeScript type error in getSubstanceClassifications (Supabase join type inference)
- Fixed CSS @import order (Google Fonts must precede @tailwindcss)
- Build passes clean: `next build` succeeds, 4 static pages generated
- Dev server running at http://localhost:3456
- **CHUNK 1 COMPLETE. Building Chunk 2 (Substances Browse + Search)...**
