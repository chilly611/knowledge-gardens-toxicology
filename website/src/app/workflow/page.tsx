'use client';

/**
 * /workflow — the seven-stage lifecycle hub.
 *
 * Reuses the (now real, all-wired) SevenStages section so this view never
 * drifts from the homepage, then offers the three lanes as the audience entry.
 */

import Link from 'next/link';
import SevenStages from '@/components/home/SevenStages';

const LANES = [
  { href: '/flow/consumer', label: 'Consumer', caption: "What's in my world?", accent: '#234C5A' },
  { href: '/flow/clinician', label: 'Clinician', caption: 'Workup a panel.', accent: '#2A3A50' },
  { href: '/flow/counsel', label: 'Counsel', caption: 'Prep a case.', accent: '#6E2419' },
];

export default function WorkflowIndexPage() {
  return (
    <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <SevenStages />

      {/* Lanes — the audience entry. The seven stages run inside each. */}
      <section className="border-t" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper)' }}>
        <div className="rail-wide py-16">
          <div className="mb-2 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
            or start from who you are
          </div>
          <h2 className="mx-auto mb-8 max-w-[20ch] text-center" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: 'var(--teal-deep)' }}>
            Pick a lane — it runs all seven for you.
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {LANES.map((l) => (
              <Link key={l.href} href={l.href} className="group no-underline transition-transform duration-200 hover:-translate-y-1"
                style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: `3px solid ${l.accent}`, borderRadius: 5, padding: '20px 22px', boxShadow: '0 1px 0 var(--paper-line), 0 8px 20px rgba(18,38,44,0.08)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: l.accent, fontWeight: 700 }}>{l.label}</div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.5rem', color: 'var(--teal-deep)' }}>{l.caption}</span>
                  <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'var(--copper-orn-deep)' }}>→</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/" className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--teal-deep)' }}>← Back to the garden</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
