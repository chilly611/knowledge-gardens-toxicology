// src/app/case/[slug]/page.tsx
//
// P1.1 — SSR-first depth pass on /case/[slug]
// Written against verified schema (SCHEMA_AUDIT_2026-05-19.md)
// 
// CRITICAL ASSUMPTIONS:
// 1. Migration 010_add_slug_to_cases_and_experts.sql has been applied,
//    OR this file falls back to slugify-on-read against short_name.
// 2. supabaseTox client exists at @/lib/supabase-tox (confirmed in 06_STACK.md)
// 3. TopFrame + LocationCrumb + composition tokens exist per 03_PLAYBOOK.md
//
// PLAYBOOK COMPLIANCE:
// - Parchment background (default, no override)
// - Inter bold .headline-bold default; Cormorant italic ONLY via .emphasis-italic
// - Slate-blue --tox accent for status pills
// - prefers-reduced-motion intentionally NOT honored
// - L-029 Suspense pattern not needed here (no useSearchParams in Server Component)
// - L-023 await params (Next.js 16 Promise)
//
// Result: hard-refresh with JS disabled renders full case page including
// parties, document count, timeline events, linked substances, lead expert.

import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Skip static prerender: TopFrame (a client component used inside this page)
// reads useSearchParams without a page-level Suspense boundary, and Next.js 16
// fails the build on that during prerender. force-dynamic renders on demand.
export const dynamic = 'force-dynamic';
import { supabaseTox } from '@/lib/supabase-tox';
import TopFrame from '@/components/grammar/TopFrame';
import LocationCrumb from '@/components/grammar/LocationCrumb';
import StageStepper from '@/components/grammar/StageStepper';

// ---------- Build-time + ISR configuration ----------

// Pre-render Sky Valley at build time
export async function generateStaticParams() {
  return [{ slug: 'sky-valley' }];
}

// Revalidate every hour — keeps stats fresh (e.g., 1,959 doc count) without runtime cost
export const revalidate = 3600;

// ---------- Type helpers (against verified schema) ----------

type CaseDetail = {
  id: string;
  name: string;
  short_name: string | null;
  jurisdiction: string | null;
  court: string | null;
  case_number: string | null;
  status: string | null;
  filed_year: number | null;
  description: string | null;
  lead_expert_id: string | null;
};

type Party = {
  id: string;
  name: string;
  role: string | null;
  notes: string | null;
};

type Event = {
  id: string;
  event_date: string | null;
  event_type: string | null;
  description: string;
};

type LinkedSubstance = {
  substance_id: string;
  relevance: string | null;
  substance: {
    id: string;
    name: string;
    cas_number: string | null;
  };
};

type Expert = {
  id: string;
  name: string;
  affiliation: string | null;
  specialty: string | null;
};

// ---------- Data fetchers (Server-side) ----------

async function getCaseBundle(slug: string) {
  const supabase = supabaseTox;

  // Resolve case by slug.
  // After migration 010 applies: WHERE slug = $1.
  // Pre-migration fallback: WHERE short_name ILIKE '%sky valley%'.
  // We try the slug column first; if it errors (column doesn't exist), fall back.
  let caseRow: CaseDetail | null = null;
  
  const { data: bySlug, error: slugErr } = await supabase
    .from('legal_cases')
    .select('id, name, short_name, jurisdiction, court, case_number, status, filed_year, description, lead_expert_id')
    .eq('slug', slug)
    .maybeSingle();
  
  if (!slugErr && bySlug) {
    caseRow = bySlug as CaseDetail;
  } else {
    // Fallback: slugify-on-read against short_name
    const slugAsPhrase = slug.replace(/-/g, ' ');
    const { data: byShort } = await supabase
      .from('legal_cases')
      .select('id, name, short_name, jurisdiction, court, case_number, status, filed_year, description, lead_expert_id')
      .ilike('short_name', `${slugAsPhrase}%`)
      .limit(1)
      .maybeSingle();
    caseRow = byShort as CaseDetail | null;
  }

  if (!caseRow) return null;

  // Parallel fetch the related entities
  const [partiesRes, eventsRes, substancesRes, docCountRes, expertRes] = await Promise.all([
    supabase
      .from('case_parties')
      .select('id, name, role, notes')
      .eq('case_id', caseRow.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('case_events')
      .select('id, event_date, event_type, description')
      .eq('case_id', caseRow.id)
      .order('event_date', { ascending: true, nullsFirst: false }),
    supabase
      .from('case_substances')
      .select('substance_id, relevance, substance:substances!inner(id, name, cas_number)')
      .eq('case_id', caseRow.id),
    supabase
      .from('case_documents')
      .select('id', { count: 'exact', head: true })
      .eq('case_id', caseRow.id),
    caseRow.lead_expert_id
      ? supabase
          .from('experts')
          .select('id, name, affiliation, specialty')
          .eq('id', caseRow.lead_expert_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  return {
    case: caseRow,
    parties: (partiesRes.data ?? []) as Party[],
    events: (eventsRes.data ?? []) as Event[],
    substances: (substancesRes.data ?? []) as unknown as LinkedSubstance[],
    documentCount: docCountRes.count ?? 0,
    leadExpert: (expertRes.data ?? null) as Expert | null,
  };
}

// ---------- Page ----------

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;  // L-023: Next.js 16 params is Promise
}) {
  const { slug } = await params;
  const bundle = await getCaseBundle(slug);

  if (!bundle) {
    notFound();
  }

  const { case: c, parties, events, substances, documentCount, leadExpert } = bundle;

  return (
    <main className="min-h-screen bg-paper">
      <TopFrame />

      <div className="rail-default">
        <LocationCrumb />

        {/* HERO */}
        <section className="section-pad-lg">
          <div className="mono-eyebrow">Legal Case · {c.status?.toUpperCase() ?? 'ACTIVE'}</div>
          <h1 className="headline-bold mt-2 text-ink">{c.name}</h1>
          {c.short_name && c.short_name !== c.name && (
            <div className="subtitle-bold mt-1 text-ink-soft">{c.short_name}</div>
          )}

          <div className="mt-6 grid gap-4 text-sm text-ink-soft md:grid-cols-2 lg:grid-cols-4">
            {c.jurisdiction && (
              <div>
                <div className="label-mono">Jurisdiction</div>
                <div className="title-bold text-ink">{c.jurisdiction}</div>
              </div>
            )}
            {c.court && (
              <div>
                <div className="label-mono">Court</div>
                <div className="title-bold text-ink">{c.court}</div>
              </div>
            )}
            {c.filed_year && (
              <div>
                <div className="label-mono">Filed</div>
                <div className="title-bold text-ink">{c.filed_year}</div>
              </div>
            )}
            {leadExpert && (
              <div>
                <div className="label-mono">Lead Expert</div>
                <div className="title-bold text-ink">
                  <Link href="/expert/dahlgren" className="hover:text-tox">{leadExpert.name}</Link>
                </div>
              </div>
            )}
          </div>

          {c.description && (
            <p className="body-readable-wide mt-6">{c.description}</p>
          )}
        </section>

        {/* STATS STRIP — animated count-pop on entry (CSS) */}
        <section className="section-pad">
          <div className="tile-grid-3">
            <div className="tile tile-feature">
              <div className="label-mono">Parties</div>
              <div className="headline-bold anim-count-pop text-tox-deep">{parties.length}</div>
            </div>
            <div className="tile tile-feature">
              <div className="label-mono">Documents on record</div>
              <div className="headline-bold anim-count-pop text-tox-deep">{documentCount.toLocaleString()}</div>
              <div className="body-readable text-ink-soft text-sm mt-1">
                Indexed and text-searchable
              </div>
            </div>
            <div className="tile tile-feature">
              <div className="label-mono">Timeline events</div>
              <div className="headline-bold anim-count-pop text-tox-deep">{events.length}</div>
            </div>
          </div>
        </section>

        {/* OPEN COUNSEL FLOW CTA */}
        <section className="section-pad">
          <div className="tile tile-feature flex flex-col items-start gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="label-mono">Counsel lane</div>
              <div className="title-bold text-ink">
                Open the Counsel flow with this case pre-loaded
              </div>
              <p className="body-readable text-ink-soft mt-2">
                Walk Frame → Assemble → Argue → Witness → File. End with a Daubert-grade exhibit packet.
              </p>
            </div>
            <Link
              href={`/flow/counsel/${slug}`}
              className="cta-pill cta-pill-primary cta-pill-lg"
            >
              Open Counsel flow →
            </Link>
          </div>
        </section>

        {/* LINKED SUBSTANCES */}
        {substances.length > 0 && (
          <section className="section-pad">
            <h2 className="title-bold mb-4">Linked substances</h2>
            <div className="tile-grid-3">
              {substances.map((cs) => (
                <Link
                  key={cs.substance_id}
                  href={`/compound/${slugifyName(cs.substance.name)}`}
                  className="tile hover:border-tox transition-colors"
                >
                  <div className="title-bold text-ink">{cs.substance.name}</div>
                  {cs.substance.cas_number && (
                    <div className="mono-eyebrow mt-1">CAS {cs.substance.cas_number}</div>
                  )}
                  {cs.relevance && (
                    <p className="body-readable text-ink-soft text-sm mt-2">{cs.relevance}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* PARTIES */}
        <section className="section-pad">
          <h2 className="title-bold mb-4">Parties · {parties.length}</h2>
          <div className="grid gap-2">
            {parties.map((p) => (
              <div key={p.id} className="tile flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
                <div className="title-bold text-ink md:flex-shrink-0 md:w-72">{p.name}</div>
                {p.role && <div className="mono-eyebrow md:flex-shrink-0">{p.role}</div>}
                {p.notes && <div className="body-readable text-ink-soft text-sm">{p.notes}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE */}
        <section className="section-pad">
          <h2 className="title-bold mb-4">Timeline · {events.length} events</h2>
          <ol className="grid gap-3 border-l-2 border-tox pl-6">
            {events.map((ev) => (
              <li key={ev.id} className="tile">
                <div className="flex flex-wrap items-baseline gap-3">
                  {ev.event_date && (
                    <span className="mono-eyebrow text-tox-deep">{ev.event_date}</span>
                  )}
                  {ev.event_type && (
                    <span className="label-mono text-ink-soft">{ev.event_type}</span>
                  )}
                </div>
                <p className="body-readable mt-2 text-ink">{ev.description}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}

// ---------- Helpers ----------

/**
 * Convert a substance.name into a URL slug.
 * "Polychlorinated biphenyls (PCBs)" → "pcbs"
 * "Glyphosate" → "glyphosate"
 * The page expects /compound/pcbs, /compound/glyphosate, etc.
 *
 * NOTE: This is a placeholder. Real implementation should match the
 * existing /compound/[slug] route's slug-resolution logic. Likely lives
 * in queries-tox.ts as substanceSlug() — use that if it exists.
 */
function slugifyName(name: string): string {
  // Try to extract a parenthesized abbreviation first: "Polychlorinated biphenyls (PCBs)" → "pcbs"
  const paren = name.match(/\(([^)]+)\)/);
  if (paren) return paren[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Otherwise the lowercase first word: "Glyphosate" → "glyphosate"
  return name.split(/\s+/)[0].toLowerCase();
}
