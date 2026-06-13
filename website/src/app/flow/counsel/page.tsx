'use client';

/**
 * /flow/counsel — the Counsel Killer App.
 *
 * Modeled on the Builder's Knowledge Garden killer app: a case-centered
 * workspace, not a form wizard. It leads with an AI TAKE (a sharp, grounded
 * read of the case from the evidence graph via /api/ask, counsel lane), shows
 * the stakes (the deliverable + the paralegal hours/$ it replaces), and offers
 * "next moves" — each one generates a real deliverable from the graph. One
 * conversational input drives everything.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getCase } from '@/lib/queries-tox';

const CASE_SLUG = 'sky-valley';

/** The loaded sample case (identity is stable; live counts + the AI TAKE come from the graph). */
const CASE = {
  name: 'Erickson v. Monsanto',
  meta: 'Washington State · 2016 · toxic-tort',
  thesis: 'PCB exposure → non-Hodgkin lymphoma',
  expert: 'James G. Dahlgren, M.D.',
  substances: ['PCBs', 'Dioxins'],
};
const CTX = `${CASE.name} (${CASE.thesis})`;
// Seed terms so the grounding search retrieves the PCB carcinogenicity claims + sources, not just the expert row.
const SEED = 'PCBs, dioxins, carcinogenicity, non-Hodgkin lymphoma, IARC. ';

type Move = { key: string; title: string; sub: string; prompt: string };
const MOVES: Move[] = [
  { key: 'daubert', title: 'Build the Daubert table', sub: 'Certified vs. contested support, per claim', prompt: `${SEED}For ${CTX}, build the Daubert posture table: for each major causation claim, give the regulatory/tier-1 support, the peer-reviewed support, and any contested or contradicting sources, then rate admissibility risk (low/medium/high).` },
  { key: 'theory', title: 'Draft the theory of harm', sub: 'Exposure → mechanism → injury chain', prompt: `${SEED}For ${CTX}, lay out the theory of harm as a causal chain — exposure pathway, then biological mechanism, then the diagnosed injury — and cite the strongest evidence at each link.` },
  { key: 'depose', title: 'What to depose', sub: 'Highest-leverage questions for opposing experts', prompt: `${SEED}For ${CTX}, list the highest-leverage deposition questions to put to the opposing experts, each aimed at the weakest link in the defense's causation argument.` },
  { key: 'evidence', title: 'Strongest & weakest evidence', sub: 'Where the case is solid — and exposed', prompt: `${SEED}For ${CTX}, name the single strongest piece of evidence and the single biggest evidentiary vulnerability, each with its source and tier.` },
];

const TAKE_PROMPT = `${SEED}Give me your read on ${CTX} for ${CASE.expert} as lead expert. Cover, tightly: the theory of harm, the Daubert posture (what's certified vs. contested), the strongest piece of evidence and the biggest vulnerability, and what to prioritize first.`;

type Citation = { entity_type: string; display_name: string; link: string };

async function streamAsk(
  question: string,
  onDelta: (t: string) => void,
  onMeta: (m: { citations?: Citation[]; confidence?: string }) => void
): Promise<void> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, lane: 'counsel' }),
  });
  if (!res.ok || !res.body) throw new Error(`ask failed (${res.status})`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop() ?? '';
    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const evt = JSON.parse(payload);
        if (evt.type === 'text_delta') onDelta(evt.delta as string);
        else if (evt.type === 'metadata') onMeta(evt);
        else if (evt.type === 'error') throw new Error(evt.message);
      } catch { /* ignore partial frames */ }
    }
  }
}

const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 };

export default function CounselKillerApp() {
  const [docs, setDocs] = useState<{ d: number; e: number; x: number } | null>(null);
  const [label, setLabel] = useState('AI take · counsel lane');
  const [text, setText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [citations, setCitations] = useState<Citation[]>([]);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [ask, setAsk] = useState('');
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Live case counts from the graph (best-effort; identity is stable above).
  useEffect(() => {
    let cancelled = false;
    getCase(CASE_SLUG)
      .then((c) => {
        if (!cancelled && c) setDocs({ d: c.documents?.length ?? 0, e: c.events?.length ?? 0, x: c.experts?.length ?? 0 });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const run = async (question: string, lbl: string) => {
    setLabel(lbl);
    setText('');
    setCitations([]);
    setConfidence(null);
    setError(null);
    setStreaming(true);
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      await streamAsk(question, (d) => setText((t) => t + d), (m) => {
        if (m.citations) setCitations(m.citations);
        if (m.confidence) setConfidence(m.confidence);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The garden could not reach Claude. Confirm ANTHROPIC_API_KEY on the deployment.');
    } finally {
      setStreaming(false);
    }
  };

  // Auto-run the AI TAKE on mount.
  useEffect(() => { run(TAKE_PROMPT, 'AI take · counsel lane'); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  return (
    <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* CASE HEADER */}
      <header className="border-b" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper)' }}>
        <div className="rail-wide py-9">
          <div style={{ ...MONO, color: 'var(--ink-mute)' }}>Counsel workspace · loaded sample case</div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', lineHeight: 1.02, letterSpacing: '-0.01em', color: 'var(--teal-deep)', margin: 0 }}>
                {CASE.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-mute)' }}>
                <span>{CASE.meta}</span><span style={{ opacity: 0.5 }}>·</span>
                <span>Lead expert: {CASE.expert}</span>
                {docs && (<><span style={{ opacity: 0.5 }}>·</span><span>{docs.d} documents · {docs.e} timeline events · {docs.x} experts</span></>)}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CASE.substances.map((s) => (
                  <Link key={s} href={`/compound/${s.toLowerCase()}`} className="no-underline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--teal-deep)', background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '3px 9px' }}>{s}</Link>
                ))}
              </div>
            </div>
            {/* Stakes */}
            <div style={{ border: '1px solid var(--paper-line)', borderLeft: '3px solid var(--copper-orn)', background: 'var(--paper-raised)', borderRadius: 4, padding: '12px 16px', minWidth: 230 }}>
              <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Deliverable</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.15rem', color: 'var(--ink)', marginTop: 2 }}>Case-Prep Exhibit Packet</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--ink-soft)', marginTop: 4 }}>
                Replaces <strong style={{ color: 'var(--ink)' }}>~40 paralegal hrs</strong> · ~<strong style={{ color: 'var(--ink)' }}>$10,000</strong>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* AI TAKE / RESULT PANEL */}
      <section className="rail-wide py-10" ref={resultRef}>
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--tox)', borderRadius: 4, boxShadow: '0 1px 0 var(--paper-line), 0 8px 22px rgba(44,61,84,0.08)', padding: '28px 30px' }}>
          <div className="flex items-center justify-between">
            <div style={{ ...MONO, color: 'var(--tox-deep)' }}>{label}</div>
            {streaming && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>reading the case…</span>}
            {!streaming && confidence && <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: confidence === 'high' ? '#3E5638' : confidence === 'medium' ? 'var(--peach-deep)' : 'var(--crimson-deep)' }}>confidence: {confidence}</span>}
          </div>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--ink-soft)', marginTop: 16, whiteSpace: 'pre-wrap', minHeight: 120 }}>
            {text}
            {streaming && <span className="tkg-caret" style={{ display: 'inline-block', width: 8, height: '1.05em', background: 'var(--tox)', marginLeft: 2, verticalAlign: '-2px' }} />}
          </div>

          {error && (
            <div style={{ marginTop: 14, fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--crimson-deep)', background: 'rgba(165,58,45,0.08)', border: '1px solid var(--crimson)', borderRadius: 3, padding: '10px 12px' }}>{error}</div>
          )}

          {citations.length > 0 && (
            <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--paper-line)' }}>
              <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 8 }}>Grounded in</div>
              <div className="flex flex-wrap gap-2">
                {citations.map((c, i) => (
                  <Link key={i} href={c.link} className="no-underline" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--teal-deep)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '3px 9px' }}>
                    [{i + 1}] {c.display_name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NEXT MOVES */}
      <section className="rail-wide pb-8">
        <div style={{ ...MONO, color: 'var(--ink-mute)', marginBottom: 14 }}>Choose your next move</div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MOVES.map((m) => (
            <button key={m.key} type="button" onClick={() => run(m.prompt, m.title)} disabled={streaming}
              className="group text-left transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '18px 18px 20px', cursor: streaming ? 'default' : 'pointer' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem', color: 'var(--ink)' }}>{m.title} <span aria-hidden style={{ color: 'var(--copper-orn)' }}>→</span></div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--ink-soft)', marginTop: 5, lineHeight: 1.4 }}>{m.sub}</div>
            </button>
          ))}
        </div>
      </section>

      {/* ASK THE GARDEN (case-scoped) */}
      <section className="rail-wide pb-16">
        <form onSubmit={(e) => { e.preventDefault(); const q = ask.trim(); if (q && !streaming) { run(`${SEED}${q}  (in the context of ${CTX})`, 'Your question'); setAsk(''); } }}
          className="flex items-center gap-2" style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: 8 }}>
          <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask anything about this case — the garden answers from the evidence graph"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink)', padding: '8px 10px' }} />
          <button type="submit" disabled={streaming || !ask.trim()} style={{ background: 'var(--tox-deep)', color: 'var(--paper)', border: 'none', borderRadius: 3, padding: '10px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', opacity: streaming || !ask.trim() ? 0.5 : 1 }}>Ask the garden</button>
        </form>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/counsel-brief" className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>Read the full counsel brief →</Link>
          <Link href="/case/sky-valley" className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>Open the case dossier →</Link>
        </div>
      </section>

      <style>{`@keyframes tkgBlink{0%,49%{opacity:1}50%,100%{opacity:0}}.tkg-caret{animation:tkgBlink 1s steps(1) infinite}`}</style>
    </main>
  );
}
