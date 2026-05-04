'use client';

/**
 * Case detail page — Sky Valley PCB case.
 * Demonstrates modern product design with proper typography, spacing, and hierarchy.
 *
 * Design principles applied:
 * - Uses .rail-default for proper centering and padding (no text pushing to viewport edge)
 * - Generous internal padding on all cards (p-8, p-10)
 * - Italic Cormorant Garamond for all headings and case titles
 * - Space Mono UPPERCASE for eyebrows, metadata, specialty labels
 * - Inter body text with 1.6–1.7 line-height for comfortable readability
 * - Clear color hierarchy: ink (primary), ink-soft (secondary), ink-mute (metadata)
 * - Asymmetric card layouts with left-border accents for hierarchy
 */

import Link from 'next/link';

export default function SkyValleyCasePage() {
  const caseData = {
    id: 'case-sv-001',
    caption: 'Sky Valley PCB Case',
    jurisdiction: 'WA',
    filed_year: 2020,
    description: 'Multi-party litigation involving polychlorinated biphenyls (PCBs) contamination in groundwater and bioaccumulation claims across occupational and environmental exposure pathways.',
    experts: [
      {
        full_name: 'James G. Dahlgren, M.D.',
        affiliation: 'James Dahlgren Medical · Independent Toxicology Consultant',
        specialty: 'Occupational and Environmental Toxicology · PCB & Dioxin Exposure Assessment',
        bio: 'Board-certified internist and toxicologist with decades of expert-witness experience in chemical-exposure litigation, including PCBs, dioxin, and asbestos. Lead expert for the Sky Valley plaintiffs on toxicological mechanism and bioaccumulation in occupational and residential exposure pathways.',
      },
    ],
    substances: ['PCBs', 'Dioxin'],
  };

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <div className="rail-default py-20">
        {/* Header Section */}
        <section className="mb-24 border-b border-[var(--paper-line)] pb-16">
          {/* Eyebrow */}
          <div
            className="mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
            }}
          >
            Legal Case · {caseData.jurisdiction} · {caseData.filed_year}
          </div>

          {/* Title */}
          <h1
            className="mb-8 max-w-3xl"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            {caseData.caption}
          </h1>

          {/* Description */}
          <p
            className="max-w-2xl"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
            }}
          >
            {caseData.description}
          </p>
        </section>

        {/* Substances Section */}
        <section className="mb-24">
          <h2
            className="mb-10"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            Substances at Issue
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {caseData.substances.map((substance) => (
              <Link
                key={substance}
                href={`/compound/${substance.toLowerCase()}`}
                className="tile group transition-all hover:border-[var(--teal)] hover:shadow-sm"
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontStyle: 'normal',
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--ink)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {substance}
                </h3>
                <p
                  className="cta-pill cta-pill-secondary"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    color: 'var(--ink-soft)',
                    lineHeight: 1.6,
                    display: 'inline-block',
                  }}
                >
                  View substance data →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Expert Witnesses Section */}
        <section className="mb-24">
          <h2
            className="mb-10"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: '1.5rem',
              fontWeight: 800,
              color: 'var(--ink)',
              lineHeight: 1.2,
            }}
          >
            Expert Witnesses
          </h2>

          <div className="space-y-6">
            {caseData.experts.map((expert, idx) => {
              const isDahlgren = expert.full_name.includes('Dahlgren');
              return (
                <div
                  key={idx}
                  className="tile transition-all"
                  style={{
                    background: isDahlgren ? 'rgba(232, 55, 89, 0.04)' : 'var(--paper)',
                    borderLeftWidth: isDahlgren ? '4px' : '1px',
                    borderLeftColor: isDahlgren ? 'var(--crimson)' : 'var(--paper-line)',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'normal',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {expert.full_name}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--ink-mute)',
                      letterSpacing: '0.08em',
                      marginBottom: '0.6rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {expert.specialty}
                  </p>
                  {expert.affiliation && (
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontStyle: 'italic',
                        fontSize: '0.95rem',
                        color: 'var(--ink-soft)',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {expert.affiliation}
                    </p>
                  )}
                  <p
                    className="body-readable"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--ink-soft)',
                      lineHeight: 1.7,
                    }}
                  >
                    {expert.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section
          className="rounded-lg border border-[var(--paper-line)] p-10"
          style={{ background: 'var(--paper-warm)' }}
        >
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              fontWeight: 400,
              color: 'var(--ink)',
            }}
          >
            Build an Exhibit Packet
          </h2>
          <p
            className="mb-8 max-w-xl"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
            }}
          >
            Use the Counsel flow to assemble a case-specific exhibit packet with all relevant evidence, expert credentials, regulatory positions, and timeline documentation.
          </p>
          <Link
            href="/flow/counsel?case=sky-valley"
            className="cta-pill cta-pill-lg cta-pill-primary inline-block"
          >
            Open Counsel Flow →
          </Link>
        </section>
      </div>
    </main>
  );
}
