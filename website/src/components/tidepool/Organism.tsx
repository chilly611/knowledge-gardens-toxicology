'use client';

import { CSSProperties } from 'react';
import { useReducedMotion } from '@/lib/animations';

/**
 * Organism — bioluminescent jellyfish-like SVG organism.
 * A soft glowing circle with trailing tentacle paths.
 * Drifts via CSS animation (6-8s ease-in-out).
 * Color from jewel tones (teal, peach, crimson).
 */
export default function Organism({
  color = 'var(--teal)',
  size = 80,
  style = {},
}: {
  color?: string;
  size?: number;
  style?: CSSProperties;
}) {
  const prefersReduced = useReducedMotion();

  // SVG composition: central glow circle + 4 trailing tentacles with curve
  const radius = size / 2;
  const tentacleCount = 4;
  const tentacleLength = size * 1.2;

  // Generate tentacles at 90-degree intervals
  const tentacles = Array.from({ length: tentacleCount }, (_, i) => {
    const angle = (i * 360) / tentacleCount;
    const rad = (angle * Math.PI) / 180;
    // Start point at edge of circle
    const x1 = radius + radius * Math.cos(rad);
    const y1 = radius + radius * Math.sin(rad);
    // End point trailing outward
    const x2 = radius + (radius + tentacleLength) * Math.cos(rad);
    const y2 = radius + (radius + tentacleLength) * Math.sin(rad);

    return { x1, y1, x2, y2, angle };
  });

  // If reduced motion, return static version
  if (prefersReduced) {
    return (
      <svg
        width={size * 2}
        height={size * 2.5}
        viewBox={`0 0 ${size * 2} ${size * 2.5}`}
        style={{
          filter: `drop-shadow(0 0 ${size * 0.3}px ${color})`,
          ...style,
        }}
        aria-hidden
      >
        {/* Tentacles */}
        {tentacles.map((t, i) => (
          <path
            key={`tent-${i}`}
            d={`M ${t.x1} ${t.y1} Q ${t.x1 + (t.x2 - t.x1) * 0.3} ${t.y1 + (t.y2 - t.y1) * 0.5 + 8}, ${t.x2} ${t.y2}`}
            stroke={color}
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        ))}
        {/* Central glow circle */}
        <circle
          cx={radius}
          cy={radius}
          r={radius}
          fill={color}
          opacity="0.8"
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius * 0.6}
          fill={color}
          opacity="0.3"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size * 2}
      height={size * 2.5}
      viewBox={`0 0 ${size * 2} ${size * 2.5}`}
      style={{
        filter: `drop-shadow(0 0 ${size * 0.3}px ${color})`,
        ...style,
      }}
      aria-hidden
    >
      {/* Tentacles — wave-like curves trailing from organism */}
      {tentacles.map((t, i) => (
        <path
          key={`tent-${i}`}
          d={`M ${t.x1} ${t.y1} Q ${t.x1 + (t.x2 - t.x1) * 0.3} ${t.y1 + (t.y2 - t.y1) * 0.5 + 8}, ${t.x2} ${t.y2}`}
          stroke={color}
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
      ))}

      {/* Central glow circle (outer halo) */}
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill={color}
        opacity="0.8"
      />

      {/* Inner core (brighter center) */}
      <circle
        cx={radius}
        cy={radius}
        r={radius * 0.6}
        fill={color}
        opacity="0.3"
      />
    </svg>
  );
}
