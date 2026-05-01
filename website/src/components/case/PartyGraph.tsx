'use client';

import { useState } from 'react';
import type { CaseParty } from '@/lib/types-tox';
import { tokens } from '@/styles/tokens';

export default function PartyGraph({ parties }: { parties: CaseParty[] }) {
  const [hoveredPartyId, setHoveredPartyId] = useState<string | null>(null);

  // Party type colors
  const partyColor = (type: string): string => {
    if (type === 'plaintiff') return tokens.teal;
    if (type === 'defendant') return tokens.crimson;
    if (type === 'expert') return tokens.indigo;
    if (type === 'amicus') return tokens.peachDeep;
    return tokens.inkMute;
  };

  // Compute radial layout
  const centerX = 280;
  const centerY = 280;
  const radius = 180;
  const nodeRadius = 32;

  // Position parties in a circle, avoiding overlap with angle perturbations
  const positions = parties.map((party, i) => {
    const angle = (i / Math.max(parties.length, 1)) * Math.PI * 2;
    // Small angle perturbation to avoid overlaps
    const perturbedAngle = angle + Math.random() * 0.1 - 0.05;
    const x = centerX + radius * Math.cos(perturbedAngle);
    const y = centerY + radius * Math.sin(perturbedAngle);
    return { party, x, y };
  });

  const svgHeight = 560;

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 560 ${svgHeight}`}
        className="mx-auto"
        aria-label="Case parties network diagram"
      >
        {/* Connection lines from center to each party */}
        {positions.map((pos, idx) => (
          <line
            key={`line-${idx}`}
            x1={centerX}
            y1={centerY}
            x2={pos.x}
            y2={pos.y}
            stroke={partyColor(pos.party.party_type)}
            strokeWidth="1"
            opacity="0.2"
            strokeDasharray="3 3"
          />
        ))}

        {/* Center emblem indicator */}
        <circle
          cx={centerX}
          cy={centerY}
          r="12"
          fill={tokens.teal}
          opacity="0.6"
        />

        {/* Party nodes */}
        {positions.map((pos, idx) => {
          const isHovered = hoveredPartyId === pos.party.id;
          const color = partyColor(pos.party.party_type);
          const fillOpacity = isHovered ? 0.9 : 0.7;
          const scale = isHovered ? 1.15 : 1;

          return (
            <g
              key={pos.party.id}
              onMouseEnter={() => setHoveredPartyId(pos.party.id)}
              onMouseLeave={() => setHoveredPartyId(null)}
              style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              transform={`translate(${pos.x}, ${pos.y}) scale(${scale})`}
            >
              {/* Node circle */}
              <circle
                cx="0"
                cy="0"
                r={nodeRadius}
                fill={color}
                opacity={fillOpacity}
                className="transition-opacity"
              />

              {/* Hover tooltip background (hidden by default) */}
              {isHovered && (
                <g>
                  <rect
                    x="-50"
                    y="-60"
                    width="100"
                    height="40"
                    fill={tokens.paper}
                    stroke={color}
                    strokeWidth="1"
                    rx="4"
                    opacity="0.95"
                  />
                  <text
                    x="0"
                    y="-45"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="'Cormorant Garamond', serif"
                    fontStyle="italic"
                    fill={tokens.ink}
                    fontWeight="600"
                  >
                    {pos.party.party_type.charAt(0).toUpperCase() +
                      pos.party.party_type.slice(1)}
                  </text>
                  {pos.party.role && (
                    <text
                      x="0"
                      y="-32"
                      textAnchor="middle"
                      fontSize="9"
                      fontFamily="'Space Mono', monospace"
                      fill={tokens.inkMute}
                    >
                      {pos.party.role}
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Party name labels positioned radially outside circles */}
        {positions.map((pos) => {
          const angle = Math.atan2(pos.y - centerY, pos.x - centerX);
          const labelDist = nodeRadius + 40;
          const labelX = pos.x + labelDist * Math.cos(angle);
          const labelY = pos.y + labelDist * Math.sin(angle);

          return (
            <text
              key={`label-${pos.party.id}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              fontSize="12"
              fontFamily="'Cormorant Garamond', serif"
              fontStyle="italic"
              fill={tokens.ink}
              fontWeight="500"
              pointerEvents="none"
            >
              {pos.party.name}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: tokens.teal }}
          />
          <span className="text-[var(--ink-soft)]">Plaintiff</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: tokens.crimson }}
          />
          <span className="text-[var(--ink-soft)]">Defendant</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: tokens.indigo }}
          />
          <span className="text-[var(--ink-soft)]">Expert</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: tokens.peachDeep }}
          />
          <span className="text-[var(--ink-soft)]">Amicus</span>
        </div>
      </div>
    </div>
  );
}
