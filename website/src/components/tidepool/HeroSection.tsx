'use client';

import Organism from '@/components/tidepool/Organism';

/**
 * HeroSection — client component for interactive hero with drifting organisms.
 */
export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-20"
      style={{
        background: 'var(--paper)',
      }}
    >
      {/* Soft radial glow behind headline */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(46,164,163,0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="relative z-10 text-center max-w-4xl">
        <h1
          className="mb-6 text-5xl md:text-6xl lg:text-7xl leading-tight"
          style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}
        >
          Where evidence becomes wonder.
        </h1>

        <p
          className="mb-12 text-xl md:text-2xl"
          style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
          }}
        >
          Three sources behind every claim.
          <br />
          Claims update as evidence accrues.
        </p>

        <a
          href="/flow/consumer"
          className="inline-block px-8 py-4 rounded border transition-all"
          style={{
            borderColor: 'var(--teal)',
            backgroundColor: 'var(--teal)',
            color: 'var(--paper)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '0 8px 24px rgba(46, 164, 163, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Start exploring
        </a>
      </div>

      {/* Drifting organisms in background */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        <Organism
          color="var(--teal)"
          size={80}
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            animation: 'drift 6s ease-in-out infinite',
          }}
        />
        <Organism
          color="var(--peach)"
          size={60}
          style={{
            position: 'absolute',
            top: '70%',
            right: '8%',
            animation: 'drift 7s ease-in-out infinite 1s',
          }}
        />
        <Organism
          color="var(--crimson)"
          size={50}
          style={{
            position: 'absolute',
            top: '40%',
            right: '20%',
            animation: 'drift 8s ease-in-out infinite 0.5s',
          }}
        />
      </div>
    </section>
  );
}
