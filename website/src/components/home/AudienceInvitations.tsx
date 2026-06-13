'use client';

/**
 * Choose your lane — three audience invitations rendered as light specimen
 * cards on the deep-teal band. Cream paper, sepia ink, lane-accent chrome.
 * No glassmorphism, no emoji (the design system bans both).
 *
 * Consumer  → "What's in my world?"  → Personal Toxicity Briefing
 * Clinician → "Workup a panel."      → Clinical Exposure Brief
 * Counsel   → "Prep a case."         → Case-Prep Exhibit Packet
 */
import Link from 'next/link';

type Invitation = {
  audience: 'consumer' | 'clinician' | 'counsel';
  question: string;
  body: string;
  cta: string;
  href: string;
  deliverable: string;
  accent: string;
  accentDeep: string;
};

const INVITATIONS: Invitation[] = [
  {
    audience: 'consumer',
    question: "What's in my world?",
    body: 'Find what you might be exposed to at home, in food, and at work — and the safer alternatives.',
    cta: 'Open the consumer lane',
    href: '/flow/consumer',
    deliverable: 'Personal Toxicity Briefing · 1–2 pp',
    accent: '#3C7A8A',
    accentDeep: '#234C5A',
  },
  {
    audience: 'clinician',
    question: 'Workup a panel.',
    body: 'Symptom → differential → biomarker panel. Read both sides of contested claims; a chart-ready brief in two pages.',
    cta: 'Open the clinician lane',
    href: '/flow/clinician',
    deliverable: 'Clinical Exposure Brief · 2–3 pp',
    accent: '#3B4F6B',
    accentDeep: '#2A3A50',
  },
  {
    audience: 'counsel',
    question: 'Prep a case.',
    body: 'From theory of harm to Daubert table to expert-witness pack. Sky Valley v. Monsanto is loaded as a worked sample.',
    cta: 'Open the counsel lane',
    href: '/flow/counsel?case=sky-valley',
    deliverable: 'Case-Prep Exhibit Packet · 3–5 pp',
    accent: '#A53A2D',
    accentDeep: '#6E2419',
  },
];

export default function AudienceInvitations() {
  return (
    <section className="w-full">
      <div className="rail-wide">
        <div className="mb-8 flex items-center justify-center gap-3">
          <span style={{ width: 28, height: 1, background: 'rgba(242,233,210,0.4)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--teal-pale)' }}>
            choose your lane
          </span>
          <span style={{ width: 28, height: 1, background: 'rgba(242,233,210,0.4)' }} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {INVITATIONS.map((inv) => (
            <Link
              key={inv.audience}
              href={inv.href}
              className="group flex flex-col no-underline transition-transform duration-200 hover:-translate-y-1"
              style={{
                background: 'var(--paper-raised)',
                border: '1px solid var(--paper-line)',
                borderTop: `3px solid ${inv.accent}`,
                borderRadius: 4,
                boxShadow: '0 1px 0 var(--paper-line), 0 12px 30px rgba(18,38,44,0.30)',
                padding: '26px 28px 24px',
              }}
            >
              <div className="mb-4 flex items-center gap-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: inv.accentDeep, fontWeight: 700 }}>
                  for {inv.audience}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.95rem', lineHeight: 1.08, color: 'var(--teal-deep)', margin: '0 0 10px' }}>
                {inv.question}
              </h3>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 22px', flex: 1 }}>
                {inv.body}
              </p>

              <div className="mb-5 inline-flex items-center gap-2 self-start" style={{ border: '1px solid var(--paper-line)', borderRadius: 3, background: 'var(--paper)', padding: '6px 11px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: inv.accent, display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.03em', color: 'var(--ink-mute)' }}>{inv.deliverable}</span>
              </div>

              <div className="flex items-center justify-between" style={{ background: inv.accentDeep, color: 'var(--paper)', borderRadius: 3, padding: '11px 16px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem' }}>
                <span>{inv.cta}</span>
                <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
