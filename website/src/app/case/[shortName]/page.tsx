'use client';

import { useState, useEffect } from 'react';
import { getCase, getCrossGardenLinks, slug } from '@/lib/queries-tox';
import type { CaseDetail, CrossGardenLink } from '@/lib/types-tox';
import Emblem from '@/components/shared/Emblem';
import CornerBrackets from '@/components/shared/CornerBrackets';
import DimensionLine from '@/components/shared/DimensionLine';
import GearOrnament from '@/components/shared/GearOrnament';
import CrossGardenLinks from '@/components/shared/CrossGardenLinks';
import CaseTimeline from '@/components/case/CaseTimeline';
import PartyGraph from '@/components/case/PartyGraph';
import DocumentRegister from '@/components/case/DocumentRegister';
import { useViewportReveal } from '@/lib/animations';

export default function CaseDetailPage({
  params,
}: {
  params: { shortName: string };
}) {
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [crossGardenLinks, setCrossGardenLinks] = useState<CrossGardenLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadCase = async () => {
      try {
        setLoading(true);
        // Convert slug back to name: sky-valley -> Sky Valley PCB Case
        const name = params.shortName.replace(/-/g, ' ');
        const data = await getCase(name);
        if (data) {
          setCaseData(data);
          setNotFound(false);
          // Fetch cross-garden links for this case
          const links = await getCrossGardenLinks(data.id, 'case');
          setCrossGardenLinks(links);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error loading case:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadCase();
  }, [params.shortName]);

  if (loading) {
    return (
      <main data-surface="tkg" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center text-[var(--ink-soft)]">Loading case data...</div>
        </div>
      </main>
    );
  }

  if (notFound) {
    return (
      <main data-surface="tkg" className="min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded border border-[var(--crimson)] bg-[var(--paper-warm)] p-8">
            <h1 className="mb-4 text-2xl font-bold text-[var(--ink)]">Case not found</h1>
            <p className="mb-6 text-[var(--ink-soft)]">
              The case you&apos;re looking for does not exist in our knowledge base.
            </p>
            <a
              href="/"
              className="inline-block rounded bg-[var(--teal)] px-4 py-2 text-[var(--paper)] no-underline transition-colors hover:bg-[var(--teal-deep)]"
            >
              Return home
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (!caseData) {
    return null;
  }

  // Find toxicology expert
  const expert = caseData.experts?.find(
    (e) =>
      e.specialty?.toLowerCase().includes('toxicology') ||
      e.full_name?.toLowerCase().includes('dahlgren')
  );

  return (
    <main data-surface="tkg" className="min-h-screen">
      <div className="rail-default py-12 sm:py-16 lg:py-20">
        {/* ===== HEADER SECTION ===== */}
        <section className="section-accent mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            {/* Eyebrow */}
            <div className="font-eyebrow mb-3">
              Legal Case · {caseData.jurisdiction || 'Unknown'} · {caseData.filed_year || 'N/A'}
            </div>

            {/* Caption */}
            <h1 className="mb-4 text-5xl font-bold text-[var(--ink)]" style={{ fontStyle: 'normal' }}>
              {caseData.caption}
            </h1>

            {/* Description */}
            {caseData.description && (
              <p className="text-lg text-[var(--ink-soft)]" style={{ fontStyle: 'normal' }}>
                {caseData.description}
              </p>
            )}
          </div>

          {/* Expert callout — right side */}
          {expert && (
            <div className="flex items-start justify-center lg:justify-end">
              <CornerBrackets size={12} thickness={1} color="var(--crimson)">
                <div className="bg-[var(--paper-warm)] px-6 py-4">
                  <div className="font-eyebrow mb-2 text-[var(--crimson)]">
                    Lead Expert
                  </div>
                  <div className="mb-2 text-sm font-semibold text-[var(--ink)]">
                    Dr. {expert.full_name}
                  </div>
                  {expert.specialty && (
                    <div className="text-xs text-[var(--ink-soft)]">{expert.specialty}</div>
                  )}
                </div>
              </CornerBrackets>
            </div>
          )}
        </section>

        {/* ===== PARTY GRAPH ===== */}
        {caseData.parties && caseData.parties.length > 0 && (
          <section className="section-accent mb-16">
            <h2 className="mb-6 text-3xl font-bold text-[var(--ink)]">Parties</h2>
            <PartyGraph parties={caseData.parties} />
          </section>
        )}

        {/* ===== DOCUMENT REGISTER ===== */}
        {caseData.documents && caseData.documents.length > 0 && (
          <section className="section-accent mb-16">
            <h2 className="mb-6 text-3xl font-bold text-[var(--ink)]">Documents</h2>
            <DocumentRegister documents={caseData.documents} />
            <div className="my-8">
              <DimensionLine length={240} />
            </div>
          </section>
        )}

        {/* ===== CASE TIMELINE ===== */}
        {caseData.events && caseData.events.length > 0 && (
          <section className="section-accent mb-16">
            <h2 className="mb-6 text-3xl font-bold text-[var(--ink)]">Timeline</h2>
            <CaseTimeline events={caseData.events} documents={caseData.documents} />
            <div className="my-8">
              <DimensionLine length={240} />
            </div>
          </section>
        )}

        {/* ===== SUBSTANCES STRIP ===== */}
        {caseData.substances && caseData.substances.length > 0 && (
          <section className="section-accent mb-16">
            <h2 className="mb-6 text-3xl font-bold text-[var(--ink)]">Substances</h2>
            <div className="flex flex-wrap gap-4">
              {caseData.substances.map((subst) => (
                <CornerBrackets key={subst.id} size={12} thickness={1} color="var(--peach-deep)">
                  <div className="tile bg-[var(--paper-warm)]">
                    <div className="mb-1 text-[var(--ink)]" style={{ fontStyle: 'normal', fontWeight: 700 }}>
                      {subst.name}
                    </div>
                    {subst.cas_number && (
                      <div className="font-mono text-xs text-[var(--ink-mute)]">
                        CAS {subst.cas_number}
                      </div>
                    )}
                    <a
                      href={`/compound/${slug(subst.name)}`}
                      className="mt-2 inline-block cta-pill cta-pill-secondary text-xs font-semibold no-underline"
                    >
                      Open Stratigraph →
                    </a>
                  </div>
                </CornerBrackets>
              ))}
            </div>
          </section>
        )}

        {/* ===== CROSS-GARDEN CONTEXT ===== */}
        {crossGardenLinks && crossGardenLinks.length > 0 && (
          <section className="section-accent mb-16">
            <div className="font-eyebrow mb-4 text-[var(--ink-mute)]">cross-garden context</div>
            <CrossGardenLinks links={crossGardenLinks} />
          </section>
        )}

        {/* ===== COUNSEL FLOW CTA ===== */}
        <section className="mb-16">
          <CornerBrackets size={16} thickness={1.2} color="var(--crimson)">
            <div className="tile border-l-4 border-[var(--crimson)] bg-[var(--paper-warm)]">
              <h3 className="mb-3 text-xl font-bold text-[var(--ink)]">
                Open in Counsel flow
              </h3>
              <p className="mb-6 text-[var(--ink-soft)]">
                Pre-load this case in the Counsel flow — frame, assemble, argue, witness, file.
              </p>
              <a
                href={`/flow/counsel?case=${params.shortName}`}
                className="cta-pill cta-pill-lg cta-pill-primary inline-block"
              >
                Open flow
              </a>
            </div>
          </CornerBrackets>
        </section>

        {/* ===== FOOTER ORNAMENT ===== */}
        <div className="flex justify-center py-12 opacity-10">
          <GearOrnament size={48} speed={20} />
        </div>
      </div>
    </main>
  );
}
