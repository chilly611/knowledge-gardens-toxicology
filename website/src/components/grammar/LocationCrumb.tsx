'use client';

/**
 * LocationCrumb — global "where am I" indicator. Sits inside TopFrame, below
 * the garden name + stage row. Pattern: `Loom · Stratigraph · Glyphosate`
 * with the current segment in TKG slate-blue.
 *
 * Builds the trail from `usePathname()` and a tiny route→label dictionary.
 * Falls back gracefully for routes the dict doesn't know.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SURFACE_LABELS: Record<string, string> = {
  '/': 'Loom',
  '/welcome': 'Tidepool',
  '/compound': 'Compounds',
  '/case': 'Cases',
  '/case/sky-valley': 'Sky Valley',
  '/flow': 'Lanes',
  '/flow/consumer': 'Consumer lane',
  '/flow/clinician': 'Clinician lane',
  '/flow/counsel': 'Counsel lane',
  '/workflow': 'Workflows',
  '/workflow/identify': 'Identify',
  '/workflow/identify/compound-lookup': 'Compound lookup',
  '/workflow/assess': 'Assess',
  '/workflow/assess/exposure-scenario': 'Exposure scenario',
  '/workflow/assess/dose-calculator': 'Dose calculator',
  '/workflow/assess/risk-score': 'Risk score',
  '/demo': 'Demo walkthrough',
  '/_brand': 'Brand QA',
};

const prettify = (seg: string) =>
  seg
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export default function LocationCrumb() {
  const pathname = usePathname() ?? '/';
  if (pathname === '/') return null; // Loom is the root; no crumb needed.

  const parts = pathname.split('/').filter(Boolean);
  const trail: { label: string; href: string }[] = [{ label: 'Loom', href: '/' }];
  let acc = '';
  for (const seg of parts) {
    acc += `/${seg}`;
    const label = SURFACE_LABELS[acc] ?? prettify(seg);
    trail.push({ label, href: acc });
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 px-2"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--ink-mute)',
        fontWeight: 600,
      }}
    >
      {trail.map((c, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={c.href} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden style={{ color: 'var(--paper-line)' }}>
                /
              </span>
            )}
            {isLast ? (
              <span
                style={{
                  color: 'var(--tox-deep)',
                  background: 'var(--tox-pale)',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '999px',
                  fontWeight: 700,
                }}
              >
                {c.label}
              </span>
            ) : (
              <Link
                href={c.href}
                style={{ color: 'var(--ink-mute)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--tox-deep)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = 'var(--ink-mute)')}
              >
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
