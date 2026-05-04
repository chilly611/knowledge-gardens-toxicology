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
import { searchEverything, slug } from '@/lib/queries-tox';

export default function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [searching, setSearching] = useState(false);
  const [chipsRevealed, setChipsRevealed] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  // Mount-trigger reveal — the hero is always above the fold, so reveal on mount
  // (not on scroll into view).
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Chips appear 100ms after input is visible
  useEffect(() => {
    if (!revealed) return;
    const t = setTimeout(() => setChipsRevealed(true), 100);
    return () => clearTimeout(t);
  }, [revealed]);

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    try {
      const results = await searchEverything(q);

      // Rule a: exactly one substance with no other types
      const substanceResults = results.filter((r) => r.type === 'substance');
      const otherResults = results.filter((r) => r.type !== 'substance');
      if (substanceResults.length === 1 && otherResults.length === 0) {
        router.push(substanceResults[0].link);
        return;
      }

      // Rule b: exact alias match (requires extra lookup)
      const { data: subs } = await (await import('@/lib/supabase-tox')).supabaseTox
        .from('substances')
        .select('id, name, aliases')
        .limit(50);

      if (subs && Array.isArray(subs)) {
        const exactAliasMatches = subs.filter(
          (s: any) =>
            Array.isArray(s.aliases) &&
            s.aliases.some((alias: string) => alias.toLowerCase() === q.toLowerCase())
        );
        if (exactAliasMatches.length === 1) {
          router.push(`/compound/${slug(exactAliasMatches[0].name)}`);
          return;
        }
      }

      // Rule c: fallback to search page
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } finally {
      setSearching(false);
    }
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

        {/* SEARCH INPUT */}
        <form
          onSubmit={submit}
          className="mb-8 w-full max-w-[640px]"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) 500ms, transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 500ms',
          }}
        >
          <div className="relative flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a chemical, an alias, or a CAS number"
              className="w-full rounded-full transition-all"
              style={{
                background: 'var(--paper)',
                border: query || searching ? '2px solid var(--copper-orn-deep)' : '2px solid rgba(255, 255, 255, 0.25)',
                padding: 'clamp(0.85rem, 1.5vw, 1.1rem) 1.4rem',
                paddingRight: '3.5rem',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                color: '#0d0d0d',
                boxShadow: query || searching ? '0 0 0 4px rgba(184, 115, 51, 0.18)' : 'none',
              }}
              aria-label="Search compounds"
            />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-2 flex items-center justify-center transition-all"
              style={{
                width: '2.5rem',
                height: '2.5rem',
                background: 'var(--copper-orn-deep)',
                borderRadius: '50%',
                color: '#FFF',
                fontSize: '1.1rem',
                opacity: searching ? 0.7 : 1,
              }}
              aria-label="Submit search"
            >
              {searching ? '...' : '↵'}
            </button>
          </div>
        </form>

        {/* CHIPS ROW */}
        <div
          className="mb-10 w-full max-w-[640px]"
          style={{
            opacity: chipsRevealed ? 1 : 0,
            transform: chipsRevealed ? 'translateY(0)' : 'translateY(-10px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(232, 240, 250, 0.5)',
              marginBottom: '0.8rem',
            }}
          >
            Or jump directly to
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/compound/pcbs"
              className="group inline-flex items-center rounded-full px-4 py-2 transition-all"
              style={{
                background: 'rgba(245, 240, 232, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFF',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(245, 240, 232, 0.2)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(245, 240, 232, 0.12)';
                el.style.transform = 'translateY(0)';
              }}
            >
              PCBs
            </Link>
            <Link
              href="/compound/dioxin"
              className="group inline-flex items-center rounded-full px-4 py-2 transition-all"
              style={{
                background: 'rgba(245, 240, 232, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFF',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(245, 240, 232, 0.2)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(245, 240, 232, 0.12)';
                el.style.transform = 'translateY(0)';
              }}
            >
              Dioxin
            </Link>
            <Link
              href="/compound/glyphosate"
              className="group inline-flex items-center rounded-full px-4 py-2 transition-all"
              style={{
                background: 'rgba(245, 240, 232, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: '#FFF',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(245, 240, 232, 0.2)';
                el.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = 'rgba(245, 240, 232, 0.12)';
                el.style.transform = 'translateY(0)';
              }}
            >
              Glyphosate
            </Link>
          </div>
        </div>

        {/* Secondary lookup wizard link */}
        <div
          className="mb-10"
          style={{
            opacity: revealed ? 1 : 0,
            transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1) 700ms',
          }}
        >
          <Link
            href="/workflow/identify/compound-lookup"
            className="group inline-flex items-center text-sm transition-all"
            style={{
              color: 'rgba(232, 240, 250, 0.7)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Or use the lookup wizard
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
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

    </section>
  );
}
