'use client';

/**
 * PitchTicker — animated demo-path narrator. Cycles through the three demo
 * beats Chilly will say out loud at the partner meeting:
 *
 *   1. Three audiences, one evidence graph
 *   2. Click Glyphosate → drop into Stratigraph → 4 layers down
 *   3. Counsel + Sky Valley → 7 stages → Daubert exhibit packet
 *
 * Uses ScrollReveal-from-IntersectionObserver to start the cycle when in view.
 * No external typewriter library — just a setInterval cycling visible step.
 *
 * Each beat has its own glyph badge (audience pill / Stratigraph cube /
 * scales-of-justice) and a CTA that deep-links to the matching surface, so a
 * partner can click straight into the demo from this section.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type Beat = {
  number: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  accent: string;
  accentSoft: string;
};

const BEATS: Beat[] = [
  {
    number: '01',
    title: 'Three audiences. One evidence graph.',
    body:
      'Consumer, Clinician, Counsel — each gets their own lane. Same canonical claims underneath. Three sources required behind every claim, and contested claims are surfaced both ways.',
    ctaLabel: 'See the matrix',
    ctaHref: '/',
    accent: '#2ea4a3',
    accentSoft: 'rgba(46, 164, 163, 0.18)',
  },
  {
    number: '02',
    title: 'Click Glyphosate. Drop into the Stratigraph.',
    body:
      'Four layers, surface to bedrock. Plain-English summary at the top. Mechanism. Regulatory positions. The primary peer-reviewed evidence. Every assertion carries its sources.',
    ctaLabel: 'Open the Stratigraph',
    ctaHref: '/compound/glyphosate',
    accent: '#b87333',
    accentSoft: 'rgba(184, 115, 51, 0.18)',
  },
  {
    number: '03',
    title: 'Counsel lane. Sky Valley pre-loaded. Daubert-grade exit.',
    body:
      'Walk seven stages — Identify → Assess → Plan → Act → Adapt → Resolve → Reflect. End with a 3–5 page exhibit packet. Theory of harm, source matrix, expert pack, timeline.',
    ctaLabel: 'Open the Counsel lane',
    ctaHref: '/flow/counsel?case=sky-valley',
    accent: '#e83759',
    accentSoft: 'rgba(232, 55, 89, 0.18)',
  },
];

export default function PitchTicker() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Trigger when section enters viewport
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !ref.current) return;
    const node = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  // Auto-advance through beats while in view
  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % BEATS.length);
    }, 6500);
    return () => window.clearInterval(id);
  }, [inView]);

  const beat = BEATS[active];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #08110f 0%, #0f1c1a 50%, #1a2826 100%)',
        padding: '8rem 1.5rem',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="rail-default w-full">
        {/* Section eyebrow */}
        <p
          className="text-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '4rem',
          }}
        >
          The pitch your team will hear
        </p>

        {/* Beat indicators (clickable dots) */}
        <div className="mb-12 flex justify-center gap-3">
          {BEATS.map((b, i) => (
            <button
              key={b.number}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Beat ${b.number}: ${b.title}`}
              style={{
                width: i === active ? '48px' : '12px',
                height: '12px',
                borderRadius: '999px',
                background:
                  i === active ? b.accent : 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          ))}
        </div>

        {/* Beat content — fades on change */}
        <div
          key={beat.number}
          className="animate-fade-in mx-auto max-w-3xl text-center"
        >
          {/* Beat number */}
          <div
            className="mb-8 inline-flex items-center gap-3 rounded-full px-5 py-2"
            style={{
              background: beat.accentSoft,
              border: `1px solid ${beat.accent}`,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: beat.accent,
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '999px',
                background: beat.accent,
                animation: 'halo-pulse 2s ease-in-out infinite',
              }}
            />
            Beat {beat.number}
          </div>

          {/* Headline */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.12,
              marginBottom: '2rem',
              letterSpacing: '-0.01em',
            }}
          >
            {beat.title}
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '0.55ch',
                marginLeft: '0.15em',
                color: beat.accent,
                animation: 'caret-blink 1.1s steps(1) infinite',
              }}
            >
              ▍
            </span>
          </h2>

          {/* Body */}
          <p
            className="mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.18rem',
              lineHeight: 1.7,
              color: 'rgba(255, 255, 255, 0.78)',
              maxWidth: '52ch',
              marginBottom: '3rem',
            }}
          >
            {beat.body}
          </p>

          {/* CTA */}
          <Link
            href={beat.ctaHref}
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 transition-transform hover:-translate-y-0.5"
            style={{
              background: beat.accent,
              color: '#08110f',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: `0 12px 40px ${beat.accentSoft}, 0 0 0 1px ${beat.accent}`,
            }}
          >
            {beat.ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
