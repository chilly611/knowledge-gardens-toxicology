'use client';

import { useState, CSSProperties } from 'react';
import { useReducedMotion } from '@/lib/animations';

/**
 * Bloom — smaller orbs orbiting a substance organism.
 * Each bloom is a claim (8-14px radius) with color by status.
 * Orbits at 4s with slightly randomized phase.
 * Tooltip on hover shows effect_summary (truncated to ~80 chars).
 *
 * Note: This component is designed to be positioned absolutely within
 * a parent container. The animation is a gentle drift, not a full orbit,
 * to keep 60fps on mid-range devices.
 */
export default function Bloom({
  x = 0,
  y = 0,
  color = 'var(--teal)',
  size = 10,
  effectSummary = '',
  animationDelay = 0,
}: {
  x?: number;
  y?: number;
  color?: string;
  size?: number;
  effectSummary?: string;
  animationDelay?: number;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const prefersReduced = useReducedMotion();

  // Truncate effect summary to ~80 chars
  const tooltip =
    effectSummary.length > 80
      ? effectSummary.substring(0, 77) + '...'
      : effectSummary;

  if (prefersReduced) {
    return (
      <div
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          width: `${size * 2}px`,
          height: `${size * 2}px`,
          background: color,
          borderRadius: '50%',
          opacity: 0.7,
          cursor: 'default',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="img"
        aria-label={tooltip || 'Claim bloom'}
      >
        {showTooltip && tooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              padding: '6px 10px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
              zIndex: 100,
              pointerEvents: 'none',
            }}
          >
            {tooltip}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        top: `${y}px`,
        width: `${size * 2}px`,
        height: `${size * 2}px`,
        background: color,
        borderRadius: '50%',
        opacity: 0.8,
        cursor: 'pointer',
        boxShadow: `0 0 ${size}px ${color}`,
        animation: `drift 4s ease-in-out infinite`,
        animationDelay: `${animationDelay}s`,
        transition: 'box-shadow 0.2s, opacity 0.2s',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      role="img"
      aria-label={tooltip || 'Claim bloom'}
    >
      {showTooltip && tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '12px',
            padding: '8px 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: 'var(--ink)',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            whiteSpace: 'nowrap',
            zIndex: 100,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
