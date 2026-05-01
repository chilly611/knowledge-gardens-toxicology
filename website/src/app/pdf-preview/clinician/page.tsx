'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import PDFShell from '@/lib/pdf/PDFShell';
import { getCertifiedClaims, getCrossGardenLinks, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import { statusColor } from '@/styles/tokens';
import type { CertifiedClaimRow, CrossGardenLink } from '@/lib/types-tox';

const TIER_NAMES: Record<number, string> = {
  1: 'Regulatory',
  2: 'Systematic Review',
  3: 'Peer-Reviewed',
  4: 'Industry/News',
};

export default function ClinicianPDFPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center" style={{ color: 'var(--ink-mute)' }}>Loading PDF preview...</div>}>
      <ClinicianPDFPageInner />
    </Suspense>
  );
}

function ClinicianPDFPageInner() {
  const searchParams = useSearchParams();
  const [allClaims, setAllClaims] = useState<CertifiedClaimRow[]>([]);
  const [biomarkers, setBiomarkers] = useState<Record<string, CrossGardenLink[]>>({});
  const [loading, setLoading] = useState(true);

  const claimsParam = searchParams.get('claims') || '';
  const clinician = decodeURIComponent(searchParams.get('clinician') || '');
  const institution = decodeURIComponent(searchParams.get('institution') || '');
  const patient = decodeURIComponent(searchParams.get('patient') || 'Patient');

  const selectedClaimIds = claimsParam.split(',').filter(Boolean);

  useEffect(() => {
    const loadData = async () => {
      try {
        const claims = await getCertifiedClaims();
        setAllClaims(claims);

        // Load biomarkers for each unique substance
        const substances = new Set(claims.map((c) => c.substance_id));
        const biomarkerMap: Record<string, CrossGardenLink[]> = {};

        for (const substanceId of substances) {
          try {
            const links = await getCrossGardenLinks(substanceId, 'substance');
            biomarkerMap[substanceId] = links.filter(
              (l) => l.relation === 'biomarker_for'
            );
          } catch (err) {
            console.error('Failed to load biomarkers for', substanceId, err);
          }
        }

        setBiomarkers(biomarkerMap);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedClaims = allClaims.filter((c) =>
    selectedClaimIds.includes(c.claim_id)
  );

  const hasContested = selectedClaims.some((c) => c.status === 'contested');

  if (loading) {
    return <div className="p-12">Loading...</div>;
  }

  return (
    <PDFShell
      kind="clinician"
      subtitle={`Patient: ${patient}`}
      metadata={{
        clinician: clinician || 'Requesting clinician',
        institution: institution || 'Institution',
        date: new Date().toISOString().split('T')[0],
        'doc id': `TKG-CLN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      }}
    >
      {/* Differential Summary Table — Page 1 */}
      <section className="pdf-page pdf-keep-together mb-8">
        <h2 className="text-2xl italic mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
          Differential Summary
        </h2>

        <table
          className="w-full text-sm border-collapse"
          style={{ borderColor: 'var(--paper-line)' }}
        >
          <thead>
            <tr style={{ borderBottom: '2px solid var(--paper-line)' }}>
              <th
                className="px-3 py-2 text-left font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-mute)' }}
              >
                Substance × Endpoint
              </th>
              <th
                className="px-3 py-2 text-center font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-mute)' }}
              >
                Status
              </th>
              <th
                className="px-3 py-2 text-center font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-mute)' }}
              >
                Confidence
              </th>
              <th
                className="px-3 py-2 text-center font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-mute)' }}
              >
                Supporting
              </th>
              <th
                className="px-3 py-2 text-center font-mono"
                style={{ fontSize: '0.75rem', color: 'var(--ink-mute)' }}
              >
                Contradicting
              </th>
            </tr>
          </thead>
          <tbody>
            {selectedClaims.map((claim) => {
              const supporting = claim.sources.filter((s) => s.supports).length;
              const contradicting = claim.sources.filter((s) => !s.supports).length;
              return (
                <tr
                  key={claim.claim_id}
                  style={{ borderBottom: '1px solid var(--paper-line)' }}
                >
                  <td className="px-3 py-2">
                    <div className="italic text-xs" style={{ fontFamily: 'var(--font-display)' }}>
                      {claim.substance_name} × {claim.endpoint_name}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span
                      className="px-2 py-1 rounded font-mono text-xs"
                      style={{
                        background: statusColor(claim.status),
                        color: '#f5f1e8',
                      }}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td
                    className="px-3 py-2 text-center font-mono text-xs"
                    style={{ color: 'var(--ink-soft)' }}
                  >
                    {claim.confidence_score.toFixed(0)}%
                  </td>
                  <td
                    className="px-3 py-2 text-center font-mono text-xs"
                    style={{ color: 'var(--teal)' }}
                  >
                    {supporting}
                  </td>
                  <td
                    className="px-3 py-2 text-center font-mono text-xs"
                    style={{ color: 'var(--crimson)' }}
                  >
                    {contradicting}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Per-Claim Detail Pages */}
      {selectedClaims.map((claim, idx) => {
        const sourcesByTier = groupSourcesByTier(claim.sources);
        const isContested = claim.status === 'contested';

        return (
          <section key={claim.claim_id} className="pdf-page pdf-keep-together mb-8">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="px-2 py-1 rounded font-mono text-xs"
                  style={{
                    background: statusColor(claim.status),
                    color: '#f5f1e8',
                  }}
                >
                  {claim.status}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--ink-mute)' }}>
                  Confidence: {claim.confidence_score.toFixed(0)}%
                </span>
              </div>

              <h3
                className="text-xl italic mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}
              >
                {claim.substance_name} × {claim.endpoint_name}
              </h3>

              {claim.effect_summary && (
                <p
                  className="text-sm mb-3"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  {claim.effect_summary}
                </p>
              )}
            </div>

            {isContested ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Supporting sources */}
                <div
                  className="p-3 border-l-4"
                  style={{ borderColor: 'var(--teal)' }}
                >
                  <div
                    className="font-mono text-xs uppercase mb-2"
                    style={{ color: 'var(--teal)' }}
                  >
                    Supporting evidence
                  </div>
                  <SourceListPDF
                    sources={claim.sources.filter((s) => s.supports)}
                  />
                </div>

                {/* Contradicting sources */}
                <div
                  className="p-3 border-l-4"
                  style={{ borderColor: 'var(--crimson)' }}
                >
                  <div
                    className="font-mono text-xs uppercase mb-2"
                    style={{ color: 'var(--crimson)' }}
                  >
                    Contradicting evidence
                  </div>
                  <SourceListPDF
                    sources={claim.sources.filter((s) => !s.supports)}
                  />
                </div>
              </div>
            ) : (
              <SourceListPDF sources={claim.sources} />
            )}

            {/* Biomarker section */}
            {biomarkers[claim.substance_id]?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[var(--paper-line)]">
                <div
                  className="text-xs font-mono uppercase mb-2"
                  style={{ color: 'var(--ink-mute)' }}
                >
                  Recommended biomarkers
                </div>
                <div className="text-xs space-y-1">
                  {biomarkers[claim.substance_id].map((link) => (
                    <div
                      key={link.id}
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      • {link.notes || link.target_external_id}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* Contested Claims Disclosure */}
      {hasContested && (
        <section className="pdf-page pdf-keep-together mb-8">
          <h2
            className="text-lg italic mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}
          >
            Contested Claims & Regulatory Positions
          </h2>

          <div
            className="p-4 rounded"
            style={{ background: 'var(--paper-warm)' }}
          >
            <p
              className="text-sm mb-3"
              style={{ color: 'var(--ink-soft)' }}
            >
              This briefing includes one or more contested claims — substance-health findings where
              authoritative sources disagree. Both supporting and contradicting evidence are presented
              below.
            </p>

            <ul className="text-xs space-y-2 list-disc list-inside" style={{ color: 'var(--ink-soft)' }}>
              <li>
                <strong>IARC:</strong> International Agency for Research on Cancer classifications
              </li>
              <li>
                <strong>EPA:</strong> United States Environmental Protection Agency determinations
              </li>
              <li>
                <strong>EFSA:</strong> European Food Safety Authority assessments
              </li>
            </ul>

            <p
              className="text-xs mt-3"
              style={{ color: 'var(--ink-mute)' }}
            >
              Consult primary regulatory sources and current literature before clinical action.
            </p>
          </div>
        </section>
      )}

      {/* Decision-Support Disclaimer */}
      <section className="pdf-page pdf-keep-together">
        <div
          className="p-4 rounded italic"
          style={{
            background: 'var(--paper-warm)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
          }}
        >
          <p className="mb-2">
            This briefing summarizes evidence selected by the requesting clinician. It is
            decision-support, not a diagnosis. Contested claims show both sides. Quotes marked
            "pending verbatim verification" await human source confirmation. Verify against primary
            sources before clinical action.
          </p>
          <p className="text-xs" style={{ color: 'var(--ink-mute)' }}>
            Generated by Toxicology Knowledge Garden · {new Date().toISOString().split('T')[0]}
          </p>
        </div>
      </section>
    </PDFShell>
  );
}

function SourceListPDF({ sources }: { sources: any[] }) {
  const groupedByTier: Record<number, any[]> = { 1: [], 2: [], 3: [], 4: [] };

  for (const source of sources) {
    const tier = (source.tier || 4) as keyof typeof groupedByTier;
    groupedByTier[tier].push(source);
  }

  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((tier) => {
        const tierSources = groupedByTier[tier as keyof typeof groupedByTier];
        if (tierSources.length === 0) return null;

        return (
          <div key={tier}>
            <div
              className="font-mono text-xs uppercase mb-1"
              style={{ color: 'var(--ink-mute)', fontSize: '0.7rem' }}
            >
              Tier {tier} · {TIER_NAMES[tier]}
            </div>
            <div className="space-y-2 ml-3">
              {tierSources.map((source, i) => {
                const quoted = quoteOrPending(source.quote);
                return (
                  <div key={i} style={{ fontSize: '0.8rem', color: 'var(--ink-soft)' }}>
                    <div
                      className="italic"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {source.title}
                    </div>
                    <div className="font-mono text-xs" style={{ color: 'var(--ink-mute)' }}>
                      {source.publisher}
                      {source.year && ` · ${source.year}`}
                      {source.doi && ` · doi: ${source.doi}`}
                    </div>
                    {quoted.verified ? (
                      <div
                        className="italic text-xs mt-1 leading-snug"
                        style={{ color: 'var(--ink-soft)', fontStyle: 'italic' }}
                      >
                        "{quoted.text}"
                      </div>
                    ) : (
                      <div
                        className="text-xs mt-1 px-1.5 py-0.5 rounded inline-block"
                        style={{
                          background: 'var(--paper-deep)',
                          color: 'var(--ink-mute)',
                        }}
                      >
                        pending verbatim verification
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
