'use client';

import { useEffect, useRef, useState } from 'react';
import type { SearchResult } from '@/lib/types-tox';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  onResultClick?: (result: SearchResult) => void;
}

export function SearchResults({
  results,
  isLoading,
  query,
  onResultClick,
}: SearchResultsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const resultRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Group results by type
  const groupedResults = {
    substance: results.filter((r) => r.type === 'substance'),
    claim: results.filter((r) => r.type === 'claim'),
    source: results.filter((r) => r.type === 'source'),
    case: results.filter((r) => r.type === 'case'),
  };

  const hasResults = Object.values(groupedResults).some((group) => group.length > 0);
  const flatResults = Object.values(groupedResults).flat();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const selectedResult = flatResults[selectedIndex];
        onResultClick?.(selectedResult);
        resultRefs.current[selectedIndex]?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flatResults, selectedIndex, onResultClick]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultRefs.current[selectedIndex]) {
      resultRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (isLoading) {
    return (
      <div className="py-8 text-center font-[var(--font-mono)] text-sm" style={{ color: 'var(--ink-mute)' }}>
        searching…
      </div>
    );
  }

  if (!query.trim()) {
    // Empty state with trending examples
    return (
      <div className="space-y-8 py-8">
        <div>
          <div
            className="mb-3 font-[var(--font-mono)] text-xs uppercase tracking-widest"
            style={{ color: 'var(--ink-mute)' }}
          >
            Try
          </div>
          <div className="space-y-2">
            {['Roundup', 'Marfella', 'Erickson'].map((example) => (
              <div
                key={example}
                className="font-[var(--font-display)] text-lg italic"
                style={{ color: 'var(--ink)' }}
              >
                · {example}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            className="mb-3 font-[var(--font-mono)] text-xs uppercase tracking-widest"
            style={{ color: 'var(--ink-mute)' }}
          >
            Trending
          </div>
          <div className="flex gap-4">
            {[
              { name: 'Glyphosate', slug: 'glyphosate' },
              { name: 'Microplastics', slug: 'microplastics' },
              { name: 'PCBs', slug: 'pcbs' },
            ].map((substance) => (
              <a
                key={substance.slug}
                href={`/compound/${substance.slug}`}
                className="font-[var(--font-display)] italic transition-colors hover:text-[var(--teal)]"
              >
                {substance.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasResults) {
    return (
      <div className="py-8 text-center font-[var(--font-display)] italic" style={{ color: 'var(--ink-mute)' }}>
        No results for "{query}"
      </div>
    );
  }

  let resultCounter = 0;

  return (
    <div className="space-y-6 py-4">
      {Object.entries(groupedResults).map(([typeKey, typeResults]) => {
        if (typeResults.length === 0) return null;

        const typeLabel =
          typeKey === 'substance'
            ? 'SUBSTANCES'
            : typeKey === 'claim'
              ? 'CLAIMS'
              : typeKey === 'source'
                ? 'SOURCES'
                : 'CASES';

        return (
          <div key={typeKey}>
            <div
              className="mb-3 font-[var(--font-mono)] text-xs uppercase tracking-widest"
              style={{ color: 'var(--ink-mute)' }}
            >
              {typeLabel}
            </div>
            <div className="space-y-2">
              {typeResults.map((result) => {
                const currentIndex = resultCounter;
                resultCounter++;
                const isSelected = selectedIndex === currentIndex;

                return (
                  <a
                    key={result.id}
                    ref={(el) => {
                      resultRefs.current[currentIndex] = el;
                    }}
                    href={result.link}
                    onClick={() => onResultClick?.(result)}
                    className="group block rounded px-3 py-2 transition-colors"
                    style={{
                      backgroundColor: isSelected ? 'var(--paper-deep)' : 'transparent',
                    }}
                  >
                    {/* Title */}
                    <div
                      className="font-[var(--font-display)] text-base italic group-hover:text-[var(--teal)]"
                      style={{ color: isSelected ? 'var(--teal)' : 'var(--ink)' }}
                    >
                      {result.title}
                    </div>

                    {/* Snippet */}
                    {result.snippet && (
                      <div
                        className="font-[var(--font-display)] text-sm leading-tight line-clamp-2"
                        style={{ color: 'var(--ink-mute)' }}
                      >
                        {result.snippet}
                      </div>
                    )}

                    {/* Link target */}
                    <div className="font-[var(--font-mono)] text-xs" style={{ color: 'var(--ink-mute)' }}>
                      {result.link}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
