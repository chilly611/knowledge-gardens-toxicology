'use client';

/**
 * StageWorkspace — the real, AI-powered tool behind each lifecycle stage
 * (assess · plan · act · adapt · resolve · reflect).
 *
 * Same grounded backbone as the lane killer apps (streamAsk → /api/ask), but
 * framed around ONE stage's job and CHAINED: each stage carries its subject to
 * the next via ?subject=, so identify → assess → … → reflect runs as a single
 * lifecycle — "one shape across every garden," made literal.
 *
 * Driven entirely by a per-stage config.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { streamAsk, type Citation, type AskLane } from '@/lib/ask-stream';
import { STAGES, type StageId } from '@/components/grammar/stages';

export type StageWorkspaceConfig = {
  stage: StageId;
  lane: AskLane;
  title: string;
  tagline: string;
  inputLabel: string;
  placeholder: string;
  defaultSubject: string;
  presets: { label: string; subject: string }[];
  /** Builds the grounded question sent to /api/ask. Seed real substance terms so grounding retrieves rows. */
  prompt: (subject: string) => string;
  outputLabel: string;
  /** Optional acute-safety banner (used by the `act` stage). */
  emergency?: boolean;
};

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 };

/** Where each stage card / chain link points. identify is the compound browser; the rest are these tools. */
const STAGE_HREF: Record<StageId, string> = {
  identify: '/compound',
  assess: '/workflow/assess',
  plan: '/workflow/plan',
  act: '/workflow/act',
  adapt: '/workflow/adapt',
  resolve: '/workflow/resolve',
  reflect: '/workflow/reflect',
};

function chainHref(id: StageId, subject: string): string {
  const base = STAGE_HREF[id];
  if (id === 'identify' || !subject.trim()) return base;
  return `${base}?subject=${encodeURIComponent(subject.trim())}`;
}

export default function StageWorkspace({ config }: { config: StageWorkspaceConfig }) {
  const meta = STAGES.find((s) => s.id === config.stage)!;
  const prev = STAGES[meta.number - 2]; // 1-indexed number → previous in array
  const next = STAGES[meta.number]; // number is 1-indexed, array next is at index = number

  const [draft, setDraft] = useState(config.defaultSubject);
  const [active, setActive] = useState(config.defaultSubject);
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [videoBroken, setVideoBroken] = useState(false);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const run = async (subject: string) => {
    setText(''); setCitations([]); setConfidence(null); setError(null); setStreaming(true);
    try {
      await streamAsk(config.prompt(subject), config.lane, (d) => setText((t) => t + d), (m) => {
        if (m.citations) setCitations(m.citations);
        if (m.confidence) setConfidence(m.confidence);
      });
    } catch {
      setError('The garden hit a snag generating this — please try again in a moment.');
    } finally { setStreaming(false); }
  };

  // On mount: prefill from ?subject= (chained from the previous stage) if present, else the default. Then auto-run.
  useEffect(() => {
    let subject = config.defaultSubject;
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('subject');
      if (fromUrl && fromUrl.trim()) subject = fromUrl.trim();
    } catch { /* ignore */ }
    setDraft(subject); setActive(subject);
    run(subject);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const submit = (s: string) => {
    const v = s.trim();
    if (!v || streaming) return;
    setActive(v); setDraft(v);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    run(v);
  };

  return (
    <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* HEADER */}
      <header className="border-b" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper)' }}>
        <div className="rail-wide py-9">
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>
            Stage {String(meta.number).padStart(2, '0')} of 07 · {meta.label}
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* developed stage specimen */}
              <div style={{ width: 78, height: 78, borderRadius: 4, border: '1px solid var(--paper-line)', overflow: 'hidden', flexShrink: 0, background: 'var(--paper-raised)' }}>
                {!videoBroken ? (
                  <video poster={`/icons/stage-${config.stage}.png`} autoPlay muted loop playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setVideoBroken(true)}>
                    <source src={`/icons/stage-${config.stage}.mp4`} type="video/mp4" />
                  </video>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={`/icons/stage-${config.stage}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', lineHeight: 1.02, letterSpacing: '-0.01em', color: 'var(--teal-deep)', margin: 0 }}>{config.title}</h1>
                <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--ink-soft)', margin: '6px 0 0', maxWidth: '46ch', lineHeight: 1.4 }}>{config.tagline}</p>
              </div>
            </div>
            {/* lifecycle position */}
            <div className="flex items-center gap-1.5" aria-hidden>
              {STAGES.map((s) => (
                <span key={s.id} title={s.label} style={{ width: s.id === config.stage ? 22 : 8, height: 8, borderRadius: 4, background: s.id === config.stage ? 'var(--tox)' : 'var(--paper-line)', transition: 'all 200ms' }} />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* EMERGENCY BANNER (act stage) */}
      {config.emergency && (
        <div style={{ background: 'rgba(165,58,45,0.08)', borderBottom: '1px solid var(--crimson)' }}>
          <div className="rail-wide" style={{ padding: '10px 0' }}>
            <span style={{ ...MONO, color: 'var(--crimson-deep)' }}>If this is a real emergency</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink)', marginLeft: 12 }}>
              Call <strong>Poison Control 1-800-222-1222</strong> (US) or your local emergency line now. This tool is decision support, not a substitute for emergency care.
            </span>
          </div>
        </div>
      )}

      {/* INPUT */}
      <section className="rail-wide pt-8">
        <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 10 }}>{config.inputLabel}</div>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: 10 }}>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder={config.placeholder}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '1.02rem', color: 'var(--ink)', padding: '8px 10px', lineHeight: 1.5 }} />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-2">
              {config.presets.map((p) => (
                <button key={p.label} type="button" onClick={() => submit(p.subject)} disabled={streaming}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--teal-deep)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '4px 9px', cursor: streaming ? 'default' : 'pointer' }}>{p.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => submit(draft)} disabled={streaming || !draft.trim()}
              style={{ background: 'var(--tox-deep)', color: 'var(--paper)', border: 'none', borderRadius: 3, padding: '9px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', opacity: streaming || !draft.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}>Run {meta.label} →</button>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="rail-wide py-8" ref={resultRef}>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--tox)', borderRadius: 4, boxShadow: '0 1px 0 var(--paper-line), 0 8px 22px rgba(44,61,84,0.08)', padding: '28px 30px' }}>
          <div className="flex items-center justify-between">
            <div style={{ ...MONO, color: 'var(--tox-deep)' }}>{config.outputLabel}</div>
            {streaming && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>working…</span>}
            {!streaming && confidence && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: confidence === 'high' ? '#3E5638' : confidence === 'medium' ? 'var(--peach-deep)' : 'var(--crimson-deep)' }}>confidence: {confidence}</span>}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginTop: 16, whiteSpace: 'pre-wrap', minHeight: 110 }}>
            {text}{streaming && <span className="tkg-caret" style={{ display: 'inline-block', width: 8, height: '1.05em', background: 'var(--tox)', marginLeft: 2, verticalAlign: '-2px' }} />}
          </div>
          {error && <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--crimson-deep)', background: 'rgba(165,58,45,0.08)', border: '1px solid var(--crimson)', borderRadius: 3, padding: '10px 12px' }}>{error}</div>}
          {citations.length > 0 && (
            <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--paper-line)' }}>
              <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 8 }}>Grounded in</div>
              <div className="flex flex-wrap gap-2">
                {citations.map((c, i) => (<Link key={i} href={c.link} className="no-underline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--teal-deep)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '3px 9px' }}>[{i + 1}] {c.display_name}</Link>))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CHAIN — the lifecycle nav */}
      <section className="rail-wide pb-16">
        <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 12 }}>One shape · continue the lifecycle</div>
        <div className="flex flex-wrap items-stretch gap-3">
          {prev && (
            <Link href={chainHref(prev.id, active)} className="no-underline" style={{ flex: '1 1 220px', background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ ...MONO, color: 'var(--ink-mute)' }}>← Back · stage {String(prev.number).padStart(2, '0')}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.15rem', color: 'var(--teal-deep)', marginTop: 3 }}>{prev.label}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: 2 }}>{prev.caption}</div>
            </Link>
          )}
          {next ? (
            <Link href={chainHref(next.id, active)} className="no-underline" style={{ flex: '1 1 220px', background: 'var(--tox-deep)', borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ ...MONO, color: 'rgba(242,233,210,0.7)' }}>Next · stage {String(next.number).padStart(2, '0')} →</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.15rem', color: 'var(--paper)', marginTop: 3 }}>{next.label}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(242,233,210,0.85)', marginTop: 2 }}>Carries this subject forward → {next.caption.toLowerCase()}</div>
            </Link>
          ) : (
            <Link href="/" className="no-underline" style={{ flex: '1 1 220px', background: 'var(--tox-deep)', borderRadius: 4, padding: '14px 16px' }}>
              <div style={{ ...MONO, color: 'rgba(242,233,210,0.7)' }}>Lifecycle complete ◉</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.15rem', color: 'var(--paper)', marginTop: 3 }}>Start a new one</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'rgba(242,233,210,0.85)', marginTop: 2 }}>Back to the garden</div>
            </Link>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/compound" className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>Browse compounds →</Link>
          <Link href="/reference" className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>Reference frameworks →</Link>
        </div>
      </section>
      <style>{`@keyframes tkgBlink{0%,49%{opacity:1}50%,100%{opacity:0}}.tkg-caret{animation:tkgBlink 1s steps(1) infinite}`}</style>
    </main>
  );
}
