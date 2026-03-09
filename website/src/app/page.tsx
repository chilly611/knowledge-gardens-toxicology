import { getAllSubstances, getAllClassifications, nameToSlug } from '@/lib/supabase';

export default async function Home() {
  const substances = await getAllSubstances();
  const classifications = await getAllClassifications();
  const withCas = substances.filter(s => s.cas_number);
  const total = substances.length;

  // Pick 6 well-known substances as featured
  const featured = ['Arsenic', 'Lead', 'Chloroform', 'Atrazine', 'Benzene', 'Chromium (hexavalent)'];
  const featuredSubs = featured
    .map(name => substances.find(s => s.name === name))
    .filter(Boolean);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* ── Hero ── */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold text-[var(--color-ink)] md:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}>
          What&rsquo;s in Your Water?
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-[var(--color-ink-light)]"
           style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8 }}>
          Explore {total} substances found in American drinking water.
          Evidence-based data from EWG, PubChem, and the EPA — organized for
          everyone from concerned parents to researchers.
        </p>

        {/* Search */}
        <form action="/substances" method="GET" className="mx-auto max-w-xl">
          <div className="flex overflow-hidden rounded-lg border-2 border-[var(--color-teal)]/30
                          focus-within:border-[var(--color-teal)] transition-colors">
            <input
              type="text" name="q" placeholder="Search by name, CAS number, or trade name..."
              className="flex-1 bg-white px-5 py-3.5 text-base text-[var(--color-ink)] outline-none"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}
            />
            <button type="submit"
              className="bg-[var(--color-teal)] px-6 text-white transition-colors hover:bg-[var(--color-teal-dark)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
              SEARCH
            </button>
          </div>
        </form>
      </section>

      {/* ── Stats Bar ── */}
      <section className="mb-16 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatBox label="Substances" value={total} />
        <StatBox label="With CAS #" value={withCas.length} />
        <StatBox label="Health Effects" value={18} />
        <StatBox label="Data Sources" value={3} />
      </section>

      {/* ── Featured Substances ── */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Common Contaminants
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSubs.map((s: any) => (
            <a key={s.id} href={`/substances/${nameToSlug(s.name)}`}
               className="group block rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)]
                          p-5 no-underline transition-all hover:border-[var(--color-teal)]/40 hover:shadow-md">
              <div className="mb-1 text-lg font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal)]"
                   style={{ fontFamily: 'var(--font-display)' }}>
                {s.name}
              </div>
              {s.cas_number && (
                <div className="mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-steel)' }}>
                  CAS {s.cas_number}
                </div>
              )}
              {s.description && (
                <p className="text-sm text-[var(--color-ink-light)]" style={{ lineHeight: 1.6 }}>
                  {s.description.length > 120 ? s.description.slice(0, 120) + '…' : s.description}
                </p>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Browse by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          {classifications.map((c: any) => (
            <a key={c.id} href={`/substances?class=${encodeURIComponent(c.name)}`}
               className="rounded-full border border-[var(--color-gold)]/30 bg-white px-4 py-2
                          text-sm no-underline text-[var(--color-ink)] transition-all
                          hover:border-[var(--color-teal)] hover:bg-[var(--color-teal)] hover:text-white"
               style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              {c.name}
            </a>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="text-center">
        <a href="/substances"
           className="inline-block rounded-lg bg-[var(--color-teal)] px-8 py-3 text-white
                      no-underline transition-colors hover:bg-[var(--color-teal-dark)]"
           style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
          EXPLORE ALL {total} SUBSTANCES →
        </a>
      </section>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-5 text-center">
      <div className="text-3xl font-bold text-[var(--color-teal)]"
           style={{ fontFamily: 'var(--font-display)' }}>
        {value.toLocaleString()}
      </div>
      <div className="mt-1 text-[var(--color-steel)]"
           style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
        {label}
      </div>
    </div>
  );
}
