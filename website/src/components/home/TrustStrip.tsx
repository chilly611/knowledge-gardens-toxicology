'use client';

/**
 * TrustStrip — Verifiability is the new visibility.
 * One-message-per-screen (100vh min-height), dramatic on the 3-source rule.
 * Demonstrates contested claim via Glyphosate × NHL example.
 * Async fetches live data; renders supporting vs contradicting sources side-by-side.
 */
import { useState, useEffect } from 'react';
import { getCertifiedClaims, quoteOrPending } from '@/lib/queries-tox';
import type { CertifiedClaimRow, EvidenceSource } from '@/lib/types-tox';
import ScrollReveal from './ScrollReveal';

export default function TrustStrip() {
  const [claim, setClaim] = useState<CertifiedClaimRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const claims = await getCertifiedClaims({ status: 'contested' });
        // Find Glyphosate × non_hodgkin_lymphoma or similar NHL claim
        const found = claims.find(
          (c) =>
            c.substance_name.toLowerCase().includes('glyphosate') &&
            (c.endpoint_name.toLowerCase().includes('hodgkin') ||
             c.endpoint_category?.toLowerCase().includes('carcinogenicity'))
        );
        if (found) setClaim(found);
      } catch (err) {
        console.error('TrustStrip load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <section className="min-h-[100vh] flex items-center" style={{ background: 'var(--paper-deep)' }}>
        <div className="rail-default w-full">
          <p
            className="text-center"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-mute)' }}
          >
            Loading...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[100vh] flex items-center py-24" style={{ background: 'var(--paper-deep)' }}>
      <div className="rail-default w-full">
        {/* Eyebrow */}
        <ScrollReveal delay={0}>
          <div className="mb-8 text-center">
            <span
              className="text-xs uppercase tracking-wider"
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--copper-orn-deep)',
                fontSize: '0.65rem',
                letterSpacing: '0.22em',
              }}
            >
              The Foundation
            </span>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal delay={100}>
          <h2
            className="mx-auto mb-6 max-w-[20ch] text-center"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 900,
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              color: 'var(--ink)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            Verifiability is the new visibility.
          </h2>
        </ScrollReveal>

        {/* Subhead */}
        <ScrollReveal delay={120}>
          <div className="max-w-2xl mx-auto mb-20">
            <p
              className="text-center"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: 'var(--ink-soft)',
                lineHeight: 1.55,
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              Three sources, minimum. The more verified the claim, the more often AI agents cite it. The gardens are built to be cited.
            </p>
          </div>
        </ScrollReveal>

        {/* Three-column demo — uses canonical tile-grid-feature for max breathing room */}
        {claim ? (
          <ScrollReveal delay={150}>
            <div className="mb-24">
              <div className="tile-grid-feature">
                {/* Left: Supporting sources */}
                <div className="px-2">
                  <div
                    className="mb-12 flex items-baseline gap-3 pb-5"
                    style={{ borderBottom: `2px solid var(--teal)` }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--teal)',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Supporting
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--ink-mute)',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                      }}
                    >
                      · {claim.sources.filter((s) => s.supports).length} sources
                    </span>
                  </div>
                  <div className="space-y-8">
                    {claim.sources
                      .filter((s) => s.supports)
                      .map((source, idx) => (
                        <SourceCard key={idx} source={source} />
                      ))}
                  </div>
                </div>

                {/* Center: The claim itself — tile-feature gives generous interior padding */}
                <div className="tile-feature anim-layer-rise flex flex-col items-center justify-start"
                  style={{
                    borderTop: '2px solid var(--crimson)',
                    background: 'var(--paper)',
                    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <div
                    className="mb-10 inline-flex items-center gap-3 rounded-full px-6 py-3"
                    style={{
                      background: 'rgba(232, 55, 89, 0.14)',
                      border: '1.5px solid rgba(232, 55, 89, 0.4)',
                      paddingLeft: '1.5rem',
                      paddingRight: '1.5rem',
                      paddingTop: '0.75rem',
                      paddingBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        color: 'var(--crimson-deep)',
                      }}
                    >
                      Contested
                    </span>
                    <span
                      aria-hidden
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: 999,
                        background: 'var(--crimson-deep)',
                        opacity: 0.6,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--crimson-deep)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      {(claim.confidence_score ?? 0).toFixed(2)}
                    </span>
                  </div>
                  <h3
                    className="mb-10 text-center"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontStyle: 'normal',
                      fontSize: 'clamp(1.5rem, 2.4vw, 1.85rem)',
                      fontWeight: 800,
                      color: 'var(--ink)',
                      lineHeight: 1.2,
                      maxWidth: '20ch',
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                    }}
                  >
                    {claim.substance_name}
                    <span style={{ color: 'var(--ink-mute)', fontStyle: 'normal', margin: '0 0.4em' }}>×</span>
                    {claim.endpoint_name.replace(/_/g, ' ')}
                  </h3>
                  <p className="body-readable text-center" style={{ maxWidth: '28ch' }}>
                    {claim.effect_summary}
                  </p>
                </div>

                {/* Right: Contradicting sources */}
                <div className="px-2">
                  <div
                    className="mb-12 flex items-baseline gap-3 pb-5"
                    style={{ borderBottom: `2px solid var(--crimson)` }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--crimson)',
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Contradicting
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        color: 'var(--ink-mute)',
                        fontWeight: 600,
                        letterSpacing: '0.06em',
                      }}
                    >
                      · {claim.sources.filter((s) => !s.supports).length} sources
                    </span>
                  </div>
                  <div className="space-y-8">
                    {claim.sources
                      .filter((s) => !s.supports)
                      .map((source, idx) => (
                        <SourceCard key={idx} source={source} />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ) : null}

        {/* Footer paragraph */}
        <ScrollReveal delay={200}>
          <p
            className="mx-auto text-center max-w-prose"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
              fontSize: '1.05rem',
              color: 'var(--copper-orn-deep)',
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            This is how we build trust with AI agents and human partners alike.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/**
 * SourceCard — renders a single evidence source with tier badge and quote.
 */
function SourceCard({ source }: { source: EvidenceSource }) {
  const { text, verified } = quoteOrPending(source.quote);

  return (
    <div
      className="tile-inner"
      style={{
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Title (italic) */}
      <h4
        className="mb-4"
        style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'normal',
          fontSize: '1.02rem',
          fontWeight: 700,
          color: 'var(--ink)',
          lineHeight: 1.4,
        }}
      >
        {source.title}
      </h4>

      {/* Publisher + year (Space Mono) */}
      <div
        className="mb-4"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--ink-mute)',
          letterSpacing: '0.04em',
          fontWeight: 500,
        }}
      >
        {source.publisher} {source.year ? `· ${source.year}` : ''}
      </div>

      {/* Tier badge */}
      <div className="mb-4">
        <span
          className="inline-block rounded-full px-4 py-2"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            background: 'rgba(107, 115, 136, 0.12)',
            color: 'var(--ink-mute)',
          }}
        >
          T{source.tier}
        </span>
      </div>

      {/* Quote or pending badge */}
      {verified ? (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.92rem',
            color: 'var(--ink-soft)',
            lineHeight: 1.65,
            fontWeight: 400,
          }}
        >
          "{text}"
        </p>
      ) : (
        <div
          className="rounded px-3 py-2"
          style={{
            background: 'rgba(255, 177, 102, 0.1)',
            border: '1px solid rgba(214, 136, 67, 0.3)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--peach-deep)',
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            pending verbatim
          </span>
        </div>
      )}
    </div>
  );
}
