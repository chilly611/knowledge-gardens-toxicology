'use client';

import CornerBrackets from '@/components/shared/CornerBrackets';
import CrossGardenLinks from '@/components/shared/CrossGardenLinks';
import { groupSourcesByTier, quoteOrPending } from '@/lib/queries-tox';
import { tokens } from '@/styles/tokens';
import type { CertifiedClaimRow, CrossGardenLink } from '@/lib/types-tox';

const tierAccents: Record<1 | 2 | 3 | 4, { color: string; label: string }> = {
  1: { color: tokens.indigo, label: 'Regulatory' },
  2: { color: tokens.teal, label: 'Systematic Review' },
  3: { color: tokens.peach, label: 'Peer-Reviewed' },
  4: { color: tokens.inkMute, label: 'Industry/News' },
};

export default function EvidenceTab({
  claims,
  crossGardenLinks = [],
}: {
  claims: CertifiedClaimRow[];
  crossGardenLinks?: CrossGardenLink[];
}) {
  // Build a map of all sources across all claims
  const sourcesByTier: Record<1 | 2 | 3 | 4, Array<{ source: any; claimEndpoint: string }>> = {
    1: [],
    2: [],
    3: [],
    4: [],
  };

  for (const claim of claims) {
    const grouped = groupSourcesByTier(claim.sources);
    for (const tier of [1, 2, 3, 4] as const) {
      for (const source of grouped[tier]) {
        sourcesByTier[tier].push({
          source,
          claimEndpoint: claim.endpoint_name,
        });
      }
    }
  }

  return (
    <div className="space-y-12">
      {/* Section accent bar */}
      <div className="section-accent" />

      {claims.length === 0 ? (
        <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8 text-center">
          <p className="text-[var(--ink-mute)] font-data">No evidence sources documented</p>
        </div>
      ) : (
        <div className="space-y-12">
          {([1, 2, 3, 4] as const).map((tier) => {
            const sources = sourcesByTier[tier];
            if (sources.length === 0) return null;

            const accent = tierAccents[tier];

            return (
              <div key={tier} className="space-y-6">
                <div className="font-eyebrow text-[var(--ink-mute)]">
                  <span style={{ color: accent.color }}>Tier {tier}</span> · {accent.label}
                </div>

                <div className="space-y-4">
                  {sources.map((item, idx) => {
                    const src = item.source;
                    const quote = quoteOrPending(src.quote);

                    return (
                      <CornerBrackets key={`${tier}-${idx}`} inset={6}>
                        <div className="rounded border bg-[var(--paper-warm)] p-6" style={{ borderLeftColor: accent.color, borderLeftWidth: 4 }}>
                          {/* Title — italic Cormorant */}
                          <div className="italic text-[var(--ink)] mb-2 text-lg">{src.title}</div>

                          {/* Metadata — Space Mono */}
                          <div className="font-data text-xs text-[var(--ink-mute)] mb-3 space-y-1">
                            <div>
                              {src.publisher || 'Unknown Publisher'} · {src.year || 'N/A'}
                            </div>
                            {src.doi && <div>DOI: {src.doi}</div>}
                          </div>

                          {/* Tier badge */}
                          <div className="mb-4">
                            <span
                              className="inline-block text-white text-xs px-2 py-1 rounded font-data uppercase tracking-wider"
                              style={{ backgroundColor: accent.color }}
                            >
                              {accent.label}
                            </span>
                          </div>

                          {/* Claim endpoint context */}
                          <div className="font-data text-xs text-[var(--ink-soft)] mb-4 py-2 px-3 rounded bg-[var(--paper-deep)]">
                            Related to: {item.claimEndpoint}
                          </div>

                          {/* Quote in pull-quote style */}
                          {quote.text ? (
                            <div className="space-y-2">
                              {quote.verified ? (
                                <blockquote className="italic text-[var(--ink)] border-l-4 border-[var(--copper-orn)] pl-4 py-2">
                                  "{quote.text}"
                                </blockquote>
                              ) : (
                                <div className="py-3 px-4 bg-[var(--paper-deep)] rounded border-l-4" style={{ borderLeftColor: tokens.provisional }}>
                                  <div className="font-data text-xs text-[var(--ink-mute)] mb-1 uppercase tracking-wider">
                                    Pending Verbatim Verification
                                  </div>
                                  <p className="text-[var(--ink-soft)] text-sm">{quote.text}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="font-data text-xs text-[var(--ink-mute)] italic">No verbatim quote available</div>
                          )}
                        </div>
                      </CornerBrackets>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cross-garden links section (E2 integration) */}
      {crossGardenLinks && crossGardenLinks.length > 0 && (
        <section className="mt-12">
          <div className="font-eyebrow mb-4 text-[var(--ink-mute)]">cross-garden context</div>
          <CrossGardenLinks links={crossGardenLinks} />
        </section>
      )}
    </div>
  );
}
