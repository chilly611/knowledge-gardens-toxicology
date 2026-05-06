# Sky Valley PCB Case Data Ingestion Runbook

## Overview
This runbook describes how to ingest 11 zip files (~20 GB total) of Sky Valley PCB case documents into the Toxicology Knowledge Garden's Supabase database.

The pipeline is designed to:
1. Unzip each archive to a working directory
2. Extract text from PDFs (with automatic fallback for scanned images)
3. Infer document type and date from filenames
4. Generate a CSV inventory
5. Load the inventory into Supabase via REST API (idempotent and resumable)

**Estimated runtime**: 8–16 hours (depending on CPU, I/O, and PDF complexity). Can be paused and resumed at any zip boundary.

---

## Prerequisites

### Install Dependencies (macOS)
```bash
# PDF text extraction
brew install poppler-utils

# OCR for scanned PDFs (fallback)
brew install tesseract

# Python 3 + requests library
brew install python3
pip3 install requests
```

### Install Dependencies (Linux)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install -y poppler-utils tesseract-ocr python3 python3-pip
pip3 install requests
```

### Get Supabase Credentials
From the Toxicology Knowledge Garden project (`tkhlxbdviiqivenpkhmc`):
1. Go to **Settings > API**
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

Store these in your shell:
```bash
export SUPABASE_URL="https://tkhlxbdviiqivenpkhmc.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Or add to `~/.zshrc` / `~/.bashrc`:
```bash
echo 'export SUPABASE_URL="..."' >> ~/.zshrc
echo 'export SUPABASE_SERVICE_ROLE_KEY="..."' >> ~/.zshrc
source ~/.zshrc
```

---

## Quick Start

### 1. Navigate to the scripts directory
```bash
cd ~/Documents/Claude/Projects/Knowledge\ Gardens\ Umbrella/TheKnowledgeGardens\ PC\ 1/toxicology-db/scripts
```

### 2. Start the ingestion (POC: test with zip-011 first)
```bash
# Test with the smallest zip (258 MB, ~5 min extraction + 10 PDFs = 1–2 hours)
export SOURCE_DIR="$HOME/Documents/Claude/Projects/Knowledge Gardens Umbrella/TheKnowledgeGardens PC 1/toxicology-db/sky valley case"
export WORK_DIR="./skyvalley-work"
export OUTPUT_CSV="skyvalley-inventory.csv"

bash skyvalley-ingest.sh "Sky Valley*3-011.zip"
```

### 3. Monitor progress
```bash
# In another terminal, tail the log
tail -f skyvalley-ingest.log

# Or check CSV row count every minute
watch -n 60 'wc -l skyvalley-inventory.csv'
```

### 4. Load to Supabase (after CSV is generated)
```bash
python3 skyvalley-supabase-load.py skyvalley-inventory.csv
```

### 5. Verify in Supabase
```bash
# Check row count in case_documents for Sky Valley case
SELECT COUNT(*) FROM case_documents WHERE case_id = '55555555-5555-4555-8555-000000000001';
```

---

## Full Pipeline (All 11 Zips)

### Option A: Sequential (simplest, slow)
```bash
# Extract all zips and generate one CSV
bash skyvalley-ingest.sh "Sky Valley*.zip"

# This will take 8–16 hours depending on machine performance.
# Check progress:
tail -f skyvalley-ingest.log
```

### Option B: Resume After Interruption
If the script times out or you pause it:

1. **See how many zips were already processed:**
   ```bash
   ls -la skyvalley-work/ | grep "Sky Valley"
   ```

2. **Resume from a specific zip:**
   ```bash
   # If zip-005 was cut off, re-run starting from zip-006
   bash skyvalley-ingest.sh --source-dir "$SOURCE_DIR" --start-zip 5
   ```

### Option C: Parallel (faster, requires manual coordination)
In separate terminals, process non-overlapping zips:
```bash
# Terminal 1: zips 001–004
bash skyvalley-ingest.sh "Sky Valley*3-00[1-4].zip" --output-csv inventory-part1.csv

# Terminal 2: zips 005–007
bash skyvalley-ingest.sh "Sky Valley*3-00[5-7].zip" --output-csv inventory-part2.csv

# Terminal 3: zips 008–011
bash skyvalley-ingest.sh "Sky Valley*3-00[89].zip" --output-csv inventory-part3.csv
bash skyvalley-ingest.sh "Sky Valley*3-010.zip" --output-csv inventory-part4.csv
bash skyvalley-ingest.sh "Sky Valley*3-011.zip" --output-csv inventory-part5.csv

# Then merge:
(head -1 inventory-part1.csv; tail -n +2 inventory-part*.csv) > skyvalley-inventory.csv
```

---

## Troubleshooting

### `unzip: command not found`
```bash
brew install unzip  # macOS
# or
sudo apt-get install unzip  # Linux
```

### `pdftotext` returns empty text
The script automatically tries **tesseract** (OCR) as a fallback. If both fail, the `notes` field will be empty. This is normal for corrupt or image-only PDFs.

### `SUPABASE_SERVICE_ROLE_KEY` is invalid
1. Check it's copied correctly from the Supabase dashboard
2. Ensure no trailing spaces or newlines:
   ```bash
   echo -n "your-key" | wc -c  # Should be ~100+ chars
   ```

### Supabase INSERT fails with 409 Conflict
The script uses deterministic UUIDs. If you re-run the same CSV, duplicates are skipped (idempotent). This is safe.

### Supabase INSERT fails with 413 Payload Too Large
Reduce `BATCH_SIZE` in `skyvalley-supabase-load.py` from 50 to 25:
```python
BATCH_SIZE = 25
```

### Out of disk space
Ensure you have at least **30 GB** free:
- 20 GB extracted PDFs (working directory)
- 1–2 GB CSV + logs

You can delete `skyvalley-work/` after CSV is loaded to Supabase.

---

## CSV Schema

The `skyvalley-inventory.csv` has these columns:

| Column | Type | Description |
|--------|------|-------------|
| `filename` | string | Original file basename |
| `drive_path` | string | Relative path inside zip (e.g., `Sky Valley PCB Case/1Plaintiff Files/...`) |
| `file_size_bytes` | int | File size in bytes |
| `doc_type` | string | Inferred document type: `deposition`, `expert_report`, `motion`, `exhibit`, `medical_record`, `document`, `research` |
| `document_date` | string | Date inferred from filename (ISO 8601 format: `YYYY-MM-DD`), or empty |
| `notes` | string | First 500 characters of extracted text |

---

## Supabase `case_documents` Schema

When loaded, each row becomes:

```sql
INSERT INTO case_documents (
  id,                -- UUID v5 (deterministic, based on drive_path)
  case_id,           -- '55555555-5555-4555-8555-000000000001' (Sky Valley)
  title,             -- filename
  doc_type,          -- from CSV
  document_date,     -- from CSV, parsed to DATE
  source_url,        -- NULL (local archive)
  drive_path,        -- from CSV
  notes,             -- first 500 chars of extracted text
  created_at         -- auto-generated
) VALUES (...)
```

---

## Performance Notes

**Typical throughput:**
- **Unzip**: 20–30 MB/s (bottleneck: disk I/O)
- **PDF text extraction**: 5–15 PDFs/second (pdftotext) or 0.5–2 PDFs/second (tesseract with OCR)
- **Supabase INSERT**: 50 rows per ~500 ms = 100 rows/sec

**For 20 GB + ~10k PDFs:**
- Extraction: 2–4 hours
- Text processing: 2–8 hours (depends on scanned vs. text-layer ratio)
- Supabase load: 20–30 mins

**Total: 4–12 hours on a typical machine**

---

## Next Steps

After loading, verify in the Toxicology Knowledge Garden platform:
1. Navigate to the case details page for Sky Valley
2. Check the "Documents" tab — should show ~10k documents
3. Try searching for a document title or keyword
4. Run a test query on `case_documents` table

If you find documents with PCB, dioxin, or exposure-related content, insert promising rows into `claim_research_backlog` to trigger analysis workflows.

---

## Contact & Support

For issues or questions:
- Check logs: `tail -f skyvalley-ingest.log`
- Verify Supabase connectivity: `curl -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" "$SUPABASE_URL/rest/v1/case_documents?limit=1"`
- Contact: Chilly Dahlgren (chillyd@gmail.com)
