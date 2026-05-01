'use client';

/**
 * Dose Calculator — Placeholder mockup (2026-05-01)
 * 
 * Polished placeholder showing a calculator form and sample dose output chart.
 * Shows "preview only" treatment while looking production-ready.
 */

import Link from 'next/link';

export default function DoseCalculatorPage() {
  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* HERO SECTION */}
      <section className="rail-default w-full pt-16 sm:pt-20 pb-12">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--copper-orn-deep)',
            marginBottom: '1.5rem',
          }}
        >
          STAGE 02 · ASSESS · COMING SOON
        </div>

        <h1
          className="max-w-[24ch] leading-tight mb-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
            lineHeight: 1.05,
            color: 'var(--ink)',
          }}
        >
          Dose Calculator.
        </h1>

        <p
          className="max-w-2xl"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            lineHeight: 1.55,
            color: 'var(--ink-soft)',
          }}
        >
          Convert exposure into dose. Compare to LD50, NOAEL, regulatory limits.
        </p>
      </section>

      {/* MOCKUP FORM SECTION */}
      <section className="rail-default w-full py-12">
        <div
          className="rounded-2xl border p-10 md:p-12 mb-12"
          style={{
            borderColor: 'var(--paper-line)',
            backgroundColor: 'var(--paper-warm)',
            borderStyle: 'dashed',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--ink-mute)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
            }}
          >
            preview only · coming soon
          </div>

          <h2
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '1.3rem',
              color: 'var(--ink)',
            }}
          >
            Calculate Dose
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Mass Exposed (mg)
              </label>
              <input
                type="number"
                disabled
                placeholder="100"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                  borderRadius: '0.5rem',
                  borderColor: 'var(--paper-line)',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Body Weight (kg)
              </label>
              <input
                type="number"
                disabled
                placeholder="70"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                  borderRadius: '0.5rem',
                  borderColor: 'var(--paper-line)',
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Route
              </label>
              <select
                disabled
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                  borderRadius: '0.5rem',
                  borderColor: 'var(--paper-line)',
                }}
              >
                <option>Oral</option>
                <option>Inhalation</option>
                <option>Dermal</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--ink)',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Concentration (ppm or mg/m³)
              </label>
              <input
                type="number"
                disabled
                placeholder="2.5"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                  borderRadius: '0.5rem',
                  borderColor: 'var(--paper-line)',
                }}
              />
            </div>
          </div>
        </div>

        {/* SAMPLE OUTPUT */}
        <div className="rounded-2xl border p-10 md:p-12 mb-12" style={{ borderColor: 'var(--paper-line)' }}>
          <h3
            className="mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '1.2rem',
              color: 'var(--ink)',
            }}
          >
            Calculated Dose: 1.43 mg/kg/day
          </h3>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b" style={{ borderColor: 'var(--paper-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>vs LD50 (rat, oral)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>
                5,600 mg/kg (0.03% of lethal dose)
              </span>
            </div>
            <div className="flex justify-between items-center py-4 border-b" style={{ borderColor: 'var(--paper-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>vs NOAEL (chronic, rat)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--peach)' }}>
                175 mg/kg/day (0.8% of no-observed-adverse-effect level)
              </span>
            </div>
            <div className="flex justify-between items-center py-4" style={{ borderColor: 'var(--paper-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>vs OSHA PEL (occupational)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                Not regulated as occupational pesticide
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT THIS WILL BECOME */}
      <section className="rail-default w-full py-12">
        <h2
          className="mb-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '1.2rem',
            color: 'var(--ink)',
          }}
        >
          What this will become
        </h2>

        <ul className="space-y-4 max-w-2xl">
          {[
            'A toxicokinetic calculator that converts exposure (mass, concentration, route) into systemic dose accounting for absorption factors, metabolism, and clearance rate.',
            'A side-by-side comparison widget showing your calculated dose against the LD50, NOAEL, LOAEL, and regulatory thresholds from the TKG knowledge graph.',
            'A visual risk dial or heat map that color-codes your result against acute vs. chronic endpoints, showing margin of safety and regulatory alignment.',
          ].map((bullet, idx) => (
            <li
              key={idx}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--ink-soft)',
                marginLeft: '2rem',
              }}
            >
              <span style={{ marginLeft: '-1.5rem', display: 'inline-block' }}>•</span> {bullet}
            </li>
          ))}
        </ul>
      </section>

      {/* FOOTER */}
      <section className="rail-default w-full py-12 border-t" style={{ borderColor: 'var(--paper-line)' }}>
        <Link
          href="/workflow/identify/compound-lookup"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--teal-deep)',
            textDecoration: 'underline',
          }}
          className="hover:text-[var(--teal)]"
        >
          ← Return to Compound Lookup
        </Link>
      </section>
    </main>
  );
}
