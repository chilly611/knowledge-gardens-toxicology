'use client';

/**
 * /compound/[slug] — the Compound, as a specimen plate.
 *
 * Rebuilt to the design system's tabbed entity (Claude Design handoff bundle):
 * an entity header with the compound name in Cormorant italic teal + verified/
 * status badges, a Dreamer/Pro reading toggle, and four clickable tabs —
 * Hazard · Profile · Response · Citations — each a single panel (no
 * scroll-through layers). A Poison Control safety bar and a JSON-LD
 * machine-endpoint footer close the plate. Real claim + source data drives it.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSubstance, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import type { Substance, CertifiedClaimRow, EvidenceSource } from '@/lib/types-tox';

type Props = { params: Promise<{ slug: string }> };
type Tab = 'hazard' | 'profile' | 'response' | 'citations';

const TABS: { id: Tab; label: string }[] = [
  { id: 'hazard', label: 'Hazard' },
  { id: 'profile', label: 'Profile' },
  { id: 'response', label: 'Response' },
  { id: 'citations', label: 'Citations' },
];

/* ---- illustrative substance copy (preserved from the prior page) ---- */
const lc = (s: string) => s.toLowerCase();
const isDioxin = (n: string) => n.includes('dioxin') || n.includes('tcdd') || n.includes('tetrachlorodibenzo');
function hazardHeadline(name: string) {
  const n = lc(name);
  if (n.includes('glyphosate')) return 'Detected in >80% of US urine samples — found in oats, wheat, and many tap-water systems.';
  if (n === 'microplastics') return 'Ubiquitous in modern food chains — from bottled water to seafood to the air we breathe.';
  if (n.includes('pcb')) return 'Persistent legacy pollutant found in sediment, wildlife, and human adipose tissue decades after production ceased.';
  if (isDioxin(n)) return 'The most toxic dioxin congener — a persistent byproduct of combustion and chlorine chemistry, concentrated up the food chain. IARC Group 1.';
  return 'Widely used in food packaging — emerging evidence on thermal leaching into beverages and fatty foods.';
}
function hazardChips(name: string): string[] {
  const n = lc(name);
  if (n.includes('glyphosate')) return ['Found in oats', 'Detected in tap water', 'Trace in most people'];
  if (n === 'microplastics') return ['In seafood', 'In drinking water', 'Airborne particles'];
  if (n.includes('pcb')) return ['Sediment bound', 'Bioaccumulative', 'Ubiquitous legacy'];
  if (isDioxin(n)) return ['Combustion byproduct', 'Bioaccumulative', 'IARC Group 1'];
  return ['In PET bottles', 'Thermal leaching', 'Emerging concern'];
}
function mechanismHeadline(name: string) {
  const n = lc(name);
  if (n.includes('glyphosate')) return 'EPSP synthase inhibitor; gut microbiome disruption under study.';
  if (n === 'microplastics') return 'Particulate translocation across epithelial barriers; inflammatory markers elevated in some populations.';
  if (n.includes('pcb')) return 'Persistent organochlorine; binds to fatty tissues; multiple mechanism pathways (AhR, nuclear receptor).';
  if (isDioxin(n)) return 'Potent aryl-hydrocarbon-receptor (AhR) agonist — the driver of dioxin-like toxicity.';
  return 'Thermal hydrolysis releases monomer; endocrine-active at low doses; accumulates in adipose.';
}
function mechanismDetail(name: string) {
  const n = lc(name);
  if (n.includes('glyphosate')) return 'Herbicide blocks aromatic amino acid synthesis via inhibition of EPSP synthase. Human relevance through altered gut microbiota composition and potential immunological shifts.';
  if (n === 'microplastics') return 'Small particle size allows crossing of mucous membranes; can reach systemic circulation; inflammatory cascade activation observed in vitro and in animal models.';
  if (n.includes('pcb')) return "Cl substitution pattern determines biological activity (Cl at 2,2',4,4' positions most toxic). AhR activation triggers CYP450 induction and altered estrogen metabolism.";
  if (isDioxin(n)) return 'TCDD binds the aryl hydrocarbon receptor (AhR) with very high affinity, inducing CYP1A1 and disrupting endocrine, immune, and developmental signaling. Extremely persistent — stored in adipose tissue with a half-life measured in years — and linked to chloracne, immunotoxicity, and cancer.';
  return 'BPA leaching increases with temperature, pH, and fatty food contact. Binds estrogen receptors at low nanomolar concentrations in cell culture.';
}
function biomarkers(name: string): string[] {
  const n = lc(name);
  if (n.includes('glyphosate')) return ['urinary_glyphosate', 'urinary_AMPA', 'serum_GLP-1'];
  if (n === 'microplastics') return ['plastic_particles_serum', 'inflammatory_markers', 'oxidative_stress'];
  if (n.includes('pcb')) return ['serum_PCB_congeners', 'liver_enzymes', 'thyroid_hormone'];
  if (isDioxin(n)) return ['serum_TCDD', 'lipid_adjusted_TEQ', 'CYP1A1_induction'];
  return ['BPA_urine', 'BPA_serum', 'estrogen_receptor_activity'];
}
function responseHeadline(name: string) {
  const n = lc(name);
  if (n.includes('glyphosate')) return 'IARC 2A vs EPA "not likely" — an active disagreement.';
  if (n === 'microplastics') return 'Regulatory absent; evidence accelerating; precautionary principle applied.';
  if (n.includes('pcb')) return 'Banned globally; persistent in the environment; legacy liability cases ongoing.';
  if (isDioxin(n)) return 'IARC Group 1 (known human carcinogen); tightly regulated; central to Agent Orange and Seveso litigation.';
  return 'FDA approval maintained; industry studies vs. independent research diverge.';
}

const MONO_EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.2em',
  textTransform: 'uppercase', color: 'var(--ink-mute)', fontWeight: 700,
};

function Badge({ color, bg, border, children }: { color: string; bg: string; border: string; children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color, background: bg, border: `1px solid ${border}`, borderRadius: 999, padding: '4px 11px' }}>
      {children}
    </span>
  );
}

function CompoundDetailContent({ slug }: { slug: string }) {
  const [substance, setSubstance] = useState<Substance | null>(null);
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('hazard');
  const [pro, setPro] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getSubstance(slug);
        if (data) { setSubstance(data.substance); setClaims(data.claims); }
      } finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) {
    return (
      <main data-surface="tkg" className="flex min-h-screen items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink-mute)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '0.75rem' }}>loading specimen…</div>
      </main>
    );
  }

  if (!substance) {
    return (
      <main data-surface="tkg" className="flex min-h-screen flex-col items-center justify-center px-6" style={{ background: 'var(--paper)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '2.4rem', color: 'var(--teal-deep)' }}>Specimen not found</h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: '1rem' }}>Try: glyphosate, microplastics, pcbs, or pet.</p>
        <Link href="/compound" style={{ color: 'var(--teal-deep)', marginTop: '1.5rem' }}>‹ Back to compounds</Link>
      </main>
    );
  }

  const certified = claims.filter((c) => c.status === 'certified').length;
  const contested = claims.filter((c) => c.status === 'contested').length;
  const provisional = claims.filter((c) => c.status === 'provisional').length;
  const totalSources = claims.reduce((n, c) => n + (c.sources?.length ?? c.source_count ?? 0), 0);

  const accent: Record<Tab, string> = {
    hazard: 'var(--teal)', profile: 'var(--copper-orn)', response: 'var(--crimson)', citations: 'var(--brass-aged)',
  };

  const allSources = claims.flatMap((c) => c.sources ?? []);
  const supportingSources = allSources.filter((s) => s.supports).length;
  const contradictingSources = allSources.filter((s) => !s.supports).length;
  const sourcesByTier = groupSourcesByTier(allSources);
  const tierLabels: Record<number, string> = { 1: 'Regulatory', 2: 'Systematic review', 3: 'Peer-reviewed', 4: 'Industry / news' };

  const panelShell: React.CSSProperties = {
    background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderTop: `3px solid ${accent[tab]}`,
    borderRadius: 4, boxShadow: '0 1px 0 var(--paper-line), 0 6px 16px rgba(90,59,31,0.08)', padding: '32px',
  };

  return (
    <main data-surface="tkg" className="min-h-screen" style={{ background: 'var(--paper)' }}>
      {/* ENTITY HEADER */}
      <header className="border-b" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper)' }}>
        <div className="rail-default py-10">
          <div style={MONO_EYEBROW}>Compound · specimen plate{substance.cas_number ? ` · CAS ${substance.cas_number}` : ''}</div>

          <div className="mt-3 flex flex-wrap items-start justify-between gap-6">
            <div className="min-w-0">
              <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 'clamp(2.8rem, 6vw, 4.6rem)', lineHeight: 1.02, letterSpacing: '-0.01em', color: 'var(--teal-deep)', margin: 0 }}>
                {substance.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {totalSources >= 3 && (
                  <Badge color="#3E5638" bg="rgba(94,122,86,0.14)" border="var(--sage)">
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sage)', display: 'inline-block' }} />3-source verified
                  </Badge>
                )}
                {certified > 0 && <Badge color="#3E5638" bg="rgba(94,122,86,0.10)" border="var(--sage)">{certified} certified</Badge>}
                {contested > 0 && <Badge color="var(--crimson-deep)" bg="rgba(165,58,45,0.10)" border="var(--crimson)">{contested} contested</Badge>}
                {provisional > 0 && <Badge color="var(--peach-deep)" bg="rgba(198,138,61,0.12)" border="var(--peach)">{provisional} provisional</Badge>}
              </div>
            </div>

            {/* Reading-mode toggle */}
            <div className="text-right">
              <div style={{ ...MONO_EYEBROW, marginBottom: 6 }}>Reading mode</div>
              <div className="inline-flex overflow-hidden" style={{ border: '1px solid var(--tox)', borderRadius: 999, background: 'var(--paper)' }}>
                {([['Dreamer', false], ['Pro', true]] as const).map(([label, val]) => (
                  <button key={label} onClick={() => setPro(val)} style={{
                    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.85rem', padding: '7px 18px', cursor: 'pointer', border: 'none',
                    background: pro === val ? 'var(--tox-deep)' : 'transparent', color: pro === val ? 'var(--paper)' : 'var(--tox-deep)',
                  }}>{label}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Reading-mode readout */}
          <div className="mt-6" style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '16px 20px' }}>
            {pro ? (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>{mechanismDetail(substance.name)}</p>
            ) : (
              <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '1.3rem', lineHeight: 1.45, color: 'var(--ink-soft)', margin: 0 }}>
                {substance.description || hazardHeadline(substance.name)}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="mt-7 flex gap-1" style={{ borderBottom: '1px solid var(--paper-line)' }}>
            {TABS.map((t) => {
              const on = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} style={{
                  position: 'relative', border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem',
                  color: on ? 'var(--ink)' : 'var(--ink-mute)', padding: '10px 18px',
                }}>
                  {t.label}
                  {on && <span style={{ position: 'absolute', left: 10, right: 10, bottom: -1, height: 2, background: accent[t.id] }} />}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* PANEL */}
      <section className="rail-default py-12">
        <div style={panelShell}>
          {tab === 'hazard' && (
            <div>
              <div style={{ ...MONO_EYEBROW, color: accent.hazard }}>What you&rsquo;d want to know</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.7rem', lineHeight: 1.2, color: 'var(--ink)', margin: '12px 0 14px' }}>{hazardHeadline(substance.name)}</h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: '62ch' }}>{substance.description || 'A complex environmental and health substance with multiple claim dimensions.'}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {hazardChips(substance.name).map((chip) => (
                  <span key={chip} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--teal-deep)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '5px 11px' }}>{chip}</span>
                ))}
              </div>
              {/* Evidence gauges from real claim data */}
              <div className="mt-8 flex flex-wrap gap-4">
                {([['certified', certified, 'var(--sage)'], ['contested', contested, 'var(--crimson)'], ['provisional', provisional, 'var(--peach-deep)']] as const).map(([label, n, col]) => (
                  <div key={label} style={{ textAlign: 'center', width: 104, height: 104, borderRadius: '50%', border: `1px solid ${col}`, background: 'var(--paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '2rem', color: col, lineHeight: 1 }}>{n}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-mute)', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div style={{ ...MONO_EYEBROW, color: accent.profile }}>Identity</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', marginTop: 12 }}>
                  <tbody>
                    {[['Name', substance.name], ['CAS', substance.cas_number || '—']].map(([k, v]) => (
                      <tr key={k} style={{ borderBottom: '1px solid var(--paper-deep)' }}>
                        <td style={{ padding: '8px 0', color: 'var(--ink-mute)' }}>{k}</td>
                        <td style={{ padding: '8px 0', color: 'var(--ink)', textAlign: 'right' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6">
                  <div style={{ ...MONO_EYEBROW }}>Biomarkers</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {biomarkers(substance.name).map((b) => (
                      <span key={b} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '4px 9px' }}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ ...MONO_EYEBROW, color: accent.profile }}>Toxicology profile</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.35rem', lineHeight: 1.25, color: 'var(--ink)', margin: '12px 0 10px' }}>{mechanismHeadline(substance.name)}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--ink-soft)' }}>{mechanismDetail(substance.name)}</p>
              </div>
            </div>
          )}

          {tab === 'response' && (
            <div>
              <div style={{ ...MONO_EYEBROW, color: accent.response }}>Regulatory posture</div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 600, fontSize: '1.6rem', lineHeight: 1.25, color: 'var(--ink)', margin: '12px 0 18px' }}>{responseHeadline(substance.name)}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div style={{ background: 'var(--paper)', border: '1px solid var(--sage)', borderRadius: 3, padding: 18 }}>
                  <div style={{ ...MONO_EYEBROW, color: '#3E5638' }}>Supporting</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-soft)', marginTop: 8 }}>{supportingSources} source{supportingSources === 1 ? '' : 's'} back the concern</div>
                </div>
                <div style={{ background: 'var(--paper)', border: '1px solid var(--crimson)', borderRadius: 3, padding: 18 }}>
                  <div style={{ ...MONO_EYEBROW, color: 'var(--crimson-deep)' }}>Contradicting</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--ink-soft)', marginTop: 8 }}>{contradictingSources} source{contradictingSources === 1 ? '' : 's'} contest the claim</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'citations' && (
            <div>
              <div style={{ ...MONO_EYEBROW, color: accent.citations }}>Citation chain · assertion → source → primary literature</div>
              <div className="mt-5 space-y-6">
                {(Object.entries(sourcesByTier) as Array<[string, EvidenceSource[]]>).map(([tierNum, srcs]) => {
                  if (!srcs.length) return null;
                  const tn = parseInt(tierNum, 10);
                  return (
                    <div key={tierNum}>
                      <div style={{ ...MONO_EYEBROW }}>Tier {tn} — {tierLabels[tn] ?? 'Other'} ({srcs.length})</div>
                      <div className="mt-3 space-y-3">
                        {srcs.map((src, i) => {
                          const q = quoteOrPending(src.quote);
                          return (
                            <div key={i} style={{ borderLeft: '2px solid var(--paper-line)', paddingLeft: 14 }}>
                              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)' }}>{src.title}</div>
                              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-mute)', marginTop: 2 }}>
                                {src.publisher} · {src.year || 'n.d.'}
                                {src.doi && <> · <a href={`https://doi.org/${src.doi}`} target="_blank" rel="noreferrer" style={{ color: 'var(--teal-deep)' }}>DOI</a></>}
                              </div>
                              {q.verified && q.text ? (
                                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--ink-soft)', marginTop: 6, lineHeight: 1.6 }}>&ldquo;{q.text}&rdquo;</div>
                              ) : (
                                <span style={{ display: 'inline-block', marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)', background: 'var(--paper)', border: '1px solid var(--paper-line)', borderRadius: 3, padding: '2px 7px' }}>pending verbatim</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {allSources.length === 0 && (
                  <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--ink-mute)' }}>No sources loaded for this specimen yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Poison Control safety bar */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ background: 'var(--crimson)', borderRadius: 4, padding: '14px 22px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--paper)', fontWeight: 700 }}>U.S. Poison Control</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--paper)', letterSpacing: '0.02em' }}>1-800-222-1222</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--paper)', opacity: 0.9 }}>Not medical advice — call for any suspected exposure.</span>
        </div>

        {/* Continue exploring */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { href: '/flow/clinician', title: 'Open in Clinician lane', sub: 'Biomarker, differential, decision-support' },
            { href: '/flow/counsel?case=sky-valley', title: 'Open in Counsel lane', sub: 'Sky Valley case with evidence dossier' },
            { href: '/compound', title: 'Back to compounds', sub: 'Browse every substance' },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="no-underline transition-transform hover:-translate-y-0.5" style={{ background: 'var(--paper-raised)', border: '1px solid var(--paper-line)', borderRadius: 4, padding: '20px 22px' }}>
              <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1.05rem', color: 'var(--ink)' }}>{c.title}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--ink-soft)', marginTop: 4 }}>{c.sub}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* JSON-LD machine endpoint footer */}
      <footer className="border-t" style={{ borderColor: 'var(--paper-line)', background: 'var(--paper-warm)' }}>
        <div className="rail-default flex flex-wrap items-center justify-between gap-3 py-5">
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-mute)' }}>
            toxicology.theknowledgegardens.com/compound/{slug}<span style={{ color: 'var(--copper-orn)' }}>.json</span>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--tox-deep)' }}>JSON-LD · schema.org/ChemicalSubstance · machine endpoint adjacent to every page</span>
        </div>
      </footer>
    </main>
  );
}

export default function CompoundDetailPage({ params }: Props) {
  const [slug, setSlug] = useState<string>('');
  useEffect(() => { params.then((p) => setSlug(p.slug)); }, [params]);
  if (!slug) return null;
  return <CompoundDetailContent slug={slug} />;
}
