import { getAllSubstances, getAllClassifications, searchSubstances, nameToSlug } from '@/lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Substances',
  description: 'Explore 329 substances found in American drinking water — search by name, CAS number, or category.',
};

interface Props {
  searchParams: Promise<{ q?: string; class?: string }>;
}

export default async function SubstancesPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.q || '';
  const classFilter = params.class || '';

  const classifications = await getAllClassifications();

  // If there's a search query, use hybrid search RPC; otherwise load all
  let substances: any[] = [];
  if (query) {
    substances = await searchSubstances(query);
  } else {
    substances = await getAllSubstances();
  }

  // For classification filtering, we need substance-classification joins
  // For now, show all substances with a note about active filter
  // (full classification filter requires a join query)

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* ── Header + Search ── */}
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Substances
        </h1>
        <p className="mb-6 text-[var(--color-ink-light)]">
          {query ? `Search results for "${query}"` : `${substances.length} substances in the database`}
          {classFilter && ` — filtered by ${classFilter}`}
        </p>

        <form action="/substances" method="GET" className="mb-6 max-w-2xl">
          <div className="flex overflow-hidden rounded-lg border-2 border-[var(--color-teal)]/30
                          focus-within:border-[var(--color-teal)] transition-colors">
            <input
              type="text" name="q" defaultValue={query}
              placeholder="Search by name, CAS number, or trade name..."
              className="flex-1 bg-white px-4 py-3 text-[var(--color-ink)] outline-none"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            />
            <button type="submit"
              className="bg-[var(--color-teal)] px-5 text-white text-sm transition-colors hover:bg-[var(--color-teal-dark)]"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              SEARCH
            </button>
          </div>
        </form>

        {/* ── Classification Filter Chips ── */}
        <div className="flex flex-wrap gap-2">
          <a href="/substances"
             className={`rounded-full border px-3 py-1.5 text-xs no-underline transition-all
               ${!classFilter
                 ? 'border-[var(--color-teal)] bg-[var(--color-teal)] text-white'
                 : 'border-[var(--color-gold)]/30 bg-white text-[var(--color-ink)] hover:border-[var(--color-teal)]'}`}
             style={{ fontFamily: 'var(--font-mono)' }}>
            All
          </a>
          {classifications.map((c: any) => (
            <a key={c.id}
               href={`/substances?class=${encodeURIComponent(c.name)}`}
               className={`rounded-full border px-3 py-1.5 text-xs no-underline transition-all
                 ${classFilter === c.name
                   ? 'border-[var(--color-teal)] bg-[var(--color-teal)] text-white'
                   : 'border-[var(--color-gold)]/30 bg-white text-[var(--color-ink)] hover:border-[var(--color-teal)]'}`}
               style={{ fontFamily: 'var(--font-mono)' }}>
              {c.name}
            </a>
          ))}
        </div>
      </div>

      {/* ── Substance Grid ── */}
      {substances.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-steel)]">
          <p className="text-xl" style={{ fontFamily: 'var(--font-display)' }}>No substances found</p>
          <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            Try a different search term or browse all substances
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {substances.map((s: any) => (
            <a key={s.id || s.name}
               href={`/substances/${nameToSlug(s.name)}`}
               className="group block rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)]
                          p-5 no-underline transition-all hover:border-[var(--color-teal)]/40 hover:shadow-md">
              <div className="mb-1 text-lg font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal)]"
                   style={{ fontFamily: 'var(--font-display)' }}>
                {s.name}
              </div>
              {s.cas_number && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-steel)' }}>
                  CAS {s.cas_number}
                </div>
              )}
              {s.molecular_formula && (
                <div className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--color-copper)' }}>
                  {s.molecular_formula}
                </div>
              )}
              {s.description && (
                <p className="mt-2 text-sm text-[var(--color-ink-light)]" style={{ lineHeight: 1.5 }}>
                  {s.description.length > 100 ? s.description.slice(0, 100) + '…' : s.description}
                </p>
              )}

              {/* Show match type for search results */}
              {s.match_type && (
                <div className="mt-2">
                  <span className="rounded-full bg-[var(--color-teal)]/10 px-2 py-0.5 text-[var(--color-teal)]"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.03em' }}>
                    {s.match_type}
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {/* ── Result count ── */}
      <div className="mt-8 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-steel)' }}>
        Showing {substances.length} substance{substances.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
