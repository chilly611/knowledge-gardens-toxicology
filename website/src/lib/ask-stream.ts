/**
 * Shared client helper: POST a question to /api/ask and stream the grounded,
 * cited, lane-aware Claude response (SSE: data: {type:'text_delta'|'metadata'|'error'}).
 * Parses defensively — partial JSON frames are skipped, but a real error event
 * propagates (so callers can surface it instead of silently rendering empty).
 */
export type Citation = { entity_type: string; display_name: string; link: string };
export type AskLane = 'counsel' | 'clinician' | 'consumer';

export async function streamAsk(
  question: string,
  lane: AskLane,
  onDelta: (t: string) => void,
  onMeta: (m: { citations?: Citation[]; confidence?: string }) => void
): Promise<void> {
  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, lane }),
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
      let evt: { type?: string; delta?: string; message?: string; citations?: Citation[]; confidence?: string } | null = null;
      try { evt = JSON.parse(payload); } catch { continue; }
      if (!evt) continue;
      if (evt.type === 'text_delta') onDelta(evt.delta ?? '');
      else if (evt.type === 'metadata') onMeta(evt);
      else if (evt.type === 'error') throw new Error(evt.message || 'The garden hit an error generating this.');
    }
  }
}
