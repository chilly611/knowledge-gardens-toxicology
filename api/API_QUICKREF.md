# Toxicology Knowledge Garden — API Quick Reference

## Base URL
```
https://vlezoyalutexenbnzzui.supabase.co/rest/v1
```

## Authentication
All requests require the `apikey` header:
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsZXpveWFsdXRleGVuYm56enVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzU5MDEsImV4cCI6MjA4Nzc1MTkwMX0.KjkBFe2s6JH9tFrfoQR0nD-H8MUYC6CKYWwVmLhMMgY
```

## Search (Recommended: Hybrid)
```bash
curl -X POST "$BASE/rpc/search_substances_hybrid" \
  -H "apikey: $KEY" -H "Content-Type: application/json" \
  -d '{"query_text":"arsenic","max_results":5}'
```
Searches by: keyword, CAS number, fuzzy name, trade name/alias.

## Get Substance Details
```bash
curl -X POST "$BASE/rpc/get_substance_details" \
  -H "apikey: $KEY" -H "Content-Type: application/json" \
  -d '{"substance_id_param":"baa7f34c-b81b-4de9-a048-a1006ad86595"}'
```

## Find by Health Effect
```bash
curl -X POST "$BASE/rpc/find_by_health_effect" \
  -H "apikey: $KEY" -H "Content-Type: application/json" \
  -d '{"effect_name":"Cancer","max_results":10}'
```

## Water Contamination Stats
```bash
curl -X POST "$BASE/rpc/get_water_stats" \
  -H "apikey: $KEY" -H "Content-Type: application/json" \
  -d '{"min_people_affected":10000000,"max_results":10}'
```

## Compare Two Substances
```bash
curl -X POST "$BASE/rpc/compare_substances" \
  -H "apikey: $KEY" -H "Content-Type: application/json" \
  -d '{"id_a":"UUID_A","id_b":"UUID_B"}'
```

## Direct Table Access (PostgREST)
```bash
# List substances with filters
curl "$BASE/substances?select=name,cas_number&order=name.asc&limit=10" \
  -H "apikey: $KEY"

# Filter by CAS number
curl "$BASE/substances?cas_number=eq.7440-38-2" -H "apikey: $KEY"

# List all health effect categories
curl "$BASE/health_effects" -H "apikey: $KEY"

# List all classifications
curl "$BASE/classifications" -H "apikey: $KEY"
```

## JavaScript (fetch)
```javascript
const BASE = 'https://vlezoyalutexenbnzzui.supabase.co/rest/v1';
const KEY = 'YOUR_ANON_KEY';

const res = await fetch(`${BASE}/rpc/search_substances_hybrid`, {
  method: 'POST',
  headers: { 'apikey': KEY, 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
  body: JSON.stringify({ query_text: 'lead', max_results: 5 })
});
const data = await res.json();
```

## Python (requests)
```python
import requests
BASE = 'https://vlezoyalutexenbnzzui.supabase.co/rest/v1'
KEY = 'YOUR_ANON_KEY'
headers = {'apikey': KEY, 'Authorization': f'Bearer {KEY}', 'Content-Type': 'application/json'}

r = requests.post(f'{BASE}/rpc/search_substances_hybrid',
    headers=headers, json={'query_text': 'arsenic', 'max_results': 5})
print(r.json())
```

## Available RPC Functions
| Function | Method | Purpose |
|----------|--------|---------|
| `search_substances_hybrid` | POST | Multi-strategy search (recommended) |
| `search_substances_fts` | POST | Keyword search |
| `search_substances_fuzzy` | POST | Fuzzy/typo-tolerant search |
| `search_substances_semantic` | POST | Vector similarity search (needs embeddings) |
| `get_substance_details` | POST | Full substance detail |
| `find_by_health_effect` | POST | Find substances by health effect |
| `compare_substances` | POST | Compare two substances side-by-side |
| `get_water_stats` | POST | Water contamination rankings |

## Data Stats
- **329** substances
- **297** with CAS numbers + PubChem data
- **5,947** aliases/synonyms
- **816** health effect links
- **100** regulatory limits
- **322** water detection records
- **12** classification categories
- **18** health effect categories
