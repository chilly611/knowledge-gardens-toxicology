'use client';

/**
 * AnimatedBackdrop — full-bleed dark slate-blue cinematic backdrop with
 * slowly drifting molecular particles. Inspired by the "Unplastic Your Life"
 * Netflix-doc aesthetic: dark, moody, with motion that draws you in.
 *
 * Implementation: SVG with CSS animations only (no canvas, no JS frame loop).
 * Honors prefers-reduced-motion via globals.css's @media block.
 *
 * The molecules are deliberately abstract — six-membered rings, hex shapes,
 * vapor wisps — evoking chemistry without being literal.
 */
import { useMemo } from 'react';

type Particle = {
  cx: number;
  cy: number;
  r: number;
  type: 'ring' | 'hex' | 'wisp' | 'dot';
  delay: number;
  duration: number;
  opacity: number;
};

function seededParticles(count: number): Particle[] {
  const out: Particle[] = [];
  let s = 19_710;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = 0; i < count; i++) {
    out.push({
      cx: rnd() * 100,
      cy: rnd() * 100,
      r: 8 + rnd() * 36,
      type: ['ring', 'hex', 'wisp', 'dot'][Math.floor(rnd() * 4)] as Particle['type'],
      delay: rnd() * 12,
      duration: 16 + rnd() * 22,
      opacity: 0.08 + rnd() * 0.18,
    });
  }
  return out;
}

export default function AnimatedBackdrop({
  className = '',
}: { className?: string }) {
  const particles = useMemo(() => seededParticles(28), []);
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Base gradient — deep slate to near-black */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(120% 80% at 60% 20%, rgba(59, 79, 107, 0.55) 0%, rgba(14, 24, 39, 0.85) 50%, #060c16 90%),
            linear-gradient(180deg, #0e1827 0%, #060c16 100%)
          `,
        }}
      />

      {/* Subtle paper-grain texture so it doesn't feel flat */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.6) 1px, transparent 0)',
          backgroundSize: '3px 3px',
        }}
      />

      {/* Molecular drift */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="ringPath" patternUnits="userSpaceOnUse" width="40" height="40">
            <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="0.4" />
          </pattern>
        </defs>

        {particles.map((p, i) => {
          const stroke = '#7AAFC0';
          const common = {
            opacity: p.opacity,
            filter: 'url(#glow)',
            style: {
              transformOrigin: `${p.cx}% ${p.cy}%`,
              animation: `floatA ${p.duration}s ease-in-out ${p.delay}s infinite`,
            } as React.CSSProperties,
          };
          if (p.type === 'ring') {
            return (
              <g key={i} {...common}>
                <circle cx={p.cx} cy={p.cy} r={p.r / 12} fill="none" stroke={stroke} strokeWidth="0.18" />
                <circle cx={p.cx} cy={p.cy} r={p.r / 22} fill={stroke} fillOpacity="0.4" />
              </g>
            );
          }
          if (p.type === 'hex') {
            const r = p.r / 14;
            const pts = [0, 60, 120, 180, 240, 300]
              .map((a) => `${p.cx + r * Math.cos((a * Math.PI) / 180)},${p.cy + r * Math.sin((a * Math.PI) / 180)}`)
              .join(' ');
            return <polygon key={i} points={pts} fill="none" stroke={stroke} strokeWidth="0.18" {...common} />;
          }
          if (p.type === 'wisp') {
            return (
              <ellipse
                key={i}
                cx={p.cx}
                cy={p.cy}
                rx={p.r / 6}
                ry={p.r / 30}
                fill={stroke}
                fillOpacity={p.opacity * 0.5}
                stroke="none"
                {...common}
              />
            );
          }
          return <circle key={i} cx={p.cx} cy={p.cy} r={p.r / 60} fill={stroke} {...common} />;
        })}
      </svg>

      {/* Vignette to push attention to center */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120% 90% at 50% 35%, transparent 30%, rgba(0,0,0,0.45) 100%)',
        }}
      />

      <style>{`
        @keyframes floatA {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25%      { transform: translate(2.5%, -1.5%) rotate(20deg); }
          50%      { transform: translate(-1.5%, 2.5%) rotate(-10deg); }
          75%      { transform: translate(1.5%, 1.5%) rotate(15deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-hidden] [style*="floatA"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
