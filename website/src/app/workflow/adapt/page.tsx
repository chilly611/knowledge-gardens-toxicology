'use client';

/**
 * /workflow/adapt — Stage 05 · the real Adapt tool (re-assess when conditions change).
 */
import StageWorkspace from '@/components/flow/StageWorkspace';

export default function AdaptStage() {
  return (
    <StageWorkspace
      config={{
        stage: 'adapt',
        lane: 'clinician',
        title: 'Adapt to change.',
        tagline: 'Something shifted — a higher dose, new data, a new ruling. What do you adjust?',
        inputLabel: 'Describe what changed',
        placeholder: 'e.g., monitoring shows PCB serum levels still rising despite current controls',
        defaultSubject: 'Monitoring shows worker PCB serum levels are still rising despite the current controls.',
        presets: [
          { label: 'Levels still rising', subject: 'Monitoring shows worker PCB serum levels are still rising despite the current controls.' },
          { label: 'New study published', subject: 'A new peer-reviewed study links glyphosate to effects at lower doses than we assumed.' },
          { label: 'Regulation tightened', subject: 'The regulatory exposure limit for this contaminant was just tightened.' },
        ],
        prompt: (s) =>
          `PCBs, dioxins, glyphosate, biomarkers, exposure, re-assessment. Conditions changed: ${s} Re-assess what this changes about the risk and the response, and what specifically to adjust now — be concrete about what is different and what action follows.`,
        outputLabel: 'Adjusted assessment',
      }}
    />
  );
}
