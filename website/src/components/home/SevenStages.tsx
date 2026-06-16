'use client';

/**
 * SevenStages — the lifecycle, now seven WORKING tools.
 *
 * Each card is a full-bleed framed specimen that links to a real, AI-powered
 * stage tool: identify (compound browser) → assess → plan → act → adapt →
 * resolve → reflect. The stage tools chain (each carries its subject forward),
 * so "one shape across every garden" is literal, not decorative.
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { STAGES, type StageId } from '../grammar/stages';
import ScrollReveal from './ScrollReveal';

/** Where each stage card points. identify is the compound browser; the rest are the AI stage tools. */
const STAGE_HREF: Record<StageId, string> = {
  identify: '/compound',
  assess: '/workflow/assess',
  plan: '/workflow/plan',
  act: '/workflow/act',
  adapt: '/workflow/adapt',
  resolve: '/workflow/resolve',
  reflect: '/workflow/reflect',
};

/** Short action label per stage — what you actually do there. */
const STAGE_ACTION: Record<StageId, string> = {
  identify: 'Look up a compound',
  assess: 'Read the risk',
  plan: 'Build a plan',
  act: 'First response',
  adapt: 'Re-assess',
  resolve: 'Document it',
  reflect: 'Review evidence',
};

/** Full-bleed, cover-filled stage media so it fills its frame cleanly (no letterbox / offset). */
function StageBanner({ id }: { id: StageId }) {
  const [broken, setBroken] = useState(false);
  const ref = useRef<HTMLVideoElement | null>(null);
  const mediaStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'saturate(0.92)' };
  return (
    <div
      style={{ position: 'relative', width: '100%', height: 150, overflow: 'hidden', background: 'var(--paper-raised)', borderBottom: '1px solid var(--paper-line)' }}
      onMouseEnter={() => { const v = ref.current; if (v) { try { v.currentTime = 0; } catch { /* ignore */ } v.play?.().catch(() => {}); } }}
    >
      {!broken ? (
        <video ref={ref} poster={`/icons/stage-${id}.png`} autoPlay muted loop playsInline preload="metadata" style={mediaStyle} onError={() => setBroken(true)}>
          <source src={`/icons/stage-${id}.mp4`} type="video/mp4" />
        </video>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={`/icons/stage-${id}.png`} alt="" style={mediaStyle} />
      )}
      {/* ground the bottom edge into the card so mismatched image backgrounds read as one gallery */}
      <span aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(242,233,210,0) 58%, rgba(42,38,32,0.12) 100%)', pointerEvents: 'none' }} />
    </div>
  );
}

export default function SevenStages() {
  return (
    <section data-surface="tkg" className="relative py-20 sm:py-24" style={{ background: 'var(--paper-warm)' }}>
      <div className="rail-wide w-full">
        {/* Eyebrow */}
        <ScrollReveal delay={0}>
          <div className="mb-5 text-center" style={{ fontFamily: 'var(--font-mono)', color: 'var(--copper-orn-deep)', fontSize: '0.65rem', letterSpacing: '0.24em', textTransform: 'uppercase' }}>
            one lifecycle · seven working tools
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={80}>
          <h2 className="mx-auto mb-5 max-w-[22ch] text-center leading-tight" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--teal-deep)' }}>
            Seven stages, one shape across every garden.
          </h2>
        </ScrollReveal>

        {/* Subheading */}
        <ScrollReveal delay={120}>
          <p className="mx-auto mb-12 max-w-[62ch] text-center" style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>
            Different work, same skeleton. Start by identifying a substance, then follow <span style={{ color: 'var(--teal-deep)' }}>assess → plan → act → adapt → resolve → reflect</span>. Each stage is a real, grounded AI tool — and hands its subject to the next.
          </p>
        </ScrollReveal>

        {/* Stage cards — full-bleed framed specimens, each a real tool */}
        <div className="mb-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 lg:gap-4">
          {STAGES.map((stage, idx) => (
            <ScrollReveal key={stage.id} delay={70 * idx}>
              <Link
                href={STAGE_HREF[stage.id]}
                className="group flex h-full flex-col overflow-hidden no-underline transition-transform duration-200 hover:-translate-y-1"
                style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--copper-orn)', borderRadius: 5, boxShadow: '0 1px 0 var(--paper-line), 0 10px 24px rgba(18,38,44,0.10)' }}
              >
                <StageBanner id={stage.id} />

                <div className="flex flex-1 flex-col" style={{ padding: '14px 16px 16px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', color: 'var(--ink-mute)' }}>
                    {String(stage.number).padStart(2, '0')} · <span style={{ color: 'var(--teal-deep)', fontWeight: 700 }}>{stage.label}</span>
                  </div>

                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', lineHeight: 1.4, color: 'var(--ink-soft)', margin: '6px 0 0', flex: 1 }}>
                    {stage.caption}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2" style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', color: 'var(--ink)' }}>
                    <span>{STAGE_ACTION[stage.id]}</span>
                    <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" style={{ color: 'var(--copper-orn-deep)' }}>→</span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Deliverables — each lane's hand-off document */}
        <ScrollReveal delay={160}>
          <div className="flex flex-col items-center gap-4">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
              every lane ends in a deliverable
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Personal Briefing', href: '/pdf-preview/consumer' },
                { label: 'Clinical Brief', href: '/pdf-preview/clinician' },
                { label: 'Case-Prep Packet', href: '/pdf-preview/counsel' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="no-underline" style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 999, padding: '10px 20px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--ink)' }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
