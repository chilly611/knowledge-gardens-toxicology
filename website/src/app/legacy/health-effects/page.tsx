import { getAllHealthEffects, supabase } from '@/lib/supabase';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Effects',
  description: 'Browse health effects linked to drinking water contaminants — cancer, liver damage, endocrine disruption, and more.',
};

async function getEffectsWithCounts() {
  const effects = await getAllHealthEffects();
  const counts: Record<string, number> = {};
  for (const e of effects) {
    const { count } = await supabase
      .from('substance_health_effects')
      .select('*', { count: 'exact', head: true })
      .eq('health_effect_id', e.id);
    counts[e.id] = count || 0;
  }
  return effects.map((e: any) => ({ ...e, substance_count: counts[e.id] || 0 }));
}

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default async function HealthEffectsPage() {
  const effects = await getEffectsWithCounts();
  const sorted = effects.sort((a: any, b: any) => b.substance_count - a.substance_count);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-2 text-4xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        Health Effects
      </h1>
      <p className="mb-8 text-[var(--color-ink-light)]">
        {effects.length} documented health effects linked to drinking water contaminants.
        Sorted by number of associated substances.
      </p>

      <div className="space-y-4">
        {sorted.map((e: any) => (
          <a key={e.id} href={`/health-effects/${nameToSlug(e.name)}`}
             className="group block rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-5
                        no-underline transition-all hover:border-[var(--color-teal)]/40 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal)]"
                     style={{ fontFamily: 'var(--font-display)' }}>
                  {e.name}
                </div>
                {e.description && (
                  <p className="mt-1 text-sm text-[var(--color-ink-light)]" style={{ lineHeight: 1.6 }}>
                    {e.description}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-2xl font-bold text-[var(--color-teal)]"
                     style={{ fontFamily: 'var(--font-display)' }}>
                  {e.substance_count}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-steel)', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
                  substances
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
