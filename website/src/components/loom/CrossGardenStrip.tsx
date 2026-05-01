'use client';

/**
 * CrossGardenStrip — placeholder horizontal strip showing 4 garden badges.
 * E2 will enrich this with actual cross-garden link data later.
 * For now: static display with TKG, HKG, NatureMark, BKG, OKG labels.
 */

const GARDENS = [
  { id: 'tkg', label: 'TKG', color: 'var(--teal)' },
  { id: 'hkg', label: 'HKG', color: 'var(--indigo)' },
  { id: 'naturemark', label: 'NatureMark', color: 'var(--peach)' },
  { id: 'bkg', label: 'BKG', color: 'var(--crimson)' },
  { id: 'okg', label: 'OKG', color: 'var(--copper-orn)' },
];

export default function CrossGardenStrip() {
  return (
    <div className="flex flex-wrap gap-3">
      {GARDENS.map((garden) => (
        <div
          key={garden.id}
          className="inline-flex items-center gap-2 rounded border-2 px-4 py-2"
          style={{
            borderColor: garden.color,
            backgroundColor: 'var(--paper-warm)',
          }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: garden.color }}
            aria-hidden
          />
          <span
            className="font-data text-xs font-semibold uppercase tracking-[0.08em]"
            style={{ color: garden.color }}
          >
            {garden.label}
          </span>
        </div>
      ))}
    </div>
  );
}
