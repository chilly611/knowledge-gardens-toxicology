// src/app/flow/counsel/[caseSlug]/page.tsx
//
// P1.2 — Counsel flow with case pre-loaded. Fully SSR'd.
//
// Five stages (Frame, Assemble, Argue, Witness, File) render server-side
// stacked vertically. The StageStepper at top is anchor-linked for scroll.
// No client wrapper needed for first paint depth.

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseTox } from '@/lib/supabase-tox';
import TopFrame from '@/components/grammar/TopFrame';
import LocationCrumb from '@/components/grammar/LocationCrumb';
import { quoteOrPending } from '@/lib/queries-tox';

// Skip static prerender: TopFrame (a client component used in the page) reads
// useSearchParams without a page-level Suspense boundary, and Next.js 16 fails
// the prerender pass on that. force-dynamic renders on demand. revalidate is
// effectively ignored once force-dynamic is set but kept for documentation.
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [{ caseSlug: 'sky-valley' }];
}

export const revalidate = 3600;

const STAGES = [
  { key: 'frame',    label: 'Frame',    artifact: 'Theory of Harm Memo' },
  { key: 'assemble', label: 'Assemble', artifact: 'Source Bibliography' },
  { key: 'argue',    label: 'Argue',    artifact: 'Contested-Claims Daubert Table' },
  { key: 'witness',  label: 'Witness',  artifact: 'Rule 26 Expert Disclosure' },
  { key: 'file',     label: 'File',     artifact: 'Case-Prep Exhibit Packet' },
] as const;

type CaseRow = {
  id: string;
  name: string;
  short_name: string | null;
  jurisdiction: string | null;
  court: string | null;
  case_number: string | null;
  status: string | null;
  filed_year: number | null;
  description: string | null;
  lead_expert_id: string | null;
};

async function getCounselFlowData(slug: string) {
  const supabase = supabaseTox;

  // Resolve case by slug, with slugify-on-read fallback for pre-migration safety
  let caseRow: CaseRow | null = null;
  const { data: bySlug, error: slugErr } = await supabase
    .from('legal_cases')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (!slugErr && bySlug) {
    caseRow = bySlug as CaseRow;
  } else {
    const slugAsPhrase = slug.replace(/-/g, ' ');
    const { data: byShort } = await supabase
      .from('legal_cases')
      .select('*')
      .ilike('short_name', `${slugAsPhrase}%`)
      .limit(1)
      .maybeSingle();
    caseRow = byShort as CaseRow | null;
  }
  if (!caseRow) return null;

  const [substancesRes, expertRes, docCountRes, partiesRes] = await Promise.all([
    supabase
      .from('case_substances')
      .select('substance:substances!inner(id, name, cas_number)')
      .eq('case_id', caseRow.id),
    caseRow.lead_expert_id
      ? supabase
          .from('experts')
          .select('id, name, affiliation, specialty, bio')
          .eq('id', caseRow.lead_expert_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('case_documents')
      .select('id', { count: 'exact', head: true })
      .eq('case_id', caseRow.id),
    supabase
      .from('case_parties')
      .select('id, name, role')
      .eq('case_id', caseRow.id),
  ]);

  const substances = (substancesRes.data ?? []).map((cs: any) => cs.substance);
  const substanceIds = substances.map((s: any) => s.id).filter(Boolean);

  // Contested claims + both-sides evidence for the Argue stage
  const [contestedSupportRes, evidenceRes] = substanceIds.length
    ? await Promise.all([
        supabase
          .from('claims')
          .select('id, effect_summary, status, substance:substances!inner(name)')
          .in('substance_id', substanceIds)
          .eq('status', 'contested'),
        supabase
          .from('claim_evidence')
          .select('claim_id, supports, weight, verbatim_quote, source:evidence_sources!inner(title, publisher, year, tier)')
          .order('weight', { ascending: false })
          .limit(60),
      ])
    : [{ data: [] }, { data: [] }];

  // Tier-1 bibliography sample for Assemble stage
  const bibliographyRes = substanceIds.length
    ? await supabase
        .from('certified_claims_with_evidence')
        .select('claim_id, substance_name, endpoint_name, effect_summary, source_count')
        .in('substance_id', substanceIds)
        .limit(8)
    : { data: [] };

  return {
    case: caseRow,
    substances,
    expert: expertRes.data,
    documentCount: docCountRes.count ?? 0,
    parties: partiesRes.data ?? [],
    contestedClaims: contestedSupportRes.data ?? [],
    evidence: evidenceRes.data ?? [],
    bibliography: bibliographyRes.data ?? [],
  };
}

export default async function CounselFlowPage({
  params,
}: {
  params: Promise<{ caseSlug: string }>;
}) {
  const { caseSlug } = await params;
  const data = await getCounselFlowData(caseSlug);
  if (!data) notFound();

  const { case: c, substances, expert, documentCount, parties, contestedClaims, evidence, bibliography } = data;
  const substanceNames = substances.map((s: any) => s.name).join(' + ');
  const plaintiffs = parties.filter((p: any) => p.role?.toLowerCase().includes('plaintiff'));

  return (
    <main className="min-h-screen bg-paper">
      <TopFrame />
      <div className="rail-default">
        <LocationCrumb />

        <section className="section-pad-lg">
          <div className="mono-eyebrow">Counsel Lane · Case Loaded</div>
          <h1 className="headline-bold mt-2 text-ink">{c.short_name ?? c.name}</h1>
          <div className="subtitle-bold mt-1 text-ink-soft">
            {substanceNames} · {c.jurisdiction} · {c.court}
          </div>
          <p className="body-readable-wide mt-6">
            Five stages to a Daubert-grade exhibit packet. {documentCount.toLocaleString()} documents on record
            {contestedClaims.length > 0
              ? `, ${contestedClaims.length} contested claim${contestedClaims.length === 1 ? '' : 's'} surfaced both ways`
              : ''}
            {expert ? `, led by ${expert.name}.` : '.'}
          </p>
        </section>

        {/* STAGE 1 — FRAME */}
        <section id="stage-frame" className="section-pad scroll-mt-24">
          <StageHeader index={1} stage={STAGES[0]} />
          <div className="tile tile-feature">
            <p className="body-readable-wide">
              <strong>The theory of harm.</strong> {c.description}
            </p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="label-mono">Substances at issue</div>
                <ul className="mt-2 space-y-1">
                  {substances.map((s: any) => (
                    <li key={s.id} className="title-bold text-ink">
                      {s.name}
                      {s.cas_number && <span className="mono-eyebrow ml-2 text-ink-soft">CAS {s.cas_number}</span>}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="label-mono">Plaintiffs</div>
                <ul className="mt-2 space-y-1">
                  {plaintiffs.slice(0, 5).map((p: any) => (
                    <li key={p.id} className="title-bold text-ink">{p.name}</li>
                  ))}
                  {plaintiffs.length > 5 && (
                    <li className="body-readable text-ink-soft">+ {plaintiffs.length - 5} more</li>
                  )}
                </ul>
              </div>
            </div>
            <ArtifactRow artifact={STAGES[0].artifact} href={`/pdf-preview/counsel?case=${caseSlug}&stage=frame`} />
          </div>
        </section>

        {/* STAGE 2 — ASSEMBLE */}
        <section id="stage-assemble" className="section-pad scroll-mt-24">
          <StageHeader index={2} stage={STAGES[1]} />
          <div className="tile tile-feature">
            <p className="body-readable-wide">
              {bibliography.length} canonical claims from {substanceNames}, tier-tagged and pre-cited.
              Each is bates-numberable; each has the source under it.
            </p>
            <div className="mt-4 grid gap-2">
              {bibliography.slice(0, 6).map((b: any) => (
                <div key={b.claim_id} className="tile-inner">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="mono-eyebrow">{b.substance_name}</span>
                    <span className="label-mono text-ink-soft">{b.source_count} sources</span>
                  </div>
                  <p className="body-readable mt-2 text-ink">
                    {b.effect_summary?.slice(0, 220)}{b.effect_summary?.length > 220 ? '…' : ''}
                  </p>
                </div>
              ))}
            </div>
            <ArtifactRow artifact={STAGES[1].artifact} href={`/pdf-preview/counsel?case=${caseSlug}&stage=assemble`} />
          </div>
        </section>

        {/* STAGE 3 — ARGUE */}
        <section id="stage-argue" className="section-pad scroll-mt-24">
          <StageHeader index={3} stage={STAGES[2]} />
          <div className="tile tile-feature">
            <p className="body-readable-wide">
              Every contested claim surfaced both ways. The plaintiff posture on the left, the defense posture
              on the right. Each cite is tier-tagged and version-pinned.
            </p>

            {contestedClaims.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {contestedClaims.map((claim: any) => {
                  const claimEvidence = evidence.filter((e: any) => e.claim_id === claim.id);
                  const supports = claimEvidence.filter((e: any) => e.supports);
                  const contests = claimEvidence.filter((e: any) => !e.supports);
                  return (
                    <div key={claim.id} className="tile-inner">
                      <div className="title-bold text-ink">{claim.substance.name}</div>
                      <p className="body-readable mt-1">{claim.effect_summary}</p>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <SourceColumn label="Plaintiff posture" tone="certified" rows={supports} />
                        <SourceColumn label="Defense posture" tone="contested" rows={contests} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="tile-inner mt-4">
                <p className="body-readable text-ink-soft">
                  No contested claims linked to this case&apos;s substances yet. As the dataset deepens, this stage
                  will surface every claim where defense experts have published countervailing evidence.
                </p>
              </div>
            )}

            <ArtifactRow artifact={STAGES[2].artifact} href={`/pdf-preview/counsel?case=${caseSlug}&stage=argue`} />
          </div>
        </section>

        {/* STAGE 4 — WITNESS */}
        <section id="stage-witness" className="section-pad scroll-mt-24">
          <StageHeader index={4} stage={STAGES[3]} />
          <div className="tile tile-feature">
            {expert ? (
              <>
                <div className="mono-eyebrow">Lead expert</div>
                <div className="title-bold text-ink text-2xl mt-1">{expert.name}</div>
                {expert.affiliation && (
                  <div className="body-readable text-ink-soft">{expert.affiliation}</div>
                )}
                {expert.specialty && (
                  <p className="body-readable mt-3">{expert.specialty}</p>
                )}
                {expert.bio && (
                  <p className="body-readable text-ink-soft mt-2">{expert.bio}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/expert/${slugifyExpertName(expert.name)}`}
                    className="cta-pill cta-pill-secondary"
                  >
                    Full expert profile →
                  </Link>
                </div>
              </>
            ) : (
              <p className="body-readable text-ink-soft">No lead expert assigned.</p>
            )}
            <ArtifactRow artifact={STAGES[3].artifact} href={`/pdf-preview/counsel?case=${caseSlug}&stage=witness`} />
          </div>
        </section>

        {/* STAGE 5 — FILE */}
        <section id="stage-file" className="section-pad-lg scroll-mt-24">
          <StageHeader index={5} stage={STAGES[4]} />
          <div className="tile tile-feature flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="title-bold text-ink text-xl">Case-Prep Exhibit Packet</div>
              <p className="body-readable text-ink-soft mt-2 max-w-prose">
                Chambers-ready PDF. Bradford Hill mapped per claim. Tier-tagged source bibliography.
                Bates-numberable citations. Pre-formatted for FRCP Rule 26(a)(2)(B). Signed by {expert?.name ?? 'lead expert'}.
              </p>
            </div>
            <Link
              href={`/pdf-preview/counsel?case=${caseSlug}`}
              className="cta-pill cta-pill-primary cta-pill-lg"
            >
              Preview the packet →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

// ---------- Sub-components ----------

function StageHeader({ index, stage }: { index: number; stage: typeof STAGES[number] }) {
  return (
    <div className="mb-4">
      <div className="mono-eyebrow">Stage {index} · {stage.label}</div>
      <h2 className="title-bold mt-1 text-ink text-2xl">{stage.label}</h2>
    </div>
  );
}

function ArtifactRow({ artifact, href }: { artifact: string; href: string }) {
  return (
    <div className="mt-6 flex items-center justify-between border-t border-paper-line pt-4">
      <div className="mono-eyebrow text-copper">Produces · {artifact}</div>
      <Link href={href} className="cta-pill cta-pill-ghost">
        View artifact →
      </Link>
    </div>
  );
}

function SourceColumn({
  label,
  tone,
  rows,
}: {
  label: string;
  tone: 'certified' | 'contested';
  rows: any[];
}) {
  const borderClass = tone === 'certified' ? 'border-tox' : 'border-crimson';
  return (
    <div className={`tile-inner border-l-4 ${borderClass}`}>
      <div className="mono-eyebrow">{label}</div>
      {rows.length === 0 && (
        <div className="body-readable text-ink-soft text-sm mt-2">No sources on file.</div>
      )}
      {rows.slice(0, 3).map((r: any, i: number) => (
        <div key={i} className="mt-2">
          <div className="title-bold text-ink text-sm">
            {r.source?.title?.slice(0, 80)}{r.source?.title?.length > 80 ? '…' : ''}
          </div>
          <div className="mono-eyebrow mt-1">
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

function slugifyExpertName(name: string): string {
  const match = name.match(/(\w+)(?:,)?\s*M\.D\./);
  if (match) return match[1].toLowerCase();
  return name.split(/\s+/).slice(-1)[0].toLowerCase().replace(/[^a-z0-9]/g, '');
}
