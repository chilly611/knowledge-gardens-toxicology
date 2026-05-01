'use client';

import { useReducedMotion } from '@/lib/animations';

export default function DemoStage({
  stageNumber,
  totalStages,
  durationMs,
  caption,
  notes,
  url,
  isActive,
}: {
  stageNumber: number;
  totalStages: number;
  durationMs: number;
  caption: string;
  notes: string;
  url: string;
  isActive: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const progressPercent = ((stageNumber - 1) / (totalStages - 1)) * 100;

  return (
    <div
      className="space-y-6 transition-opacity duration-300"
      style={{
        opacity: isActive ? 1 : 0.5,
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {/* Stage number and duration */}
      <div className="flex items-center justify-between">
        <span
          className="font-mono text-sm tracking-widest uppercase"
          style={{ color: 'var(--ink-mute)' }}
        >
          Stage {stageNumber} of {totalStages}
        </span>
        <span className="font-mono text-sm" style={{ color: 'var(--ink-mute)' }}>
          {Math.ceil(durationMs / 1000)}s
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 w-full rounded-full"
        style={{ background: 'var(--paper-line)' }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            background: 'var(--peach)',
            width: `${progressPercent}%`,
            transition: prefersReduced ? 'none' : 'width 0.3s ease-out',
          }}
        />
      </div>

      {/* iframe or screenshot area */}
      <div className="rounded border" style={{ borderColor: 'var(--paper-line)' }}>
        <iframe
          src={url}
          className="w-full rounded"
          style={{ height: '560px', border: 'none' }}
          title={`Demo stage ${stageNumber}: ${caption}`}
        />
      </div>

      {/* Caption */}
      <div className="space-y-3">
        <p
          className="text-lg italic"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink)',
          }}
        >
          {caption}
        </p>

        {/* Presenter notes */}
        <p
          className="text-sm"
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--ink-mute)',
          }}
        >
          {notes}
        </p>
      </div>
    </div>
  );
}
