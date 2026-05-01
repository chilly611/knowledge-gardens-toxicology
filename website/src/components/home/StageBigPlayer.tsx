'use client';

/**
 * StageBigPlayer — large video player for the SevenStages section.
 *
 * Three-tier fallback:
 *   1. <video> with poster=PNG, autoplays when intersecting viewport
 *   2. If video fails, falls back to PNG <img>
 *   3. If PNG fails, renders SVG fallback from StageIcon
 *
 * Autoplay logic:
 *   - preload="none" initially (lazy)
 *   - On viewport enter: set preload="auto" and call play()
 *   - On viewport leave: pause
 *   - On hover: play from t=0, ignoring intersection pause until hover ends
 *   - muted, loop, playsInline
 *
 * Size: ~140px square, responsive scaling on mobile.
 */

import { useRef, useEffect, useState } from 'react';
import StageIcon from '../grammar/StageIcon';
import type { StageId } from '../grammar/stages';

export default function StageBigPlayer({
  id,
  size = 140,
  className = '',
}: {
  id: StageId;
  size?: number;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [videoBroken, setVideoBroken] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  // Intersection Observer for autoplay on viewport entry/exit
  useEffect(() => {
    const element = containerRef.current;
    if (!element || videoBroken) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);

        if (entry.isIntersecting) {
          const v = videoRef.current;
          if (!v) return;
          // Lazy-promote preload so we only fetch the MP4 on first viewport enter
          if (v.preload !== 'auto') v.preload = 'auto';
          // Play unless user is hovering (let hover override)
          if (!isHovering) {
            const p = v.play();
            if (p && typeof p.catch === 'function') {
              p.catch(() => setVideoBroken(true));
            }
          }
        } else {
          // Out of viewport: pause (unless hovering)
          const v = videoRef.current;
          if (v && !isHovering) {
            v.pause();
          }
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [videoBroken, isHovering]);

  // Hover: play from t=0, override pause
  const handleMouseEnter = () => {
    setIsHovering(true);
    const v = videoRef.current;
    if (!v) return;
    if (v.preload !== 'auto') v.preload = 'auto';
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
    const p = v.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => setVideoBroken(true));
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    const v = videoRef.current;
    if (!v) return;
    // Resume playing only if still in viewport
    if (isIntersecting) {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => setVideoBroken(true));
      }
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  };

  const handleVideoError = () => {
    setVideoBroken(true);
  };

  const handleImageError = () => {
    setImgBroken(true);
  };

  // Tier 1: video with PNG poster
  if (!videoBroken) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          position: 'relative',
          width: size,
          height: size,
          margin: '0 auto',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          background: 'var(--tox-pale)',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video
          ref={videoRef}
          poster={`/icons/stage-${id}.png`}
          muted
          loop
          playsInline
          preload="none"
          width={size}
          height={size}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            background: 'transparent',
          }}
          onError={handleVideoError}
        >
          <source src={`/icons/stage-${id}.mp4`} type="video/mp4" />
        </video>
      </div>
    );
  }

  // Tier 2: PNG only
  if (!imgBroken) {
    return (
      <div
        ref={containerRef}
        className={className}
        style={{
          position: 'relative',
          width: size,
          height: size,
          margin: '0 auto',
          borderRadius: '0.5rem',
          overflow: 'hidden',
          background: 'var(--tox-pale)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/stage-${id}.png`}
          alt=""
          width={size}
          height={size}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={handleImageError}
        />
      </div>
    );
  }

  // Tier 3: SVG fallback
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        margin: '0 auto',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        background: 'var(--tox-pale)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <StageIcon
        id={id}
        size={size * 0.6}
        color="var(--tox-deep)"
        copper="var(--copper-orn-deep)"
      />
    </div>
  );
}
