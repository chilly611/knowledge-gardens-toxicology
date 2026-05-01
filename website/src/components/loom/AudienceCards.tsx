'use client';

import { tokens } from '@/styles/tokens';

type AudienceType = 'consumer' | 'clinician' | 'counsel';

interface AudienceCardsProps {
  selectedAudience: AudienceType;
  onSelect: (audience: AudienceType) => void;
}

const AUDIENCES = [
  {
    id: 'consumer' as const,
    label: 'Consumer',
    title: 'What\'s in my world?',
    description: 'For concerned parents, patients, and anyone wanting to understand substances they encounter daily.',
    color: tokens.audienceConsumer,
  },
  {
    id: 'clinician' as const,
    label: 'Clinician',
    title: 'Differential & exposure workup',
    description: 'For healthcare providers building differential diagnoses and assessing environmental exposures.',
    color: tokens.audienceClinician,
  },
  {
    id: 'counsel' as const,
    label: 'Counsel',
    title: 'Daubert-ready case prep',
    description: 'For attorneys preparing litigation with evidence graded for admissibility and expert testimony.',
    color: tokens.audienceCounsel,
  },
];

export default function AudienceCards({ selectedAudience, onSelect }: AudienceCardsProps) {
  return (
    <div className="tile-grid-3">
      {AUDIENCES.map((audience) => (
        <button
          key={audience.id}
          onClick={() => onSelect(audience.id)}
          className="group tile-inner bg-[var(--paper-warm)] text-left transition-all hover:-translate-y-0.5"
          style={{
            borderColor: audience.color,
            opacity: selectedAudience === audience.id ? 1 : 0.7,
          }}
        >
          <div
            className="font-eyebrow mb-2"
            style={{ color: audience.color }}
          >
            {audience.label}
          </div>
          <h3
            className="mb-3 text-xl md:text-2xl"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--ink)',
              lineHeight: 1.3,
            }}
          >
            {audience.title}
          </h3>
          <p
            className="mb-4 text-sm md:text-base"
            style={{
              color: 'var(--ink-soft)',
              lineHeight: 1.6,
            }}
          >
            {audience.description}
          </p>
          <div
            className="inline-flex items-center gap-1 text-sm font-semibold transition-transform group-hover:translate-x-1"
            style={{ color: audience.color }}
          >
            Begin →
          </div>
        </button>
      ))}
    </div>
  );
}
