'use client';

/**
 * /case — Index page listing all cases.
 * Currently one case: Sky Valley PCB Case.
 */

import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';

export default function CaseIndexPage() {
  const cases = [
    {
      caption: 'Erickson v. Monsanto',
      shortName: 'sky-valley',
      jurisdiction: 'Washington State',
      year: 2016,
      eyebrow: '1 active case · WA · 2016',
      body: 'Sky Valley PCB Case. Five parties, three documents, five timeline events. Dr. Dahlgren as lead expert. Walk it from theory of harm to Daubert-grade exhibit packet.',
      parties: 5,
      documents: 3,
      events: 5,
    },
  ];

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* Hero Section */}
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
              active cases · evidence-backed litigation
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h1
              className="mx-auto mt-5 max-w-[20ch]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2.4rem, 6vw, 5rem)',
                fontWeight: 500,
                lineHeight: 1.05,
                color: 'var(--ink)',
              }}
            >
              Legal cases
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
                From theory of harm to expert witness pack. Full dossier with party graph, document register, and timeline.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={450}>
            <div className="mt-10 flex justify-center">
              <video
                poster="/icons/stage-resolve.png"
                autoPlay
                muted
                loop
                playsInline
                width={120}
                height={120}
                style={{ display: 'inline-block' }}
              >
                <source src="/icons/stage-resolve.mp4" type="video/mp4" />
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Cases Grid */}
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
              open in the garden
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 500,
                color: 'var(--ink)',
                marginBottom: '2rem',
                maxWidth: '24ch',
              }}
            >
              Cases backed by evidence.
            </h2>
          </ScrollReveal>

          <div className="grid gap-6">
            {cases.map((c, idx) => (
              <ScrollReveal key={c.shortName} delay={100 + idx * 100}>
                <Link
                  href={`/case/${c.shortName}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--paper-line)] bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: 'rgba(255, 255, 255, 0.4)' }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-mute)',
                      marginBottom: '1rem',
                    }}
                  >
                    {c.eyebrow}
                  </div>

                  <div
                    className="mb-4 h-0.5 w-8 transition-all duration-200 group-hover:w-12"
                    style={{ background: 'var(--copper-orn-deep)' }}
                  />

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.8rem',
                      fontWeight: 500,
                      color: 'var(--ink)',
                      marginBottom: '1rem',
                    }}
                  >
                    {c.caption}
                  </h3>

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

                  <div
                    className="flex gap-6 mb-4"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--ink-mute)',
                    }}
                  >
                    <div>{c.parties} parties</div>
                    <div>{c.documents} documents</div>
                    <div>{c.events} timeline events</div>
                  </div>

                  <div
                    className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--copper-orn-deep)',
                    }}
                  >
                    Open the case
                    <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
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
