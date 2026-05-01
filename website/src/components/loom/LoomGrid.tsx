'use client';

/**
 * Substance × endpoint_category matrix. Reference: design-references/loom.png.
 *
 * Visual elements (must match the reference):
 *   - Card frame with rounded corners + hairline border
 *   - "Highlight weft for: All / Consumer / Clinician / Counsel" segmented pills above the matrix
 *   - Copper-gold gradient stripes (3px) above each substance column header
 *   - Italic Cormorant substance names as column headers (clickable to /substance/[slug])
 *   - Space Mono uppercase row labels on the LEFT of each row (endpoint_category)
 *   - LoomCell renders each (substance, endpoint_category) intersection
 *   - Down-arrow scroll button bottom-center
 *
 * Audience semantics ("Highlight weft for"):
 *   - All        → no dimming, full strength
 *   - Consumer   → emphasize exposure, microbiome, ecotox
 *   - Clinician  → emphasize carcinogenicity, cardiovascular, endocrine, neurodevelopmental, microbiome, mechanistic
 *   - Counsel    → emphasize contested cells across every row, dim certified-only
 */

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { CertifiedClaimRow } from '@/lib/types-tox';
import { slug } from '@/lib/queries-tox';
import LoomCell from './LoomCell';
import ClaimDrawer from './ClaimDrawer';
import SegmentedPills from '@/components/shared/SegmentedPills';
import ScrollDownButton from '@/components/shared/ScrollDownButton';

export type Audience = 'all' | 'consumer' | 'clinician' | 'counsel';

const CLINICIAN_FOCUS = new Set([
  'carcinogenicity',
  'cardiovascular',
  'endocrine',
  'neurodevelopmental',
  'microbiome',
  'mechanistic',
]);
const CONSUMER_FOCUS = new Set([
  'exposure',
  'carcinogenicity',
  'microbiome',
  'ecotox',
]);

export default function LoomGrid({ claims }: { claims: CertifiedClaimRow[] }) {
  const [audience, setAudience] = useState<Audience>('all');
  const [drawerClaim, setDrawerClaim] = useState<CertifiedClaimRow | null>(null);

  const { substances, rows, cellMap } = useMemo(() => {
    const byKey = new Map<string, CertifiedClaimRow>();
    const subSet = new Map<string, string>();
    const rowSet = new Set<string>();
    for (const c of claims) {
      subSet.set(c.substance_id, c.substance_name);
      rowSet.add(c.endpoint_category);
      const key = `${c.substance_id}::${c.endpoint_category}`;
      const existing = byKey.get(key);
      if (!existing || statusRank(c.status) > statusRank(existing.status)) {
        byKey.set(key, c);
      }
    }
    const subsArr = Array.from(subSet.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => {
        const ca = claims.filter((x) => x.substance_id === a.id).length;
        const cb = claims.filter((x) => x.substance_id === b.id).length;
        return cb - ca;
      });
    const rowOrder = ['exposure', 'carcinogenicity', 'cardiovascular', 'endocrine', 'neurodevelopmental', 'microbiome', 'mechanistic', 'ecotox'];
    const rowsArr = Array.from(rowSet).sort((a, b) => {
      const ai = rowOrder.indexOf(a);
      const bi = rowOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
    return { substances: subsArr, rows: rowsArr, cellMap: byKey };
  }, [claims]);

  const isRowHighlighted = (row: string): boolean => {
    if (audience === 'all') return true;
    if (audience === 'consumer')  return CONSUMER_FOCUS.has(row);
    if (audience === 'clinician') return CLINICIAN_FOCUS.has(row);
    return true;
  };

  const isCellDimmed = (claim: CertifiedClaimRow | null, row: string): boolean => {
    if (audience === 'counsel') {
      if (!claim) return true;
      return claim.status !== 'contested';
    }
    if (audience === 'consumer' || audience === 'clinician') {
      return !isRowHighlighted(row);
    }
    return false;
  };

  const isCellHighlighted = (claim: CertifiedClaimRow | null): boolean => {
    if (audience === 'counsel' && claim?.status === 'contested') return true;
    return false;
  };

  return (
    <section className="relative">
      {/* Headline */}
      <div className="mb-8 text-center">
        <h2
          className="mx-auto mb-4 max-w-[24ch] text-[var(--ink)]"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            lineHeight: 1.0,
          }}
        >
          Every substance, every endpoint, every claim.
        </h2>
        <p
          className="mx-auto max-w-2xl text-[var(--ink-soft)]"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.06rem',
            lineHeight: 1.55,
          }}
        >
          Mint = certified. Blush = contested. Peach = provisional. Empty = no claim yet — but the garden grows.
        </p>
      </div>

      <div className="mb-8">
        <SegmentedPills
          label="Highlight weft for:"
          options={[
            { value: 'all',       label: 'All' },
            { value: 'consumer',  label: 'Consumer' },
            { value: 'clinician', label: 'Clinician' },
            { value: 'counsel',   label: 'Counsel' },
          ]}
          value={audience}
          onChange={(v) => setAudience(v as Audience)}
        />
      </div>

      <div className="tile tile-feature bg-[var(--paper-warm)]">
        <div className="overflow-x-auto" style={{ scrollbarColor: 'var(--paper-line) transparent' }}>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `minmax(160px, 0.8fr) repeat(${substances.length}, minmax(200px, 1fr))`,
            }}
          >
            <div />
            {substances.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div
                  className="h-[3px] w-[85%] rounded-full"
                  style={{ background: 'linear-gradient(90deg, transparent 0%, var(--copper-orn) 30%, var(--copper-orn-deep) 70%, transparent 100%)' }}
                />
                <Link
                  href={`/compound/${slug(s.name)}`}
                  className="text-[var(--ink)] hover:text-[var(--teal-deep)] transition-colors"
                  style={{ fontFamily: 'var(--font-body)', fontStyle: 'normal', fontSize: '1.55rem', fontWeight: 800 }}
                >
                  {s.name}
                </Link>
                <Link
                  href={`/compound/${slug(s.name)}`}
                  className="cta-pill cta-pill-secondary mt-3 inline-flex items-center gap-1.5"
                  style={{
                    background: 'var(--tox-deep)',
                    color: 'white',
                  }}
                  title="Open Stratigraph"
                >
                  → Open Stratigraph
                </Link>
              </div>
            ))}

            {rows.map((row) => (
              <RowFragment
                key={row}
                row={row}
                substances={substances}
                cellMap={cellMap}
                rowHighlighted={isRowHighlighted(row)}
                isCellDimmed={(c) => isCellDimmed(c, row)}
                isCellHighlighted={(c) => isCellHighlighted(c)}
                onCellClick={setDrawerClaim}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <ScrollDownButton />
        </div>
      </div>

      {drawerClaim && (
        <ClaimDrawer
          claim={drawerClaim}
          onClose={() => setDrawerClaim(null)}
        />
      )}
    </section>
  );
}

function RowFragment({
  row,
  substances,
  cellMap,
  rowHighlighted,
  isCellDimmed,
  isCellHighlighted,
  onCellClick,
}: {
  row: string;
  substances: { id: string; name: string }[];
  cellMap: Map<string, CertifiedClaimRow>;
  rowHighlighted: boolean;
  isCellDimmed: (claim: CertifiedClaimRow | null) => boolean;
  isCellHighlighted: (claim: CertifiedClaimRow | null) => boolean;
  onCellClick: (claim: CertifiedClaimRow) => void;
}) {
  return (
    <>
      <div className="flex items-center pr-5">
        <div
          className="text-[var(--ink)]"
          style={{
            fontFamily:    'var(--font-mono)',
            fontSize:      '0.85rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            opacity:       rowHighlighted ? 1 : 0.45,
            fontWeight:    rowHighlighted ? 700 : 500,
            color:         rowHighlighted ? 'var(--ink)' : 'var(--ink-mute)',
            transition:    'all 200ms ease',
          }}
        >
          {row.replace(/_/g, ' ')}
        </div>
      </div>

      {substances.map((s) => {
        const key = `${s.id}::${row}`;
        const claim = cellMap.get(key) ?? null;
        return (
          <LoomCell
            key={key}
            claim={claim}
            highlighted={isCellHighlighted(claim)}
            dimmed={isCellDimmed(claim)}
            onClick={claim ? () => onCellClick(claim) : undefined}
          />
        );
      })}
    </>
  );
}

function statusRank(status: string): number {
  if (status === 'contested') return 3;
  if (status === 'provisional') return 2;
  if (status === 'certified') return 1;
  return 0;
}
