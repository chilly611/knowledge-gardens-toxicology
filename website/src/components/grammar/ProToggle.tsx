'use client';

/**
 * ProToggle — the "PRO: OFF / ON" pill in BKG's top-right corner.
 * Grammar primitive.
 *
 * State persists in URL (`?pro=on`) so partner-share links can pre-flip it.
 * No localStorage.
 *
 * When PRO is ON, downstream surfaces show: lanes, raw confidence numbers,
 * primary-source citations, JSON-LD links, advanced filters. When PRO is
 * OFF, surfaces show plain-English (Dreamer mode).
 */
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProToggle() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPro = (searchParams?.get('pro') ?? 'off') === 'on';

  const flip = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (isPro) params.delete('pro');
    else params.set('pro', 'on');
    const qs = params.toString();
    const href = typeof window !== 'undefined' ? window.location.pathname + (qs ? `?${qs}` : '') : '/';
    router.replace(href);
  };

  return (
    <button
      type="button"
      onClick={flip}
      className="rounded-full border px-2.5 py-1 transition-all"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.66rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        background: isPro ? 'var(--tox)' : 'transparent',
        color: isPro ? 'var(--paper)' : 'var(--ink-soft)',
        borderColor: isPro ? 'var(--tox-deep)' : 'var(--paper-line)',
      }}
      aria-pressed={isPro}
      aria-label={`Toggle pro mode (currently ${isPro ? 'on' : 'off'})`}
    >
      pro: {isPro ? 'on' : 'off'}
    </button>
  );
}

/** Read-only helper for child components. SSR-safe. */
export function useIsPro(): boolean {
  if (typeof window === 'undefined') return false;
  const sp = new URLSearchParams(window.location.search);
  return (sp.get('pro') ?? 'off') === 'on';
}
