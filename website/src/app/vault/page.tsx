'use client';

/**
 * /vault — the authenticated Sky Valley case-file workspace.
 *
 * The document corpus (case_documents) is gated to authenticated sessions by
 * RLS (migration `gate_case_documents_corpus_behind_auth`). This page signs a
 * user in with email + password and reads the corpus through a DEDICATED
 * Supabase client whose session is isolated from the public site (its own
 * storageKey + persistSession), so signing into the vault never changes how the
 * rest of the (anon) site behaves.
 *
 * Access is limited to seeded accounts (counsel allowlist + a demo login).
 */
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { createClient, type Session } from '@supabase/supabase-js';

const DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1I0iDhmvltPKeA52LaQI6YO8BZEP1XbYK';

// Placeholder fallbacks keep module import from throwing at build time when the
// env vars aren't present; real queries still fail loudly against the placeholder.
const vault = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_TOX_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_TOX_ANON_KEY || 'placeholder-anon-key',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: 'tkg-vault-auth' } }
);

type Doc = {
  id: string;
  title: string;
  doc_type: string | null;
  document_date: string | null;
  notes: string | null;
  drive_path: string | null;
  source_url: string | null;
};

const DOC_TYPES = ['expert_report', 'deposition', 'motion', 'order', 'complaint', 'exhibit', 'correspondence', 'transcript', 'other'];
const MONO: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700 };

export default function VaultPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // corpus
  const [docs, setDocs] = useState<Doc[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [term, setTerm] = useState('');
  const [docType, setDocType] = useState('');
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [active, setActive] = useState<Doc | null>(null);

  useEffect(() => {
    vault.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: sub } = vault.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadDocs = useCallback(async () => {
    setLoadingDocs(true);
    const clean = term.trim().replace(/[,()%*]/g, ' ').trim();
    let q = vault
      .from('case_documents')
      .select('id,title,doc_type,document_date,notes,drive_path,source_url', { count: 'estimated' });
    if (docType) q = q.eq('doc_type', docType);
    if (clean) q = q.or(`title.ilike.%${clean}%,notes.ilike.%${clean}%`);
    q = q.order('document_date', { ascending: false, nullsFirst: false }).limit(80);
    const { data, count: c, error } = await q;
    if (!error) { setDocs((data ?? []) as Doc[]); setCount(c ?? null); }
    setLoadingDocs(false);
  }, [term, docType]);

  useEffect(() => { if (session) loadDocs(); }, [session, loadDocs]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr(null); setLoggingIn(true);
    const { error } = await vault.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setLoginErr(error.message === 'Invalid login credentials' ? 'That email and password combination was not recognized.' : error.message);
    setLoggingIn(false);
  };

  // ---- not signed in: login gate ----
  if (authReady && !session) {
    return (
      <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
        <div className="rail-default" style={{ maxWidth: 460, paddingTop: '12vh', paddingBottom: 80 }}>
          <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Confidential · Sky Valley case file</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.4rem,5vw,3.4rem)', color: 'var(--teal-deep)', lineHeight: 1.05, margin: '12px 0 10px' }}>
            The case file.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 26 }}>
            Access is restricted to authorized counsel and retained experts. This corpus contains protected medical records and personal data — handle accordingly.
          </p>
          <form onSubmit={signIn} style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--tox)', borderRadius: 5, padding: 22 }}>
            <label style={{ ...MONO, color: 'var(--ink-mute)', display: 'block', marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required
              style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink)', marginBottom: 14, outline: 'none' }} />
            <label style={{ ...MONO, color: 'var(--ink-mute)', display: 'block', marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required
              style={{ width: '100%', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ink)', marginBottom: 18, outline: 'none' }} />
            {loginErr && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--crimson-deep)', background: 'rgba(165,58,45,0.08)', border: '1px solid var(--crimson)', borderRadius: 3, padding: '8px 10px', marginBottom: 14 }}>{loginErr}</div>}
            <button type="submit" disabled={loggingIn || !email.trim() || !password}
              style={{ width: '100%', background: 'var(--tox-deep)', color: 'var(--paper)', border: 'none', borderRadius: 4, padding: '11px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', opacity: loggingIn || !email.trim() || !password ? 0.5 : 1 }}>
              {loggingIn ? 'Entering…' : 'Enter the case file →'}
            </button>
          </form>
          <div className="mt-6">
            <Link href="/case/sky-valley" className="no-underline" style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--teal-deep)' }}>← Back to the public case summary</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!authReady) {
    return <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}><div className="rail-default py-24" style={{ ...MONO, color: 'var(--ink-mute)' }}>Opening the case file…</div></main>;
  }

  // ---- signed in: corpus browser ----
  return (
    <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* header */}
      <header className="border-b" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper)' }}>
        <div className="rail-wide py-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div style={{ ...MONO, color: 'var(--copper-orn-deep)' }}>Confidential case file · authorized access</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2rem,4vw,3rem)', color: 'var(--teal-deep)', lineHeight: 1.05, margin: '6px 0 0' }}>
              Erickson v. Monsanto — the case file
            </h1>
          </div>
          <div className="flex items-center gap-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-mute)' }}>
            <span>{session?.user?.email}</span>
            <button onClick={() => vault.auth.signOut()} style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '5px 11px', fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)', cursor: 'pointer' }}>Sign out</button>
          </div>
        </div>
      </header>

      {/* demo-tier notice */}
      {session?.user?.app_metadata?.vault_tier === 'demo' && (
        <div style={{ background: 'rgba(176,141,92,0.14)', borderBottom: '1px solid var(--brass-line, var(--paper-line))' }}>
          <div className="rail-wide" style={{ padding: '9px 0', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.04em', color: 'var(--copper-orn-deep)' }}>
            <strong style={{ letterSpacing: '0.12em' }}>DEMO ACCESS</strong> — showing the published scientific literature only. Confidential medical records and personal case files are restricted to authorized accounts.
          </div>
        </div>
      )}

      {/* controls */}
      <section className="rail-wide pt-7">
        <div className="flex flex-wrap items-center gap-3">
          <input value={term} onChange={(e) => setTerm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') loadDocs(); }}
            placeholder="Search titles and document text…"
            style={{ flex: '1 1 320px', background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '10px 13px', fontFamily: 'var(--font-body)', fontSize: '0.98rem', color: 'var(--ink)', outline: 'none' }} />
          <select value={docType} onChange={(e) => setDocType(e.target.value)}
            style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <option value="">All types</option>
            {DOC_TYPES.map((t) => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
          </select>
          <button onClick={loadDocs} disabled={loadingDocs} style={{ background: 'var(--tox-deep)', color: 'var(--paper)', border: 'none', borderRadius: 4, padding: '10px 18px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', opacity: loadingDocs ? 0.5 : 1 }}>Search</button>
        </div>
        <div className="mt-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-mute)', letterSpacing: '0.04em' }}>
          {loadingDocs ? 'loading…' : `showing ${docs.length}${count != null ? ` of ~${count.toLocaleString()}` : ''} documents${term || docType ? ' · filtered' : ' · 1,959 in the corpus'}`}
        </div>
      </section>

      {/* split: list + detail */}
      <section className="rail-wide py-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* list */}
        <div className="flex flex-col gap-2" style={{ maxHeight: '72vh', overflowY: 'auto', paddingRight: 4 }}>
          {docs.map((d) => (
            <button key={d.id} type="button" onClick={() => setActive(d)}
              className="text-left transition-transform hover:-translate-y-0.5"
              style={{ background: active?.id === d.id ? 'var(--paper-raised)' : 'var(--paper)', border: '1px solid var(--paper-line)', borderLeft: `3px solid ${active?.id === d.id ? 'var(--tox)' : 'var(--paper-line)'}`, borderRadius: 4, padding: '11px 14px', cursor: 'pointer' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35 }}>{d.title}</div>
              <div className="mt-1 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-mute)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                <span style={{ color: 'var(--teal-deep)' }}>{(d.doc_type ?? 'other').replace('_', ' ')}</span>
                {d.document_date && <><span style={{ opacity: 0.5 }}>·</span><span>{d.document_date}</span></>}
              </div>
            </button>
          ))}
          {!loadingDocs && docs.length === 0 && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--ink-mute)' }}>No documents match.</div>}
        </div>

        {/* detail */}
        <div style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: '3px solid var(--tox)', borderRadius: 5, padding: '22px 24px', maxHeight: '72vh', overflowY: 'auto' }}>
          {active ? (
            <>
              <div style={{ ...MONO, color: 'var(--tox-deep)' }}>{(active.doc_type ?? 'document').replace('_', ' ')}{active.document_date ? ` · ${active.document_date}` : ''}</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.5rem', color: 'var(--ink)', lineHeight: 1.2, margin: '8px 0 14px' }}>{active.title}</h2>
              <a href={active.source_url || active.drive_path || DRIVE_FOLDER} target="_blank" rel="noopener noreferrer" className="no-underline"
                style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--teal-deep)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '5px 11px', marginBottom: 16 }}>
                {active.source_url || active.drive_path ? 'Open source ↗' : 'Find in Drive ↗'}
              </a>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--ink-soft)', whiteSpace: 'pre-wrap', borderTop: '1px solid var(--paper-line)', paddingTop: 16 }}>
                {active.notes && active.notes.trim().length > 1 ? active.notes : 'No extracted text is available for this document. Use “Find in Drive” to open the original file.'}
              </div>
            </>
          ) : (
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-mute)', lineHeight: 1.6 }}>
              Select a document to read its extracted text. Search by keyword or filter by type. The full corpus — depositions, expert reports, exhibits, motions, and correspondence — is held here under restricted access.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
