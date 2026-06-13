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
          radial-gradient(80% 60% at 50% 30%, rgba(60, 122, 138, 0.30) 0%, rgba(35, 76, 90, 0.92) 60%, #1d3d47 100%),
          linear-gradient(180deg, #234C5A 0%, #1f424e 50%, #1a3540 100%)
        `,
      }}
    >
      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(242, 233, 210, 0.4) 1px, transparent 0)',
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
                color: 'var(--teal-pale)',
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
                color: 'var(--paper)',
              }}
            >
              Three audiences.{' '}
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: '#C68A3D',
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
                  color: 'rgba(242, 233, 210, 0.88)',
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
