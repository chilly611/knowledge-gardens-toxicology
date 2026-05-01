'use client';

/**
 * TidepoolEntry — dramatic transition section from paper world to dark Tidepool.
 * One-message-per-screen (80vh min-height), final CTA before the dark landing.
 * Vertical gradient from paper at top through paper-warm to deep slate at bottom.
 */
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function TidepoolEntry() {
  return (
    <section
      className="relative overflow-hidden min-h-[80vh] flex items-center"
      style={{
        background: `linear-gradient(180deg, var(--paper) 0%, var(--paper-warm) 40%, #0e1827 100%)`,
      }}
    >
      {/* Subtle radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 30%, rgba(46, 164, 163, 0.06) 0%, transparent 50%)`,
        }}
      />

      {/* Dark overlay scrim for text readability */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(
            180deg,
            rgba(14, 24, 39, 0.4) 0%,
            rgba(14, 24, 39, 0.5) 40%,
            rgba(14, 24, 39, 0) 100%
          )`,
        }}
      />

      <div className="relative rail-tight text-center w-full">
        {/* Eyebrow */}
        <ScrollReveal delay={0}>
          <div className="mb-6 text-center">
            <span
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-mono)',
                color: '#9DB6CC',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
              }}
            >
              the front door
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={100}>
          <h2
            className="mx-auto mb-6 max-w-[22ch] text-center leading-tight"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
              fontWeight: 800,
              color: '#f5f1e8',
              lineHeight: 1.15,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Where evidence becomes wonder.
          </h2>
        </ScrollReveal>

        {/* Subhead */}
        <ScrollReveal delay={100}>
          <div className="prose-rail">
            <p
              className="mb-12 mx-auto text-center leading-relaxed"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                color: '#E8EDF5',
                lineHeight: 1.7,
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              }}
            >
              Tidepool is the dark-water introduction to the garden — substances bloom as bioluminescent organisms above a brass schema substrate. Best for partners and seed investors who want the story before the schema.
            </p>
          </div>
        </ScrollReveal>

        {/* CTA pill */}
        <ScrollReveal delay={150}>
          <Link
            href="/welcome"
            className="cta-pill cta-pill-lg cta-pill-primary inline-flex items-center justify-center"
            style={{
              background: '#2eA4A3',
              color: 'white',
              gap: '0.5rem',
            }}
          >
            Enter Tidepool →
          </Link>
        </ScrollReveal>

        {/* Audience emblems */}
        <ScrollReveal delay={200}>
          <div className="mt-16 flex items-center justify-center gap-12">
            {[
              { label: 'Consumer', icon: '○' },
              { label: 'Clinician', icon: '◇' },
              { label: 'Counsel', icon: '◈' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center gap-2"
                style={{
                  opacity: 0.8,
                }}
              >
                <span
                  style={{
                    fontSize: '2.2rem',
                    color: 'white',
                  }}
                  aria-hidden
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#C8D4E2',
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
