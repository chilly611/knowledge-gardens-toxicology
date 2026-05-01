'use client';

// Force dynamic rendering (uses useSearchParams) — bails out of static prerender
export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PDFShell from '@/lib/pdf/PDFShell';
import { getCertifiedClaims, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import { getTraceExamples } from '@/lib/data/trace-examples';
import { statusColor } from '@/styles/tokens';
import type { CertifiedClaimRow } from '@/lib/types-tox';

export default function ConsumerPDFPreviewPage() {
  const searchParams = useSearchParams();
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedIds = (searchParams.get('selected') || '')
    .split(',')
    .filter(Boolean);
  const userName = searchParams.get('name') || '';

  useEffect(() => {
    const loadClaims = async () => {
      try {
        if (selectedIds.length === 0) {
          setClaims([]);
          setLoading(false);
          return;
        }

        const allClaims = await getCertifiedClaims();
        const filtered = allClaims.filter((c) => selectedIds.includes(c.claim_id));
        setClaims(filtered);
      } catch (err) {
        console.error('Failed to load claims for PDF:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClaims();
  }, [selectedIds]);

  const docId = 'TKG-CSR-' + Date.now().toString(36).toUpperCase();
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return <div className="p-12 text-center">Generating briefing...</div>;
  }

  return (
    <PDFShell
      kind="consumer"
      subtitle={userName ? `Prepared for ${userName}` : undefined}
      metadata={{
        date: today,
        'doc id': docId,
      }}
    >
      {/* Personal context paragraph */}
      <div className="pdf-keep-together mb-8">
        <p className="text-[var(--ink-soft)] leading-relaxed">
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic' }}>
            {userName ? `${userName} —` : 'You'}{' '}
          </span>
          these are claims you indicated concern about. Each is backed by ≥ 1 source
          verified by the Toxicology Knowledge Garden's evidence engine.
        </p>
      </div>

      {/* Claim cards */}
      {claims.map((claim) => {
        const trace = getTraceExamples(claim);
        const sourcesByTier = groupSourcesByTier(claim.sources);

        let recommendation = '';
        if (
          claim.status === 'certified' &&
          claim.effect_direction === 'positive_association'
        ) {
          recommendation = `Consider reducing exposure to ${claim.substance_name}. Evidence supports a link to ${claim.endpoint_name.replace(/_/g, ' ')}.`;
        } else if (claim.status === 'contested') {
          recommendation = `Active scientific disagreement on this claim. Evidence exists on both sides.`;
        } else if (claim.status === 'provisional') {
          recommendation = `Emerging concern with preliminary evidence.`;
        }

        return (
          <div key={claim.claim_id} className="pdf-keep-together mb-8 border border-[var(--paper-line)] p-6">
            {/* Status badge and title */}
            <div className="flex items-start gap-3 mb-4">
              <span
                className="text-xs px-2 py-1 rounded font-mono flex-shrink-0"
                style={{
                  background: statusColor(claim.status),
                  color: '#f5f1e8',
                }}
              >
                {claim.status}
              </span>
              <h3
                className="italic text-lg flex-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}
              >
                {claim.substance_name} × {claim.endpoint_name}
              </h3>
            </div>

            {/* Confidence score */}
            <div
              className="text-xs mb-3"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}
            >
              confidence: {claim.confidence_score}%
            </div>

            {/* Effect summary */}
            <p className="text-sm text-[var(--ink-soft)] mb-4">{claim.effect_summary}</p>

            {/* Trace examples */}
            <div className="mb-4 pl-4 border-l-2 border-[var(--paper-line)]">
              <div
                className="text-xs font-mono mb-2"
                style={{ color: 'var(--ink-mute)' }}
              >
                {trace.context}
              </div>
              <ol className="space-y-1 list-none text-xs">
                {trace.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2">
                    <span
                      className="font-mono flex-shrink-0"
                      style={{ color: 'var(--ink-mute)' }}
                    >
                      {i + 1}.
                    </span>
                    <span className="text-[var(--ink-soft)]">{tip}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Recommendation */}
            {recommendation && (
              <div className="mb-4 p-3 bg-[var(--paper-warm)] rounded text-sm text-[var(--ink-soft)]">
                {recommendation}
              </div>
            )}

            {/* Sources grouped by tier */}
            <div className="mt-6 pt-4 border-t border-[var(--paper-line)]">
              <div className="text-xs font-mono mb-3" style={{ color: 'var(--ink-mute)' }}>
                SOURCES
              </div>
              {[1, 2, 3, 4].map((tier) => {
                const tierSources = sourcesByTier[tier as 1 | 2 | 3 | 4];
                if (tierSources.length === 0) return null;

                const tierLabel = {
                  1: 'Regulatory',
                  2: 'Systematic Review',
                  3: 'Peer-Reviewed',
                  4: 'Industry/News',
                }[tier];

                return (
                  <div key={tier} className="mb-3">
                    <div className="text-xs font-mono mb-1" style={{ color: 'var(--ink-mute)' }}>
                      tier {tier} · {tierLabel}
                    </div>
                    {tierSources.map((source, i) => {
                      const quoteParsed = quoteOrPending(source.quote);
                      return (
                        <div key={i} className="text-xs mb-2 pl-2 border-l border-[var(--paper-line)]">
                          <div
                            className="italic"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {source.title}
                          </div>
                          <div
                            className="text-[0.75rem]"
                            style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}
                          >
                            {source.publisher && `${source.publisher} `}
                            {source.year && `${source.year} `}
                            {source.doi && `DOI: ${source.doi}`}
                          </div>
                          {quoteParsed.verified ? (
                            <div className="italic text-[0.75rem] mt-1 text-[var(--ink-soft)]">
                              "{quoteParsed.text}"
                            </div>
                          ) : (
                            <div className="text-[0.75rem] mt-1 inline-block bg-[var(--paper-deep)] px-1 py-0.5 rounded">
                              pending verbatim verification
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* About this briefing section */}
      <div className="pdf-page mt-12 pt-8 border-t border-[var(--paper-line)]">
        <h2
          className="text-2xl italic mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}
        >
          About this briefing
        </h2>
        <div className="space-y-3 text-sm text-[var(--ink-soft)]">
          <p>
            This briefing contains claims that are backed by at least three sources
            verified by the Toxicology Knowledge Garden's evidence engine. When a
            claim is contested, we surface both supporting and contradicting sources
            so you can make informed decisions.
          </p>
          <p>
            The Toxicology Knowledge Garden is a public health resource built to make
            the latest scientific evidence accessible to consumers, healthcare providers,
            and legal counsel. Learn more at www.toxicologyknowledgegarden.org.
          </p>
        </div>
      </div>
    </PDFShell>
  );
}
