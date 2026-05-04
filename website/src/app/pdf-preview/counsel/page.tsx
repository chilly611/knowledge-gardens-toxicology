'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import PDFShell from '@/lib/pdf/PDFShell';
import { getCase, getCertifiedClaims, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import { statusColor } from '@/styles/tokens';
import type { CaseDetail, CertifiedClaimRow } from '@/lib/types-tox';

function CounselPDFPreviewPageInner() {
  const searchParams = useSearchParams();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);

  const casePreset = searchParams.get('case');
  const counsel = searchParams.get('counsel') || '';
  const firm = searchParams.get('firm') || '';
  const filingRef = searchParams.get('filing_ref') || '';
  const jurisdiction = searchParams.get('jurisdiction') || '';

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load case data
        if (casePreset) {
          const caseDetail = await getCase(
            casePreset === 'sky-valley' ? 'Sky Valley PCB Case' : casePreset
          );
          setCaseData(caseDetail);

          // Load all claims and filter by case substances
          if (caseDetail?.substances && caseDetail.substances.length > 0) {
            const allClaims = await getCertifiedClaims();
            const substanceIds = caseDetail.substances.map((s) => s.id);
            const filtered = allClaims.filter((c) => substanceIds.includes(c.substance_id));
            setClaims(filtered);
          }
        }
      } catch (err) {
        console.error('Failed to load counsel PDF data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [casePreset]);

  const docId = 'TKG-CSL-' + Date.now().toString(36).toUpperCase();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return <div className="p-12 text-center">Generating exhibit packet...</div>;
  }

  if (!caseData) {
    return (
      <div className="p-12 text-center">
        <p style={{ color: 'var(--ink-mute)' }}>Case data not found.</p>
      </div>
    );
  }

  const caseCaption = caseData.caption || caseData.short_name;

  return (
    <PDFShell
      kind="counsel"
      subtitle={caseCaption}
      metadata={{
        counsel: counsel || 'Unspecified',
        firm: firm || 'Unspecified',
        'filing ref': filingRef || 'TBD',
        jurisdiction: jurisdiction || 'Unknown',
        date: today,
        'doc id': docId,
      }}
    >
      {/* Cover page & TOC */}
      <div className="pdf-page pdf-keep-together mb-8">
        <h1
          className="text-4xl italic mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
          }}
        >
          {caseCaption}
        </h1>
        <div
          className="mb-6"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--ink-mute)',
          }}
        >
          {jurisdiction ? `${jurisdiction} · ` : ''}
          {caseData.filed_year || 'Year TBD'} · {caseData.theory_of_harm || 'Theory of Harm'}
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--paper-line)]">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
              color: 'var(--ink-mute)',
              marginBottom: '1rem',
            }}
          >
            TABLE OF CONTENTS
          </div>
          <ol style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: '1.8' }}>
            <li>Theory of Harm Narrative</li>
            <li>Substance Dossiers</li>
            <li>Daubert Preparation Table</li>
            <li>Expert Credentials</li>
            <li>Case Timeline</li>
            <li>Exhibit Certification</li>
          </ol>
        </div>
      </div>

      {/* Theory of Harm Page */}
      <div className="pdf-page pdf-keep-together mb-8">
        <h2
          className="text-2xl italic mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
          }}
        >
          Theory of Harm Narrative
        </h2>
        <div style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          {caseData.theory_of_harm ||
            `This case examines the causal nexus between exposure to ${caseData.substances.map((s) => s.name).join(' and ')} and the alleged health effects. The claim rests on three tiers of evidence: (1) regulatory position from agencies including EPA and IARC; (2) systematic reviews and meta-analyses from peer-reviewed literature; and (3) individual observational and experimental studies. Together, this evidence establishes a plausible biological mechanism and demonstrates increased disease risk at the exposures relevant to this case.`}
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: '1.7' }}>
          The following dossiers detail the substance-specific evidence, regulatory positions, and sources of scientific disagreement where they exist. Each claim is tagged with certification status and supported by verbatim quotes from the primary literature.
        </div>
      </div>

      {/* Substance Dossiers */}
      {caseData.substances.map((substance) => {
        const substanceClaims = claims.filter((c) => c.substance_id === substance.id);
        if (substanceClaims.length === 0) return null;

        return (
          <div key={substance.id} className="pdf-page pdf-keep-together mb-8">
            <h2
              className="text-2xl italic mb-2"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--ink)',
              }}
            >
              {substance.name}
            </h2>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)', marginBottom: '1rem' }}>
              CAS {substance.cas_number || 'Not assigned'}
            </div>

            {/* Claims for this substance */}
            {substanceClaims.map((claim) => {
              const sourcesByTier = groupSourcesByTier(claim.sources);
              return (
                <div
                  key={claim.claim_id}
                  className="mb-6 p-4 rounded border border-[var(--paper-line)]"
                  style={{ background: 'var(--paper-warm)' }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '2px',
                        background: statusColor(claim.status),
                        color: '#f5f1e8',
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    >
                      {claim.status.toUpperCase()}
                    </span>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        fontSize: '1rem',
                        color: 'var(--ink)',
                      }}
                    >
                      {claim.endpoint_name}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
                    {claim.effect_summary}
                  </div>

                  {/* Sources grouped by tier */}
                  {[1, 2, 3, 4].map((tier) => {
                    const tierSources = sourcesByTier[tier as 1 | 2 | 3 | 4];
                    if (tierSources.length === 0) return null;

                    const tierLabels: Record<number, string> = {
                      1: 'Regulatory',
                      2: 'Systematic Review',
                      3: 'Peer-Reviewed',
                      4: 'Industry/News',
                    };

                    return (
                      <div key={`tier-${tier}`} className="mt-3 ml-3 pl-3 border-l-2 border-[var(--paper-line)]">
                        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', marginBottom: '0.5rem' }}>
                          {tierLabels[tier]}
                        </div>
                        {tierSources.map((source) => {
                          const { text, verified } = quoteOrPending(source.quote);
                          return (
                            <div key={source.title} style={{ fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                                {source.title}
                              </div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-mute)' }}>
                                {source.publisher} {source.year ? `(${source.year})` : ''}
                                {source.doi && (
                                  <>
                                    {' · '}
                                    <a
                                      href={`https://doi.org/${source.doi}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: 'var(--crimson)', textDecoration: 'underline' }}
                                    >
                                      DOI
                                    </a>
                                  </>
                                )}
                              </div>
                              {text && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--ink-soft)', marginTop: '0.25rem', fontStyle: verified ? 'normal' : 'italic' }}>
                                  {verified ? `"${text}"` : `[${text}]`}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Daubert Preparation Table */}
      <div className="pdf-page pdf-keep-together mb-8">
        <h2
          className="text-2xl italic mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
          }}
        >
          Daubert Preparation
        </h2>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--paper-line)' }}>
                <th style={{ textAlign: 'left', padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Claim</th>
                <th style={{ textAlign: 'left', padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Regulatory</th>
                <th style={{ textAlign: 'left', padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Peer-Review</th>
                <th style={{ textAlign: 'left', padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Contradictory</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim) => {
                const sourcesByTier = groupSourcesByTier(claim.sources);
                const regulatory = sourcesByTier[1].length;
                const peerReview = sourcesByTier[2].length + sourcesByTier[3].length;
                const contradictory = claim.sources.filter((s) => !s.supports).length;

                return (
                  <tr key={claim.claim_id} style={{ borderBottom: '1px solid var(--paper-line)' }}>
                    <td style={{ padding: '0.4rem', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                      {claim.endpoint_name}
                    </td>
                    <td style={{ padding: '0.4rem' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '2px',
                          background: statusColor(claim.status),
                          color: '#f5f1e8',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {claim.status.substring(0, 4).toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>
                      {regulatory}
                    </td>
                    <td style={{ padding: '0.4rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>
                      {peerReview}
                    </td>
                    <td style={{ padding: '0.4rem', fontFamily: 'var(--font-mono)', color: contradictory > 0 ? 'var(--crimson)' : 'var(--ink-soft)' }}>
                      {contradictory}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expert Credentials Page */}
      {caseData.experts.length > 0 && (
        <div className="pdf-page pdf-keep-together mb-8">
          <h2
            className="text-2xl italic mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--ink)',
            }}
          >
            Expert Credentials
          </h2>
          {caseData.experts.map((expert, idx) => (
            <div
              key={expert.id}
              className="mb-4"
              style={{
                paddingBottom: idx < caseData.experts.length - 1 ? '1rem' : '0',
                borderBottom: idx < caseData.experts.length - 1 ? '1px solid var(--paper-line)' : 'none',
              }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>
                {expert.full_name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-mute)', marginBottom: '0.5rem' }}>
                {expert.specialty}
              </div>
              {expert.bio && (
                <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', lineHeight: '1.5' }}>
                  {expert.bio}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Case Timeline Page */}
      {caseData.events.length > 0 && (
        <div className="pdf-page pdf-keep-together mb-8">
          <h2
            className="text-2xl italic mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--ink)',
            }}
          >
            Case Timeline
          </h2>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {caseData.events.map((event, idx) => (
              <div key={event.id} style={{ marginBottom: '1rem' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--crimson)',
                    top: '0.3rem',
                  }}
                />
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-mute)' }}>
                  {event.occurred_at ? event.occurred_at.split('T')[0] : 'Date TBD'} · {event.event_type}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--ink)' }}>
                  {event.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certification Page */}
      <div className="pdf-page pdf-keep-together">
        <h2
          className="text-2xl italic mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
          }}
        >
          Exhibit Certification
        </h2>
        <div style={{ fontSize: '0.9rem', color: 'var(--ink-soft)', lineHeight: '1.7', borderTop: '1px solid var(--paper-line)', paddingTop: '1rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            This exhibit packet is generated by the Toxicology Knowledge Garden evidence engine. Each claim presented herein is backed by at least one source from the TKG database.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Quotes marked <span style={{ fontStyle: 'italic' }}>pending verbatim verification</span> await human source confirmation and should be considered placeholder language pending review of the original source.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Confidence scores and claim status (certified, provisional, contested) are computed from primary evidence by automated database triggers. They do NOT reflect counsel work product or legal judgment and are presented for reference only.
          </p>
          <p style={{ color: 'var(--ink-mute)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            Generated {today} · {docId}
          </p>
        </div>
      </div>
    </PDFShell>
  );
}

export default function CounselPDFPreviewPage() {
  return (
    <Suspense fallback={<div style={{padding:'2rem',color:'var(--ink-mute)'}}>Loading...</div>}>
      <CounselPDFPreviewPageInner />
    </Suspense>
  );
}
