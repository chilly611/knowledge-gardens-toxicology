'use client';

/**
 * Global header — paper-warm slim bar.
 * Reference: design-references/READ_FIRST.md.
 *
 * Left:  small caduceus + "Toxicology Knowledge Garden" italic Cormorant + TKG Space-Mono eyebrow
 * Right: minimal nav (Loom · Tidepool · Cases · Search), Cormorant body
 *
 * Search trigger opens the overlay (existing SearchOverlay component).
 */
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SearchOverlay } from '@/components/search/SearchOverlay';

export function HeaderWithSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-[var(--paper-line)]"
        style={{ background: 'rgba(245, 241, 232, 0.9)', backdropFilter: 'blur(10px)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="Home — Toxicology Knowledge Garden">
            <div className="flex-shrink-0">
              <Image
                src="/emblem-caduceus.png"
                alt=""
                width={36}
                height={36}
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>
            <div className="leading-tight">
              <div
                className="text-[var(--ink)] transition-colors group-hover:text-[var(--teal-deep)]"
                style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 500 }}
              >
                Toxicology Knowledge Garden
              </div>
              <div
                className="text-[var(--ink-mute)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}
              >
                tkg · 2026
              </div>
            </div>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-3">
            <NavLink href="/" label="Loom" />
            <NavLink href="/welcome" label="Tidepool" />
            <NavLink href="/case/sky-valley" label="Cases" />
            <NavLink href="/demo" label="Demo" />
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="ml-1 flex items-center gap-2 rounded-full border border-[var(--paper-line)] bg-[var(--paper-warm)] px-3.5 py-1.5 text-[var(--ink-soft)] transition-all hover:border-[var(--ink-mute)] hover:text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem' }}
              aria-label="Open search"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9.5 9.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <span className="hidden sm:inline">Search</span>
              <span
                className="hidden rounded border border-[var(--paper-line)] px-1.5 py-0 text-[var(--ink-mute)] sm:inline"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem' }}
              >
                ⌘K
              </span>
            </button>
          </nav>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded px-2 py-1 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]"
      style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem' }}
    >
      {label}
    </Link>
  );
}
