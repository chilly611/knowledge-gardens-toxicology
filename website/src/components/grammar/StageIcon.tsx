'use client';

/**
 * StageIcon — three-tier rendering:
 *   1. <video> with poster=PNG, plays the .mp4 on hover (loops, muted)
 *   2. If .mp4 fails or browser blocks playback, falls back to <img> showing
 *      the .png frame
 *   3. If .png is also missing, falls back to inline SVG drawn in the brand
 *      voice
 *
 * The mp4 is `preload="none"` until the user hovers — keeps initial page
 * load fast (the seven mp4s together are ~30MB). On hover, we set
 * preload="auto" and call play(). On leave we pause and reset to t=0.
 */
import { useRef, useState } from 'react';
import type { StageId } from './stages';

export default function StageIcon({
  id,
  size = 22,
  color = 'currentColor',
  copper = 'var(--copper-orn-deep)',
  className = '',
}: {
  id: StageId;
  size?: number;
  color?: string;
  copper?: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoBroken, setVideoBroken] = useState(false);
  const [imgBroken, setImgBroken]     = useState(false);

  // Tier 1: video with PNG poster
  if (!videoBroken) {
    return (
      <video
        ref={videoRef}
        poster={`/icons/stage-${id}.png`}
        muted
        loop
        playsInline
        preload="none"
        width={size}
        height={size}
        className={className}
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          objectFit: 'contain',
          background: 'transparent',
          mixBlendMode: 'multiply',
          // Smooth hover transitions even before the first frame loads
          transition: 'opacity 200ms ease',
        }}
        onMouseEnter={() => {
          const v = videoRef.current;
          if (!v) return;
          // Lazy-promote preload so we only fetch the MP4 on first hover
          if (v.preload !== 'auto') v.preload = 'auto';
          const p = v.play();
          if (p && typeof p.catch === 'function') {
            p.catch(() => setVideoBroken(true));
          }
        }}
        onMouseLeave={() => {
          const v = videoRef.current;
          if (!v) return;
          v.pause();
          // Snap back to the poster frame
          try { v.currentTime = 0; } catch { /* ignore */ }
        }}
        onError={() => setVideoBroken(true)}
      >
        <source src={`/icons/stage-${id}.mp4`} type="video/mp4" />
      </video>
    );
  }

  // Tier 2: PNG only
  if (!imgBroken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`/icons/stage-${id}.png`}
        alt=""
        width={size}
        height={size}
        className={className}
        style={{ display: 'inline-block', verticalAlign: 'middle', objectFit: 'contain', mixBlendMode: 'multiply' }}
        onError={() => setImgBroken(true)}
      />
    );
  }

  // Tier 3: inline SVG fallback in the brand voice
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 1.4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
  switch (id) {
    case 'identify':
      return (
        <svg {...props}>
          <circle cx="10" cy="10" r="6" />
          <line x1="14.5" y1="14.5" x2="20" y2="20" />
          <circle cx="10" cy="10" r="1.6" stroke={copper} fill={copper} />
        </svg>
      );
    case 'assess':
      return (
        <svg {...props}>
          <line x1="12" y1="4" x2="12" y2="20" />
          <line x1="6" y1="20" x2="18" y2="20" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <path d="M4 8 L2 13 A3 3 0 0 0 6 13 Z" stroke={copper} />
          <path d="M20 8 L22 13 A3 3 0 0 1 18 13 Z" stroke={copper} />
        </svg>
      );
    case 'plan':
      return (
        <svg {...props}>
          <path d="M3 19 L12 5 L21 19" />
          <path d="M3 19 L21 19" />
          <line x1="12" y1="5" x2="12" y2="14" stroke={copper} />
          <circle cx="12" cy="5" r="1.4" fill={copper} stroke={copper} />
        </svg>
      );
    case 'act':
      return (
        <svg {...props}>
          <rect x="3" y="6" width="11" height="4" rx="0.5" />
          <line x1="14" y1="8" x2="21" y2="15" />
          <line x1="11" y1="12" x2="14" y2="15" stroke={copper} />
          <line x1="9" y1="14" x2="12" y2="17" stroke={copper} />
          <line x1="7" y1="16" x2="10" y2="19" stroke={copper} />
        </svg>
      );
    case 'adapt':
      return (
        <svg {...props}>
          <path d="M20 12 A8 8 0 1 1 12 4" />
          <polyline points="12 2 12 4 14 4" stroke={copper} />
          <circle cx="12" cy="12" r="2.2" stroke={copper} />
        </svg>
      );
    case 'resolve':
      return (
        <svg {...props}>
          <rect x="4" y="6" width="16" height="13" rx="1" />
          <line x1="4" y1="10" x2="20" y2="10" />
          <circle cx="17" cy="15" r="1.6" stroke={copper} fill={copper} fillOpacity="0.25" />
        </svg>
      );
    case 'reflect':
      return (
        <svg {...props}>
          <path d="M3 6 C7 4 11 5 12 6 C13 5 17 4 21 6 L21 19 C17 17 13 18 12 19 C11 18 7 17 3 19 Z" />
          <line x1="12" y1="6" x2="12" y2="19" />
          <line x1="6" y1="9" x2="9" y2="9" stroke={copper} />
          <line x1="15" y1="9" x2="18" y2="9" stroke={copper} />
        </svg>
      );
    default:
      return <svg {...props}><circle cx="12" cy="12" r="6" /></svg>;
  }
}
