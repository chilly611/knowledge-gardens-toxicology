'use client';

/**
 * AskBox — BKG's central voice/text input. Wide rounded pill with a mic icon
 * on the left, a green-mint "Ask" button on the right.
 *
 * Grammar primitive #6.
 *
 * The placeholder "say what you need and where you are by plain old talking
 * turkey and we can figure out how to get you a pro result!" is BKG's exact
 * line — kept verbatim because it's part of the family voice.
 */
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function AskBox({
  /** Where to send the user when they submit; receives `?q=` */
  destinationPath = '/workflow/identify/compound-lookup',
  placeholder = 'say what you need and where you are by plain old talking turkey and we can figure out how to get you a pro result!',
}: {
  destinationPath?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const submit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const q = query.trim();
    const url = q ? `${destinationPath}?q=${encodeURIComponent(q)}` : destinationPath;
    router.push(url);
  };

  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={submit}
          className="flex w-full items-center gap-3 rounded-3xl border border-[var(--paper-line)] bg-[var(--paper-warm)] px-3 py-2 transition-colors focus-within:border-[var(--tox-soft)]"
        >
          <button
            type="button"
            aria-label="Voice input"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[var(--paper-line)] bg-[var(--paper)] text-[var(--ink-mute)] transition-colors hover:text-[var(--ink)]"
            tabIndex={-1}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 1c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zM4 8a4 4 0 008 0M8 12v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>

          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit();
            }}
            className="flex-1 resize-none bg-transparent py-1 text-[var(--ink)] outline-none placeholder:text-[var(--ink-mute)]"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', lineHeight: 1.5 }}
          />

          <button
            type="submit"
            className="flex flex-shrink-0 items-center justify-center rounded-2xl px-5 py-2.5 transition-transform hover:-translate-y-0.5"
            style={{
              background: '#9DD9C4',
              color: '#0d3328',
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Ask
          </button>
        </form>
        <div
          className="mt-2 text-center text-[var(--ink-mute)]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.06em' }}
        >
          ⌘ + Enter to send · 🎤 to dictate · coexists with the bottom-right AI for anything-else
        </div>
      </div>
    </section>
  );
}
