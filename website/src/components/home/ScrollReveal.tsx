'use client';

/**
 * ScrollReveal — wrapper component using useViewportReveal() from @/lib/animations.
 * Renders child content with initial opacity 0 and translateY(40px).
 * When revealed === true, transitions to opacity 1 and translate(0) over 800ms.
 * Honors prefers-reduced-motion via useViewportReveal.
 */

import { useViewportReveal } from '@/lib/animations';
import React from 'react';

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number; // ms, default 0
  direction?: 'up' | 'left' | 'right'; // default 'up'
  as?: 'div' | 'section' | 'header'; // default 'div'
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  as: Component = 'div',
}: ScrollRevealProps) {
  const { ref, revealed } = useViewportReveal<HTMLDivElement>();

  // Determine initial transform based on direction
  const getTransform = (isRevealed: boolean) => {
    if (isRevealed) return 'translate(0)';
    switch (direction) {
      case 'left':
        return 'translateX(-40px)';
      case 'right':
        return 'translateX(40px)';
      case 'up':
      default:
        return 'translateY(40px)';
    }
  };

  return (
    <Component
      ref={ref}
      style={{
        opacity: revealed ? 1 : 0,
        transform: getTransform(revealed),
        transition: `opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}
