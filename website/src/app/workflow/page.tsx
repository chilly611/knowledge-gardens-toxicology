'use client';

/**
 * /workflow — Index page showing all 7 stages and their workflows.
 */

import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';

const STAGES_WITH_WORKFLOWS = [
  {
    id: 'identify',
    label: 'Identify',
    caption: 'What is this substance?',
    emoji: '◎',
    workflows: [
      { slug: 'compound-lookup', title: 'Compound lookup', status: 'live' },
      { slug: 'ghs-classifier', title: 'GHS classifier', status: 'soon' },
      { slug: 'label-decoder', title: 'Label decoder', status: 'soon' },
      { slug: 'sds-retrieval', title: 'SDS retrieval', status: 'soon' },
    ],
  },
  {
    id: 'assess',
    label: 'Assess',
    caption: 'How dangerous, in this scenario?',
    emoji: '◇',
    workflows: [
      { slug: 'exposure-scenario', title: 'Exposure scenario builder', status: 'soon' },
      { slug: 'dose-calculator', title: 'Dose calculator', status: 'soon' },
    ],
  },
  {
    id: 'plan',
    label: 'Plan',
    caption: 'What do we do about it?',
    emoji: '△',
    workflows: [
      { slug: 'mitigation-plan', title: 'Mitigation plan', status: 'soon' },
    ],
  },
  {
    id: 'act',
    label: 'Act',
    caption: 'Execute response or daily handling',
    emoji: '⌘',
    workflows: [
      { slug: 'incident-response', title: 'Incident response', status: 'soon' },
    ],
  },
  {
    id: 'adapt',
    label: 'Adapt',
    caption: 'Conditions changed',
    emoji: '↻',
    workflows: [
      { slug: 'reexposure', title: 'Re-exposure assessment', status: 'soon' },
    ],
  },
  {
    id: 'resolve',
    label: 'Resolve',
    caption: 'Wrap up the incident or program',
    emoji: '◉',
    workflows: [
      { slug: 'reporting-bundle', title: 'Reporting bundle', status: 'soon' },
    ],
  },
  {
    id: 'reflect',
    label: 'Reflect',
    caption: 'Learn from it',
    emoji: '☐',
    workflows: [
      { slug: 'retrospective', title: 'Retrospective', status: 'soon' },
    ],
  },
];

export default function WorkflowIndexPage() {
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
              seven stages · one shape
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
              The killer-app pattern
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
                Identify → Assess → Plan → Act → Adapt → Resolve → Reflect. Each stage has workflows. Each workflow ends in a deliverable.
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

      {/* Stages Grid */}
      <section className="bg-[var(--paper-warm)] py-20">
        <div className="rail-default">
          {STAGES_WITH_WORKFLOWS.map((stage, stageIdx) => (
            <ScrollReveal key={stage.id} delay={100 + stageIdx * 50}>
              <div className="mb-16">
                <div className="mb-6 flex items-center gap-4">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '2rem',
                      color: 'var(--copper-orn-deep)',
                    }}
                  >
                    {stage.emoji}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        fontSize: '1.6rem',
                        fontWeight: 500,
                        color: 'var(--ink)',
                      }}
                    >
                      {stage.label}
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9rem',
                        color: 'var(--ink-soft)',
                        marginTop: '0.25rem',
                      }}
                    >
                      {stage.caption}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {stage.workflows.map((wf) => (
                    <Link
                      key={wf.slug}
                      href={`/workflow/${stage.id}/${wf.slug}`}
                      className="group tile-inner relative bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
                      style={{ background: wf.status === 'live' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            color: 'var(--ink)',
                          }}
                        >
                          {wf.title}
                        </h3>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.65rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: wf.status === 'live' ? 'var(--teal-deep)' : 'var(--ink-mute)',
                            background: wf.status === 'live' ? 'var(--paper-warm)' : 'var(--paper-line)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                          }}
                        >
                          {wf.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
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
