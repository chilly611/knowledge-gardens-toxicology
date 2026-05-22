// src/app/expert/[slug]/page.tsx
//
// P1.4 — Expert profile SSR depth.
//
// Stored bio is thin (~30 words). Depth comes from joins:
//   - Cases where this expert is lead_expert_id
//   - Substances in this expert's specialty area
//   - Curated claims those substances appear in
//   - Reference contributions (if cross_garden_links surface them)
//
// The /expert/dahlgren route is the canonical entry point opposing counsel
// will hit during discovery on the expert. Must read as a research workbench,
// not a stub.
//
// Verified against schema 2026-05-19. Assumes migration 010 applied OR
// uses the slugify-on-read fallback.

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseTox } from '@/lib/supabase-tox';
import TopFrame from '@/components/grammar/TopFrame';
import LocationCrumb from '@/components/grammar/LocationCrumb';

// Skip static prerender: TopFrame (client component used inline) reads
// useSearchParams without a page-level Suspense boundary, and Next.js 16
// fails prerender on that. Render on demand instead.
export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return [{ slug: 'dahlgren' }];
}

export const revalidate = 3600;

type Expert = {
  id: string;
  name: string;
  affiliation: string | null;
  specialty: string | null;
  bio: string | null;
};

async function getExpertBundle(slug: string) {
  const supabase = supabaseTox;

  // Resolve expert by slug column (post-migration) or by last-name match (pre-migration)
  let expert: Expert | null = null;
  const { data: bySlug, error: slugErr } = await supabase
    .from('experts')
    .select('id, name, affiliation, specialty, bio')
    .eq('slug', slug)
    .maybeSingle();
  
  if (!slugErr && bySlug) {
    expert = bySlug as Expert;
  } else {
    // Fallback: case-insensitive last-name match
    const { data: byName } = await supabase
      .from('experts')
      .select('id, name, affiliation, specialty, bio')
      .ilike('name', `%${slug}%`)
      .limit(1)
      .maybeSingle();
    expert = byName as Expert | null;
  }

  if (!expert) return null;

  // Cases led by this expert
  const casesRes = await supabase
    .from('legal_cases')
    .select('id, name, short_name, jurisdiction, court, filed_year, status, description')
    .eq('lead_expert_id', expert.id);
  
  const cases = casesRes.data ?? [];

  // Per-case document counts (avoids pulling 1,959 docs)
  const caseDocCounts = await Promise.all(
    cases.map(async (c: any) => {
      const { count } = await supabase
        .from('case_documents')
        .select('id', { count: 'exact', head: true })
        .eq('case_id', c.id);
      return { caseId: c.id, count: count ?? 0 };
    })
  );

  // Substances linked to this expert's cases (case_substances join)
  const caseIds = cases.map((c: any) => c.id);
  const substancesRes = caseIds.length
    ? await supabase
        .from('case_substances')
        .select('case_id, substance:substances!inner(id, name, cas_number, aliases)')
        .in('case_id', caseIds)
    : { data: [] };

  // Get the unique substance IDs to pull related claims
  const linkedSubstances = (substancesRes.data ?? []).map((cs: any) => cs.substance);
  const substanceIds = Array.from(new Set(linkedSubstances.map((s: any) => s.id)));

  // Top claims for those substances (highest confidence)
  const topClaimsRes = substanceIds.length
    ? await supabase
        .from('certified_claims_with_evidence')
        .select('claim_id, substance_name, endpoint_name, effect_summary, status, confidence_score, source_count')
        .in('substance_id', substanceIds)
        .order('confidence_score', { ascending: false })
        .limit(8)
    : { data: [] };

  // Cross-garden links where this expert is the source or referenced in case links
  const crossLinksRes = await supabase
    .from('cross_garden_links')
    .select('*')
    .eq('source_entity_id', expert.id);

  return {
    expert,
    cases,
    caseDocCounts: Object.fromEntries(caseDocCounts.map((c) => [c.caseId, c.count])),
    substances: linkedSubstances,
    topClaims: topClaimsRes.data ?? [],
    crossLinks: crossLinksRes.data ?? [],
  };
}

export default async function ExpertPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const bundle = await getExpertBundle(slug);
  if (!bundle) notFound();

  const { expert, cases, caseDocCounts, substances, topClaims, crossLinks } = bundle;

  // Surname for slug helpers
  const surnameSlug = slug;

  return (
    <main className="min-h-screen bg-paper">
      <TopFrame />
      <div className="rail-default">
        <LocationCrumb />

        {/* HERO with caduceus monogram */}
        <section className="section-pad-lg">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
            <div>
              <div className="mono-eyebrow">Expert · Toxicology</div>
              <h1 className="headline-bold mt-2 text-ink">{expert.name}</h1>
              {expert.affiliation && (
                <div className="subtitle-bold mt-1 text-ink-soft">{expert.affiliation}</div>
              )}
              {expert.specialty && (
                <p className="body-readable-wide mt-4 text-ink">{expert.specialty}</p>
              )}
              {expert.bio && (
                <p className="body-readable-wide mt-3 text-ink-soft">{expert.bio}</p>
              )}
            </div>
            {/* Caduceus monogram if asset is present */}
            <div className="md:w-48 flex-shrink-0">
              <Image
                src="/imagery/caduceus-jd-monogram-masked.webp"
                alt={`${expert.name} signature monogram`}
                width={192}
                height={256}
                className="opacity-90"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="section-pad">
          <div className="tile-grid-3">
            <div className="tile tile-feature">
              <div className="label-mono">Cases led</div>
              <div className="headline-bold text-tox-deep">{cases.length}</div>
            </div>
            <div className="tile tile-feature">
              <div className="label-mono">Substances curated</div>
              <div className="headline-bold text-tox-deep">{substances.length}</div>
            </div>
            <div className="tile tile-feature">
              <div className="label-mono">Documents indexed</div>
              <div className="headline-bold text-tox-deep">
                {(Object.values(caseDocCounts) as number[]).reduce((a, b) => a + b, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </section>

        {/* CASES LED */}
        <section className="section-pad">
          <h2 className="title-bold mb-4 text-ink text-2xl">Cases led as expert of record</h2>
          {cases.length === 0 ? (
            <p className="body-readable text-ink-soft">No cases currently linked.</p>
          ) : (
            <div className="grid gap-3">
              {cases.map((c: any) => (
                <div key={c.id} className="tile tile-feature">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <Link
                        href={`/case/${caseSlugFor(c)}`}
                        className="title-bold text-ink text-xl hover:text-tox"
                      >
                        {c.short_name ?? c.name}
                      </Link>
                      <div className="mono-eyebrow mt-1 text-ink-soft">
                        {c.jurisdiction} · {c.court} · {c.filed_year}
                      </div>
                    </div>
                    <div className="label-mono text-tox-deep">
                      {caseDocCounts[c.id]?.toLocaleString() ?? 0} docs
                    </div>
                  </div>
                  {c.description && (
                    <p className="body-readable mt-3 text-ink-soft">
                      {c.description?.slice(0, 280)}{c.description?.length > 280 ? '…' : ''}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/case/${caseSlugFor(c)}`}
                      className="cta-pill cta-pill-ghost"
                    >
                      Open case file →
                    </Link>
                    <Link
                      href={`/flow/counsel/${caseSlugFor(c)}`}
                      className="cta-pill cta-pill-secondary"
                    >
                      Open Counsel flow →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SUBSTANCES CURATED */}
        {substances.length > 0 && (
          <section className="section-pad">
            <h2 className="title-bold mb-4 text-ink text-2xl">Substances curated</h2>
            <div className="tile-grid-3">
              {substances.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/compound/${substanceSlugFor(s)}`}
                  className="tile hover:border-tox transition-colors"
                >
                  <div className="title-bold text-ink">{s.name}</div>
                  {s.cas_number && (
                    <div className="mono-eyebrow mt-1 text-ink-soft">CAS {s.cas_number}</div>
                  )}
                  {s.aliases?.length > 0 && (
                    <div className="body-readable text-ink-soft text-sm mt-2">
                      {s.aliases.slice(0, 3).join(', ')}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* TOP CLAIMS */}
        {topClaims.length > 0 && (
          <section className="section-pad">
            <h2 className="title-bold mb-4 text-ink text-2xl">Top claims from curated substances</h2>
            <div className="grid gap-3">
              {topClaims.map((claim: any) => (
                <div key={claim.claim_id} className="tile">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="mono-eyebrow">{claim.substance_name}</span>
                    <span className="label-mono text-ink-soft">{claim.endpoint_name}</span>
                    <span className="label-mono text-ink-soft">{claim.source_count} sources</span>
                  </div>
                  <p className="body-readable mt-2 text-ink">{claim.effect_summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CROSS-GARDEN STRIP */}
        {crossLinks.length > 0 && (
          <section className="section-pad-lg">
            <div className="tile tile-feature">
              <div className="mono-eyebrow text-copper">Cross-garden contributions</div>
              <p className="body-readable mt-2 text-ink-soft">
                {expert.name}&apos;s expertise links to {crossLinks.length} entities across The Knowledge Gardens ecosystem.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ---------- Helpers ----------

/**
 * Convert a case row's short_name into the URL slug.
 * Post-migration this is c.slug. Pre-migration we derive from short_name.
 */
function caseSlugFor(c: any): string {
  if (c.slug) return c.slug;
  if (c.short_name) {
    // "Sky Valley PCB Case" → "sky-valley"
    return c.short_name.toLowerCase().split(/\s+/).slice(0, 2).join('-');
  }
  return c.name.toLowerCase().split(/\s+/).slice(0, 2).join('-');
}

/**
 * Convert a substance row to URL slug.
 * Prefers parenthesized abbrev, else first word, else first alias.
 */
function substanceSlugFor(s: any): string {
  const paren = s.name.match(/\(([^)]+)\)/);
  if (paren) return paren[1].toLowerCase().replace(/[^a-z0-9]/g, '');
  return s.name.split(/\s+/)[0].toLowerCase();
}
