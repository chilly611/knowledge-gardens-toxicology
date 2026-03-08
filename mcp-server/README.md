# Knowledge Gardens — Toxicology MCP Server

MCP (Model Context Protocol) server that exposes the Knowledge Gardens toxicology database to AI agents like Claude, Cursor, Windsurf, and any MCP-compatible client.

## Tools (7)

| Tool | Description |
|------|-------------|
| `search_substances` | Search by name, CAS number, trade name, or keyword (fuzzy matching) |
| `get_substance_details` | Full details: health effects, regulatory limits, water data, aliases |
| `find_by_health_effect` | Find substances linked to a health effect (Cancer, Liver Damage, etc.) |
| `compare_substances` | Side-by-side comparison of two substances |
| `get_water_stats` | Top contaminants by people affected in US drinking water |
| `get_regulatory_limits` | EPA, WHO, EWG limits for a substance |
| `list_health_effects` | All health effect categories with substance counts |

## Setup

```bash
npm install --include=dev
npx tsc
```

## Claude Desktop Configuration

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "toxicology": {
      "command": "node",
      "args": ["C:\\path\\to\\mcp-server\\build\\index.js"],
      "env": {
        "SUPABASE_URL": "https://vlezoyalutexenbnzzui.supabase.co",
        "SUPABASE_ANON_KEY": "your-anon-key"
      }
    }
  }
}
```

## Docker

```bash
docker build -t toxicology-mcp .
echo '{"jsonrpc":"2.0","id":1,"method":"initialize",...}' | docker run -i toxicology-mcp
```

## Data Coverage
- 329 substances from EWG Tap Water Database
- 297 enriched with PubChem (CAS, SMILES, InChI, molecular data)
- 5,947 aliases (trade names, synonyms)
- 816 health effect links across 18 categories
- 100 regulatory limits (EPA MCL, EWG guidelines)
- 322 water contamination records
