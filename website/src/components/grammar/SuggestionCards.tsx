'use client';

/**
 * SuggestionCards — three cards labeled "Try one of these:" that BKG places
 * directly under the hero. Each card is a single-line suggestion that fills
 * the AskBox below when clicked.
 *
 * Grammar primitive #5.
 */
import { useRouter } from 'next/navigation';

export type Suggestion = {
  label: string;
  /** Where this suggestion takes you. Usually a workflow URL or a query into the AskBox. */
  href: string;
};

export default function SuggestionCards({
  suggestions,
  label = 'Try one of these:',
}: {
  suggestions: Suggestion[];
  label?: string;
}) {
  const router = useRouter();
  return (
    <section className="w-full">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div
          className="mb-3 text-[var(--ink-soft)]"
          style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}
        >
          {label}
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => router.push(s.href)}
              className="group rounded-2xl border border-[var(--paper-line)] bg-[var(--paper-warm)] px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-[var(--tox-soft)] hover:shadow-sm"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--ink)' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
