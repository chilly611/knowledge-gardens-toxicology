'use client';

/**
 * QuestionRow — BKG's numbered expandable question pill. Appears stacked
 * underneath a WorkflowCard.
 *
 * Grammar primitive #9.
 */
import { useState, ReactNode } from 'react';

export default function QuestionRow({
  number,
  title,
  xp,
  defaultOpen = false,
  children,
}: {
  number: number;
  title: string;
  xp?: number;
  defaultOpen?: boolean;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--paper-line)] bg-[var(--paper)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 bg-[var(--tox-pale)] px-4 py-3 text-left transition-colors hover:bg-[var(--paper-deep)]"
      >
        <span className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[var(--tox-soft)] bg-[var(--paper)] text-[var(--tox-deep)]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}
          >
            {number}
          </span>
          <span className="text-[var(--tox-deep)]" style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600 }}>
            {title}
          </span>
        </span>
        <span className="flex items-center gap-3 text-[var(--tox-deep)]">
          {typeof xp === 'number' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
              +{xp} XP
            </span>
          )}
          <span aria-hidden style={{ transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 200ms ease' }}>
            ▾
          </span>
        </span>
      </button>
      {open && children && (
        <div className="px-4 py-4 text-[var(--ink)]" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.55 }}>
          {children}
        </div>
      )}
    </div>
  );
}
