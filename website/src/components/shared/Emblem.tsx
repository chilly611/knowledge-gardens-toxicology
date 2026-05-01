import Image from 'next/image';

export type EmblemSize = 'hero' | 'inline' | 'small' | 'watermark' | 'showcase';
export type EmblemTheme = 'light' | 'dark' | 'luminous';

const dims: Record<EmblemSize, { w: number; h: number }> = {
  hero:      { w: 320, h: 320 },
  inline:    { w: 64,  h: 64 },
  small:     { w: 32,  h: 32 },
  watermark: { w: 480, h: 480 },
  showcase:  { w: 640, h: 640 },
};

/**
 * TKG caduceus emblem — uses Chilly's PNG directly.
 *
 * Theme prop chooses blend mode + filter:
 *   light    → multiply (looks great on parchment, vanishes on dark — DO NOT use on dark bg)
 *   dark     → no blend (just the PNG, works on dark backgrounds)
 *   luminous → screen blend + brightness/saturation boost + drop-shadow glow (Tidepool showcase)
 *
 *   <Emblem size="hero"     theme="light" />     // homepage hero on parchment
 *   <Emblem size="inline"   theme="light" />     // top frame next to title
 *   <Emblem size="watermark" theme="dark"  />    // dark theme footer
 *   <Emblem size="showcase" theme="luminous" />  // Tidepool centerpiece (animated halo)
 */
export default function Emblem({
  size = 'inline',
  theme = 'light',
  className = '',
  ariaHidden = false,
  opacity = 1,
  animate = false,
}: {
  size?: EmblemSize;
  theme?: EmblemTheme;
  className?: string;
  ariaHidden?: boolean;
  opacity?: number;
  /** Adds a slow drift+rotate animation. Pairs with theme="luminous". */
  animate?: boolean;
}) {
  const { w, h } = dims[size];

  // Blend mode + filter pipeline by theme
  const themeStyle: React.CSSProperties =
    theme === 'luminous'
      ? {
          mixBlendMode: 'screen',
          filter:
            'brightness(1.25) saturate(1.35) drop-shadow(0 0 24px rgba(46, 164, 163, 0.55)) drop-shadow(0 0 64px rgba(184, 115, 51, 0.35))',
        }
      : theme === 'dark'
      ? {
          mixBlendMode: 'normal',
          filter: 'brightness(1.05)',
        }
      : {
          mixBlendMode: 'multiply',
        };

  return (
    <Image
      src="/emblem-caduceus.png"
      alt={ariaHidden ? '' : 'Toxicology Knowledge Garden caduceus emblem'}
      aria-hidden={ariaHidden || undefined}
      width={w}
      height={h}
      priority={size === 'hero' || size === 'showcase'}
      style={{ opacity, ...themeStyle, animation: animate ? 'caduceus-drift 18s ease-in-out infinite' : undefined }}
      className={className}
    />
  );
}
