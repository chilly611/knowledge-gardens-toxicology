'use client';

/**
 * Loom — the home view of the Toxicology Knowledge Garden.
 *
 * One-message-per-screen flow. Each section is min 80–100vh.
 *
 *   1. HomeHero ........... cinematic dark — "What is this, really?"
 *   2. AudienceInvitations . dark — "Three audiences. One garden."
 *   3. BrowsePanel ........ paper — "Three doorways into what we know."
 *   4. SevenStages ........ paper-warm — "Seven stages, one shape."
 *   5. TrustStrip ......... paper-deep — "Three sources. Every claim."
 *   6. FeaturedCase ....... paper-gradient — "Erickson v. Monsanto."
 *   7. LoomMatrix ......... paper — for the skim-everything power user
 *   8. TidepoolEntry ...... paper → dusk → dark — "Where evidence becomes wonder."
 *
 * All sections use ScrollReveal for staggered fade-up animations as the user
 * scrolls. Body content max-w-screen-2xl. Prose constrained to max-w-2xl.
 * Headlines constrained to max-w-22ch / 24ch so they wrap meaningfully.
 */
import { Suspense, useEffect, useState } from 'react';
import HomeHero from '@/components/home/HomeHero';
import AudienceInvitationsSection from '@/components/home/AudienceInvitationsSection';
import BrowsePanel from '@/components/home/BrowsePanel';
import SevenStages from '@/components/home/SevenStages';
import TrustStrip from '@/components/home/TrustStrip';
import WhyItPersists from '@/components/home/WhyItPersists';
import FeaturedCase from '@/components/home/FeaturedCase';
import TidepoolEntry from '@/components/home/TidepoolEntry';
import ScrollReveal from '@/components/home/ScrollReveal';
import LoomGrid from '@/components/loom/LoomGrid';
import { getCertifiedClaims } from '@/lib/queries-tox';
import type { CertifiedClaimRow } from '@/lib/types-tox';

export default function LoomHomePage() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}

function Home() {
  return (
    <>
      <HomeHero />
      <AudienceInvitationsSection />
      <BrowsePanel />
      <SevenStages />
      <TrustStrip />
      <WhyItPersists />
      <FeaturedCase />
      <LoomMatrixSection />
      <TidepoolEntry />
    </>
  );
}

function LoomMatrixSection() {
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoomInfo, setShowLoomInfo] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getCertifiedClaims();
        if (!cancelled) {
          setClaims(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load claims');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="bg-[var(--paper)] py-28 sm:py-36" data-surface="tkg" style={{ minHeight: '95vh' }}>
      <div className="rail-canvas">
        <ScrollReveal>
          <header className="mx-auto mb-20 text-center">
            <div
              className="mb-6 flex items-center justify-center gap-2 text-center"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--copper-orn-deep)' }}
            >
              <span>The Loom</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span>Matrix View</span>
            </div>
            <h2
              className="mx-auto max-w-[28ch] text-center text-[var(--ink)]"
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
              }}
            >
              Every substance, every endpoint, every claim — at a glance.
            </h2>

            {/* Info button + explainer */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowLoomInfo(!showLoomInfo)}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[var(--teal-deep)] hover:bg-[var(--paper-deep)] transition-colors"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  border: '1px solid var(--paper-line)',
                }}
              >
                <span>?</span>
                <span>What is the Loom?</span>
              </button>
            </div>

            {showLoomInfo && (
              <div
                className="mx-auto mt-8 max-w-2xl rounded-lg p-6 text-left"
                style={{
                  background: 'rgba(46, 164, 163, 0.05)',
                  border: '1px solid var(--paper-line)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    color: 'var(--ink-soft)',
                    lineHeight: 1.6,
                  }}
                >
                  <strong style={{ color: 'var(--ink)' }}>The Loom metaphor:</strong> Substances are the <em>warp</em> (vertical threads, the structure), endpoints are the <em>weft</em> (horizontal threads, the pattern). Each cell is a claim backed by at least one verified source. Click any cell to read the evidence. Filter by audience to focus on what matters to you.
                </p>
              </div>
            )}

            <div className="prose-rail mt-8">
              <p
                className="mx-auto text-center text-[var(--ink-soft)]"
                style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', lineHeight: 1.6 }}
              >
                Click a substance to open its Stratigraph. Click a cell to read the claim.
              </p>
            </div>
          </header>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          {loading ? (
            <div
              className="rounded-2xl border border-[var(--paper-line)] bg-[var(--paper-warm)] p-16 text-center text-[var(--ink-mute)]"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}
            >
              loading the loom…
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[var(--crimson)] bg-[var(--paper-warm)] p-10 text-center">
              <div
                className="mb-3 text-[var(--crimson-deep)]"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}
              >
                error · evidence graph
              </div>
              <div className="text-[var(--ink-soft)]" style={{ fontFamily: 'var(--font-body)', fontSize: '1rem' }}>
                {error}
              </div>
            </div>
          ) : (
            <LoomGrid claims={claims} />
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
