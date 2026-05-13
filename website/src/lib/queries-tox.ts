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
  CaseDocument,
  CaseEvent,
  CaseParty,
  CrossGardenLink,
  EvidenceSource,
  Expert,
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

export async function getCase(shortNameOrId: string): Promise<CaseDetail | null> {
  // Look up the case by short_name first, then by full name.
  // The prior implementation used `.or()` with `encodeURIComponent` wrapped
  // around the ilike pattern. That double-encoded the `%` wildcards into
  // `%25`, so PostgREST searched for the literal text `%25...%25` and matched
  // nothing — which is why `/case/sky-valley` had been silently 404ing in
  // production. Split into two sequential `.ilike()` queries instead; the
  // Supabase SDK handles URL encoding internally so the wildcards survive.
  let legalCase: LegalCase | null = null;

  const byShortName = await supabaseTox
    .from('legal_cases')
    .select('*')
    .ilike('short_name', `%${shortNameOrId}%`)
    .limit(1)
    .maybeSingle();
  if (byShortName.error) throw byShortName.error;
  legalCase = (byShortName.data as LegalCase | null);

  if (!legalCase) {
    const byName = await supabaseTox
      .from('legal_cases')
      .select('*')
      .ilike('name', `%${shortNameOrId}%`)
      .limit(1)
      .maybeSingle();
    if (byName.error) throw byName.error;
    legalCase = (byName.data as LegalCase | null);
  }

  if (!legalCase) return null;

  const [partiesRes, docsRes, eventsRes, casSubRes, leadExpertRes] = await Promise.all([
    supabaseTox.from('case_parties').select('*').eq('case_id', legalCase.id),
    supabaseTox.from('case_documents').select('*').eq('case_id', legalCase.id).order('document_date', { ascending: true }),
    supabaseTox.from('case_events').select('*').eq('case_id', legalCase.id).order('event_date', { ascending: true }),
    supabaseTox
      .from('case_substances')
      .select('substance_id, substances(id, name, cas_number)')
      .eq('case_id', legalCase.id),
    legalCase.lead_expert_id
      ? supabaseTox
          .from('experts')
          .select('*')
          .eq('id', legalCase.lead_expert_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const substances = (casSubRes.data ?? []).map((r: any) => r.substances).filter(Boolean);

  // Collect experts: lead expert + any case_parties with expert-like roles
  const expertsMap = new Map<string, Expert>();

  // Add lead expert if available
  if (leadExpertRes.data) {
    const e = leadExpertRes.data as Expert;
    expertsMap.set(e.id, e);
  }

  // Scan case_parties for expert-like roles and match to experts table or synthesize
  const partiesData = (partiesRes.data ?? []) as CaseParty[];
  for (const party of partiesData) {
    if (party.role && party.role.toLowerCase().includes('expert')) {
      // Try to match by name
      const { data: matched } = await supabaseTox
        .from('experts')
        .select('*')
        .ilike('name', `%${party.name}%`)
        .maybeSingle();
      if (matched) {
        const e = matched as Expert;
        expertsMap.set(e.id, e);
      }
    }
  }

  const experts = Array.from(expertsMap.values());

  return {
    ...legalCase,
    parties:   partiesData,
    documents: (docsRes.data ?? []) as CaseDetail['documents'],
    events:    (eventsRes.data ?? []) as CaseDetail['events'],
    substances,
    experts,
  };
}

export async function getCaseByShortName(shortName: string): Promise<CaseDetail | null> {
  return getCase(shortName);
}

export async function getCaseEvents(caseId: string): Promise<CaseEvent[]> {
  const { data, error } = await supabaseTox
    .from('case_events')
    .select('*')
    .eq('case_id', caseId)
    .order('event_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as CaseEvent[];
}

export async function getCaseDocuments(caseId: string): Promise<CaseDocument[]> {
  const { data, error } = await supabaseTox
    .from('case_documents')
    .select('*')
    .eq('case_id', caseId)
    .order('document_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as CaseDocument[];
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

  const [subs, alias, claims, sources, cases, caseDocs, caseEvents, caseParties] = await Promise.all([
    supabaseTox.from('substances').select('id, name, description').ilike('name', like).limit(8),
    supabaseTox
      .from('substances')
      .select('id, name, aliases')
      .or(
        `aliases.cs.{${q}},aliases.cs.{${q.toUpperCase()}},aliases.cs.{${q.charAt(0).toUpperCase() + q.slice(1).toLowerCase()}}`
      )
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
      .select('id, short_name, name, description')
      .or(`name.ilike.${like},description.ilike.${like},short_name.ilike.${like}`)
      .limit(8),
    // Case documents — Sky Valley corpus (52 docs)
    supabaseTox
      .from('case_documents')
      .select('id, case_id, title, notes, doc_type, document_date, source_url')
      .or(`title.ilike.${like},notes.ilike.${like},doc_type.ilike.${like}`)
      .limit(12),
    // Case events — timeline entries (13 events for Sky Valley)
    supabaseTox
      .from('case_events')
      .select('id, case_id, event_type, event_date, description')
      .or(`description.ilike.${like},event_type.ilike.${like}`)
      .limit(12),
    // Case parties — plaintiffs, defendants, counsel, experts (13 parties for Sky Valley)
    supabaseTox
      .from('case_parties')
      .select('id, case_id, name, role, notes')
      .or(`name.ilike.${like},role.ilike.${like},notes.ilike.${like}`)
      .limit(12),
  ]);

  const results: SearchResult[] = [];
  for (const s of subs.data ?? [])
    results.push({ type: 'substance', id: (s as { id: string }).id, title: (s as { name: string }).name, snippet: (s as { description: string | null }).description, link: `/compound/${slug((s as { name: string }).name)}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const a of (alias.data ?? []) as any[])
    results.push({ type: 'substance', id: (a as { id: string }).id, title: (a as { name: string }).name, snippet: `alias: ${q}`, link: `/compound/${slug((a as { name: string }).name)}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const c of (claims.data ?? []) as any[])
    results.push({ type: 'claim', id: c.claim_id, title: `${c.substance_name} × ${c.endpoint_name}`, snippet: c.effect_summary, link: `/compound/${slug(c.substance_name)}#claim-${c.claim_id}` });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const s of (sources.data ?? []) as any[])
    results.push({ type: 'source', id: s.id, title: s.title, snippet: s.doi ?? s.url, link: s.url });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const c of (cases.data ?? []) as any[])
    results.push({ type: 'case', id: c.id, title: c.name, snippet: c.description, link: `/case/${slug(c.short_name)}` });

  // Case documents — all currently belong to Sky Valley; deep-link with the query pre-applied so the case page can scroll/filter.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const d of (caseDocs.data ?? []) as any[]) {
    const year = d.document_date ? new Date(d.document_date).getFullYear() : '';
    const snippet = d.notes ?? (year ? `${d.doc_type} · ${year}` : d.doc_type);
    results.push({
      type: 'document',
      id: d.id,
      title: d.title,
      snippet,
      link: `/case/sky-valley?q=${encodeURIComponent(q)}#doc-${d.id}`,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const e of (caseEvents.data ?? []) as any[]) {
    const year = e.event_date ? new Date(e.event_date).getFullYear() : '';
    results.push({
      type: 'event',
      id: e.id,
      title: year ? `${e.event_type} · ${year}` : e.event_type,
      snippet: e.description,
      link: `/case/sky-valley?q=${encodeURIComponent(q)}#event-${e.id}`,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const p of (caseParties.data ?? []) as any[]) {
    const snippet = p.role ? (p.notes ? `${p.role} · ${p.notes}` : p.role) : (p.notes ?? null);
    results.push({
      type: 'party',
      id: p.id,
      title: p.name,
      snippet,
      link: `/case/sky-valley?q=${encodeURIComponent(q)}`,
    });
  }

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
   Experts
   ============================================================================= */

/** Resolve an expert by slug (lowercased last name match against experts.name). */
export async function getExpertBySlug(slug: string): Promise<Expert | null> {
  const term = slug.replace(/-/g, ' ').trim().toLowerCase();
  const { data, error } = await supabaseTox
    .from('experts')
    .select('id, name, affiliation, specialty, bio')
    .ilike('name', `%${term}%`)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Expert | null;
}

/** All cases this expert is associated with — via lead_expert_id OR case_parties name match. */
export async function getExpertCases(expertId: string): Promise<LegalCase[]> {
  // (a) cases where they are lead expert
  const leadRes = await supabaseTox
    .from('legal_cases')
    .select('*')
    .eq('lead_expert_id', expertId);
  // (b) cases where they appear in case_parties (by name match — get name from experts)
  const expertRow = await supabaseTox.from('experts').select('name').eq('id', expertId).maybeSingle();
  let nameMatchedCaseIds: string[] = [];
  if (expertRow.data) {
    const partiesRes = await supabaseTox
      .from('case_parties')
      .select('case_id')
      .ilike('name', (expertRow.data as { name: string }).name);
    nameMatchedCaseIds = (partiesRes.data ?? []).map((p) => (p as { case_id: string }).case_id);
  }
  let combined: LegalCase[] = (leadRes.data ?? []) as LegalCase[];
  if (nameMatchedCaseIds.length > 0) {
    const partyCasesRes = await supabaseTox
      .from('legal_cases')
      .select('*')
      .in('id', nameMatchedCaseIds);
    const partyCases = (partyCasesRes.data ?? []) as LegalCase[];
    // dedupe by id
    const seen = new Set(combined.map((c) => c.id));
    for (const c of partyCases) {
      if (!seen.has(c.id)) {
        combined.push(c);
        seen.add(c.id);
      }
    }
  }
  return combined;
}

/** Claims authored/affiliated with an expert. Heuristic: claims for substances appearing in cases this expert is on.
 * Returns CertifiedClaimRow[] for now; if zero, the page renders "no claims yet" gracefully. */
export async function getExpertClaims(expertId: string): Promise<CertifiedClaimRow[]> {
  const cases = await getExpertCases(expertId);
  if (cases.length === 0) return [];
  const caseIds = cases.map((c) => c.id);
  // get substances on those cases
  const subsRes = await supabaseTox
    .from('case_substances')
    .select('substance_id')
    .in('case_id', caseIds);
  const substanceIds = Array.from(new Set((subsRes.data ?? []).map((r) => (r as { substance_id: string }).substance_id)));
  if (substanceIds.length === 0) return [];
  // pull claims on those substances
  const claimsRes = await supabaseTox
    .from('certified_claims_with_evidence')
    .select('*')
    .in('substance_id', substanceIds);
  return (claimsRes.data ?? []) as CertifiedClaimRow[];
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

export type Lane = 'consumer' | 'clinician' | 'counsel' | 'hygienist' | 'inspector';

/** Filter the substance's claims for a given audience lane.
 * Consumer  -> certified only.
 * Clinician -> certified + provisional (drop retracted).
 * Counsel   -> certified + provisional + contested (drop retracted).
 * Hygienist -> falls through to clinician.
 * Inspector -> falls through to clinician. */
export function filterClaimsForLane(claims: CertifiedClaimRow[], lane: Lane): CertifiedClaimRow[] {
  const status = (s: CertifiedClaimRow['status']) => s !== 'retracted';
  if (lane === 'consumer') return claims.filter((c) => c.status === 'certified');
  // clinician | counsel | hygienist | inspector
  return claims.filter((c) => status(c.status));
}

/** Returns the visible tier order for a lane.
 * Consumer  -> ['hazard', 'profile']
 * Clinician -> ['profile', 'hazard', 'response', 'citations']    (mechanism-first)
 * Counsel   -> ['response', 'citations', 'profile', 'hazard']    (Daubert posture first)
 * Hygienist + Inspector -> falls through to clinician */
export type LaneTier = 'hazard' | 'profile' | 'response' | 'citations';
export function prioritizeTiersForLane(lane: Lane): LaneTier[] {
  if (lane === 'consumer') return ['hazard', 'profile'];
  if (lane === 'counsel')  return ['response', 'citations', 'profile', 'hazard'];
  return ['profile', 'hazard', 'response', 'citations']; // clinician + fallthrough
}

/* =============================================================================
   Reference Terms (Lawyer Education Layer)
   ============================================================================= */

import type { ReferenceTerm } from './types-tox';

export async function getReferenceTerm(slug: string): Promise<ReferenceTerm | null> {
  const { data, error } = await supabaseTox
    .from('reference_terms')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as ReferenceTerm | null;
}

export async function listReferenceTerms(category?: string): Promise<ReferenceTerm[]> {
  let q = supabaseTox.from('reference_terms').select('*').order('name');
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as ReferenceTerm[];
}

export async function searchReferenceTerms(q: string): Promise<ReferenceTerm[]> {
  const query = q.trim();
  if (!query) return [];
  const like = `%${query}%`;
  const { data, error } = await supabaseTox
    .from('reference_terms')
    .select('*')
    .or(`name.ilike.${like},short_definition.ilike.${like},deep_explanation_md.ilike.${like}`)
    .order('name');
  if (error) throw error;
  return (data ?? []) as ReferenceTerm[];
}

export async function getReferenceTermsByAliases(aliases: string[]): Promise<ReferenceTerm[]> {
  if (!aliases.length) return [];
  const { data, error } = await supabaseTox
    .from('reference_terms')
    .select('*')
    .or(aliases.map((a) => `aliases.cs.{${a}}`).join(','))
    .order('name');
  if (error) throw error;
  return (data ?? []) as ReferenceTerm[];
}

/* =============================================================================
   Expert workbench queries — documents, publications, reference contributions
   ============================================================================= */

/** Get documents linked to an expert's cases. */
export async function getExpertDocuments(expertId: string): Promise<CaseDocument[]> {
  const cases = await getExpertCases(expertId);
  if (cases.length === 0) return [];
  const caseIds = cases.map((c) => c.id);
  const { data, error } = await supabaseTox
    .from('case_documents')
    .select('*')
    .in('case_id', caseIds)
    .order('document_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as CaseDocument[];
}

/** Get evidence sources authored by or mentioning an expert (by last name). */
export async function getExpertPublications(expertLastName: string): Promise<EvidenceSource[]> {
  const { data, error } = await supabaseTox
    .from('evidence_sources')
    .select('*')
    .or(`authors.cs.{${expertLastName}},authors.cs.{${expertLastName.toLowerCase()}},authors.cs.{${expertLastName.charAt(0).toUpperCase() + expertLastName.slice(1).toLowerCase()}}`)
    .order('year', { ascending: false });
  if (error) throw error;
  return (data ?? []) as EvidenceSource[];
}

/** Get reference terms mentioning an expert by name in key fields. */
export async function getExpertReferenceContributions(expertLastName: string): Promise<ReferenceTerm[]> {
  const { data, error } = await supabaseTox
    .from('reference_terms')
    .select('*')
    .or(
      `lawyer_angle.ilike.%${expertLastName}%,` +
      `daubert_relevance.ilike.%${expertLastName}%,` +
      `deep_explanation_md.ilike.%${expertLastName}%`
    )
    .order('name');
  if (error) throw error;
  return (data ?? []) as ReferenceTerm[];
}
