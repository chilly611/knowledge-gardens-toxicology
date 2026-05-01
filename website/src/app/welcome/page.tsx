'use client';

import { Suspense } from 'react';
import Emblem from '@/components/shared/Emblem';
import EvidenceGraph from '@/components/tidepool/EvidenceGraph';
import CaduceusShowcase from '@/components/tidepool/CaduceusShowcase';
import PitchTicker from '@/components/tidepool/PitchTicker';

/**
 * /welcome — Tidepool landing page.
 * Dark theme exception (the only dark surface in TKG v2).
 * Full-screen animated network graph hero + manifesto below + footer.
 */
export default function WelcomePage() {
  return (
    <main
      data-surface="tkg"
      data-theme="dark"
      className="min-h-screen"
      style={{
        background: 'var(--paper)',
        color: 'var(--ink)',
      }}
    >
      {/* =========================================================================
          HERO SECTION with EvidenceGraph backdrop
          ========================================================================= */}
      <section
        className="relative w-full h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a2826 0%, #0f1c1a 100%)',
        }}
      >
        {/* Animated network graph fills entire hero */}
        <Suspense
          fallback={
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.95rem',
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              Rendering evidence garden...
            </div>
          }
        >
          <EvidenceGraph />
        </Suspense>

        {/* Vignette overlay to improve text readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(
                ellipse at center,
                rgba(0, 0, 0, 0.15) 0%,
                rgba(0, 0, 0, 0.4) 60%,
                rgba(0, 0, 0, 0.6) 100%
              )
            `,
          }}
        />

        {/* Hero text overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 pointer-events-none"
          style={{
            zIndex: 10,
          }}
        >
          <div className="text-center max-w-2xl">
            {/* Eyebrow */}
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '1.5rem',
              }}
            >
              TIDEPOOL · THE FRONT DOOR
            </p>

            {/* Headline with letter-cascade reveal */}
            <h1
              className="headline-bold"
              style={{
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                color: 'white',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.4em',
                textShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
              }}
            >
              {['Where', 'evidence', 'becomes', 'wonder.'].map((word, i) => (
                <span
                  key={i}
                  style={{
                    animation: `letter-rise 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) backwards`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subheading */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
              }}
            >
              Three sources behind every claim. Watch the garden breathe.
            </p>

            {/* CTA Pills — side-by-side buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="/compound/glyphosate"
                className="cta-pill cta-pill-lg cta-pill-primary pointer-events-auto"
              >
                Open the Stratigraph →
              </a>
              <a
                href="/"
                className="cta-pill cta-pill-lg cta-pill-secondary pointer-events-auto"
                style={{
                  color: 'white',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                }}
              >
                Enter the Loom →
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator at bottom */}
        <div
          className="absolute bottom-8 left-1/2 pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '40px',
              borderRadius: '999px',
              border: '1.5px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                borderRadius: '999px',
                animation: 'bounce 2s infinite',
              }}
            />
          </div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(8px); }
            }
          `}</style>
        </div>
      </section>

      {/* =========================================================================
          MANIFESTO SECTION (scroll-reveal)
          ========================================================================= */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
        style={{
          background: 'var(--paper)',
          color: 'var(--ink)',
        }}
      >
        <div className="max-w-3xl w-full">
          <h2
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--ink)',
              marginBottom: '4rem',
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            The garden grows on three roots.
          </h2>

          <div
            className="stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '3rem',
            }}
          >
            {[
              {
                number: '1',
                title: 'Surface',
                description: 'Consumer-facing plain language. What does this substance do to human bodies?',
              },
              {
                number: '2',
                title: 'Clinical',
                description: 'Biomarkers and mechanism. Where do epidemiologists find the signal?',
              },
              {
                number: '3',
                title: 'Regulatory',
                description: 'Who says what? IARC, EPA, EFSA — when they disagree, we show the fight.',
              },
              {
                number: '4',
                title: 'Primary sources',
                description: 'The bedrock. Every claim traces to peer review, litigation, or official assessments.',
              },
              {
                number: '5',
                title: 'Legal cases',
                description: 'Money and precedent. Witness how evidence becomes justice.',
              },
              {
                number: '6',
                title: 'Cross-garden links',
                description: 'Toxicology connects to health, builder health, nature, commerce, and law.',
              },
            ].map((item) => (
              <div
                key={item.number}
                className="anim-layer-rise"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                }}
              >
                <div
                  className="anim-depth-pulse"
                  style={{
                    flex: '0 0 auto',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--tox-deep)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f5f1e8',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    marginTop: '0.2rem',
                  }}
                >
                  {item.number}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    className="subtitle-bold"
                    style={{
                      fontSize: '1.3rem',
                      color: 'var(--ink)',
                      marginBottom: '0.6rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.02rem',
                      lineHeight: 1.6,
                      color: 'var(--ink-soft)',
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          STRATIGRAPH TEASER — visual mini-tutorial showing the 4-layer model
          ========================================================================= */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
        style={{
          background: 'var(--paper)',
          color: 'var(--ink)',
        }}
      >
        <div className="max-w-3xl w-full">
          <p
            className="font-eyebrow"
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem',
            }}
          >
            A WINDOW INTO STRATIGRAPH
          </p>

          <h2
            className="headline-bold"
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              color: 'var(--ink)',
              marginBottom: '3rem',
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          >
            This is what a substance looks like.
          </h2>

          <div
            className="stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              marginBottom: '3rem',
            }}
          >
            {[
              { label: 'Hazard', description: 'What properties make this substance risky?' },
              { label: 'Profile', description: 'Clinical evidence, endpoints, biomarkers.' },
              { label: 'Response', description: 'Human exposure pathways and thresholds.' },
              { label: 'Citations', description: 'Peer review, litigation, regulatory assessment.' },
            ].map((card, idx) => (
              <div
                key={idx}
                className="anim-layer-rise tile-inner"
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    flex: '0 0 auto',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--tox-pale)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--tox-deep)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    className="subtitle-bold"
                    style={{
                      fontSize: '1.2rem',
                      color: 'var(--ink)',
                      marginBottom: '0.3rem',
                    }}
                  >
                    {card.label}
                  </h3>
                  <p
                    className="body-readable"
                    style={{
                      fontSize: '1rem',
                      color: 'var(--ink-soft)',
                    }}
                  >
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <a
              href="/compound/glyphosate"
              className="cta-pill cta-pill-lg cta-pill-primary"
            >
              Explore Glyphosate in Stratigraph →
            </a>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CADUCEUS SHOWCASE — luminous, animated, the brand centerpiece
          ========================================================================= */}
      <CaduceusShowcase />

      {/* =========================================================================
          PITCH TICKER — auto-cycling 3-beat pitch with deep-link CTAs
          ========================================================================= */}
      <PitchTicker />

      {/* =========================================================================
          FOOTER
          ========================================================================= */}
      <footer
        className="flex flex-col items-center justify-center gap-6 px-6 py-20 border-t"
        style={{
          borderColor: 'var(--paper-line)',
          background: 'var(--paper)',
        }}
      >
        <div
          style={{
            animation: 'halo-pulse 3s ease-in-out infinite',
          }}
        >
          <Emblem size="small" theme="luminous" ariaHidden />
        </div>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--ink-mute)',
            textAlign: 'center',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          Toxicology Knowledge Garden · 2026
        </p>

        <a
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            color: 'var(--teal-deep)',
            textDecoration: 'none',
            transition: 'color 0.2s',
            letterSpacing: '0.05em',
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            const elem = e.currentTarget as HTMLAnchorElement;
            elem.style.color = 'var(--teal)';
          }}
          onMouseLeave={(e) => {
            const elem = e.currentTarget as HTMLAnchorElement;
            elem.style.color = 'var(--teal-deep)';
          }}
        >
          ← Return to Loom
        </a>
      </footer>
    </main>
  );
}
