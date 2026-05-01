'use client';

import { useEffect, useState } from 'react';
import { getSubstance } from '@/lib/queries-tox';
import type { Substance, SubstanceAlias, CertifiedClaimRow, CrossGardenLink } from '@/lib/types-tox';
import TabRail from '@/components/substance/TabRail';
import OverviewTab from '@/components/substance/OverviewTab';
import MechanismTab from '@/components/substance/MechanismTab';
import RegulatoryTab from '@/components/substance/RegulatoryTab';
import EvidenceTab from '@/components/substance/EvidenceTab';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function SubstancePage({ params }: Props) {
  const [slug, setSlug] = useState<string>('');
  const [substance, setSubstance] = useState<Substance | null>(null);
  const [aliases, setAliases] = useState<SubstanceAlias[]>([]);
  const [claims, setClaims] = useState<CertifiedClaimRow[]>([]);
  const [crossGardenLinks, setCrossGardenLinks] = useState<CrossGardenLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);

        const data = await getSubstance(resolvedParams.slug);
        if (!data) {
          setError('Substance not found');
          setLoading(false);
          return;
        }

        setSubstance(data.substance);
        setAliases(data.aliases);
        setClaims(data.claims);
        setCrossGardenLinks(data.cross_garden_links);
      } catch (err) {
        console.error('Failed to load substance:', err);
        setError('Failed to load substance');
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (loading) {
    return (
      <div data-surface="tkg" className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--ink-mute)]">Loading…</div>
      </div>
    );
  }

  if (error || !substance) {
    return (
      <div data-surface="tkg" className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl mb-4">Substance not found</h1>
        <p className="text-[var(--ink-mute)] mb-6">The substance "{slug}" could not be found in our database.</p>
        <a href="/" className="text-[var(--teal)] hover:text-[var(--teal-deep)]">
          Back to home
        </a>
      </div>
    );
  }

  const tabs = [
    {
      label: 'Overview',
      content: <OverviewTab substance={substance} aliases={aliases} claims={claims} />,
    },
    {
      label: 'Mechanism',
      content: <MechanismTab substance={substance} claims={claims} />,
    },
    {
      label: 'Regulatory',
      content: <RegulatoryTab claims={claims} />,
    },
    {
      label: 'Evidence',
      content: <EvidenceTab claims={claims} crossGardenLinks={crossGardenLinks} />,
    },
  ];

  return (
    <div data-surface="tkg" className="min-h-screen">
      <div className="sticky top-0 z-40 bg-[var(--paper)] border-b border-[var(--paper-line)]">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {/* Sticky header */}
          <div className="mb-6">
            <h1 className="text-5xl font-display italic mb-2">{substance.name}</h1>
            {substance.cas_number && (
              <div className="font-data text-[var(--ink-mute)]">CAS {substance.cas_number}</div>
            )}
          </div>

          {/* Tab rail */}
          <TabRail tabs={tabs.map((t) => t.label)} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Tab content with 400ms crossfade */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div
          style={{
            opacity: 1,
            transition: 'opacity 400ms ease-in-out',
          }}
        >
          {tabs[activeTab]?.content}
        </div>
      </div>

      {/* Placeholder for cross-garden links (E2 integration) */}
      <div id="cross-garden-links" />
    </div>
  );
}
