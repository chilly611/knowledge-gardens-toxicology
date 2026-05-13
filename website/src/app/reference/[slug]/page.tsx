'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { getReferenceTerm, listReferenceTerms } from '@/lib/queries-tox';
import { markdownToJsx } from '@/lib/markdown-to-jsx';
import type { ReferenceTerm } from '@/lib/types-tox';

const CATEGORIES: Record<string, string> = {
  regulatory_body: 'Regulatory Body',
  classification: 'Classification System',
  legal_standard: 'Legal Standard',
  methodology: 'Methodology',
  concept: 'Concept',
  metric: 'Metric',
};

function ReferenceTermContent({ slug }: { slug: string }) {
  const [term, setTerm] = useState<ReferenceTerm | null>(null);
  const [related, setRelated] = useState<ReferenceTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReferenceTerm(slug);
        if (!data) {
          console.error(`Reference term not found: ${slug}`);
          setNotFound(true);
          return;
        }
        setTerm(data);

        if (data.related_terms.length > 0) {
          const allTerms = await listReferenceTerms();
          const relatedData = allTerms.filter((t) =>
            data.related_terms.includes(t.slug)
          );
          setRelated(relatedData);
        }
      } catch (e) {
        console.error(`Failed to load reference term "${slug}":`, e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
        <div className="rail-default py-20">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--ink-mute)',
              textAlign: 'center',
            }}
          >
            Loading...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !term) {
    return (
      <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
        <div className="rail-default py-20">
          <h1
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--ink)',
              marginBottom: '1.5rem',
            }}
          >
            Term not found
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--ink-soft)',
              marginBottom: '2rem',
            }}
          >
            We couldn&apos;t load the reference term: <code>{slug}</code>
          </p>
          <Link href="/reference">
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: 'var(--copper-orn-deep)',
                cursor: 'pointer',
              }}
            >
              ← Back to reference index
            </div>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <div className="rail-default py-12">
        <Link href="/reference">
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--copper-orn-deep)',
              cursor: 'pointer',
            }}
          >
            ← Back to reference index
          </div>
        </Link>

        <article style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '2.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
                marginBottom: '0.5rem',
              }}
            >
              {term.name}
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--ink-soft)',
                fontStyle: 'italic',
              }}
            >
              {CATEGORIES[term.category] || term.category}
            </p>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--ink)',
              fontSize: '1.05rem',
              lineHeight: 1.7,
              marginBottom: '3rem',
              maxWidth: '65ch',
            }}
          >
            {term.short_definition}
          </div>

          {term.deep_explanation_md && (
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '1rem',
                }}
              >
                Deep Explanation
              </h2>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--ink)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  maxWidth: '65ch',
                }}
              >
                {markdownToJsx(term.deep_explanation_md)}
              </div>
            </section>
          )}

          {term.lawyer_angle && (
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '1rem',
                }}
              >
                Lawyer&rsquo;s Angle
              </h2>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--ink)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  maxWidth: '65ch',
                  paddingLeft: '1rem',
                  borderLeftWidth: '2px',
                  borderLeftColor: 'var(--copper-orn-light)',
                }}
              >
                {term.lawyer_angle}
              </div>
            </section>
          )}

          {term.daubert_relevance && (
            <section style={{ marginBottom: '3rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '1rem',
                }}
              >
                Daubert Relevance
              </h2>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--ink)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  maxWidth: '65ch',
                }}
              >
                {term.daubert_relevance}
              </div>
            </section>
          )}

          {term.citations && term.citations.length > 0 && (
            <section>
              <h2
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '1rem',
                }}
              >
                Citations
              </h2>
              <ul
                style={{
                  listStyleType: 'none',
                  paddingLeft: 0,
                  maxWidth: '65ch',
                }}
              >
                {term.citations.map((cit, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--ink)',
                      marginBottom: '1.5rem',
                      paddingLeft: '1.5rem',
                      position: 'relative',
                      fontSize: '0.95rem',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--paper-line)',
                      }}
                    >
                      •
                    </span>
                    <div style={{ fontWeight: 700 }}>{cit.title}</div>
                    {cit.authors && (
                      <div style={{ color: 'var(--ink-soft)' }}>
                        {cit.authors.join(', ')}
                      </div>
                    )}
                    <div style={{ color: 'var(--ink-soft)' }}>
                      {cit.year && <span>{cit.year}</span>}
                      {cit.doi && (
                        <span>
                          {cit.year && ' • '}DOI: {cit.doi}
                        </span>
                      )}
                    </div>
                    {cit.url && (
                      <div>
                        <a
                          href={cit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: 'var(--copper-orn-deep)',
                            textDecoration: 'underline',
                          }}
                        >
                          Read online
                        </a>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {related.length > 0 && (
            <section style={{ marginTop: '3rem' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: '1rem',
                }}
              >
                Related Terms
              </h2>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                {related.map((t) => (
                  <Link key={t.id} href={`/reference/${t.slug}`}>
                    <div
                      style={{
                        paddingLeft: '1rem',
                        paddingRight: '1rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        backgroundColor: 'var(--paper-warm)',
                        borderRadius: '1rem',
                        fontSize: '0.95rem',
                        fontFamily: 'var(--font-body)',
                        color: 'var(--ink-soft)',
                        border: '1px solid var(--paper-line)',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--paper)';
                        e.currentTarget.style.borderColor = 'var(--copper-orn-deep)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--paper-warm)';
                        e.currentTarget.style.borderColor = 'var(--paper-line)';
                      }}
                    >
                      {t.name}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}

export default async function ReferenceTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <ReferenceTermContent slug={resolvedParams.slug} />
    </Suspense>
  );
}
