'use client';

/**
 * Case detail page — Sky Valley PCB case.
 * Fetches live case data from Supabase and renders with proper typography and hierarchy.
 *
 * Design principles applied:
 * - Uses .rail-default for proper centering and padding (no text pushing to viewport edge)
 * - Generous internal padding on all cards (p-8, p-10)
 * - Italic Cormorant Garamond for all headings and case titles
 * - Space Mono UPPERCASE for eyebrows, metadata, specialty labels
 * - Inter body text with 1.6-1.7 line-height for comfortable readability
 * - Clear color hierarchy: ink (primary), ink-soft (secondary), ink-mute (metadata)
 * - Asymmetric card layouts with left-border accents for hierarchy
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCaseByShortName, slug } from '@/lib/queries-tox';
import type { CaseDetail } from '@/lib/types-tox';
import CaseTimeline from '@/components/case/CaseTimeline';
import DocumentRegister from '@/components/case/DocumentRegister';

export default function SkyValleyCasePage() {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCaseByShortName('Sky Valley PCB Case');
        if (!cancelled) setCaseData(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load case');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
        <div className="rail-default py-20">
          <section className="mb-24 border-b border-[var(--paper-line)] pb-16">
            <div
              className="mb-6"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
              }}
            >
              Legal Case
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              Loading case data...
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (error || !caseData) {
    return (
      <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
        <div className="rail-default py-20">
          <section className="mb-24 border-b border-[var(--paper-line)] pb-16">
            <div
              className="mb-6"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
              }}
            >
              Legal Case
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              {error ? `Error: ${error}` : 'Case not found.'}
            </p>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <div className="rail-default py-20">
        {/* Header Section */}
        <section className="mb-24 border-b border-[var(--paper-line)] pb-16">
          {/* Eyebrow */}
          <div
            className="mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
            }}
          >
            Legal Case · {caseData.jurisdiction} · {caseData.filed_year}
          </div>

          {/* Title */}
          <h1
            className="mb-8 max-w-3xl"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            {caseData.name}
          </h1>

          {/* Description */}
          <p
            className="max-w-2xl"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
            }}
          >
            {caseData.description}
          </p>
        </section>

        {/* Substances Section */}
        {caseData.substances.length > 0 && (
          <section className="mb-24">
            <h2
              className="mb-10"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              Substances at Issue
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
              {caseData.substances.map((substance) => (
                <Link
                  key={substance.id}
                  href={`/compound/${slug(substance.name)}`}
                  className="tile group transition-all hover:border-[var(--teal)] hover:shadow-sm"
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'normal',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {substance.name}
                  </h3>
                  <p
                    className="cta-pill cta-pill-secondary"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--ink-soft)',
                      lineHeight: 1.6,
                      display: 'inline-block',
                    }}
                  >
                    View substance data →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Expert Witnesses Section */}
        {caseData.experts.length > 0 && (
          <section className="mb-24">
            <h2
              className="mb-10"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              Expert Witnesses
            </h2>

            <div className="space-y-6">
              {caseData.experts.map((expert) => {
                const isDahlgren = expert.name.includes('Dahlgren');
                const lastName = expert.name.split(' ').pop() || expert.name;
                const expertUrl = `/expert/${lastName.toLowerCase()}`;
                return (
                  <Link
                    key={expert.id}
                    href={expertUrl}
                    className="tile transition-all hover:border-[var(--teal)] hover:shadow-sm"
                    style={{
                      background: isDahlgren ? 'rgba(232, 55, 89, 0.04)' : 'var(--paper)',
                      borderLeftWidth: isDahlgren ? '4px' : '1px',
                      borderLeftColor: isDahlgren ? 'var(--crimson)' : 'var(--paper-line)',
                      textDecoration: 'none',
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontStyle: 'normal',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {expert.name}
                    </h3>
                    {expert.specialty && (
                      <p
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--ink-mute)',
                          letterSpacing: '0.08em',
                          marginBottom: '0.6rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {expert.specialty}
                      </p>
                    )}
                    {expert.affiliation && (
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontStyle: 'italic',
                          fontSize: '0.95rem',
                          color: 'var(--ink-soft)',
                          marginBottom: '1.25rem',
                        }}
                      >
                        {expert.affiliation}
                      </p>
                    )}
                    {expert.bio && (
                      <p
                        className="body-readable"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.95rem',
                          color: 'var(--ink-soft)',
                          lineHeight: 1.7,
                        }}
                      >
                        {expert.bio}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Case Timeline Section */}
        {caseData.events.length > 0 && (
          <section className="mb-24">
            <h2
              className="mb-10"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              Case Timeline
            </h2>
            <CaseTimeline events={caseData.events} documents={caseData.documents} />
          </section>
        )}

        {/* Document Register Section */}
        {caseData.documents.length > 0 && (
          <section className="mb-24">
            <h2
              className="mb-10"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              Documents
            </h2>
            <DocumentRegister documents={caseData.documents} />
          </section>
        )}

        {/* Call-to-Action Section */}
        <section
          className="rounded-lg border border-[var(--paper-line)] p-10"
          style={{ background: 'var(--paper-warm)' }}
        >
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              fontWeight: 400,
              color: 'var(--ink)',
            }}
          >
            Build an Exhibit Packet
          </h2>
          <p
            className="mb-8 max-w-xl"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
            }}
          >
            Use the Counsel flow to assemble a case-specific exhibit packet with all relevant evidence, expert credentials, regulatory positions, and timeline documentation.
          </p>
          <Link
            href="/flow/counsel?case=sky-valley"
            className="cta-pill cta-pill-lg cta-pill-primary inline-block"
          >
            Open Counsel Flow →
          </Link>
        </section>
      </div>
    </main>
  );
}
