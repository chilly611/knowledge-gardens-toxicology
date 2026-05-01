'use client';

import { useEffect, useState } from 'react';
import WorkflowCard from './WorkflowCard';
import StepRunner from './StepRunner';
import { getCertifiedClaims, getCrossGardenLinks, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import { statusColor } from '@/styles/tokens';
import type { CertifiedClaimRow, CrossGardenLink } from '@/lib/types-tox';

// Curated symptom-to-endpoint mapping for clinician triage
const SYMPTOM_MAPPINGS = [
  {
    symptom: 'non-Hodgkin lymphoma',
    endpoint_category: 'carcinogenicity',
    endpoint_contains: 'non_hodgkin_lymphoma',
  },
  {
    symptom: 'atherosclerotic plaque imaging',
    endpoint_category: 'cardiovascular',
    endpoint_contains: 'atherosclerotic_plaque',
  },
  {
    symptom: 'infertility workup',
    endpoint_category: 'endocrine',
    endpoint_contains: 'fertility',
  },
  {
    symptom: 'neurodevelopmental concern (pediatric)',
    endpoint_category: 'neurodevelopmental',
    endpoint_contains: 'neurodevelopmental',
  },
  {
    symptom: 'persistent GI dysbiosis',
    endpoint_category: 'microbiome',
    endpoint_contains: 'microbiome',
  },
  {
    symptom: 'dermatitis (agricultural worker)',
    endpoint_category: 'occupational',
    endpoint_contains: 'dermat',
  },
];

const EXPOSURE_TYPES = [
  { label: 'occupational', value: 'occupational' },
  { label: 'environmental', value: 'environmental' },
  { label: 'dietary', value: 'dietary' },
  { label: 'mixed', value: 'mixed' },
];

export default function ClinicianFlow({
  stage,
  symptoms,
  suspected,
  patient,
  selectedClaims,
  onSymptomsChange,
  onSuspectedChange,
  onPatientChange,
  onSelectedClaimsChange,
  onNext,
  onPrev,
  stages,
}: {
  stage: string;
  symptoms: string[];
  suspected?: string;
  patient: string;
  selectedClaims: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  onSuspectedChange: (suspected: string) => void;
  onPatientChange: (patient: string) => void;
  onSelectedClaimsChange: (claims: string[]) => void;
  onNext: () => void;
  onPrev: () => void;
  stages: string[];
}) {
  const [allClaims, setAllClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [clinicianName, setClinicianName] = useState('');
  const [institution, setInstitution] = useState('');

  // Load all claims once
  useEffect(() => {
    const loadClaims = async () => {
      try {
        const claims = await getCertifiedClaims();
        setAllClaims(claims);
      } catch (err) {
        console.error('Failed to load claims:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClaims();
  }, []);

  // Filter claims matching selected symptoms
  const filteredClaims = symptoms.length > 0
    ? allClaims.filter((claim) => {
        return symptoms.some((symptom) => {
          const mapping = SYMPTOM_MAPPINGS.find((m) => m.symptom === symptom);
          if (!mapping) return false;
          return (
            claim.endpoint_category === mapping.endpoint_category ||
            claim.endpoint_name.toLowerCase().includes(mapping.endpoint_contains)
          );
        });
      })
    : [];

  // Sort filtered claims: contested first, then by confidence descending
  const sortedFilteredClaims = [...filteredClaims].sort((a, b) => {
    if (a.status === 'contested' && b.status !== 'contested') return -1;
    if (a.status !== 'contested' && b.status === 'contested') return 1;
    return b.confidence_score - a.confidence_score;
  });

  const selectedClaimDetails = allClaims.filter((c) =>
    selectedClaims.includes(c.claim_id)
  );

  if (loading) {
    return <div className="text-center py-12">Loading claims...</div>;
  }

  // Stage: triage
  if (stage === 'triage') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Triage: symptom checklist"
          eyebrow="Stage 1 · Triage"
          accent="var(--indigo)"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-3 subtitle-bold">
                Chief complaint or clinical finding:
              </label>
              <div className="space-y-2">
                {SYMPTOM_MAPPINGS.map((mapping) => (
                  <label
                    key={mapping.symptom}
                    className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-[var(--paper-warm)]"
                  >
                    <input
                      type="checkbox"
                      checked={symptoms.includes(mapping.symptom)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSymptomsChange([...symptoms, mapping.symptom]);
                        } else {
                          onSymptomsChange(
                            symptoms.filter((s) => s !== mapping.symptom)
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{mapping.symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--paper-line)]">
              <label className="block text-sm mb-3 subtitle-bold">
                Suspected exposure route:
              </label>
              <div className="flex flex-col gap-2">
                {EXPOSURE_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="exposure"
                      value={type.value}
                      checked={suspected === type.value}
                      onChange={() => onSuspectedChange(type.value)}
                    />
                    <span className="text-sm capitalize">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--paper-line)]">
              <label className="block text-sm mb-2 subtitle-bold">
                Patient pseudonym (for tracking):
              </label>
              <input
                type="text"
                value={patient}
                onChange={(e) => onPatientChange(e.target.value)}
                placeholder="e.g., 'PT-2026-001'"
                className="w-full px-3 py-2 border border-[var(--paper-line)] rounded text-sm"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
              <div className="text-xs text-[var(--ink-mute)] mt-1">
                Use only a non-identifying label. Do not capture real patient names or IDs.
              </div>
            </div>
          </div>
        </WorkflowCard>

        <StepRunner
          stage={stage}
          stages={stages}
          onNext={onNext}
          onPrev={onPrev}
          canAdvance={symptoms.length > 0 && !!suspected && !!patient}
        />
      </div>
    );
  }

  // Stage: differential
  if (stage === 'differential') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Differential: substance × endpoint claims"
          eyebrow="Stage 2 · Differential"
          accent="var(--indigo)"
        >
          {sortedFilteredClaims.length === 0 ? (
            <div className="text-[var(--ink-mute)] text-sm">
              No claims found matching your symptom selection. Try a different combination.
            </div>
          ) : (
            <div className="space-y-3">
              {sortedFilteredClaims.map((claim) => {
                const isSelected = selectedClaims.includes(claim.claim_id);
                const isContested = claim.status === 'contested';
                return (
                  <div
                    key={claim.claim_id}
                    className="p-3 border rounded transition-all"
                    style={{
                      borderColor: isSelected
                        ? 'var(--indigo)'
                        : 'var(--paper-line)',
                      background: isSelected
                        ? 'rgba(85, 50, 120, 0.04)'
                        : 'transparent',
                      borderWidth: isContested ? '2px' : '1px',
                    }}
                  >
                    <label className="flex gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectedClaimsChange([
                              ...selectedClaims,
                              claim.claim_id,
                            ]);
                          } else {
                            onSelectedClaimsChange(
                              selectedClaims.filter(
                                (id) => id !== claim.claim_id
                              )
                            );
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-xs px-2 py-1 rounded font-mono"
                            style={{
                              background: statusColor(claim.status),
                              color: '#f5f1e8',
                            }}
                          >
                            {claim.status}
                          </span>
                          {isContested && (
                            <span
                              className="text-xs px-2 py-1 rounded font-mono"
                              style={{
                                background: 'var(--crimson)',
                                color: '#f5f1e8',
                              }}
                            >
                              contested
                            </span>
                          )}
                          <span
                            className="text-xs font-mono"
                            style={{ color: 'var(--ink-mute)' }}
                          >
                            {claim.confidence_score.toFixed(0)}% confident
                          </span>
                        </div>
                        <div
                          className="text-sm italic"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {claim.substance_name} × {claim.endpoint_name}
                        </div>
                        <div className="text-xs text-[var(--ink-soft)] mt-1">
                          {claim.effect_summary}
                        </div>
                        <div className="text-xs text-[var(--ink-mute)] mt-1 font-mono">
                          Sources: {claim.source_count}
                        </div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>
          )}
        </WorkflowCard>

        <StepRunner
          stage={stage}
          stages={stages}
          onNext={onNext}
          onPrev={onPrev}
          canAdvance={selectedClaims.length > 0}
        />
      </div>
    );
  }

  // Stage: test
  if (stage === 'test') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Recommended biomarker panel"
          eyebrow="Stage 3 · Test"
          accent="var(--indigo)"
        >
          {selectedClaimDetails.length === 0 ? (
            <div className="text-[var(--ink-mute)] text-sm">
              No claims selected yet.
            </div>
          ) : (
            <BiomarkerPanel claims={selectedClaimDetails} />
          )}
        </WorkflowCard>

        <StepRunner
          stage={stage}
          stages={stages}
          onNext={onNext}
          onPrev={onPrev}
          canAdvance={true}
        />
      </div>
    );
  }

  // Stage: interpret
  if (stage === 'interpret') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Interpret: full claim evidence"
          eyebrow="Stage 4 · Interpret"
          accent="var(--indigo)"
        >
          {selectedClaimDetails.length === 0 ? (
            <div className="text-[var(--ink-mute)] text-sm">
              No claims selected yet.
            </div>
          ) : (
            <div className="space-y-6">
              {selectedClaimDetails.map((claim) => (
                <ClaimCard
                  key={claim.claim_id}
                  claim={claim}
                  isSelected={selectedClaims.includes(claim.claim_id)}
                  onToggle={() => {
                    onSelectedClaimsChange(
                      selectedClaims.includes(claim.claim_id)
                        ? selectedClaims.filter(
                            (id) => id !== claim.claim_id
                          )
                        : [...selectedClaims, claim.claim_id]
                    );
                  }}
                />
              ))}
            </div>
          )}
        </WorkflowCard>

        <StepRunner
          stage={stage}
          stages={stages}
          onNext={onNext}
          onPrev={onPrev}
          canAdvance={selectedClaims.length > 0}
        />
      </div>
    );
  }

  // Stage: brief
  if (stage === 'brief') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Generate Clinical Exposure Brief"
          eyebrow="Stage 5 · Brief"
          accent="var(--indigo)"
        >
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm mb-2 subtitle-bold"
              >
                Clinician name:
              </label>
              <input
                type="text"
                value={clinicianName}
                onChange={(e) => setClinicianName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 border border-[var(--paper-line)] rounded text-sm"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label
                className="block text-sm mb-2 subtitle-bold"
              >
                Institution:
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Hospital or clinic name"
                className="w-full px-3 py-2 border border-[var(--paper-line)] rounded text-sm"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <a
              href={`/pdf-preview/clinician?stage=triage&symptoms=${encodeURIComponent(symptoms.join(','))}&suspected=${suspected}&patient=${encodeURIComponent(patient)}&claims=${selectedClaims.join(',')}&clinician=${encodeURIComponent(clinicianName)}&institution=${encodeURIComponent(institution)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded text-center font-mono uppercase tracking-wide text-white"
              style={{ background: 'var(--indigo)', cursor: 'pointer' }}
            >
              Generate brief →
            </a>

            <p className="text-xs text-[var(--ink-mute)] text-center">
              Decision-support document. Verify against primary sources.
            </p>
          </div>
        </WorkflowCard>

        <StepRunner
          stage={stage}
          stages={stages}
          onNext={onNext}
          onPrev={onPrev}
          canAdvance={selectedClaims.length > 0}
        />
      </div>
    );
  }

  return null;
}

function BiomarkerPanel({ claims }: { claims: CertifiedClaimRow[] }) {
  const [biomarkers, setBiomarkers] = useState<
    Record<string, { links: CrossGardenLink[]; loading: boolean }>
  >({});

  useEffect(() => {
    const loadBiomarkers = async () => {
      const result: typeof biomarkers = {};

      for (const claim of claims) {
        const key = claim.substance_id;
        if (!result[key]) {
          result[key] = { links: [], loading: true };

          try {
            const links = await getCrossGardenLinks(
              claim.substance_id,
              'substance'
            );
            // Filter only biomarker_for relations
            const biomarkerLinks = links.filter(
              (l) => l.relation === 'biomarker_for'
            );
            result[key] = { links: biomarkerLinks, loading: false };
          } catch (err) {
            console.error(
              'Failed to load biomarkers for',
              claim.substance_name,
              err
            );
            result[key] = { links: [], loading: false };
          }
        }
      }

      setBiomarkers(result);
    };

    loadBiomarkers();
  }, [claims]);

  const uniqueSubstances = [
    ...new Map(claims.map((c) => [c.substance_id, c])).values(),
  ];

  return (
    <div className="space-y-4">
      {uniqueSubstances.map((substance) => {
        const info = biomarkers[substance.substance_id] || {
          links: [],
          loading: true,
        };
        return (
          <div
            key={substance.substance_id}
            className="p-3 border border-[var(--paper-line)] rounded"
          >
            <div
              className="text-sm font-display italic mb-2"
              style={{ color: 'var(--ink)' }}
            >
              {substance.substance_name}
            </div>
            {info.loading ? (
              <div className="text-xs text-[var(--ink-mute)]">
                Loading biomarkers...
              </div>
            ) : info.links.length > 0 ? (
              <div className="text-xs space-y-1">
                {info.links.map((link) => (
                  <div
                    key={link.id}
                    className="text-[var(--ink-soft)]"
                  >
                    <span className="font-mono">• {link.notes || link.target_external_id}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[var(--ink-mute)] italic">
                No validated biomarker yet. See Test stage notes.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ClaimCard({
  claim,
  isSelected,
  onToggle,
}: {
  claim: CertifiedClaimRow;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const sourcesByTier = groupSourcesByTier(claim.sources);
  const isContested = claim.status === 'contested';

  return (
    <div
      className="border rounded"
      style={{
        borderColor: isContested ? 'var(--paper-line)' : 'var(--paper-line)',
        borderWidth: '2px',
        paddingLeft: isContested ? '0' : '0',
      }}
    >
      {isContested && (
        <div className="flex">
          {/* Supporting sources (left, teal) */}
          <div className="flex-1 p-4 border-r-2 border-[var(--teal)]">
            <div
              className="text-xs font-mono uppercase mb-3"
              style={{ color: 'var(--teal)' }}
            >
              Supporting
            </div>
            <SourceList
              sources={claim.sources.filter((s) => s.supports)}
              tierGroups={sourcesByTier}
            />
          </div>

          {/* Contradicting sources (right, crimson) */}
          <div className="flex-1 p-4 border-l-2 border-[var(--crimson)]">
            <div
              className="text-xs font-mono uppercase mb-3"
              style={{ color: 'var(--crimson)' }}
            >
              Contradicting
            </div>
            <SourceList
              sources={claim.sources.filter((s) => !s.supports)}
              tierGroups={sourcesByTier}
            />
          </div>
        </div>
      )}

      {!isContested && (
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <span
              className="text-xs px-2 py-1 rounded font-mono flex-shrink-0"
              style={{
                background: statusColor(claim.status),
                color: '#f5f1e8',
              }}
            >
              {claim.status}
            </span>
            <div
              className="text-sm italic"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {claim.substance_name} × {claim.endpoint_name}
            </div>
          </div>

          <div className="text-sm text-[var(--ink-soft)] mb-3">
            {claim.effect_summary}
          </div>

          <SourceList
            sources={claim.sources}
            tierGroups={sourcesByTier}
          />
        </div>
      )}

      <div className="px-4 py-2 border-t border-[var(--paper-line)] bg-[var(--paper-warm)]">
        <label className="flex items-center gap-2 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggle}
          />
          <span>Include in brief</span>
        </label>
      </div>
    </div>
  );
}

function SourceList({
  sources,
  tierGroups,
}: {
  sources: any[];
  tierGroups: Record<1 | 2 | 3 | 4, any[]>;
}) {
  return (
    <div className="space-y-3 text-xs">
      {[1, 2, 3, 4].map((tier) => {
        const tierSources = sources.filter(
          (s) => (s.tier || 4) === tier
        );
        if (tierSources.length === 0) return null;

        const tierNames: Record<number, string> = {
          1: 'Regulatory',
          2: 'Systematic Review',
          3: 'Peer-Reviewed',
          4: 'Industry/News',
        };

        return (
          <div key={tier}>
            <div
              className="font-mono uppercase mb-1"
              style={{ color: 'var(--ink-mute)', fontSize: '0.7rem' }}
            >
              Tier {tier} — {tierNames[tier]}
            </div>
            <div className="space-y-2 ml-2">
              {tierSources.map((source, i) => {
                const quoted = quoteOrPending(source.quote);
                return (
                  <div key={i} className="text-[var(--ink-soft)]">
                    <div
                      className="italic text-xs"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {source.title}
                    </div>
                    <div
                      className="font-mono text-[0.65rem]"
                      style={{ color: 'var(--ink-mute)' }}
                    >
                      {source.publisher}
                      {source.year && ` · ${source.year}`}
                      {source.doi && ` · ${source.doi}`}
                    </div>
                    {quoted.verified ? (
                      <div
                        className="italic text-[0.7rem] mt-1 leading-snug"
                        style={{ color: 'var(--ink-soft)' }}
                      >
                        "{quoted.text}"
                      </div>
                    ) : (
                      <div
                        className="text-[0.65rem] mt-1 px-1 py-0.5 rounded inline-block"
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
