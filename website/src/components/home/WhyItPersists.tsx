'use client';

/**
 * WhyItPersists — homepage section explaining why a *structured* knowledge
 * garden is the substrate that survives Daubert, the bedside, and the
 * kitchen table.
 *
 * Place between <TrustStrip /> and <FeaturedCase /> in app/page.tsx.
 *
 * Aesthetic: parchment background. Bold Inter headlines, italic Cormorant
 * for elegant callouts, Space Mono eyebrows. Crimson + copper accents.
 * Designed for a scientific reader (toxicologist) — restrained, citable,
 * legible. No flashy motion.
 */

import ScrollReveal from '@/components/home/ScrollReveal';

export default function WhyItPersists() {
  return (
    <section
      data-surface="tkg"
      className="relative py-28"
      style={{ background: 'var(--paper)' }}
    >
      <div className="rail-default">
        {/* INTRO */}
        <ScrollReveal>
          <div className="mb-20 max-w-3xl">
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
              Why this persists · Ground truth as infrastructure
            </div>

            <h2
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
              }}
            >
              What survives{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--teal-deep)',
                }}
              >
                when the model forgets.
              </span>
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              Every claim in this garden traces to a primary source, preserves a
              verbatim quote, and carries its own peer-review tier. That isn&rsquo;t
              a feature &mdash; it is the only structure that holds up under Daubert,
              at the bedside, and across a kitchen table at midnight.
            </p>
          </div>
        </ScrollReveal>

        {/* THREE LANES */}
        <ScrollReveal>
          <div className="mb-24 grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* PATIENT */}
            <article
              className="tile"
              style={{
                background: 'var(--paper)',
                borderTopWidth: '3px',
                borderTopColor: 'var(--teal)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: '1rem',
                }}
              >
                At the kitchen table · Patients & consumers
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                A plain answer with the source one click away.
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                  color: 'var(--ink-soft)',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                }}
              >
                You don&rsquo;t need to read the toxicology paper. You need to know
                whether the answer you were given came from one. Search a
                chemical name on a label. Get a one-page answer. See where it
                came from.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: 'var(--teal-deep)',
                  lineHeight: 1.5,
                }}
              >
                &ldquo;Is this in my house?&rdquo; answered with a citation, not a vibe.
              </p>
            </article>

            {/* CLINICIAN */}
            <article
              className="tile"
              style={{
                background: 'var(--paper-warm)',
                borderTopWidth: '3px',
                borderTopColor: 'var(--peach)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: '1rem',
                }}
              >
                At the bedside · Clinicians & researchers
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                Patterns across substances, not one substance at a time.
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                  color: 'var(--ink-soft)',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                }}
              >
                There are roughly 150 board-certified medical toxicologists in
                the United States. This is the structure that lets the next
                1,500 see what they see &mdash; congener-specific effects, biomarker
                ranges, ATSDR-tier evidence &mdash; without re-reading the field every
                Tuesday morning.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: 'var(--teal-deep)',
                  lineHeight: 1.5,
                }}
              >
                Mechanism, dose, biomarker, peer-review tier &mdash; visible together.
              </p>
            </article>

            {/* COUNSEL */}
            <article
              className="tile"
              style={{
                background: 'var(--paper)',
                borderTopWidth: '3px',
                borderTopColor: 'var(--crimson)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: '1rem',
                }}
              >
                Before the court · Counsel & expert witnesses
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: 'var(--ink)',
                  lineHeight: 1.25,
                  marginBottom: '1rem',
                }}
              >
                Daubert-ready claims, traceable to the page.
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.98rem',
                  color: 'var(--ink-soft)',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                }}
              >
                Generative AI hallucinates a study and your case is thrown out.
                The garden cites the study, preserves the verbatim quote, and
                surfaces the contradicting source before opposing counsel does.
                The graph survives cross-examination because the graph is the
                methodology.
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                  color: 'var(--teal-deep)',
                  lineHeight: 1.5,
                }}
              >
                Cited claims hold. Hallucinated ones don&rsquo;t.
              </p>
            </article>
          </div>
        </ScrollReveal>

        {/* THREE THINGS THAT COMPOUND */}
        <ScrollReveal>
          <div
            className="mb-24 rounded-lg border p-10 lg:p-14"
            style={{
              borderColor: 'var(--paper-line)',
              background: 'var(--paper-deep, var(--paper))',
            }}
          >
            <div
              className="mb-10"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
              }}
            >
              Three things that compound · The moat
            </div>

            <h3
              className="mb-12 max-w-2xl"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.3,
              }}
            >
              A chatbot starts over every conversation. The garden{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  color: 'var(--teal-deep)',
                }}
              >
                remembers, versions, and links.
              </span>
            </h3>

            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {[
                {
                  num: '01',
                  title: 'Citation chains',
                  body:
                    'Every claim to primary source, to verbatim quote, to DOI or registry ID. Auditable. Traceable. Never paraphrased away.',
                },
                {
                  num: '02',
                  title: 'Versioning',
                  body:
                    'Claims evolve as evidence evolves. Older versions are preserved. The graph remembers what the science used to say and when it changed.',
                },
                {
                  num: '03',
                  title: 'Cross-garden links',
                  body:
                    'PCBs in toxicology, contract templates in Builders, biomarker panels in Health. Structured knowledge connects across domains where chatbots see only documents.',
                },
              ].map((item) => (
                <div key={item.num}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.18em',
                      color: 'var(--copper-orn-deep)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.num}
                  </div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: 'var(--ink-soft)',
                      lineHeight: 1.7,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* RSI FLYWHEEL */}
        <ScrollReveal>
          <div className="mb-24 max-w-4xl">
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
              Five loops · One shape · Recursive self-improvement
            </div>

            <h3
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.25,
                maxWidth: '32ch',
              }}
            >
              Each query refines the graph. Each refinement makes the next query
              smarter.
            </h3>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-6">
              {[
                'Grounding',
                'Synthesis',
                'Specialist',
                'Marketplace',
                'Lifecycle',
              ].map((loop, i, arr) => (
                <span key={loop} className="flex items-center gap-3">
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'italic',
                      fontSize: '1.05rem',
                      color: 'var(--ink)',
                    }}
                  >
                    {loop}
                  </span>
                  {i < arr.length - 1 && (
                    <span
                      aria-hidden
                      style={{
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--copper-orn-deep)',
                        fontSize: '0.85rem',
                      }}
                    >
                      ·
                    </span>
                  )}
                </span>
              ))}
            </div>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.98rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.75,
                maxWidth: '60ch',
              }}
            >
              Lawyers asking different questions than clinicians asking
              different questions than patients &mdash; every interaction labels new
              edges in the graph. Five loops compound across one substrate. The
              twentieth question is answered better than the first because the
              graph kept the first nineteen.
            </p>
          </div>
        </ScrollReveal>

        {/* CLOSING BLOCKQUOTE */}
        <ScrollReveal>
          <figure
            className="mx-auto mt-8 max-w-3xl border-l-4 pl-8"
            style={{ borderColor: 'var(--crimson)' }}
          >
            <blockquote
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.3rem, 2.4vw, 1.85rem)',
                color: 'var(--ink)',
                lineHeight: 1.45,
                marginBottom: '1.25rem',
              }}
            >
              Ground truth AI agents can survive on, and clinicians, counsel,
              and citizens can stand on.
            </blockquote>
            <figcaption
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--ink-mute)',
              }}
            >
              The Toxicology Knowledge Garden · Built around the work of James
              G. Dahlgren, M.D.
            </figcaption>
          </figure>
        </ScrollReveal>
      </div>
    </section>
  );
}
