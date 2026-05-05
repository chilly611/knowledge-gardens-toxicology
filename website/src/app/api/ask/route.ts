import { searchEverything, slug, groupSourcesByTier } from '@/lib/queries-tox';
import { supabaseTox } from '@/lib/supabase-tox';
import type { CertifiedClaimRow, EvidenceSource, LegalCase, Substance } from '@/lib/types-tox';
import Anthropic from '@anthropic-ai/sdk';

type Lane = 'consumer' | 'clinician' | 'counsel';

interface GroundingPayload {
  substances: Array<{
    id: string;
    name: string;
    cas_number: string | null;
    description: string | null;
    link: string;
  }>;
  claims: Array<{
    id: string;
    substance_name: string;
    endpoint_name: string;
    status: string;
    confidence_score: number;
    effect_summary: string | null;
    sources: EvidenceSource[];
    link: string;
  }>;
  cases: Array<{
    id: string;
    name: string;
    short_name: string;
    jurisdiction: string | null;
    filed_year: number | null;
    description: string | null;
    link: string;
  }>;
  experts: Array<{
    id: string;
    name: string;
    specialty: string | null;
    affiliation: string | null;
    link: string;
  }>;
}

interface Citation {
  entity_type: 'substance' | 'claim' | 'case' | 'expert';
  entity_id: string;
  display_name: string;
  link: string;
}

interface AskRequest {
  question: string;
  lane?: Lane;
}

/**
 * Build the grounding context: search, fetch enriched rows, structure them.
 */
async function buildGrounding(question: string): Promise<GroundingPayload> {
  const searchResults = await searchEverything(question);

  const substances = new Map<string, Substance>();
  const claims = new Map<string, CertifiedClaimRow>();
  const cases = new Map<string, LegalCase>();
  const experts = new Map<string, { id: string; name: string; specialty: string | null }>();

  // Collect unique IDs from search results
  const substanceIds = new Set<string>();
  const claimIds = new Set<string>();
  const caseIds = new Set<string>();

  for (const result of searchResults) {
    if (result.type === 'substance') substanceIds.add(result.id);
    if (result.type === 'claim') claimIds.add(result.id);
    if (result.type === 'case') caseIds.add(result.id);
  }

  // Fetch full substance rows
  if (substanceIds.size > 0) {
    const { data } = await supabaseTox
      .from('substances')
      .select('id, name, cas_number, description, molecular_formula')
      .in('id', Array.from(substanceIds));
    (data ?? []).forEach((s: any) => substances.set(s.id, { id: s.id, name: s.name, cas_number: s.cas_number, description: s.description, molecular_formula: s.molecular_formula }));
  }

  // Fetch full claim rows with evidence
  if (claimIds.size > 0) {
    const { data } = await supabaseTox
      .from('certified_claims_with_evidence')
      .select('*')
      .in('claim_id', Array.from(claimIds));
    (data ?? []).forEach((c: CertifiedClaimRow) => claims.set(c.claim_id, c));
  }

  // Fetch full case rows
  if (caseIds.size > 0) {
    const { data } = await supabaseTox
      .from('legal_cases')
      .select('id, name, short_name, jurisdiction, filed_year, description, court, status, case_number, lead_expert_id');
    (data ?? []).forEach((c: any) => cases.set(c.id, { id: c.id, name: c.name, short_name: c.short_name, jurisdiction: c.jurisdiction, filed_year: c.filed_year, description: c.description, court: c.court, status: c.status, case_number: c.case_number, lead_expert_id: c.lead_expert_id }));
  }

  // Fetch lead experts directly via legal_cases.lead_expert_id (real schema; no expert_case_appearances table exists)
  const leadExpertIds = Array.from(cases.values())
    .map((c: any) => c.lead_expert_id)
    .filter((id): id is string => Boolean(id));
  if (leadExpertIds.length > 0) {
    const { data: leadExperts } = await supabaseTox
      .from('experts')
      .select('id, name, specialty')
      .in('id', leadExpertIds);
    (leadExperts ?? []).forEach((e: any) => {
      experts.set(e.id, { id: e.id, name: e.name, specialty: e.specialty });
    });
  }

  // Also pull expert-tagged case_parties (role contains "expert"), then look up experts table by name match
  if (caseIds.size > 0) {
    const { data: partyExperts } = await supabaseTox
      .from('case_parties')
      .select('name, role, case_id')
      .in('case_id', Array.from(caseIds))
      .ilike('role', '%expert%');
    const partyNames = Array.from(new Set((partyExperts ?? []).map((p: any) => p.name).filter(Boolean)));
    if (partyNames.length > 0) {
      const { data: matchedExperts } = await supabaseTox
        .from('experts')
        .select('id, name, specialty')
        .in('name', partyNames);
      (matchedExperts ?? []).forEach((e: any) => {
        experts.set(e.id, { id: e.id, name: e.name, specialty: e.specialty });
      });
    }
  }

  // If question mentions "Dr. Dahlgren", fetch him specifically
  if (/dahlgren/i.test(question)) {
    const { data: dahlgrenData } = await supabaseTox
      .from('experts')
      .select('id, name, specialty')
      .ilike('name', '%Dahlgren%')
      .limit(1);
    if (dahlgrenData && dahlgrenData.length > 0) {
      const expert = dahlgrenData[0];
      experts.set(expert.id, {
        id: expert.id,
        name: expert.name,
        specialty: expert.specialty,
      });
    }
  }

  // Build the payload
  const payload: GroundingPayload = {
    substances: Array.from(substances.values()).map((s) => ({
      id: s.id,
      name: s.name,
      cas_number: s.cas_number,
      description: s.description,
      link: `/compound/${slug(s.name)}`,
    })),
    claims: Array.from(claims.values()).map((c) => ({
      id: c.claim_id,
      substance_name: c.substance_name,
      endpoint_name: c.endpoint_name,
      status: c.status,
      confidence_score: c.confidence_score,
      effect_summary: c.effect_summary,
      sources: c.sources,
      link: `/compound/${slug(c.substance_name)}#claim-${c.claim_id}`,
    })),
    cases: Array.from(cases.values()).map((c: any) => ({
      id: c.id,
      name: c.name,
      short_name: c.short_name,
      jurisdiction: c.jurisdiction,
      filed_year: c.filed_year,
      description: c.description,
      link: `/case/${slug(c.short_name)}`,
    })),
    experts: Array.from(experts.values()).map((e) => {
      // Slug from last name in `name` (e.g. "James G. Dahlgren, M.D." -> "dahlgren")
      const cleaned = (e.name || '').replace(/,?\s*(M\.?D\.?|Ph\.?D\.?|Esq\.?|Jr\.?|Sr\.?)\.?$/i, '').trim();
      const lastName = cleaned.split(/\s+/).pop() || 'unknown';
      return {
        id: e.id,
        name: e.name,
        specialty: e.specialty,
        affiliation: null,
        link: `/expert/${lastName.toLowerCase()}`,
      };
    }),
  };

  return payload;
}

/**
 * Build system prompt tailored to the lane.
 */
function buildSystemPrompt(lane: Lane): string {
  const basePrompt = `You are Ask the Garden, the AI surface for the Toxicology Knowledge Garden — a curated evidence platform built around Dr. James G. Dahlgren M.D.'s 50 years of toxicology expert-witness work. You are NOT a general-purpose LLM. You answer questions ONLY by citing the grounding rows provided in the user's message. The grounding rows are real, retrieved, tier-stratified evidence sources from the platform's database.

CRITICAL RULES:
1. Cite EVERY factual claim using inline [n] markers that map to the citations array in your final response. Inline markers go right after the sentence they support.
2. NEVER invent a fact, study, source, or attribution that is not in the supplied grounding rows. If the grounding does not contain the answer, say so explicitly: "The garden does not yet have curated evidence on this question — I'd suggest this as a research backlog item if you'd like." Then suggest the closest available topics from the grounding.
3. Keep responses tight: 2-5 sentences for simple questions, 1-2 short paragraphs for complex ones. Never exceed 250 words.
4. End every response with a confidence indicator: 'high' (multi-source consensus), 'medium' (some sources, some uncertainty), 'low' (sparse grounding, suggest broadening).

The garden's curator is Dr. Dahlgren. When asked about him directly, answer factually from the experts grounding row. Do not lionize.`;

  if (lane === 'consumer') {
    return (
      basePrompt +
      `

CONSUMER LANE:
- Use plain language, avoid jargon, hide CAS numbers and tier badges.
- Lead with concrete exposure sources: "found in", "can be reduced by".
- Focus on practical actions: what to avoid, what to monitor.
- Avoid dose-response tables; explain via analogy.`
    );
  }

  if (lane === 'clinician') {
    return (
      basePrompt +
      `

CLINICIAN LANE:
- Lead with mechanism and dose-response.
- Name biomarkers and exposure routes.
- Surface peer-review tier per claim (tier 1 = regulatory, 2 = systematic review, 3 = peer-reviewed, 4 = industry/news).
- Flag contested vs. certified claims.
- Mention cohort size and study years when available.`
    );
  }

  return (
    basePrompt +
    `

COUNSEL LANE:
- Lead with Daubert posture: certified vs. contested counts, regulatory tier (1) vs. peer-review tier (3) prevalence.
- Surface verbatim quotes from supporting and contradicting sources.
- Name the cohort/study jurisdiction and year.
- Flag if the claim lacks regulatory (tier 1) support.
- Highlight any contested or retracted sources.`
  );
}

/**
 * Stream a response with SSE-like event delimiters.
 */
async function streamResponse(
  question: string,
  grounding: GroundingPayload,
  lane: Lane,
  writeToStream: (event: { type: string; [key: string]: any }) => void
): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  // Build the user message with grounding
  const groundingText = JSON.stringify(grounding, null, 2);
  const userMessage = `
User question: "${question}"

Grounding context (retrieved from the garden):
${groundingText}

Please answer the question using ONLY the grounding context above. Use inline [n] citations throughout.
`;

  let fullText = '';
  let citationCount = 0;

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: buildSystemPrompt(lane),
    messages: [{ role: 'user', content: userMessage }],
  });

  for await (const event of stream) {
    if (
      event.type === 'content_block_delta' &&
      'delta' in event &&
      event.delta.type === 'text_delta' &&
      'text' in event.delta
    ) {
      const text = event.delta.text;
      fullText += text;

      // Count citations in this chunk
      const matches = text.match(/\[\d+\]/g);
      if (matches) {
        citationCount = Math.max(citationCount, ...matches.map((m) => parseInt(m.slice(1, -1), 10)));
      }

      writeToStream({ type: 'text_delta', delta: text });
    }
  }

  return fullText;
}

/**
 * Determine confidence level from grounding.
 */
function calculateConfidence(grounding: GroundingPayload): 'high' | 'medium' | 'low' {
  const totalSources = grounding.claims.reduce((sum, c) => sum + c.sources.length, 0);
  const uniqueSourceCount = new Set(
    grounding.claims.flatMap((c) => c.sources.map((s) => s.url || s.doi || s.title))
  ).size;

  if (uniqueSourceCount >= 3 && grounding.claims.length >= 2) return 'high';
  if (uniqueSourceCount >= 2 || grounding.claims.length >= 1) return 'medium';
  return 'low';
}

/**
 * Extract citations from response text (looking for [n] markers).
 */
function extractCitations(text: string, grounding: GroundingPayload): Citation[] {
  const citationPattern = /\[\d+\]/g;
  const matches = text.match(citationPattern) || [];
  const uniqueIndices = new Set<number>();

  matches.forEach((match) => {
    const num = parseInt(match.slice(1, -1), 10);
    uniqueIndices.add(num);
  });

  const citations: Citation[] = [];
  const used = new Set<string>();

  // Use grounding in order: substances, claims, cases, experts
  let idx = 1;
  for (const substance of grounding.substances) {
    if (uniqueIndices.has(idx) && !used.has(`substance-${substance.id}`)) {
      citations.push({
        entity_type: 'substance',
        entity_id: substance.id,
        display_name: substance.name,
        link: substance.link,
      });
      used.add(`substance-${substance.id}`);
    }
    idx++;
  }

  for (const claim of grounding.claims) {
    if (uniqueIndices.has(idx) && !used.has(`claim-${claim.id}`)) {
      citations.push({
        entity_type: 'claim',
        entity_id: claim.id,
        display_name: `${claim.substance_name} × ${claim.endpoint_name}`,
        link: claim.link,
      });
      used.add(`claim-${claim.id}`);
    }
    idx++;
  }

  for (const legalCase of grounding.cases) {
    if (uniqueIndices.has(idx) && !used.has(`case-${legalCase.id}`)) {
      citations.push({
        entity_type: 'case',
        entity_id: legalCase.id,
        display_name: legalCase.short_name,
        link: legalCase.link,
      });
      used.add(`case-${legalCase.id}`);
    }
    idx++;
  }

  for (const expert of grounding.experts) {
    if (uniqueIndices.has(idx) && !used.has(`expert-${expert.id}`)) {
      citations.push({
        entity_type: 'expert',
        entity_id: expert.id,
        display_name: expert.name,
        link: expert.link,
      });
      used.add(`expert-${expert.id}`);
    }
    idx++;
  }

  return citations;
}

/**
 * POST handler: accept question, stream grounded response.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body: AskRequest = await request.json();
    const { question, lane = 'clinician' } = body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'question is required' }), { status: 400 });
    }

    // Build grounding
    let grounding: GroundingPayload;
    try {
      grounding = await buildGrounding(question);
    } catch (err) {
      console.error('Grounding build error:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to build grounding context', details: String(err) }),
        { status: 500 }
      );
    }

    // Stream the response
    const encoder = new TextEncoder();
    let responseText = '';

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          await streamResponse(question, grounding, lane, (event) => {
            if (event.type === 'text_delta') {
              responseText += event.delta;
            }
            const eventJson = JSON.stringify(event);
            controller.enqueue(encoder.encode(`data: ${eventJson}\n\n`));
          });

          // Send metadata (citations + confidence)
          const citations = extractCitations(responseText, grounding);
          const confidence = calculateConfidence(grounding);

          const metadata = {
            type: 'metadata',
            citations,
            confidence,
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(metadata)}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));

          controller.close();
        } catch (err) {
          const errorEvent = {
            type: 'error',
            message: String(err),
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('POST /api/ask error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error', details: String(err) }), {
      status: 500,
    });
  }
}
