/**
 * Supabase client for the TOX project (`tkhlxbdviiqivenpkhmc`).
 * Uses publishable (anon) key only — never service-role in client bundles.
 *
 * Read views ready to query:
 *   - certified_claims_with_evidence  (primary)
 *   - claim_research_backlog          (gap detection)
 *
 * Tables:
 *   - substances, substance_aliases
 *   - claims, claim_evidence, evidence_sources, endpoints
 *   - cross_garden_links
 *   - legal_cases, case_parties, case_documents, case_events, case_substances
 *   - experts, expert_case_appearances
 *
 * The confidence engine is automatic — never INSERT into `claims.status` or
 * `claims.confidence_score` directly; they are computed by trigger from
 * `claim_evidence` rows.
 */
import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_TOX_URL!;
const key  = process.env.NEXT_PUBLIC_SUPABASE_TOX_ANON_KEY!;

if (!url || !key) {
  // Don't throw at import time — let the actual query throw with a clearer
  // message during dev. But warn loudly.
  // eslint-disable-next-line no-console
  console.warn('[supabase-tox] NEXT_PUBLIC_SUPABASE_TOX_URL or _ANON_KEY is missing');
}

export const supabaseTox = createClient(url, key, {
  auth: { persistSession: false },
});
