'use client';

import { ReactNode } from 'react';
import CornerBrackets from '@/components/shared/CornerBrackets';

export default function WorkflowCard({
  title,
  eyebrow,
  children,
  accent,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <CornerBrackets
      color={accent || 'var(--copper-orn-deep)'}
      className="p-6 border border-[var(--paper-line)] rounded"
    >
      {eyebrow && (
        <div
          className="font-eyebrow text-xs mb-2"
          style={{ color: accent || 'var(--ink-mute)' }}
        >
          {eyebrow}
        </div>
      )}
      <h2 className="text-2xl italic mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
        {title}
      </h2>
      {children}
    </CornerBrackets>
  );
}
