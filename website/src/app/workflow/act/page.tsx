'use client';

/**
 * /workflow/act — Stage 04 · the real Act tool (acute / first-response).
 * Carries an emergency banner; defaults to escalation when evidence is thin.
 */
import StageWorkspace from '@/components/flow/StageWorkspace';

export default function ActStage() {
  return (
    <StageWorkspace
      config={{
        stage: 'act',
        lane: 'clinician',
        emergency: true,
        title: 'Act on exposure.',
        tagline: 'Acute response — first steps, what to watch for, and exactly when to escalate.',
        inputLabel: 'Describe the exposure that just happened',
        placeholder: 'e.g., a child swallowed a mouthful of glyphosate weed-killer concentrate about 20 minutes ago',
        defaultSubject: 'An adult had a significant skin and inhalation exposure to PCB-containing oil during a transformer leak.',
        presets: [
          { label: 'Swallowed pesticide', subject: 'A child swallowed a mouthful of glyphosate weed-killer concentrate about 20 minutes ago.' },
          { label: 'Skin / inhalation spill', subject: 'An adult had a significant skin and inhalation exposure to PCB-containing oil during a transformer leak.' },
          { label: 'Possible lead ingestion', subject: 'A toddler may have swallowed a paint chip from a wall with old lead-based paint.' },
        ],
        prompt: (s) =>
          `Acute exposure, decontamination, symptoms, antidote, Poison Control, glyphosate, PCBs, lead, organophosphate. Exposure that just happened: ${s} Give the immediate response: first steps, decontamination, the key symptoms to watch for, when to call Poison Control (1-800-222-1222) or go to the ER, and any specific antidote or contraindication. Be decisive and safety-first; if the evidence is thin, default to escalation.`,
        outputLabel: 'First-response protocol',
      }}
    />
  );
}
