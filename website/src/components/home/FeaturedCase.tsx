'use client';

/**
 * FeaturedCase — Sky Valley PCB case as the homepage's cinematic feature.
 * One-message-per-screen (90vh min-height), dramatic visual.
 * Two-column desktop layout: left side narrative (ScrollReveal-from-left),
 * right side decorative dossier mockup (ScrollReveal-from-right).
 */
import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

export default function FeaturedCase() {
  return (
    <section className="relative min-h-[90vh] flex items-center" style={{
      background: `linear-gradient(135deg, var(--paper) 0%, var(--paper-warm) 100%)`,
    }}>
      {/* Copper stripe accent at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, transparent, var(--copper-orn), transparent)`,
        }}
      />

      <div className="rail-default w-full">
        {/* Eyebrow */}
        <ScrollReveal delay={0}>
          <div className="mb-8">
            <span
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--copper-orn-deep)',
                fontSize: '0.7rem',
                letterSpacing: '0.22em',
                fontWeight: 600,
              }}
            >
              featured case · washington state · 2016
            </span>
          </div>
        </ScrollReveal>

        {/* Two-column grid */}
        <div className="grid gap-12 md:gap-16 md:grid-cols-2 md:items-start">
          {/* Left: Text content */}
          <ScrollReveal delay={100} direction="left">
            <div>
              {/* Headline */}
              <h2
                className="mb-6 max-w-[22ch] leading-tight text-[var(--ink)]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                }}
              >
                Erickson v. Monsanto.
              </h2>

              {/* Metadata */}
              <p
                className="mb-8 leading-relaxed text-[var(--ink-soft)]"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                5 parties · 3 documents · 5 timeline events · dr. dahlgren as lead expert
              </p>

              {/* Body */}
              <div className="prose-rail mb-10 body-readable">
                <p
                  className="leading-relaxed text-[var(--ink-soft)]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    fontWeight: 400,
                  }}
                >
                  This is what the Counsel lane looks like end-to-end. Frame the theory of harm. Assemble the source matrix. Argue Daubert with both supporting and contradicting evidence. Build the expert witness pack. File a 3–5 page exhibit packet.
                </p>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <Link
                  href="/flow/counsel?case=sky-valley"
                  className="cta-pill cta-pill-lg cta-pill-primary inline-flex items-center gap-2"
                  style={{
                    background: 'var(--tox-deep)',
                    color: 'white',
                  }}
                  title="Open in Counsel lane"
                >
                  Open in Counsel lane <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/case/sky-valley"
                  className="cta-pill cta-pill-secondary inline-flex items-center gap-2"
                  style={{
                    color: 'var(--tox-deep)',
                  }}
                  title="Read the case page"
                >
                  Read the case page <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right: Dossier mockup */}
          <ScrollReveal delay={200} direction="right">
            <div className="flex items-center justify-center">
              <DossierMockup />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/**
 * DossierMockup — engineering bracket frame with exhibit packet structure.
 */
function DossierMockup() {
  return (
    <div
      className="relative w-full max-w-sm tile tile-inner"
      style={{
        background: 'var(--paper-warm)',
        border: `1px dashed var(--copper-orn)`,
      }}
    >
      {/* Top-left bracket */}
      <div
        className="absolute left-2 top-2 h-6 w-6"
        style={{
          border: `2px solid var(--copper-orn)`,
          borderRight: 'none',
          borderBottom: 'none',
        }}
      />
      {/* Top-right bracket */}
      <div
        className="absolute right-2 top-2 h-6 w-6"
        style={{
          border: `2px solid var(--copper-orn)`,
          borderLeft: 'none',
          borderBottom: 'none',
        }}
      />
      {/* Bottom-left bracket */}
      <div
        className="absolute bottom-2 left-2 h-6 w-6"
        style={{
          border: `2px solid var(--copper-orn)`,
          borderRight: 'none',
          borderTop: 'none',
        }}
      />
      {/* Bottom-right bracket */}
      <div
        className="absolute bottom-2 right-2 h-6 w-6"
        style={{
          border: `2px solid var(--copper-orn)`,
          borderLeft: 'none',
          borderTop: 'none',
        }}
      />

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="mb-8 border-b pb-4" style={{ borderColor: 'var(--paper-line)' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn)',
              display: 'block',
            }}
          >
            Exhibit Packet — Draft
          </span>
        </div>

        {/* Rows */}
        <div className="space-y-7 mb-10">
          {[
            { num: 'I', label: 'Theory of harm narrative' },
            { num: 'II', label: 'Substance dossiers (PCBs, Dioxin)' },
            { num: 'III', label: 'Daubert table — supporting × contradicting' },
            { num: 'IV', label: 'Expert witness pack — Dahlgren' },
            { num: 'V', label: 'Case timeline' },
          ].map((item) => (
            <div key={item.num} className="flex gap-4">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--copper-orn)',
                  minWidth: '2rem',
                }}
              >
                {item.num}.
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  color: 'var(--ink)',
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="border-t pt-4"
          style={{ borderColor: 'var(--paper-line)' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--ink-mute)',
              letterSpacing: '0.08em',
            }}
          >
            5 / 5 sections · pending counsel review
          </span>
        </div>
      </div>

      {/* Dimension line decoration (top-left to bottom-right) */}
      <svg
        className="pointer-events-none absolute inset-0"
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <line
          x1="20"
          y1="30"
          x2="20"
          y2="50%"
          stroke="var(--copper-orn)"
          strokeWidth="1"
          strokeDasharray="3,3"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
