'use client';

/**
 * Slow-rotating gear ornament. Honors prefers-reduced-motion via the
 * `animate-spin` style — the global @media query in globals.css freezes it.
 *
 * Moved from src/components/GearOrnament.tsx — A1 owns this file now.
 */
export default function GearOrnament({
  size = 24,
  color = 'var(--copper-orn)',
  speed = 12,
  reverse = false,
  className = '',
}: {
  size?: number;
  color?: string;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      style={{
        animation: `spin ${speed}s linear infinite${reverse ? ' reverse' : ''}`,
      }}
    >
      <path
        d="M12 1l1.5 3.2a7.5 7.5 0 012.8 1.6L19.5 4l1 2.6-3 1.7a7.5 7.5 0 01.5 3.2h3.5v2.8H18a7.5 7.5 0 01-.5 3.2l3 1.7-1 2.6-3.2-1.8a7.5 7.5 0 01-2.8 1.6L12 23l-1.5-3.2a7.5 7.5 0 01-2.8-1.6L4.5 20l-1-2.6 3-1.7A7.5 7.5 0 016 12.5H2.5V9.7H6a7.5 7.5 0 01.5-3.2l-3-1.7 1-2.6 3.2 1.8a7.5 7.5 0 012.8-1.6L12 1z"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />
      <circle cx="12" cy="12" r="3.5" fill="none" stroke={color} strokeWidth="0.8" />
    </svg>
  );
}
