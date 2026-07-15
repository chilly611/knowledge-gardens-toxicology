'use client';

/**
 * /start — the branded "map" launcher for pitching.
 *
 * A single, beautiful, herbarium-branded index of every live surface, with the
 * real design-system art as previews and one-click links (new tab, so this map
 * stays open). Built as a real page — not a chat widget — because the brand's
 * fonts and image assets only live here on the site.
 *
 * Lives in the app layout (TopFrame + footer) so it sits inside the chrome.
 */
import Link from 'next/link';

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 };
const CAP: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' };
const SECT: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--teal-deep)', margin: 0 };
const FRAME: React.CSSProperties = { borderRadius: 6, overflow: 'hidden', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--copper-orn)', background: 'var(--paper-raised)', boxShadow: '0 1px 0 var(--paper-line), 0 14px 32px rgba(18,38,44,0.12)' };
const CARD: React.CSSProperties = { display: 'block', background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 6, padding: '18px 20px', textDecoration: 'none' };
const MEDIA: React.CSSProperties = { display: 'block', width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.96)' };
const ext = { target: '_blank', rel: 'noopener noreferrer' as const };

const LANES = [
  { src: '/plates/audience-consumers.png', label: 'Consumer', q: 'What’s in my world?', href: '/flow/consumer', accent: '#234C5A', pos: 'center 22%' },
  { src: '/plates/audience-clinicians.png', label: 'Clinician', q: 'Workup a panel.', href: '/flow/clinician', accent: '#2A3A50', pos: 'center 30%' },
  { src: '/plates/audience-legal.png', label: 'Counsel', q: 'Prep a case.', href: '/flow/counsel', accent: '#6E2419', pos: 'center 26%' },
  { src: '/plates/audience-researchers.png', label: 'Researcher', q: 'Map the evidence.', href: '/flow/researcher', accent: '#3C7A8A', pos: 'center 26%' },
];
const STAGES = [
  ['identify', 'Identify'], ['assess', 'Assess'], ['plan', 'Plan'], ['act', 'Act'],
  ['adapt', 'Adapt'], ['resolve', 'Resolve'], ['reflect', 'Reflect'],
] as const;
const SCIENCE = [
  { label: 'Compounds', sub: 'Browse the substances', href: '/compound', icon: 'flask' },
  { label: 'PCBs', sub: 'The case’s substance', href: '/compound/pcbs', icon: 'molecule' },
  { label: 'Dioxin / TCDD', sub: 'Most toxic congener', href: '/compound/2-3-7-8-tetrachlorodibenzo-p-dioxin-tcdd', icon: 'molecule' },
  { label: 'Dr. Dahlgren', sub: 'The expert record', href: '/expert/dahlgren', icon: 'user' },
  { label: 'Reference', sub: 'Daubert, NOAEL, tiers', href: '/reference', icon: 'book' },
  { label: 'The deliverable', sub: 'Case-prep packet preview', href: '/pdf-preview/counsel', icon: 'file' },
];

export default function StartPage() {
  return (
    <main data-surface="tkg" style={{ background: 'var(--paper)' }} className="min-h-screen">
      {/* MASTHEAD */}
      <section className="rail-wide grid items-center gap-10 lg:grid-cols-[1fr_360px]" style={{ paddingTop: '6vh', paddingBottom: '4vh' }}>
        <div>
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Toxicology Knowledge Garden · live map</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', lineHeight: 1.0, letterSpacing: '-0.015em', color: 'var(--teal-deep)', margin: '12px 0 0' }}>
            Start here.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.05rem, 2vw, 1.3rem)', lineHeight: 1.6, color: 'var(--ink)', maxWidth: '42ch', margin: '18px 0 0' }}>
            Everything is live. Take the guided walkthrough end-to-end, or jump straight to any surface below — each opens in a new tab, so this map stays put.
          </p>
          <a href="/" {...ext} className="no-underline inline-flex items-center gap-3" style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 6, padding: '15px 28px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.05rem', marginTop: 30 }}>
            Open the guided walkthrough <span aria-hidden>→</span>
          </a>
        </div>
        <figure style={{ margin: 0 }}>
          <div style={FRAME}>
            <video poster="/emblem-caduceus.png" autoPlay muted loop playsInline preload="metadata" style={{ ...MEDIA, aspectRatio: '1 / 1' }}>
              <source src="/emblem-caduceus.mp4" type="video/mp4" />
            </video>
          </div>
          <figcaption style={{ ...CAP, marginTop: 10, textAlign: 'center' }}>The living mark</figcaption>
        </figure>
      </section>

      {/* THE LANES */}
      <section className="rail-wide" style={{ paddingTop: '3vh', paddingBottom: '2vh' }}>
        <div className="mb-1 flex items-baseline gap-3">
          <h2 style={SECT}>Pick a lane.</h2>
          <span style={{ ...CAP }}>one engine · four audiences</span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--ink-soft)', margin: '6px 0 18px', maxWidth: '60ch' }}>
          The same evidence, reframed for whoever is reading. Each lane runs all seven stages for that audience.
        </p>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {LANES.map((l) => (
            <a key={l.href} href={l.href} {...ext} className="group no-underline transition-transform duration-200 hover:-translate-y-1" style={{ display: 'block' }}>
              <div style={{ ...FRAME, borderTopColor: l.accent }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.src} alt={l.label} loading="lazy" style={{ ...MEDIA, aspectRatio: '1 / 1', objectPosition: l.pos }} />
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ ...MONO, color: l.accent }}>{l.label}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.2rem', color: 'var(--teal-deep)', marginTop: 2 }}>{l.q}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* THE SEVEN STAGES */}
      <section className="rail-wide" style={{ paddingTop: '4vh', paddingBottom: '2vh' }}>
        <div className="mb-1 flex items-baseline gap-3">
          <h2 style={SECT}>The seven-stage workflow.</h2>
          <span style={CAP}>the direction</span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--ink-soft)', margin: '6px 0 18px', maxWidth: '60ch' }}>
          One shape across every garden — each stage a working, AI-assisted tool.
        </p>
        <a href="/workflow" {...ext} className="no-underline group block">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {STAGES.map(([id, label], i) => (
              <figure key={id} style={{ margin: 0 }}>
                <div style={{ ...FRAME, borderTopWidth: 2 }}>
                  <video poster={`/icons/stage-${id}.png`} autoPlay muted loop playsInline preload="none" style={{ ...MEDIA, aspectRatio: '1 / 1' }}>
                    <source src={`/icons/stage-${id}.mp4`} type="video/mp4" />
                  </video>
                </div>
                <figcaption style={{ textAlign: 'center', marginTop: 7 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--ink-mute)' }}>{`0${i + 1}`}</span>{' '}
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--ink)' }}>{label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div style={{ ...CAP, color: 'var(--teal-deep)', marginTop: 14 }}>See the workflow in motion →</div>
        </a>
      </section>

      {/* THE CASE + THE VAULT */}
      <section className="rail-wide" style={{ paddingTop: '4vh', paddingBottom: '2vh' }}>
        <h2 style={SECT}>The case &amp; the case file.</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
          <a href="/case/sky-valley" {...ext} className="no-underline transition-transform hover:-translate-y-0.5" style={CARD}>
            <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Public · de-identified</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.45rem', color: 'var(--teal-deep)', margin: '6px 0 6px' }}>The case summary</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>Erickson v. Monsanto — the public-record story, timeline, and parties. <span style={{ color: 'var(--teal-deep)' }}>Open →</span></div>
          </a>
          <a href="/vault" {...ext} className="no-underline transition-transform hover:-translate-y-0.5" style={{ ...CARD, borderLeft: '3px solid var(--crimson)' }}>
            <div style={{ ...MONO, color: 'var(--crimson-deep)' }}>Confidential · sign in</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.45rem', color: 'var(--teal-deep)', margin: '6px 0 6px' }}>The vault — 1,959 documents</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--ink-soft)', lineHeight: 1.55 }}>The full corpus, gated for protected records. <span style={{ color: 'var(--teal-deep)' }}>Sign in →</span></div>
            <div style={{ marginTop: 12, border: '1px solid var(--paper-line)', background: 'var(--paper)', borderRadius: 4, padding: '8px 11px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-soft)' }}>
              Demo (literature only): <strong style={{ color: 'var(--ink)' }}>demo@theknowledgegardens.com</strong> · <strong style={{ color: 'var(--ink)' }}>SkyValleyDemo2026!</strong>
            </div>
          </a>
        </div>
      </section>

      {/* THE SCIENCE & THE RECORD */}
      <section className="rail-wide" style={{ paddingTop: '4vh', paddingBottom: '2vh' }}>
        <h2 style={SECT}>The science &amp; the record.</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {SCIENCE.map((s) => (
            <a key={s.href} href={s.href} {...ext} className="no-underline transition-transform hover:-translate-y-0.5" style={CARD}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>{s.label} <span aria-hidden style={{ color: 'var(--copper-orn-deep)' }}>→</span></div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: 3 }}>{s.sub}</div>
            </a>
          ))}
        </div>
      </section>

      {/* THE ROI THESIS */}
      <section className="rail-wide" style={{ paddingTop: '4vh', paddingBottom: '5vh' }}>
        <div style={{ border: '1px solid var(--copper-orn)', borderLeft: '5px solid var(--copper-orn-deep)', background: 'var(--paper-warm)', borderRadius: 6, padding: '26px 30px' }}>
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Why it pays for itself</div>
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.25, color: 'var(--ink)', margin: '12px 0 0', maxWidth: '34ch' }}>
            Dr. Dahlgren&rsquo;s fifty years &times; the force multiplier of AI = a Daubert-ready packet in minutes.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.65, margin: '14px 0 0', maxWidth: '60ch' }}>
            The theory of harm, the certified-vs-contested table, the cited record — once 40+ hours and roughly $10,000 of expert and paralegal time. Every line stays traceable to its source. <strong style={{ color: 'var(--ink)' }}>One packet pays for the platform.</strong>
          </p>
        </div>
      </section>

      {/* FOOTER — family of gardens */}
      <section className="border-t" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper-warm)' }}>
        <div className="rail-wide flex flex-wrap items-center gap-6" style={{ paddingTop: 22, paddingBottom: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/umbrella-bloom.png" alt="" aria-hidden loading="lazy" style={{ width: 64, height: 64, objectFit: 'contain', mixBlendMode: 'multiply', opacity: 0.85 }} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
            <strong style={{ color: 'var(--ink)' }}>toxicology.theknowledgegardens.com</strong> — one of the Knowledge Gardens.
          </div>
        </div>
      </section>
    </main>
  );
}
