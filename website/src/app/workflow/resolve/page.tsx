'use client';

/**
 * /workflow/resolve — Stage 06 · the real Resolve tool (structured wrap-up record).
 */
import StageWorkspace from '@/components/flow/StageWorkspace';

export default function ResolveStage() {
  return (
    <StageWorkspace
      config={{
        stage: 'resolve',
        lane: 'counsel',
        title: 'Resolve & document.',
        tagline: 'Close it out with a structured, citable record you can hand to a partner, a clinician, or a court.',
        inputLabel: 'Describe what happened and what was done',
        placeholder: 'e.g., transformer-oil PCB exposure incident — workers monitored, controls upgraded, two cases referred',
        defaultSubject: 'A PCB transformer-oil exposure incident: affected workers were monitored, controls were upgraded, and elevated cases were referred for clinical follow-up.',
        presets: [
          { label: 'Exposure incident', subject: 'A PCB transformer-oil exposure incident: affected workers were monitored, controls were upgraded, and elevated cases were referred for clinical follow-up.' },
          { label: 'Remediation program', subject: 'A soil remediation program at a dioxin-contaminated residential site is wrapping up after eighteen months.' },
          { label: 'Clinical follow-up', subject: 'A glyphosate-exposed agricultural cohort completed biomarker testing and clinical follow-up.' },
        ],
        prompt: (s) =>
          `PCBs, dioxins, glyphosate, evidence tiers, certified, contested, IARC, EPA. Wrap-up: ${s} Produce a structured record: what happened, what the evidence shows (with tier and strength), what was done, and the residual risk and recommended follow-up. Write it as a documentation summary suitable for a report or hand-off.`,
        outputLabel: 'Wrap-up record',
      }}
    />
  );
}
