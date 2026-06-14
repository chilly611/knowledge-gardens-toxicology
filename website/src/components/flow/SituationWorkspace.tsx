'use client';

/**
 * SituationWorkspace — the killer-app shell for the situation-driven lanes
 * (Doctor, Consumer). Same anatomy as the Counsel workspace, but instead of a
 * fixed loaded case it opens with a situation the user can edit or pick from
 * presets: describe the situation → live AI TAKE (grounded, via /api/ask) →
 * next-move cards (each regenerates a deliverable) → ask-the-garden. Driven
 * entirely by a per-lane config.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { streamAsk, type Citation, type AskLane } from '@/lib/ask-stream';

export type Move = { key: string; title: string; sub: string; prompt: (situation: string) => string };
export type WorkspaceConfig = {
  lane: AskLane;
  plate?: string;
  eyebrow: string;
  title: string;
  deliverable: string;
  deliverableSub: string;
  inputLabel: string;
  placeholder: string;
  defaultSituation: string;
  takeLabel: string;
  takePrompt: (situation: string) => string;
  presets: { label: string; situation: string }[];
  moves: Move[];
  footerLinks?: { href: string; label: string }[];
};

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 };

export default function SituationWorkspace({ config }: { config: WorkspaceConfig }) {
  const [draft, setDraft] = useState(config.defaultSituation);
  const [active, setActive] = useState(config.defaultSituation);
  const [label, setLabel] = useState(config.takeLabel);
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [ask, setAsk] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);

  const run = async (question: string, lbl: string) => {
    setLabel(lbl); setText(''); setCitations([]); setConfidence(null); setError(null); setStreaming(true);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      await streamAsk(question, config.lane, (d) => setText((t) => t + d), (m) => {
        if (m.citations) setCitations(m.citations);
        if (m.confidence) setConfidence(m.confidence);
      });
    } catch {
      setError('The garden could not generate this right now — the AI service is unavailable. If this persists on the live site, the deployment is missing a valid ANTHROPIC_API_KEY.');
    } finally { setStreaming(false); }
  };

  useEffect(() => { run(config.takePrompt(config.defaultSituation), config.takeLabel); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  const submitSituation = (s: string) => {
    const v = s.trim();
    if (!v || streaming) return;
    setActive(v); setDraft(v);
    run(config.takePrompt(v), config.takeLabel);
  };

  return (
    <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* HEADER */}
      <header className="border-b" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper)' }}>
        <div className="rail-wide py-9">
          <div style={{ ...MONO, color: 'var(--ink-mute)' }}>{config.eyebrow}</div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div className="flex items-center gap-4">
              {config.plate && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={config.plate} alt="" style={{ width: 76, height: 76, objectFit: 'cover', objectPosition: 'center 26%', borderRadius: 4, border: '1px solid var(--paper-line)', flexShrink: 0 }} />
              )}
              <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', lineHeight: 1.02, letterSpacing: '-0.01em', color: 'var(--teal-deep)', margin: 0 }}>{config.title}</h1>
            </div>
            <div style={{ border: '1px solid var(--paper-line)', borderLeft: '3px solid var(--copper-orn)', background: 'var(--paper-raised)', borderRadius: 4, padding: '12px 16px', minWidth: 230 }}>
              <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Deliverable</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.15rem', color: 'var(--ink)', marginTop: 2 }}>{config.deliverable}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: 4 }}>{config.deliverableSub}</div>
            </div>
          </div>
        </div>
      </header>

      {/* SITUATION INPUT */}
      <section className="rail-wide pt-8">
        <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 10 }}>{config.inputLabel}</div>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: 10 }}>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder={config.placeholder}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '1.02rem', color: 'var(--ink)', padding: '8px 10px', lineHeight: 1.5 }} />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap gap-2">
              {config.presets.map((p) => (
                <button key={p.label} type="button" onClick={() => submitSituation(p.situation)} disabled={streaming}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--teal-deep)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '4px 9px', cursor: streaming ? 'default' : 'pointer' }}>{p.label}</button>
              ))}
            </div>
            <button type="button" onClick={() => submitSituation(draft)} disabled={streaming || !draft.trim()}
              style={{ background: 'var(--tox-deep)', color: 'var(--paper)', border: 'none', borderRadius: 3, padding: '9px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', opacity: streaming || !draft.trim() ? 0.5 : 1, whiteSpace: 'nowrap' }}>Get the take →</button>
          </div>
        </div>
      </section>

      {/* RESULT PANEL */}
      <section className="rail-wide py-8" ref={resultRef}>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--tox)', borderRadius: 4, boxShadow: '0 1px 0 var(--paper-line), 0 8px 22px rgba(44,61,84,0.08)', padding: '28px 30px' }}>
          <div className="flex items-center justify-between">
            <div style={{ ...MONO, color: 'var(--tox-deep)' }}>{label}</div>
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

      {/* NEXT MOVES */}
      <section className="rail-wide pb-8">
        <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 14 }}>Choose your next move</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {config.moves.map((m) => (
            <button key={m.key} type="button" onClick={() => run(m.prompt(active), m.title)} disabled={streaming}
              className="group text-left transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '18px 18px 20px', cursor: streaming ? 'default' : 'pointer' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>{m.title} <span aria-hidden style={{ color: 'var(--copper-orn)' }}>→</span></div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-soft)', marginTop: 5, lineHeight: 1.4 }}>{m.sub}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ASK */}
      <section className="rail-wide pb-16">
        <form onSubmit={(e) => { e.preventDefault(); const q = ask.trim(); if (q && !streaming) { run(`${active}. ${q}`, 'Your question'); setAsk(''); } }}
          className="flex items-center gap-2" style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: 8 }}>
          <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask a follow-up — answered from the evidence graph"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink)', padding: '8px 10px' }} />
          <button type="submit" disabled={streaming || !ask.trim()} style={{ background: 'var(--tox-deep)', color: 'var(--paper)', border: 'none', borderRadius: 3, padding: '10px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', opacity: streaming || !ask.trim() ? 0.5 : 1 }}>Ask the garden</button>
        </form>
        {config.footerLinks && config.footerLinks.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            {config.footerLinks.map((l) => (<Link key={l.href} href={l.href} className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>{l.label} →</Link>))}
          </div>
        )}
      </section>
      <style>{`@keyframes tkgBlink{0%,49%{opacity:1}50%,100%{opacity:0}}.tkg-caret{animation:tkgBlink 1s steps(1) infinite}`}</style>
    </main>
  );
}
