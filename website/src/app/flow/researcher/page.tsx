'use client';

/**
 * /flow/researcher — the Researcher / Scientist Killer App (evidence synthesis).
 * The fourth lane: mechanism, study design, strength-of-evidence, and the gaps.
 */
import SituationWorkspace from '@/components/flow/SituationWorkspace';

export default function ResearcherKillerApp() {
  return (
    <SituationWorkspace
      config={{
        lane: 'researcher',
        plate: '/plates/audience-researchers.png',
        eyebrow: 'Researcher workspace · evidence synthesis',
        title: 'Map the evidence.',
        deliverable: 'Evidence Synthesis',
        deliverableSub: "What's established, what's contested, and where the gaps are",
        inputLabel: 'Name a substance, endpoint, or open question',
        placeholder: 'e.g., PCB neurotoxicity in adults — strength of evidence and open questions',
        defaultSituation: 'PCB exposure and adult cognitive / neurological injury — the strength of the evidence and the open questions.',
        takeLabel: 'AI take · researcher lane',
        takePrompt: (s) =>
          `PCBs, dioxins, glyphosate, microplastics, neurotoxicity, mechanism, dose-response, cohort, systematic review, biomarkers, evidence tiers. Question: ${s} Synthesize the evidence: the mechanism and key study designs, what is established vs. contested (by tier), effect sizes where known, and the concrete research gaps — naming what study would resolve each.`,
        presets: [
          { label: 'PCBs · adult neurotoxicity', situation: 'PCB exposure and adult cognitive / neurological injury — strength of evidence and gaps.' },
          { label: 'Glyphosate · carcinogenicity', situation: 'Glyphosate and cancer — the IARC vs. EPA disagreement, the strongest studies, and the open questions.' },
          { label: 'Microplastics · cardiovascular', situation: 'Microplastics and cardiovascular disease — mechanism, the emerging evidence, and what is still unknown.' },
        ],
        moves: [
          { key: 'mechanism', title: 'Mechanism of action', sub: 'How the harm happens', prompt: (s) => `Mechanism, pathway, receptor, oxidative stress, thyroid, dopamine. Subject: ${s} Lay out the mechanism(s) of action in detail, with the supporting studies, and where the mechanism is still uncertain.` },
          { key: 'strength', title: 'Strength of evidence', sub: 'By study design & tier', prompt: (s) => `Evidence tiers, systematic review, cohort, dose-response, effect size. Subject: ${s} Rate the strength of evidence by tier and study design — strongest designs first — with effect sizes and dose-response where available.` },
          { key: 'contested', title: "What's contested", sub: 'Where the field disagrees', prompt: (s) => `Contested, heterogeneity, confounding, certified vs. contested. Subject: ${s} Surface what is contested — the disagreements, heterogeneity, and confounding — and why the field has not converged.` },
          { key: 'gaps', title: 'Research gaps', sub: 'What to study next', prompt: (s) => `Evidence gaps, open questions, study design. Subject: ${s} Name the concrete evidence gaps and open questions, and for each, the study design that would resolve it.` },
        ],
        footerLinks: [
          { href: '/compound', label: 'Browse compounds' },
          { href: '/reference', label: 'Reference frameworks' },
        ],
      }}
    />
  );
}
