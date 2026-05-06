'use client';

/**
 * /expert/[slug] — Expert profile page
 * Shows expert details, associated cases, and claims via the heuristic.
 * Design: parchment background, .tile-feature card for header, body-readable for bio,
 * .tile cards for cases, grouped claims by substance.
 */

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { getExpertBySlug, getExpertCases, getExpertClaims, slug } from '@/lib/queries-tox';
import type { Expert, LegalCase, CertifiedClaimRow } from '@/lib/types-tox';

type Props = { params: Promise<{ slug: string }> };

export default function ExpertPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <ExpertPageInner params={params} />
    </Suspense>
  );
}

function ExpertPageInner({ params }: Props) {
  const [slugParam, setSlugParam] = useState<string>('');
  const [expert, setExpert] = useState<Expert | null>(null);
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = await params;
      if (cancelled) return;
      setSlugParam(p.slug);
      const e = await getExpertBySlug(p.slug);
      if (cancelled) return;
      setExpert(e);
      if (e) {
        const [cs, cls] = await Promise.all([getExpertCases(e.id), getExpertClaims(e.id)]);
        if (cancelled) return;
        setCases(cs);
        setClaims(cls);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return (
      <main data-surface="tkg" className="min-h-screen flex items-center justify-center">
        <div style={{ color: 'var(--ink-mute)' }}>Loading...</div>
      </main>
    );
  }

  if (!expert) {
    return (
      <main data-surface="tkg" className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--paper)]">
        <div
          className="rounded-2xl border border-[var(--paper-line)] bg-white p-8"
          style={{ background: 'rgba(255, 255, 255, 0.4)', maxWidth: '40ch' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.8rem',
              fontStyle: 'italic',
              color: 'var(--ink)',
              marginBottom: '1rem',
            }}
          >
            Expert not found
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>
            The expert profile you are looking for does not exist. Try dahlgren for Dr. James G. Dahlgren.
          </p>
          <Link
            href="/"
            style={{
              color: 'var(--teal-deep)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'underline',
            }}
          >
            Back to Loom
          </Link>
        </div>
      </main>
    );
  }

  // Group claims by substance_name
  const claimsBySubstance: Record<string, CertifiedClaimRow[]> = {};
  for (const claim of claims) {
    if (!claimsBySubstance[claim.substance_name]) {
      claimsBySubstance[claim.substance_name] = [];
    }
    claimsBySubstance[claim.substance_name].push(claim);
  }

  const statusColors: Record<string, string> = {
    certified: 'var(--teal)',
    provisional: 'var(--copper-orn-deep)',
    contested: 'var(--crimson)',
    retracted: 'var(--ink-mute)',
  };

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* Header Card */}
      <section className="rail-default py-20">
        <div
          className="tile-feature rounded-2xl border border-[var(--paper-line)] p-8 md:p-12"
          style={{ background: 'rgba(255, 255, 255, 0.4)' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '1.5rem',
            }}
          >
            Expert witness · Toxicology
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 800,
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
              lineHeight: 1.1,
              color: 'var(--ink)',
              marginBottom: '1rem',
            }}
          >
            {expert.name}
          </h1>

          {expert.affiliation && (
            <p
              className="emphasis-italic"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '1.05rem',
                color: 'var(--ink-soft)',
                marginBottom: '1rem',
              }}
            >
              {expert.affiliation}
            </p>
          )}

          {expert.specialty && (
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
              }}
            >
              {expert.specialty}
            </div>
          )}
        </div>
      </section>

      {/* Bio Section */}
      {expert.bio && (
        <section className="rail-default py-8 md:py-12">
          <div className="body-readable">
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
              }}
            >
              {expert.bio}
            </p>
          </div>
        </section>
      )}

      {/* Cases Section */}
      {cases.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: 'var(--ink)',
              marginBottom: '2rem',
            }}
          >
            Cases
          </h2>
          <div className="grid gap-6">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/case/${slug(c.short_name)}`}
                className="tile rounded-2xl border border-[var(--paper-line)] p-6 md:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ background: 'rgba(255, 255, 255, 0.4)' }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {c.filed_year} · {c.jurisdiction}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {c.short_name}
                </h3>
                {c.description && (
                  <p
                    className="emphasis-italic"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      fontStyle: 'italic',
                      color: 'var(--ink-soft)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {c.description.slice(0, 140)}
                    {c.description.length > 140 ? '...' : ''}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Claims Section */}
      {claims.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: 'var(--ink)',
              marginBottom: '2rem',
            }}
          >
            Cited evidence
          </h2>
          <div className="space-y-8">
            {Object.entries(claimsBySubstance).map(([substanceName, substanceClaims]) => (
              <div key={substanceName}>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--ink)',
                    marginBottom: '1rem',
                  }}
                >
                  {substanceName}
                </h3>
                <div className="space-y-3">
                  {substanceClaims.map((claim) => (
                    <Link
                      key={claim.claim_id}
                      href={`/compound/${slug(claim.substance_name)}#claim-${claim.claim_id}`}
                      className="block p-4 rounded-lg border border-[var(--paper-line)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.6)]"
                      style={{ background: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              color: 'var(--ink)',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {claim.endpoint_name}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontSize: '0.85rem',
                              color: 'var(--ink-soft)',
                            }}
                          >
                            {claim.population && `${claim.population} · `}
                            {claim.exposure_route && `${claim.exposure_route} exposure`}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            color: 'white',
                            backgroundColor: statusColors[claim.status] || 'var(--ink-mute)',
                          }}
                        >
                          {claim.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty claims state */}
      {claims.length === 0 && cases.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--ink-mute)',
              fontFamily: 'var(--font-body)',
            }}
          >
            No claims linked through this expert work yet.
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <section className="rail-default py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          {expert.id === '44444444-4444-4444-8444-000000000001' && (
            <Link
              href="/case/sky-valley-pcb-case"
              className="tile rounded-xl border border-[var(--paper-line)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'rgba(255, 255, 255, 0.4)' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontWeight: 600 }}>
                Open Sky Valley case
              </p>
            </Link>
          )}
          <Link
            href="/case"
            className="tile rounded-xl border border-[var(--paper-line)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgba(255, 255, 255, 0.4)' }}
          >
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontWeight: 600 }}>
              Browse cases
            </p>
          </Link>
          <Link
            href="/"
            className="tile rounded-xl border border-[var(--paper-line)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgba(255, 255, 255, 0.4)' }}
          >
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontWeight: 600 }}>
              Back to Loom
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
