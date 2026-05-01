'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/home/ScrollReveal';

export default function ActWorkflowPage() {
  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <section className="relative py-24 sm:py-32" style={{ minHeight: '70vh' }}>
        <div className="rail-default">
          <ScrollReveal>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: 'var(--copper-orn-deep)' }}>
              stage 4 of 7 · act workflows
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <h1 className="mx-auto mt-5 max-w-[20ch]" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2.4rem, 6vw, 5rem)', fontWeight: 500, lineHeight: 1.05, color: 'var(--ink)' }}>
              Execute the response
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="prose-rail mt-6">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--ink-soft)' }}>
                Incident response workflows. Coming soon.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={450}>
            <div className="mt-10 flex justify-center">
              <video poster="/icons/stage-act.png" autoPlay muted loop playsInline width={120} height={120} style={{ display: 'inline-block' }}>
                <source src="/icons/stage-act.mp4" type="video/mp4" />
              </video>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <section className="bg-[var(--paper-warm)] py-20">
        <div className="rail-default">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: 'var(--ink)', marginBottom: '2rem' }}>
            Coming soon.
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-soft)', maxWidth: '65ch' }}>
            Incident response tools coming soon.
          </p>
        </div>
      </section>
      <section className="bg-[var(--paper)] py-16 text-center">
        <Link href="/workflow" style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--teal-deep)', textDecoration: 'underline' }}>
          ← Back to all stages
        </Link>
      </section>
    </main>
  );
}
