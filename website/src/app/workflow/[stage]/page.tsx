'use client';

/**
 * /workflow/[stage] — Stage index page showing all workflows for a given stage.
 */

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';

const WORKFLOWS_BY_STAGE: Record<string, Array<{ slug: string; title: string; status: 'live' | 'soon' }>> = {
  identify: [
    { slug: 'compound-lookup', title: 'Compound lookup', status: 'live' },
    { slug: 'ghs-classifier', title: 'GHS classifier', status: 'soon' },
    { slug: 'label-decoder', title: 'Label decoder', status: 'soon' },
    { slug: 'sds-retrieval', title: 'SDS retrieval', status: 'soon' },
  ],
  assess: [
    { slug: 'exposure-scenario', title: 'Exposure scenario builder', status: 'soon' },
    { slug: 'dose-calculator', title: 'Dose calculator', status: 'soon' },
  ],
  plan: [{ slug: 'mitigation-plan', title: 'Mitigation plan', status: 'soon' }],
  act: [{ slug: 'incident-response', title: 'Incident response', status: 'soon' }],
  adapt: [{ slug: 'reexposure', title: 'Re-exposure assessment', status: 'soon' }],
  resolve: [{ slug: 'reporting-bundle', title: 'Reporting bundle', status: 'soon' }],
  reflect: [{ slug: 'retrospective', title: 'Retrospective', status: 'soon' }],
};

const STAGES = [
  { id: 'identify', label: 'Identify', caption: 'What is this substance?', emoji: '◎' },
  { id: 'assess', label: 'Assess', caption: 'How dangerous, in this scenario?', emoji: '◇' },
  { id: 'plan', label: 'Plan', caption: 'What do we do about it?', emoji: '△' },
  { id: 'act', label: 'Act', caption: 'Execute response or daily handling', emoji: '⌘' },
  { id: 'adapt', label: 'Adapt', caption: 'Conditions changed', emoji: '↻' },
  { id: 'resolve', label: 'Resolve', caption: 'Wrap up the incident or program', emoji: '◉' },
  { id: 'reflect', label: 'Reflect', caption: 'Learn from it', emoji: '☐' },
];

function StagePageContent({ stage }: { stage: string }) {
  const stageConfig = STAGES.find((s) => s.id === stage);
  const workflows = WORKFLOWS_BY_STAGE[stage] || [];

  if (!stageConfig) {
    return (
      <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
        <div className="rail-default py-24 text-center">
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)' }}>
            Stage not found
          </h1>
          <Link href="/workflow" style={{ color: 'var(--teal-deep)', marginTop: '2rem', display: 'block' }}>
            ← Back to all workflows
          </Link>
        </div>
      </main>
    );
  }

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
              stage {STAGES.findIndex((s) => s.id === stage) + 1} of 7
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
              {stageConfig.label}
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
                {stageConfig.caption}
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={450}>
            <div className="mt-10 flex justify-center">
              <video
                poster={`/icons/stage-${stage}.png`}
                autoPlay
                muted
                loop
                playsInline
                width={120}
                height={120}
                style={{ display: 'inline-block' }}
              >
                <source src={`/icons/stage-${stage}.mp4`} type="video/mp4" />
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Workflows Grid */}
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
              workflows in this stage
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
              {workflows.length} {workflows.length === 1 ? 'workflow' : 'workflows'} available.
            </h2>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-2">
            {workflows.map((wf, idx) => (
              <ScrollReveal key={wf.slug} delay={100 + idx * 100}>
                <Link
                  href={`/workflow/${stage}/${wf.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--paper-line)] bg-white p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  style={{ background: wf.status === 'live' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.3)' }}
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
                    {wf.status === 'live' ? 'available now' : 'coming soon'}
                  </div>

                  <div
                    className="mb-4 h-0.5 w-8 transition-all duration-200 group-hover:w-12"
                    style={{ background: 'var(--copper-orn-deep)' }}
                  />

                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: '1.6rem',
                      fontWeight: 500,
                      color: 'var(--ink)',
                      marginBottom: '1rem',
                    }}
                  >
                    {wf.title}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      color: 'var(--ink-soft)',
                      marginBottom: '1rem',
                      flex: 1,
                    }}
                  >
                    {wf.status === 'live'
                      ? 'Interactive workflow ready to use. Follow the steps to build a deliverable.'
                      : 'This workflow is coming soon. Check back later for availability.'}
                  </p>

                  <div
                    className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: wf.status === 'live' ? 'var(--copper-orn-deep)' : 'var(--ink-mute)',
                    }}
                  >
                    {wf.status === 'live' ? 'Start workflow' : 'Learn more'}
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
          href="/workflow"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--teal-deep)',
            textDecoration: 'underline',
          }}
        >
          ← Back to all stages
        </Link>
      </section>
    </main>
  );
}

export default function StageIndexPage({ params }: { params: Promise<{ stage: string }> }) {
  const [stage, setStage] = useState<string>('');

  useEffect(() => {
    params.then((p) => setStage(p.stage));
  }, [params]);

  if (!stage) return null;

  return (
    <Suspense fallback={<div />}>
      <StagePageContent stage={stage} />
    </Suspense>
  );
}
