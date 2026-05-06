'use client';

/**
 * /expert/[slug] — Expert research workbench
 * Deep dive into an expert's litigation record, publications, and evidence contributions.
 * Sections: header card, career timeline, cases, documents, publications, claims, reference terms.
 *
 * Design: Uses .rail-default, .tile-feature, .tile, .tile-grid-3 per L-022.
 * All sections prefixed with Space Mono uppercase eyebrow.
 * Body text in .body-readable. Accent colors by section: copper, teal, crimson, peach.
 */

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import {
  getExpertBySlug,
  getExpertCases,
  getExpertClaims,
  getExpertDocuments,
  getExpertPublications,
  getExpertReferenceContributions,
  getCrossGardenLinks,
  slug,
} from '@/lib/queries-tox';
import type { Expert, LegalCase, CertifiedClaimRow, CaseDocument, EvidenceSource, ReferenceTerm, CrossGardenLink } from '@/lib/types-tox';

type Props = { params: Promise<{ slug: string }> };

// Hardcoded timeline data for Dahlgren based on dahlgren-research.md
const CAREER_TIMELINE = [
  {
    year: 1977,
    event: 'Began clinical toxicology and occupational/environmental medicine practice',
  },
  {
    year: 1996,
    event: 'Served as toxicology expert in Anderson v. PG&E Hinkley chromium-6 case; $333M settlement',
  },
  {
    year: 2003,
    event: 'Published peer-reviewed study on wood treatment plant exposure in Environmental Health Perspectives',
  },
  {
    year: 2007,
    event: 'Published research on persistent organic pollutants in 9/11 World Trade Center rescue workers in Chemosphere',
  },
  {
    year: 2016,
    event: 'Expert witness in Crane Co. v. DeLisle asbestos mesothelioma case; $8M verdict upheld on appeal',
  },
  {
    year: 2021,
    event: 'Testified in Sky Valley Education Center PCB litigation; jury verdict $185M',
  },
  {
    year: 2025,
    event: 'Sky Valley case upheld by Washington Supreme Court; Monsanto settlement with 200+ additional plaintiffs',
  },
];

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
  const [documents, setDocuments] = useState<CaseDocument[]>([]);
  const [publications, setPublications] = useState<EvidenceSource[]>([]);
  const [referenceTerms, setReferenceTerms] = useState<ReferenceTerm[]>([]);
  const [crossGardenLinks, setCrossGardenLinks] = useState<CrossGardenLink[]>([]);
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
        const lastNameMatch = e.name.match(/(\w+)$/);
        const lastName = lastNameMatch ? lastNameMatch[1] : e.name;

        const [cs, cls, docs, pubs, refs, links] = await Promise.all([
          getExpertCases(e.id),
          getExpertClaims(e.id),
          getExpertDocuments(e.id),
          getExpertPublications(lastName),
          getExpertReferenceContributions(lastName),
          getCrossGardenLinks(e.id, 'expert'),
        ]);
        if (cancelled) return;
        setCases(cs);
        setClaims(cls);
        setDocuments(docs);
        setPublications(pubs);
        setReferenceTerms(refs);
        setCrossGardenLinks(links);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    return (
      <main data-surface="tkg" className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
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
      {/* ================================================================
          HEADER CARD
          ================================================================ */}
      <section className="rail-default py-16 md:py-20">
        <div
          className="tile-feature rounded-2xl border border-[var(--paper-line)] p-8 md:p-12"
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            borderLeft: '4px solid var(--crimson)',
          }}
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
            Expert Witness · 50 Years · Toxicology
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="flex-1">
              <h1
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                  lineHeight: 1.1,
                  color: 'var(--ink)',
                  marginBottom: '0.75rem',
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
                    marginBottom: '1.5rem',
                  }}
                >
                  {expert.specialty}
                </div>
              )}

              {expert.bio && (
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
              )}
            </div>

            <div className="md:w-48 flex flex-col gap-6">
              {/* Photo placeholder */}
              <div
                style={{
                  border: '2px solid var(--ink-mute)',
                  borderRadius: '0.25rem',
                  padding: '1rem',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: 'var(--ink-mute)',
                  fontFamily: 'var(--font-mono)',
                  aspectRatio: '3/4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ┌─────────────┐<br />│ PHOTO       │<br />│ PENDING     │<br />└─────────────┘
              </div>

              {/* Action row */}
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href="https://www.jurispro.com/files/documents/doc-1066204677-resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: 'var(--teal)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'underline',
                    fontWeight: 600,
                  }}
                >
                  Download CV
                </a>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                  }}
                >
                  Contact
                </div>
                <a
                  href="mailto:chillyd@gmail.com"
                  style={{
                    color: 'var(--crimson)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    textDecoration: 'underline',
                  }}
                >
                  chillyd@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          CAREER TIMELINE
          ================================================================ */}
      <section className="rail-default py-12 md:py-16">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--copper-orn-deep)',
            marginBottom: '3rem',
          }}
        >
          Career Arc · 1977—Present
        </div>

        <div className="space-y-6">
          {CAREER_TIMELINE.map((event, idx) => (
            <div
              key={idx}
              className="tile rounded-lg border border-[var(--paper-line)] p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                borderLeft: '4px solid var(--teal)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--copper-orn-deep)',
                  marginBottom: '0.5rem',
                }}
              >
                {event.year}
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 600,
                  lineHeight: 1.6,
                  color: 'var(--ink)',
                }}
              >
                {event.event}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          CASES SECTION
          ================================================================ */}
      {cases.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '3rem',
            }}
          >
            Cases · Litigation Record
          </div>

          {/* Filter chips (visual only) */}
          <div className="flex flex-wrap gap-2 mb-8">
            {['ALL', 'TOXIC TORT', 'OCCUPATIONAL', 'PCBs', 'ASBESTOS'].map((filter) => (
              <button
                key={filter}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  border: filter === 'ALL' ? '2px solid var(--ink)' : '1px solid var(--paper-line)',
                  background: filter === 'ALL' ? 'var(--ink)' : 'transparent',
                  color: filter === 'ALL' ? 'var(--paper)' : 'var(--ink)',
                  cursor: 'pointer',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="tile-grid-3">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/case/${slug(c.short_name)}`}
                className="tile rounded-2xl border border-[var(--paper-line)] p-6 md:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderLeft: '4px solid var(--crimson)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
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
                    fontSize: '1.1rem',
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {c.short_name}
                </h3>
                {c.description && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--ink-soft)',
                      marginBottom: '1rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {c.description.slice(0, 120)}
                    {c.description.length > 120 ? '...' : ''}
                  </p>
                )}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--teal)',
                  }}
                >
                  Open dossier →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          DOCUMENTS SECTION
          ================================================================ */}
      {documents.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '0.5rem',
            }}
          >
            Documents · Trial Records
          </div>
          <p
            className="body-readable"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--ink-soft)',
              marginBottom: '3rem',
            }}
          >
            {documents.length} documents linked to {expert.name}s cases. Filed reports, expert
            disclosures, deposition transcripts.
          </p>

          <div className="tile-grid-3">
            {documents.slice(0, 12).map((doc) => (
              <div
                key={doc.id}
                className="tile rounded-2xl border border-[var(--paper-line)] p-6 md:p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderLeft: '4px solid var(--peach)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {doc.doc_type || 'Document'}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                    wordBreak: 'break-word',
                  }}
                >
                  {doc.title.slice(0, 60)}
                  {doc.title.length > 60 ? '...' : ''}
                </h4>
                {doc.document_date && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--ink-mute)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {new Date(doc.document_date).toLocaleDateString()}
                  </div>
                )}
                {doc.notes && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--ink-soft)',
                      marginBottom: '1rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {doc.notes.slice(0, 80)}
                    {doc.notes.length > 80 ? '...' : ''}
                  </p>
                )}
                {doc.source_url && (
                  <a
                    href={doc.source_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--teal)',
                      textDecoration: 'underline',
                    }}
                  >
                    Open document →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          PUBLICATIONS SECTION
          ================================================================ */}
      {publications.length > 0 ? (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '3rem',
            }}
          >
            Publications · Peer-Reviewed Research
          </div>

          <ol
            style={{
              listStyle: 'decimal',
              listStylePosition: 'inside',
              space: '1.5rem',
            }}
          >
            {publications.map((pub, idx) => (
              <li
                key={pub.id}
                className="tile rounded-lg border border-[var(--paper-line)] p-6 mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderLeft: '4px solid var(--teal)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--ink-mute)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {pub.authors?.join(', ') || 'Unknown authors'} · {pub.year}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '1.05rem',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {pub.title}
                </h4>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--ink-soft)',
                  }}
                >
                  {pub.publisher}
                  {pub.doi && (
                    <>
                      {' · '}
                      <a
                        href={`https://doi.org/${pub.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: 'var(--copper-orn-deep)',
                          textDecoration: 'underline',
                        }}
                      >
                        DOI: {pub.doi}
                      </a>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '3rem',
            }}
          >
            Publications · Peer-Reviewed Research
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--ink-soft)',
              padding: '2rem',
            }}
          >
            Publications cataloging in progress; refer to{' '}
            <a
              href="https://www.researchgate.net/profile/James-Dahlgren"
              target="_blank"
              rel="noreferrer"
              style={{
                color: 'var(--teal)',
                textDecoration: 'underline',
              }}
            >
              ResearchGate
            </a>
            {' '}for current bibliography.
          </div>
        </section>
      )}

      {/* ================================================================
          CLAIMS SECTION
          ================================================================ */}
      {claims.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '3rem',
            }}
          >
            Cited Evidence · By Substance
          </div>

          <div className="space-y-8">
            {Object.entries(claimsBySubstance).map(([substanceName, substanceClaims]) => (
              <div key={substanceName}>
                <h3
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    color: 'var(--ink)',
                    marginBottom: '1.5rem',
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
                      style={{
                        background: 'rgba(255, 255, 255, 0.3)',
                        borderLeft: '4px solid ' + (statusColors[claim.status] || 'var(--ink-mute)'),
                      }}
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

      {/* ================================================================
          REFERENCE CONTRIBUTIONS SECTION
          ================================================================ */}
      {referenceTerms.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '3rem',
            }}
          >
            Legal Reference · Framework & Doctrine
          </div>

          <div className="tile-grid-3">
            {referenceTerms.map((term) => (
              <Link
                key={term.id}
                href={`/reference/${term.slug}`}
                className="tile rounded-2xl border border-[var(--paper-line)] p-6 md:p-8 transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderLeft: '4px solid var(--crimson)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {term.category}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {term.name}
                </h4>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    color: 'var(--ink-soft)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  {term.short_definition.slice(0, 100)}
                  {term.short_definition.length > 100 ? '...' : ''}
                </p>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--teal)',
                  }}
                >
                  Read more →
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          CROSS-GARDEN LINKS SECTION
          ================================================================ */}
      {crossGardenLinks.length > 0 && (
        <section className="rail-default py-12 md:py-16">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '3rem',
            }}
          >
            Cross-Garden Connections
          </div>

          <div className="tile-grid-3">
            {crossGardenLinks.map((link) => (
              <div
                key={link.id}
                className="tile rounded-2xl border border-[var(--paper-line)] p-6 md:p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  borderLeft: '4px solid var(--indigo)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {link.target_garden}
                </div>
                <h4
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {link.target_external_id}
                </h4>
                {link.notes && (
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      color: 'var(--ink-soft)',
                      marginBottom: '1rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {link.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          FOOTER CTA
          ================================================================ */}
      <section className="rail-default py-16 md:py-20">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/case/sky-valley-pcb-case"
            className="tile rounded-xl border border-[var(--paper-line)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgba(255, 255, 255, 0.4)' }}
          >
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontWeight: 600 }}>
              Open Sky Valley case
            </p>
          </Link>
          <Link
            href="/case"
            className="tile rounded-xl border border-[var(--paper-line)] p-6 text-center transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: 'rgba(255, 255, 255, 0.4)' }}
          >
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)', fontWeight: 600 }}>
              Browse all cases
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
