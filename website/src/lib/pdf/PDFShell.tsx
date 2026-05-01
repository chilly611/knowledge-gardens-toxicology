'use client';

/**
 * Shared print-friendly shell consumed by:
 *   - /pdf-preview/consumer  (Personal Toxicity Briefing)
 *   - /pdf-preview/clinician (Clinical Exposure Brief)
 *   - /pdf-preview/counsel   (Case-Prep Exhibit Packet)
 *
 * Strategy (see L-010): we render a standard HTML route styled for print —
 * CSS @page margins, page-break rules, caduceus watermark via background SVG,
 * Cormorant + Space Mono. User clicks the Print/Save-as-PDF button which
 * triggers `window.print()` and the browser produces the PDF.
 *
 * F2 (PDF quality pass) polishes the @page rules, page-break behavior, and
 * watermark opacity. C1/C2/C3 should not duplicate any of this scaffolding —
 * just import <PDFShell> and pass children.
 *
 * Enhancements (F2):
 * - CSS counter for page numbers in footer (@page rule + counter-increment)
 * - <PageBreak /> component for explicit page breaks
 * - <TOC /> component for table of contents (simple exhibit list style)
 * - Watermark robustness: background-image with opacity tuning
 */
import { ReactNode } from 'react';

export type PDFKind = 'consumer' | 'clinician' | 'counsel';

export type TOCSection = {
  id: string;
  title: string;
  kind?: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
};

const TITLE: Record<PDFKind, string> = {
  consumer:  'Personal Toxicity Briefing',
  clinician: 'Clinical Exposure Brief',
  counsel:   'Case-Prep Exhibit Packet',
};

const ACCENT: Record<PDFKind, string> = {
  consumer:  'var(--teal)',
  clinician: 'var(--indigo)',
  counsel:   'var(--crimson)',
};

export default function PDFShell({
  kind,
  subtitle,
  children,
  metadata,
}: {
  kind: PDFKind;
  /** Sub-line under the cover title — e.g. patient name, case caption, date. */
  subtitle?: string;
  /** Footer-line key/value bits, e.g. { 'doc id': 'TKG-2026-001', date: '2026-04-30' }. */
  metadata?: Record<string, string>;
  children: ReactNode;
}) {
  return (
    <>
      {/* Print-only stylesheet for @page rules, page-break behavior, and page numbers */}
      <style>{`
        @page {
          size: letter;
          margin: 0.75in 1in 1.2in 1in;
          @bottom-center {
            content: "page " counter(page);
            font-family: 'Space Mono', monospace;
            font-size: 9pt;
            color: #6b7388;
          }
        }
        @media print {
          body {
            background: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            counter-reset: page;
          }
          .pdf-no-print, .pdf-no-print * { display: none !important; }
          .pdf-page { page-break-after: always; }
          .pdf-page:last-child { page-break-after: auto; }
          .pdf-keep-together { page-break-inside: avoid; break-inside: avoid; }
          h1, h2, h3 { page-break-after: avoid; break-after: avoid; }
          a, a:visited { color: var(--ink) !important; text-decoration: none !important; }
          a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 9pt; color: var(--ink-mute); }
        }
        .pdf-watermark {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('/emblem-caduceus-watermark.svg');
          background-repeat: no-repeat;
          background-position: center 28%;
          background-size: 320px auto;
          background-attachment: fixed;
          opacity: 0.05;
          pointer-events: none;
          z-index: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .pdf-page-break {
          page-break-before: always;
        }
      `}</style>

      <div data-surface="tkg" data-pdf-kind={kind} className="min-h-screen relative">
        {/* on-screen toolbar — hidden on print */}
        <div className="pdf-no-print sticky top-0 z-50 border-b border-[var(--paper-line)] bg-[var(--paper-warm)] px-6 py-3 flex items-center justify-between">
          <div>
            <div className="font-eyebrow">tkg · pdf preview · {kind}</div>
            <div className="text-[var(--ink-soft)] text-sm" style={{ fontFamily: 'var(--font-display)' }}>
              <em>{TITLE[kind]}</em>{subtitle ? ` — ${subtitle}` : ''}
            </div>
          </div>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.print()}
            className="rounded px-4 py-2 text-white"
            style={{
              background: ACCENT[kind],
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            print / save as pdf
          </button>
        </div>

        {/* the actual document body */}
        <div className="relative mx-auto max-w-[8.5in] bg-[var(--paper)] p-12 shadow-sm" style={{ minHeight: '11in' }}>
          <div className="pdf-watermark" aria-hidden />
          <div className="relative z-10">
            <PDFCover kind={kind} subtitle={subtitle} accent={ACCENT[kind]} />
            {children}
            <PDFFooter kind={kind} metadata={metadata} />
          </div>
        </div>
      </div>
    </>
  );
}

function PDFCover({ kind, subtitle, accent }: { kind: PDFKind; subtitle?: string; accent: string }) {
  return (
    <header className="pdf-keep-together mb-10">
      <div className="font-eyebrow mb-2" style={{ color: accent }}>toxicology knowledge garden</div>
      <h1 className="text-4xl italic" style={{ color: 'var(--ink)' }}>{TITLE[kind]}</h1>
      {subtitle && (
        <div className="mt-2 text-[var(--ink-soft)]" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
          {subtitle}
        </div>
      )}
      <div className="mt-4 h-[3px] w-24" style={{ background: accent }} />
    </header>
  );
}

function PDFFooter({ kind, metadata }: { kind: PDFKind; metadata?: Record<string, string> }) {
  const items = Object.entries(metadata ?? {});
  return (
    <footer className="pdf-keep-together mt-16 border-t border-[var(--paper-line)] pt-4">
      <div className="font-eyebrow text-[var(--ink-mute)]">
        tkg · {kind} · three sources behind every claim
      </div>
      {items.length > 0 && (
        <div className="font-data mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[var(--ink-mute)]">
          {items.map(([k, v]) => (
            <span key={k}>
              <span className="uppercase tracking-[0.18em]">{k}:</span> {v}
            </span>
          ))}
        </div>
      )}
      <div className="font-data mt-2 text-[var(--ink-mute)] italic">
        Verbatim quotes marked &quot;pending verbatim verification&quot; await human source confirmation.
        Generated by automated extraction with retrieval method <span className="font-data not-italic">Claude-2026-04-30</span>.
      </div>
    </footer>
  );
}

/**
 * Explicit page break component. Renders as a block with `page-break-before: always`.
 * Use between major sections to ensure clean page boundaries in print.
 */
export function PageBreak() {
  return <div className="pdf-page-break" aria-hidden />;
}

/**
 * Table of Contents component. Takes an array of sections (id, title, optional kind).
 * Renders as a simple exhibit list suitable for counsel/legal docs.
 * Sections can be labeled with Roman numerals (I, II, III, etc.) if provided.
 *
 * Note: page number references via CSS counter don't work reliably in TOCs.
 * For simplicity, we render a text-only TOC without page numbers; counsel/clinical
 * flows can opt to include explicit page references in their metadata.
 */
export function TOC({ sections }: { sections: TOCSection[] }) {
  const romanToNumber: Record<string, number> = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6,
  };

  return (
    <div className="pdf-page pdf-keep-together mb-8">
      <div
        className="font-mono text-xs uppercase mb-4"
        style={{ color: 'var(--ink-mute)', letterSpacing: '0.18em' }}
      >
        Table of Contents
      </div>
      <ol style={{ fontSize: '0.95rem', color: 'var(--ink-soft)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
        {sections.map((section, idx) => (
          <li key={section.id} style={{ marginBottom: '0.5rem' }}>
            {section.kind && <span style={{ fontFamily: 'var(--font-mono)' }}>{section.kind}. </span>}
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              {section.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
