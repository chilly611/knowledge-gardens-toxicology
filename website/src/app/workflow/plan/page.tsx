'use client';

/**
 * /workflow/plan — Stage 03 · the real Plan tool (AI mitigation plan).
 */
import StageWorkspace from '@/components/flow/StageWorkspace';

export default function PlanStage() {
  return (
    <StageWorkspace
      config={{
        stage: 'plan',
        lane: 'clinician',
        title: 'Plan the response.',
        tagline: 'Ranked mitigation — what actually cuts the risk first, from elimination down to monitoring.',
        inputLabel: 'Describe the hazard and the setting',
        placeholder: 'e.g., reduce PCB exposure for maintenance crews servicing legacy transformers',
        defaultSubject: 'Reduce PCB exposure for maintenance crews servicing legacy transformers.',
        presets: [
          { label: 'PCBs · worksite controls', subject: 'Reduce PCB exposure for maintenance crews servicing legacy transformers.' },
          { label: 'Glyphosate · on a farm', subject: 'Reduce glyphosate exposure for farm workers who mix and apply it.' },
          { label: 'Lead · in an old home', subject: 'Reduce lead exposure for a family living in a home with deteriorating lead paint.' },
        ],
        prompt: (s) =>
          `PCBs, dioxins, glyphosate, lead, exposure reduction, substitution, engineering controls, PPE, monitoring. Situation: ${s} Give a ranked mitigation plan following the hierarchy of controls — eliminate or substitute first, then engineering controls, then PPE and monitoring — grounded in what is known about this hazard. Most effective first.`,
        outputLabel: 'Mitigation plan',
      }}
    />
  );
}
