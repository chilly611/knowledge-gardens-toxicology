'use client';

import { audienceColor } from '@/styles/tokens';

export default function StageStepper({
  stages,
  current,
  accent,
  onStageClick,
}: {
  stages: string[];
  current: string;
  accent: string;
  onStageClick: (stage: string) => void;
}) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-3 md:pb-0 md:overflow-visible md:gap-3 md:flex-wrap">
      {stages.map((stage, i) => {
        const isActive = stage === current;
        const stageLabel = stage.charAt(0).toUpperCase() + stage.slice(1);
        return (
          <button
            key={stage}
            onClick={() => onStageClick(stage)}
            className={`flex-shrink-0 whitespace-nowrap transition-all rounded-full ${isActive ? 'anim-stage-breathe' : ''}`}
            style={{
              backgroundColor: isActive ? accent : 'var(--paper-warm)',
              color: isActive ? '#f5f1e8' : 'var(--ink-soft)',
              border: isActive ? 'none' : '1px dashed var(--paper-line)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.92rem',
              padding: '0.75rem 1.25rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontWeight: 700 }}>{i + 1}</span>
            <span>{stageLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}
