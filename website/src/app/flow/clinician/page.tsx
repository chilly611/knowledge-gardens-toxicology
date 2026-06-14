'use client';

/**
 * /flow/clinician — the Clinician Killer App (AI tox consult).
 * The form-wizard is gone; this is the situation-driven workspace.
 */
import SituationWorkspace from '@/components/flow/SituationWorkspace';

export default function ClinicianKillerApp() {
  return (
    <SituationWorkspace
      config={{
        lane: 'clinician',
        eyebrow: 'Clinician workspace · exposure consult',
        title: 'Workup a panel.',
        deliverable: 'Clinical Exposure Brief',
        deliverableSub: 'Two pages, chart-ready — minutes vs. an afternoon in PubMed',
        inputLabel: 'Describe the patient & suspected exposure',
        placeholder: 'e.g., 58-y-o agricultural worker, chronic dermatitis + persistent GI symptoms, suspected glyphosate / pesticide exposure',
        defaultSituation: 'A 58-year-old agricultural worker presents with chronic dermatitis and persistent GI symptoms; suspected glyphosate and pesticide exposure.',
        takeLabel: 'AI take · clinician lane',
        takePrompt: (s) =>
          `Glyphosate, PCBs, dioxins, pesticides, biomarkers, non-Hodgkin lymphoma, mechanism. Clinical exposure consult. Patient: ${s} Give a tight read: the most likely exposure-linked differential, the biomarker panel to order, red flags and when to escalate, and where the evidence is contested vs. certified. Decision-support only — flag that it must be verified against primary sources.`,
        presets: [
          { label: 'Ag worker · dermatitis + GI', situation: 'Agricultural worker with chronic dermatitis and persistent GI symptoms; suspected glyphosate / pesticide exposure.' },
          { label: 'NHL workup · PCB exposure', situation: 'Adult with non-Hodgkin lymphoma and a history of PCB / dioxin exposure near an industrial site.' },
          { label: 'Pediatric neurodevelopment', situation: 'Pediatric patient with neurodevelopmental concerns; possible prenatal PCB / methylmercury exposure.' },
        ],
        moves: [
          { key: 'differential', title: 'Differential by exposure', sub: 'Exposure-linked conditions, ranked', prompt: (s) => `Glyphosate, PCBs, dioxins, biomarkers, mechanism. For this patient — ${s} — give the exposure-linked differential, ranked, with the mechanism behind each.` },
          { key: 'panel', title: 'Biomarker panel to order', sub: 'What to test, and why', prompt: (s) => `PCBs, glyphosate, biomarkers, serum congeners, urinary metabolites. For this patient — ${s} — list the biomarker panel to order, with the rationale and reference ranges where known.` },
          { key: 'redflags', title: 'Red flags & escalation', sub: 'When this needs urgent action', prompt: (s) => `For this patient — ${s} — list the red-flag findings that warrant urgent escalation or specialist referral.` },
          { key: 'contested', title: 'Both sides of contested claims', sub: 'Where the evidence disagrees', prompt: (s) => `PCBs, glyphosate, carcinogenicity, non-Hodgkin lymphoma. For this patient — ${s} — surface the contested claims: certified vs. contested, with the evidence tier on each side.` },
        ],
        footerLinks: [
          { href: '/compound', label: 'Browse compounds' },
          { href: '/reference', label: 'Reference frameworks' },
        ],
      }}
    />
  );
}
