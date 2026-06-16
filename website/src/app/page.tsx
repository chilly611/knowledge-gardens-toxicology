'use client';

/**
 * Home — a GUIDED, case-first walkthrough of Sky Valley (Erickson v. Monsanto).
 *
 * Rebuilt after a live demo where a first-time expert got lost ("I don't know
 * where to go"). The fix: ONE spine, not many doors. A sticky step-tracker shows
 * where you are; every step ends in one obvious "next." The case is framed
 * correctly as PCB BRAIN INJURY in the school's teachers — not cancer.
 *
 * The platform's other surfaces (compounds, workflow, all cases, the lanes) are
 * still there, reachable from the nav and a single quiet "explore" link — but
 * they are no longer competing for attention on the way in.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';

const STEPS = [
  { id: 'story', n: '01', label: 'The story' },
  { id: 'science', n: '02', label: 'The science' },
  { id: 'evidence', n: '03', label: 'The evidence' },
  { id: 'file', n: '04', label: 'The case file' },
] as const;

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 };
const H2: React.CSSProperties = { fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.1rem, 4vw, 3.1rem)', lineHeight: 1.05, letterSpacing: '-0.01em', color: 'var(--teal-deep)', margin: 0 };
const BODY: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: '1.06rem', lineHeight: 1.75, color: 'var(--ink-soft)' };

function NextButton({ to, label }: { to: string; label: string }) {
  return (
    <a href={`#${to}`} className="no-underline inline-flex items-center gap-3"
      style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 6, padding: '14px 24px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', marginTop: 32 }}>
      <span style={{ ...MONO, color: 'rgba(242,233,210,0.65)', fontSize: '0.58rem' }}>Next</span>
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}

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

  return (
    <main data-surface="tkg" style={{ background: 'var(--paper)' }}>
      {/* ===== HERO — one case, one clear action ===== */}
      <section className="rail-wide" style={{ paddingTop: '7vh', paddingBottom: '8vh' }}>
        <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Erickson v. Monsanto · King County, Washington</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.8rem, 6.5vw, 5rem)', lineHeight: 1.0, letterSpacing: '-0.015em', color: 'var(--teal-deep)', margin: '14px 0 0' }}>
          The Sky Valley case.
        </h1>
        <p style={{ ...BODY, fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', maxWidth: '40ch', margin: '20px 0 0', color: 'var(--ink)' }}>
          PCBs leaked inside a school for years. The teachers who worked there suffered <strong>brain injury</strong>. Here is the science — and how it holds up in court.
        </p>
        <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 36 }}>
          <a href="#story" className="no-underline inline-flex items-center gap-3"
            style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 6, padding: '16px 30px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.08rem' }}>
            Walk the case <span aria-hidden>→</span>
          </a>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-mute)' }}>
            Four steps · about three minutes
          </span>
        </div>
      </section>

      {/* ===== STICKY SPINE — always shows where you are + where to go ===== */}
      <nav aria-label="Case walkthrough" className="sticky top-0 z-40 border-y"
        style={{ borderColor: 'var(--paper-line)', background: 'rgba(242,233,210,0.92)', backdropFilter: 'saturate(1.1) blur(6px)' }}>
        <div className="rail-wide flex flex-wrap items-center gap-x-7 gap-y-2" style={{ paddingTop: 12, paddingBottom: 12 }}>
          {STEPS.map((s) => {
            const on = active === s.id;
            return (
              <a key={s.id} href={`#${s.id}`} className="no-underline inline-flex items-baseline gap-2"
                style={{ opacity: on ? 1 : 0.5, transition: 'opacity 160ms' }}>
                <span style={{ ...MONO, color: on ? 'var(--copper-orn-deep)' : 'var(--ink-mute)', fontSize: '0.58rem' }}>{s.n}</span>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', color: on ? 'var(--teal-deep)' : 'var(--ink-soft)', borderBottom: on ? '2px solid var(--copper-orn)' : '2px solid transparent', paddingBottom: 2 }}>{s.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* ===== 01 · THE STORY ===== */}
      <section id="story" className="rail-wide" style={{ paddingTop: '7vh', paddingBottom: '7vh', scrollMarginTop: 64 }}>
        <div style={{ ...MONO, color: 'var(--ink-mute)' }}>01 · The story</div>
        <h2 style={{ ...H2, marginTop: 12, maxWidth: '20ch' }}>A building made its teachers sick.</h2>
        <div style={{ maxWidth: '62ch', marginTop: 22 }}>
          <p style={BODY}>
            For years, PCBs leaked from aging fluorescent-light ballasts and degraded caulking inside the <strong>Sky Valley Education Center</strong> near Monroe, Washington. The teachers and staff worked in those rooms day after day.
          </p>
          <p style={{ ...BODY, marginTop: 18 }}>
            Many developed <strong style={{ color: 'var(--ink)' }}>neurological and cognitive injury</strong> — problems with memory, concentration, and processing, alongside headaches and other neurobehavioral symptoms consistent with chronic PCB exposure. In <em>Erickson v. Monsanto</em>, they sued the company that made the PCBs. The first three teachers went to trial in <strong>2021</strong>; more cases followed.
          </p>
          <p style={{ ...BODY, marginTop: 18, fontSize: '0.95rem', color: 'var(--ink-mute)' }}>
            Dr. James G. Dahlgren, M.D. served as the plaintiffs&rsquo; toxicology expert.
          </p>
        </div>
        <NextButton to="science" label="Why PCBs injure the brain" />
      </section>

      {/* ===== 02 · THE SCIENCE ===== */}
      <section id="science" className="rail-wide border-t" style={{ borderColor: 'var(--paper-line)', paddingTop: '7vh', paddingBottom: '7vh', scrollMarginTop: 64 }}>
        <div style={{ ...MONO, color: 'var(--ink-mute)' }}>02 · The science</div>
        <h2 style={{ ...H2, marginTop: 12, maxWidth: '22ch' }}>How a PCB reaches the brain.</h2>
        <div style={{ maxWidth: '62ch', marginTop: 22 }}>
          <p style={BODY}>
            PCBs are persistent, fat-soluble industrial chemicals — and established <strong style={{ color: 'var(--ink)' }}>neurotoxicants</strong>. Chronic exposure disrupts thyroid-hormone signaling (which the brain depends on), interferes with dopamine systems, and dysregulates calcium-dependent signaling inside neurons. Those mechanisms map onto the deficits the teachers reported: memory, learning, attention, and executive function.
          </p>
          <p style={{ ...BODY, marginTop: 18 }}>
            Because PCBs accumulate in fatty tissue and clear over years, exposure inside a building is cumulative — the dose builds with every year in the room.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 28 }}>
          <Link href="/compound/pcbs" className="no-underline inline-flex items-center gap-2"
            style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 5, padding: '11px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--teal-deep)' }}>
            Full PCB profile, with sources <span aria-hidden>→</span>
          </Link>
        </div>
        <NextButton to="evidence" label="How the science holds up" />
      </section>

      {/* ===== 03 · THE EVIDENCE ===== */}
      <section id="evidence" className="rail-wide border-t" style={{ borderColor: 'var(--paper-line)', paddingTop: '7vh', paddingBottom: '7vh', scrollMarginTop: 64 }}>
        <div style={{ ...MONO, color: 'var(--ink-mute)' }}>03 · The evidence</div>
        <h2 style={{ ...H2, marginTop: 12, maxWidth: '24ch' }}>Three sources behind every claim.</h2>
        <div style={{ maxWidth: '62ch', marginTop: 22 }}>
          <p style={BODY}>
            Every claim in the garden is rated by evidence tier — regulatory bodies (IARC, ATSDR, EPA) first, then systematic reviews, then individual peer-reviewed studies. Nothing is asserted without its sources attached, so a claim can be taken straight into a <strong>Daubert</strong> analysis.
          </p>
          <p style={{ ...BODY, marginTop: 18 }}>
            The AI workspace reads only from that curated evidence. Ask it for the theory of harm or the Daubert posture and it answers <em>from the record</em>, with citations — and tells you plainly where the evidence is thin.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 28 }}>
          <Link href="/flow/counsel" className="no-underline inline-flex items-center gap-2"
            style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 5, padding: '12px 20px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem' }}>
            Run the live analysis <span aria-hidden>→</span>
          </Link>
          <Link href="/compound/pcbs" className="no-underline inline-flex items-center gap-2"
            style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 5, padding: '12px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--teal-deep)' }}>
            Browse the cited claims <span aria-hidden>→</span>
          </Link>
        </div>
        <NextButton to="file" label="The full case file" />
      </section>

      {/* ===== 04 · THE CASE FILE ===== */}
      <section id="file" className="rail-wide border-t" style={{ borderColor: 'var(--paper-line)', paddingTop: '7vh', paddingBottom: '8vh', scrollMarginTop: 64 }}>
        <div style={{ ...MONO, color: 'var(--ink-mute)' }}>04 · The case file</div>
        <h2 style={{ ...H2, marginTop: 12, maxWidth: '22ch' }}>The full record, under lock.</h2>
        <div style={{ maxWidth: '62ch', marginTop: 22 }}>
          <p style={BODY}>
            Behind the public summary sits the complete case file — <strong>1,959 documents</strong>: depositions, expert reports, exhibits, motions, and correspondence. Because it also holds protected medical records, it is gated: authorized counsel and retained experts sign in to read it; everyone else sees the de-identified summary.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 28 }}>
          <Link href="/vault" className="no-underline inline-flex items-center gap-2"
            style={{ background: 'var(--tox-deep)', color: 'var(--paper)', borderRadius: 5, padding: '12px 20px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem' }}>
            Open the case file <span aria-hidden>→</span>
          </Link>
          <Link href="/case/sky-valley" className="no-underline inline-flex items-center gap-2"
            style={{ border: '1px solid var(--paper-line)', background: 'var(--paper-raised)', borderRadius: 5, padding: '12px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--teal-deep)' }}>
            The public case summary <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ===== quiet platform door (secondary, never competing on the way in) ===== */}
      <section className="border-t" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper-warm)' }}>
        <div className="rail-wide flex flex-wrap items-center justify-between gap-4" style={{ paddingTop: 26, paddingBottom: 26 }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-soft)' }}>
            Sky Valley is one worked case. The garden also covers other compounds, audiences, and the full toxicology workflow.
          </div>
          <Link href="/workflow" className="no-underline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--teal-deep)', whiteSpace: 'nowrap' }}>
            Explore the full platform →
          </Link>
        </div>
      </section>
    </main>
  );
}
