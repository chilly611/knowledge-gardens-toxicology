'use client';

/**
 * StageStepper — the inline breadcrumb of the seven stages directly under the
 * TimeMachine band. Format: "✓ Identify ◎ → ✓ Assess ◇ → [Plan] (you're here)
 * → △ Act → ↻ Adapt → ◉ Resolve → ☐ Reflect"
 *
 * Grammar primitive #3.
 */
import Link from 'next/link';
import { STAGES, type StageId } from './stages';

export default function StageStepper({ currentStage }: { currentStage?: StageId }) {
  const currentIdx = currentStage ? STAGES.findIndex((s) => s.id === currentStage) : -1;

  return (
    <div className="border-b border-[var(--paper-line)]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-2">
          {STAGES.map((s, i) => {
            const isCurrent = currentIdx === i;
            const isPast    = currentIdx > i;
            return (
              <span key={s.id} className="flex items-center gap-1.5">
                {isPast && (
                  <span style={{ color: 'var(--tox-deep)', fontFamily: 'var(--font-display)', fontSize: '0.95rem' }}>✓</span>
                )}
                {isCurrent ? (
                  <span
                    className="rounded-full border px-4 py-2"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      color: 'var(--paper)',
                      background: 'var(--tox-deep)',
                      borderColor: 'var(--tox-deep)',
                    }}
                  >
                    {s.label}
                  </span>
                ) : (
                  <Link
                    href={`/workflow/${s.id}`}
                    className="rounded px-1 transition-colors"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      color: isPast ? 'var(--tox-deep)' : 'var(--ink-mute)',
                    }}
                  >
                    {s.label}
                  </Link>
                )}
                <span aria-hidden style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)' }}>
                  {s.glyph}
                </span>
                {i < STAGES.length - 1 && (
                  <span aria-hidden className="text-[var(--paper-line)]">→</span>
                )}
              </span>
            );
          })}
        </div>
        {currentIdx >= 0 && (
          <div className="mt-2 text-center text-[var(--ink-mute)]" style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontStyle: 'italic' }}>
            (you&rsquo;re here — {STAGES[currentIdx].caption.toLowerCase()})
          </div>
        )}
      </div>
    </div>
  );
}
