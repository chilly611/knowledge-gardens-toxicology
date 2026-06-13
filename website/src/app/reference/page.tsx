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
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <div className="rail-default py-20">
        {/* Header Section */}
        <section className="mb-24 border-b border-[var(--paper-line)] pb-16">
          {/* Eyebrow */}
          <div
            className="mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
            }}
          >
            Reference · {terms.length} Entries · Lawyer Education
          </div>

          {/* H1 */}
          <h1
            className="mb-8 max-w-2xl"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 600,
              color: 'var(--teal-deep)',
              lineHeight: 1.08,
              letterSpacing: '-0.01em',
            }}
          >
            The frameworks behind every claim
          </h1>

          {/* Body paragraph */}
          <p
            className="max-w-2xl body-readable"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
            }}
          >
            Regulatory standards, scientific methodologies, and legal concepts essential for understanding toxicology claims in litigation.
          </p>
        </section>

        {/* Search & Filter Section */}
        <section className="mb-20">
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Search reference terms..."
              value={query}
              onChange={onQueryChange}
              className="w-full px-4 py-3 rounded"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                backgroundColor: 'var(--paper-warm)',
                border: '1px solid var(--paper-line)',
                color: 'var(--ink)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--copper-orn-deep)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--paper-line)';
              }}
            />
            <select
              value={category}
              onChange={onCategoryChange}
              className="w-full px-4 py-3 rounded"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.95rem',
                backgroundColor: 'var(--paper-warm)',
                border: '1px solid var(--paper-line)',
                color: 'var(--ink)',
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink-mute)',
                textAlign: 'center',
              }}
            >
              Loading...
            </p>
          )}

          {!loading && terms.length === 0 && !query && !category && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink-mute)',
                textAlign: 'center',
              }}
            >
              No terms yet. Check back soon.
            </p>
          )}

          {!loading && terms.length === 0 && (query || category) && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink-mute)',
                textAlign: 'center',
              }}
            >
              No matches found.
            </p>
          )}

          {!loading && terms.length > 0 && (
            <div className="tile-grid-3">
              {terms.map((term) => (
                <Link key={term.id} href={`/reference/${term.slug}`}>
                  <div
                    className="tile group transition-all hover:shadow-md hover:border-[var(--copper-orn-deep)]"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Eyebrow */}
                    <div
                      className="mb-4"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        color: 'var(--copper-orn-deep)',
                      }}
                    >
                      {CATEGORIES.find((c) => c.id === term.category)?.label}
                    </div>

                    {/* Title */}
                    <h2
                      className="mb-4"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontStyle: 'normal',
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        color: 'var(--ink)',
                        lineHeight: 1.3,
                      }}
                    >
                      {term.name}
                    </h2>

                    {/* Short definition */}
                    <p
                      className="flex-1 mb-6"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.65,
                        maxWidth: '60ch',
                      }}
                    >
                      {term.short_definition}
                    </p>

                    {/* Read deeper link */}
                    <div
                      className="mt-auto pt-4 border-t border-[var(--paper-line)] group-hover:border-[var(--copper-orn-deep)]"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--copper-orn-deep)',
                        transition: 'color 200ms ease',
                      }}
                    >
                      Read deeper →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ReferencePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <ReferenceListContent />
    </Suspense>
  );
}
