'use client';

import { useMemo } from 'react';
import type { CaseEvent, CaseDocument } from '@/lib/types-tox';
import { useStaggeredChildren } from '@/lib/animations';
import { tokens } from '@/styles/tokens';

export default function CaseTimeline({
  events,
  documents,
}: {
  events: CaseEvent[];
  documents: CaseDocument[];
}) {
  // Sort by event_date ascending
  const sorted = useMemo(
    () =>
      [...events].sort((a, b) => {
        const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
        const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
        return dateA - dateB;
      }),
    [events]
  );

  // Create a map of document IDs to documents for quick lookup
  const docMap = useMemo(
    () => new Map(documents.map((d) => [d.id, d])),
    [documents]
  );

  const { ref, indices } = useStaggeredChildren<HTMLDivElement>(sorted.length, { stepMs: 80 });

  return (
    <div ref={ref} className="relative space-y-8">
      {/* Vertical timeline line */}
      <div
        className="absolute left-6 top-0 bottom-0 w-px bg-[var(--paper-line)]"
        aria-hidden
      />

      {sorted.map((event, idx) => {
        const isRevealed = indices.has(idx);
        const dateStr = event.event_date
          ? new Date(event.event_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            })
          : 'N/A';

        const linkedDoc = event.document_id ? docMap.get(event.document_id) : null;

        return (
          <div
            key={event.id}
            id={`event-${event.id}`}
            className="relative pl-20 transition-opacity duration-500 scroll-mt-24"
            style={{ opacity: isRevealed ? 1 : 0.3 }}
          >
            {/* Timeline dot */}
            <div
              className="absolute -left-2.5 top-1 h-5 w-5 rounded-full border-2 border-[var(--paper)] bg-[var(--crimson)]"
              aria-hidden
            />

            {/* Date in Space Mono */}
            <div className="font-mono text-sm font-semibold text-[var(--ink-mute)]">
              {dateStr}
            </div>

            {/* Event type badge */}
            <div className="mt-1 inline-block rounded px-2 py-1 font-mono text-xs font-semibold uppercase text-[var(--paper)]" style={{ backgroundColor: tokens.indigo }}>
              {event.event_type}
            </div>

            {/* Description in Cormorant */}
            <p className="mt-2 italic text-[var(--ink)]">
              {event.description}
            </p>

            {/* Linked document */}
            {linkedDoc && (
              <div className="mt-3 rounded border-l-2 border-[var(--teal)] bg-[var(--paper-warm)] pl-3 text-sm">
                <p className="text-[var(--ink-soft)]">
                  <span className="font-semibold">Document: </span>
                  {linkedDoc.source_url ? (
                    <a
                      href={linkedDoc.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="italic text-[var(--teal)] no-underline transition-colors hover:text-[var(--teal-deep)]"
                    >
                      {linkedDoc.title}
                    </a>
                  ) : (
                    <span className="italic">{linkedDoc.title}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
