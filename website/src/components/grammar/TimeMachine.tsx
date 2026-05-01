'use client';

/**
 * TimeMachine — the wide engineering-grid band BKG renders directly under
 * the TopFrame on every workflow page.
 *
 * Visual: faint paper-grid bg, seven small stage icons running left, a "TIME
 * MACHINE" Space-Mono eyebrow with a horizontal blue arc/sweep, and a status
 * callout on the right ("0 of 7 stages complete →" or "No exposure logged").
 *
 * Grammar primitive #2.
 */
import Link from 'next/link';
import { STAGES, type StageId } from './stages';

export default function TimeMachine({
  currentStage,
  status,
  /** Optional fraction 0..1 — fills the sweep proportionally to progress. */
  progress = 0,
}: {
  currentStage?: StageId;
  status?: string;
  progress?: number;
}) {
  return (
    <div
      className="border-b border-[var(--paper-line)]"
      style={{
        background: 'var(--paper-warm)',
        backgroundImage: `
          linear-gradient(rgba(184, 115, 51, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(184, 115, 51, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: 7 stage icons in a tight rail */}
        <div className="flex flex-shrink-0 items-center gap-2">
          {STAGES.map((s, i) => {
            const active = currentStage === s.id;
            const past = currentStage && STAGES.findIndex((x) => x.id === currentStage) > i;
            return (
              <Link
                key={s.id}
                href={`/workflow/${s.id}`}
                className="flex flex-col items-center gap-0.5 rounded transition-colors"
                style={{
                  color: active ? 'var(--tox-deep)' : past ? 'var(--copper-orn-deep)' : 'var(--ink-mute)',
                }}
                title={`${s.number}. ${s.label} — ${s.caption}`}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full border text-[10px]"
                  style={{
                    borderColor: active ? 'var(--tox-deep)' : past ? 'var(--copper-orn-deep)' : 'var(--paper-line)',
                    background: active ? 'var(--tox-pale)' : past ? 'var(--paper)' : 'transparent',
                    fontFamily: 'var(--font-mono)',
                  }}
                  aria-hidden
                >
                  {s.glyph}
                </span>
                <span
                  className="hidden md:inline"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}
                >
                  {s.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Middle: TIME MACHINE eyebrow + horizontal blue sweep */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className="text-[var(--copper-orn-deep)]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}
          >
            time machine
          </span>
          <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-[var(--paper-line)]">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${Math.max(4, Math.min(100, progress * 100))}%`,
                background: 'linear-gradient(90deg, var(--tox-soft), var(--tox-deep))',
              }}
            />
          </div>
        </div>

        {/* Right: status text */}
        {status && (
          <span
            className="hidden flex-shrink-0 text-[var(--ink-mute)] sm:inline"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.14em' }}
          >
            {status} →
          </span>
        )}
      </div>
    </div>
  );
}
