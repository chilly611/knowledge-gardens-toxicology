'use client';

/**
 * /compound — Index page listing all substances with preview.
 * UPDATED 2026-05-01: Added "Open Stratigraph →" CTA to each card.
 * Hero section with eyebrow, italic Cormorant headline, and InterBody description.
 * Four substance cards with "Open Stratigraph →" working CTA at bottom.
 */

import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';
import StageIcon from '@/components/grammar/StageIcon';

const COMPOUNDS = [
  {
    name: 'Glyphosate',
    slug: 'glyphosate',
    cas: '1071-83-6',
    icon: 'identify' as const,
    eyebrow: 'herbicide · most studied',
    body: 'Broad-spectrum systemic herbicide. Used in agriculture, landscaping, and home gardening. Central to contested claims on NHL and mechanisms.',
    hazardChips: ['🥣 Found in oats', '💧 Detected in tap water', '👶 Trace in most people'],
  },
  {
    name: 'Microplastics',
    slug: 'microplastics',
    cas: 'particle mixture',
    icon: 'assess' as const,
    eyebrow: 'particulate · ubiquitous',
    body: 'Plastic fragments <5mm. Found in seafood, drinking water, air. Emerging concern for bioaccumulation and cardiovascular endpoints.',
    hazardChips: ['🦪 In seafood', '🌊 In drinking water', '💨 Airborne particles'],
  },
  {
    name: 'PCBs',
    slug: 'pcbs',
    cas: '1336-36-3',
    icon: 'plan' as const,
    eyebrow: 'persistent organic · legacy',
    body: 'Polychlorinated biphenyls. Banned in most countries but persist in sediment, wildlife, and human tissue. Central to Sky Valley case.',
    hazardChips: ['🪨 Sediment bound', '🐟 Bioaccumulative', '🔬 Ubiquitous legacy'],
  },
  {
    name: 'PET',
    slug: 'pet',
    cas: '25038-59-9',
    icon: 'act' as const,
    eyebrow: 'polymer · food contact',
    body: 'Polyethylene terephthalate. Common in beverage bottles and food packaging. Provisional evidence on thermal leaching.',
    hazardChips: ['🍼 In PET bottles', '☕ Thermal leaching', '🔬 Emerging concern'],
  },
];

export default function CompoundIndexPage() {
  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative py-24 sm:py-32" style={{ minHeight: '65vh' }}>
        <div className="rail-default">
          <ScrollReveal>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
              }}
            >
              browse the compounds
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h1
              className="mx-auto mt-5 max-w-[20ch]"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                lineHeight: 1.05,
                color: 'var(--ink)',
              }}
            >
              Four substances. Ten claims. Twenty-six sources.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="prose-rail mt-8 max-w-2xl">
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: 'var(--ink-soft)',
                }}
              >
                Each one drilled into Hazard / Profile / Response / Citations. Three sources behind every claim. This is the Stratigraph surface — the core-sample experience where evidence is layered, color-coded, and depth-marked like geological strata.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={450}>
            <div className="mt-12 flex justify-center">
              <StageIcon id="identify" size={140} />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================
          SUBSTANCE GRID
          ================================================================ */}
      <section className="bg-[var(--paper-warm)] py-24">
        <div className="rail-default">
          <div className="tile-grid-3">
            {COMPOUNDS.map((c, idx) => (
              <ScrollReveal key={c.slug} delay={100 + idx * 100}>
                <div className="group tile flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-lg h-full">
                  {/* Eyebrow + Icon */}
                  <div className="mb-6 flex items-start justify-between">
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--ink-mute)',
                      }}
                    >
                      {c.eyebrow}
                    </div>
                    <div className="ml-4">
                      <StageIcon id={c.icon} size={48} color="var(--ink-soft)" />
                    </div>
                  </div>

                  {/* Accent bar animation */}
                  <div
                    className="mb-6 h-0.5 w-8 transition-all duration-300 group-hover:w-16"
                    style={{ background: 'var(--copper-orn-deep)' }}
                  />

                  {/* Name + CAS */}
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                      fontWeight: 500,
                      color: 'var(--ink)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {c.name}
                  </h2>

                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--ink-mute)',
                      marginBottom: '1.25rem',
                    }}
                  >
                    CAS {c.cas}
                  </div>

                  {/* Body description */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: 'var(--ink-soft)',
                      marginBottom: '1.5rem',
                      flex: 1,
                    }}
                  >
                    {c.body}
                  </p>

                  {/* Hazard chips */}
                  <div className="mb-8 flex flex-wrap gap-3">
                    {c.hazardChips.map((chip, cidx) => (
                      <span
                        key={cidx}
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.8rem',
                          background: 'var(--paper-line)',
                          color: 'var(--ink-soft)',
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  {/* Open Stratigraph CTA — Working solid pill */}
                  <Link
                    href={`/compound/${c.slug}`}
                    className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md mt-6"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      backgroundColor: 'var(--tox-deep)',
                      color: 'var(--paper)',
                      textDecoration: 'none',
                    }}
                  >
                    Open Stratigraph
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FOOTER CTA
          ================================================================ */}
      <section className="bg-[var(--paper)] py-16 text-center">
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--teal-deep)',
            textDecoration: 'underline',
            transition: 'color 200ms',
          }}
          className="hover:text-[var(--teal)]"
        >
          ← Return to Loom
        </Link>
      </section>
    </main>
  );
}
