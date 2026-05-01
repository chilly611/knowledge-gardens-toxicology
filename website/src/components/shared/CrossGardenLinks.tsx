'use client';

import React from 'react';
import type { CrossGardenLink } from '@/lib/types-tox';
import { tokens } from '@/styles/tokens';
import Emblem from './Emblem';
import CornerBrackets from './CornerBrackets';
import DimensionLine from './DimensionLine';

/**
 * Cross-Garden Links component — horizontal strip showing connections to sibling
 * Knowledge Gardens (HKG / NatureMark / BKG / OKG).
 *
 * Groups links by target_garden. Each branch displays:
 * - Garden icon (emblem for TKG, inline SVG for others)
 * - Garden name in italic Cormorant
 * - Relation type in Space Mono uppercase
 * - Target entity label
 * - Notes if present
 *
 * Layout: horizontal flex at lg+, stacks vertically below 768px.
 */
export default function CrossGardenLinks({ links }: { links: CrossGardenLink[] }) {
  if (!links || links.length === 0) {
    return null;
  }

  // Group links by target_garden
  const grouped = links.reduce(
    (acc, link) => {
      if (!acc[link.target_garden]) {
        acc[link.target_garden] = [];
      }
      acc[link.target_garden].push(link);
      return acc;
    },
    {} as Record<string, CrossGardenLink[]>
  );

  const gardens = Object.entries(grouped);
  const gardenOrder = ['TKG', 'HKG', 'NatureMark', 'BKG', 'OKG'];
  const sortedGardens = gardens.sort(
    ([a], [b]) => gardenOrder.indexOf(a) - gardenOrder.indexOf(b)
  );

  const getGardenConfig = (
    garden: string
  ): {
    icon: React.ReactNode;
    label: string;
    color: string;
  } => {
    switch (garden) {
      case 'TKG':
        return {
          icon: <Emblem size="inline" />,
          label: 'TKG · Toxicology',
          color: tokens.teal,
        };
      case 'HKG':
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden
              style={{ display: 'block' }}
            >
              {/* Red caduceus for Health Knowledge Garden */}
              <circle cx="24" cy="24" r="22" fill="none" stroke={tokens.crimson} strokeWidth="1.5" opacity="0.3" />
              <line x1="24" y1="6" x2="24" y2="42" stroke={tokens.crimson} strokeWidth="1.5" />
              <path
                d="M 20 14 Q 16 18 20 22 Q 24 26 20 30 Q 16 34 20 38"
                stroke={tokens.crimson}
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M 28 14 Q 32 18 28 22 Q 24 26 28 30 Q 32 34 28 38"
                stroke={tokens.crimson}
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="24" cy="12" r="2" fill={tokens.crimson} />
            </svg>
          ),
          label: 'HKG · Health',
          color: tokens.crimson,
        };
      case 'NatureMark':
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden
              style={{ display: 'block' }}
            >
              {/* Gold leaf for NatureMark */}
              <path
                d="M 24 8 Q 28 16 26 24 Q 24 32 18 38 L 24 28 Q 30 20 24 8"
                fill="none"
                stroke={tokens.peach}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 24 8 Q 20 16 22 24 Q 24 32 30 38 L 24 28 Q 18 20 24 8"
                fill="none"
                stroke={tokens.peach}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="24" r="3" fill={tokens.peach} opacity="0.6" />
            </svg>
          ),
          label: 'NatureMark',
          color: tokens.peach,
        };
      case 'BKG':
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden
              style={{ display: 'block' }}
            >
              {/* Copper hammer for Builders Knowledge Garden */}
              <rect x="20" y="8" width="8" height="12" fill={tokens.copper} />
              <polygon
                points="16,20 32,20 30,32 18,32"
                fill={tokens.copper}
                opacity="0.8"
              />
              <line
                x1="24"
                y1="20"
                x2="24"
                y2="42"
                stroke={tokens.copper}
                strokeWidth="1.5"
              />
              <circle cx="24" cy="24" r="2" fill={tokens.copperDeep} opacity="0.6" />
            </svg>
          ),
          label: 'BKG · Builders',
          color: tokens.copper,
        };
      case 'OKG':
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden
              style={{ display: 'block' }}
            >
              {/* Teal orchid for Orchid Knowledge Garden */}
              <path
                d="M 24 10 Q 20 14 20 18 Q 20 22 24 24 Q 28 22 28 18 Q 28 14 24 10"
                fill={tokens.tealDeep}
                opacity="0.6"
              />
              <ellipse cx="16" cy="26" rx="4" ry="6" fill="none" stroke={tokens.teal} strokeWidth="1.5" />
              <ellipse cx="32" cy="26" rx="4" ry="6" fill="none" stroke={tokens.teal} strokeWidth="1.5" />
              <path
                d="M 24 24 Q 22 30 20 36 Q 24 38 28 36 Q 26 30 24 24"
                stroke={tokens.teal}
                strokeWidth="1.5"
                fill="none"
              />
              <circle cx="24" cy="32" r="1.5" fill={tokens.teal} />
            </svg>
          ),
          label: 'OKG · Orchid',
          color: tokens.tealDeep,
        };
      default:
        return {
          icon: (
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              aria-hidden
              style={{ display: 'block' }}
            >
              {/* Generic dot */}
              <circle cx="24" cy="24" r="4" fill={tokens.inkMute} opacity="0.5" />
            </svg>
          ),
          label: garden,
          color: tokens.inkMute,
        };
    }
  };

  return (
    <div className="space-y-4 md:space-y-0">
      {/* Horizontal scroll on mobile, flex row on desktop */}
      <div className="flex flex-col gap-4 md:flex-row md:gap-2 overflow-x-auto">
        {sortedGardens.map(([garden, gardenLinks], idx) => {
          const config = getGardenConfig(garden);

          return (
            <React.Fragment key={garden}>
              {/* Branch card */}
              <CornerBrackets size={12} thickness={0.8} color={config.color} className="flex-1 min-w-[280px] md:min-w-[240px]">
                <div
                  className="rounded border bg-[var(--paper-warm)] p-6"
                  style={{
                    borderLeftColor: config.color,
                    borderLeftWidth: 3,
                  }}
                >
                  {/* Garden icon & name header */}
                  <div className="mb-6 flex flex-col items-center gap-2">
                    <div className="w-full flex justify-center">{config.icon}</div>
                    <div
                      className="text-center italic text-sm"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </div>
                  </div>

                  {/* Links within this garden */}
                  <div className="space-y-4">
                    {gardenLinks.map((link, linkIdx) => (
                      <div key={linkIdx}>
                        {/* Render as link if URL available */}
                        {link.target_url ? (
                          <a
                            href={link.target_url}
                            target="_blank"
                            rel="noreferrer"
                            className="block no-underline transition-colors hover:opacity-80"
                          >
                            <LinkContent link={link} />
                          </a>
                        ) : (
                          <div title="Link reserved">
                            <LinkContent link={link} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CornerBrackets>

              {/* Separator between branches (hidden on last) */}
              {idx < sortedGardens.length - 1 && (
                <div className="hidden md:flex items-center mx-2">
                  <DimensionLine
                    length={120}
                    vertical
                    color={tokens.paperLine}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Link content — relation type, target entity, notes.
 */
function LinkContent({ link }: { link: CrossGardenLink }) {
  return (
    <div className="space-y-2">
      {/* Relation type in Space Mono uppercase */}
      <div className="font-data text-xs uppercase tracking-wider text-[var(--ink-mute)]">
        {link.relation.replace(/_/g, ' ')}
      </div>

      {/* Target entity label */}
      <div className="text-sm italic text-[var(--ink)]">
        {link.target_external_id || 'Link reserved'}
      </div>

      {/* Notes if present */}
      {link.notes && (
        <div className="text-xs text-[var(--ink-soft)] italic">
          {link.notes}
        </div>
      )}
    </div>
  );
}
