'use client';

/**
 * TopFrame — the global header.
 *
 * Rebuilt as a quiet herbarium nav: emblem + wordmark on the left, a small set
 * of real text links, a PRO toggle, and search on the right. The old
 * 7-thumbnail stage strip and the breadcrumb row are gone — the lifecycle
 * lives on /workflow, not crammed into the chrome. Cream paper, copper
 * hairline, no glass blur.
 */
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { StageId } from './stages';
import { SearchOverlay } from '@/components/search/SearchOverlay';

export type BackLink = { href: string; label: string };

const NAV: { href: string; label: string; match: string }[] = [
  { href: '/compound', label: 'Compounds', match: '/compound' },
  { href: '/case', label: 'Cases', match: '/case' },
  { href: '/workflow', label: 'Workflow', match: '/workflow' },
  { href: '/reference', label: 'Reference', match: '/reference' },
];

export default function TopFrame({ backLink }: { backLink?: BackLink; currentStage?: StageId }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || '/';
  const isPro = (searchParams?.get('pro') ?? 'off') === 'on';

  const flipPro = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    if (isPro) params.delete('pro'); else params.set('pro', 'on');
    const qs = params.toString();
    router.replace(pathname + (qs ? `?${qs}` : ''));
  };

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          background: 'rgba(242, 233, 210, 0.97)',
          borderColor: 'var(--paper-line)',
          boxShadow: 'inset 0 -1px 0 0 rgba(184, 115, 51, 0.22)',
        }}
      >
        <div className="rail-wide flex items-center justify-between gap-6 py-3">
          {/* LEFT — emblem + wordmark */}
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" className="group flex items-center gap-3" aria-label="Home — Toxicology Knowledge Garden">
              <Image src="/emblem-caduceus.png" alt="" width={44} height={44} priority style={{ mixBlendMode: 'multiply' }} />
              <span className="flex min-w-0 flex-col leading-none">
                <span
                  className="truncate transition-colors group-hover:text-[var(--copper-orn-deep)]"
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.35rem', color: 'var(--teal-deep)', letterSpacing: '-0.01em', lineHeight: 1.05 }}
                >
                  Toxicology Knowledge Garden
                </span>
                <span
                  className="hidden sm:block"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 3 }}
                >
                  Three sources behind every claim
                </span>
              </span>
            </Link>
            {backLink && (
              <Link href={backLink.href} className="hidden lg:inline transition-colors hover:text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-mute)' }}>
                ‹ {backLink.label}
              </Link>
            )}
          </div>

          {/* RIGHT — nav + pro + search */}
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((n) => {
                const active = pathname.startsWith(n.match);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className="transition-colors hover:text-[var(--teal-deep)]"
                    style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: active ? 600 : 500, color: active ? 'var(--teal-deep)' : 'var(--ink-soft)', borderBottom: active ? '2px solid var(--copper-orn)' : '2px solid transparent', paddingBottom: 2 }}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/vault"
              title="Sign in to the confidential case file"
              className="inline-flex items-center rounded-full px-4 py-2 transition-all hover:-translate-y-px"
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 600, whiteSpace: 'nowrap',
                color: pathname.startsWith('/vault') ? 'var(--paper)' : 'var(--teal-deep)',
                background: pathname.startsWith('/vault') ? 'var(--tox-deep)' : 'transparent',
                border: '1px solid var(--teal-deep)',
              }}
            >
              Sign in
            </Link>
            <span className="hidden h-6 w-px md:inline-block" style={{ background: 'var(--paper-line)' }} />
            <button
              type="button"
              onClick={flipPro}
              aria-pressed={isPro}
              className="flex items-center gap-2 rounded-full border px-3 py-1.5 transition-all"
              title={`Pro mode is ${isPro ? 'on' : 'off'} — depth tooling and raw values`}
              style={{ background: isPro ? 'var(--tox-deep)' : 'transparent', borderColor: isPro ? 'var(--tox-deep)' : 'var(--paper-line)' }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: isPro ? 'var(--paper)' : 'var(--ink-mute)', fontWeight: 600 }}>pro</span>
              <span className="relative inline-block" style={{ width: 34, height: 18, borderRadius: 999, background: isPro ? 'var(--paper)' : 'var(--paper-deep)' }}>
                <span className="absolute" style={{ top: 2, left: isPro ? 18 : 2, width: 14, height: 14, borderRadius: 999, background: isPro ? 'var(--tox-deep)' : 'var(--ink-mute)', transition: 'left 180ms ease' }} />
              </span>
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              className="flex items-center gap-2 rounded-full border px-4 py-2 transition-all hover:-translate-y-px"
              style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-soft)', background: 'var(--paper-raised)', borderColor: 'var(--paper-line)' }}
            >
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Search</span>
              <span className="hidden rounded border px-1.5 py-0.5 sm:inline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', borderColor: 'var(--paper-line)', color: 'var(--ink-mute)' }}>⌘K</span>
            </button>
          </div>
        </div>
      </header>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
