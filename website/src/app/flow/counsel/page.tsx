'use client';

/**
 * /flow/counsel — Counsel flow main page
 * UPDATED 2026-05-01: Added pt-16/pt-20 to first section for TopFrame spacing.
 * Bold pill navigation with proper visual distinction.
 */

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import StageStepper from '@/components/flow/StageStepper';
import CounselFlow from '@/components/flow/CounselFlow';
import { audienceColor } from '@/styles/tokens';

const STAGES = ['frame', 'assemble', 'argue', 'witness', 'file'];

function CounselFlowPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stage, setStage] = useState('frame');
  const [substances, setSubstances] = useState<string[]>([]);
  const [jurisdiction, setJurisdiction] = useState<string>('');
  const [theory, setTheory] = useState<string>('');
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [casePreset, setCasePreset] = useState<string>();
  const [counselName, setCounselName] = useState('');
  const [firm, setFirm] = useState('');
  const [filingRef, setFilingRef] = useState('');

  useEffect(() => {
    const stageParam = searchParams.get('stage');
    const substancesParam = searchParams.get('substances');
    const jurisdictionParam = searchParams.get('jurisdiction');
    const theoryParam = searchParams.get('theory');
    const sourcesParam = searchParams.get('sources');
    const caseParam = searchParams.get('case');

    if (stageParam && STAGES.includes(stageParam)) {
      setStage(stageParam);
    }

    if (caseParam) {
      setCasePreset(caseParam);
      // Prefill with Sky Valley defaults
      if (caseParam === 'sky-valley') {
        setSubstances(['PCBs', 'Dioxin']);
        setJurisdiction('WA');
        setTheory('carcinogenicity');
      }
    }

    if (substancesParam) {
      setSubstances(substancesParam.split(',').filter(Boolean));
    }
    if (jurisdictionParam) {
      setJurisdiction(jurisdictionParam);
    }
    if (theoryParam) {
      setTheory(theoryParam);
    }
    if (sourcesParam) {
      setSelectedSourceIds(sourcesParam.split(',').filter(Boolean));
    }
  }, [searchParams]);

  const handleStageClick = (newStage: string) => {
    setStage(newStage);
    const params = new URLSearchParams(searchParams);
    params.set('stage', newStage);
    router.push(`?${params.toString()}`);
  };

  const handleSubstancesChange = (newSubstances: string[]) => {
    setSubstances(newSubstances);
    const params = new URLSearchParams(searchParams);
    if (newSubstances.length > 0) {
      params.set('substances', newSubstances.join(','));
    } else {
      params.delete('substances');
    }
    router.push(`?${params.toString()}`);
  };

  const handleJurisdictionChange = (newJurisdiction: string) => {
    setJurisdiction(newJurisdiction);
    const params = new URLSearchParams(searchParams);
    params.set('jurisdiction', newJurisdiction);
    router.push(`?${params.toString()}`);
  };

  const handleTheoryChange = (newTheory: string) => {
    setTheory(newTheory);
    const params = new URLSearchParams(searchParams);
    params.set('theory', newTheory);
    router.push(`?${params.toString()}`);
  };

  const handleSelectedSourcesChange = (ids: string[]) => {
    setSelectedSourceIds(ids);
    const params = new URLSearchParams(searchParams);
    if (ids.length > 0) {
      params.set('sources', ids.join(','));
    } else {
      params.delete('sources');
    }
    router.push(`?${params.toString()}`);
  };

  const handleClearPreset = () => {
    setCasePreset(undefined);
    const params = new URLSearchParams(searchParams);
    params.delete('case');
    router.push(`?${params.toString()}`);
  };

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      {/* Stage stepper with proper top spacing from TopFrame */}
      <section className="rail-default w-full pt-16 sm:pt-20 pb-12">
        <nav className="flex gap-3 overflow-x-auto pb-3 md:pb-0 md:overflow-visible md:gap-3 md:flex-wrap">
          {STAGES.map((s, i) => {
            const isActive = s === stage;
            const stageLabels = ['Frame', 'Assemble', 'Argue', 'Witness', 'File'];
            const stageDescriptions = [
              'Substances + Theory',
              'Parties & Docs',
              'Daubert Prep',
              'Expert Credentials',
              'Filing Details',
            ];
            return (
              <button
                key={s}
                onClick={() => handleStageClick(s)}
                className={`flex-shrink-0 rounded-full transition-all min-w-fit whitespace-nowrap ${
                  isActive ? 'hover:shadow-md' : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--crimson)' : 'var(--paper-warm)',
                  color: isActive ? 'var(--paper)' : 'var(--ink-soft)',
                  border: isActive ? 'none' : '1px dashed var(--paper-line)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0.75rem 1.25rem',
                  gap: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{i + 1}</span>
                <span>{stageLabels[i]}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginLeft: '0.25rem',
                  }}
                >
                  · {stageDescriptions[i]}
                </span>
              </button>
            );
          })}
        </nav>
      </section>

      {/* Main content */}
      <section className="rail-default w-full pb-16">
        <CounselFlow
          stage={stage}
          substances={substances}
          jurisdiction={jurisdiction}
          theory={theory}
          selectedSourceIds={selectedSourceIds}
          casePreset={casePreset}
          counselName={counselName}
          firm={firm}
          filingRef={filingRef}
          onSubstancesChange={handleSubstancesChange}
          onJurisdictionChange={handleJurisdictionChange}
          onTheoryChange={handleTheoryChange}
          onSelectedSourcesChange={handleSelectedSourcesChange}
          onCounselNameChange={setCounselName}
          onFirmChange={setFirm}
          onFilingRefChange={setFilingRef}
          onClearPreset={handleClearPreset}
        />
      </section>
    </main>
  );
}

export default function CounselFlowPage() {
  return (
    <Suspense fallback={<div style={{padding:'2rem',color:'var(--ink-mute)'}}>Loading...</div>}>
      <CounselFlowPageInner />
    </Suspense>
  );
}
