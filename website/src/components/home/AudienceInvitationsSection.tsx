'use client';

/**
 * AudienceInvitationsSection — its own screen-height dark section that hosts
 * the three audience invitation cards. Sits between HomeHero (cinematic) and
 * BrowsePanel (paper). Visual transition: dark hero → dark audience screen
 * → paper world.
 *
 * One focused message: "Who is this for?" → three big cards with clear CTAs
 * and deliverable previews.
 */
import ScrollReveal from './ScrollReveal';
import AudienceInvitations from './AudienceInvitations';

export default function AudienceInvitationsSection() {
  return (
    <section
      className="relative isolate flex items-center py-24"
      data-mode="dark"
      style={{
        minHeight: '100vh',
        background: `
          radial-gradient(80% 60% at 50% 30%, rgba(59, 79, 107, 0.25) 0%, rgba(14, 24, 39, 0.85) 60%, #060c16 100%),
          linear-gradient(180deg, #060c16 0%, #0a1422 50%, #0e1827 100%)
        `,
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.5) 1px, transparent 0)',
          backgroundSize: '4px 4px',
        }}
        aria-hidden
      />

      <div className="relative rail-wide">
        <div className="mb-16 text-center">
          <ScrollReveal>
            <div
              className="mb-5 text-center"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'rgba(157, 182, 204, 0.85)',
              }}
            >
              who is this for
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <h2
              className="mx-auto max-w-[18ch] text-center"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              Three audiences.{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: '#F2C994',
                }}
              >
                One garden.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="prose-rail">
              <p
                className="mx-auto mt-6 text-center"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.2rem)',
                  lineHeight: 1.55,
                  color: 'rgba(200, 212, 226, 0.92)',
                }}
              >
                Pick the lane that matches what you&rsquo;re trying to do. Each one ends in a deliverable
                you can hand to a partner, a clinician, or a court.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={450}>
          <AudienceInvitations />
        </ScrollReveal>
      </div>
    </section>
  );
}
