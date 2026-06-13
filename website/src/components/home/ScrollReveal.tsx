'use client';

/**
 * ScrollReveal — a gentle, CSS-driven entrance.
 *
 * Rewritten: the old version gated opacity on a JS `revealed` flag from an
 * IntersectionObserver, so content stayed invisible until JS ran (and stuck
 * blank if hydration lagged). This version uses a pure CSS keyframe
 * (`tkgReveal` in globals.css) with `animation-fill-mode: both` — it always
 * completes and content always ends visible, with no dependency on hydration.
 * Honors prefers-reduced-motion (see globals.css).
 */
import React from 'react';

type ScrollRevealProps = {
  children: React.ReactNode;
  delay?: number; // ms, capped so nothing stays hidden long
  direction?: 'up' | 'left' | 'right';
  as?: 'div' | 'section' | 'header';
};

export default function ScrollReveal({ children, delay = 0, as: Component = 'div' }: ScrollRevealProps) {
  return (
    <Component
      data-tkg-reveal
      style={{
        animation: 'tkgReveal 620ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: `${Math.min(Math.max(delay, 0), 360)}ms`,
      }}
    >
      {children}
    </Component>
  );
}
