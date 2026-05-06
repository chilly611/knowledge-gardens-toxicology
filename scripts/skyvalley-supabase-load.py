#!/usr/bin/env python3
"""
Sky Valley PCB Case Supabase Loader
Reads CSV inventory and INSERTs case_documents rows.
Idempotent and resumable.

Usage:
  export SUPABASE_URL="https://tkhlxbdviiqivenpkhmc.supabase.co"
  export SUPABASE_SERVICE_ROLE_KEY="your-key-here"
  python3 skyvalley-supabase-load.py skyvalley-inventory.csv
"""

import sys
import csv
import os
from datetime import datetime
import json
import hashlib

# Check env vars
supabase_url = os.getenv('SUPABASE_URL')
service_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if not supabase_url or not service_key:
    print("ERROR: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars")
    sys.exit(1)

# Use requests for HTTP
try:
    import requests
except ImportError:
    print("ERROR: requests module not found. Install: pip3 install requests")
    sys.exit(1)

# Constants
CASE_ID = '55555555-5555-4555-8555-000000000001'
BATCH_SIZE = 50

def generate_uuid_v5(namespace, name):
    """Generate deterministic UUID from namespace and name."""
    import uuid
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{namespace}:{name}"))

def insert_batch(rows):
    """INSERT a batch of rows into case_documents via REST API."""
    if not rows:
        return True

    headers = {
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    }

    url = f"{supabase_url}/rest/v1/case_documents"

    payload = []
    for row in rows:
        doc_id = generate_uuid_v5('skyvalley', row['drive_path'])
        
        # Parse document_date
        doc_date = None
        if row['document_date']:
            try:
                doc_date = datetime.strptime(row['document_date'], '%Y-%m-%d').date().isoformat()
            except:
                doc_date = None

        payload.append({
            'id': doc_id,
            'case_id': CASE_ID,
            'title': row['filename'],
            'doc_type': row['doc_type'],
            'document_date': doc_date,
            'source_url': None,
            'drive_path': row['drive_path'],
            'notes': row['notes'][:500] if row['notes'] else None,
        })

    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=30)
        if resp.status_code in [200, 201]:
            print(f"  Inserted {len(rows)} rows")
            return True
        else:
            print(f"  ERROR status {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        print(f"  ERROR: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 skyvalley-supabase-load.py <inventory.csv>")
        sys.exit(1)

    csv_path = sys.argv[1]
    if not os.path.exists(csv_path):
        print(f"ERROR: {csv_path} not found")
        sys.exit(1)

    print(f"Loading {csv_path} to Supabase (case_id={CASE_ID})...")

    batch = []
    total_rows = 0
    failed = False

    with open(csv_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            batch.append(row)
            total_rows += 1

            if len(batch) >= BATCH_SIZE:
                if not insert_batch(batch):
                    failed = True
                batch = []

    # Final batch
    if batch:
        if not insert_batch(batch):
            failed = True

    if failed:
        print(f"Completed with errors. Check logs.")
        sys.exit(1)
    else:
        print(f"Success: Loaded {total_rows} documents")
        sys.exit(0)

if __name__ == '__main__':
    main()
