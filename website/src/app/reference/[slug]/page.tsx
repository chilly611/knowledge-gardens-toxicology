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
        console.error('Failed to load term:', e);
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
            The reference term '{slug}' does not exist.
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
              ← Back to Reference
            </div>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <div className="rail-default py-20">
        {/* Back link */}
        <Link href="/reference">
          <div
            className="mb-16"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              fontWeight: 700,
              color: 'var(--copper-orn-deep)',
              cursor: 'pointer',
            }}
          >
            ← Back to Reference
          </div>
        </Link>

        {/* Eyebrow + breadcrumb */}
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
          Reference / {term.slug}
        </div>

        {/* H1 */}
        <h1
          className="mb-10"
          style={{
            fontFamily: 'var(--font-body)',
            fontStyle: 'normal',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            color: 'var(--ink)',
            lineHeight: 1.2,
            maxWidth: '50rem',
          }}
        >
          {term.name}
        </h1>

        {/* Short definition callout tile */}
        <div
          className="tile mb-16"
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: 'var(--copper-orn-deep)',
            borderTopWidth: '0px',
            maxWidth: '50rem',
          }}
        >
          <p
            className="body-readable"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              color: 'var(--ink)',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}
          >
            {term.short_definition}
          </p>
        </div>

        {/* Deep explanation section */}
        {term.deep_explanation_md && (
          <section className="mb-16">
            <div
              className="body-readable-wide prose prose-sm max-w-none"
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              {markdownToJsx(term.deep_explanation_md)}
            </div>
          </section>
        )}

        {/* For counsel callout */}
        {term.lawyer_angle && (
          <div
            className="tile mb-16"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: 'var(--teal)',
              borderTopWidth: '0px',
              maxWidth: '50rem',
            }}
          >
            <div
              className="mb-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--teal)',
              }}
            >
              For Counsel
            </div>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'italic',
                fontSize: '1.25rem',
                fontWeight: 400,
                color: 'var(--ink)',
                lineHeight: 1.3,
              }}
            >
              Lawyer angle
            </h2>
            <p
              className="body-readable"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              {term.lawyer_angle}
            </p>
          </div>
        )}

        {/* Daubert posture callout */}
        {term.daubert_relevance && (
          <div
            className="tile mb-16"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: 'var(--crimson)',
              borderTopWidth: '0px',
              maxWidth: '50rem',
            }}
          >
            <div
              className="mb-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--crimson)',
              }}
            >
              Daubert Posture
            </div>
            <p
              className="body-readable"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.05rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.7,
              }}
            >
              {term.daubert_relevance}
            </p>
          </div>
        )}

        {/* Citations section */}
        {term.citations.length > 0 && (
          <section className="mb-16">
            <h2
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              Citations
            </h2>
            <ol
              style={{
                listStyleType: 'decimal',
                marginLeft: '2rem',
              }}
            >
              {term.citations.map((cite, i) => (
                <li
                  key={i}
                  className="tile-inner mb-4"
                  style={{
                    marginLeft: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--ink)',
                      marginBottom: '0.5rem',
                      fontStyle: 'italic',
                    }}
                  >
                    {cite.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: 'var(--ink-mute)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {cite.authors && cite.authors.length > 0 && `${cite.authors.join(', ')} `}
                    {cite.year && `(${cite.year})`}
                  </div>
                  {cite.doi && (
                    <a
                      href={`https://doi.org/${cite.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: 'var(--copper-orn-deep)',
                        textDecoration: 'none',
                        marginRight: '1rem',
                      }}
                    >
                      DOI: {cite.doi}
                    </a>
                  )}
                  {cite.url && (
                    <a
                      href={cite.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        color: 'var(--copper-orn-deep)',
                        textDecoration: 'none',
                      }}
                    >
                      Link
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Related terms section */}
        {related.length > 0 && (
          <section>
            <h2
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontStyle: 'normal',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'var(--ink)',
                lineHeight: 1.2,
              }}
            >
              Related Terms
            </h2>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
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
      </div>
    </main>
  );
}

export default function ReferenceTermPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--paper)]" />}>
      <ReferenceTermContent slug={params.slug} />
    </Suspense>
  );
}
