// src/app/compound/[slug]/page.tsx
//
// P1.3 — Stratigraph SSR with 4 layered cards.
// 
// Card order (per Playbook §V and L-024 "Stratigraph uses 4 layered cards"):
//   1. Hazard    — what this substance does to health (claims by status)
//   2. Profile   — substance identity, exposure pathways, case-specific narrative
//   3. Response  — contested claims surfaced both ways
//   4. Citations — full evidence_sources list, tier-grouped
//
// Animation: .anim-layer-rise stagger (CSS keyframe per Playbook §III).
// DO NOT replace with tabs — that's the OKG pattern.
//
// Verified against schema 2026-05-19.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseTox } from '@/lib/supabase-tox';
import TopFrame from '@/components/grammar/TopFrame';
import LocationCrumb from '@/components/grammar/LocationCrumb';
import { quoteOrPending } from '@/lib/queries-tox';

// Skip static prerender: this page renders TopFrame (a client component that
// uses useSearchParams), and Next.js 16's prerender pass refuses to compile it
// without a page-level Suspense boundary. Force-dynamic side-steps that —
// the page is rendered on demand instead of at build time. generateStaticParams
// is kept below as documentation of the seed substances but is a no-op under
// force-dynamic.
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // Documentation of the seed substances. No-op under force-dynamic above.
  return [
    { slug: 'glyphosate' },
    { slug: 'pcbs' },
    { slug: 'tcdd' },
    { slug: 'microplastics' },
  ];
}

export const revalidate = 3600;

// ---------- Substance slug resolution ----------
// Matches a URL slug against:
//   1) parenthesized abbreviation in name (e.g., "Polychlorinated biphenyls (PCBs)" → "pcbs")
//   2) any case-insensitive alias
//   3) first word of name lowercased
async function resolveSubstance(slug: string) {
  const supabase = supabaseTox;

  // Try alias match first (matches "pcbs" → aliases including "Aroclor" won't, but
  // also won't for PCBs case — actually aliases for PCBs are ["Aroclor", "Pyralene"]
  // not "PCBs". So we need name + alias matching combined.)
  //
  // Use a custom SQL function or query both forms. Simplest is to fetch all
  // substances and filter in app (only 7 rows currently).
  const { data: all } = await supabase
    .from('substances')
    .select('id, name, cas_number, aliases, substance_class, description, molecular_formula, molecular_weight, pubchem_cid');

  if (!all) return null;

  const target = slug.toLowerCase();
  const match = all.find((s: any) => {
    const name = s.name as string;
    const aliases = (s.aliases ?? []) as string[];
    // parenthesized abbrev
    const paren = name.match(/\(([^)]+)\)/);
    if (paren && paren[1].toLowerCase().replace(/[^a-z0-9]/g, '') === target.replace(/[^a-z0-9]/g, '')) return true;
    // first word
    const firstWord = name.split(/\s+/)[0].toLowerCase();
    if (firstWord === target) return true;
    // alias match
    if (aliases.some((a) => a.toLowerCase() === target)) return true;
    return false;
  });

  return match ?? null;
}

async function getSubstanceBundle(slug: string) {
  const supabase = supabaseTox;
  const substance = await resolveSubstance(slug);
  if (!substance) return null;

  // Pull claims + evidence + sources for the 4 layered cards
  const [claimsRes, evidenceRes, casesRes] = await Promise.all([
    supabase
      .from('certified_claims_with_evidence')
      .select('*')
      .eq('substance_id', substance.id)
      .order('confidence_score', { ascending: false }),
    supabase
      .from('claim_evidence')
      .select('claim_id, supports, weight, verbatim_quote, page_or_section, source:evidence_sources!inner(id, title, publisher, year, tier, doi, url, authors)')
      .order('weight', { ascending: false }),
    supabase
      .from('case_substances')
      .select('case:legal_cases!inner(id, name, short_name, jurisdiction, court, filed_year)')
      .eq('substance_id', substance.id),
  ]);

  // Filter evidence to only this substance's claims
  const claimIds = new Set((claimsRes.data ?? []).map((c: any) => c.claim_id));
  const evidence = (evidenceRes.data ?? []).filter((e: any) => claimIds.has(e.claim_id));

  return {
    substance,
    claims: claimsRes.data ?? [],
    evidence,
    cases: (casesRes.data ?? []).map((cs: any) => cs.case),
  };
}

export default async function CompoundPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getSubstanceBundle(slug);
  if (!bundle) notFound();

  const { substance, claims, evidence, cases } = bundle;

  const certified   = claims.filter((c: any) => c.status === 'certified');
  const provisional = claims.filter((c: any) => c.status === 'provisional');
  const contested   = claims.filter((c: any) => c.status === 'contested');

  // Unique sources for the citations card
  const sourceMap = new Map();
  evidence.forEach((e: any) => {
    if (e.source && !sourceMap.has(e.source.id)) sourceMap.set(e.source.id, e.source);
  });
  const sources = Array.from(sourceMap.values()).sort((a: any, b: any) => a.tier - b.tier);

  return (
    <main className="min-h-screen bg-paper">
      <TopFrame />
      <div className="rail-default">
        <LocationCrumb />

        {/* HERO */}
        <section className="section-pad-lg">
          <div className="mono-eyebrow">
            {substance.substance_class ? 'Substance class' : 'Chemical compound'}
          </div>
          <h1 className="headline-bold mt-2 text-ink">{substance.name}</h1>
          <div className="subtitle-bold mt-1 text-ink-soft">
            {substance.cas_number && <>CAS {substance.cas_number} · </>}
            {substance.aliases?.length > 0 && <>Also: {substance.aliases.join(', ')}</>}
          </div>
          {substance.description && (
            <p className="body-readable-wide mt-6">{substance.description}</p>
          )}
        </section>

        {/* 4 LAYERED CARDS (NOT TABS — Stratigraph pattern) */}
        <section className="section-pad stagger">

          {/* CARD 1 — HAZARD */}
          <article className="tile tile-feature anim-layer-rise">
            <div className="mono-eyebrow text-tox">Layer 1 · Hazard</div>
            <h2 className="title-bold mt-1 text-ink text-2xl">What it does</h2>
            <p className="body-readable mt-2 text-ink-soft">
              {claims.length} curated claim{claims.length === 1 ? '' : 's'} across {sources.length} sources.
              Status mix: {certified.length} certified, {provisional.length} provisional, {contested.length} contested.
            </p>
            <div className="mt-4 grid gap-2">
              {claims.slice(0, 6).map((claim: any) => (
                <div key={claim.claim_id} className="tile-inner">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <StatusBadge status={claim.status} />
                    <span className="mono-eyebrow">{claim.endpoint_name}</span>
                    {claim.source_count && (
                      <span className="label-mono text-ink-soft">{claim.source_count} sources</span>
                    )}
                  </div>
                  <p className="body-readable mt-2 text-ink">{claim.effect_summary}</p>
                </div>
              ))}
              {claims.length > 6 && (
                <div className="body-readable text-ink-soft text-sm">
                  + {claims.length - 6} more claim{claims.length - 6 === 1 ? '' : 's'} below
                </div>
              )}
            </div>
          </article>

          {/* CARD 2 — PROFILE */}
          <article className="tile tile-feature anim-layer-rise">
            <div className="mono-eyebrow text-tox">Layer 2 · Profile</div>
            <h2 className="title-bold mt-1 text-ink text-2xl">Substance identity</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="label-mono">Chemical identity</div>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  {substance.cas_number && (
                    <>
                      <dt className="text-ink-soft">CAS Number</dt>
                      <dd className="font-mono text-ink">{substance.cas_number}</dd>
                    </>
                  )}
                  {substance.molecular_formula && (
                    <>
                      <dt className="text-ink-soft">Formula</dt>
                      <dd className="font-mono text-ink">{substance.molecular_formula}</dd>
                    </>
                  )}
                  {substance.molecular_weight && (
                    <>
                      <dt className="text-ink-soft">MW</dt>
                      <dd className="font-mono text-ink">{Number(substance.molecular_weight).toFixed(2)} g/mol</dd>
                    </>
                  )}
                  {substance.pubchem_cid && (
                    <>
                      <dt className="text-ink-soft">PubChem CID</dt>
                      <dd className="font-mono text-ink">{substance.pubchem_cid}</dd>
                    </>
                  )}
                </dl>
              </div>
              {cases.length > 0 && (
                <div>
                  <div className="label-mono">Linked cases</div>
                  <ul className="mt-2 space-y-2">
                    {cases.map((cs: any) => (
                      <li key={cs.id}>
                        <Link
                          href={`/case/${(cs.short_name ?? cs.name).toLowerCase().split(' ').slice(0, 2).join('-')}`}
                          className="title-bold text-ink hover:text-tox"
                        >
                          {cs.short_name ?? cs.name}
                        </Link>
                        <div className="mono-eyebrow text-ink-soft">
                          {cs.jurisdiction} · {cs.filed_year}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>

          {/* CARD 3 — RESPONSE (contested both-ways) */}
          <article className="tile tile-feature anim-layer-rise">
            <div className="mono-eyebrow text-tox">Layer 3 · Response</div>
            <h2 className="title-bold mt-1 text-ink text-2xl">Contested evidence, both ways</h2>
            <p className="body-readable mt-2 text-ink-soft">
              {contested.length > 0
                ? `${contested.length} claim${contested.length === 1 ? '' : 's'} where defense and plaintiff experts have published countervailing evidence. Both postures shown here.`
                : 'No contested claims for this substance currently in the dataset. As contested literature ships, this layer surfaces both sides for each contested cite.'}
            </p>
            {contested.length > 0 && (
              <div className="mt-4 grid gap-3">
                {contested.map((claim: any) => {
                  const claimEvidence = evidence.filter((e: any) => e.claim_id === claim.claim_id);
                  const supports = claimEvidence.filter((e: any) => e.supports);
                  const contests = claimEvidence.filter((e: any) => !e.supports);
                  return (
                    <div key={claim.claim_id} className="tile-inner">
                      <p className="body-readable text-ink">{claim.effect_summary}</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <ContestedColumn label="Supports" rows={supports} />
                        <ContestedColumn label="Contests" rows={contests} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          {/* CARD 4 — CITATIONS */}
          <article className="tile tile-feature anim-layer-rise">
            <div className="mono-eyebrow text-tox">Layer 4 · Citations</div>
            <h2 className="title-bold mt-1 text-ink text-2xl">The evidence bedrock</h2>
            <p className="body-readable mt-2 text-ink-soft">
              {sources.length} sources cited across the {claims.length} claims above. Tier-tagged. Version-pinned.
            </p>
            <div className="mt-4 grid gap-2">
              {[1, 2, 3, 4].map((tier) => {
                const tierSources = sources.filter((s: any) => s.tier === tier);
                if (tierSources.length === 0) return null;
                return (
                  <div key={tier} className="tile-inner">
                    <div className="mono-eyebrow text-copper">
                      Tier {tier} · {tierLabel(tier)} · {tierSources.length} source{tierSources.length === 1 ? '' : 's'}
                    </div>
                    <ul className="mt-2 space-y-2">
                      {tierSources.map((s: any) => (
                        <li key={s.id} className="border-l-2 border-paper-line pl-3">
                          <div className="title-bold text-ink text-sm">{s.title}</div>
                          <div className="mono-eyebrow text-ink-soft mt-1">
                            {s.publisher} · {s.year}
                            {s.doi && <> · doi: {s.doi}</>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </article>

        </section>

        {/* Counsel CTA */}
        {cases.length > 0 && (
          <section className="section-pad-lg">
            <div className="tile tile-feature flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mono-eyebrow">Counsel lane</div>
                <div className="title-bold text-ink">Build a Daubert-grade exhibit packet for this substance</div>
              </div>
              <Link
                href={`/flow/counsel/${(cases[0].short_name ?? cases[0].name).toLowerCase().split(' ').slice(0, 2).join('-')}`}
                className="cta-pill cta-pill-primary cta-pill-lg"
              >
                Open Counsel flow →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ---------- Sub-components ----------

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'certified' ? 'bg-tox-pale text-tox-deep border-tox' :
    status === 'contested' ? 'bg-crimson-pale text-crimson border-crimson' :
                              'bg-peach-pale text-peach-deep border-peach-deep';
  return (
    <span className={`mono-eyebrow inline-flex items-center border px-2 py-0.5 ${cls}`}>
      {status}
    </span>
  );
}

function ContestedColumn({ label, rows }: { label: string; rows: any[] }) {
  return (
    <div className="tile-inner">
      <div className="mono-eyebrow">{label}</div>
      {rows.length === 0 && (
        <div className="body-readable text-ink-soft text-sm mt-2">No sources on file.</div>
      )}
      {rows.slice(0, 2).map((r: any, i: number) => (
        <div key={i} className="mt-2">
          <div className="title-bold text-ink text-sm">
            {r.source?.title?.slice(0, 70)}{r.source?.title?.length > 70 ? '…' : ''}
          </div>
          <div className="mono-eyebrow text-ink-soft mt-1">
            T{r.source?.tier} · {r.source?.publisher} · {r.source?.year}
          </div>
          <div className="body-readable text-ink-soft text-sm mt-1 italic">
            {quoteOrPending(r.verbatim_quote).text}
          </div>
        </div>
      ))}
    </div>
  );
}

function tierLabel(tier: number): string {
  switch (tier) {
    case 1: return 'Regulatory';
    case 2: return 'Systematic Review / Meta-analysis';
    case 3: return 'RCT / Cohort';
    case 4: return 'Mechanistic / Other';
    default: return 'Unknown';
  }
}
