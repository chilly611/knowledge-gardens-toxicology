/**
 * TOX queries — every TKG route reads through this module.
 *
 * NEVER write to TOX from app code. Confidence + status are computed by
 * triggers; never set them. Quotes may contain `[VERIFY: ...]` placeholders —
 * UI must wrap or hide these (see tasks.lessons.md L-004).
 */
import { supabaseTox } from './supabase-tox';
import type {
  CertifiedClaimRow,
  CaseDetail,
  CrossGardenLink,
  EvidenceSource,
  LegalCase,
  ResearchBacklogRow,
  SearchResult,
  Substance,
  SubstanceAlias,
} from './types-tox';

/* =============================================================================
   Substances
   ============================================================================= */

/**
 * List substances with claim-status counts. Drives the Loom warp axis.
 * Falls back to deriving counts client-side if a server-side aggregate isn't
 * exposed.
 */
export async function listSubstances(): Promise<Array<Substance & { claim_counts: Record<string, number> }>> {
  // 1. fetch substances
  const { data: subs, error: subsErr } = await supabaseTox
    .from('substances')
    .select('id, name, cas_number, molecular_formula, description')
    .order('name');
  if (subsErr) throw subsErr;
  const substances = (subs ?? []) as Substance[];

  // 2. fetch claim status counts grouped client-side
  const { data: claims, error: claimsErr } = await supabaseTox
    .from('certified_claims_with_evidence')
    .select('substance_id, status');
  if (claimsErr) throw claimsErr;

  const counts: Record<string, Record<string, number>> = {};
  for (const c of claims ?? []) {
    const sId = (c as { substance_id: string }).substance_id;
    const status = (c as { status: string }).status;
    counts[sId] ??= {};
    counts[sId][status] = (counts[sId][status] ?? 0) + 1;
  }

  return substances.map((s) => ({ ...s, claim_counts: counts[s.id] ?? {} }));
}

export async function getSubstance(slug: string): Promise<{
  substance: Substance;
  aliases: SubstanceAlias[];
  claims: CertifiedClaimRow[];
  cross_garden_links: CrossGardenLink[];
} | null> {
  const term = slug.replace(/-/g, ' ').trim();

  // 1) Try a fuzzy name match first.
  let { data: s } = await supabaseTox
    .from('substances')
    .select('id, name, cas_number, molecular_formula, description, aliases')
    .ilike('name', `%${term}%`)
    .limit(1)
    .maybeSingle();

  // 2) Fallback: scan the aliases text[] array for a case-insensitive match.
  if (!s) {
    const cap = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
    const { data: byAlias } = await supabaseTox
      .from('substances')
      .select('id, name, cas_number, molecular_formula, description, aliases')
      .or(`aliases.cs.{${term}},aliases.cs.{${term.toUpperCase()}},aliases.cs.{${cap}}`)
      .limit(1)
      .maybeSingle();
    s = byAlias;
  }

  if (!s) return null;
  const substance = s as Substance;
  const aliasArray: string[] = ((s as { aliases?: string[] }).aliases) ?? [];

  const [claimsRes, linksRes] = await Promise.all([
    supabaseTox.from('certified_claims_with_evidence').select('*').eq('substance_id', substance.id),
    supabaseTox
      .from('cross_garden_links')
      .select('*')
      .eq('source_entity_type', 'substance')
      .eq('source_entity_id', substance.id),
  ]);

  return {
    substance,
    aliases: aliasArray.map((a) => ({ alias: a, alias_type: 'common' })) as SubstanceAlias[],
    claims:  (claimsRes.data ?? []) as CertifiedClaimRow[],
    cross_garden_links: (linksRes.data ?? []) as CrossGardenLink[],
  };
}

/* =============================================================================
   Claims
   ============================================================================= */

/**
 * Reads `certified_claims_with_evidence` (the primary view).
 * Filters are optional and client-applied for now — most TKG surfaces fetch
 * all rows because the dataset is small.
 */
export async function getCertifiedClaims(filters?: {
  status?: 'certified' | 'provisional' | 'contested';
  endpoint_category?: string;
  substance_id?: string;
}): Promise<CertifiedClaimRow[]> {
  let q = supabaseTox.from('certified_claims_with_evidence').select('*');
  if (filters?.status)            q = q.eq('status', filters.status);
  if (filters?.endpoint_category) q = q.eq('endpoint_category', filters.endpoint_category);
  if (filters?.substance_id)      q = q.eq('substance_id', filters.substance_id);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as CertifiedClaimRow[];
}

export async function getClaimWithEvidence(claimId: string): Promise<CertifiedClaimRow | null> {
  const { data, error } = await supabaseTox
    .from('certified_claims_with_evidence')
    .select('*')
    .eq('claim_id', claimId)
    .maybeSingle();
  if (error) throw error;
  return data as CertifiedClaimRow | null;
}

/* =============================================================================
   Cross-garden links
   ============================================================================= */

export async function getCrossGardenLinks(
  entityId: string,
  entityType: 'substance' | 'claim' | 'case' | 'endpoint'
): Promise<CrossGardenLink[]> {
  const { data, error } = await supabaseTox
    .from('cross_garden_links')
    .select('*')
    .eq('source_entity_type', entityType)
    .eq('source_entity_id', entityId);
  if (error) throw error;
  return (data ?? []) as CrossGardenLink[];
}

/* =============================================================================
   Legal cases
   ============================================================================= */

export async function getCases(): Promise<LegalCase[]> {
  const { data, error } = await supabaseTox
    .from('legal_cases')
    .select('*')
    .order('filed_year', { ascending: false });
  if (error) throw error;
  return (data ?? []) as LegalCase[];
}

export async function getCase(shortNameOrCaption: string): Promise<CaseDetail | null> {
  // Try short_name first, then fuzzy on caption
  let { data: c, error } = await supabaseTox
    .from('legal_cases')
    .select('*')
    .ilike('short_name', shortNameOrCaption.replace(/-/g, ' '))
    .maybeSingle();
  if (error) throw error;
  if (!c) {
    const res = await supabaseTox
      .from('legal_cases')
      .select('*')
      .ilike('caption', `%${shortNameOrCaption}%`)
      .maybeSingle();
    if (res.error) throw res.error;
    c = res.data;
  }
  if (!c) return null;
  const legalCase = c as LegalCase;

  const [partiesRes, docsRes, eventsRes, casSubRes, expertsRes] = await Promise.all([
    supabaseTox.from('case_parties').select('*').eq('case_id', legalCase.id),
    supabaseTox.from('case_documents').select('*').eq('case_id', legalCase.id),
    supabaseTox.from('case_events').select('*').eq('case_id', legalCase.id).order('occurred_at'),
    supabaseTox
      .from('case_substances')
      .select('substance_id, substances(id, name, cas_number)')
      .eq('case_id', legalCase.id),
    supabaseTox
      .from('expert_case_appearances')
      .select('expert_id, experts(id, full_name, specialty, bio)')
      .eq('case_id', legalCase.id),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const substances = (casSubRes.data ?? []).map((r: any) => r.substances).filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const experts = (expertsRes.data ?? []).map((r: any) => r.experts).filter(Boolean);

  return {
    ...legalCase,
    parties:   (partiesRes.data ?? []) as CaseDetail['parties'],
    documents: (docsRes.data ?? []) as CaseDetail['documents'],
    events:    (eventsRes.data ?? []) as CaseDetail['events'],
    substances,
    experts,
  };
}

/* =============================================================================
   Search
   ============================================================================= */

/**
 * Unified search across substances, claims, sources, and legal cases.
 *
 * Implementation: ilike across name/title/quote columns. When E1's FTS
 * migration lands, swap to `websearch_to_tsquery` against pre-built tsvectors.
 */
export async function searchEverything(query: string): Promise<SearchResult[]> {
  const q = query.trim();
  if (!q) return [];
  const like = `%${q}%`;

  const [subs, alias, claims, sources, cases] = await Promise.all([
    supabaseTox.from('substances').select('id, name, description').ilike('name', like).limit(8),
    supabaseTox
      .from('substance_aliases')
      .select('substance_id, alias, substances(name)')
      .ilike('alias', like)
      .limit(8),
    supabaseTox
      .from('certified_claims_with_evidence')
      .select('claim_id, substance_name, substance_id, endpoint_name, effect_summary')
      .or(`endpoint_name.ilike.${like},effect_summary.ilike.${like}`)
      .limit(8),
    supabaseTox
      .from('evidence_sources')
      .select('id, title, doi, url, claim_id')
      .or(`title.ilike.${like},publisher.ilike.${like}`)
      .limit(8),
    supabaseTox
      .from('legal_cases')
      .select('id, short_name, caption, description')
      .or(`caption.ilike.${like},description.ilike.${like},short_name.ilike.${like}`)
      .limit(8),
  ]);

  const results: SearchResult[] = [];
  for (const s of subs.data ?? [])
    results.push({ type: 'substance', id: (s as { id: string }).id, title: (s as { name: string }).name, snippet: (s as { description: string | null }).description, link: `/substance/${slug((s as { name: string }).name)}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const a of (alias.data ?? []) as any[])
    results.push({ type: 'substance', id: a.substance_id, title: a.substances?.name ?? a.alias, snippet: `alias: ${a.alias}`, link: `/substance/${slug(a.substances?.name ?? a.alias)}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const c of (claims.data ?? []) as any[])
    results.push({ type: 'claim', id: c.claim_id, title: `${c.substance_name} × ${c.endpoint_name}`, snippet: c.effect_summary, link: `/substance/${slug(c.substance_name)}#claim-${c.claim_id}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const s of (sources.data ?? []) as any[])
    results.push({ type: 'source', id: s.id, title: s.title, snippet: s.doi ?? s.url, link: s.url });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const c of (cases.data ?? []) as any[])
    results.push({ type: 'case', id: c.id, title: c.caption, snippet: c.description, link: `/case/${slug(c.short_name)}` });

  return results;
}

/* =============================================================================
   Research backlog
   ============================================================================= */

export async function getResearchBacklog(): Promise<ResearchBacklogRow[]> {
  const { data, error } = await supabaseTox
    .from('claim_research_backlog')
    .select('*');
  if (error) throw error;
  return (data ?? []) as ResearchBacklogRow[];
}

/* =============================================================================
   Helpers
   ============================================================================= */

export function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/**
 * `[VERIFY: ...]` quote shielder — UI helper that hides placeholder verbatim
 * quotes behind a "pending verification" badge. F2 PDF templates use this.
 */
export function quoteOrPending(quote: string | null | undefined): { text: string; verified: boolean } {
  if (!quote) return { text: '', verified: false };
  if (/^\[VERIFY:/.test(quote.trim())) return { text: 'pending verbatim verification', verified: false };
  return { text: quote, verified: true };
}

/** Group an evidence source list by tier (1..4). */
export function groupSourcesByTier(sources: EvidenceSource[]): Record<1 | 2 | 3 | 4, EvidenceSource[]> {
  const out: Record<1 | 2 | 3 | 4, EvidenceSource[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const s of sources) {
    const tier = (s.tier ?? 4) as 1 | 2 | 3 | 4;
    out[tier].push(s);
  }
  return out;
}
