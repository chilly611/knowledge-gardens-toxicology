'use client';

/**
 * /workflow/reflect — Stage 07 · the real Reflect tool (evidence retrospective).
 * End of the lifecycle: what's settled, what's contested, what to watch.
 */
import StageWorkspace from '@/components/flow/StageWorkspace';

export default function ReflectStage() {
  return (
    <StageWorkspace
      config={{
        stage: 'reflect',
        lane: 'counsel',
        title: 'Reflect & learn.',
        tagline: "What's settled, what's still contested, and what to watch as the evidence evolves.",
        inputLabel: 'Name the substance or claim to review',
        placeholder: 'e.g., PCB exposure and non-Hodgkin lymphoma — how settled is the causation?',
        defaultSubject: 'PCB exposure and non-Hodgkin lymphoma — how settled is the causation, really?',
        presets: [
          { label: 'PCBs & lymphoma', subject: 'PCB exposure and non-Hodgkin lymphoma — how settled is the causation, really?' },
          { label: 'Glyphosate & cancer', subject: 'Glyphosate and cancer risk — what is certified versus contested?' },
          { label: 'Dioxin & immune effects', subject: 'Dioxin exposure and immune-system effects — where does the evidence stand?' },
        ],
        prompt: (s) =>
          `PCBs, dioxins, glyphosate, non-Hodgkin lymphoma, carcinogenicity, certified, contested, IARC, evidence tiers, confidence. Retrospective on: ${s} Give an evidence retrospective: what is well-established (certified), what is still contested, where the real uncertainty lies, and what to monitor as new evidence arrives.`,
        outputLabel: 'Evidence retrospective',
      }}
    />
  );
}
