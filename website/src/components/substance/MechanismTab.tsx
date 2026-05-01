'use client';

import { useState } from 'react';
import DimensionLine from '@/components/shared/DimensionLine';
import CornerBrackets from '@/components/shared/CornerBrackets';
import type { Substance, CertifiedClaimRow } from '@/lib/types-tox';

export default function MechanismTab({
  substance,
  claims,
}: {
  substance: Substance;
  claims: CertifiedClaimRow[];
}) {
  const [tooltipClaimId, setTooltipClaimId] = useState<string | null>(null);

  // Hard-coded SVG diagrams for specific substances
  const renderMechanismDiagram = () => {
    const lowerName = substance.name.toLowerCase();

    if (lowerName.includes('glyphosate')) {
      return (
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Title */}
          <text x="300" y="30" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--ink)">
            Glyphosate: EPSPS Pathway Block
          </text>

          {/* Pathway boxes */}
          <g>
            {/* Shikimate box */}
            <rect x="50" y="100" width="120" height="60" fill="var(--paper-warm)" stroke="var(--ink)" strokeWidth="2" />
            <text x="110" y="135" textAnchor="middle" fontSize="13" fill="var(--ink)" fontFamily="var(--font-mono)">
              Shikimate
            </text>

            {/* Arrow 1 */}
            <line x1="170" y1="130" x2="210" y2="130" stroke="var(--ink-mute)" strokeWidth="2" />
            <polygon points="210,130 200,125 200,135" fill="var(--ink-mute)" />

            {/* EPSPS box with red X */}
            <rect x="210" y="100" width="120" height="60" fill="var(--paper-warm)" stroke="var(--crimson)" strokeWidth="2.5" />
            <text x="270" y="135" textAnchor="middle" fontSize="13" fill="var(--crimson)" fontFamily="var(--font-mono)" fontWeight="bold">
              EPSPS
            </text>
            {/* Red X */}
            <line x1="230" y1="110" x2="310" y2="150" stroke="var(--crimson)" strokeWidth="3" />
            <line x1="310" y1="110" x2="230" y2="150" stroke="var(--crimson)" strokeWidth="3" />

            {/* Arrow 2 (blocked) */}
            <line x1="330" y1="130" x2="370" y2="130" stroke="var(--crimson)" strokeWidth="2" strokeDasharray="5,5" />
            <polygon points="370,130 360,125 360,135" fill="var(--crimson)" />

            {/* Chorismate box */}
            <rect x="370" y="100" width="120" height="60" fill="var(--paper-deep)" stroke="var(--ink-mute)" strokeWidth="2" />
            <text x="430" y="135" textAnchor="middle" fontSize="13" fill="var(--ink-mute)" fontFamily="var(--font-mono)">
              Chorismate
            </text>

            {/* Arrow 3 */}
            <line x1="490" y1="130" x2="530" y2="130" stroke="var(--ink-mute)" strokeWidth="2" />
            <polygon points="530,130 520,125 520,135" fill="var(--ink-mute)" />

            {/* Aromatic AAs */}
            <rect x="530" y="100" width="40" height="60" fill="var(--paper-warm)" stroke="var(--ink)" strokeWidth="2" />
            <text x="550" y="135" textAnchor="middle" fontSize="11" fill="var(--ink)" fontFamily="var(--font-mono)">
              AAs
            </text>
          </g>

          {/* Legend */}
          <text x="50" y="280" fontSize="12" fontWeight="600" fill="var(--ink)">
            Key Claims for This Mechanism:
          </text>
          <g>
            {claims.slice(0, 3).map((claim, idx) => (
              <g key={claim.claim_id}>
                <circle cx="60" cy={320 + idx * 50} r="5" fill="var(--teal)" />
                <text
                  x="80"
                  y={325 + idx * 50}
                  fontSize="12"
                  fill="var(--ink)"
                  onMouseEnter={() => setTooltipClaimId(claim.claim_id)}
                  onMouseLeave={() => setTooltipClaimId(null)}
                  style={{ cursor: 'pointer' }}
                  className="hover:underline"
                >
                  {claim.endpoint_name}
                </text>
                {tooltipClaimId === claim.claim_id && (
                  <rect x="80" y={305 + idx * 50} width="200" height="40" fill="var(--paper-warm)" stroke="var(--ink-mute)" strokeWidth="1" />
                )}
                {tooltipClaimId === claim.claim_id && (
                  <text
                    x="90"
                    y={320 + idx * 50}
                    fontSize="10"
                    fill="var(--ink)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {claim.effect_summary?.substring(0, 40)}…
                  </text>
                )}
              </g>
            ))}
          </g>
        </svg>
      );
    }

    if (lowerName.includes('microplastic')) {
      return (
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Title */}
          <text x="300" y="30" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--ink)">
            Microplastics: Particle Bioaccumulation
          </text>

          {/* Input arrow */}
          <line x1="50" y1="130" x2="120" y2="130" stroke="var(--teal)" strokeWidth="3" />
          <polygon points="120,130 110,125 110,135" fill="var(--teal)" />
          <text x="80" y="115" textAnchor="middle" fontSize="12" fill="var(--teal)" fontFamily="var(--font-mono)">
            Exposure
          </text>

          {/* Tissue uptake */}
          <circle cx="200" cy="130" r="40" fill="var(--paper-warm)" stroke="var(--indigo)" strokeWidth="2" />
          <text x="200" y="135" textAnchor="middle" fontSize="13" fill="var(--indigo)" fontFamily="var(--font-mono)">
            Tissue
          </text>

          {/* Arrow to bioaccumulation */}
          <line x1="240" y1="130" x2="310" y2="130" stroke="var(--ink-mute)" strokeWidth="2" />
          <polygon points="310,130 300,125 300,135" fill="var(--ink-mute)" />

          {/* Bioaccumulation marker */}
          <rect x="310" y="100" width="140" height="60" fill="var(--paper-deep)" stroke="var(--crimson)" strokeWidth="2.5" />
          <text x="380" y="130" textAnchor="middle" fontSize="13" fill="var(--crimson)" fontFamily="var(--font-mono)" fontWeight="bold">
            Bioaccumulation
          </text>

          {/* Stacked particle visualization */}
          <g>
            <rect x="500" y="90" width="30" height="30" fill="var(--peach)" stroke="var(--ink)" strokeWidth="1" />
            <rect x="510" y="100" width="30" height="30" fill="var(--peach)" stroke="var(--ink)" strokeWidth="1" />
            <rect x="520" y="110" width="30" height="30" fill="var(--peach)" stroke="var(--ink)" strokeWidth="1" />
          </g>

          {/* Claims legend */}
          <text x="50" y="260" fontSize="12" fontWeight="600" fill="var(--ink)">
            Associated Health Endpoints:
          </text>
          <g>
            {claims.slice(0, 3).map((claim, idx) => (
              <g key={claim.claim_id}>
                <circle cx="60" cy={300 + idx * 50} r="5" fill="var(--crimson)" />
                <text
                  x="80"
                  y={305 + idx * 50}
                  fontSize="12"
                  fill="var(--ink)"
                  onMouseEnter={() => setTooltipClaimId(claim.claim_id)}
                  onMouseLeave={() => setTooltipClaimId(null)}
                  style={{ cursor: 'pointer' }}
                  className="hover:underline"
                >
                  {claim.endpoint_name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    if (lowerName.includes('pcb')) {
      return (
        <svg
          viewBox="0 0 600 400"
          className="w-full h-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Title */}
          <text x="300" y="30" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--ink)">
            PCBs: Chlorine Substitution & Bioaccumulation
          </text>

          {/* Base molecule */}
          <circle cx="100" cy="130" r="35" fill="var(--paper-warm)" stroke="var(--ink)" strokeWidth="2" />
          <text x="100" y="140" textAnchor="middle" fontSize="11" fill="var(--ink)" fontFamily="var(--font-mono)">
            Biphenyl
          </text>

          {/* Arrow */}
          <line x1="135" y1="130" x2="175" y2="130" stroke="var(--ink-mute)" strokeWidth="2" />
          <polygon points="175,130 165,125 165,135" fill="var(--ink-mute)" />

          {/* Cl substitution */}
          <rect x="175" y="100" width="130" height="60" fill="var(--paper-warm)" stroke="var(--indigo)" strokeWidth="2.5" />
          <text x="240" y="125" textAnchor="middle" fontSize="12" fill="var(--indigo)" fontFamily="var(--font-mono)">
            Cl Substitution
          </text>
          <text x="240" y="145" textAnchor="middle" fontSize="10" fill="var(--indigo)" fontFamily="var(--font-mono)">
            (1–10 atoms)
          </text>

          {/* Arrow */}
          <line x1="305" y1="130" x2="345" y2="130" stroke="var(--ink-mute)" strokeWidth="2" />
          <polygon points="345,130 335,125 335,135" fill="var(--ink-mute)" />

          {/* Persistence */}
          <rect x="345" y="100" width="120" height="60" fill="var(--paper-deep)" stroke="var(--crimson)" strokeWidth="2.5" />
          <text x="405" y="135" textAnchor="middle" fontSize="12" fill="var(--crimson)" fontFamily="var(--font-mono)" fontWeight="bold">
            Persistence
          </text>

          {/* Bioaccumulation graph sketch */}
          <g>
            <line x1="500" y1="160" x2="570" y2="160" stroke="var(--ink-mute)" strokeWidth="1" />
            <line x1="500" y1="160" x2="500" y2="90" stroke="var(--ink-mute)" strokeWidth="1" />
            <polyline points="500,160 520,140 540,110 560,70" fill="none" stroke="var(--teal)" strokeWidth="2" />
            <text x="510" y="175" fontSize="10" fill="var(--ink-mute)" fontFamily="var(--font-mono)">
              Concentration
            </text>
          </g>

          {/* Claims list */}
          <text x="50" y="260" fontSize="12" fontWeight="600" fill="var(--ink)">
            Documented Health Claims:
          </text>
          <g>
            {claims.slice(0, 3).map((claim, idx) => (
              <g key={claim.claim_id}>
                <circle cx="60" cy={300 + idx * 50} r="5" fill="var(--indigo)" />
                <text
                  x="80"
                  y={305 + idx * 50}
                  fontSize="12"
                  fill="var(--ink)"
                  onMouseEnter={() => setTooltipClaimId(claim.claim_id)}
                  onMouseLeave={() => setTooltipClaimId(null)}
                  style={{ cursor: 'pointer' }}
                  className="hover:underline"
                >
                  {claim.endpoint_name}
                </text>
              </g>
            ))}
          </g>
        </svg>
      );
    }

    // Fallback for unknown substances
    return (
      <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8 text-center">
        <p className="text-[var(--ink-mute)] font-data">No mechanism diagram available for {substance.name}</p>
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Section accent bar */}
      <div className="section-accent" />

      {/* Mechanism diagram in a CornerBrackets frame */}
      <CornerBrackets inset={8}>
        <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8">
          {renderMechanismDiagram()}
        </div>
      </CornerBrackets>

      {/* Dimension line separator */}
      <div className="flex justify-center">
        <DimensionLine length={120} label="evidence" />
      </div>

      {/* Claims with hover details */}
      <div className="space-y-4">
        {claims.length > 0 ? (
          claims.map((claim) => (
            <CornerBrackets key={claim.claim_id} inset={6}>
              <div
                className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-6 hover:bg-[var(--paper-deep)] transition-colors"
                onMouseEnter={() => setTooltipClaimId(claim.claim_id)}
                onMouseLeave={() => setTooltipClaimId(null)}
              >
                <div className="font-eyebrow text-[var(--ink-mute)] mb-2">{claim.endpoint_name}</div>
                <div className="font-display text-lg mb-2">{claim.effect_summary}</div>
                {tooltipClaimId === claim.claim_id && (
                  <div className="font-data text-sm text-[var(--ink-soft)] mt-3">
                    {claim.source_count} source{claim.source_count !== 1 ? 's' : ''} · confidence {(claim.confidence_score * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            </CornerBrackets>
          ))
        ) : (
          <div className="rounded border border-[var(--paper-line)] bg-[var(--paper-warm)] p-8 text-center">
            <p className="text-[var(--ink-mute)] font-data">No mechanism claims documented</p>
          </div>
        )}
      </div>
    </div>
  );
}
