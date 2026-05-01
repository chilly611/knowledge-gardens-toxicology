'use client';

/**
 * WorkflowCard — BKG's "Code Compliance Lookup q5 / 0 of 7 complete /
 * 75 XP available" card title-block. Used to introduce a workflow.
 *
 * Grammar primitive #8.
 */
import { ReactNode } from 'react';

export default function WorkflowCard({
  title,
  shortId,
  questionsTotal,
  questionsComplete = 0,
  xpAvailable,
  contextLine,
  children,
}: {
  title: string;
  shortId?: string;        // e.g. "q5"
  questionsTotal?: number;
  questionsComplete?: number;
  xpAvailable?: number;
  /** Optional extra-context line, e.g. "Jurisdiction: ibc-2024" */
  contextLine?: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <header className="mb-4">
        <div className="flex items-baseline gap-3">
          <h2
            className="text-[var(--ink)]"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.65rem, 2.8vw, 2.1rem)', fontWeight: 600 }}
          >
            {title}
          </h2>
          {shortId && (
            <span
              className="text-[var(--ink-mute)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
            >
              {shortId}
            </span>
          )}
        </div>
        <div
          className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[var(--ink-mute)]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.06em' }}
        >
          {typeof questionsTotal === 'number' && (
            <span>{questionsComplete} of {questionsTotal} complete</span>
          )}
          {typeof xpAvailable === 'number' && (
            <span>{xpAvailable} XP available</span>
          )}
          {contextLine && <span>{contextLine}</span>}
        </div>
      </header>
      <div>{children}</div>
    </section>
  );
}
