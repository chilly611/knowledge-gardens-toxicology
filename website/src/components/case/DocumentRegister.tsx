'use client';

import { useMemo } from 'react';
import type { CaseDocument } from '@/lib/types-tox';
import { useStaggeredChildren } from '@/lib/animations';
import { tokens } from '@/styles/tokens';

function docTypeBadgeColor(docType: string): string {
  if (
    docType.toUpperCase().includes('COMPLAINT') ||
    docType.toUpperCase().includes('MOTION') ||
    docType.toUpperCase().includes('RESPONSE')
  ) {
    return tokens.crimson;
  }
  if (docType.toUpperCase().includes('EXPERT')) {
    return tokens.peachDeep;
  }
  if (docType.toUpperCase().includes('AMICUS')) {
    return tokens.peachDeep;
  }
  return tokens.inkMute;
}

export default function DocumentRegister({ documents }: { documents: CaseDocument[] }) {
  // Sort by filed_at ascending
  const sorted = useMemo(
    () =>
      [...documents].sort((a, b) => {
        const dateA = a.filed_at ? new Date(a.filed_at).getTime() : 0;
        const dateB = b.filed_at ? new Date(b.filed_at).getTime() : 0;
        return dateA - dateB;
      }),
    [documents]
  );

  const { ref, indices } = useStaggeredChildren<HTMLDivElement>(sorted.length, { stepMs: 50 });

  return (
    <div ref={ref} className="space-y-1">
      {sorted.map((doc, idx) => {
        const isRevealed = indices.has(idx);
        const dateStr = doc.filed_at
          ? new Date(doc.filed_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : 'N/A';

        return (
          <div
            key={doc.id}
            className="grid grid-cols-12 gap-4 border-b border-[var(--paper-line)] py-4 transition-opacity duration-500"
            style={{ opacity: isRevealed ? 1 : 0.3 }}
          >
            {/* Date in Space Mono */}
            <div className="col-span-2 font-mono text-sm font-semibold text-[var(--ink-mute)]">
              {dateStr}
            </div>

            {/* Document title in italic Cormorant */}
            <div className="col-span-7 italic text-[var(--ink)]">
              {doc.url ? (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline transition-colors hover:text-[var(--teal)]"
                >
                  {doc.title}
                </a>
              ) : (
                <span>{doc.title}</span>
              )}
            </div>

            {/* Doc type badge */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              <span
                className="inline-block rounded px-2 py-1 font-mono text-xs font-semibold uppercase text-[var(--paper)]"
                style={{ backgroundColor: docTypeBadgeColor(doc.doc_type) }}
              >
                {doc.doc_type}
              </span>
              {doc.url && (
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--teal)] no-underline transition-colors hover:text-[var(--teal-deep)]"
                  aria-label="Open document"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4" />
                    <path d="M14 4h6v6" />
                    <path d="M14 4l6 6" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
