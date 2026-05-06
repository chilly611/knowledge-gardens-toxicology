'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { listReferenceTerms, searchReferenceTerms } from '@/lib/queries-tox';
import type { ReferenceTerm } from '@/lib/types-tox';

const CATEGORIES = [
  { id: 'regulatory_body', label: 'Regulatory Bodies' },
  { id: 'classification', label: 'Classification Systems' },
  { id: 'legal_standard', label: 'Legal Standards' },
  { id: 'methodology', label: 'Methodologies' },
  { id: 'concept', label: 'Concepts' },
  { id: 'metric', label: 'Metrics' },
];

function ReferenceListContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') ?? '';
  const initialCategory = searchParams?.get('category') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [terms, setTerms] = useState<ReferenceTerm[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const handleSearch = async (newQuery: string, newCategory: string) => {
      setLoading(true);
      try {
        if (newQuery) {
          const results = await searchReferenceTerms(newQuery);
          const filtered = newCategory
            ? results.filter((t) => t.category === newCategory)
            : results;
          setTerms(filtered);
        } else {
          const results = await listReferenceTerms(newCategory || undefined);
          setTerms(results);
        }
      } catch (e) {
        console.error('Search failed:', e);
        setTerms([]);
      } finally {
        setLoading(false);
      }
    };

    if (!initialized) {
      handleSearch(initialQuery, initialCategory);
      setInitialized(true);
    }
  }, [initialQuery, initialCategory, initialized]);

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery) {
      searchReferenceTerms(newQuery).then((results) => {
        const filtered = category
          ? results.filter((t) => t.category === category)
          : results;
        setTerms(filtered);
      });
    } else {
      listReferenceTerms(category || undefined).then(setTerms);
    }
  };

  const onCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    if (query) {
      searchReferenceTerms(query).then((results) => {
        const filtered = newCategory
          ? results.filter((t) => t.category === newCategory)
          : results;
        setTerms(filtered);
      });
    } else {
      listReferenceTerms(newCategory || undefined).then(setTerms);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
          Reference
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Regulatory frameworks, scientific standards, and legal concepts essential for counsel.
        </p>

        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search terms..."
            value={query}
            onChange={onQueryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            style={{ backgroundColor: 'white' }}
          />
          <select
            value={category}
            onChange={onCategoryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            style={{ backgroundColor: 'white' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {loading && <p className="text-center text-gray-500">Loading...</p>}

        {!loading && terms.length === 0 && !query && !category && (
          <p className="text-center text-gray-500">No terms yet. Check back soon.</p>
        )}

        {!loading && terms.length === 0 && (query || category) && (
          <p className="text-center text-gray-500">No matches found.</p>
        )}

        {!loading && terms.length > 0 && (
          <div className="grid gap-6">
            {terms.map((term) => (
              <Link key={term.id} href={`/reference/${term.slug}`}>
                <div className="block p-6 border border-gray-200 rounded hover:shadow-lg transition-shadow cursor-pointer" style={{ backgroundColor: 'white' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div
                        className="text-xs font-mono uppercase tracking-wider mb-2"
                        style={{ color: 'var(--copper-orn-deep)' }}
                      >
                        {CATEGORIES.find((c) => c.id === term.category)?.label}
                      </div>
                      <h2 className="text-2xl font-serif mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                        {term.name}
                      </h2>
                      <p className="text-gray-700 mb-4">{term.short_definition}</p>
                    </div>
                    <div className="text-sm" style={{ color: 'var(--copper-orn-deep)' }}>
                      →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReferencePage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>Loading...</div>}>
      <ReferenceListContent />
    </Suspense>
  );
}
