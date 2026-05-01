'use client';

import type { CertifiedClaimRow } from '@/lib/types-tox';

/**
 * Subtle pastel-tinted cell for the Loom matrix. Reference: design-references/loom.png.
 *
 * Status backgrounds — subtle tints, NOT saturated jewel solids:
 *   certified   → mint-tinted bg, deep teal pill text
 *   contested   → blush-tinted bg, deep crimson pill text
 *   provisional → peach-cream bg, copper pill text
 *
 * Empty cells = pure white with centered em-dash.
 */

const TINT: Record<string, { bg: string; pillBg: string; pillText: string; border: string }> = {
  certified: {
    bg:       '#e3efe5',
    pillBg:   'rgba(31, 126, 125, 0.13)',
    pillText: '#1f7e7d',
    border:   '#c8dccc',
  },
  contested: {
    bg:       '#f5dadd',
    pillBg:   'rgba(184, 36, 63, 0.13)',
    pillText: '#b8243f',
    border:   '#e3bcc1',
  },
  provisional: {
    bg:       '#fbe7d2',
    pillBg:   'rgba(160, 90, 24, 0.13)',
    pillText: '#a05a18',
    border:   '#ecceaa',
  },
};

export default function LoomCell({
  claim,
  highlighted,
  dimmed,
  onClick,
}: {
  claim: CertifiedClaimRow | null;
  highlighted: boolean;
  dimmed: boolean;
  onClick?: () => void;
}) {
  // Empty cell
  if (!claim) {
    return (
      <div
        className="flex min-h-[110px] flex-col items-center justify-center rounded-md border-[0.5px] transition-opacity"
        style={{
          background: 'var(--paper)',
          borderColor: 'rgba(216, 205, 177, 0.4)',
          opacity: dimmed ? 0.55 : 1
        }}
      >
        <span
          className="text-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--ink-mute)',
            opacity: 0.4,
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            lineHeight: 1.3,
            maxWidth: '90%'
          }}
        >
          more variables grow here as the data graph expands
        </span>
      </div>
    );
  }

  const tint = TINT[claim.status] ?? TINT.certified;
  const confidence = (claim.confidence_score ?? 0).toFixed(2);
  const statusLabel =
    claim.status === 'certified'   ? `CERTIFIED · ${confidence}` :
    claim.status === 'provisional' ? `PROVISIONAL · ${confidence}` :
    claim.status === 'contested'   ? 'CONTESTED' :
    claim.status.toUpperCase();

  // Short summary; the loom cell deliberately compresses into a phrase
  const summary = compress(claim.effect_summary ?? '');

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[110px] w-full flex-col items-start gap-3 rounded-md border p-6 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm focus:outline-none"
      style={{
        background: tint.bg,
        borderColor: tint.border,
        opacity: dimmed ? 0.5 : 1,
        boxShadow: highlighted ? '0 0 0 1.5px var(--ink-mute) inset' : undefined,
        paddingTop: '1.25rem',
        paddingBottom: '1.25rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
      }}
    >
      <span
        className="rounded px-3 py-1.5"
        style={{
          background:    tint.pillBg,
          color:         tint.pillText,
          fontFamily:    'var(--font-mono)',
          fontSize:      '0.7rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        {statusLabel}
      </span>
      <span
        className="text-[var(--ink)] flex-1 mt-2"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          fontWeight: 500
        }}
      >
        {summary}
      </span>
    </button>
  );
}

/** Compress an effect_summary to a short cell phrase (~50–80 chars). */
function compress(text: string): string {
  if (!text) return '';
  // Try to grab the first phrase before a colon or em-dash; fall back to first ~80 chars.
  const trimmed = text.trim();
  const upToBreak = trimmed.match(/^(.{20,80}?)([:.—\-]|\s—\s|, but| while | which )/);
  if (upToBreak) return upToBreak[1].trim();
  return trimmed.length > 80 ? trimmed.slice(0, 78).trimEnd() + '…' : trimmed;
}
