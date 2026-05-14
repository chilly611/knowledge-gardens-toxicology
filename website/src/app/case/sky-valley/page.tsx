'use client';

/**
 * Case detail page — Sky Valley PCB case.
 *
 * Design vocabulary: Emblem hero, italic Cormorant H1, Space Mono copper
 * eyebrows, CornerBrackets, DimensionLine separators, .tile-grid-3 with
 * lift-on-hover, alternating section backgrounds, GearOrnament footer.
 * Same vocabulary as /counsel-brief.
 *
 * Functionality preserved:
 *  - In-page filter across documents, timeline, substances, experts
 *  - Filter pre-fills from ?q=<term>
 *  - Document list capped at 50 (Sky Valley has ~2,000 rows)
 *  - Anchor IDs on doc/event rows for search-result deep links
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCaseByShortName, slug } from '@/lib/queries-tox';
import type { CaseDetail } from '@/lib/types-tox';
import CaseTimeline from '@/components/case/CaseTimeline';
import DocumentRegister from '@/components/case/DocumentRegister';
import Emblem from '@/components/shared/Emblem';
import CornerBrackets from '@/components/shared/CornerBrackets';
import DimensionLine from '@/components/shared/DimensionLine';
import GearOrnament from '@/components/shared/GearOrnament';

/**
 * Extract the canonical short slug from a substance name.
 * Substance names in the DB carry their short form in parentheses:
 *   "Polychlorinated biphenyls (PCBs)" → "pcbs"
 *   "2,3,7,8-Tetrachlorodibenzo-p-dioxin (TCDD)" → "tcdd"
 * Fall back to slugifying the whole name when no parens are present.
 */
function substanceSlug(name: string): string {
  const m = name.match(/\(([^)]+)\)/);
  return slug(m ? m[1] : name);
}

export default function SkyValleyCasePage() {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Pre-fill the in-page filter from ?q=
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search).get('q');
    if (q) setFilter(q);
  }, []);

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
        <div className="rail-default py-20 text-center">
          <div
            className="mb-4 font-eyebrow"
            style={{ color: 'var(--copper-orn-deep)' }}
          >
            Legal Case
          </div>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-soft)' }}>
            Loading case data…
          </p>
        </div>
      </main>
    );
  }

  if (error || !caseData) {
    return (
      <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
        <div className="rail-default py-20 text-center">
          <div
            className="mb-4 font-eyebrow"
            style={{ color: 'var(--copper-orn-deep)' }}
          >
            Legal Case
          </div>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-soft)' }}>
            {error ? `Error: ${error}` : 'Case not found.'}
          </p>
        </div>
      </main>
    );
  }

  // Client-side filter across documents, events, substances, experts.
  const filterLower = filter.trim().toLowerCase();
  const matchesText = (s: string | null | undefined) =>
    !!s && s.toLowerCase().includes(filterLower);

  // Sky Valley has ~2,000 documents from the local pipeline ingest. Cap the
  // rendered list to keep the page snappy. Search above narrows before cap.
  const DOC_DISPLAY_CAP = 50;
  const docsMatchingFilter = !filterLower
    ? caseData.documents
    : caseData.documents.filter(
        (d) => matchesText(d.title) || matchesText(d.notes) || matchesText(d.doc_type)
      );
  const filteredDocs = docsMatchingFilter.slice(0, DOC_DISPLAY_CAP);
  const docsHidden = docsMatchingFilter.length - filteredDocs.length;

  const filteredEvents = !filterLower
    ? caseData.events
    : caseData.events.filter(
        (e) => matchesText(e.description) || matchesText(e.event_type)
      );
  const filteredSubstances = !filterLower
    ? caseData.substances
    : caseData.substances.filter((s) => matchesText(s.name));
  const filteredExperts = !filterLower
    ? caseData.experts
    : caseData.experts.filter(
        (e) => matchesText(e.name) || matchesText(e.specialty) || matchesText(e.bio)
      );

  const totalMatches =
    filteredDocs.length +
    filteredEvents.length +
    filteredSubstances.length +
    filteredExperts.length;

  // Find Dahlgren for the lead-expert callout
  const leadExpert =
    caseData.experts.find((e) => e.name.includes('Dahlgren')) ?? caseData.experts[0];

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* ============================================================ */}
      {/*                          HEADER                              */}
      {/* ============================================================ */}
      <section className="rail-default py-16 md:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <div className="font-eyebrow mb-5" style={{ color: 'var(--copper-orn-deep)' }}>
              Legal Case · {caseData.jurisdiction ?? 'Washington State'} · {caseData.filed_year ?? '—'}
            </div>

            <h1
              className="mb-6 max-w-[18ch]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)',
                lineHeight: 1.05,
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
              }}
            >
              {caseData.name}
            </h1>

            {caseData.description && (
              <p
                className="body-readable max-w-2xl"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: 'var(--ink-soft)',
                }}
              >
                {caseData.description}
              </p>
            )}
          </div>

          {/* Lead-expert callout — engineering-bracket frame */}
          {leadExpert && (
            <div className="lg:pt-2">
              <CornerBrackets size={14} thickness={1.2} color="var(--crimson)">
                <div
                  className="px-7 py-6"
                  style={{
                    background: 'rgba(232, 55, 89, 0.04)',
                    borderLeft: '3px solid var(--crimson)',
                    minWidth: 260,
                  }}
                >
                  <div className="font-eyebrow mb-3" style={{ color: 'var(--crimson)' }}>
                    Lead Expert
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    Dr. {leadExpert.name.replace(/^Dr\.\s*/, '')}
                  </div>
                  {leadExpert.specialty && (
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-mute)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {leadExpert.specialty}
                    </div>
                  )}
                  <Link
                    href="/expert/dahlgren"
                    className="cta-pill cta-pill-secondary inline-block"
                    style={{ fontSize: '0.85rem' }}
                  >
                    Open workbench →
                  </Link>
                </div>
              </CornerBrackets>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-center">
          <DimensionLine length={240} label="case file" />
        </div>
      </section>

      {/* ============================================================ */}
      {/*                       SEARCH THIS CASE                       */}
      {/* ============================================================ */}
      <section
        className="py-12 md:py-16"
        style={{ background: 'var(--paper-warm)', borderTop: '1px solid var(--paper-line)', borderBottom: '1px solid var(--paper-line)' }}
      >
        <div className="rail-default">
          <div className="font-eyebrow mb-4" style={{ color: 'var(--copper-orn-deep)' }}>
            Search this case · {caseData.documents.length} documents · {caseData.events.length} events · {caseData.experts.length} {caseData.experts.length === 1 ? 'expert' : 'experts'}
          </div>
          <div className="relative max-w-3xl">
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search documents, timeline, substances, experts…"
              className="w-full rounded border px-5 py-4 pr-24 outline-none transition-colors focus:border-[var(--teal)]"
              style={{
                borderColor: 'var(--paper-line)',
                background: 'var(--paper)',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--ink)',
              }}
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 transition-colors hover:text-[var(--ink)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderColor: 'var(--paper-line)',
                  color: 'var(--ink-mute)',
                  background: 'var(--paper)',
                }}
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          {filter && (
            <div
              className="mt-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--ink-mute)',
                letterSpacing: '0.05em',
              }}
            >
              {totalMatches > 0
                ? `${totalMatches} match${totalMatches === 1 ? '' : 'es'} · ${filteredDocs.length} docs · ${filteredEvents.length} events · ${filteredSubstances.length} substances · ${filteredExperts.length} experts`
                : `No matches for "${filter}" in this case.`}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*                        SUBSTANCES                            */}
      {/* ============================================================ */}
      {filteredSubstances.length > 0 && (
        <section className="rail-default py-16 md:py-20">
          <div className="font-eyebrow mb-4" style={{ color: 'var(--copper-orn-deep)' }}>
            Substances at Issue
          </div>
          <h2
            className="mb-10 max-w-2xl"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: 'var(--ink)',
              lineHeight: 1.15,
            }}
          >
            The compounds the plaintiffs allege caused harm
          </h2>

          <div className="tile-grid-3">
            {filteredSubstances.map((substance) => (
              <Link
                key={substance.id}
                href={`/compound/${substanceSlug(substance.name)}`}
                className="tile group block rounded-lg border p-7 transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  borderColor: 'var(--paper-line)',
                  background: 'rgba(255,255,255,0.5)',
                  borderLeft: '3px solid var(--peach-deep)',
                }}
              >
                <div className="font-eyebrow mb-3" style={{ color: 'var(--peach-deep)' }}>
                  Compound · Stratigraph
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--ink)',
                    lineHeight: 1.25,
                    marginBottom: '0.5rem',
                  }}
                >
                  {substance.name}
                </h3>
                {substance.cas_number && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--ink-mute)',
                      letterSpacing: '0.04em',
                      marginBottom: '1.25rem',
                    }}
                  >
                    CAS {substance.cas_number}
                  </div>
                )}
                <span
                  className="cta-pill cta-pill-secondary inline-block text-sm transition-colors group-hover:text-[var(--teal-deep)]"
                >
                  View substance data →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <DimensionLine length={200} />
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*                      EXPERT WITNESSES                        */}
      {/* ============================================================ */}
      {filteredExperts.length > 0 && (
        <section
          className="py-16 md:py-20"
          style={{ background: 'var(--paper-warm)', borderTop: '1px solid var(--paper-line)', borderBottom: '1px solid var(--paper-line)' }}
        >
          <div className="rail-default">
            <div className="font-eyebrow mb-4" style={{ color: 'var(--copper-orn-deep)' }}>
              Expert Witnesses
            </div>
            <h2
              className="mb-10 max-w-2xl"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: 'var(--ink)',
                lineHeight: 1.15,
              }}
            >
              The credentialed voices behind the toxicology record
            </h2>

            <div className="space-y-5">
              {filteredExperts.map((expert) => {
                const isDahlgren = expert.name.includes('Dahlgren');
                const lastName = expert.name.split(' ').pop() ?? expert.name;
                const expertUrl = `/expert/${lastName.toLowerCase()}`;
                return (
                  <Link
                    key={expert.id}
                    href={expertUrl}
                    className="tile group block rounded-lg border p-7 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      borderColor: 'var(--paper-line)',
                      background: isDahlgren ? 'rgba(232, 55, 89, 0.05)' : 'rgba(255,255,255,0.5)',
                      borderLeftWidth: '3px',
                      borderLeftColor: isDahlgren ? 'var(--crimson)' : 'var(--teal)',
                    }}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                      <div>
                        <h3
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1.3rem',
                            fontWeight: 700,
                            color: 'var(--ink)',
                            marginBottom: '0.35rem',
                          }}
                        >
                          Dr. {expert.name.replace(/^Dr\.\s*/, '')}
                        </h3>
                        {expert.specialty && (
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              letterSpacing: '0.16em',
                              textTransform: 'uppercase',
                              color: 'var(--ink-mute)',
                            }}
                          >
                            {expert.specialty}
                          </div>
                        )}
                      </div>
                      <span
                        className="cta-pill cta-pill-secondary text-sm transition-colors group-hover:text-[var(--teal-deep)]"
                      >
                        Open workbench →
                      </span>
                    </div>

                    {expert.affiliation && (
                      <p
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: '1rem',
                          color: 'var(--ink-soft)',
                          marginTop: '0.85rem',
                          marginBottom: '0.85rem',
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
                          fontSize: '0.96rem',
                          lineHeight: 1.7,
                          color: 'var(--ink-soft)',
                        }}
                      >
                        {expert.bio}
                      </p>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*                       CASE TIMELINE                          */}
      {/* ============================================================ */}
      {filteredEvents.length > 0 && (
        <section className="rail-default py-16 md:py-20">
          <div className="font-eyebrow mb-4" style={{ color: 'var(--copper-orn-deep)' }}>
            Procedural Timeline
          </div>
          <h2
            className="mb-10 max-w-2xl"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              color: 'var(--ink)',
              lineHeight: 1.15,
            }}
          >
            How the case moved from filing to verdict
          </h2>

          <CornerBrackets size={16} thickness={1} inset={-8}>
            <div
              className="rounded-lg p-7 md:p-10"
              style={{
                background: 'rgba(255,255,255,0.4)',
                border: '1px solid var(--paper-line)',
              }}
            >
              <CaseTimeline events={filteredEvents} documents={caseData.documents} />
            </div>
          </CornerBrackets>

          <div className="mt-16 flex justify-center">
            <DimensionLine length={200} />
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*                        DOCUMENTS                             */}
      {/* ============================================================ */}
      {filteredDocs.length > 0 && (
        <section
          className="py-16 md:py-20"
          style={{ background: 'var(--paper-warm)', borderTop: '1px solid var(--paper-line)', borderBottom: '1px solid var(--paper-line)' }}
        >
          <div className="rail-default">
            <div className="font-eyebrow mb-4" style={{ color: 'var(--copper-orn-deep)' }}>
              Document Register
            </div>
            <h2
              className="mb-4 max-w-2xl"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                color: 'var(--ink)',
                lineHeight: 1.15,
              }}
            >
              The filings, reports, and exhibits in the docket
            </h2>
            {docsHidden > 0 && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--ink-mute)',
                  letterSpacing: '0.05em',
                  marginBottom: '1.5rem',
                }}
              >
                Showing first {filteredDocs.length} of {docsMatchingFilter.length} documents — type in the search above to narrow.
              </p>
            )}

            <div
              className="rounded-lg p-6 md:p-8"
              style={{
                background: 'rgba(255,255,255,0.5)',
                border: '1px solid var(--paper-line)',
              }}
            >
              <DocumentRegister documents={filteredDocs} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*                    BUILD AN EXHIBIT PACKET                   */}
      {/* ============================================================ */}
      <section className="rail-default py-20 md:py-24">
        <CornerBrackets size={18} thickness={1.4} color="var(--crimson)">
          <div
            className="rounded-lg p-10 md:p-12"
            style={{
              background: 'var(--paper-warm)',
              borderLeft: '4px solid var(--crimson)',
            }}
          >
            <div className="font-eyebrow mb-4" style={{ color: 'var(--crimson)' }}>
              Counsel Flow · Deliverable
            </div>
            <h2
              className="mb-5 max-w-3xl"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontWeight: 500,
                fontSize: 'clamp(1.8rem, 3.4vw, 2.6rem)',
                color: 'var(--ink)',
                lineHeight: 1.15,
              }}
            >
              Build an exhibit packet from this case
            </h2>
            <p
              className="body-readable mb-8 max-w-2xl"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
              }}
            >
              Walk the Counsel flow with Sky Valley pre-loaded — frame, assemble,
              argue, witness, file. Each stage compiles its own deliverable into a
              Daubert-ready packet with three sources behind every claim.
            </p>
            <Link
              href="/flow/counsel?case=sky-valley"
              className="cta-pill cta-pill-lg cta-pill-primary inline-block"
            >
              Open Counsel Flow →
            </Link>
          </div>
        </CornerBrackets>
      </section>

      {/* ============================================================ */}
      {/*                       FOOTER ORNAMENT                        */}
      {/* ============================================================ */}
      <div className="flex justify-center py-12 opacity-30">
        <GearOrnament size={56} speed={32} />
      </div>
    </main>
  );
}
