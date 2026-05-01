'use client';

/**
 * CaduceusShowcase — Tidepool's cinematic centerpiece.
 *
 * Why: the marketing pitch promises "watch the garden breathe" and "same
 * skeleton across every garden." The showcase is the visual proof — the
 * caduceus glows luminous against the dark Tidepool theme, with concentric
 * orbiting labels that name the demo path (Glyphosate → Stratigraph → Counsel
 * → Daubert) and the cross-garden axes (Builder · Orchid · Health · Nature ·
 * Toxicology).
 *
 * Animations:
 *   • caduceus-drift  → emblem slowly rotates + breathes vertically
 *   • halo-pulse      → soft glow ring breathes around it
 *   • orbit-slow      → outer ring labels rotate clockwise
 *   • orbit-slow-rev  → inner ring labels rotate counter-clockwise
 *
 * All driven by CSS @keyframes so there's no JS animation cost.
 */

import Emblem from '@/components/shared/Emblem';

const OUTER_LABELS = [
  'Glyphosate',
  'Stratigraph',
  'Counsel lane',
  'Daubert pack',
  'Sky Valley',
  'Three sources',
];

const INNER_LABELS = [
  "Builder's",
  'Orchid',
  'Health',
  'Nature',
  'Toxicology',
];

export default function CaduceusShowcase() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #1f3330 0%, #0f1c1a 60%, #08110f 100%)',
        padding: '8rem 1.5rem',
      }}
    >
      {/* Eyebrow + headline above */}
      <div
        className="pointer-events-none absolute left-1/2 top-12 -translate-x-1/2 text-center"
        style={{ zIndex: 4, maxWidth: '52rem', padding: '0 1.5rem' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.55)',
            marginBottom: '1.25rem',
          }}
        >
          The skeleton beneath every garden
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
          }}
        >
          One engine. Five gardens. Same shape.
        </h2>
      </div>

      {/* The orbiting stage — relative positioned, centered */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 'min(820px, 92vw)', height: 'min(820px, 92vw)' }}
      >
        {/* Halo glow rings — 3 concentric, breathing */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '88%',
            height: '88%',
            background: 'radial-gradient(circle, rgba(46,164,163,0.25) 0%, rgba(46,164,163,0) 65%)',
            animation: 'halo-pulse 6s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: '64%',
            height: '64%',
            background: 'radial-gradient(circle, rgba(184,115,51,0.22) 0%, rgba(184,115,51,0) 70%)',
            animation: 'halo-pulse 8s ease-in-out infinite 1s',
          }}
        />

        {/* Outer ring labels (rotate clockwise, slow) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: 'spin 60s linear infinite',
            // counter-rotate the labels themselves so they remain upright
          }}
        >
          {OUTER_LABELS.map((label, i) => {
            const angle = (i / OUTER_LABELS.length) * 360;
            return (
              <div
                key={label}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(min(360px, 38vw)) rotate(-${angle}deg)`,
                  transformOrigin: 'left center',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'translate(-50%, -50%)',
                    animation: 'spin 60s linear infinite reverse',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(46, 164, 163, 0.75)',
                    background: 'rgba(15, 28, 26, 0.55)',
                    border: '1px solid rgba(46, 164, 163, 0.35)',
                    borderRadius: '999px',
                    padding: '0.5rem 1rem',
                    backdropFilter: 'blur(4px)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Inner ring labels (rotate counter-clockwise) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ animation: 'spin 90s linear infinite reverse' }}
        >
          {INNER_LABELS.map((label, i) => {
            const angle = (i / INNER_LABELS.length) * 360;
            return (
              <div
                key={label}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateX(min(220px, 24vw)) rotate(-${angle}deg)`,
                  transformOrigin: 'left center',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    transform: 'translate(-50%, -50%)',
                    animation: 'spin 90s linear infinite',
                    fontFamily: 'var(--font-display)',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                    color: 'rgba(255, 255, 255, 0.65)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* The caduceus itself — luminous, breathing */}
        <div className="relative z-10 flex items-center justify-center">
          <Emblem size="showcase" theme="luminous" animate ariaHidden />
        </div>
      </div>

      {/* Footer caption — the pitch in one line */}
      <div
        className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
        style={{ zIndex: 4, maxWidth: '48rem', padding: '0 1.5rem' }}
      >
        <p
          className="prose-rail"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1.05rem, 1.6vw, 1.3rem)',
            color: 'rgba(255, 255, 255, 0.78)',
            lineHeight: 1.55,
          }}
        >
          The umbrella is the engine. The gardens are the inputs.
        </p>
      </div>

      {/* Honor reduced motion — pause animations */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [class*="halo-pulse"], [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
