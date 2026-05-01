'use client';

import DimensionLine from '@/components/shared/DimensionLine';

/**
 * Substrate — brass/copper grid base representing "the schema beneath the wonder."
 * SVG grid with copper ornament color at 0.4 opacity.
 * Includes decorative DimensionLine callouts to suggest dimensionality.
 */
export default function Substrate() {
  const gridSize = 40; // pixels between grid lines
  const cols = 16;
  const rows = 8;
  const width = cols * gridSize;
  const height = rows * gridSize;

  return (
    <div
      className="flex flex-col items-center gap-12"
      style={{
        width: '100%',
      }}
    >
      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
        style={{
          maxWidth: '100%',
          height: 'auto',
          aspectRatio: `${width} / ${height}`,
        }}
        aria-hidden
      >
        {/* Vertical lines */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * gridSize}
            y1="0"
            x2={i * gridSize}
            y2={height}
            stroke="var(--copper-orn)"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}

        {/* Horizontal lines */}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={i * gridSize}
            x2={width}
            y2={i * gridSize}
            stroke="var(--copper-orn)"
            strokeWidth="1"
            opacity="0.4"
          />
        ))}

        {/* Callout points — small circles at key intersections */}
        {[
          { x: 2, y: 2 },
          { x: cols - 2, y: 2 },
          { x: 2, y: rows - 2 },
          { x: cols - 2, y: rows - 2 },
        ].map((pt, i) => (
          <circle
            key={`callout-${i}`}
            cx={pt.x * gridSize}
            cy={pt.y * gridSize}
            r="3"
            fill="var(--copper-orn)"
            opacity="0.5"
          />
        ))}
      </svg>

      {/* Decorative dimension callouts */}
      <div
        className="flex gap-16 justify-center items-center flex-wrap"
        style={{
          maxWidth: '100%',
          marginTop: '2rem',
        }}
      >
        <DimensionLine length={120} label="SCHEMA" />
        <DimensionLine length={100} label="EVIDENCE" />
        <DimensionLine length={80} label="DEPTH" />
      </div>
    </div>
  );
}
