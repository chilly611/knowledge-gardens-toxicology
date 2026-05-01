'use client';

import CornerBrackets from '@/components/shared/CornerBrackets';
import { tokens, statusColor } from '@/styles/tokens';
import type { CertifiedClaimRow } from '@/lib/types-tox';

export default function RegulatoryTab({ claims }: { claims: CertifiedClaimRow[] }) {
  // Separate contested claims from others
  const contestedClaims = claims.filter((c) => c.status === 'contested');
  const otherClaims = claims.filter((c) => c.status !== 'contested');

  return (
    <div className="space-y-12">
      {/* Section accent bar */}
      <div className="section-accent" />

      {contestedClaims.length > 0 && (
        <div className="space-y-6">
          <div className="font-eyebrow text-[var(--ink-mute)]">Contested Claims (Supporting vs. Contradicting)</div>

          {contestedClaims.map((claim) => {
            const supportingSources = claim.sources.filter((s) => s.supports);
            const contradictingSources = claim.sources.filter((s) => !s.supports);

            return (
              <div key={claim.claim_id} className="space-y-3">
                <div className="font-display text-lg mb-4">{claim.endpoint_name}</div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Supporting sources */}
                  <CornerBrackets inset={6}>
                    <div className="rounded border-l-4 bg-[var(--paper-warm)] p-6" style={{ borderLeftColor: tokens.teal }}>
                      <div className="font-eyebrow mb-3 text-[var(--teal)]">Supporting</div>
                      {supportingSources.length > 0 ? (
                        <div className="space-y-3">
                          {supportingSources.map((src, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="italic text-[var(--ink)]">{src.title}</div>
                              <div className="font-data text-[var(--ink-mute)] text-xs mt-1">
                                {src.publisher} · {src.year || 'N/A'}
                              </div>
                              {src.tier && (
                                <div className="mt-2">
                                  <span className="inline-block bg-[var(--teal)] text-white text-xs px-2 py-1 rounded font-data">
                                    Tier {src.tier}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-[var(--ink-mute)] font-data">No supporting sources</div>
                      )}
                    </div>
                  </CornerBrackets>

                  {/* Contradicting sources */}
                  <CornerBrackets inset={6}>
                    <div className="rounded border-l-4 bg-[var(--paper-warm)] p-6" style={{ borderLeftColor: tokens.crimson }}>
                      <div className="font-eyebrow mb-3 text-[var(--crimson)]">Contradicting</div>
                      {contradictingSources.length > 0 ? (
                        <div className="space-y-3">
                          {contradictingSources.map((src, idx) => (
                            <div key={idx} className="text-sm">
                              <div className="italic text-[var(--ink)]">{src.title}</div>
                              <div className="font-data text-[var(--ink-mute)] text-xs mt-1">
                                {src.publisher} · {src.year || 'N/A'}
                              </div>
                              {src.tier && (
                                <div className="mt-2">
                                  <span className="inline-block bg-[var(--crimson)] text-white text-xs px-2 py-1 rounded font-data">
                                    Tier {src.tier}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-xs text-[var(--ink-mute)] font-data">No contradicting sources</div>
                      )}
                    </div>
                  </CornerBrackets>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {otherClaims.length > 0 && (
        <div className="space-y-6">
          {contestedClaims.length > 0 && (
            <div className="font-eyebrow text-[var(--ink-mute)]">Regulatory Positions (Non-Contested)</div>
          )}

          {otherClaims.map((claim) => (
            <CornerBrackets key={claim.claim_id} inset={6}>
              <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-6">
                <div
                  className="inline-block rounded-full px-3 py-1 mb-3 text-xs uppercase tracking-wider text-white font-data"
                  style={{ background: statusColor(claim.status) }}
                >
                  {claim.status}
                </div>
                <div className="font-display text-lg mb-2">{claim.endpoint_name}</div>
                <p className="text-[var(--ink)] mb-4">{claim.effect_summary}</p>
                <div className="font-data text-sm text-[var(--ink-mute)]">
                  {claim.source_count} source{claim.source_count !== 1 ? 's' : ''} · Confidence {(claim.confidence_score * 100).toFixed(0)}%
                </div>
              </div>
            </CornerBrackets>
          ))}
        </div>
      )}

      {claims.length === 0 && (
        <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8 text-center">
          <p className="text-[var(--ink-mute)] font-data">No regulatory claims documented</p>
        </div>
      )}
    </div>
  );
}
