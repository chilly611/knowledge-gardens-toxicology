import { getAllHealthEffects, supabase, nameToSlug } from '@/lib/supabase';
import type { Metadata } from 'next';

const EVIDENCE_COLORS: Record<string, string> = {
  known: '#c0392b', probable: '#e67e22', possible: '#f39c12',
  inadequate: '#95a5a6', not_classified: '#bdc3c7',
};

function slugToName(slug: string) { return slug.replace(/-/g, ' '); }
function effectSlug(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export async function generateStaticParams() {
  const effects = await getAllHealthEffects();
  return effects.map((e: any) => ({ slug: effectSlug(e.name) }));
}

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = slugToName(slug);
  return {
    title: `${name.charAt(0).toUpperCase() + name.slice(1)} — Health Effect`,
    description: `Substances linked to ${name} in drinking water.`,
  };
}

export default async function HealthEffectDetailPage({ params }: Props) {
  const { slug } = await params;
  const effects = await getAllHealthEffects();
  const effect = effects.find((e: any) => effectSlug(e.name) === slug);

  if (!effect) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Health Effect Not Found</h1>
        <a href="/health-effects" className="mt-6 inline-block text-[var(--color-teal)]">← Back to all health effects</a>
      </div>
    );
  }

  const { data: links } = await supabase
    .from('substance_health_effects')
    .select('substance_id, evidence_level, evidence_source, notes')
    .eq('health_effect_id', effect.id);

  let substances: any[] = [];
  if (links && links.length > 0) {
    const ids = links.map((l: any) => l.substance_id);
    const { data } = await supabase
      .from('substances')
      .select('id, name, cas_number, description')
      .in('id', ids)
      .order('name');
    substances = (data || []).map((s: any) => {
      const link = links.find((l: any) => l.substance_id === s.id);
      return { ...s, evidence_level: link?.evidence_level };
    });
  }

  const known = substances.filter(s => s.evidence_level === 'known');
  const probable = substances.filter(s => s.evidence_level === 'probable');
  const possible = substances.filter(s => s.evidence_level === 'possible');
  const other = substances.filter(s => !['known','probable','possible'].includes(s.evidence_level));

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-2">
        <a href="/health-effects" className="text-sm text-[var(--color-steel)] hover:text-[var(--color-teal)]"
           style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>← All Health Effects</a>
      </div>
      <h1 className="mb-2 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>{effect.name}</h1>
      {effect.description && (
        <p className="mb-6 text-lg text-[var(--color-ink-light)]" style={{ lineHeight: 1.7 }}>{effect.description}</p>
      )}

      <div className="mb-8 rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-5">
        <div className="flex items-center gap-8 flex-wrap">
          <div className="text-center">
            <div className="text-3xl font-bold text-[var(--color-teal)]" style={{ fontFamily: 'var(--font-display)' }}>{substances.length}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-steel)' }}>TOTAL</div>
          </div>
          <div className="flex flex-wrap gap-3">
            {known.length > 0 && <Badge level="known" count={known.length} />}
            {probable.length > 0 && <Badge level="probable" count={probable.length} />}
            {possible.length > 0 && <Badge level="possible" count={possible.length} />}
            {other.length > 0 && <Badge level="inadequate" count={other.length} />}
          </div>
        </div>
      </div>

      {[
        { label: 'Known', items: known, level: 'known' },
        { label: 'Probable', items: probable, level: 'probable' },
        { label: 'Possible', items: possible, level: 'possible' },
        { label: 'Other / Inadequate', items: other, level: 'inadequate' },
      ].filter(g => g.items.length > 0).map(group => (
        <div key={group.label} className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: EVIDENCE_COLORS[group.level] || '#95a5a6' }} />
            {group.label} Evidence
            <span className="ml-1 text-base font-normal text-[var(--color-steel)]">({group.items.length})</span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((s: any) => (
              <a key={s.id} href={`/substances/${nameToSlug(s.name)}`}
                 className="group block rounded-lg border border-[var(--color-gold)]/20 bg-white p-4
                            no-underline transition-all hover:border-[var(--color-teal)]/40 hover:shadow-md">
                <div className="font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal)]"
                     style={{ fontFamily: 'var(--font-display)' }}>{s.name}</div>
                {s.cas_number && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-steel)' }}>CAS {s.cas_number}</div>
                )}
                {s.description && (
                  <p className="mt-1 text-xs text-[var(--color-ink-light)]" style={{ lineHeight: 1.5 }}>
                    {s.description.length > 80 ? s.description.slice(0, 80) + '…' : s.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Badge({ level, count }: { level: string; count: number }) {
  return (
    <span className="rounded-full px-3 py-1.5 text-xs text-white"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', background: EVIDENCE_COLORS[level] || '#95a5a6' }}>
      {level}: {count}
    </span>
  );
}
