'use client';

import { useEffect } from 'react';

interface SearchBarProps {
  onOpenOverlay?: () => void;
}

export function SearchBar({ onOpenOverlay }: SearchBarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd-K (Mac) or Ctrl-K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenOverlay?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenOverlay]);

  return (
    <button
      onClick={onOpenOverlay}
      className="group relative hidden items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-cream)] px-4 py-2 text-sm transition-all hover:border-[var(--color-teal)] hover:shadow-sm md:flex"
      style={{
        color: 'var(--color-steel)',
      }}
    >
      {/* Magnifying glass icon */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>

      {/* Placeholder text */}
      <span className="font-[var(--font-mono)] text-xs tracking-wide text-[var(--color-steel)]">
        Search substances, claims, cases —{' '}
        <span className="group-hover:text-[var(--color-teal)]">⌘K</span>
      </span>
    </button>
  );
}
