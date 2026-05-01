'use client';

/**
 * /flow — Index page introducing the three audience flows.
 */

import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';

const FLOWS = [
  {
    audience: 'consumer',
    question: "What's in my world?",
    accent: '#2ea4a3',
    accentDeep: '#1f7e7d',
    emoji: '○',
    href: '/flow/consumer',
  },
  {
    audience: 'clinician',
    question: 'Workup a panel.',
    accent: '#553278',
    accentDeep: '#3d2456',
    emoji: '◇',
    href: '/flow/clinician',
  },
  {
    audience: 'counsel',
    question: 'Prep a case.',
    accent: '#e83759',
    accentDeep: '#b8243f',
    emoji: '◈',
    href: '/flow/counsel',
  },
];

export default function FlowIndexPage() {
  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* Hero */}
      <section className="relative py-24 sm:py-32" style={{ minHeight: '70vh' }}>
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
              guided journeys · 5-stage workflows
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h1
              className="mx-auto mt-5 max-w-[20ch]"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                color: 'var(--ink)',
              }}
            >
              Guided journeys
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="prose-rail mt-6">
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-soft)',
                }}
              >
                Pick the lane that matches what you're trying to do. Each one ends in a deliverable.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={450}>
            <div className="mt-10 flex justify-center">
              <video
                poster="/icons/stage-identify.png"
                autoPlay
                muted
                loop
                playsInline
                width={120}
                height={120}
                style={{ display: 'inline-block' }}
              >
                <source src="/icons/stage-identify.mp4" type="video/mp4" />
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Flows Grid */}
      <section className="bg-[var(--paper-warm)] py-20">
        <div className="rail-default">
          <ScrollReveal>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
                marginBottom: '1rem',
              }}
            >
              choose your lane
            </div>
          </ScrollReveal>

          <div className="tile-grid-3">
            {FLOWS.map((flow, idx) => (
              <ScrollReveal key={flow.audience} delay={100 + idx * 100}>
                <Link
                  href={flow.href}
                  className="group tile relative transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    borderColor: 'var(--paper-line)',
                  }}
                >
                  <div
                    className="absolute left-0 right-0 top-0 h-0.5"
                    style={{ background: flow.accent }}
                  />

                  <div className="mb-6 flex items-center justify-between">
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: flow.accent,
                        padding: '0.25rem 0.75rem',
                        background: `${flow.accent}22`,
                        borderRadius: '0.5rem',
                      }}
                    >
                      for {flow.audience}
                    </div>
                    <div style={{ fontSize: '1.4rem', color: flow.accent }}>{flow.emoji}</div>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'normal',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      marginBottom: '1rem',
                    }}
                  >
                    {flow.question}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'var(--ink-soft)',
                      marginBottom: '1.5rem',
                    }}
                  >
                    Step through five stages to build a personalized briefing. Choose your concerns,
                    collect evidence, and generate a print-ready deliverable.
                  </p>

                  <div
                    className="inline-flex items-center gap-2 font-medium"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: flow.accent,
                    }}
                  >
                    Start journey
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Back */}
      <section className="bg-[var(--paper)] py-16 text-center">
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--teal-deep)',
            textDecoration: 'underline',
          }}
        >
          ← Return to Loom
        </Link>
      </section>
    </main>
  );
}
