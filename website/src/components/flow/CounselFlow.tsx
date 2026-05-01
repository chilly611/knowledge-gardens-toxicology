'use client';

import { useEffect, useState } from 'react';
import WorkflowCard from './WorkflowCard';
import { getCertifiedClaims, getCase, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import { statusColor } from '@/styles/tokens';
import type { CertifiedClaimRow, CaseDetail } from '@/lib/types-tox';

const THEORIES = [
  { id: 'carcinogenicity', name: 'Carcinogenicity' },
  { id: 'endocrine_disruption', name: 'Endocrine Disruption' },
  { id: 'persistent_organic', name: 'Persistent Organic Pollution' },
  { id: 'cardiovascular_harm', name: 'Cardiovascular Harm' },
  { id: 'neurodevelopmental', name: 'Neurodevelopmental' },
];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const SUBSTANCES_LIST = [
  'Glyphosate',
  'PCBs',
  'Dioxin',
  'Microplastics',
  'Asbestos',
  'Benzene',
];

export default function CounselFlow({
  stage,
  substances,
  jurisdiction,
  theory,
  selectedSourceIds,
  casePreset,
  counselName,
  firm,
  filingRef,
  onSubstancesChange,
  onJurisdictionChange,
  onTheoryChange,
  onSelectedSourcesChange,
  onCounselNameChange,
  onFirmChange,
  onFilingRefChange,
  onClearPreset,
}: {
  stage: string;
  substances: string[];
  jurisdiction: string;
  theory: string;
  selectedSourceIds: string[];
  casePreset?: string;
  counselName: string;
  firm: string;
  filingRef: string;
  onSubstancesChange: (substances: string[]) => void;
  onJurisdictionChange: (jurisdiction: string) => void;
  onTheoryChange: (theory: string) => void;
  onSelectedSourcesChange: (ids: string[]) => void;
  onCounselNameChange: (name: string) => void;
  onFirmChange: (firm: string) => void;
  onFilingRefChange: (ref: string) => void;
  onClearPreset: () => void;
}) {
  const [allClaims, setAllClaims] = useState<CertifiedClaimRow[]>([]);
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all claims for filtering
        const claims = await getCertifiedClaims();
        setAllClaims(claims);

        // If case preset is set, load case data
        if (casePreset) {
          const caseDetail = await getCase(casePreset === 'sky-valley' ? 'Sky Valley PCB Case' : casePreset);
          setCaseData(caseDetail);
        }
      } catch (err) {
        console.error('Failed to load counsel flow data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [casePreset]);

  const filteredClaims = allClaims.filter(
    (c) =>
      substances.length === 0 ||
      substances.includes(c.substance_name)
  );

  if (loading) {
    return <div className="text-center py-12">Loading legal case data...</div>;
  }

  // Stage: frame
  if (stage === 'frame') {
    return (
      <div className="space-y-6">
        {casePreset && (
          <div
            className="p-4 rounded border-l-4"
            style={{ borderColor: 'var(--crimson)', background: 'rgba(232, 55, 89, 0.05)' }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
              LOADED SCENARIO
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--ink)', marginTop: '0.5rem' }}>
              {casePreset === 'sky-valley' && 'Sky Valley PCB Case — Erickson v. Monsanto (WA, 2016)'}
            </div>
            <button
              onClick={onClearPreset}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--crimson)', marginTop: '0.5rem', textDecoration: 'underline' }}
            >
              Clear preset
            </button>
          </div>
        )}

        <WorkflowCard
          title="Select substances"
          eyebrow="Stage 1 · Frame"
          accent="var(--crimson)"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SUBSTANCES_LIST.map((subst) => (
              <button
                key={subst}
                onClick={() => {
                  const updated = substances.includes(subst)
                    ? substances.filter((s) => s !== subst)
                    : [...substances, subst];
                  onSubstancesChange(updated);
                }}
                className="p-3 rounded border-2 transition-all text-left"
                style={{
                  borderColor: substances.includes(subst) ? 'var(--crimson)' : 'var(--paper-line)',
                  background: substances.includes(subst) ? 'rgba(232, 55, 89, 0.05)' : 'transparent',
                  fontFamily: substances.includes(subst) ? 'var(--font-display)' : 'inherit',
                  fontStyle: 'italic',
                  color: 'var(--ink)',
                }}
              >
                {subst}
              </button>
            ))}
          </div>
        </WorkflowCard>

        <WorkflowCard
          title="Jurisdiction"
          eyebrow="Venue"
          accent="var(--crimson)"
        >
          <select
            value={jurisdiction}
            onChange={(e) => onJurisdictionChange(e.target.value)}
            className="w-full p-3 border border-[var(--paper-line)] rounded"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}
          >
            <option value="">Select jurisdiction...</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
            <option value="FEDERAL">Federal</option>
          </select>
        </WorkflowCard>

        <WorkflowCard
          title="Theory of harm"
          eyebrow="Causation"
          accent="var(--crimson)"
        >
          <div className="space-y-2">
            {THEORIES.map((t) => (
              <button
                key={t.id}
                onClick={() => onTheoryChange(t.id)}
                className="w-full p-3 rounded border-2 transition-all text-left"
                style={{
                  borderColor: theory === t.id ? 'var(--crimson)' : 'var(--paper-line)',
                  background: theory === t.id ? 'rgba(232, 55, 89, 0.05)' : 'transparent',
                  color: 'var(--ink)',
                }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                  {t.name}
                </div>
              </button>
            ))}
          </div>
        </WorkflowCard>
      </div>
    );
  }

  // Stage: assemble
  if (stage === 'assemble') {
    return (
      <div className="space-y-6">
        {caseData && (
          <>
            {/* Case parties */}
            <WorkflowCard
              title={`Parties (${caseData.parties.length})`}
              eyebrow="Stage 2 · Assemble"
              accent="var(--crimson)"
            >
              <div className="space-y-2">
                {caseData.parties.map((party) => (
                  <div
                    key={party.id}
                    className="p-3 rounded border border-[var(--paper-line)]"
                    style={{ background: 'var(--paper-warm)' }}
                  >
                    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                      {party.name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                      {party.party_type} {party.role && `· ${party.role}`}
                    </div>
                  </div>
                ))}
              </div>
            </WorkflowCard>

            {/* Case documents */}
            <WorkflowCard
              title={`Documents (${caseData.documents.length})`}
              eyebrow="Evidence"
              accent="var(--crimson)"
            >
              <div className="space-y-2">
                {caseData.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded border border-[var(--paper-line)]">
                    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                      {doc.title}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                      {doc.doc_type} {doc.filed_at && `· ${doc.filed_at.split('T')[0]}`}
                    </div>
                  </div>
                ))}
              </div>
            </WorkflowCard>

            {/* Events timeline */}
            <WorkflowCard
              title={`Timeline (${caseData.events.length})`}
              eyebrow="Procedural"
              accent="var(--crimson)"
            >
              <div className="space-y-2">
                {caseData.events.map((event) => (
                  <div key={event.id} className="p-3 rounded border border-[var(--paper-line)]">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                      {event.event_type} {event.occurred_at && `· ${event.occurred_at.split('T')[0]}`}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            </WorkflowCard>
          </>
        )}

        {/* Claims and sources selection */}
        <WorkflowCard
          title="Select sources for packet"
          eyebrow="Evidence Gathering"
          accent="var(--crimson)"
        >
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <div style={{ color: 'var(--ink-mute)', fontStyle: 'italic' }}>
                Select substances in the previous stage to see claims.
              </div>
            ) : (
              filteredClaims.map((claim) => {
                const sourcesByTier = groupSourcesByTier(claim.sources);
                return (
                  <div key={claim.claim_id} className="p-4 rounded border border-[var(--paper-line)]">
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontStyle: 'italic',
                        color: 'var(--ink)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {claim.substance_name} × {claim.endpoint_name}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                      {claim.status} · {claim.source_count} sources
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </WorkflowCard>
      </div>
    );
  }

  // Stage: argue
  if (stage === 'argue') {
    return (
      <div className="space-y-6 pdf-keep-together">
        <WorkflowCard
          title="Daubert preparation"
          eyebrow="Stage 3 · Argue"
          accent="var(--crimson)"
        >
          <div className="overflow-x-auto">
            <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--paper-line)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Claim</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Regulatory</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Peer-Review</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>Cross-Exam Risk</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim) => {
                  const sourcesByTier = groupSourcesByTier(claim.sources);
                  const regulatory = sourcesByTier[1].length;
                  const peerReview = sourcesByTier[2].length + sourcesByTier[3].length;
                  const contradictory = claim.sources.filter((s) => !s.supports).length;

                  return (
                    <tr key={claim.claim_id} style={{ borderBottom: '1px solid var(--paper-line)' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}>
                        {claim.substance_name}
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '3px',
                            background: statusColor(claim.status),
                            color: '#f5f1e8',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                        {regulatory} source{regulatory !== 1 ? 's' : ''}
                      </td>
                      <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                        {peerReview} source{peerReview !== 1 ? 's' : ''}
                      </td>
                      <td style={{ padding: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--crimson)' }}>
                        {contradictory} contradictory
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </WorkflowCard>
      </div>
    );
  }

  // Stage: witness
  if (stage === 'witness') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Expert credentials"
          eyebrow="Stage 4 · Witness"
          accent="var(--crimson)"
        >
          {caseData && caseData.experts.length > 0 ? (
            <div className="space-y-4">
              {caseData.experts.map((expert) => (
                <div
                  key={expert.id}
                  className="p-4 rounded border border-[var(--paper-line)]"
                  style={{
                    borderLeft: expert.full_name.includes('Dahlgren') ? '4px solid var(--crimson)' : undefined,
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontSize: '1.1rem',
                      color: 'var(--ink)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {expert.full_name}
                    {expert.full_name.includes('Dahlgren') && ' ★'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)', marginBottom: '0.5rem' }}>
                    {expert.specialty}
                  </div>
                  {expert.bio && (
                    <div style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: '1.5' }}>
                      {expert.bio}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--ink-mute)', fontStyle: 'italic' }}>
              No experts available for this case.
            </div>
          )}
        </WorkflowCard>
      </div>
    );
  }

  // Stage: file
  if (stage === 'file') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Header information"
          eyebrow="Stage 5 · File"
          accent="var(--crimson)"
        >
          <div className="space-y-4">
            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                Counsel name
              </label>
              <input
                type="text"
                value={counselName}
                onChange={(e) => onCounselNameChange(e.target.value)}
                placeholder="Jane Smith, Esq."
                className="w-full mt-2 p-3 border border-[var(--paper-line)] rounded"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                Firm
              </label>
              <input
                type="text"
                value={firm}
                onChange={(e) => onFirmChange(e.target.value)}
                placeholder="Smith & Associates LLP"
                className="w-full mt-2 p-3 border border-[var(--paper-line)] rounded"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--ink)' }}
              />
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--ink-mute)' }}>
                Filing reference
              </label>
              <input
                type="text"
                value={filingRef}
                onChange={(e) => onFilingRefChange(e.target.value)}
                placeholder="2026-001"
                className="w-full mt-2 p-3 border border-[var(--paper-line)] rounded"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}
              />
            </div>
          </div>
        </WorkflowCard>

        <div className="mt-8">
          <button
            onClick={() => {
              const params = new URLSearchParams();
              params.set('stage', 'file');
              if (substances.length > 0) params.set('substances', substances.join(','));
              if (jurisdiction) params.set('jurisdiction', jurisdiction);
              if (theory) params.set('theory', theory);
              if (counselName) params.set('counsel', counselName);
              if (firm) params.set('firm', firm);
              if (filingRef) params.set('filing_ref', filingRef);
              if (casePreset) params.set('case', casePreset);
              window.open(`/pdf-preview/counsel?${params.toString()}`, '_blank');
            }}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: 'var(--crimson)',
              color: '#f5f1e8',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              cursor: 'pointer',
            }}
          >
            Generate exhibit packet →
          </button>
        </div>
      </div>
    );
  }

  return null;
}
