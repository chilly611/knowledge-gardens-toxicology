'use client';

/**
 * Segmented pill nav. Used across surfaces with different labels:
 *   Loom        → "Highlight weft for:"
 *   Stratigraph → "Viewing as:"
 *   Tidepool    → "Bloom for:"
 *
 * Visual reference: design-references/READ_FIRST.md (loom.png, stratigraph.png, tidepool.png).
 *
 * Pills are paper-warm with hairline border. Active pill has darker fill +
 * stronger border. Label sits to the left in regular Cormorant body.
 */
import { ReactNode } from 'react';

export type SegmentedOption = {
  value: string;
  label: string;
};

export default function SegmentedPills({
  label,
  options,
  value,
  onChange,
  variant = 'light',
  className = '',
}: {
  label: ReactNode;
  options: SegmentedOption[];
  value: string;
  onChange: (next: string) => void;
  /** "light" = paper bg (Loom, Stratigraph). "dark" = dark teal bg (Tidepool). */
  variant?: 'light' | 'dark';
  className?: string;
}) {
  const isDark = variant === 'dark';
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <span
        className={isDark ? 'text-[var(--ink-soft)]' : 'text-[var(--ink-soft)]'}
        style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="rounded-full border px-5 py-2.5 transition-all"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                background: active
                  ? isDark
                    ? 'var(--paper)'
                    : 'var(--paper)'
                  : isDark
                  ? 'transparent'
                  : 'var(--paper)',
                color: active
                  ? isDark
                    ? 'var(--ink)'
                    : 'var(--ink)'
                  : isDark
                  ? 'var(--ink)'
                  : 'var(--ink-soft)',
                borderColor: active
                  ? 'var(--ink)'
                  : isDark
                  ? 'var(--paper-line)'
                  : 'var(--paper-line)',
                borderWidth: active ? 1.5 : 1,
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
