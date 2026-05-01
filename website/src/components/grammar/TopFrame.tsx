'use client';

/**
 * TopFrame — the chrome that lives at the top of every page.
 *
 * Rebuilt to be BIGGER, BOLDER, AND SPACED OUT (per Chilly's direction):
 *   - Caduceus emblem ~52px
 *   - "toxicology knowledge garden" italic Cormorant at ~1.45rem
 *   - Seven stage buttons with inline-SVG icons + text label
 *   - PRO slide toggle (not just a pill)
 *   - Search button with clear visual presence + ⌘K hint
 *
 * The frame sits inside `.rail-wide` so it stays centered on ultra-wide
 * displays. Background is paper-warm with a 1px copper hairline at the
 * bottom — feels like the top of a herbarium specimen plate.
 */
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { STAGES, type StageId } from './stages';
import StageIcon from './StageIcon';
import LocationCrumb from './LocationCrumb';
import { SearchOverlay } from '@/components/search/SearchOverlay';

export type BackLink = { href: string; label: string };

export default function TopFrame({
  backLink,
  currentStage,
}: {
  backLink?: BackLink;
  currentStage?: StageId;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isPro = (searchParams?.get('pro') ?? 'off') === 'on';

  const flipPro = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (isPro) params.delete('pro');
    else params.set('pro', 'on');
    const qs = params.toString();
    router.replace(pathname + (qs ? `?${qs}` : ''));
  };

  const onStageClick = (id: StageId) => {
    const lane = searchParams?.get('lane');
    const url = `/workflow/${id}${lane ? `?lane=${lane}` : ''}`;
    router.push(url);
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: 'rgba(245, 240, 232, 0.94)',
          borderColor: 'var(--paper-line)',
          backdropFilter: 'blur(14px)',
          // Copper hairline accent at the bottom
          boxShadow: 'inset 0 -1px 0 0 rgba(184, 115, 51, 0.18)',
        }}
      >
        <div className="rail-wide flex items-center justify-between gap-6 py-4">
          {/* LEFT: emblem + name + optional back-link */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3.5" aria-label="Home — Toxicology Knowledge Garden">
              <Image
                src="/emblem-caduceus.png"
                alt=""
                width={120}
                height={120}
                priority
                style={{
                  mixBlendMode: 'multiply',
                  filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.12))',
                }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="transition-colors group-hover:text-[var(--tox-deep)]"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontStyle: 'normal',
                    fontSize: '2.1rem',
                    fontWeight: 800,
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.0,
                  }}
                >
                  Toxicology Knowledge Garden
                </span>
                <span
                  className="mt-2"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-mute)',
                  }}
                >
                  tkg · 2026 · three sources behind every claim
                </span>
              </div>
            </Link>
            {backLink && (
              <Link
                href={backLink.href}
                className="ml-3 transition-colors hover:text-[var(--ink)]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  color: 'var(--ink-mute)',
                }}
              >
                ‹ {backLink.label}
              </Link>
            )}
          </div>

          {/* RIGHT: stage buttons (xl+) + pro toggle + search */}
          <div className="flex items-center gap-2">
            {/* Stage buttons — visible on xl, dropdown-style on smaller */}
            <nav className="hidden items-center gap-1 xl:flex">
              {STAGES.map((s) => {
                const active = currentStage === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onStageClick(s.id)}
                    className="group flex flex-col items-center gap-2 px-3 pt-2 pb-3 transition-all hover:-translate-y-0.5"
                    title={`${s.number}. ${s.label} — ${s.caption}`}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.92rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--tox-deep)' : 'var(--ink-soft)',
                      background: 'transparent',
                      borderRadius: 12,
                      borderBottom: active ? '2px solid var(--tox-deep)' : '2px solid transparent',
                    }}
                  >
                    <span className="flex h-[72px] w-[72px] items-center justify-center" style={{ background: 'transparent' }}>
                      <StageIcon
                        id={s.id}
                        size={72}
                        color={active ? 'var(--tox-deep)' : 'var(--ink-soft)'}
                        copper={active ? 'var(--peach-deep)' : 'var(--copper-orn-deep)'}
                      />
                    </span>
                    <span style={{ letterSpacing: '0.01em' }}>{s.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Compact stages popover trigger on smaller screens */}
            <button
              type="button"
              onClick={() => onStageClick('identify')}
              className="rounded-full border px-3.5 py-2 xl:hidden"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.88rem',
                color: 'var(--ink-soft)',
                background: 'var(--paper-warm)',
                borderColor: 'var(--paper-line)',
              }}
            >
              7 stages →
            </button>

            <span className="mx-1 hidden h-6 w-px xl:inline-block" style={{ background: 'var(--paper-line)' }} />

            {/* PRO slide toggle (2× sized) */}
            <button
              type="button"
              onClick={flipPro}
              aria-pressed={isPro}
              className="group flex items-center gap-3 rounded-full border px-4 py-3 transition-all"
              title={`Pro mode is ${isPro ? 'on' : 'off'} — toggle for depth tooling`}
              style={{
                background: isPro ? 'var(--tox-deep)' : 'var(--paper-warm)',
                borderColor: isPro ? 'var(--tox-deep)' : 'var(--paper-line)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: isPro ? 'var(--paper)' : 'var(--ink-mute)',
                  fontWeight: 600,
                }}
              >
                pro
              </span>
              <span
                className="relative inline-block"
                style={{
                  width: 48,
                  height: 26,
                  borderRadius: 999,
                  background: isPro ? 'var(--paper)' : 'var(--paper-deep)',
                  border: `1px solid ${isPro ? 'var(--paper)' : 'var(--paper-line)'}`,
                  transition: 'background 200ms ease',
                }}
              >
                <span
                  className="absolute"
                  style={{
                    top: 2,
                    left: isPro ? 23 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: 999,
                    background: isPro ? 'var(--tox-deep)' : 'var(--ink-mute)',
                    transition: 'left 200ms ease, background 200ms ease',
                  }}
                />
              </span>
            </button>

            {/* Search (2× sized) */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="flex items-center gap-3 rounded-full border px-5 py-3 transition-all hover:-translate-y-0.5"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: 'var(--ink-soft)',
                background: 'var(--paper-warm)',
                borderColor: 'var(--paper-line)',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="hidden md:inline">Search</span>
              <span
                className="hidden rounded border px-2 py-0.5 md:inline"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  borderColor: 'var(--paper-line)',
                  color: 'var(--ink-mute)',
                }}
              >
                ⌘K
              </span>
            </button>
          </div>
        </div>

        {/* Global location breadcrumb — "where am I" indicator */}
        <div
          className="rail-wide flex items-center justify-between gap-4 py-2"
          style={{ borderTop: '1px dashed var(--paper-line)' }}
        >
          <LocationCrumb />
        </div>

        {/* Mobile/tablet stage rail */}
        <div className="border-t xl:hidden" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper-warm)' }}>
          <div className="overflow-x-auto">
            <div className="flex items-center gap-1.5 px-4 py-2 sm:px-6">
              {STAGES.map((s) => {
                const active = currentStage === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onStageClick(s.id)}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.84rem',
                      color: active ? 'var(--paper)' : 'var(--ink-soft)',
                      background: active ? 'var(--tox-deep)' : 'transparent',
                      borderColor: active ? 'var(--tox-deep)' : 'var(--paper-line)',
                      fontWeight: active ? 600 : 500,
                    }}
                  >
                    <StageIcon
                      id={s.id}
                      size={14}
                      color={active ? 'var(--paper)' : 'var(--ink-soft)'}
                      copper={active ? 'var(--peach)' : 'var(--copper-orn-deep)'}
                    />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
