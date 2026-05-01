'use client';

/**
 * HomeHero — full-bleed cinematic hero. Inspired by The Plastic Detox /
 * Unplastic Your Life landing page (opsociety.org/theplasticdetox/...) —
 * dramatic typography that dominates the screen, clear primary CTA pill,
 * subdued ambient backdrop that supports rather than competes with the
 * message.
 *
 * Layout philosophy:
 *   - One message dominates this screen — "What is this, really?"
 *   - High-contrast WHITE on deep slate
 *   - Headline goes huge — clamp(3rem, 9vw, 7rem)
 *   - Subhead constrained to max-w-2xl so it never sprawls
 *   - One primary CTA + one secondary CTA, both visible above the fold
 *   - Caduceus is small and decorative, NOT the focal point — the words are
 *   - Scroll-down hint at bottom
 *
 * Typography: Inter for the dominant headline + CTAs; Cormorant italic for
 * the accent word ("really") that gives the brand its voice.
 */
import { useEffect, useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedBackdrop from './AnimatedBackdrop';

export default function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [revealed, setRevealed] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Mount-trigger reveal — the hero is always above the fold, so reveal on mount
  // (not on scroll into view).
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const submit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    const url = q
      ? `/workflow/identify/compound-lookup?q=${encodeURIComponent(q)}`
      : '/workflow/identify/compound-lookup';
    router.push(url);
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden"
      data-mode="dark"
      style={{ minHeight: '100vh' }}
    >
      {/* Backdrop — toned-down so the typography dominates */}
      <AnimatedBackdrop />
      {/* Extra darken layer so white text always reads */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 45%, rgba(6, 12, 22, 0.05) 0%, rgba(6, 12, 22, 0.55) 80%)',
        }}
        aria-hidden
      />

      <div
        className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-center px-6 py-24 text-center sm:px-10 lg:px-16"
      >
        {/* Top eyebrow + caduceus row */}
        <div
          className="mb-12 flex flex-col items-center gap-5"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <Image
            src="/emblem-caduceus.png"
            alt=""
            width={180}
            height={180}
            priority
            style={{ filter: 'drop-shadow(0 4px 18px rgba(0, 0, 0, 0.45)) brightness(1.05)' }}
          />
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ background: 'rgba(255, 255, 255, 0.35)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(232, 240, 250, 0.8)',
              }}
            >
              toxicology knowledge garden · 2026
            </span>
            <span className="h-px w-8" style={{ background: 'rgba(255, 255, 255, 0.35)' }} />
          </div>
        </div>

        {/* MASSIVE dominant headline */}
        <h1
          className="mb-8 max-w-[18ch]"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 'clamp(2.8rem, 9vw, 7rem)',
            lineHeight: 0.98,
            letterSpacing: '-0.025em',
            color: '#FFFFFF',
            textShadow: '0 6px 40px rgba(0, 0, 0, 0.6)',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 1000ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
          }}
        >
          What is this,{' '}
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#F2C994',
              letterSpacing: '-0.01em',
            }}
          >
            really
          </span>
          ?
        </h1>

        {/* Constrained subhead */}
        <p
          className="mb-12 max-w-2xl"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: 'clamp(1.15rem, 1.8vw, 1.35rem)',
            lineHeight: 1.7,
            color: 'rgba(232, 240, 250, 0.9)',
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
          }}
        >
          A canonical, AI-citable evidence graph for chemical and biological hazards —
          with workflow tools for the people who actually have to act on them.
        </p>

        {/* TWO CLEAR CTA BUTTONS — primary + secondary */}
        <div
          className="mb-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) 600ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 600ms',
          }}
        >
          <Link
            href="/workflow/identify/compound-lookup"
            className="cta-pill cta-pill-lg cta-pill-primary group inline-flex items-center gap-2"
            style={{
              background: '#9DD9C4',
              color: '#0d3328',
              boxShadow: '0 18px 50px -12px rgba(157, 217, 196, 0.5)',
            }}
          >
            Look up a compound
            <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </Link>
          <Link
            href="#browse-the-garden"
            className="cta-pill cta-pill-lg cta-pill-ghost group inline-flex items-center gap-2"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.35)',
              color: '#F8FAFC',
              background: 'rgba(255, 255, 255, 0.04)',
            }}
          >
            See what&rsquo;s here
            <span className="transition-transform group-hover:translate-y-0.5" aria-hidden>↓</span>
          </Link>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: '#F2C994',
            opacity: revealed ? 1 : 0,
            transition: 'opacity 800ms ease 800ms',
          }}
        >
          Three sources behind every claim.
        </p>

        {/* Scroll hint */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60"
          style={{
            transition: 'opacity 800ms ease 1000ms',
            opacity: revealed ? 0.6 : 0,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(232, 240, 250, 0.85)',
            }}
          >
            scroll to explore
          </span>
          <span aria-hidden className="animate-bounce" style={{ color: 'rgba(232, 240, 250, 0.85)' }}>↓</span>
        </div>
      </div>

      {/* Hidden form for visual continuity but accessible — quick search via Enter */}
      <form onSubmit={submit} className="sr-only">
        <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search" />
      </form>
    </section>
  );
}
