'use client';

/**
 * Home — a GUIDED, branded, case-first walkthrough of Sky Valley.
 *
 * One spine, never a dead end: a sticky tracker shows where you are and every
 * stop ends in one obvious "next." Each stop pairs simple text with the
 * developed herbarium art (the animated caduceus, the seven-stage motion
 * plates, the audience specimens, the botanical bloom) so a first-time viewer
 * sees the full brand and the surfaces beyond this one case. The case is framed
 * correctly as PCB BRAIN INJURY in the school's teachers — not cancer.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';

const STEPS = [
  { id: 'story', n: '01', label: 'The story' },
  { id: 'science', n: '02', label: 'The science' },
  { id: 'evidence', n: '03', label: 'The evidence' },
  { id: 'file', n: '04', label: 'The case file' },
  { id: 'garden', n: '05', label: 'The garden' },
] as const;

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 };
const CAP: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 10, textAlign: 'center' };
const H2: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.1rem, 4vw, 3.1rem)', lineHeight: 1.05, letterSpacing: '-0.01em', color: 'var(--teal-deep)', margin: 0 };
const BODY: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '1.06rem', lineHeight: 1.75, color: 'var(--ink-soft)' };
const FRAME: React.CSSProperties = { borderRadius: 6, overflow: 'hidden', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--copper-orn)', background: 'var(--paper-raised)', boxShadow: '0 1px 0 var(--paper-line), 0 16px 36px rgba(18,38,44,0.13)' };
const MEDIA: React.CSSProperties = { display: 'block', width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1 / 1', filter: 'saturate(0.96)' };

/** Animated stage plate (herbarium motion art). Poster shows instantly; loop autoplays muted. */
function Motion({ id, caption, max = 380 }: { id: string; caption?: string; max?: number }) {
  return (
    <figure style={{ margin: '0 auto', maxWidth: max }}>
      <div style={FRAME}>
        <video poster={`/icons/stage-${id}.png`} autoPlay muted loop playsInline preload="metadata" style={MEDIA}>
          <source src={`/icons/stage-${id}.mp4`} type="video/mp4" />
        </video>
      </div>
      {caption && <figcaption style={CAP}>{caption}</figcaption>}
    </figure>
  );
}

/** Static specimen plate. */
function Plate({ src, caption, pos = 'center 28%', max = 380 }: { src: string; caption?: string; pos?: string; max?: number }) {
  return (
    <figure style={{ margin: '0 auto', maxWidth: max }}>
      <div style={FRAME}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={caption ?? ''} loading="lazy" style={{ ...MEDIA, objectPosition: pos }} />
      </div>
      {caption && <figcaption style={CAP}>{caption}</figcaption>}
    </figure>
  );
}

function NextButton({ to, label }: { to: string; label: string }) {
  return (
    <a href={`#${to}`} className="no-underline inline-flex items-center gap-3"
      style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 6, padding: '14px 24px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', marginTop: 30 }}>
      <span style={{ ...MONO, color: 'rgba(242,233,210,0.65)', fontSize: '0.56rem' }}>Next</span>
      {label} <span aria-hidden>→</span>
    </a>
  );
}

const GARDEN_STAGES = [
  { id: 'identify', label: 'Identify', q: 'What is it?' },
  { id: 'assess', label: 'Assess', q: 'How dangerous?' },
  { id: 'plan', label: 'Plan', q: 'What do we do?' },
  { id: 'act', label: 'Act', q: 'Respond' },
  { id: 'adapt', label: 'Adapt', q: 'It changed' },
  { id: 'resolve', label: 'Resolve', q: 'Wrap it up' },
  { id: 'reflect', label: 'Reflect', q: 'Learn from it' },
];
const AUDIENCES = [
  { src: '/plates/audience-consumers.png', label: 'Consumer', sub: 'Plain-language answers', href: '/flow/consumer', pos: 'center 24%' },
  { src: '/plates/audience-clinicians.png', label: 'Clinician', sub: 'Differential & biomarkers', href: '/flow/clinician', pos: 'center 30%' },
  { src: '/plates/audience-legal.png', label: 'Counsel', sub: 'Daubert-ready case prep', href: '/flow/counsel', pos: 'center 26%' },
  { src: '/plates/audience-researchers.png', label: 'Researcher', sub: 'Mechanism, evidence & gaps', href: '/flow/researcher', pos: 'center 26%' },
];

export default function HomePage() {
  const [active, setActive] = useState<string>('story');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    STEPS.forEach((s) => { const el = document.getElementById(s.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  // Reliably play the herbarium motion plates: bare autoPlay is throttled when a
  // page has many videos, so explicitly play each one as it scrolls into view
  // (and pause it when it leaves — keeps only on-screen plates decoding).
  useEffect(() => {
    const vids = Array.from(document.querySelectorAll('video'));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) { const p = v.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); }
        else v.pause();
      }),
      { threshold: 0.3 }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  return (
    <main data-surface="tkg" style={{ background: 'var(--paper)' }}>
      {/* ===== HERO ===== */}
      <section className="rail-wide grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]" style={{ paddingTop: '6vh', paddingBottom: '7vh' }}>
        <div>
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Erickson v. Monsanto · King County, Washington</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.8rem, 6vw, 4.8rem)', lineHeight: 1.0, letterSpacing: '-0.015em', color: 'var(--teal-deep)', margin: '14px 0 0' }}>
            The Sky Valley case.
          </h1>
          <p style={{ ...BODY, fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', maxWidth: '40ch', margin: '20px 0 0', color: 'var(--ink)' }}>
            PCBs leaked inside a school for years. The teachers who worked there suffered <strong>brain injury</strong>. Here is the science — and how it holds up in court.
          </p>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 34 }}>
            <a href="#story" className="no-underline inline-flex items-center gap-3"
              style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 6, padding: '16px 30px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.08rem' }}>
              Walk the case <span aria-hidden>→</span>
            </a>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-mute)' }}>Five short stops</span>
          </div>
        </div>
        <div>
          <figure style={{ margin: '0 auto', maxWidth: 420 }}>
            <div style={FRAME}>
              <video poster="/emblem-caduceus.png" autoPlay muted loop playsInline preload="metadata" style={MEDIA}>
                <source src="/emblem-caduceus.mp4" type="video/mp4" />
              </video>
            </div>
            <figcaption style={CAP}>The living mark · teal-ink caduceus, branched &amp; rooted</figcaption>
          </figure>
        </div>
      </section>

      {/* ===== STICKY SPINE ===== */}
      <nav aria-label="Walkthrough" className="sticky top-0 z-40 border-y"
        style={{ borderColor: 'var(--paper-line)', background: 'rgba(242,233,210,0.92)', backdropFilter: 'saturate(1.1) blur(6px)' }}>
        <div className="rail-wide flex flex-wrap items-center gap-x-7 gap-y-2" style={{ paddingTop: 12, paddingBottom: 12 }}>
          {STEPS.map((s) => {
            const on = active === s.id;
            return (
              <a key={s.id} href={`#${s.id}`} className="no-underline inline-flex items-baseline gap-2" style={{ opacity: on ? 1 : 0.5, transition: 'opacity 160ms' }}>
                <span style={{ ...MONO, color: on ? 'var(--copper-orn-deep)' : 'var(--ink-mute)', fontSize: '0.56rem' }}>{s.n}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', color: on ? 'var(--teal-deep)' : 'var(--ink-soft)', borderBottom: on ? '2px solid var(--copper-orn)' : '2px solid transparent', paddingBottom: 2 }}>{s.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* ===== 01 · THE STORY ===== */}
      <section id="story" className="rail-wide grid items-center gap-10 lg:grid-cols-2" style={{ paddingTop: '6vh', paddingBottom: '6vh', scrollMarginTop: 64 }}>
        <div>
          <div style={{ ...MONO, color: 'var(--ink-mute)' }}>01 · The story</div>
          <h2 style={{ ...H2, marginTop: 12, maxWidth: '18ch' }}>A building made its teachers sick.</h2>
          <p style={{ ...BODY, marginTop: 20 }}>
            For years, PCBs leaked from aging fluorescent-light ballasts and degraded caulking inside the <strong>Sky Valley Education Center</strong> near Monroe, Washington. The teachers and staff worked in those rooms day after day.
          </p>
          <p style={{ ...BODY, marginTop: 16 }}>
            Many developed <strong style={{ color: 'var(--ink)' }}>neurological and cognitive injury</strong> — memory, concentration, and processing problems, alongside headaches and other neurobehavioral symptoms. In <em>Erickson v. Monsanto</em>, they sued the company that made the PCBs. The first three teachers went to trial in <strong>2021</strong>; more followed. Dr.&nbsp;James&nbsp;G.&nbsp;Dahlgren, M.D. served as their toxicology expert.
          </p>
          <NextButton to="science" label="Why PCBs injure the brain" />
        </div>
        <Plate src="/plates/audience-consumers.png" caption="Human injury · anatomical specimen" pos="center 22%" />
      </section>

      {/* ===== 02 · THE SCIENCE ===== */}
      <section id="science" className="rail-wide grid items-center gap-10 border-t lg:grid-cols-2" style={{ borderColor: 'var(--paper-line)', paddingTop: '6vh', paddingBottom: '6vh', scrollMarginTop: 64 }}>
        <div>
          <div style={{ ...MONO, color: 'var(--ink-mute)' }}>02 · The science</div>
          <h2 style={{ ...H2, marginTop: 12, maxWidth: '20ch' }}>How a PCB reaches the brain.</h2>
          <p style={{ ...BODY, marginTop: 20 }}>
            PCBs are persistent, fat-soluble industrial chemicals — and established <strong style={{ color: 'var(--ink)' }}>neurotoxicants</strong>. Chronic exposure disrupts thyroid-hormone signaling, interferes with dopamine systems, and dysregulates calcium signaling inside neurons. Those mechanisms map onto the deficits the teachers reported: memory, learning, attention, and executive function.
          </p>
          <p style={{ ...BODY, marginTop: 16 }}>
            Because PCBs accumulate in fatty tissue and clear over years, the dose builds with every year in the room.
          </p>
          <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 26 }}>
            <Link href="/compound/pcbs" className="no-underline inline-flex items-center gap-2"
              style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 5, padding: '11px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--teal-deep)' }}>
              Full PCB profile, with sources <span aria-hidden>→</span>
            </Link>
          </div>
          <NextButton to="evidence" label="How the science holds up" />
        </div>
        <Motion id="identify" caption="Identify · examine the substance and its target" />
      </section>

      {/* ===== 03 · THE EVIDENCE ===== */}
      <section id="evidence" className="rail-wide grid items-center gap-10 border-t lg:grid-cols-2" style={{ borderColor: 'var(--paper-line)', paddingTop: '6vh', paddingBottom: '6vh', scrollMarginTop: 64 }}>
        <div>
          <div style={{ ...MONO, color: 'var(--ink-mute)' }}>03 · The evidence</div>
          <h2 style={{ ...H2, marginTop: 12, maxWidth: '24ch' }}>Three sources behind every claim.</h2>
          <p style={{ ...BODY, marginTop: 20 }}>
            Every claim is rated by evidence tier — regulatory bodies (IARC, ATSDR, EPA) first, then systematic reviews, then peer-reviewed studies. Nothing is asserted without its sources attached, so a claim can go straight into a <strong>Daubert</strong> analysis.
          </p>
          <p style={{ ...BODY, marginTop: 16 }}>
            The AI workspace reads <em>only</em> from that curated evidence — it answers with citations, and says plainly where the record is thin.
          </p>
          <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 26 }}>
            <Link href="/flow/counsel" className="no-underline inline-flex items-center gap-2"
              style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 5, padding: '12px 20px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem' }}>
              Run the live analysis <span aria-hidden>→</span>
            </Link>
            <Link href="/compound/pcbs" className="no-underline inline-flex items-center gap-2"
              style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 5, padding: '12px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--teal-deep)' }}>
              Browse the cited claims <span aria-hidden>→</span>
            </Link>
          </div>
          {/* THE THESIS for counsel — monetary / legal / practical value */}
          <div style={{ marginTop: 30, border: '1px solid var(--copper-orn)', borderLeft: '4px solid var(--copper-orn-deep)', background: 'var(--paper-warm)', borderRadius: 6, padding: '22px 24px' }}>
            <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Why it pays for itself</div>
            <p style={{ ...BODY, marginTop: 10, fontSize: '1.02rem', color: 'var(--ink)' }}>
              A Daubert-grade exhibit packet — the theory of harm, the certified-vs-contested table, the cited record — normally costs an expert and a paralegal <strong>40+ hours and roughly $10,000</strong>. Here it is <strong>Dr.&nbsp;Dahlgren&rsquo;s fifty years &times; the force multiplier of AI</strong>: the same packet in minutes, defensible, every line traceable to its source. One packet pays for the platform.
            </p>
          </div>
          <NextButton to="file" label="The full case file" />
        </div>
        <Motion id="reflect" caption="The evidence record · peer-reviewed & regulatory" />
      </section>

      {/* ===== 04 · THE CASE FILE ===== */}
      <section id="file" className="rail-wide grid items-center gap-10 border-t lg:grid-cols-2" style={{ borderColor: 'var(--paper-line)', paddingTop: '6vh', paddingBottom: '6vh', scrollMarginTop: 64 }}>
        <div>
          <div style={{ ...MONO, color: 'var(--ink-mute)' }}>04 · The case file</div>
          <h2 style={{ ...H2, marginTop: 12, maxWidth: '20ch' }}>The full record, under lock.</h2>
          <p style={{ ...BODY, marginTop: 20 }}>
            Behind the public summary sits the complete case file — <strong>1,959 documents</strong>: depositions, expert reports, exhibits, motions, and correspondence. Because it also holds protected medical records, it is gated: authorized counsel and retained experts sign in to read it; everyone else sees the de-identified summary.
          </p>
          <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 26 }}>
            <Link href="/vault" className="no-underline inline-flex items-center gap-2"
              style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 5, padding: '12px 20px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem' }}>
              Open the case file <span aria-hidden>→</span>
            </Link>
            <Link href="/case/sky-valley" className="no-underline inline-flex items-center gap-2"
              style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 5, padding: '12px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--teal-deep)' }}>
              The public case summary <span aria-hidden>→</span>
            </Link>
          </div>
          <NextButton to="garden" label="See the wider garden" />
        </div>
        <Motion id="resolve" caption="The sealed record · access-restricted" />
      </section>

      {/* ===== 05 · THE WIDER GARDEN ===== */}
      <section id="garden" className="rail-wide border-t" style={{ borderColor: 'var(--paper-line)', paddingTop: '6vh', paddingBottom: '8vh', scrollMarginTop: 64 }}>
        <div style={{ ...MONO, color: 'var(--ink-mute)' }}>05 · The wider garden</div>
        <h2 style={{ ...H2, marginTop: 12, maxWidth: '20ch' }}>One case. A whole system.</h2>
        <p style={{ ...BODY, marginTop: 18, maxWidth: '64ch' }}>
          Sky Valley is one worked case — and a glimpse of where this is going. The same Knowledge Garden runs the entire toxicology lifecycle and frames the evidence for everyone who touches it: <strong style={{ color: 'var(--ink)' }}>plaintiffs, the public, clinicians, scientists, and counsel</strong> — then carries its design to a family of gardens beyond toxicology.
        </p>

        {/* the seven-stage workflow */}
        <div style={{ marginTop: 44 }}>
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>The seven-stage workflow</div>
          <p style={{ ...BODY, fontSize: '0.98rem', marginTop: 8, maxWidth: '62ch' }}>
            Every investigation moves through one shape — each stage a working, AI-assisted tool. It is the same skeleton every Knowledge Garden inherits.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
            {GARDEN_STAGES.map((s) => (
              <figure key={s.id} style={{ margin: 0 }}>
                <div style={{ ...FRAME, borderTopWidth: 2 }}>
                  <video poster={`/icons/stage-${s.id}.png`} autoPlay muted loop playsInline preload="metadata" style={MEDIA}>
                    <source src={`/icons/stage-${s.id}.mp4`} type="video/mp4" />
                  </video>
                </div>
                <figcaption style={{ textAlign: 'center', marginTop: 8 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--ink)', display: 'block' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--ink-mute)' }}>{s.q}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <Link href="/workflow" className="no-underline inline-block" style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal-deep)' }}>
            See the workflow in motion →
          </Link>
        </div>

        {/* three audiences */}
        <div style={{ marginTop: 56 }}>
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Built for four audiences</div>
          <p style={{ ...BODY, fontSize: '0.98rem', marginTop: 8, maxWidth: '62ch' }}>
            The same evidence, reframed for whoever is reading — a worried parent, a treating clinician, a trial lawyer, or a research scientist.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {AUDIENCES.map((a) => (
              <Link key={a.href} href={a.href} className="no-underline group">
                <Plate src={a.src} pos={a.pos} max={9999} />
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.25rem', color: 'var(--teal-deep)', display: 'block' }}>{a.label}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{a.sub}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* family of gardens */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Plate src="/umbrella-bloom.png" caption="The Knowledge Gardens · one shared system" pos="center" max={320} />
          <div>
            <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>A family of gardens</div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.7rem', color: 'var(--teal-deep)', margin: '10px 0 0' }}>
              Toxicology is one garden among many.
            </h3>
            <p style={{ ...BODY, marginTop: 14, maxWidth: '52ch' }}>
              Each Knowledge Garden applies the same principle — verifiable, source-backed knowledge with an AI that only speaks from the record — to a different field. Toxicology is the first; the design, the evidence model, and the seven-stage shape carry across all of them.
            </p>
            <Link href="/workflow" className="no-underline inline-block" style={{ marginTop: 18, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--teal-deep)' }}>
              Explore the full platform →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
