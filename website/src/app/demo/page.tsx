'use client';

import { useState, useEffect } from 'react';
import DemoStage from '@/components/demo/DemoStage';
import Emblem from '@/components/shared/Emblem';
import { useReducedMotion } from '@/lib/animations';

const STAGES = [
  {
    number: 1,
    title: 'Tidepool',
    durationMs: 3000,
    caption: 'The front door — where evidence becomes wonder.',
    notes: 'Bioluminescent organisms = substances. Their orbiting blooms = claims. Notice the manifesto reveals as you scroll.',
    url: '/welcome',
  },
  {
    number: 2,
    title: 'Loom',
    durationMs: 5000,
    caption: 'Every cell is a claim, backed by three sources.',
    notes: 'Warp = substances. Weft = endpoints. Color = certified / contested / provisional. Click any cell to drill in.',
    url: '/',
  },
  {
    number: 3,
    title: 'Contested Cell Hover',
    durationMs: 3000,
    caption: 'Honest disagreement is first-class.',
    notes: 'Glyphosate × non-Hodgkin lymphoma is contested. We don\'t pick a winner. We show both sides.',
    url: '/?cell=glyphosate-non_hodgkin_lymphoma',
  },
  {
    number: 4,
    title: 'Glyphosate Stratigraph',
    durationMs: 4000,
    caption: 'Drill from consumer plain language to primary evidence in four tabs.',
    notes: 'Overview, Mechanism, Regulatory, Evidence. The Regulatory tab is where IARC vs EPA lives, side-by-side.',
    url: '/substance/glyphosate',
  },
  {
    number: 5,
    title: 'Counsel Flow with Sky Valley',
    durationMs: 8000,
    caption: 'Five stages, real case, real expert.',
    notes: 'Erickson v. Monsanto, WA, 2016. Dr. Dahlgren is the lead expert. Frame, assemble, argue, witness, file — and the packet at the end is filing-grade.',
    url: '/flow/counsel?case=sky-valley',
  },
  {
    number: 6,
    title: 'PDF Generation',
    durationMs: 3000,
    caption: 'What a partner downloads in 90 seconds.',
    notes: 'Caduceus watermark, exhibit-list TOC, theory-of-harm narrative, substance dossiers, Daubert table, expert credentials, case timeline. Print or Save as PDF.',
    url: '/pdf-preview/counsel?case=sky-valley',
  },
  {
    number: 7,
    title: 'Cross-Garden Links',
    durationMs: 3000,
    caption: 'TKG is one node. HKG and NatureMark are siblings.',
    notes: 'The umbrella metaphor literalized. Every substance ties out to clinical biomarkers, ecology, and beyond.',
    url: '/substance/glyphosate#evidence',
  },
];

const TOTAL_DURATION_MS = STAGES.reduce((sum, s) => sum + s.durationMs, 0);

export default function DemoPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [showSharePopover, setShowSharePopover] = useState(false);
  const prefersReduced = useReducedMotion();

  const currentStage = STAGES[currentStageIndex];

  // Autoplay logic
  useEffect(() => {
    if (!isAutoplay || prefersReduced) return;

    const timer = setTimeout(() => {
      setCurrentStageIndex((prev) => (prev + 1) % STAGES.length);
    }, currentStage.durationMs);

    return () => clearTimeout(timer);
  }, [currentStageIndex, isAutoplay, currentStage.durationMs, prefersReduced]);

  const handleNext = () => {
    setCurrentStageIndex((prev) => (prev + 1) % STAGES.length);
  };

  const handlePrev = () => {
    setCurrentStageIndex((prev) => (prev - 1 + STAGES.length) % STAGES.length);
  };

  const handleStageClick = (index: number) => {
    setCurrentStageIndex(index);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowSharePopover(false);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatDuration = (ms: number) => {
    const totalSecs = Math.round(TOTAL_DURATION_MS / 1000);
    return `${totalSecs}s`;
  };

  return (
    <main data-surface="tkg" className="min-h-screen">
      {/* Header banner */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          borderColor: 'var(--paper-line)',
          background: 'var(--paper)',
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo + title */}
            <div className="flex items-center gap-3">
              <Emblem size="inline" />
              <div>
                <h1
                  className="text-lg font-semibold italic"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--ink)',
                  }}
                >
                  Toxicology Knowledge Garden
                </h1>
                <p
                  className="text-xs"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--ink-mute)',
                  }}
                >
                  Guided tour · {formatDuration(TOTAL_DURATION_MS)}
                </p>
              </div>
            </div>

            {/* Share button */}
            <div className="relative">
              <button
                onClick={() => setShowSharePopover(!showSharePopover)}
                className="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
                style={{
                  background: 'var(--peach)',
                  color: 'white',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Share with a partner →
              </button>

              {showSharePopover && (
                <div
                  className="absolute right-0 top-full mt-2 rounded border bg-white p-4 shadow-lg"
                  style={{
                    borderColor: 'var(--paper-line)',
                    minWidth: '280px',
                  }}
                >
                  <p
                    className="mb-3 text-xs font-semibold uppercase"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink-mute)',
                    }}
                  >
                    Share preset links
                  </p>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${typeof window !== 'undefined' ? window.location.origin : ''}/flow/counsel?case=sky-valley&from=dahlgren`
                      )
                    }
                    className="mb-2 w-full rounded border bg-[var(--paper)] px-3 py-2 text-left text-xs transition-colors hover:bg-[var(--paper-warm)]"
                    style={{
                      borderColor: 'var(--paper-line)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink)',
                    }}
                  >
                    Share with Dr. Dahlgren
                  </button>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${typeof window !== 'undefined' ? window.location.origin : ''}/flow/clinician?from=bou`
                      )
                    }
                    className="w-full rounded border bg-[var(--paper)] px-3 py-2 text-left text-xs transition-colors hover:bg-[var(--paper-warm)]"
                    style={{
                      borderColor: 'var(--paper-line)',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--ink)',
                    }}
                  >
                    Share with John Bou
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Demo stage */}
        <DemoStage
          stageNumber={currentStage.number}
          totalStages={STAGES.length}
          durationMs={currentStage.durationMs}
          caption={currentStage.caption}
          notes={currentStage.notes}
          url={currentStage.url}
          isActive={true}
        />

        {/* Controls */}
        <div className="mt-12 space-y-6">
          {/* Navigation buttons */}
          <div className="flex gap-4">
            <button
              onClick={handlePrev}
              className="rounded-full px-6 py-3 font-semibold transition-colors"
              style={{
                background: 'var(--paper-deep)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="rounded-full px-6 py-3 font-semibold transition-colors"
              style={{
                background: isAutoplay ? 'var(--crimson)' : 'var(--paper-deep)',
                color: isAutoplay ? 'white' : 'var(--ink)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {isAutoplay ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={handleNext}
              className="rounded-full px-6 py-3 font-semibold transition-colors"
              style={{
                background: 'var(--paper-deep)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Next →
            </button>
          </div>

          {/* Stage navigator pills */}
          <nav className="flex flex-wrap gap-2">
            {STAGES.map((stage, index) => (
              <button
                key={stage.number}
                onClick={() => handleStageClick(index)}
                className="rounded-full px-3 py-1 text-xs font-semibold transition-all"
                style={{
                  background:
                    index === currentStageIndex ? 'var(--peach)' : 'var(--paper-line)',
                  color:
                    index === currentStageIndex ? 'white' : 'var(--ink-mute)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {stage.number}
              </button>
            ))}
          </nav>

          {/* Stage info */}
          <div
            className="rounded border border-dashed p-4"
            style={{ borderColor: 'var(--paper-line)' }}
          >
            <p
              className="text-sm"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--ink-mute)',
              }}
            >
              <span className="font-semibold">Current:</span> {currentStage.title}
              {isAutoplay && (
                <span className="ml-2">
                  (autoplaying in {Math.ceil(currentStage.durationMs / 1000)}s)
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
