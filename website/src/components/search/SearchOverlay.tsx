'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { searchEverything } from '@/lib/queries-tox';
import { SearchResults } from './SearchResults';
import type { SearchResult } from '@/lib/types-tox';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus trap & close on escape
  useEffect(() => {
    if (!isOpen) return;

    // Focus input when overlay opens
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await searchEverything(q);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer for 250ms debounce
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newQuery);
      }, 250);
    },
    [performSearch]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Handle background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 backdrop-blur-[12px]"
        style={{
          backgroundColor: 'var(--paper-warm)',
          opacity: 0.95,
        }}
        onClick={handleBackgroundClick}
      />

      {/* Overlay container */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16" onClick={handleBackgroundClick}>
        {/* Search panel */}
        <div className="w-full max-w-2xl rounded-lg bg-[var(--paper)] px-6 py-4 shadow-lg">
          {/* Search input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search substances, claims, cases…"
            className="w-full border-b border-[var(--paper-line)] bg-transparent pb-4 font-[var(--font-display)] text-3xl italic placeholder-[var(--ink-mute)] outline-none"
            style={{ color: 'var(--ink)' }}
          />

          {/* Results */}
          <div className="mt-6 max-h-96 overflow-y-auto">
            <SearchResults results={results} isLoading={isLoading} query={query} onResultClick={onClose} />
          </div>
        </div>
      </div>
    </>
  );
}
