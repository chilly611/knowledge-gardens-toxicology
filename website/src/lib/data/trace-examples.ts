/**
 * Curated trace examples — maps (substance, endpoint) pairs to daily-life
 * touchpoints and mitigation tips. Falls back to placeholder for unknown claims.
 *
 * Used by the "trace" stage of consumer/clinician/counsel flows.
 */
import type { CertifiedClaimRow } from '@/lib/types-tox';

export interface TraceExample {
  context: string;
  tips: string[];
}

/**
 * Look up trace examples for a given claim. Returns curated copy mapping
 * the substance × endpoint to daily-life contexts and 3 actionable tips.
 */
export function getTraceExamples(claim: CertifiedClaimRow): TraceExample {
  const key = `${claim.substance_name}|${claim.endpoint_name}`.toLowerCase();

  const examples: Record<string, TraceExample> = {
    // Glyphosate claims
    'glyphosate|shikimate_pathway_inhibition': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Choose organic fruits and vegetables when possible to reduce residue exposure.',
        'Rinse conventional produce thoroughly under running water before eating.',
        'Avoid using Roundup or glyphosate herbicides in home gardens.',
      ],
    },
    'glyphosate|non_hodgkin_lymphoma': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Minimize skin contact with treated lawns and agricultural areas after spraying.',
        'Wash clothing separately if exposed to farm or treated landscape environments.',
        'Consider using organic alternatives for garden weed control.',
      ],
    },
    'glyphosate|soil_persistence': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Let treated soil rest for several weeks before planting edible crops.',
        'Test soil for residual herbicides before establishing food gardens.',
        'Rotate crops in previously treated areas to reduce bioaccumulation risk.',
      ],
    },
    'glyphosate|aquatic_acute_toxicity': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Avoid spraying near waterways, storm drains, or areas that drain to water.',
        'Use buffer zones of at least 25 feet between herbicide application and water sources.',
        'Choose mechanical weed control methods near ponds, streams, or wetlands.',
      ],
    },
    'glyphosate|gut_microbiome_disruption': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Eat probiotic-rich foods like yogurt, sauerkraut, and kombucha regularly.',
        'Choose organic grains and legumes when budget allows to reduce residue intake.',
        'Limit processed foods that often contain glyphosate residues.',
      ],
    },

    // Microplastics claims
    'microplastics|bioaccumulation': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Carry a reusable stainless steel or glass water bottle instead of buying bottled water.',
        'Refill from filtered tap water or fountain water when available.',
        'Avoid heating food or liquids in plastic containers, especially in microwave.',
      ],
    },
    'microplastics|seafood_contamination': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Choose whole fish over shellfish when possible, as shells concentrate microplastics.',
        'Reduce consumption of mussels, oysters, and clams which filter large water volumes.',
        'Rinse and cook seafood thoroughly to minimize ingestion of internal particles.',
      ],
    },
    'microplastics|respiratory_exposure': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Wash synthetic clothing before first wear and after frequent use to shed fibers.',
        'Air out polyester clothing and fabrics in well-ventilated spaces before wearing.',
        'Choose natural fiber clothing (cotton, wool, linen) when budget permits.',
      ],
    },

    // Polyethylene/PET claims
    'polyethylene_terephthalate|endocrine_disruption': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Avoid refilling single-use PET bottles; use glass or stainless steel instead.',
        'Do not heat food in PET containers or expose to direct sunlight.',
        'Choose glass or aluminum containers for hot beverages and food storage.',
      ],
    },
    'polycarbonate|bisphenol_a_leaching': {
      context: 'Where this shows up in daily life:',
      tips: [
        'Replace polycarbonate water bottles with glass, steel, or BPA-free alternatives.',
        'Avoid washing polycarbonate food containers in hot water or dishwasher.',
        'Choose stainless steel baby bottles and sippy cups over polycarbonate versions.',
      ],
    },
  };

  const found = examples[key];
  if (found) return found;

  // Fallback for unknown claims
  return {
    context: 'Where this shows up in daily life:',
    tips: [
      'Learn more about typical exposure routes and daily sources of this substance.',
      'Consult product labels and environmental reports for specific guidance.',
      'Speak with healthcare providers about personalized exposure reduction strategies.',
    ],
  };
}
