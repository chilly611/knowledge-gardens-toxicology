'use client';

/**
 * /compound/[slug] — The SHOWPIECE compound detail page.
 * The Stratigraph surface: geological core-sample drill-down through
 * one substance end-to-end. Four layers, each a tier of knowledge.
 *
 * Design reference: design-references/stratigraph.png + READ_FIRST.md
 * Voice: bold sans-serif for headlines, Inter for body, Space Mono for technical.
 * ANIMATIONS: layered card reveals with stagger, depth marker pulses, surface pill slides.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSubstance, quoteOrPending, groupSourcesByTier } from '@/lib/queries-tox';
import type { Substance, CertifiedClaimRow, EvidenceSource } from '@/lib/types-tox';
import ScrollReveal from '@/components/home/ScrollReveal';
import SegmentedPills from '@/components/shared/SegmentedPills';
import DimensionLine from '@/components/shared/DimensionLine';
import CornerBrackets from '@/components/shared/CornerBrackets';

type Props = {
  params: Promise<{ slug: string }>;
};

function CompoundDetailContent({ slug }: { slug: string }) {
  const [substance, setSubstance] = useState<Substance | null>(null);
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lane, setLane] = useState<'consumer' | 'clinician' | 'counsel' | 'hygienist' | 'inspector'>('consumer');

  useEffect(() => {
    (async () => {
      try {
        const data = await getSubstance(slug);
        if (data) {
          setSubstance(data.substance);
          setClaims(data.claims);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <main data-surface="tkg" className="min-h-screen flex items-center justify-center">
        <div style={{ color: 'var(--ink-mute)' }}>Loading…</div>
      </main>
    );
  }

  if (!substance) {
    return (
      <main data-surface="tkg" className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--ink)' }}>
          Substance not found
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginTop: '1rem' }}>
          Try: glyphosate, microplastics, pcbs, or pet.
        </p>
        <Link href="/compound" style={{ color: 'var(--teal-deep)', marginTop: '2rem', display: 'block' }}>
          Back to substances
        </Link>
      </main>
    );
  }

  const tierColors = {
    hazard: 'var(--teal)',
    profile: 'var(--peach)',
    response: 'var(--crimson)',
    citations: 'var(--ink-mute)',
  };

  const tierNames = {
    hazard: 'SURFACE · CONSUMER · WHAT YOU\'D WANT TO KNOW',
    profile: 'CLINICAL · BIOMARKERS & MECHANISM',
    response: 'REGULATORY · CONTESTED',
    citations: 'PRIMARY EVIDENCE',
  };

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* ================================================================
          STICKY HEADER
          ================================================================ */}
      <header className="sticky top-0 z-20 border-b border-[var(--paper-line)] bg-[var(--paper)] backdrop-blur-sm py-6">
        <div className="rail-default">
          {/* Eyebrow + Lane pills */}
          <div className="mb-6 flex items-baseline justify-between">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--copper-orn-deep)',
                animation: 'letter-rise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }}
            >
              CORE SAMPLE · DEPTH 0—460mm · 4 LAYERS
            </div>
            <SegmentedPills
              label={<span style={{ fontSize: '0.9rem' }}>Viewing as:</span>}
              options={[
                { value: 'consumer', label: 'Consumer' },
                { value: 'clinician', label: 'Clinician' },
                { value: 'counsel', label: 'Counsel' },
                { value: 'hygienist', label: 'Hygienist' },
                { value: 'inspector', label: 'Inspector' },
              ]}
              value={lane}
              onChange={(v) => setLane(v as typeof lane)}
              variant="light"
              className="ml-auto"
            />
          </div>

          {/* Substance name + CAS */}
          <div className="flex items-baseline justify-between gap-8">
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontStyle: 'normal',
                fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: 'var(--ink)',
                maxWidth: '50vw',
                animation: 'layer-rise 1s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }}
            >
              {substance.name}
            </h1>
            {substance.cas_number && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: 'var(--ink-mute)',
                  whiteSpace: 'nowrap',
                  marginTop: '1rem',
                  animation: 'layer-rise 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                }}
              >
                CAS {substance.cas_number}
              </div>
            )}
          </div>

          {/* Scroll-to-layer strip */}
          <nav className="mt-8 border-t border-[var(--paper-line)] pt-6 flex gap-4 flex-wrap">
            {(['hazard', 'profile', 'response', 'citations'] as const).map((tier, idx) => (
              <a
                key={tier}
                href={`#tier-${tier}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-soft)',
                  textDecoration: 'none',
                  transition: 'color 200ms',
                  animation: 'layer-rise 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                  animationDelay: `${idx * 100}ms`,
                }}
                className="hover:text-[var(--ink)]"
              >
                {tier.charAt(0).toUpperCase() + tier.slice(1)}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ================================================================
          CORE SAMPLE LAYERS
          ================================================================ */}
      <section className="py-20">
        <div className="rail-default stagger">
          {/* HAZARD / SURFACE LAYER */}
          <div className="anim-layer-rise">
            <ScrollReveal>
              <LayerCard
                id="hazard"
                tier="hazard"
                eyebrow={tierNames.hazard}
                color={tierColors.hazard}
                depth="0mm"
                substance={substance}
                claims={claims.filter((c) => c.status === 'certified')}
              />
            </ScrollReveal>
          </div>

          {/* PROFILE / CLINICAL LAYER */}
          <div className="anim-layer-rise">
            <ScrollReveal delay={150}>
              <LayerCard
                id="profile"
                tier="profile"
                eyebrow={tierNames.profile}
                color={tierColors.profile}
                depth="120mm"
                substance={substance}
                claims={claims.filter((c) => c.endpoint_category === 'biomarker' || c.endpoint_category === 'mechanism')}
              />
            </ScrollReveal>
          </div>

          {/* RESPONSE / REGULATORY LAYER */}
          <div className="anim-layer-rise">
            <ScrollReveal delay={300}>
              <LayerCard
                id="response"
                tier="response"
                eyebrow={tierNames.response}
                color={tierColors.response}
                depth="240mm"
                substance={substance}
                claims={claims.filter((c) => c.status === 'contested')}
              />
            </ScrollReveal>
          </div>

          {/* CITATIONS / PRIMARY EVIDENCE LAYER */}
          <div className="anim-layer-rise">
            <ScrollReveal delay={450}>
              <LayerCard
                id="citations"
                tier="citations"
                eyebrow={`${tierNames.citations} · ${claims.reduce((sum, c) => sum + c.source_count, 0)} SOURCES`}
                color={tierColors.citations}
                depth="360mm"
                substance={substance}
                claims={claims}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================================================================
          CONTINUE EXPLORING CTA STRIP
          ================================================================ */}
      <section className="bg-[var(--paper-warm)] py-16">
        <div className="rail-default">
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'var(--copper-orn-deep)',
              marginBottom: '2rem',
            }}
          >
            Continue exploring
          </div>
          <div className="tile-grid-3">
            <CornerBrackets>
              <a
                href={`/flow/counsel?case=sky-valley`}
                className="tile block bg-white hover:bg-[var(--paper-warm)] transition"
              >
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Open in Counsel lane
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  Sky Valley case with evidence dossier
                </div>
              </a>
            </CornerBrackets>

            <CornerBrackets>
              <a
                href={`/flow/clinician`}
                className="tile block bg-white hover:bg-[var(--paper-warm)] transition"
              >
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Open in Clinician lane
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  Biomarker, differential, decision-support
                </div>
              </a>
            </CornerBrackets>

            <CornerBrackets>
              <a
                href={`/`}
                className="tile block bg-white hover:bg-[var(--paper-warm)] transition"
              >
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: 'var(--ink)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Back to Loom
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  View all substances & endpoints
                </div>
              </a>
            </CornerBrackets>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--paper-line)] bg-[var(--paper)] py-8 text-center">
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--ink-mute)' }}>
          Toxicology Knowledge Garden · 2026
        </div>
      </footer>
    </main>
  );
}

/* ============================================================================
   LAYER CARD — reusable tier component
   ============================================================================ */
function LayerCard({
  id,
  tier,
  eyebrow,
  color,
  depth,
  substance,
  claims,
}: {
  id: string;
  tier: 'hazard' | 'profile' | 'response' | 'citations';
  eyebrow: string;
  color: string;
  depth: string;
  substance: Substance;
  claims: CertifiedClaimRow[];
}) {
  const layerBackgrounds = {
    hazard: 'radial-gradient(circle, rgba(46, 164, 163, 0.02) 2px, transparent 2px)',
    profile: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 177, 102, 0.04) 10px, rgba(255, 177, 102, 0.04) 20px)',
    response: 'repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(232, 55, 89, 0.03) 8px, rgba(232, 55, 89, 0.03) 16px)',
    citations: 'repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(107, 115, 136, 0.04) 6px, rgba(107, 115, 136, 0.04) 12px)',
  };

  const layerBackgroundSize = {
    hazard: '20px 20px',
    profile: undefined,
    response: undefined,
    citations: undefined,
  };

  // Hazard layer content
  if (tier === 'hazard') {
    return (
      <div id={`tier-${id}`} className="mb-12 relative pl-16 scroll-mt-24 anim-layer-rise">
        {/* Depth marker */}
        <div className="absolute left-0 top-0 flex flex-col items-center">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              marginBottom: '0.5rem',
              animation: 'depth-pulse 2.4s ease-in-out infinite',
            }}
          />
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--ink-mute)',
            animation: 'depth-pulse 2.4s ease-in-out infinite',
            animationDelay: '0.3s',
          }}>
            {depth}
          </div>
          <div
            style={{
              width: '1px',
              height: '120px',
              background: `${color}40`,
              marginTop: '0.5rem',
            }}
          />
        </div>

        {/* Card */}
        <div
          className="tile overflow-hidden bg-white"
          style={{
            boxShadow: '0 2px 8px rgba(26, 36, 51, 0.08)',
          }}
        >
          {/* Top accent stripe */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${color}, ${color}40)`,
            }}
          />

          {/* Content area with texture */}
          <div
            style={{
              background: layerBackgrounds[tier],
              backgroundSize: layerBackgroundSize[tier] || 'auto',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: color,
                marginBottom: '1rem',
              }}
            >
              {eyebrow}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '1.4rem',
                color: 'var(--ink)',
                marginBottom: '1rem',
              }}
            >
              {substance.name === 'Glyphosate'
                ? 'Detected in >80% of US urine samples — found in oats, wheat, and many tap-water systems.'
                : substance.name === 'Microplastics'
                ? 'Ubiquitous in modern food chains — from bottled water to seafood to the air we breathe.'
                : substance.name === 'PCBs'
                ? 'Persistent legacy pollutant found in sediment, wildlife, and human adipose tissue decades after production ceased.'
                : 'Widely used in food packaging — emerging evidence on thermal leaching into beverages and fatty foods.'}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
              }}
            >
              {substance.description || 'A complex environmental and health substance with multiple claim dimensions.'}
            </p>

            {/* Quick-take chips / pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              {tier === 'hazard' &&
                (substance.name === 'Glyphosate'
                  ? ['🥣 Found in oats', '💧 Detected in tap water', '👶 Trace in most people']
                  : substance.name === 'Microplastics'
                  ? ['🦪 In seafood', '🌊 In drinking water', '💨 Airborne particles']
                  : substance.name === 'PCBs'
                  ? ['🪨 Sediment bound', '🐟 Bioaccumulative', '🔬 Ubiquitous legacy']
                  : ['🍼 In PET bottles', '☕ Thermal leaching', '🔬 Emerging concern']
                ).map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-full"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      padding: '0.65rem 1.25rem',
                      background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                      color: 'var(--ink)',
                      border: `1.5px solid ${color}30`,
                      animation: 'anim-slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                      animationDelay: `${idx * 120}ms`,
                      transition: 'all 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = `0 8px 16px ${color}20`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {chip}
                  </span>
                ))}
            </div>
          </div>

          {/* Right-side info bubble */}
          <div className="flex justify-between items-start gap-6">
            <div style={{ flex: 1 }} />
            <CornerBrackets size={12} thickness={1} color={color} inset={2}>
              <div
                className="rounded-lg p-4"
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  minWidth: '200px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: color, marginBottom: '0.75rem' }}>
                  CLAIM COUNTS
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: 'var(--ink)',
                    lineHeight: 1.6,
                  }}
                >
                  <div>{claims.filter((c) => c.status === 'certified').length} certified</div>
                  <div style={{ color: 'var(--crimson)' }}>
                    {claims.filter((c) => c.status === 'contested').length} contested
                  </div>
                  <div style={{ color: 'var(--peach-deep)' }}>
                    {claims.filter((c) => c.status === 'provisional').length} provisional
                  </div>
                </div>
              </div>
            </CornerBrackets>
          </div>
        </div>
      </div>
    );
  }

  // Profile layer content
  if (tier === 'profile') {
    return (
      <div id={`tier-${id}`} className="mb-12 relative pl-16 scroll-mt-24 anim-layer-rise">
        {/* Depth marker */}
        <div className="absolute left-0 top-0 flex flex-col items-center">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              marginBottom: '0.5rem',
              animation: 'depth-pulse 2.4s ease-in-out infinite',
              animationDelay: '0.1s',
            }}
          />
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--ink-mute)',
            animation: 'depth-pulse 2.4s ease-in-out infinite',
            animationDelay: '0.4s',
          }}>
            {depth}
          </div>
          <div
            style={{
              width: '1px',
              height: '120px',
              background: `${color}40`,
              marginTop: '0.5rem',
            }}
          />
        </div>

        {/* Card */}
        <div
          className="tile overflow-hidden bg-white"
          style={{
            boxShadow: '0 2px 8px rgba(26, 36, 51, 0.08)',
          }}
        >
          {/* Top accent stripe */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${color}, ${color}40)`,
            }}
          />

          {/* Content area with texture */}
          <div
            style={{
              background: layerBackgrounds[tier],
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: color,
                marginBottom: '1rem',
              }}
            >
              {eyebrow}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '1.4rem',
                color: 'var(--ink)',
                marginBottom: '1rem',
              }}
            >
              {substance.name === 'Glyphosate'
                ? 'EPSP synthase inhibitor; gut microbiome disruption under study.'
                : substance.name === 'Microplastics'
                ? 'Particulate translocation across epithelial barriers; inflammatory response markers elevated in some populations.'
                : substance.name === 'PCBs'
                ? 'Persistent organochlorine; binds to fatty tissues; multiple mechanism pathways (AhR, nuclear receptor).'
                : 'Thermal hydrolysis releases monomer; endocrine-active at low doses; accumulates in adipose.'}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
                marginBottom: '1.5rem',
              }}
            >
              {substance.name === 'Glyphosate'
                ? 'Mechanism: herbicide blocks aromatic amino acid synthesis via inhibition of EPSP synthase. Human relevance through altered gut microbiota composition and potential immunological shifts.'
                : substance.name === 'Microplastics'
                ? 'Mechanism: small particle size allows crossing of mucous membranes; can reach systemic circulation; inflammatory cascade activation observed in vitro and in animal models.'
                : substance.name === 'PCBs'
                ? 'Mechanism: Cl substitution pattern determines biological activity (Cl at 2,2\',4,4\' positions most toxic). AhR activation triggers CYP450 induction and altered estrogen metabolism.'
                : 'Mechanism: BPA leaching increases with temperature, pH, and fatty food contact. Binds estrogen receptors at low nanomolar concentrations in cell culture.'}
            </p>

            {/* Biomarker panel */}
            <div style={{ marginTop: '1.5rem' }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-mute)',
                  marginBottom: '0.75rem',
                }}
              >
                Biomarkers
              </div>
              <div className="flex flex-wrap gap-2">
                {substance.name === 'Glyphosate'
                  ? ['urinary_glyphosate', 'urinary_AMPA', 'serum_GLP-1'].map((b, idx) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          background: `${color}12`,
                          border: `1px solid ${color}30`,
                          color: 'var(--ink)',
                          animation: 'anim-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                          animationDelay: `${idx * 80}ms`,
                        }}
                      >
                        {b}
                      </span>
                    ))
                  : substance.name === 'Microplastics'
                  ? ['plastic_particles_serum', 'inflammatory_markers', 'oxidative_stress'].map((b, idx) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          background: `${color}12`,
                          border: `1px solid ${color}30`,
                          color: 'var(--ink)',
                          animation: 'anim-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                          animationDelay: `${idx * 80}ms`,
                        }}
                      >
                        {b}
                      </span>
                    ))
                  : substance.name === 'PCBs'
                  ? ['serum_PCB_congeners', 'liver_enzymes', 'thyroid_hormone'].map((b, idx) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          background: `${color}12`,
                          border: `1px solid ${color}30`,
                          color: 'var(--ink)',
                          animation: 'anim-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                          animationDelay: `${idx * 80}ms`,
                        }}
                      >
                        {b}
                      </span>
                    ))
                  : ['BPA_urine', 'BPA_serum', 'estrogen_receptor_activity'].map((b, idx) => (
                      <span
                        key={b}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                          fontStyle: 'normal',
                          background: `${color}12`,
                          border: `1px solid ${color}30`,
                          color: 'var(--ink)',
                          animation: 'anim-slide-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                          animationDelay: `${idx * 80}ms`,
                        }}
                      >
                        {b}
                      </span>
                    ))}
              </div>
            </div>
          </div>

          {/* Right-side info bubble */}
          <div className="flex justify-between items-start gap-6">
            <div style={{ flex: 1 }} />
            <CornerBrackets size={12} thickness={1} color={color} inset={2}>
              <div
                className="rounded-lg p-4"
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  minWidth: '200px',
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: color, marginBottom: '0.75rem' }}>
                  SOURCE TIERS
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: 'var(--ink)',
                    lineHeight: 1.8,
                  }}
                >
                  <div>Regulatory: {claims.filter((c) => c.sources?.[0]?.tier === 1).length}</div>
                  <div>Systematic: {claims.filter((c) => c.sources?.some((s) => s.tier === 2)).length}</div>
                  <div>Peer-reviewed: {claims.filter((c) => c.sources?.some((s) => s.tier === 3)).length}</div>
                </div>
              </div>
            </CornerBrackets>
          </div>
        </div>
      </div>
    );
  }

  // Response layer content
  if (tier === 'response') {
    const supportingClaims = claims.filter((c) => {
      const supportingSources = c.sources.filter((s) => s.supports);
      return supportingSources.length > 0;
    });

    const contradictingClaims = claims.filter((c) => {
      const contradictingSources = c.sources.filter((s) => !s.supports);
      return contradictingSources.length > 0;
    });

    return (
      <div id={`tier-${id}`} className="mb-12 relative pl-16 scroll-mt-24 anim-layer-rise">
        {/* Depth marker */}
        <div className="absolute left-0 top-0 flex flex-col items-center">
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: color,
              marginBottom: '0.5rem',
              animation: 'depth-pulse 2.4s ease-in-out infinite',
              animationDelay: '0.2s',
            }}
          />
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--ink-mute)',
            animation: 'depth-pulse 2.4s ease-in-out infinite',
            animationDelay: '0.5s',
          }}>
            {depth}
          </div>
          <div
            style={{
              width: '1px',
              height: '120px',
              background: `${color}40`,
              marginTop: '0.5rem',
            }}
          />
        </div>

        {/* Card */}
        <div
          className="tile overflow-hidden bg-white"
          style={{
            boxShadow: '0 2px 8px rgba(26, 36, 51, 0.08)',
          }}
        >
          {/* Top accent stripe */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${color}, ${color}40)`,
            }}
          />

          {/* Content area with texture */}
          <div
            style={{
              background: layerBackgrounds[tier],
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: color,
                marginBottom: '1rem',
              }}
            >
              {eyebrow}
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '1.4rem',
                color: 'var(--ink)',
                marginBottom: '1rem',
              }}
            >
              {substance.name === 'Glyphosate'
                ? 'IARC 2A vs EPA "not likely" — active disagreement.'
                : substance.name === 'Microplastics'
                ? 'Regulatory absent; evidence accelerating; precautionary principle applied.'
                : substance.name === 'PCBs'
                ? 'Banned globally; persistent in environment; legacy liability cases ongoing.'
                : 'FDA approval maintained; industry studies vs independent research divergence.'}
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--ink-soft)',
                marginBottom: '1.5rem',
              }}
            >
              {substance.name === 'Glyphosate'
                ? 'Contested classification between IARC (carcinogenic 2A) and EPA (not likely carcinogenic). Primary disagreement on epidemiological weight and mechanistic pathway specificity.'
                : substance.name === 'Microplastics'
                ? 'No binding regulatory classification; scientific evidence outpacing policy. Most countries applying precaution in specific use categories (single-use plastic, microbeads).'
                : substance.name === 'PCBs'
                ? 'Banned under Stockholm Convention; U.S. TSCA ban 2006. Persistent in global food chains and human tissue.'
                : 'EPA and FDA maintain safety margin for BPA. European Union classifies as of high concern; restricted use in certain applications.'}
            </p>

            {/* Supporting vs Contradicting split */}
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="border-l-4 rounded-lg p-4"
                style={{
                  borderColor: 'var(--teal)',
                  background: 'rgba(46, 164, 163, 0.05)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--teal)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Supporting
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  {supportingClaims.length} sources back the concern
                </div>
              </div>

              <div
                className="border-l-4 rounded-lg p-4"
                style={{
                  borderColor: 'var(--crimson)',
                  background: 'rgba(232, 55, 89, 0.05)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--crimson)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Contradicting
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>
                  {contradictingClaims.length} sources contest the claim
                </div>
              </div>
            </div>
          </div>

          {/* Right-side info bubble */}
          <div className="flex justify-between items-start gap-6">
            <div style={{ flex: 1 }} />
            <CornerBrackets size={12} thickness={1} color={color} inset={2}>
              <div
                className="rounded-lg p-4"
                style={{
                  background: `${color}08`,
                  border: `1px solid ${color}20`,
                  minWidth: '200px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--crimson)',
                    marginBottom: '0.5rem',
                  }}
                >
                  CONTESTED
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    color: 'var(--ink-soft)',
                    lineHeight: 1.6,
                  }}
                >
                  {substance.name === 'Glyphosate' && 'IARC Monograph 112 (2015) · Zhang et al. 2019 (meta-analysis)'}
                  {substance.name === 'Microplastics' && 'Marfella et al. 2024 · Ragusa et al. 2021'}
                  {substance.name === 'PCBs' && 'Grimm et al. 2016 · Hansen 2001'}
                  {substance.name === 'PET' && 'Rochester et al. 2018 · Vandenberg et al. 2010'}
                </div>
              </div>
            </CornerBrackets>
          </div>
        </div>
      </div>
    );
  }

  // Citations layer content
  const sourcesByTier = groupSourcesByTier(
    claims.flatMap((c) => c.sources)
  );

  const tierLabels = {
    1: 'Regulatory',
    2: 'Systematic Review',
    3: 'Peer-Reviewed',
    4: 'Industry / News',
  };

  return (
    <div id={`tier-${id}`} className="mb-12 relative pl-16 scroll-mt-24 anim-layer-rise">
      {/* Depth marker */}
      <div className="absolute left-0 top-0 flex flex-col items-center">
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: color,
            marginBottom: '0.5rem',
            animation: 'depth-pulse 2.4s ease-in-out infinite',
            animationDelay: '0.3s',
          }}
        />
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--ink-mute)',
          animation: 'depth-pulse 2.4s ease-in-out infinite',
          animationDelay: '0.6s',
        }}>
          {depth}
        </div>
        <div
          style={{
            width: '1px',
            height: '120px',
            background: `${color}40`,
            marginTop: '0.5rem',
          }}
        />
      </div>

      {/* Card */}
      <div
        className="rounded-xl border border-[var(--paper-line)] overflow-hidden bg-white p-8 md:p-10"
        style={{
          boxShadow: '0 2px 8px rgba(26, 36, 51, 0.08)',
        }}
      >
        {/* Top accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${color}, ${color}40)`,
          }}
        />

        {/* Content area with texture */}
        <div
          style={{
            background: layerBackgrounds[tier],
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: color,
              marginBottom: '1rem',
            }}
          >
            {eyebrow}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-sans)',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '1.4rem',
              color: 'var(--ink)',
              marginBottom: '1rem',
            }}
          >
            The bedrock.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--ink-soft)',
              marginBottom: '1.5rem',
            }}
          >
            Primary sources backing every claim. Organized by evidence tier from regulatory (highest) through industry/news (lowest).
          </p>

          {/* Source list by tier */}
          <div className="space-y-6">
            {(Object.entries(sourcesByTier) as Array<[string, EvidenceSource[]]>).map(([tierNum, srcs]) => {
              const tier = parseInt(tierNum) as 1 | 2 | 3 | 4;
              if (srcs.length === 0) return null;

              return (
                <div key={tier}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-mute)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Tier {tier} — {tierLabels[tier]} ({srcs.length})
                  </div>

                  <div className="space-y-3">
                    {srcs.map((src, idx) => {
                      const qResult = quoteOrPending(src.quote);
                      return (
                        <div key={idx} className="border-l-2 border-[var(--paper-line)] pl-4 pb-3">
                          <div
                            style={{
                              fontFamily: 'var(--font-sans)',
                              fontStyle: 'normal',
                              fontWeight: 600,
                              fontSize: '0.95rem',
                              color: 'var(--ink)',
                              marginBottom: '0.25rem',
                            }}
                          >
                            {src.title}
                          </div>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.8rem',
                              color: 'var(--ink-mute)',
                              marginBottom: '0.5rem',
                            }}
                          >
                            {src.publisher} · {src.year || 'n.d.'}
                            {src.doi && (
                              <>
                                {' · '}
                                <a
                                  href={`https://doi.org/${src.doi}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ color: 'var(--teal)', textDecoration: 'underline' }}
                                >
                                  DOI
                                </a>
                              </>
                            )}
                          </div>
                          {qResult.verified && qResult.text && (
                            <div
                              style={{
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.85rem',
                                color: 'var(--ink-soft)',
                                fontStyle: 'italic',
                                lineHeight: 1.6,
                              }}
                            >
                              "{qResult.text}"
                            </div>
                          )}
                          {!qResult.verified && (
                            <div
                              className="inline-flex items-center rounded-full px-2 py-1 text-xs"
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                background: 'var(--paper-warm)',
                                color: 'var(--ink-mute)',
                              }}
                            >
                              pending verbatim verification
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right-side info bubble */}
        <div className="flex justify-between items-start gap-6">
          <div style={{ flex: 1 }} />
          <CornerBrackets size={12} thickness={1} color={color} inset={2}>
            <div
              className="rounded-lg p-4"
              style={{
                background: `${color}08`,
                border: `1px solid ${color}20`,
                minWidth: '200px',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: 'var(--ink)',
                  lineHeight: 1.8,
                }}
              >
                {Object.entries(sourcesByTier).map(([tier, srcs]) => (
                  <div key={tier}>
                    <span style={{ color: 'var(--ink-mute)' }}>T{tier}:</span> {srcs.length}
                  </div>
                ))}
              </div>
            </div>
          </CornerBrackets>
        </div>
      </div>
    </div>
  );
}

export default function CompoundDetailPage({ params }: Props) {
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug) return null;

  return <CompoundDetailContent slug={slug} />;
}
