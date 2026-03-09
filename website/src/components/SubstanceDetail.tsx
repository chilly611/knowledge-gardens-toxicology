'use client';

import { useState } from 'react';

const TABS = ['Overview', 'Chemistry', 'Health Effects', 'Regulations'] as const;
type Tab = typeof TABS[number];

const EVIDENCE_COLORS: Record<string, string> = {
  known: '#c0392b', probable: '#e67e22', possible: '#f39c12',
  inadequate: '#95a5a6', not_classified: '#bdc3c7',
};

interface Props {
  substance: any;
  healthEffects: any[];
  classifications: any[];
  regulations: any[];
  waterData: any;
  aliases: any[];
}

export default function SubstanceDetail({
  substance: s, healthEffects, classifications, regulations, waterData, aliases,
}: Props) {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* ── Header ── */}
      <div className="mb-2">
        <a href="/substances" className="text-sm text-[var(--color-steel)] hover:text-[var(--color-teal)]"
           style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
          ← All Substances
        </a>
      </div>
      <h1 className="mb-2 text-4xl font-bold md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
        {s.name}
      </h1>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {s.cas_number && (
          <span className="font-data rounded bg-[var(--color-cream)] border border-[var(--color-gold)]/20 px-3 py-1 text-[var(--color-steel)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
            CAS {s.cas_number}
          </span>
        )}
        {classifications.map((c: any) => (
          <span key={c.id} className="rounded-full bg-[var(--color-gold)] px-3 py-1 text-xs text-white"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            {c.name}
          </span>
        ))}
      </div>

      {/* ── Tab Bar ── */}
      <div className="mb-8 flex gap-1 overflow-x-auto border-b-2 border-[var(--color-gold)]/20">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px]
              ${tab === t
                ? 'border-[var(--color-teal)] text-[var(--color-teal)]'
                : 'border-transparent text-[var(--color-steel)] hover:text-[var(--color-ink)]'}`}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.04em' }}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="animate-fade-in" key={tab}>
        {tab === 'Overview' && <OverviewTab s={s} waterData={waterData} aliases={aliases} healthEffects={healthEffects} />}
        {tab === 'Chemistry' && <ChemistryTab s={s} />}
        {tab === 'Health Effects' && <HealthEffectsTab effects={healthEffects} />}
        {tab === 'Regulations' && <RegulationsTab regulations={regulations} />}
      </div>
    </div>
  );
}

{/* ══════════ OVERVIEW TAB ══════════ */}
function OverviewTab({ s, waterData, aliases, healthEffects }: any) {
  return (
    <div className="space-y-8">
      {s.description && (
        <p className="text-lg leading-relaxed text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-body)' }}>
          {s.description}
        </p>
      )}

      {/* Water Data Gauges */}
      {waterData && (
        <div className="rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-6">
          <h3 className="mb-4 text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Tap Water Contamination
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {waterData.people_affected && (
              <GaugeCircle value={waterData.people_affected} max={330000000} label="People Affected"
                format={(v: number) => v >= 1e6 ? `${(v/1e6).toFixed(0)}M` : v.toLocaleString()} />
            )}
            {waterData.systems_detected && (
              <GaugeCircle value={waterData.systems_detected} max={200000} label="Water Systems" />
            )}
            {waterData.states_detected && waterData.states_tested && (
              <GaugeCircle value={waterData.states_detected} max={waterData.states_tested} label="States Detected" />
            )}
            {waterData.detection_period && (
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-[var(--color-teal)] bg-[var(--color-cream)]"
                     style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-ink)' }}>
                  {waterData.detection_period}
                </div>
                <div className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-steel)' }}>
                  Detection Period
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Health Effects Summary */}
      {healthEffects.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Known Health Effects
          </h3>
          <div className="flex flex-wrap gap-2">
            {healthEffects.map((he: any) => (
              <span key={he.health_effect_id}
                className="rounded-full px-3 py-1.5 text-xs text-white"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  background: EVIDENCE_COLORS[he.evidence_level] || '#95a5a6',
                }}>
                {he.health_effects?.name || 'Unknown'} — {he.evidence_level}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Aliases */}
      {aliases.length > 0 && (
        <div>
          <h3 className="mb-3 text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Also Known As
          </h3>
          <div className="flex flex-wrap gap-2">
            {aliases.slice(0, 20).map((a: any, i: number) => (
              <span key={i} className="rounded border border-[var(--color-gold)]/20 bg-white px-2.5 py-1 text-xs text-[var(--color-ink-light)]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                {a.alias}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* PubChem Link */}
      {s.pubchem_cid && (
        <div className="rounded-lg border border-[var(--color-teal)]/20 bg-[var(--color-teal)]/5 p-4">
          <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${s.pubchem_cid}`}
             target="_blank" rel="noopener noreferrer"
             className="text-sm text-[var(--color-teal)]"
             style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            View on PubChem → CID {s.pubchem_cid}
          </a>
        </div>
      )}
    </div>
  );
}

{/* ══════════ CHEMISTRY TAB ══════════ */}
function ChemistryTab({ s }: { s: any }) {
  const fields = [
    { label: 'CAS Number', value: s.cas_number },
    { label: 'IUPAC Name', value: s.iupac_name },
    { label: 'Molecular Formula', value: s.molecular_formula },
    { label: 'Molecular Weight', value: s.molecular_weight ? `${s.molecular_weight} g/mol` : null },
    { label: 'SMILES', value: s.smiles },
    { label: 'InChI Key', value: s.inchi_key },
    { label: 'PubChem CID', value: s.pubchem_cid },
  ].filter(f => f.value);

  return (
    <div className="space-y-1">
      <h3 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Chemical Identity
      </h3>
      <div className="overflow-hidden rounded-lg border border-[var(--color-gold)]/20">
        {fields.map((f, i) => (
          <div key={f.label}
            className={`flex items-start gap-4 px-5 py-3.5 ${i % 2 === 0 ? 'bg-[var(--color-cream)]' : 'bg-white'}`}>
            <div className="w-40 shrink-0 text-[var(--color-steel)]"
                 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
              {f.label}
            </div>
            <div className="break-all text-[var(--color-ink)]"
                 style={{ fontFamily: f.label === 'Molecular Formula' ? 'var(--font-body)' : 'var(--font-mono)',
                          fontSize: '0.88rem' }}>
              {f.label === 'Molecular Formula' ? <FormulaDisplay formula={String(f.value)} /> : String(f.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

{/* ══════════ HEALTH EFFECTS TAB ══════════ */}
function HealthEffectsTab({ effects }: { effects: any[] }) {
  if (effects.length === 0) {
    return <p className="py-8 text-center text-[var(--color-steel)]">No health effects data available.</p>;
  }

  return (
    <div className="space-y-6">
      {/* Health Ring SVG */}
      <div className="flex justify-center">
        <svg viewBox="0 0 200 200" width="220" height="220">
          {effects.map((he: any, i: number) => {
            const angle = (i / effects.length) * Math.PI * 2 - Math.PI / 2;
            const r = 70;
            const x = 100 + r * Math.cos(angle);
            const y = 100 + r * Math.sin(angle);
            const color = EVIDENCE_COLORS[he.evidence_level] || '#95a5a6';
            const dotR = he.evidence_level === 'known' ? 14 : he.evidence_level === 'probable' ? 11 : 8;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={dotR} fill={color} opacity={0.85} />
                <text x={x} y={y + dotR + 12} textAnchor="middle"
                  style={{ fontSize: '7px', fontFamily: 'Space Mono, monospace', fill: '#2C2C2C' }}>
                  {(he.health_effects?.name || '').slice(0, 16)}
                </text>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="30" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" opacity={0.4} />
          <circle cx="100" cy="100" r="70" fill="none" stroke="var(--color-gold)" strokeWidth="0.5" opacity={0.2} />
          <text x="100" y="98" textAnchor="middle" style={{ fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fill: 'var(--color-teal)' }}>
            {effects.length}
          </text>
          <text x="100" y="112" textAnchor="middle" style={{ fontSize: '7px', fontFamily: 'Space Mono, monospace', fill: 'var(--color-steel)', letterSpacing: '0.08em' }}>
            EFFECTS
          </text>
        </svg>
      </div>

      {/* Effect List */}
      <div className="space-y-3">
        {effects.map((he: any, i: number) => (
          <div key={i} className="flex items-start gap-4 rounded-lg border border-[var(--color-gold)]/20 bg-[var(--color-cream)] p-4"
               style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="mt-0.5 h-3 w-3 shrink-0 rounded-full"
              style={{ background: EVIDENCE_COLORS[he.evidence_level] || '#95a5a6' }} />
            <div>
              <div className="font-semibold text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-display)' }}>
                {he.health_effects?.name || 'Unknown'}
              </div>
              <div className="mt-0.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-steel)' }}>
                Evidence: {he.evidence_level}
                {he.evidence_source && ` · ${he.evidence_source}`}
              </div>
              {he.notes && <p className="mt-1 text-sm text-[var(--color-ink-light)]">{he.notes}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs" style={{ fontFamily: 'var(--font-mono)' }}>
        {Object.entries(EVIDENCE_COLORS).map(([level, color]) => (
          <span key={level} className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
            {level}
          </span>
        ))}
      </div>
    </div>
  );
}

{/* ══════════ REGULATIONS TAB ══════════ */}
function RegulationsTab({ regulations }: { regulations: any[] }) {
  if (regulations.length === 0) {
    return <p className="py-8 text-center text-[var(--color-steel)]">No regulatory data available.</p>;
  }

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
        Regulatory Limits
      </h3>
      <div className="overflow-x-auto rounded-lg border border-[var(--color-gold)]/20">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[var(--color-gold)]/20 bg-[var(--color-cream)]">
              {['Agency', 'Type', 'Limit', 'Unit', 'Notes'].map(h => (
                <th key={h} className="px-4 py-3 text-[var(--color-steel)]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regulations.map((r: any, i: number) => (
              <tr key={i} className={`border-b border-[var(--color-gold)]/10 ${i % 2 === 0 ? 'bg-white' : 'bg-[var(--color-cream)]'}`}>
                <td className="px-4 py-3 font-semibold text-[var(--color-teal)]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>{r.agency}</td>
                <td className="px-4 py-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.limit_type}</td>
                <td className="px-4 py-3 font-bold" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                  {r.limit_value ?? '—'}
                </td>
                <td className="px-4 py-3 text-[var(--color-steel)]"
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{r.limit_unit || '—'}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-ink-light)]"
                    style={{ maxWidth: '200px' }}>
                  {r.notes ? (r.notes.length > 80 ? r.notes.slice(0, 80) + '…' : r.notes) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

{/* ══════════ HELPER COMPONENTS ══════════ */}
function GaugeCircle({ value, max, label, format }: { value: number; max: number; label: string; format?: (v: number) => string }) {
  const pct = Math.min(100, (value / max) * 100);
  const display = format ? format(value) : value.toLocaleString();
  return (
    <div className="text-center">
      <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-[3px] border-[var(--color-teal)] bg-[var(--color-cream)]">
        <div className="absolute bottom-0 w-full transition-all duration-1000"
          style={{ height: `${pct}%`, background: 'linear-gradient(to top, rgba(26,92,92,0.85), rgba(26,92,92,0.3))' }} />
        <div className="absolute inset-0 flex items-center justify-center"
             style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-ink)' }}>
          {display}
        </div>
      </div>
      <div className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--color-steel)' }}>
        {label}
      </div>
    </div>
  );
}

function FormulaDisplay({ formula }: { formula: string }) {
  const parts = formula.split(/(\d+)/);
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
      {parts.map((p, i) => /^\d+$/.test(p) ? <sub key={i}>{p}</sub> : p)}
    </span>
  );
}
