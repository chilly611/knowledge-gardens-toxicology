'use client';

/**
 * /workflow/assess — Stage 02 · the real Assess tool (AI risk read).
 * Replaces the old hub of preview-only mockups.
 */
import StageWorkspace from '@/components/flow/StageWorkspace';

export default function AssessStage() {
  return (
    <StageWorkspace
      config={{
        stage: 'assess',
        lane: 'clinician',
        title: 'Assess the risk.',
        tagline: 'Turn an exposure into a risk read — dose, route, and who is most vulnerable, weighed against the evidence.',
        inputLabel: "Describe the substance and how someone's exposed",
        placeholder: 'e.g., a maintenance worker handling PCB-containing oil daily, no respiratory protection, for six months',
        defaultSubject: 'A maintenance worker handles PCB-containing transformer oil daily without respiratory protection.',
        presets: [
          { label: 'PCBs · occupational', subject: 'A maintenance worker handles PCB-containing transformer oil daily without respiratory protection.' },
          { label: 'Glyphosate · agricultural', subject: 'An agricultural worker mixes and sprays glyphosate herbicide through the growing season.' },
          { label: 'Dioxin · residential', subject: 'A family lives near a former waste incinerator and worries about dioxin in soil and garden vegetables.' },
        ],
        prompt: (s) =>
          `PCBs, dioxins, glyphosate, dose, exposure route, NOAEL, LD50, biomarkers, vulnerable populations. Assess this exposure: ${s} How dangerous is it really — name the likely route and dose context, who is most vulnerable, and how strong the supporting evidence is. Flag certified vs. contested.`,
        outputLabel: 'Risk assessment',
      }}
    />
  );
}
