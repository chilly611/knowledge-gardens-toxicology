'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { searchEverything } from '@/lib/queries-tox';
import { SearchResults } from '@/components/search/SearchResults';
import type { SearchResult } from '@/lib/types-tox';

interface SearchPageProps {
  searchParams?: Promise<{ q?: string }>;
}

function SearchPageContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get initial query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    setQuery(initialQuery);
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []);

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

      // Update URL
      const params = new URLSearchParams(window.location.search);
      if (newQuery.trim()) {
        params.set('q', newQuery);
      } else {
        params.delete('q');
      }
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

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

  return (
    <div data-surface="tkg" className="min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-[var(--font-display)] text-4xl italic" style={{ color: 'var(--ink)' }}>
            Search
          </h1>
          <p className="font-[var(--font-mono)] text-sm" style={{ color: 'var(--ink-mute)' }}>
            Search substances, claims, cases, and sources
          </p>
        </div>

        {/* Search input */}
        <div className="mb-12">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search…"
            className="w-full rounded-lg border border-[var(--paper-line)] bg-[var(--paper)] px-4 py-3 font-[var(--font-display)] text-xl italic placeholder-[var(--ink-mute)] outline-none transition-all focus:border-[var(--teal)] focus:shadow-sm"
            style={{ color: 'var(--ink)' }}
            autoFocus
          />
        </div>

        {/* Results */}
        <SearchResults results={results} isLoading={isLoading} query={query} />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div data-surface="tkg" className="min-h-screen" />}>
      <SearchPageContent />
    </Suspense>
  );
}
