'use client';

/**
 * BrowsePanel — "Browse the garden" section with three invitation tiles.
 * Shows Compounds, Cases, and Workflows as entry points to the garden.
 * One-message-per-screen (90vh min-height), generous breathing room, ScrollReveal animations.
 * Paper background with subtle dot grid (data-surface="tkg").
 */

import Link from 'next/link';
import ScrollReveal from './ScrollReveal';

type TileProps = {
  eyebrow: string;
  title: string;
  body: string;
  accent: 'copper' | 'slate' | 'teal';
  footer: {
    label: string;
    href: string;
  };
  preview?: {
    items: string[];
  };
};

function BrowseTile({ eyebrow, title, body, accent, footer, preview }: TileProps) {
  const accentColorVar = {
    copper: 'var(--copper-orn-deep)',
    slate: 'var(--tox-deep)',
    teal: 'var(--teal-deep)',
  }[accent];

  return (
    <div className="tile group h-full overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {/* Eyebrow */}
      <div
        className="mb-9 uppercase"
        style={{
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink-mute)',
          fontSize: '0.72rem',
          letterSpacing: '0.22em',
          fontWeight: 600,
          lineHeight: 1.7,
          maxWidth: '24ch',
        }}
      >
        {eyebrow}
      </div>

      {/* Accent bar */}
      <div
        className="mb-10 h-1 w-12 rounded-full transition-all duration-200 group-hover:w-16"
        style={{ background: accentColorVar }}
      />

      {/* Title */}
      <h3
        className="mb-8 leading-tight text-[var(--ink)]"
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'normal',
          fontSize: 'clamp(1.55rem, 3vw, 1.95rem)',
          fontWeight: 800,
          lineHeight: 1.18,
          letterSpacing: '-0.005em',
          maxWidth: '14ch',
        }}
      >
        {title}
      </h3>

      {/* Body — canonical .body-readable utility */}
      <p className="body-readable mb-12 flex-1">{body}</p>

      {/* Preview chips */}
      {preview && (
        <div className="mb-12 flex flex-wrap gap-3">
          {preview.items.map((item) => (
            <Link
              key={item}
              href={`/compound/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-block rounded-full border px-5 py-2 transition-all duration-200 hover:shadow-sm"
              style={{
                borderColor: accentColorVar,
                color: accentColorVar,
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      )}

      {/* Footer link */}
      <div
        className="pt-7"
        style={{ borderTop: `1px solid ${accentColorVar}22` }}
      >
        <Link
          href={footer.href}
          className="cta-pill cta-pill-secondary group/link inline-flex items-center gap-3"
          style={{
            color: accentColorVar,
          }}
        >
          {footer.label}
          <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function BrowsePanel() {
  return (
    <section id="browse-the-garden" data-surface="tkg" className="relative min-h-[90vh] flex items-center py-16 sm:py-20">
      <div className="rail-default w-full">
        {/* Eyebrow */}
        <ScrollReveal delay={0}>
          <div
            className="mb-6 text-center text-xs uppercase tracking-wider"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--copper-orn-deep)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
            }}
          >
            browse the garden
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={100}>
          <h2
            className="mx-auto mb-6 max-w-[24ch] text-center leading-tight text-[var(--ink)]"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              lineHeight: 1.05,
            }}
          >
            Three doorways into what we know.
          </h2>
        </ScrollReveal>

        {/* Subhead */}
        <ScrollReveal delay={100}>
          <div className="prose-rail">
            <p
              className="mb-12 text-center leading-relaxed text-[var(--ink-soft)]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
              }}
            >
              A canonical evidence graph behind every claim. Drill into a substance, walk an active case, or step through the killer-app workflow.
            </p>
          </div>
        </ScrollReveal>

        {/* Three tiles — uses canonical tile-grid-3 utility (gap scales with viewport) */}
        <div className="tile-grid-3">
          {/* Tile 1: Compounds */}
          <ScrollReveal delay={200}>
            <BrowseTile
              eyebrow="4 compounds · 10 claims · 26 sources"
              title="The substances"
              body="Glyphosate. Microplastics. PCBs. PET. Each one drilled into Hazard / Profile / Response / Citations — three sources behind every claim."
              accent="copper"
              footer={{
                label: 'Open the index',
                href: '/compound',
              }}
              preview={{
                items: ['Glyphosate', 'Microplastics', 'PCBs'],
              }}
            />
          </ScrollReveal>

          {/* Tile 2: Cases */}
          <ScrollReveal delay={300}>
            <BrowseTile
              eyebrow="1 active case"
              title="Erickson v. Monsanto"
              body="Sky Valley PCB Case (WA, 2016) — 5 parties, 3 documents, 5 timeline events, Dr. Dahlgren as lead expert. Walk it from theory of harm to a Daubert-grade exhibit packet."
              accent="slate"
              footer={{
                label: 'Open the case',
                href: '/case/sky-valley',
              }}
            />
          </ScrollReveal>

          {/* Tile 3: Workflows */}
          <ScrollReveal delay={400}>
            <BrowseTile
              eyebrow="7 stages · 1 live · 3 soon"
              title="The killer-app pattern"
              body="Identify → Assess → Plan → Act → Adapt → Resolve → Reflect. Each stage has workflows. Each workflow ends in a deliverable."
              accent="teal"
              footer={{
                label: 'See compound lookup',
                href: '/workflow/identify/compound-lookup',
              }}
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
