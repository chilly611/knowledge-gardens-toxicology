/**
 * Hand-rolled types for the TOX project. Mirrors the columns we observed in
 * the smoke test against `certified_claims_with_evidence` and the schema
 * referenced in `02_COWORK_MASTER_PROMPT.md` and `01_AGENT_BRIEFS.md`.
 *
 * If/when `npx supabase gen types` is run against project tkhlxbdviiqivenpkhmc,
 * replace this file with the generated output. Keep the named re-exports below
 * stable so consumer code doesn't churn.
 */

export type ClaimStatus = 'certified' | 'provisional' | 'contested' | 'retracted';

export type EffectDirection = 'positive_association' | 'negative_association' | 'mixed' | 'null';

export type EvidenceSource = {
  id: string;
  doi: string | null;
  url: string;
  /** 1 = regulatory, 2 = systematic review, 3 = peer-reviewed, 4 = industry/news */
  tier: 1 | 2 | 3 | 4;
  year: number | null;
  /** May contain a `[VERIFY: ...]` placeholder; treat with care. See L-004. */
  quote: string | null;
  title: string;
  /** True if source supports the claim's effect direction; false if it contradicts. */
  supports: boolean;
  publisher: string | null;
  authors?: string[] | null;
};

export type CertifiedClaimRow = {
  claim_id: string;
  substance_name: string;
  substance_cas: string | null;
  substance_id: string;
  endpoint_name: string;
  endpoint_category: string;
  population: string | null;
  exposure_route: string | null;
  effect_direction: EffectDirection | null;
  effect_magnitude: string | null;
  effect_summary: string | null;
  status: ClaimStatus;
  confidence_score: number;
  source_count: number;
  sources: EvidenceSource[];
};

export type Substance = {
  id: string;
  name: string;
  cas_number: string | null;
  molecular_formula: string | null;
  description: string | null;
  // Optional umbrella linkage: a "Microplastics" umbrella with members.
  parent_substance_id?: string | null;
};

export type SubstanceAlias = {
  alias: string;
  alias_type: string | null;
};

export type CrossGardenLink = {
  id: string;
  source_entity_type: 'substance' | 'claim' | 'case' | 'endpoint';
  source_entity_id: string;
  target_garden: 'TKG' | 'HKG' | 'NatureMark' | 'BKG' | 'OKG';
  target_entity_type: string | null;
  target_external_id: string | null;
  target_url: string | null;
  relation: string;
  notes: string | null;
};

export type LegalCase = {
  id: string;
  name: string;
  short_name: string;
  jurisdiction: string | null;
  court: string | null;
  case_number: string | null;
  status: string | null;
  filed_year: number | null;
  description: string | null;
  lead_expert_id: string | null;
};

export type CaseParty = {
  id: string;
  case_id: string;
  name: string;
  role: string | null;
  notes: string | null;
};

export type CaseDocument = {
  id: string;
  case_id: string;
  doc_type: string;
  title: string;
  document_date: string | null;
  source_url: string | null;
  drive_path: string | null;
  notes: string | null;
};

export type CaseEvent = {
  id: string;
  case_id: string;
  event_type: string;
  event_date: string | null;
  description: string;
  document_id: string | null;
};

export type Expert = {
  id: string;
  name: string;
  affiliation: string | null;
  specialty: string | null;
  bio: string | null;
};

export type CaseDetail = LegalCase & {
  parties: CaseParty[];
  documents: CaseDocument[];
  events: CaseEvent[];
  substances: Pick<Substance, 'id' | 'name' | 'cas_number'>[];
  experts: Expert[];
};

export type ResearchBacklogRow = {
  substance_name: string;
  endpoint_name: string;
  reason: string;
  source_count: number;
  status: ClaimStatus;
};

export type SearchResult = {
  type: 'substance' | 'claim' | 'source' | 'case' | 'document' | 'event' | 'party';
  id: string;
  title: string;
  snippet: string | null;
  link: string;
};

export type ReferenceTerm = {
  id: string;
  slug: string;
  name: string;
  category: 'regulatory_body' | 'classification' | 'legal_standard' | 'methodology' | 'concept' | 'metric';
  short_definition: string;
  deep_explanation_md: string;
  lawyer_angle: string | null;
  daubert_relevance: string | null;
  citations: Array<{ title: string; authors?: string[]; year?: number; doi?: string; url?: string }>;
  aliases: string[];
  related_terms: string[];
};
