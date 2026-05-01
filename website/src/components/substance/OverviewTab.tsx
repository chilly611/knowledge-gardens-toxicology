'use client';

import CornerBrackets from '@/components/shared/CornerBrackets';
import { tokens, statusColor } from '@/styles/tokens';
import type { Substance, SubstanceAlias, CertifiedClaimRow } from '@/lib/types-tox';

export default function OverviewTab({
  substance,
  aliases,
  claims,
}: {
  substance: Substance;
  aliases: SubstanceAlias[];
  claims: CertifiedClaimRow[];
}) {
  // Build lede: use description if available, else fallback to "appears across" formula
  const uniqueEndpoints = new Set(claims.map((c) => c.endpoint_category)).size;
  const lede =
    substance.description ||
    `${substance.name} appears across ${claims.length} certified claims spanning ${uniqueEndpoints} endpoint categories.`;

  // Count claims by status
  const statusCounts = {
    certified: claims.filter((c) => c.status === 'certified').length,
    provisional: claims.filter((c) => c.status === 'provisional').length,
    contested: claims.filter((c) => c.status === 'contested').length,
  };

  return (
    <div className="space-y-12">
      {/* Section accent bar */}
      <div className="section-accent" />

      {/* Lede in Cormorant italic */}
      <p className="text-xl italic text-[var(--ink)] leading-relaxed">{lede}</p>

      {/* Key facts panel — Space Mono, in a CornerBrackets frame */}
      <CornerBrackets inset={8}>
        <div className="tile bg-[var(--paper-warm)]">
          <div className="font-eyebrow mb-6 text-[var(--ink-mute)]">Key Facts</div>
          <div className="space-y-4 font-data text-[var(--ink)]">
            {substance.cas_number && (
              <div>
                <div className="text-xs text-[var(--ink-mute)] uppercase tracking-widest mb-1">CAS Number</div>
                <div className="text-[var(--ink)]">{substance.cas_number}</div>
              </div>
            )}
            {substance.molecular_formula && (
              <div>
                <div className="text-xs text-[var(--ink-mute)] uppercase tracking-widest mb-1">Molecular Formula</div>
                <div className="text-[var(--ink)]">{substance.molecular_formula}</div>
              </div>
            )}
            <div>
              <div className="text-xs text-[var(--ink-mute)] uppercase tracking-widest mb-1">Aliases</div>
              <div className="text-[var(--ink)]">{aliases.length}</div>
            </div>
            <div>
              <div className="text-xs text-[var(--ink-mute)] uppercase tracking-widest mb-1">Total Claims</div>
              <div className="text-[var(--ink)]">{claims.length}</div>
            </div>
          </div>
        </div>
      </CornerBrackets>

      {/* Status summary card — color-coded */}
      <div className="space-y-3">
        <div className="font-eyebrow text-[var(--ink-mute)]">Claim Status Summary</div>
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { status: 'certified', count: statusCounts.certified },
              { status: 'provisional', count: statusCounts.provisional },
              { status: 'contested', count: statusCounts.contested },
            ] as const
          ).map(({ status, count }) => (
            <CornerBrackets key={status} inset={6}>
              <div className="tile-inner bg-[var(--paper-warm)] text-center">
                <div
                  className="inline-block rounded-full px-3 py-1 mb-3 text-xs uppercase tracking-wider text-white font-data"
                  style={{ background: statusColor(status) }}
                >
                  {status}
                </div>
                <div className="text-3xl font-display font-bold" style={{ color: statusColor(status) }}>
                  {count}
                </div>
              </div>
            </CornerBrackets>
          ))}
        </div>
      </div>
    </div>
  );
}
