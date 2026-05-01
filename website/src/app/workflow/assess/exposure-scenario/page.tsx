'use client';

/**
 * Build Exposure Scenario — Placeholder mockup (2026-05-01)
 * 
 * This is a polished placeholder page that feels real but shows "preview only"
 * across mockup sections. Real implementation will follow in a later sprint.
 * 
 * Structure:
 * - Hero: title + subline + eyebrow
 * - Mockup form section (route, frequency, duration inputs)
 * - Sample output card showing what a generated scenario would look like
 * - "What this will become" section with 3 bullets
 * - Footer CTA to return to Compound Lookup
 */

import Link from 'next/link';

export default function ExposureScenarioPage() {
  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="rail-default w-full pt-16 sm:pt-20 pb-12">
        {/* Eyebrow */}
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

        {/* Title */}
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
          Build Exposure Scenario.
        </h1>

        {/* Subline */}
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
          Walk a substance through a real-world exposure: where, how much, how often.
        </p>
      </section>

      {/* ================================================================
          MOCKUP FORM SECTION
          ================================================================ */}
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
            className="mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--ink-mute)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
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
            Define the Exposure Scenario
          </h2>

          {/* Form Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Route of Exposure */}
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
                Route of Exposure
              </label>
              <select
                disabled
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  borderColor: 'var(--paper-line)',
                  borderRadius: '0.5rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                }}
              >
                <option>Inhalation</option>
                <option>Dermal</option>
                <option>Oral</option>
                <option>Mixed</option>
              </select>
            </div>

            {/* Frequency */}
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
                Frequency
              </label>
              <select
                disabled
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  borderColor: 'var(--paper-line)',
                  borderRadius: '0.5rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                }}
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Occasional</option>
              </select>
            </div>

            {/* Duration */}
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
                Duration (years)
              </label>
              <input
                type="number"
                disabled
                placeholder="5"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  padding: '0.75rem',
                  borderColor: 'var(--paper-line)',
                  borderRadius: '0.5rem',
                  width: '100%',
                  backgroundColor: 'var(--paper)',
                  color: 'var(--ink-soft)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Sample Output Card */}
        <div className="rounded-2xl border p-10 md:p-12 mb-12" style={{ borderColor: 'var(--paper-line)' }}>
          <div
            className="mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--ink-mute)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            sample output
          </div>

          <h3
            className="mb-6"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '1.2rem',
              color: 'var(--ink)',
            }}
          >
            Exposure Brief: Glyphosate via Dietary Route
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-start py-3 border-b" style={{ borderColor: 'var(--paper-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>Route</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>Oral / Dietary</span>
            </div>
            <div className="flex justify-between items-start py-3 border-b" style={{ borderColor: 'var(--paper-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>Frequency</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>Daily (breakfast cereal, oat products)</span>
            </div>
            <div className="flex justify-between items-start py-3 border-b" style={{ borderColor: 'var(--paper-line)' }}>
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>Duration</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>5 years (ongoing)</span>
            </div>
            <div className="flex justify-between items-start py-3">
              <span style={{ fontFamily: 'var(--font-body)', color: 'var(--ink)' }}>Risk Assessment</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-soft)' }}>Provisional concern (emerging)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          WHAT THIS WILL BECOME
          ================================================================ */}
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
            'A guided form that walks you through defining exposure: location (home, work, school), route (inhalation, dermal, oral), frequency (daily, weekly, occasional), and duration (weeks, months, years).',
            'An exposure calculation engine that converts your scenario into an estimated dose, accounting for body weight, ventilation, and concentration data from the TKG knowledge graph.',
            'A risk comparison output showing how your calculated dose stacks against LD50 values, NOAEL thresholds, and regulatory occupational exposure limits (OELs).',
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

      {/* ================================================================
          FOOTER CTA
          ================================================================ */}
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
