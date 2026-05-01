'use client';

/**
 * Loom hero. Reference: design-references/READ_FIRST.md (Loom + caduceus PNG).
 *
 * Layout (centered, paper background):
 *   1. Large caduceus PNG (the actual emblem, not the SVG approximation)
 *   2. "Three sources behind every claim." — Cormorant 600, very large
 *   3. Italic subhead in Cormorant
 *   4. AI chat input — paper-warm pill with mic icon left + send button right
 *   5. Three small audience-pill links beneath the input
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Emblem from '@/components/shared/Emblem';

type Audience = 'consumer' | 'clinician' | 'counsel';

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState<Audience>('consumer');

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    const url = q
      ? `/flow/${audience}?q=${encodeURIComponent(q)}`
      : `/flow/${audience}`;
    router.push(url);
  };

  return (
    <section className="flex flex-col items-center pb-16 pt-6 text-center">
      <div className="relative">
        <Emblem size="hero" />
      </div>

      <h1
        className="mt-2 text-[var(--ink)]"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
          fontWeight: 600,
          letterSpacing: '-0.015em',
          lineHeight: 1.1,
        }}
      >
        Three sources behind every claim.
      </h1>

      <p
        className="mt-5 max-w-2xl px-4 text-[var(--ink-soft)]"
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
          lineHeight: 1.55,
        }}
      >
        Toxicology, organized for everyone — from concerned parents to clinicians at the bedside to counsel preparing for Daubert.
      </p>

      <form
        onSubmit={submit}
        className="mt-9 flex w-full max-w-2xl items-center gap-3 rounded-full border border-[var(--paper-line)] bg-[var(--paper-warm)] px-5 py-2.5 transition-colors focus-within:border-[var(--ink-mute)]"
      >
        <button
          type="button"
          aria-label="Voice input"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[var(--ink-mute)] transition-colors hover:text-[var(--ink)]"
          tabIndex={-1}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8 1c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zM4 8a4 4 0 008 0M8 12v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything — type or talk. Describe a substance, a symptom, a case."
          className="flex-1 bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--ink-mute)]"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}
        />

        <button
          type="submit"
          aria-label="Send"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--paper)] transition-transform hover:-translate-y-0.5"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <path d="M7 13V1M7 1L1 7M7 1L13 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[var(--ink-mute)]" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Open as ·
        </span>
        {(['consumer', 'clinician', 'counsel'] as Audience[]).map((a) => {
          const active = audience === a;
          const accent =
            a === 'consumer'  ? 'var(--teal-deep)' :
            a === 'clinician' ? 'var(--indigo)' :
                                'var(--crimson-deep)';
          return (
            <button
              key={a}
              type="button"
              onClick={() => setAudience(a)}
              className="rounded-full border px-4 py-1 transition-all"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                background: active ? accent : 'transparent',
                color: active ? 'var(--paper)' : accent,
                borderColor: accent,
              }}
            >
              {a}
            </button>
          );
        })}
      </div>
    </section>
  );
}
