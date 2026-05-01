'use client';

export default function StepRunner({
  stage,
  stages,
  onNext,
  onPrev,
  canAdvance,
}: {
  stage: string;
  stages: string[];
  onNext: () => void;
  onPrev: () => void;
  canAdvance: boolean;
}) {
  const currentIndex = stages.indexOf(stage);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === stages.length - 1;

  return (
    <div className="flex gap-4 justify-center mt-12">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className="cta-pill cta-pill-secondary disabled:opacity-40"
      >
        ← prev
      </button>
      <button
        onClick={onNext}
        disabled={!canAdvance || isLast}
        className={`cta-pill ${canAdvance && !isLast ? 'cta-pill-primary' : 'cta-pill-secondary'} disabled:opacity-40`}
      >
        next →
      </button>
    </div>
  );
}
