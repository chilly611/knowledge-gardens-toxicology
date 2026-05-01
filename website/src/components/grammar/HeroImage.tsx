'use client';

/**
 * HeroImage — the full-bleed image area BKG uses on every workflow page.
 * Image fills the box, content overlays. Breadcrumb in lower-left, optional
 * eyebrow + title centered.
 *
 * Grammar primitive #4. For Loom (home), pass image="/hero-loom-grid.svg" or
 * leave the image blank for a flat parchment hero.
 */
import { ReactNode } from 'react';

export default function HeroImage({
  /** Asset path or undefined for flat parchment. */
  image,
  imageAlt = '',
  /** Top-left breadcrumb (BKG: "Killer App / Workflows / Code Compliance Lookup") */
  breadcrumb,
  /** Top-right pill (BKG: "PRO: OFF") — optional override; usually let TopFrame handle it */
  topRight,
  /** Optional eyebrow over the title */
  eyebrow,
  /** Centered title */
  title,
  /** Subtitle in italic Cormorant under the title */
  subtitle,
  children,
}: {
  image?: string;
  imageAlt?: string;
  breadcrumb?: ReactNode;
  topRight?: ReactNode;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <section
      className="relative overflow-hidden border-b border-[var(--paper-line)]"
      style={{
        background: image
          ? `linear-gradient(rgba(245, 240, 232, 0.55), rgba(245, 240, 232, 0.55)), url('${image}') center / cover no-repeat`
          : 'var(--paper)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <div className="flex items-start justify-between">
          {breadcrumb && (
            <div
              className="text-[var(--ink-soft)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.1em' }}
            >
              {breadcrumb}
            </div>
          )}
          {topRight && <div>{topRight}</div>}
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          {eyebrow && (
            <div
              className="mb-3 text-[var(--copper-orn-deep)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}
            >
              {eyebrow}
            </div>
          )}
          {title && (
            <h1
              className="text-[var(--ink)]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.015em',
              }}
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p
              className="mt-4 max-w-2xl text-[var(--ink-soft)]"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1rem, 1.5vw, 1.18rem)', fontStyle: 'italic', lineHeight: 1.55 }}
            >
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8 w-full">{children}</div>}
        </div>
      </div>
    </section>
  );
}
