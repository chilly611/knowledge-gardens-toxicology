'use client';

/**
 * HomeHero — the herbarium masthead.
 *
 * Rebuilt to the Toxicology Knowledge Garden design system (handoff bundle):
 * Victorian botanical plate, cream paper, sepia/teal ink — NOT a dark
 * cinematic hero. Big italic Cormorant "Toxicology" wordmark, the living
 * teal-ink caduceus in a copper-bracketed specimen plate, slate-blue garden
 * accent. No pure white, no dark mode, no glassmorphism.
 *
 * Functionality preserved from the previous hero: the search field routes to
 * a single substance, an exact alias match, or the /search page; quick chips
 * deep-link to signature compounds.
 */
import { useEffect, useRef, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { searchEverything, slug } from '@/lib/queries-tox';

export default function HomeHero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [revealed, setRevealed] = useState(true); // visible by default — never blank-flash before JS
  const [searching, setSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 80);
    return () => clearTimeout(t);
  }, []);

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    try {
      const results = await searchEverything(q);

      const substanceResults = results.filter((r) => r.type === 'substance');
      const otherResults = results.filter((r) => r.type !== 'substance');
      if (substanceResults.length === 1 && otherResults.length === 0) {
        router.push(substanceResults[0].link);
        return;
      }

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

      router.push(`/search?q=${encodeURIComponent(q)}`);
    } finally {
      setSearching(false);
    }
  };

  const ease = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
  const rise = (delay: number) => ({
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 700ms ${ease} ${delay}ms, transform 700ms ${ease} ${delay}ms`,
  });

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden"
      style={{
        background: 'var(--paper)',
        backgroundImage:
          'linear-gradient(rgba(124,98,53,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124,98,53,0.06) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        borderBottom: '1px solid var(--paper-line)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(242,233,210,0) 0%, rgba(242,233,210,0.6) 100%)' }}
        aria-hidden
      />

      <div className="rail-wide relative grid items-center gap-12 py-20 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16 lg:py-28">
        {/* LEFT — wordmark, thesis, search */}
        <div>
          <div
            className="flex items-center gap-3"
            style={{
              ...rise(0),
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              fontWeight: 700,
            }}
          >
            <span style={{ width: 30, height: 1, background: 'var(--copper-orn)', display: 'block' }} />
            Knowledge Gardens · Toxicology
          </div>

          <h1
            className="mt-4"
            style={{
              ...rise(80),
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontWeight: 600,
              fontSize: 'clamp(3.4rem, 9vw, 6.5rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: 'var(--teal-deep)',
            }}
          >
            Toxicology
          </h1>
          <div
            className="mt-1"
            style={{
              ...rise(120),
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: 'var(--ink)',
            }}
          >
            Knowledge&nbsp;&nbsp;Garden
          </div>

          <p
            className="mt-6 max-w-[30ch]"
            style={{
              ...rise(200),
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(1.25rem, 2vw, 1.6rem)',
              lineHeight: 1.4,
              color: 'var(--ink-script, #6B4A2A)',
            }}
          >
            The canonical, AI-citable reference for chemical and biological hazards — and a
            field guide for the people who have to act on them.
          </p>

          {/* search */}
          <form onSubmit={submit} className="mt-8 w-full max-w-[560px]" style={rise(300)}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search a chemical, an alias, or a CAS number"
                aria-label="Search compounds"
                className="w-full"
                style={{
                  background: 'var(--paper-raised)',
                  border: `1px solid ${focused || query ? 'var(--copper-orn)' : 'var(--paper-line)'}`,
                  borderRadius: 3,
                  padding: '0.95rem 3.4rem 0.95rem 1.1rem',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.02rem',
                  color: 'var(--ink)',
                  boxShadow: focused
                    ? '0 0 0 3px color-mix(in oklab, var(--copper-orn) 25%, transparent)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.4)',
                  outline: 'none',
                  transition: 'border-color 160ms ease, box-shadow 160ms ease',
                }}
              />
              <button
                type="submit"
                disabled={searching}
                aria-label="Submit search"
                className="absolute right-2 flex items-center justify-center"
                style={{
                  width: '2.4rem',
                  height: '2.4rem',
                  background: 'var(--tox-deep)',
                  borderRadius: 3,
                  color: 'var(--paper)',
                  fontSize: '1.05rem',
                  opacity: searching ? 0.7 : 1,
                }}
              >
                {searching ? '·' : '↵'}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                }}
              >
                Or jump to
              </span>
              {[
                { href: '/compound/pcbs', label: 'PCBs' },
                { href: '/compound/dioxin', label: 'Dioxin' },
                { href: '/compound/glyphosate', label: 'Glyphosate' },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="inline-flex items-center transition-colors hover:text-[var(--crimson)]"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--teal-deep)',
                    background: 'var(--paper-raised)',
                    border: '1px solid var(--paper-line)',
                    borderRadius: 3,
                    padding: '0.3rem 0.7rem',
                  }}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </form>

          <p
            className="mt-7"
            style={{
              ...rise(420),
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: 'var(--teal-deep)',
            }}
          >
            Three sources behind every claim.
          </p>
        </div>

        {/* RIGHT — the living mark in a copper-bracketed specimen plate */}
        <div className="relative mx-auto w-full max-w-[440px]" style={{ ...rise(180), padding: 14 }}>
          <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, width: 22, height: 22, borderTop: '2px solid var(--copper-orn)', borderLeft: '2px solid var(--copper-orn)' }} />
          <span aria-hidden style={{ position: 'absolute', top: 0, right: 0, width: 22, height: 22, borderTop: '2px solid var(--copper-orn)', borderRight: '2px solid var(--copper-orn)' }} />
          <span aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, width: 22, height: 22, borderBottom: '2px solid var(--copper-orn)', borderLeft: '2px solid var(--copper-orn)' }} />
          <span aria-hidden style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderBottom: '2px solid var(--copper-orn)', borderRight: '2px solid var(--copper-orn)' }} />
          <div
            style={{
              border: '1px solid var(--paper-line)',
              background: 'var(--paper-raised)',
              boxShadow: '0 1px 0 var(--paper-line), 0 10px 28px rgba(90,59,31,0.16)',
              overflow: 'hidden',
              borderRadius: 2,
              animation: 'tkgHeroBreathe 7s ease-in-out infinite',
            }}
          >
            <video
              src="/emblem-caduceus.mp4"
              poster="/emblem-caduceus.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              style={{ width: '100%', display: 'block', mixBlendMode: 'multiply' }}
            />
          </div>
          <div
            className="mt-3 text-center"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
            }}
          >
            The living mark · teal-ink caduceus, branched &amp; rooted
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tkgHeroBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.012); } }
      `}</style>
    </section>
  );
}
