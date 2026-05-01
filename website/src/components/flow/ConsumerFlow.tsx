'use client';

import { useEffect, useState } from 'react';
import WorkflowCard from './WorkflowCard';
import StepRunner from './StepRunner';
import { getCertifiedClaims } from '@/lib/queries-tox';
import { getTraceExamples } from '@/lib/data/trace-examples';
import { statusColor } from '@/styles/tokens';
import { quoteOrPending } from '@/lib/queries-tox';
import type { CertifiedClaimRow } from '@/lib/types-tox';

const CONCERN_CATEGORIES = [
  { emoji: '🥬', name: 'Food', endpoint_category: 'food_contamination' },
  { emoji: '💧', name: 'Water', endpoint_category: 'aquatic_acute_toxicity' },
  { emoji: '🧴', name: 'Household', endpoint_category: 'household_products' },
  { emoji: '🦺', name: 'Occupational', endpoint_category: 'occupational_exposure' },
];

export default function ConsumerFlow({
  stage,
  concern,
  selectedIds,
  userName,
  onConcernChange,
  onSelectedChange,
  onUserNameChange,
}: {
  stage: string;
  concern?: string;
  selectedIds: string[];
  userName: string;
  onConcernChange: (concern: string) => void;
  onSelectedChange: (ids: string[]) => void;
  onUserNameChange: (name: string) => void;
}) {
  const [allClaims, setAllClaims] = useState<CertifiedClaimRow[]>([]);
  const [claimsByCategory, setClaimsByCategory] = useState<Record<string, CertifiedClaimRow[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const claims = await getCertifiedClaims();
        setAllClaims(claims);

        // Group by endpoint_category
        const grouped: Record<string, CertifiedClaimRow[]> = {};
        for (const cat of CONCERN_CATEGORIES) {
          grouped[cat.endpoint_category] = claims.filter(
            (c) => c.endpoint_category === cat.endpoint_category
          );
        }
        setClaimsByCategory(grouped);
      } catch (err) {
        console.error('Failed to load claims:', err);
      } finally {
        setLoading(false);
      }
    };
    loadClaims();
  }, []);

  const filteredClaims = concern
    ? claimsByCategory[concern] || []
    : [];

  const selectedClaims = allClaims.filter((c) => selectedIds.includes(c.claim_id));

  if (loading) {
    return <div className="text-center py-12">Loading claims...</div>;
  }

  // Stage: identify
  if (stage === 'identify') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="What concerns you?"
          eyebrow="Stage 1 · Identify"
          accent="var(--teal)"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONCERN_CATEGORIES.map((cat) => {
              const claimCount = (claimsByCategory[cat.endpoint_category] || []).length;
              return (
                <button
                  key={cat.endpoint_category}
                  onClick={() => onConcernChange(cat.endpoint_category)}
                  className="p-4 rounded border-2 transition-all text-center"
                  style={{
                    borderColor:
                      concern === cat.endpoint_category
                        ? 'var(--teal)'
                        : 'var(--paper-line)',
                    background:
                      concern === cat.endpoint_category
                        ? 'rgba(46, 164, 163, 0.05)'
                        : 'transparent',
                  }}
                >
                  <div className="text-4xl mb-2">{cat.emoji}</div>
                  <div
                    className="font-display text-lg italic"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {cat.name}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink-mute)',
                    }}
                  >
                    {claimCount} claim{claimCount !== 1 ? 's' : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </WorkflowCard>
        <StepRunner
          stage={stage}
          stages={['identify', 'discover', 'trace', 'decide', 'carry']}
          onNext={() => {
            // will be called by parent
          }}
          onPrev={() => {
            // will be called by parent
          }}
          canAdvance={!!concern}
        />
      </div>
    );
  }

  // Stage: discover
  if (stage === 'discover') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Which claims matter to you?"
          eyebrow="Stage 2 · Discover"
          accent="var(--teal)"
        >
          <div className="space-y-4">
            {filteredClaims.length === 0 ? (
              <p className="text-[var(--ink-mute)]">No claims found for this category.</p>
            ) : (
              filteredClaims.map((claim) => {
                const isSelected = selectedIds.includes(claim.claim_id);
                return (
                  <div
                    key={claim.claim_id}
                    className="p-4 border border-[var(--paper-line)] rounded"
                  >
                    <label className="flex gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onSelectedChange([...selectedIds, claim.claim_id]);
                          } else {
                            onSelectedChange(
                              selectedIds.filter((id) => id !== claim.claim_id)
                            );
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span
                            className="text-xs px-2 py-1 rounded font-mono"
                            style={{
                              background: statusColor(claim.status),
                              color: '#f5f1e8',
                            }}
                          >
                            {claim.status}
                          </span>
                          <div className="flex-1">
                            <div
                              className="italic text-sm"
                              style={{ fontFamily: 'var(--font-display)' }}
                            >
                              {claim.substance_name} × {claim.endpoint_name}
                            </div>
                            <div className="text-sm text-[var(--ink-soft)] mt-1">
                              {claim.effect_summary}
                            </div>
                          </div>
                        </div>
                        <details className="mt-3 text-xs">
                          <summary className="cursor-pointer text-[var(--ink-mute)] hover:text-[var(--ink)]">
                            Show sources ({claim.source_count})
                          </summary>
                          <div className="mt-2 space-y-2 pl-4 border-l border-[var(--paper-line)]">
                            {claim.sources.map((source, i) => {
                              const quoteParsed = quoteOrPending(source.quote);
                              return (
                                <div key={i} className="text-[var(--ink-mute)]">
                                  <div className="font-mono">
                                    {source.title}
                                    {source.year && ` (${source.year})`}
                                  </div>
                                  {quoteParsed.verified ? (
                                    <div className="italic text-xs mt-1">
                                      "{quoteParsed.text}"
                                    </div>
                                  ) : (
                                    <div className="text-xs mt-1 bg-[var(--paper-deep)] px-2 py-1 rounded inline-block">
                                      pending verbatim verification
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      </div>
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </WorkflowCard>
        <StepRunner
          stage={stage}
          stages={['identify', 'discover', 'trace', 'decide', 'carry']}
          onNext={() => {}}
          onPrev={() => {}}
          canAdvance={selectedIds.length > 0}
        />
      </div>
    );
  }

  // Stage: trace
  if (stage === 'trace') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Daily touchpoints & tips"
          eyebrow="Stage 3 · Trace"
          accent="var(--teal)"
        >
          <div className="space-y-6">
            {selectedClaims.length === 0 ? (
              <p className="text-[var(--ink-mute)]">No claims selected yet.</p>
            ) : (
              selectedClaims.map((claim) => {
                const trace = getTraceExamples(claim);
                return (
                  <div key={claim.claim_id} className="border-l-4 border-[var(--teal)] pl-4">
                    <div
                      className="italic text-sm mb-2"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}
                    >
                      {claim.substance_name} × {claim.endpoint_name}
                    </div>
                    <div
                      className="text-xs font-mono mb-2"
                      style={{ color: 'var(--ink-mute)' }}
                    >
                      {trace.context}
                    </div>
                    <ol className="space-y-1 list-none">
                      {trace.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span
                            className="font-mono text-[var(--teal)]"
                            style={{ minWidth: '1.5rem' }}
                          >
                            {i + 1}.
                          </span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })
            )}
          </div>
        </WorkflowCard>
        <StepRunner
          stage={stage}
          stages={['identify', 'discover', 'trace', 'decide', 'carry']}
          onNext={() => {}}
          onPrev={() => {}}
          canAdvance={true}
        />
      </div>
    );
  }

  // Stage: decide
  if (stage === 'decide') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Recommendations"
          eyebrow="Stage 4 · Decide"
          accent="var(--teal)"
        >
          <div className="space-y-4">
            {selectedClaims.length === 0 ? (
              <p className="text-[var(--ink-mute)]">No claims selected yet.</p>
            ) : (
              selectedClaims.map((claim) => {
                let recommendation = '';
                if (
                  claim.status === 'certified' &&
                  claim.effect_direction === 'positive_association'
                ) {
                  recommendation = `Consider reducing exposure to ${claim.substance_name}. Evidence supports a link to ${claim.endpoint_name.replace(/_/g, ' ')}.`;
                } else if (claim.status === 'contested') {
                  recommendation = `Active scientific disagreement on ${claim.substance_name} and ${claim.endpoint_name.replace(/_/g, ' ')}. Evidence exists on both sides; consult healthcare providers for personalized guidance.`;
                } else if (claim.status === 'provisional') {
                  recommendation = `Emerging concern: not yet enough robust evidence for ${claim.substance_name} and ${claim.endpoint_name.replace(/_/g, ' ')}. Monitor new research as it develops.`;
                } else {
                  recommendation = `${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)} finding: ${claim.effect_summary || 'see sources for details'}.`;
                }

                return (
                  <div
                    key={claim.claim_id}
                    className="p-4 border border-[var(--paper-line)] rounded"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className="text-xs px-2 py-1 rounded font-mono"
                        style={{
                          background: statusColor(claim.status),
                          color: '#f5f1e8',
                        }}
                      >
                        {claim.status}
                      </span>
                      <div
                        className="italic text-sm"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {claim.substance_name} × {claim.endpoint_name}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--ink-soft)]">{recommendation}</p>
                  </div>
                );
              })
            )}
          </div>
        </WorkflowCard>
        <StepRunner
          stage={stage}
          stages={['identify', 'discover', 'trace', 'decide', 'carry']}
          onNext={() => {}}
          onPrev={() => {}}
          canAdvance={true}
        />
      </div>
    );
  }

  // Stage: carry
  if (stage === 'carry') {
    return (
      <div className="space-y-6">
        <WorkflowCard
          title="Generate your briefing"
          eyebrow="Stage 5 · Carry"
          accent="var(--teal)"
        >
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                What's your name?
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => onUserNameChange(e.target.value)}
                placeholder="First name (optional)"
                className="w-full px-3 py-2 border border-[var(--paper-line)] rounded"
                style={{ fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <a
              href={`/pdf-preview/consumer?selected=${selectedIds.join(',')}&name=${encodeURIComponent(userName)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded text-center font-mono uppercase tracking-wide text-white"
              style={{ background: 'var(--teal)', cursor: 'pointer' }}
            >
              Generate my briefing →
            </a>

            <p className="text-xs text-[var(--ink-mute)] text-center">
              Three sources behind every claim. Briefing is print-ready.
            </p>
          </div>
        </WorkflowCard>
        <StepRunner
          stage={stage}
          stages={['identify', 'discover', 'trace', 'decide', 'carry']}
          onNext={() => {}}
          onPrev={() => {}}
          canAdvance={true}
        />
      </div>
    );
  }

  return null;
}
