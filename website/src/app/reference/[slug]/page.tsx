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
      <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (notFound || !term) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-serif mb-4">Term not found</h1>
          <p className="text-gray-700 mb-6">
            The reference term '{slug}' does not exist.
          </p>
          <Link href="/reference">
            <a className="text-blue-600 hover:underline">← Back to Reference</a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/reference">
          <a className="text-sm" style={{ color: 'var(--copper-orn-deep)' }}>
            ← Back to Reference
          </a>
        </Link>

        <div
          className="text-xs font-mono uppercase tracking-wider mt-4 mb-2"
          style={{ color: 'var(--copper-orn-deep)' }}
        >
          {CATEGORIES[term.category] || term.category}
        </div>

        <h1
          className="text-4xl font-serif mb-6"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          {term.name}
        </h1>

        <div className="bg-white border-l-4 p-6 mb-8" style={{ borderLeftColor: 'var(--copper-orn-deep)' }}>
          <p className="text-base text-gray-800">{term.short_definition}</p>
        </div>

        <div className="prose prose-sm max-w-none mb-8">
          {markdownToJsx(term.deep_explanation_md)}
        </div>

        {term.lawyer_angle && (
          <div className="bg-blue-50 border border-blue-200 p-6 mb-8 rounded">
            <h2 className="font-serif text-lg mb-3">For counsel</h2>
            <p className="text-gray-800">{term.lawyer_angle}</p>
          </div>
        )}

        {term.daubert_relevance && (
          <div className="bg-amber-50 border border-amber-200 p-6 mb-8 rounded">
            <h2 className="font-serif text-lg mb-3">Daubert posture</h2>
            <p className="text-gray-800">{term.daubert_relevance}</p>
          </div>
        )}

        {term.citations.length > 0 && (
          <div className="mb-8">
            <h2 className="font-serif text-lg mb-4">Citations</h2>
            <ol className="space-y-3 ml-6 list-decimal">
              {term.citations.map((cite, i) => (
                <li key={i} className="text-sm text-gray-800">
                  <span className="font-semibold">{cite.title}</span>
                  {cite.authors && cite.authors.length > 0 && (
                    <span className="text-gray-700">
                      {' '}
                      by {cite.authors.join(', ')}
                    </span>
                  )}
                  {cite.year && <span className="text-gray-700"> ({cite.year})</span>}
                  {cite.doi && (
                    <>
                      {' '}
                      <a
                        href={`https://doi.org/${cite.doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        DOI: {cite.doi}
                      </a>
                    </>
                  )}
                  {cite.url && (
                    <>
                      {' '}
                      <a
                        href={cite.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Link
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h2 className="font-serif text-lg mb-4">Related terms</h2>
            <div className="flex flex-wrap gap-3">
              {related.map((t) => (
                <Link key={t.id} href={`/reference/${t.slug}`}>
                  <a
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm hover:bg-gray-300 transition-colors"
                  >
                    {t.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReferenceTermPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>Loading...</div>}>
      <ReferenceTermContent slug={params.slug} />
    </Suspense>
  );
}
