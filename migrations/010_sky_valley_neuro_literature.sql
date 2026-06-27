-- Sky Valley PCB Case — Adult Neurocognitive Literature Integration
-- Applied to TOX project (tkhlxbdviiqivenpkhmc / knowledge-gardens-prod schema mirror)
-- Date: 2026-06-27
--
-- PURPOSE
-- Folds four newly-supplied studies into the live Toxicology Knowledge Garden in
-- support of the Sky Valley brain-injury reframe (Erickson/Marquardt/Kalmanir v.
-- Monsanto — adult teachers, chronic indoor PCB exposure, neurological injury).
--
-- The existing PCB record only carried a PRENATAL neurodevelopmental claim
-- (claim cccccccc-…-103). The Sky Valley plaintiffs are ADULTS, so this migration
-- adds the missing adult-onset endpoint and a dedicated, evidence-backed claim:
--
--   * NEW endpoint  : adult_cognitive_decline (neurotoxicity)
--   * NEW claim     : PCBs × adult cognitive decline / dementia
--   * 3 PCB epidemiology sources (Raffetti 2020, Sasaki 2023, Pan 2022)
--   * 1 mechanistic / endpoint-selection source (Toller 2022 — NOT PCB-specific;
--     flagged honestly as a neuroanatomical white-matter substrate reference)
--   * 4 literature exhibits attached to the Sky Valley docket (case_documents)
--
-- status + confidence_score on the claim are recomputed automatically by
-- trigger_recompute_confidence (AFTER INSERT ON claim_evidence) — never set here.
--
-- Idempotent: safe to re-run (ON CONFLICT DO NOTHING throughout).

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. New neurotoxicity endpoint: adult-onset cognitive decline / dementia
-- ---------------------------------------------------------------------------
INSERT INTO endpoints (id, category, name, description, applies_to)
VALUES (
  'a1b2c3d4-0000-4000-8000-000000000001',
  'neurotoxicity',
  'adult_cognitive_decline',
  'Cognitive decline, executive-function/memory deficits, and incident dementia in adults from chronic environmental, dietary, or occupational exposure (distinct from prenatal neurodevelopmental effects).',
  '{"PCBs"}'
)
ON CONFLICT (name) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 2. New claim: PCBs × adult cognitive decline / dementia
-- ---------------------------------------------------------------------------
INSERT INTO claims (
  id, substance_id, endpoint_id, population, exposure_route,
  exposure_level, effect_direction, effect_magnitude, effect_summary, status, notes
)
VALUES (
  'cccccccc-cccc-cccc-cccc-000000000150',
  '11111111-1111-4111-8111-111111111201',           -- Polychlorinated biphenyls (PCBs)
  'a1b2c3d4-0000-4000-8000-000000000001',           -- adult_cognitive_decline
  'Adults with chronic environmental, dietary, or occupational PCB exposure (cohorts aged ~47–90)',
  'oral, inhalation (diet, ambient/indoor air, occupational)',
  'Serum/plasma body burden — population tertiles to highly-exposed cohorts',
  'positive_association',
  'Dementia RR up to 4.35 (highest serum-PCB tertile, Brescia-Caffaro cohort); ~4-point DSST executive-function decrement per quartile increase in the PCB-pesticide mixture among adults 47–79; direct effect of PCB28 on cognitive dysfunction (path factor load 0.670) in older women.',
  'In adults, elevated PCB body burden is associated with accelerated cognitive decline and incident dementia, independent of prenatal exposure. A prospective cohort in the Brescia-Caffaro contaminated area found a dose-dependent rise in dementia risk (RR 2.30 and 4.35 for the 2nd and 3rd serum-PCB tertiles) dominated by a direct neuronal pathway rather than hypertension mediation. Cross-sectional mixture and structural-equation analyses in the Akwesasne Mohawk and Chinese elderly populations confirm PCB-attributable executive-function and memory deficits in older adults. The neuroanatomical substrate for such decline (white-matter tract integrity) is well characterized in aging and neurodegeneration.',
  'provisional',
  'Adult-onset endpoint, distinct from the prenatal neurodevelopmental claim (cccccccc-…-103). Directly supports the Sky Valley brain-injury causation theory: adult teachers with chronic indoor PCB exposure. Toller 2022 is a mechanistic/endpoint-selection reference (neuroimaging of cognitive decline) and is NOT PCB-specific.'
)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 3. Evidence sources (the four supplied studies)
-- ---------------------------------------------------------------------------
INSERT INTO evidence_sources (
  id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, url,
  retrieval_method, notes
)
VALUES
  -- Raffetti 2020 — prospective population cohort, dose-response, incident dementia
  (
    'd5000000-0000-4000-8000-000000000001',
    'peer_reviewed', 3, 'Chemosphere', NULL,
    'Polychlorinated biphenyls (PCBs) and risk of dementia and Parkinson disease: A population-based cohort study in a North Italian highly polluted area',
    '{"Raffetti E","Donato F","De Palma G","Leonardi L","Sileo C","Magoni M"}',
    2020, '10.1016/j.chemosphere.2020.127522', 'https://doi.org/10.1016/j.chemosphere.2020.127522',
    'manual',
    'Strongest source on the adult endpoint: prospective Brescia-Caffaro cohort (n=699, mean follow-up 8.8 yrs). Dose-response across serum-PCB tertiles; mediation analysis shows a direct neuronal pathway (not hypertension-mediated). Parkinson estimates were inconclusive.'
  ),
  -- Sasaki 2023 — cross-sectional mixture (quantile g-computation), executive function
  (
    'd5000000-0000-4000-8000-000000000002',
    'peer_reviewed', 3, 'International Journal of Environmental Research and Public Health', NULL,
    'Mixture Effects of Polychlorinated Biphenyls (PCBs) and Three Organochlorine Pesticides on Cognitive Function in Mohawk Adults at Akwesasne',
    '{"Sasaki N","Jones LE","Morse GS","Carpenter DO"}',
    2023, '10.3390/ijerph20021148', 'https://doi.org/10.3390/ijerph20021148',
    'manual',
    'Akwesasne Mohawk adults (n=301). Quantile g-computation mixture model; PCB congener groups dominate the mixture weight for DSST decline in the oldest age group (47–79). Co-author David O. Carpenter is a PCB neurotoxicity authority.'
  ),
  -- Pan 2022 — cross-sectional path analysis (SEM), single-congener direct effect
  (
    'd5000000-0000-4000-8000-000000000003',
    'peer_reviewed', 3, 'International Journal of Environmental Research and Public Health', NULL,
    'Path Analysis Reveals the Direct Effect of PCB28 Exposure on Cognitive Dysfunction in Older Chinese Females',
    '{"Pan C","Zhao H","Du Q","Xu Y","Tian D","Xiao S","Wang H","Wei X","Wu C","Ruan Y","Zhao C","Tao G","Zheng W"}',
    2022, '10.3390/ijerph19126958', 'https://doi.org/10.3390/ijerph19126958',
    'manual',
    'Weitang (China) elderly cohort (n=266). SEM path analysis isolates a DIRECT effect of PCB28 on cognitive dysfunction (factor load 0.670) in females aged ≤80. Caveat: single congener, cross-sectional, low overall detection rates, sex-specific — lower evidentiary weight.'
  ),
  -- Toller 2022 — mechanistic / neuroanatomical substrate (NOT a PCB study)
  (
    'd5000000-0000-4000-8000-000000000004',
    'peer_reviewed', 3, 'NeuroImage: Clinical', NULL,
    'Right uncinate fasciculus supports socioemotional sensitivity in health and neurodegenerative disease',
    '{"Toller G","Mandelli ML","Cobigo Y","Rosen HJ","Kramer JH","Miller BL","Gorno-Tempini ML","Rankin KP"}',
    2022, '10.1016/j.nicl.2022.102994', 'https://doi.org/10.1016/j.nicl.2022.102994',
    'manual',
    'NOT A PCB STUDY. Diffusion-weighted imaging in 145 adults (healthy aging + frontotemporal lobar degeneration). Establishes that white-matter tract (uncinate fasciculus) integrity supports socioemotional/cognitive function and informs neuroimaging endpoint selection. Included strictly as a mechanistic / neuroanatomical-substrate reference for the brain-injury theory.'
  )
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 4. Link sources to the claim (trigger recomputes confidence + status)
-- ---------------------------------------------------------------------------
INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
  (
    'cccccccc-cccc-cccc-cccc-000000000150',
    'd5000000-0000-4000-8000-000000000001',
    TRUE, 0.88,
    'Subjects in the 2nd and 3rd tertiles of the total PCBs distribution, compared with those in the 1st tertile, had a higher risk of dementia (RR = 2.30 and RR = 4.35)... the association between PCB exposure and dementia was dominated by the direct pathway and not by the hypertension-mediated pathway.',
    'Abstract; Results, Table 2; Mediation analysis',
    'manual_2026-06-27'
  ),
  (
    'cccccccc-cccc-cccc-cccc-000000000150',
    'd5000000-0000-4000-8000-000000000002',
    TRUE, 0.80,
    'The mixture effects of low-chlorinated PCBs, high-chlorinated PCBs, HCB, DDE, and mirex were significantly associated with 4.01 DSST scores decrements in the oldest age group, 47-79 years old.',
    'Abstract; Table 4; Figure 3',
    'manual_2026-06-27'
  ),
  (
    'cccccccc-cccc-cccc-cccc-000000000150',
    'd5000000-0000-4000-8000-000000000003',
    TRUE, 0.62,
    'After adjusting for the co-exposures and confounders, exposure to PCB28 can directly increase the risk of cognitive impairment in older Chinese females... with a factor load of 0.670.',
    'Abstract; Section 3.4 Path analyses',
    'manual_2026-06-27'
  ),
  (
    'cccccccc-cccc-cccc-cccc-000000000150',
    'd5000000-0000-4000-8000-000000000004',
    TRUE, 0.40,
    'FA in the right but not left UF significantly predicted RSMS score in the full sample... better socioemotional sensitivity is specifically supported by right UF white matter, highlighting a key neuro-affective relationship found in both healthy aging and neurologically affected individuals.',
    'Abstract — neuroanatomical substrate / endpoint selection; NOT PCB-specific',
    'manual_2026-06-27'
  )
ON CONFLICT (claim_id, source_id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- 5. Attach the four studies to the Sky Valley docket as literature exhibits
-- ---------------------------------------------------------------------------
INSERT INTO case_documents (id, case_id, title, doc_type, document_date, source_url, notes, demo_safe)
VALUES
  (
    'd0c00000-0000-4000-8000-000000000001',
    '55555555-5555-4555-8555-000000000001',
    'Literature Exhibit — Raffetti et al. (2020): PCBs and risk of dementia (Brescia-Caffaro cohort)',
    'exhibit', '2020-07-04', 'https://doi.org/10.1016/j.chemosphere.2020.127522',
    'General-causation literature for the adult brain-injury theory. Prospective cohort; dose-dependent dementia risk (RR up to 4.35) dominated by a direct neuronal pathway. Chemosphere 261:127522.',
    TRUE
  ),
  (
    'd0c00000-0000-4000-8000-000000000002',
    '55555555-5555-4555-8555-000000000001',
    'Literature Exhibit — Sasaki et al. (2023): PCB mixture effects on cognition in Mohawk adults',
    'exhibit', '2023-01-09', 'https://doi.org/10.3390/ijerph20021148',
    'General-causation literature. Quantile g-computation mixture model; PCB congener groups drive a 4.01-point DSST executive-function decrement in adults 47-79. Co-authored by PCB authority D.O. Carpenter. IJERPH 20(2):1148.',
    TRUE
  ),
  (
    'd0c00000-0000-4000-8000-000000000003',
    '55555555-5555-4555-8555-000000000001',
    'Literature Exhibit — Pan et al. (2022): Direct effect of PCB28 on cognitive dysfunction',
    'exhibit', '2022-06-07', 'https://doi.org/10.3390/ijerph19126958',
    'General-causation literature. SEM path analysis isolates a direct PCB28 → cognitive-dysfunction effect (factor load 0.670) in older women. Single-congener / cross-sectional caveats noted. IJERPH 19(12):6958.',
    TRUE
  ),
  (
    'd0c00000-0000-4000-8000-000000000004',
    '55555555-5555-4555-8555-000000000001',
    'Literature Exhibit — Toller et al. (2022): Uncinate fasciculus white-matter substrate of cognition',
    'exhibit', '2022-03-23', 'https://doi.org/10.1016/j.nicl.2022.102994',
    'Mechanistic / neuroimaging endpoint-selection reference (NOT PCB-specific). DWI shows right uncinate fasciculus integrity supports socioemotional/cognitive function in aging and neurodegeneration — neuroanatomical basis for measurable brain injury. NeuroImage: Clinical 34:102994.',
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

COMMIT;
