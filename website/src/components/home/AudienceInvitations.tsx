'use client';

/**
 * Three audience invitation cards. Centered under the cinematic hero.
 * Each card is a clear value prop + concrete deliverable preview.
 *
 * Consumer  → "What's in my world?"      → Personal Toxicity Briefing PDF
 * Clinician → "Workup a panel"            → Clinical Exposure Brief PDF
 * Counsel   → "Prep a case"               → Case-Prep Exhibit Packet PDF
 *
 * Card surface: glass-on-dark with subtle accent glow on hover.
 */
import Link from 'next/link';

type Invitation = {
  audience: 'consumer' | 'clinician' | 'counsel';
  question: string;
  body: string;
  cta: string;
  href: string;
  deliverable: string;
  accent: string;        // hex color for accent glow + chrome
  accentDeep: string;
  icon: string;          // emoji or unicode
};

const INVITATIONS: Invitation[] = [
  {
    audience: 'consumer',
    question: "What's in my world?",
    body: 'Find the things you might be getting exposed to in your home, food, and work — see safer alternatives.',
    cta: 'Open the consumer lane',
    href: '/flow/consumer',
    deliverable: 'Personal Toxicity Briefing — 1–2 pages',
    accent: '#5BC0BE',
    accentDeep: '#1F7E7D',
    icon: '○',
  },
  {
    audience: 'clinician',
    question: 'Workup a panel.',
    body: 'Symptom → differential → biomarker panel. Read both sides of contested claims; chart-ready brief in two pages.',
    cta: 'Open the clinician lane',
    href: '/flow/clinician',
    deliverable: 'Clinical Exposure Brief — 2–3 pages',
    accent: '#7AAFC0',
    accentDeep: '#3B4F6B',
    icon: '◇',
  },
  {
    audience: 'counsel',
    question: 'Prep a case.',
    body: 'From theory of harm to Daubert table to expert witness pack. Sky Valley v. Monsanto loaded as a sample.',
    cta: 'Open the counsel lane',
    href: '/flow/counsel?case=sky-valley',
    deliverable: 'Case-Prep Exhibit Packet — 3–5 pages',
    accent: '#E8A988',
    accentDeep: '#A14B1E',
    icon: '◈',
  },
];

export default function AudienceInvitations() {
  return (
    <section className="w-full">
      <div className="rail-wide">
        <div className="mb-6 flex items-center justify-center">
          <span
            className="text-[#9DB6CC]"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase' }}
          >
            choose your lane
          </span>
        </div>
        <div className="tile-grid-3">
          {INVITATIONS.map((inv) => (
            <Link
              key={inv.audience}
              href={inv.href}
              className="group tile relative text-left transition-all hover:-translate-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                borderColor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* Accent stripe top */}
              <div
                className="absolute left-0 right-0 top-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, transparent, ${inv.accent}, transparent)` }}
              />
              {/* Hover glow */}
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity group-hover:opacity-100"
                style={{
                  background: `radial-gradient(60% 60% at 50% 0%, ${inv.accent}33, transparent 70%)`,
                }}
              />

              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span
                    className="rounded-full px-3 py-0.5"
                    style={{
                      background: `${inv.accent}26`,
                      color: inv.accent,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                    }}
                  >
                    for {inv.audience}
                  </span>
                  <span aria-hidden style={{ color: inv.accent, fontSize: '1.4rem' }}>{inv.icon}</span>
                </div>

                <h3
                  className="mb-3 text-white"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.8rem)',
                    fontWeight: 700,
                    lineHeight: 1.2,
                  }}
                >
                  {inv.question}
                </h3>
                <p
                  className="mb-6 text-[#C8D4E2]"
                  style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.55, fontWeight: 300 }}
                >
                  {inv.body}
                </p>

                <div
                  className="mb-6 flex items-center gap-2 rounded-lg border px-4 py-3"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.02)',
                  }}
                >
                  <span aria-hidden style={{ color: inv.accent }}>📄</span>
                  <span
                    className="text-[#C8D4E2]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em' }}
                  >
                    {inv.deliverable}
                  </span>
                </div>

                <div
                  className="cta-pill cta-pill-lg cta-pill-primary inline-flex items-center gap-2"
                  style={{ color: inv.accent }}
                >
                  {inv.cta}
                  <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
