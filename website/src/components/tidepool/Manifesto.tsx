'use client';

import { useStaggeredChildren } from '@/lib/animations';

/**
 * Manifesto — ten imperatives revealed on scroll with stagger.
 * Each line appears one-by-one as the section enters viewport.
 */
const manifesto = [
  'Three sources behind every claim.',
  'Contested claims show both sides — never collapse disagreement.',
  'Confidence is computed from evidence, not declared.',
  'Every quote traces to a DOI or a regulatory document.',
  'Mechanism, regulation, and outcome are first-class — not afterthoughts.',
  'Cross-garden links keep one substance honest across many lenses.',
  'The clinician sees biomarkers; the consumer sees daily-life touchpoints; counsel sees Daubert tables.',
  'Beauty is functional. Engineering frames support science.',
  'Every PDF is filing-grade. Every screen is partner-grade.',
  'Knowledge gardens grow. The schema is alive.',
];

export default function Manifesto() {
  const { ref, indices } = useStaggeredChildren<HTMLDivElement>(manifesto.length, {
    stepMs: 100,
  });

  return (
    <div ref={ref} className="space-y-6">
      {manifesto.map((line, i) => (
        <div
          key={i}
          style={{
            opacity: indices.has(i) ? 1 : 0,
            transform: indices.has(i)
              ? 'translateX(0) translateY(0)'
              : 'translateX(-20px) translateY(10px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <p
            style={{
              fontSize: '1.2rem',
              lineHeight: 1.8,
              fontFamily: 'var(--font-display)',
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
            }}
          >
            {i + 1}. {line}
          </p>
        </div>
      ))}
    </div>
  );
}
