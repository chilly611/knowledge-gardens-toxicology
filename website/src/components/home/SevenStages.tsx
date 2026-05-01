'use client';

/**
 * SevenStages — visual explainer of the 7-stage pattern.
 * One-message-per-screen (90vh min-height), focused on the lifecycle shape.
 * Large cinematic video players for each stage, horizontal rail of stage cards with workflow examples.
 * Deliverables below.
 * Paper-warm background with subtle dot grid (data-surface="tkg").
 */

import Link from 'next/link';
import { STAGES, WORKFLOWS_BY_STAGE } from '../grammar/stages';
import ScrollReveal from './ScrollReveal';
import StageBigPlayer from './StageBigPlayer';

export default function SevenStages() {
  return (
    <section data-surface="tkg" className="relative min-h-[90vh] flex items-center" style={{ background: 'var(--paper-warm)' }}>
      <div className="rail-wide w-full">
        {/* Eyebrow */}
        <ScrollReveal delay={0}>
          <div
            className="mb-6 text-center text-xs uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--copper-orn-deep)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
            }}
          >
            how the killer app works
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={100}>
          <h2
            className="mx-auto mb-6 max-w-[22ch] text-center leading-tight text-[var(--ink)]"
            style={{
              fontFamily: 'var(--font-body)',
              fontStyle: 'normal',
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
            }}
          >
            Seven stages, one shape across every garden.
          </h2>
        </ScrollReveal>

        {/* Subheading */}
        <ScrollReveal delay={100}>
          <div className="prose-rail">
            <p
              className="mb-12 text-center leading-relaxed text-[var(--ink-soft)]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}
            >
              Builder's, Orchid, Health, NatureMark, Toxicology — every garden inherits the same lifecycle. Different work, same skeleton. Each stage ends in a deliverable.
            </p>
          </div>
        </ScrollReveal>

        {/* Stage cards — grid layout with cinematic video players */}
        <div className="relative mb-16">
          {/* Background connection line (copper arc) */}
          <div className="absolute left-0 right-0 top-1/3 hidden h-px bg-gradient-to-r from-transparent via-[var(--copper-orn-deep)] to-transparent lg:block" />

          {/* Grid container: 7 columns on desktop lg+, responsive on smaller screens */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 lg:gap-4">
            {STAGES.map((stage, idx) => {
              const workflows = WORKFLOWS_BY_STAGE[stage.id] || [];
              const firstWorkflow = workflows[0];
              const isLive = firstWorkflow?.status === 'live';

              return (
                <ScrollReveal key={stage.id} delay={80 * idx}>
                  <div
                    className="tile-inner flex flex-col items-center gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {/* Large video player */}
                    <StageBigPlayer
                      id={stage.id}
                      size={140}
                      className="w-full max-w-[140px]"
                    />

                    {/* Stage number */}
                    <div
                      className="text-sm font-bold text-[var(--ink-mute)]"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {String(stage.number).padStart(2, '0')}
                    </div>

                    {/* Stage label */}
                    <h3
                      className="text-center font-medium text-[var(--ink)]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontStyle: 'normal',
                        fontSize: '1rem',
                        fontWeight: 700,
                      }}
                    >
                      {stage.label}
                    </h3>

                    {/* Caption */}
                    <p
                      className="text-center text-xs leading-tight text-[var(--ink-mute)]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.8rem',
                        maxWidth: '140px',
                      }}
                    >
                      {stage.caption}
                    </p>

                    {/* First workflow example */}
                    {firstWorkflow && (
                      <div
                        className="mt-1 rounded px-2 py-1 text-center text-xs"
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.75rem',
                          background: 'rgba(26, 36, 51, 0.04)',
                          color: 'var(--ink-soft)',
                        }}
                      >
                        {firstWorkflow.title}
                      </div>
                    )}

                    {/* Status badge */}
                    <div
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.08em',
                        background: isLive ? 'var(--teal)' : 'var(--peach-deep)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {isLive ? 'live' : 'soon'}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        {/* Deliverables section */}
        <ScrollReveal delay={200}>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Personal Briefing', href: '/pdf-preview/consumer' },
              { label: 'Clinical Brief', href: '/pdf-preview/clinician' },
              { label: 'Case-Prep Packet', href: '/pdf-preview/counsel' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="cta-pill cta-pill-secondary rounded-full border border-[var(--paper-line)] bg-white"
              >
                <div
                  className="text-sm font-medium text-[var(--ink)]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontStyle: 'normal',
                    fontWeight: 700,
                  }}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
