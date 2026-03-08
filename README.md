# The Knowledge Gardens — Toxicology Database

A foundational, AI-native toxicology database with 329 chemical substances, built for
human discoverability, agent orchestration, and LLM tool integration.

Part of [The Knowledge Gardens](https://theknowledgegardens.com) by XR Workers.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CONSUMERS                             │
│  Claude Desktop  │  Cursor  │  Web UI  │  REST Clients  │
└────────┬─────────┴────┬─────┴────┬─────┴───────┬────────┘
         │              │          │             │
    ┌────▼────┐   ┌─────▼────┐  ┌─▼──────┐  ┌──▼──────────┐
    │   MCP   │   │ PostgREST│  │Frontend│  │ JSON-LD/SEO │
    │ Server  │   │ REST API │  │ React  │  │ Static Site  │
    │ 7 tools │   │ 8 RPCs   │  │ 4 tabs │  │ 329 pages    │
    └────┬────┘   └────┬─────┘  └──┬─────┘  └──┬──────────┘
         │             │           │            │
         └─────────────┴───────────┴────────────┘
                        │
              ┌─────────▼──────────┐
              │  Supabase/Postgres │
              │  329 substances    │
              │  12 tables         │
              │  pgvector + FTS    │
              │  RLS (public read) │
              └────────────────────┘
```

## Features

- **329 substances** enriched with PubChem CAS numbers, SMILES, InChI, molecular data
- **Normalized schema**: 12 relational tables (substances, health effects, classifications, regulatory limits, water data, source documents)
- **Full-text search**: Postgres tsvector with weighted ranking
- **Fuzzy search**: pg_trgm trigram similarity (handles misspellings)
- **Alias search**: 5,900+ trade names and synonyms from PubChem
- **CAS number lookup**: Direct chemical identifier search
- **MCP Server**: 7 tools for Claude Desktop / Cursor / Windsurf
- **REST API**: PostgREST auto-API + 8 custom RPC functions
- **OpenAPI 3.0 spec**: Full documentation with Redoc UI
- **JSON-LD**: Schema.org ChemicalSubstance on every page
- **SEO**: XML sitemap, robots.txt (AI crawlers allowed), OG tags
- **Frontend**: React 18 interactive experience with 4 tabs, conveyor belt browser, health ring visualization

## Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (or local Supabase via Docker)

### 1. Database Setup
```bash
# Apply migrations to Supabase
# Run each .sql file in order via Supabase SQL Editor or psql
migrations/001_foundation.sql   # Schema + tables + RLS + seeds
migrations/002_search.sql       # Search functions (FTS, fuzzy, hybrid)
migrations/003_fix_hybrid.sql   # Fixed hybrid search return type
```

### 2. Data Pipeline
```bash
# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_ANON_KEY=your-anon-key
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Migrate EWG data → normalized schema
node scripts/migrate-ewg.js

# Enrich with PubChem (CAS, SMILES, molecular data)
node scripts/enrich-pubchem.js
node scripts/enrich-pubchem-retry.js
```

### 3. MCP Server (for Claude Desktop)
```bash
cd mcp-server && npm install && npx tsc
# Add to Claude Desktop config:
# %APPDATA%\Claude\claude_desktop_config.json (Windows)
# ~/Library/Application Support/Claude/claude_desktop_config.json (Mac)
```

### 4. API Documentation
```bash
cd api && node serve-docs.js
# Open http://localhost:3333
```

### 5. Generate SEO Pages
```bash
node seo/generate-site.js
# Outputs 329 HTML pages + sitemap.xml + robots.txt
```

## Project Structure

```
toxicology-db/
├── migrations/          # SQL schema migrations (run in order)
├── scripts/             # ETL and enrichment scripts
│   ├── migrate-ewg.js       # EWG → normalized tables
│   ├── enrich-pubchem.js     # PubChem API enrichment
│   └── enrich-pubchem-retry.js
├── mcp-server/          # MCP server for AI agents
│   ├── src/index.ts          # 7 MCP tools
│   ├── Dockerfile
│   └── claude_desktop_config.json
├── api/                 # REST API docs
│   ├── openapi.yaml          # OpenAPI 3.0 spec
│   ├── docs.html             # Redoc documentation
│   └── API_QUICKREF.md       # Quick reference
├── seo/                 # Static site generator
│   ├── generate-site.js      # Generates 329 pages
│   ├── sitemap.xml
│   └── robots.txt
├── frontend/            # Interactive experience
│   └── toxicology-experience.html
└── TOXICOLOGY_DB_PROJECT.md  # Master state file
```

## MCP Tools

| Tool | Description |
|------|-------------|
| `search_substances` | Hybrid search: FTS → CAS → alias → fuzzy |
| `get_substance_details` | Full substance profile with all related data |
| `find_by_health_effect` | Substances linked to a health effect |
| `compare_substances` | Side-by-side comparison of two substances |
| `get_water_stats` | Top water contaminants by people affected |
| `get_regulatory_limits` | EPA/EWG/WHO limits for a substance |
| `list_health_effects` | All 18 health effect categories with counts |

## Data Sources

| Source | Data Provided | Count |
|--------|--------------|-------|
| EWG Tap Water | Detection data, guidelines, health keywords | 329 substances |
| PubChem | CAS, SMILES, InChI, molecular weight, synonyms | 297 enriched |
| EPA | MCL regulatory limits | 100 limits |

## License

MIT — The Knowledge Gardens / XR Workers © 2026
