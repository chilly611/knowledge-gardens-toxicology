'use client';

/**
 * Compound Lookup Workflow — REDESIGNED 2026-05-01
 *
 * Bleeding-edge visual redesign: cleaner hierarchy, explicit "working" vs "coming soon" CTAs,
 * 5-section flow with accordion questions, clear deliverables strip.
 *
 * Structure:
 * 1. Main wrapper with data-surface="tkg" data-mode="light"
 * 2. Header section: eyebrow + title + subline + XP banner
 * 3. AskBox-style search input with seed chips
 * 4. 5 numbered question cards (accordion-style) with live Q1 data
 * 5. "WHEN COMPLETE" section with 4 deliverable cards
 *    - Generate Personal Briefing: solid working CTA
 *    - Build Exposure Scenario: coming-soon ghost CTA
 *    - Run Dose Calculator: coming-soon ghost CTA
 *    - Score the Risk: coming-soon ghost CTA
 * 6. Footer with return link
 */

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSubstance } from '@/lib/queries-tox';
import type { Substance, SubstanceAlias } from '@/lib/types-tox';

// Example seed chips for AskBox
const SEED_CHIPS = ['Glyphosate', 'CAS 1071-83-6', 'Roundup', 'white powder, no smell'];

// Deliverable cards: title, description, CTA text, href, status
const DELIVERABLES = [
  {
    title: 'Generate Personal Briefing',
    description: 'Print-ready brief with three sources behind every claim.',
    cta: 'Open →',
    href: '/pdf-preview/consumer?q=glyphosate',
    status: 'live' as const,
  },
  {
    title: 'Build Exposure Scenario',
    description: 'Walk a substance through a real-world exposure.',
    cta: 'Coming soon',
    href: '/workflow/assess/exposure-scenario',
    status: 'soon' as const,
  },
  {
    title: 'Run Dose Calculator',
    description: 'Convert exposure into dose. Compare to regulatory limits.',
    cta: 'Coming soon',
    href: '/workflow/assess/dose-calculator',
    status: 'soon' as const,
  },
  {
    title: 'Score the Risk',
    description: 'One number, three sources behind every dial.',
    cta: 'Coming soon',
    href: '/workflow/assess/risk-score',
    status: 'soon' as const,
  },
];

// Question definitions
type Question = {
  number: number;
  title: string;
  xp: number;
  defaultOpen?: boolean;
};

const QUESTIONS: Question[] = [
  { number: 1, title: 'What\'s the canonical name and identifier?', xp: 10, defaultOpen: true },
  { number: 2, title: 'What hazard class is it under GHS?', xp: 10 },
  { number: 3, title: 'What are the routes of exposure that matter most?', xp: 10 },
  { number: 4, title: 'What\'s the toxicology profile—acute and chronic?', xp: 10 },
  { number: 5, title: 'What regulatory limits apply in your jurisdiction?', xp: 10 },
];

export default function CompoundLookupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center" style={{ color: 'var(--ink-mute)' }}>Loading compound lookup...</div>}>
      <CompoundLookupPageInner />
    </Suspense>
  );
}

function CompoundLookupPageInner() {
  const searchParams = useSearchParams();
  const queryParam = searchParams?.get('q') || 'glyphosate';

  const [substance, setSubstance] = useState<Substance | null>(null);
  const [aliases, setAliases] = useState<SubstanceAlias[]>([]);
  const [loading, setLoading] = useState(true);
  const [openQuestion, setOpenQuestion] = useState<number>(1);
  const [searchInput, setSearchInput] = useState('');

  // Load substance data on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getSubstance(queryParam);
        if (result) {
          setSubstance(result.substance);
          setAliases(result.aliases);
        }
      } catch (err) {
        console.error('Compound lookup load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [queryParam]);

  // Default display substance (Glyphosate) for demo
  const displaySubstance = substance || {
    id: 'glyphosate-demo',
    name: 'Glyphosate',
    cas_number: '1071-83-6',
    molecular_formula: 'C₃H₈NO₅P',
    description: 'Broad-spectrum herbicide. Primary EPSPS inhibitor.',
    parent_substance_id: null,
  } as Substance;

  const handleChipClick = (chip: string) => {
    setSearchInput(chip);
  };

  return (
    <main data-surface="tkg" data-mode="light" className="min-h-screen bg-[var(--paper)]">
      {/* ================================================================
          HEADER SECTION
          ================================================================ */}
      <section className="rail-default w-full pt-16 sm:pt-20 pb-12">
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'var(--copper-orn-deep)',
            marginBottom: '1.5rem',
          }}
        >
          STAGE 01 · IDENTIFY · WORKFLOW 1 OF 4
        </div>

        {/* Title */}
        <h1
          className="max-w-[24ch] leading-tight mb-6"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 700,
            fontSize: 'clamp(2.4rem, 5vw, 3.5rem)',
            lineHeight: 1.05,
            color: 'var(--ink)',
          }}
        >
          Compound lookup.
        </h1>

        {/* Subline */}
        <p
          className="max-w-2xl mb-8"
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: '1.1rem',
            lineHeight: 1.55,
            color: 'var(--ink-soft)',
          }}
        >
          Tell us what you've got. We'll tell you what it is, what it can do, and where it lives in the regulatory landscape.
        </p>

        {/* XP Banner */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--copper-orn-deep)',
          }}
        >
          0 of 5 complete · 50 XP available
        </div>
      </section>

      {/* ================================================================
          ASKBOX-STYLE SEARCH SECTION
          ================================================================ */}
      <section className="rail-default w-full py-8">
        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search a compound, paste a CAS number, or describe what you've got."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-full border px-6 py-4 transition-all focus:outline-none focus:ring-2"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              borderColor: 'var(--paper-line)',
              backgroundColor: 'var(--paper)',
              color: 'var(--ink)',
            }}
          />
        </div>

        {/* Seed Chips */}
        <div className="flex flex-wrap gap-2">
          {SEED_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="rounded-full border px-4 py-2 transition-all hover:bg-[var(--paper-deep)]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--ink-soft)',
                borderColor: 'var(--paper-line)',
                backgroundColor: 'var(--paper)',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      {/* ================================================================
          QUESTION CARDS (ACCORDION)
          ================================================================ */}
      <section className="rail-default w-full py-12">
        <div className="space-y-4">
          {QUESTIONS.map((q) => (
            <div
              key={q.number}
              className="rounded-2xl border bg-white overflow-hidden transition-all"
              style={{
                borderColor: 'var(--paper-line)',
                padding: openQuestion === q.number ? '2.5rem' : '1.5rem',
              }}
            >
              {/* Question Header */}
              <button
                type="button"
                onClick={() => setOpenQuestion(openQuestion === q.number ? 0 : q.number)}
                className="w-full flex items-center justify-between text-left"
              >
                {/* Left: Circle number + title */}
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--tox-deep)',
                      color: 'var(--paper)',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                      }}
                    >
                      {q.number}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    {q.title}
                  </h3>
                </div>

                {/* Right: XP pill */}
                <div
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    backgroundColor: 'var(--paper-deep)',
                    color: 'var(--ink-soft)',
                    flexShrink: 0,
                  }}
                >
                  +{q.xp} XP
                </div>
              </button>

              {/* Expanded Content */}
              {openQuestion === q.number && (
                <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--paper-line)' }}>
                  {q.number === 1 ? (
                    // Q1: Live data from Glyphosate
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--ink-mute)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Canonical Name
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem',
                            color: 'var(--ink)',
                          }}
                        >
                          {displaySubstance.name}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--ink-mute)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          CAS Number
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1rem',
                            color: 'var(--ink)',
                          }}
                        >
                          {displaySubstance.cas_number}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            color: 'var(--ink-mute)',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Molecular Formula
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '1rem',
                            color: 'var(--ink)',
                          }}
                        >
                          {displaySubstance.molecular_formula}
                        </div>
                      </div>
                      {aliases.length > 0 && (
                        <div className="space-y-2 pt-4 border-t" style={{ borderColor: 'var(--paper-line)' }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.7rem',
                              color: 'var(--ink-mute)',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Known Aliases
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {aliases.map((alias) => (
                              <span
                                key={alias.alias}
                                className="rounded-full px-3 py-1"
                                style={{
                                  fontFamily: 'var(--font-body)',
                                  fontSize: '0.9rem',
                                  backgroundColor: 'var(--paper-deep)',
                                  color: 'var(--ink-soft)',
                                }}
                              >
                                {alias.alias}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Q2–Q5: Pending content
                    <div className="space-y-3">
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          color: 'var(--ink-mute)',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        pending integration
                      </div>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '0.95rem',
                          color: 'var(--ink-soft)',
                          lineHeight: 1.6,
                        }}
                      >
                        {q.number === 2 && 'GHS hazard data will pull from PubChem when wired. This section will show signal word, hazard statements, and precautionary statements.'}
                        {q.number === 3 && 'Exposure routes (inhalation, dermal, oral, etc.) will source from NIOSH, OSHA, and ATSDR data when wired.'}
                        {q.number === 4 && 'Acute and chronic toxicity data will pull from PubChem, IARC monographs, and peer-reviewed literature when wired.'}
                        {q.number === 5 && 'Regulatory occupational exposure limits (OELs) and environmental standards will pull from EPA, OSHA, EFSA, and regional databases when wired.'}
                      </p>
                      <div
                        className="inline-block rounded-full px-3 py-1 border"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontStyle: 'italic',
                          fontSize: '0.8rem',
                          color: 'var(--ink-mute)',
                          borderColor: 'var(--paper-line)',
                          backgroundColor: 'var(--paper-warm)',
                        }}
                      >
                        coming soon
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================
          DELIVERABLES SECTION ("WHEN COMPLETE")
          ================================================================ */}
      <section className="rail-default w-full py-16">
        {/* Eyebrow */}
        <div
          className="mb-8"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          When complete
        </div>

        {/* 4-up grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {DELIVERABLES.map((del) => (
            <Link
              key={del.title}
              href={del.href}
              className={`group rounded-2xl border p-8 transition-all duration-200 ${
                del.status === 'live' ? 'hover:-translate-y-1 hover:shadow-lg' : 'cursor-not-allowed'
              }`}
              style={{
                borderColor:
                  del.status === 'live'
                    ? 'var(--tox-deep)'
                    : 'var(--paper-line)',
                backgroundColor:
                  del.status === 'live'
                    ? 'var(--paper)'
                    : 'var(--paper-warm)/50',
                borderStyle: del.status === 'live' ? 'solid' : 'dashed',
              }}
              onClick={(e) => {
                if (del.status !== 'live') {
                  e.preventDefault();
                }
              }}
            >
              <h3
                className="mb-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: 'var(--ink)',
                }}
              >
                {del.title}
              </h3>

              <p
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  color: 'var(--ink-soft)',
                }}
              >
                {del.description}
              </p>

              {/* CTA Button */}
              <div
                className={`inline-block rounded-full px-4 py-2 text-sm transition-all ${
                  del.status === 'live'
                    ? 'group-hover:shadow-md'
                    : ''
                }`}
                style={{
                  fontFamily:
                    del.status === 'live'
                      ? 'var(--font-body)'
                      : 'var(--font-serif)',
                  fontStyle: del.status === 'live' ? 'normal' : 'italic',
                  fontWeight: del.status === 'live' ? 600 : 400,
                  backgroundColor:
                    del.status === 'live'
                      ? 'var(--tox-deep)'
                      : 'transparent',
                  color:
                    del.status === 'live'
                      ? 'var(--paper)'
                      : 'var(--ink-soft)',
                  border:
                    del.status === 'live'
                      ? 'none'
                      : '1px dashed var(--paper-line)',
                  fontSize: '0.85rem',
                }}
              >
                {del.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <section className="bg-[var(--paper)] py-12 text-center border-t" style={{ borderColor: 'var(--paper-line)' }}>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--teal-deep)',
            textDecoration: 'underline',
            transition: 'color 200ms',
          }}
          className="hover:text-[var(--teal)]"
        >
          ← Return to Loom
        </Link>
      </section>
    </main>
  );
}
