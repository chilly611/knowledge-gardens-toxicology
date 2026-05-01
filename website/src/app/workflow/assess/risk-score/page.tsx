'use client';

/**
 * Risk Score — Placeholder mockup (2026-05-01)
 * 
 * Polished placeholder showing a radial risk dial with multiple axes.
 */

import Link from 'next/link';

export default function RiskScorePage() {
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
          Score the Risk.
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
          One number, three sources behind every dial.
        </p>
      </section>

      {/* MOCKUP RISK DIAL */}
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
              marginBottom: '2rem',
            }}
          >
            preview only · coming soon
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              position: 'relative',
            }}
          >
            <svg
              width="280"
              height="280"
              viewBox="0 0 280 280"
              style={{ maxWidth: '100%' }}
            >
              {/* Background circles */}
              <circle cx="140" cy="140" r="130" fill="none" stroke="var(--paper-line)" strokeWidth="1" opacity="0.3" />
              <circle cx="140" cy="140" r="100" fill="none" stroke="var(--paper-line)" strokeWidth="1" opacity="0.3" />
              <circle cx="140" cy="140" r="70" fill="none" stroke="var(--paper-line)" strokeWidth="1" opacity="0.3" />

              {/* Center circle */}
              <circle cx="140" cy="140" r="50" fill="var(--peach)" opacity="0.2" />
              <circle cx="140" cy="140" r="50" fill="none" stroke="var(--peach)" strokeWidth="2" />

              {/* Axes (dials) */}
              {/* Acute Toxicity — top */}
              <line x1="140" y1="10" x2="140" y2="60" stroke="var(--crimson)" strokeWidth="3" />
              <text x="140" y="30" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--crimson)' }} fontWeight="600">
                ACUTE
              </text>

              {/* Chronic Toxicity — bottom */}
              <line x1="140" y1="220" x2="140" y2="270" stroke="var(--teal-deep)" strokeWidth="3" />
              <text x="140" y="255" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--teal-deep)' }} fontWeight="600">
                CHRONIC
              </text>

              {/* Ecological — left */}
              <line x1="10" y1="140" x2="60" y2="140" stroke="var(--copper-orn-deep)" strokeWidth="3" />
              <text x="35" y="160" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--copper-orn-deep)' }} fontWeight="600">
                ECO
              </text>

              {/* Regulatory — right */}
              <line x1="220" y1="140" x2="270" y2="140" stroke="var(--tox-deep)" strokeWidth="3" />
              <text x="245" y="160" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--tox-deep)' }} fontWeight="600">
                REG
              </text>

              {/* Center labels */}
              <text x="140" y="145" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fill: 'var(--ink)', fontWeight: 'bold' }}>
                3.2
              </text>
              <text x="140" y="160" textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fill: 'var(--ink-soft)' }}>
                / 10
              </text>
            </svg>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4 text-center">
            {[
              { label: 'Acute', value: '2.1', color: 'var(--crimson)' },
              { label: 'Chronic', value: '4.5', color: 'var(--teal-deep)' },
              { label: 'Ecological', value: '3.8', color: 'var(--copper-orn-deep)' },
              { label: 'Regulatory', value: '2.8', color: 'var(--tox-deep)' },
            ].map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'var(--ink-mute)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: item.color,
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* METHODOLOGY */}
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
          Scoring Methodology
        </h2>

        <div className="space-y-6 max-w-2xl">
          {[
            { title: 'Acute Toxicity', desc: 'Derived from LD50 data, hazard classifications, and IARC monographs. Score 1–10 reflects margin of safety vs. lethal dose.' },
            { title: 'Chronic Toxicity', desc: 'Derived from NOAEL/LOAEL values, long-term studies, and cumulative burden evidence. Score reflects concern over years of exposure.' },
            { title: 'Ecological Risk', desc: 'Derived from bioaccumulation factor, persistence, aquatic toxicity, and environmental detection data. Score reflects ecosystem hazard.' },
            { title: 'Regulatory Alignment', desc: 'Derived from EPA/EFSA/IARC classifications, occupational exposure limits, and global bans/restrictions. Score reflects consensus across agencies.' },
          ].map((item, idx) => (
            <div key={idx}>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--ink)',
                  marginBottom: '0.5rem',
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-soft)',
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
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
            "An interactive radial risk dial with four axes (acute, chronic, ecological, regulatory) that visualizes your compound's hazard profile at a glance.",
            "A detailed report card for each axis, showing the three sources behind each score and the confidence level (certified, provisional, or contested).",
            "A risk trend feature tracking how a substance's score evolves as new evidence enters the TKG knowledge graph over time.",
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
