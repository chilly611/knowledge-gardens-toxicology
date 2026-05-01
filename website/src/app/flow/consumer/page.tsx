'use client';

// Force dynamic rendering (uses useSearchParams) — bails out of static prerender
export const dynamic = 'force-dynamic';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import StageStepper from '@/components/flow/StageStepper';
import ConsumerFlow from '@/components/flow/ConsumerFlow';
import { audienceColor } from '@/styles/tokens';

const STAGES = ['identify', 'discover', 'trace', 'decide', 'carry'];

export default function ConsumerFlowPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stage, setStage] = useState('identify');
  const [concern, setConcern] = useState<string>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const stageParam = searchParams.get('stage');
    const concernParam = searchParams.get('concern');
    const selectedParam = searchParams.get('selected');

    if (stageParam && STAGES.includes(stageParam)) {
      setStage(stageParam);
    }
    if (concernParam) {
      setConcern(concernParam);
    }
    if (selectedParam) {
      setSelectedIds(selectedParam.split(',').filter(Boolean));
    }
  }, [searchParams]);

  const handleStageClick = (newStage: string) => {
    setStage(newStage);
    const params = new URLSearchParams(searchParams);
    params.set('stage', newStage);
    router.push(`?${params.toString()}`);
  };

  const handleConcernChange = (newConcern: string) => {
    setConcern(newConcern);
    const params = new URLSearchParams(searchParams);
    params.set('concern', newConcern);
    router.push(`?${params.toString()}`);
    // Auto-advance to discover
    handleStageClick('discover');
  };

  const handleSelectedChange = (ids: string[]) => {
    setSelectedIds(ids);
    const params = new URLSearchParams(searchParams);
    if (ids.length > 0) {
      params.set('selected', ids.join(','));
    } else {
      params.delete('selected');
    }
    router.push(`?${params.toString()}`);
  };

  const handleUserNameChange = (name: string) => {
    setUserName(name);
  };

  const stageIndex = STAGES.indexOf(stage);
  const handleNext = () => {
    if (stageIndex < STAGES.length - 1) {
      const nextStage = STAGES[stageIndex + 1];
      handleStageClick(nextStage);
    }
  };

  const handlePrev = () => {
    if (stageIndex > 0) {
      const prevStage = STAGES[stageIndex - 1];
      handleStageClick(prevStage);
    }
  };

  return (
    <main data-surface="tkg" className="min-h-screen bg-[var(--paper)]">
      <div className="rail-default w-full py-12">
        <div className="mb-8">
          <StageStepper
            stages={STAGES}
            current={stage}
            accent={audienceColor('consumer')}
            onStageClick={handleStageClick}
          />
        </div>

        <ConsumerFlow
          stage={stage}
          concern={concern}
          selectedIds={selectedIds}
          userName={userName}
          onConcernChange={handleConcernChange}
          onSelectedChange={handleSelectedChange}
          onUserNameChange={handleUserNameChange}
        />
      </div>
    </main>
  );
}
