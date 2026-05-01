'use client';

/**
 * AudienceCards — client component for interactive audience cards.
 * Consumer, Clinician, Counsel with hover glow effects.
 */
export default function AudienceCards() {
  const cards = [
    {
      title: 'Consumer',
      accent: 'var(--teal)',
      description: 'Daily-life touchpoints. Find what matters for your family.',
      href: '/flow/consumer',
    },
    {
      title: 'Clinician',
      accent: 'var(--indigo)',
      description: 'Biomarkers and mechanisms. Evidence-based practice in seconds.',
      href: '/flow/clinician',
    },
    {
      title: 'Counsel',
      accent: 'var(--crimson)',
      description: 'Daubert tables and case prep. Filing-grade in hours.',
      href: '/flow/counsel',
    },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <h2
        className="mb-16 text-center text-4xl md:text-5xl"
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 600,
          color: 'var(--ink)',
        }}
      >
        Built for your role.
      </h2>

      <div className="tile-grid-3 max-w-6xl w-full">
        {cards.map((card) => (
          <div
            key={card.title}
            className="tile relative transition-all cursor-pointer"
            style={{
              borderColor: card.accent,
              backgroundColor: `${card.accent}08`,
            }}
            onMouseEnter={(e) => {
              const elem = e.currentTarget as HTMLElement;
              elem.style.boxShadow = `0 12px 32px ${card.accent}4d`;
            }}
            onMouseLeave={(e) => {
              const elem = e.currentTarget as HTMLElement;
              elem.style.boxShadow = 'none';
            }}
          >
            <h3
              className="mb-4 text-2xl"
              style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                fontWeight: 600,
                color: card.accent,
              }}
            >
              {card.title}
            </h3>
            <p
              className="mb-6"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.6,
              }}
            >
              {card.description}
            </p>
            <a
              href={card.href}
              style={{
                color: card.accent,
                fontFamily: 'var(--font-display)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Explore
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
