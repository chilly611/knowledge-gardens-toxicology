#!/bin/bash
# Sky Valley PCB Case Ingestion Pipeline
# Unzips archives, extracts text from PDFs, generates inventory CSV
# Usage: bash skyvalley-ingest.sh [--zip-pattern "*.zip"] [--start-zip N] [--dry-run]

set -e

SOURCE_DIR="${SOURCE_DIR:-.}"
WORK_DIR="${WORK_DIR:-./skyvalley-work}"
OUTPUT_CSV="${OUTPUT_CSV:-skyvalley-inventory.csv}"
LOG_FILE="${LOG_FILE:-skyvalley-ingest.log}"

ZIP_PATTERN="${1:-Sky Valley*}"
DRY_RUN=0
START_ZIP=0

log_msg() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Check dependencies
for cmd in unzip pdftotext tesseract python3; do
    if ! command -v "$cmd" &> /dev/null; then
        log_msg "ERROR: $cmd not found. Install it first."
        exit 1
    fi
done

log_msg "Starting Sky Valley ingestion"
log_msg "Source: $SOURCE_DIR | Work: $WORK_DIR"

mkdir -p "$WORK_DIR"

# Initialize CSV
if [[ ! -f "$OUTPUT_CSV" ]]; then
    echo "filename,drive_path,file_size_bytes,doc_type,document_date,notes" > "$OUTPUT_CSV"
fi

# Find and process zips
mapfile -t zips < <(find "$SOURCE_DIR" -maxdepth 1 -name "$ZIP_PATTERN" -type f | sort)
log_msg "Found ${#zips[@]} zips"

zip_idx=0
for zip_path in "${zips[@]}"; do
    zip_basename=$(basename "$zip_path")
    zip_extract_dir="$WORK_DIR/$zip_basename"

    log_msg "=== Zip $((zip_idx+1))/${#zips[@]}: $zip_basename ==="

    if [[ ! -d "$zip_extract_dir" ]]; then
        log_msg "Extracting..."
        unzip -q "$zip_path" -d "$zip_extract_dir" 2>/dev/null || {
            log_msg "WARN: unzip failed, skipping"
            zip_idx=$((zip_idx+1))
            continue
        }
    fi

    # Process PDFs
    pdf_count=0
    find "$zip_extract_dir" -name "*.pdf" -type f | sort | while read pdf_path; do
        filename=$(basename "$pdf_path")
        rel_path=$(echo "$pdf_path" | sed "s|$WORK_DIR/||")
        file_size=$(stat -c%s "$pdf_path" 2>/dev/null || echo 0)

        # Extract text
        text_output=$(pdftotext "$pdf_path" - 2>/dev/null || echo "")
        if [[ -z "$text_output" ]]; then
            text_output=$(tesseract "$pdf_path" - 2>/dev/null || echo "")
        fi

        # Infer doc_type
        doc_type="document"
        [[ "$filename" =~ [Dd]epos ]] && doc_type="deposition"
        [[ "$filename" =~ [Ee]xpert ]] && doc_type="expert_report"
        [[ "$filename" =~ [Mm]otion ]] && doc_type="motion"
        [[ "$filename" =~ [Ee]xhib ]] && doc_type="exhibit"
        [[ "$filename" =~ [Mm]edical ]] && doc_type="medical_record"

        # Infer document_date
        document_date=""
        [[ "$filename" =~ ([0-9]{4})-([0-9]{2})-([0-9]{2}) ]] && document_date="${BASH_REMATCH[1]}-${BASH_REMATCH[2]}-${BASH_REMATCH[3]}"

        # Sanitize notes
        notes=$(echo "$text_output" | tr '\n' ' ' | sed 's/"/""/g' | cut -c1-500)

        echo "\"$filename\",\"$rel_path\",$file_size,\"$doc_type\",\"$document_date\",\"$notes\"" >> "$OUTPUT_CSV"
        pdf_count=$((pdf_count+1))
    done

    log_msg "Completed $zip_basename: $pdf_count PDFs"
    zip_idx=$((zip_idx+1))
done

log_msg "Done. Rows: $(tail -n +2 "$OUTPUT_CSV" | wc -l)"
