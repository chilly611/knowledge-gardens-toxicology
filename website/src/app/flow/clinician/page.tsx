'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import StageStepper from '@/components/flow/StageStepper';
import ClinicianFlow from '@/components/flow/ClinicianFlow';
import { audienceColor } from '@/styles/tokens';

const STAGES = ['triage', 'differential', 'test', 'interpret', 'brief'];

export default function ClinicianFlowPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center" style={{ color: 'var(--ink-mute)' }}>Loading clinician lane...</div>}>
      <ClinicianFlowPageInner />
    </Suspense>
  );
}

function ClinicianFlowPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stage, setStage] = useState('triage');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [suspected, setSuspected] = useState<string>();
  const [patient, setPatient] = useState('');
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);

  useEffect(() => {
    const stageParam = searchParams.get('stage');
    const symptomsParam = searchParams.get('symptoms');
    const suspectedParam = searchParams.get('suspected');
    const patientParam = searchParams.get('patient');
    const claimsParam = searchParams.get('claims');

    if (stageParam && STAGES.includes(stageParam)) {
      setStage(stageParam);
    }
    if (symptomsParam) {
      setSymptoms(symptomsParam.split(',').filter(Boolean));
    }
    if (suspectedParam) {
      setSuspected(suspectedParam);
    }
    if (patientParam) {
      setPatient(decodeURIComponent(patientParam));
    }
    if (claimsParam) {
      setSelectedClaims(claimsParam.split(',').filter(Boolean));
    }
  }, [searchParams]);

  const handleStageClick = (newStage: string) => {
    setStage(newStage);
    const params = new URLSearchParams(searchParams);
    params.set('stage', newStage);
    router.push(`?${params.toString()}`);
  };

  const handleSymptomsChange = (newSymptoms: string[]) => {
    setSymptoms(newSymptoms);
    const params = new URLSearchParams(searchParams);
    if (newSymptoms.length > 0) {
      params.set('symptoms', newSymptoms.join(','));
    } else {
      params.delete('symptoms');
    }
    router.push(`?${params.toString()}`);
  };

  const handleSuspectedChange = (newSuspected: string) => {
    setSuspected(newSuspected);
    const params = new URLSearchParams(searchParams);
    params.set('suspected', newSuspected);
    router.push(`?${params.toString()}`);
  };

  const handlePatientChange = (newPatient: string) => {
    setPatient(newPatient);
    const params = new URLSearchParams(searchParams);
    if (newPatient) {
      params.set('patient', encodeURIComponent(newPatient));
    } else {
      params.delete('patient');
    }
    router.push(`?${params.toString()}`);
  };

  const handleSelectedClaimsChange = (ids: string[]) => {
    setSelectedClaims(ids);
    const params = new URLSearchParams(searchParams);
    if (ids.length > 0) {
      params.set('claims', ids.join(','));
    } else {
      params.delete('claims');
    }
    router.push(`?${params.toString()}`);
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
            accent={audienceColor('clinician')}
            onStageClick={handleStageClick}
          />
        </div>

        <ClinicianFlow
          stage={stage}
          symptoms={symptoms}
          suspected={suspected}
          patient={patient}
          selectedClaims={selectedClaims}
          onSymptomsChange={handleSymptomsChange}
          onSuspectedChange={handleSuspectedChange}
          onPatientChange={handlePatientChange}
          onSelectedClaimsChange={handleSelectedClaimsChange}
          onNext={handleNext}
          onPrev={handlePrev}
          stages={STAGES}
        />
      </div>
    </main>
  );
}
