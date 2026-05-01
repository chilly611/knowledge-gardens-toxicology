'use client';

/**
 * Lanes — BKG's TRADE / LANE segmented filter pills. For TKG, the primary
 * filter is the audience LANE (Consumer / Clinician / Counsel / Hygienist /
 * Inspector) and the secondary axis is WORKFLOW (the four Stage-01 workflows).
 *
 * Grammar primitive #7. Persists selection in URL (`?lane=...`).
 */
import { useRouter, useSearchParams } from 'next/navigation';
import { LANES, type LaneId } from './stages';

export default function Lanes({
  /** Which lanes to expose. Default = all. */
  available = LANES.map((l) => l.id),
  className = '',
}: {
  available?: LaneId[];
  className?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams?.get('lane') as LaneId | null) ?? 'all';

  const setLane = (id: LaneId) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (id === 'all') params.delete('lane');
    else params.set('lane', id);
    const qs = params.toString();
    const href = typeof window !== 'undefined' ? window.location.pathname + (qs ? `?${qs}` : '') : '/';
    router.replace(href);
  };

  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div
          className="mb-2 text-[var(--ink-soft)]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}
        >
          lane
        </div>
        <div className="flex flex-wrap gap-3">
          {LANES.filter((l) => available.includes(l.id)).map((l) => {
            const active = current === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLane(l.id)}
                className="rounded-full border px-5 py-2.5 transition-all"
                title={l.caption}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  background: active ? 'var(--tox-deep)' : 'var(--paper-warm)',
                  color:      active ? 'var(--paper)'     : 'var(--ink-soft)',
                  borderColor:active ? 'var(--tox-deep)'  : 'var(--paper-line)',
                }}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function useCurrentLane(): LaneId {
  if (typeof window === 'undefined') return 'all';
  const sp = new URLSearchParams(window.location.search);
  return ((sp.get('lane') as LaneId) ?? 'all');
}
