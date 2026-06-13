'use client';

/**
 * Home — the Toxicology Knowledge Garden.
 *
 * Collapsed from a nine-section scroll-marathon to a tight, purposeful flow
 * with one clear path in:
 *
 *   1. HomeHero ............. the herbarium masthead + search
 *   2. AudienceInvitations .. "Choose your lane" — consumer / clinician / counsel
 *   3. BrowsePanel ......... "Three doorways into what we know"
 *   4. TrustStrip .......... "Verifiability is the new visibility" — the proof
 *   5. FeaturedCase ........ Erickson v. Monsanto — a worked case
 *
 * Cut from the homepage (still available as components / dedicated routes):
 * the 7-stage explainer (lives on /workflow), "why it persists," the Loom
 * matrix (power-user view), and the dusk finale.
 */
import { Suspense } from 'react';
import HomeHero from '@/components/home/HomeHero';
import AudienceInvitationsSection from '@/components/home/AudienceInvitationsSection';
import BrowsePanel from '@/components/home/BrowsePanel';
import TrustStrip from '@/components/home/TrustStrip';
import FeaturedCase from '@/components/home/FeaturedCase';

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomeHero />
      <AudienceInvitationsSection />
      <BrowsePanel />
      <TrustStrip />
      <FeaturedCase />
    </Suspense>
  );
}
