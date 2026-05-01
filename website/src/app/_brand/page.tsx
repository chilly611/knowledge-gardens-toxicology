import Emblem from '@/components/shared/Emblem';
import DimensionLine from '@/components/shared/DimensionLine';
import CornerBrackets from '@/components/shared/CornerBrackets';
import GearOrnament from '@/components/shared/GearOrnament';
import { tokens } from '@/styles/tokens';

export const metadata = { title: 'Brand QA · TKG' };

const PALETTE_GROUPS = [
  {
    label: 'Paper',
    swatches: [
      { name: 'paper',      value: tokens.paper },
      { name: 'paper-warm', value: tokens.paperWarm },
      { name: 'paper-deep', value: tokens.paperDeep },
      { name: 'paper-line', value: tokens.paperLine },
    ],
  },
  {
    label: 'Ink',
    swatches: [
      { name: 'ink',      value: tokens.ink },
      { name: 'ink-soft', value: tokens.inkSoft },
      { name: 'ink-mute', value: tokens.inkMute },
    ],
  },
  {
    label: 'Jewel',
    swatches: [
      { name: 'teal',         value: tokens.teal },
      { name: 'teal-deep',    value: tokens.tealDeep },
      { name: 'indigo',       value: tokens.indigo },
      { name: 'indigo-deep',  value: tokens.indigoDeep },
      { name: 'crimson',      value: tokens.crimson },
      { name: 'crimson-deep', value: tokens.crimsonDeep },
      { name: 'peach',        value: tokens.peach },
      { name: 'peach-deep',   value: tokens.peachDeep },
      { name: 'copper-orn',   value: tokens.copper },
      { name: 'copper-orn-deep', value: tokens.copperDeep },
    ],
  },
];

export default function BrandQAPage() {
  return (
    <main data-surface="tkg" className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16">

        <header className="section-accent mb-12">
          <div className="font-eyebrow mb-2">brand QA · v2</div>
          <h1 className="text-5xl">Toxicology Knowledge Garden — brand system</h1>
          <p className="mt-3 italic text-[var(--ink-soft)]" style={{ fontSize: '1.15rem' }}>
            Paper foundation, jewel-tone accents, Cormorant Garamond + Space Mono. Coexists with the legacy parchment palette so <code className="font-data">/legacy/*</code> routes keep rendering.
          </p>
        </header>

        {/* ────────── Caduceus emblem ────────── */}
        <section className="mb-16">
          <div className="font-eyebrow mb-3">caduceus emblem · 3 sizes</div>
          <div className="flex flex-wrap items-end gap-12 rounded-lg border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8">
            <div>
              <Emblem size="hero" />
              <div className="font-data mt-2 text-center text-[var(--ink-mute)]">hero · 240×320</div>
            </div>
            <div>
              <Emblem size="inline" />
              <div className="font-data mt-2 text-center text-[var(--ink-mute)]">inline · 60×80</div>
            </div>
            <div className="rounded bg-[var(--paper)] p-2">
              <Emblem size="watermark" />
              <div className="font-data mt-2 text-center text-[var(--ink-mute)]">watermark · low-opacity</div>
            </div>
          </div>
        </section>

        {/* ────────── Palette ────────── */}
        <section className="mb-16">
          <div className="font-eyebrow mb-3">palette · paper + jewel</div>
          {PALETTE_GROUPS.map((group) => (
            <div key={group.label} className="mb-6">
              <div className="font-data mb-2 text-[var(--ink-soft)]">{group.label}</div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {group.swatches.map((s) => (
                  <div key={s.name} className="overflow-hidden rounded border border-[var(--paper-line)]">
                    <div style={{ background: s.value, height: 60 }} />
                    <div className="bg-[var(--paper-warm)] px-3 py-2">
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink)' }}>{s.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--ink-mute)' }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* ────────── Status semantics ────────── */}
        <section className="mb-16">
          <div className="font-eyebrow mb-3">status semantics</div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatusBadge label="certified"   value="0.90"  color={tokens.certified}/>
            <StatusBadge label="provisional" value="0.33"  color={tokens.provisional}/>
            <StatusBadge label="contested"   value="0.41"  color={tokens.contested}/>
          </div>
        </section>

        {/* ────────── Typography ────────── */}
        <section className="mb-16">
          <div className="font-eyebrow mb-3">typography</div>
          <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8">
            <h1 className="mb-2">The shikimate pathway</h1>
            <h2 className="mb-2">Three sources behind every claim.</h2>
            <h3 className="mb-2">Glyphosate × non-Hodgkin lymphoma</h3>
            <p className="mb-2 italic">
              Cormorant italic for emphasis and scientific names, e.g. <span className="italic">Pseudomonas putida</span>.
            </p>
            <p className="mb-4">
              Body text in Cormorant Garamond at 18px line-height 1.7 against a paper background gives long-form science a quality publishing feel.
            </p>
            <div className="font-eyebrow">eyebrow · space mono · uppercase · tracked</div>
            <div className="font-data mt-2">CAS 1071-83-6 · IC50 ~10–25 µM · doi:10.1002/ps.1518</div>
          </div>
        </section>

        {/* ────────── Decorative components ────────── */}
        <section className="mb-16">
          <div className="font-eyebrow mb-3">decorative vocabulary</div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-6">
              <div className="font-data mb-3 text-[var(--ink-mute)]">DimensionLine</div>
              <DimensionLine length={220} label="0.8 mg / L · MCL · EPA"/>
              <div className="mt-4 flex gap-4">
                <DimensionLine vertical length={120} label="240 px"/>
                <DimensionLine vertical length={120} label="hero"/>
              </div>
            </div>
            <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-6">
              <div className="font-data mb-3 text-[var(--ink-mute)]">CornerBrackets + GearOrnament</div>
              <CornerBrackets inset={6}>
                <div className="px-6 py-8 text-center">
                  <GearOrnament size={42}/>
                  <div className="mt-2 italic">Engineering frame</div>
                </div>
              </CornerBrackets>
            </div>
          </div>
        </section>

        {/* ────────── Audience accents ────────── */}
        <section className="mb-16">
          <div className="font-eyebrow mb-3">audience accents</div>
          <div className="grid gap-3 md:grid-cols-3">
            <AudienceCard kind="consumer"  title="What's in my world?"               color={tokens.audienceConsumer}/>
            <AudienceCard kind="clinician" title="Differential & exposure workup"    color={tokens.audienceClinician}/>
            <AudienceCard kind="counsel"   title="Daubert-ready case prep"           color={tokens.audienceCounsel}/>
          </div>
        </section>

        <footer className="font-data mt-16 border-t border-[var(--paper-line)] pt-6 text-[var(--ink-mute)]">
          /_brand · ships with Wave 1·A1 · update when tokens change · do not link from production nav
        </footer>
      </div>
    </main>
  );
}

/* ────────── private demo helpers ────────── */

function StatusBadge({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-5">
      <div
        className="mb-2 inline-block rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] text-white"
        style={{ background: color, fontFamily: 'var(--font-mono)' }}
      >
        {label}
      </div>
      <div className="font-data text-[var(--ink-mute)]">confidence_score = <span style={{ color }}>{value}</span></div>
    </div>
  );
}

function AudienceCard({ kind, title, color }: { kind: string; title: string; color: string }) {
  return (
    <div
      className="rounded border bg-[var(--paper-warm)] p-6 transition-transform hover:-translate-y-0.5"
      style={{ borderColor: color, borderWidth: 1.5 }}
    >
      <div className="font-eyebrow mb-2" style={{ color }}>{kind}</div>
      <div className="text-xl italic">{title}</div>
    </div>
  );
}
