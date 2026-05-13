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
  const [filter, setFilter] = useState('');

  // Pre-fill the in-page filter from ?q= so deep-links from the global Cmd-K
  // search (and external links like /case/sky-valley?q=erickson) auto-scope
  // the view to matching documents, events, parties, substances, and experts.
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

  // Client-side filter across documents, events, substances, experts.
  // Anchor scrolling (#doc-<id> / #event-<id>) from global-search deep-links
  // still works because the underlying rows render the IDs unconditionally.
  const filterLower = filter.trim().toLowerCase();
  const matchesText = (s: string | null | undefined) =>
    !!s && s.toLowerCase().includes(filterLower);
  // Sky Valley has ~2,000 documents from the local pipeline ingest. Cap the
  // rendered list to keep the page snappy and avoid the staggered-fade-in
  // animation running for 100+ seconds. The in-page search above is the
  // navigation tool: typing narrows the matching set before the cap applies.
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

        {/* Search bar — filter documents, timeline, parties, substances, experts */}
        <section className="mb-16">
          <div
            className="mb-3"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
            }}
          >
            Search this case · {caseData.documents.length} documents · {caseData.events.length} events · {caseData.experts.length} experts
          </div>
          <div className="relative">
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search documents, timeline, substances, experts…"
              className="w-full border border-[var(--paper-line)] bg-[var(--paper-warm)] px-4 py-3 pr-20 outline-none transition-colors focus:border-[var(--teal)]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: 'var(--ink)',
              }}
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 text-sm text-[var(--ink-mute)] transition-colors hover:text-[var(--ink)]"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          {filter && (
            <div
              className="mt-3"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--ink-mute)',
                letterSpacing: '0.05em',
              }}
            >
              {totalMatches > 0
                ? `${totalMatches} match${totalMatches === 1 ? '' : 'es'} · ${filteredDocs.length} docs · ${filteredEvents.length} events · ${filteredSubstances.length} substances · ${filteredExperts.length} experts`
                : `No matches for "${filter}" in this case.`}
            </div>
          )}
        </section>

        {/* Substances Section */}
        {filteredSubstances.length > 0 && (
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
              {filteredSubstances.map((substance) => (
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
        {filteredExperts.length > 0 && (
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
              {filteredExperts.map((expert) => {
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
        {filteredEvents.length > 0 && (
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
            <CaseTimeline events={filteredEvents} documents={caseData.documents} />
          </section>
        )}

        {/* Document Register Section */}
        {filteredDocs.length > 0 && (
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
            {docsHidden > 0 && (
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--ink-mute)',
                  letterSpacing: '0.05em',
                  marginBottom: '1.25rem',
                }}
              >
                Showing first {filteredDocs.length} of {docsMatchingFilter.length} documents — type in the search above to narrow.
              </p>
            )}
            <DocumentRegister documents={filteredDocs} />
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
