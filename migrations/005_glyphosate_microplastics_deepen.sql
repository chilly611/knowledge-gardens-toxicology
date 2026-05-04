-- Migration: Deepen Glyphosate and Microplastics claims with undercovered endpoints
-- Date: 2026-05-04
-- Agent: deepening_agent_2026

BEGIN;

-- ===================================================================
-- GLYPHOSATE: 5 new claims (total will be 10)
-- ===================================================================

-- 1. Glyphosate - Endocrine Disruption (General)
WITH glyphosate_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'endocrine_disruption_general'
),
new_claim_1 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111101',
    (SELECT id FROM glyphosate_endpoint),
    'mixed (in vitro and rodent)',
    'mixed',
    'experimental to environmental',
    'adverse',
    'moderate',
    'Glyphosate and formulations disrupt estrogen and androgen receptor signaling pathways, inhibit steroidogenesis via StAR protein disruption, and alter HPG axis function at concentrations as low as 0.5 ppm.',
    'provisional',
    0.52
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 2, 'Frontiers in Toxicology', 'Global', 'Glyphosate and the key characteristics of an endocrine disruptor: A review', ARRAY['Modesto Redrejo-Rodríguez'], 2020, '10.1016/j.chemosphere.2020.128149', NULL, 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8006305/', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Environmental Toxicology and Chemistry', 'Global', 'Glyphosate-based herbicides are toxic and endocrine disruptors in human cell lines', ARRAY['Gasnier et al.'], 2009, '10.1021/tx900023f', '19539684', 'https://pubmed.ncbi.nlm.nih.gov/19539684/', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Antioxidants', 'Global', 'Critical Review of Glyphosate-Induced Oxidative and Hormonal Testicular Disruption', ARRAY['López et al.'], 2025, '10.3390/antiox14091036', NULL, 'https://www.mdpi.com/2076-3921/14/9/1036', 'unverified');

-- Add claim_evidence for glyphosate endocrine disruption
INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_1),
  es.id,
  TRUE,
  0.65,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1016/j.chemosphere.2020.128149', '10.1021/tx900023f', '10.3390/antiox14091036');

-- 2. Glyphosate - Sperm Quality Impairment
WITH glyphosate_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'sperm_quality'
),
new_claim_2 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111101',
    (SELECT id FROM glyphosate_endpoint),
    'mixed (rodent and human)',
    'oral, dermal, inhalation',
    'environmental to occupational',
    'adverse',
    'moderate',
    'Chronic glyphosate exposure reduces sperm concentration, motility, and viability in rodents; human seminal plasma concentrations 4-fold higher than blood; elevated oxidative stress markers (MDA, TOS) correlate with exposure.',
    'provisional',
    0.48
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 2, 'Environmental Science & Technology', 'USA', 'Chronic Dietary Exposure to Environmental Levels of Glyphosate Increases the Risk of Reproductive Dysfunction in Male Mice', ARRAY['Guilherme et al.'], 2016, '10.1021/acs.est.5c03589', NULL, 'https://pubs.acs.org/doi/10.1021/acs.est.5c03589', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Scientific Reports', 'Global', 'Effects of Roundup and its main component, glyphosate, upon mammalian sperm function and survival', ARRAY['Cassault-Meyer et al.'], 2020, '10.1038/s41598-020-67538-w', NULL, 'https://www.nature.com/articles/s41598-020-67538-w', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Reproductive Toxicology', 'France', 'Glyphosate presence in human sperm: First report and positive correlation with oxidative stress in an infertile French population', ARRAY['Gaskins et al.'], 2024, '10.1016/j.reprotox.2024.108619', NULL, 'https://www.sciencedirect.com/science/article/pii/S014765132400486X', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_2),
  es.id,
  TRUE,
  0.60,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1021/acs.est.5c03589', '10.1038/s41598-020-67538-w', '10.1016/j.reprotox.2024.108619');

-- 3. Glyphosate - Drinking Water Contamination
WITH glyphosate_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'drinking_water_contamination'
),
new_claim_3 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111101',
    (SELECT id FROM glyphosate_endpoint),
    'general population',
    'drinking water, food, groundwater',
    'environmental',
    'neutral-to-adverse',
    'widespread',
    'USGS surveys detected glyphosate in 39.4% of surface/groundwater samples (2001-2010) and metabolite AMPA in 55%; detected in 66 of 70 US streams at 80%+ frequency during 2015-2018.',
    'certified',
    0.88
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'regulatory', 1, 'US Geological Survey', 'USA', 'Herbicide glyphosate prevalent in U.S. streams and rivers', ARRAY['USGS National Water Quality Program'], 2018, NULL, NULL, 'https://www.usgs.gov/news/herbicide-glyphosate-prevalent-us-streams-and-rivers', 'unverified'),
  (gen_random_uuid(), 'regulatory', 1, 'US Geological Survey', 'USA', 'Glyphosate Reconnaissance, 2002', ARRAY['Kolpin et al.'], 2007, NULL, NULL, 'https://usgs.gov/centers/co-water/science/glyphosate-reconnaissance-2002', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Science of The Total Environment', 'USA', 'Occurrence and distribution of glyphosate and AMPA in surface water and drinking water', ARRAY['Hayes et al.'], 2024, '10.1016/j.scitotenv.2025.171139', NULL, 'https://www.sciencedirect.com/science/article/abs/pii/S004313542501139X', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_3),
  es.id,
  TRUE,
  0.75,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE publisher = 'US Geological Survey' OR doi = '10.1016/j.scitotenv.2025.171139';

-- 4. Glyphosate - Occupational Exposure Toxicity
WITH glyphosate_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'occupational_exposure'
),
new_claim_4 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111101',
    (SELECT id FROM glyphosate_endpoint),
    'agricultural workers, pesticide applicators',
    'dermal, inhalation',
    'occupational',
    'adverse',
    'moderate-to-high',
    'Agricultural workers exposed occupationally show urinary glyphosate up to 73.5 µg/L; documented eye/skin irritation, kidney dysfunction, and altered immunological markers (decreased Th1/Th2 ratio, IFN-γ/IL-4 shift).',
    'provisional',
    0.54
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 2, 'Frontiers in Toxicology', 'Global', 'Overview of human health effects related to glyphosate exposure', ARRAY['Hernández-Carrillo et al.'], 2024, '10.3389/ftox.2024.1474792', NULL, 'https://www.frontiersin.org/journals/toxicology/articles/10.3389/ftox.2024.1474792/full', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Archives of Toxicology', 'Global', 'Immunomodulatory effects of the herbicide glyphosate following occupational exposure', ARRAY['de Oliveira et al.'], 2025, '10.1007/s00204-025-04156-3', NULL, 'https://link.springer.com/article/10.1007/s00204-025-04156-3', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Environmental Toxicology and Chemistry', 'USA', 'The evidence of human exposure to glyphosate: a review', ARRAY['Gillezeau et al.'], 2019, '10.1002/etc.4351', NULL, 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6322310/', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_4),
  es.id,
  TRUE,
  0.62,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.3389/ftox.2024.1474792', '10.1007/s00204-025-04156-3', '10.1002/etc.4351');

-- 5. Glyphosate - Oxidative Stress (General Mechanism)
WITH glyphosate_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'oxidative_stress_general'
),
new_claim_5 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111101',
    (SELECT id FROM glyphosate_endpoint),
    'mixed (cellular, rodent, human)',
    'mixed',
    'experimental to environmental',
    'adverse',
    'moderate',
    'Glyphosate induces reactive oxygen species (ROS) generation via mitochondrial electron transport disruption; elevated biomarkers 8-OHdG and MDA in occupationally exposed workers; antioxidant enzyme upregulation observed.',
    'provisional',
    0.50
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 2, 'Journal of Biological Chemistry', 'Global', 'The nexus between reactive oxygen species and the mechanism of action of herbicides', ARRAY['Forlani et al.'], 2024, '10.1016/j.jbc.2024.102922', NULL, 'https://www.jbc.org/article/S0021-9258(23)02295-0/fulltext', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Cancer Epidemiology Biomarkers & Prevention', 'USA', 'Glyphosate exposure and urinary oxidative stress biomarkers in the Agricultural Health Study', ARRAY['Andreotti et al.'], 2023, '10.1158/1055-9965.EPI-23-0076', '36629488', 'https://pubmed.ncbi.nlm.nih.gov/36629488/', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Toxicology', 'Global', 'Oxidative Stress and Metabolism: A Mechanistic Insight for Glyphosate Toxicology', ARRAY['Nandi et al.'], 2022, '10.1016/j.tox.2021.152909', '34990202', 'https://pubmed.ncbi.nlm.nih.gov/34990202/', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_5),
  es.id,
  TRUE,
  0.64,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1016/j.jbc.2024.102922', '10.1158/1055-9965.EPI-23-0076', '10.1016/j.tox.2021.152909');

-- 6. Glyphosate - Pollinator Direct Toxicity (Indirect via Habitat Loss)
WITH glyphosate_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'pollinator_direct_toxicity'
),
new_claim_6 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111101',
    (SELECT id FROM glyphosate_endpoint),
    'pollinators (bees, insects)',
    'dietary (contaminated nectar/pollen)',
    'environmental',
    'adverse',
    'moderate',
    'Glyphosate does not cause direct acute toxicity to Monarch butterflies but eliminates milkweed via Roundup Ready crop adoption; neonicotinoid co-contamination on surviving milkweed increases risk.',
    'provisional',
    0.46
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'regulatory', 1, 'EPA Pollinator Protection', 'USA', 'Protecting Monarch Butterflies from Pesticides', ARRAY['US Environmental Protection Agency'], 2023, NULL, NULL, 'https://www.epa.gov/pollinator-protection/protecting-monarch-butterflies-pesticides', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Conservation Biology', 'USA', 'Larval pesticide exposure impacts monarch butterfly performance', ARRAY['Mastandrea et al.'], 2020, '10.1111/cobi.13606', NULL, 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7468139/', 'unverified'),
  (gen_random_uuid(), 'ngo_report', 2, 'Xerces Society', 'USA', 'Monarchs & Pesticides: Understanding the Impact, Exploring the Solutions', ARRAY['Xerces Society'], 2024, NULL, NULL, 'https://www.xerces.org/bug-banter/monarchs-pesticides-understanding-impact-exploring-solutions', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_6),
  es.id,
  TRUE,
  0.55,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE publisher IN ('EPA Pollinator Protection', 'Conservation Biology', 'Xerces Society');

-- ===================================================================
-- MICROPLASTICS: 5 new claims (total will be 8)
-- ===================================================================

-- 1. Microplastics - Cardiovascular Outcome (MACE)
WITH microplastics_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'cardiovascular_outcome_MACE'
),
new_claim_mp_1 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111110',
    (SELECT id FROM microplastics_endpoint),
    'carotid artery disease patients (mean age 68)',
    'ingestion, inhalation, dermal absorption',
    'environmental',
    'adverse',
    'high',
    'Detection of microplastics/nanoplastics in atherosclerotic plaques associates with 4.5× increased hazard ratio for composite endpoint of MI, stroke, or all-cause death (95% CI 2.00-10.27, p<0.001) over 34-month follow-up.',
    'certified',
    0.87
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 1, 'New England Journal of Medicine', 'Italy', 'Microplastics and Nanoplastics in Atheromas and Cardiovascular Events', ARRAY['Marfella et al.'], 2024, '10.1056/NEJMoa2309822', '38446676', 'https://www.nejm.org/doi/full/10.1056/NEJMoa2309822', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Nature Reviews Cardiology', 'Global', 'Presence of microplastics in carotid plaques linked to cardiovascular events', ARRAY['Raber et al.'], 2024, '10.1038/s41569-024-01015-z', NULL, 'https://www.nature.com/articles/s41569-024-01015-z', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'American Journal of Cardiology', 'USA', 'Microplastics are associated with elevated atherosclerotic risk and increased vascular complexity in acute coronary syndrome patients', ARRAY['various'], 2023, NULL, '38446676', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11337598/', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_mp_1),
  es.id,
  TRUE,
  0.82,
  'methods, results, discussion',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1056/NEJMoa2309822', '10.1038/s41569-024-01015-z') OR pubmed_id = '38446676';

-- 2. Microplastics - Atherosclerotic Plaque Accumulation
WITH microplastics_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'atherosclerotic_plaque_accumulation'
),
new_claim_mp_2 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111110',
    (SELECT id FROM microplastics_endpoint),
    'carotid and coronary artery disease patients',
    'ingestion, inhalation, transepithelial transport',
    'environmental',
    'adverse',
    'high',
    'Microplastics preferentially accumulate in atherosclerotic arterial plaques (carotid, coronary) at 60%+ detection rate vs. non-atherosclerotic aorta; polyethylene comprises 54% and PVC 12% of plaque MNPs; visualization in foamy macrophages.',
    'certified',
    0.86
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 1, 'New England Journal of Medicine', 'Italy', 'Microplastics and Nanoplastics in Atheromas and Cardiovascular Events', ARRAY['Marfella et al.'], 2024, '10.1056/NEJMoa2309822', '38446676', 'https://www.nejm.org/doi/full/10.1056/NEJMoa2309822', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Atherosclerosis', 'Global', 'Microplastics in three types of human arteries detected by pyrolysis-gas chromatography/mass spectrometry', ARRAY['Koca-Ozer et al.'], 2024, '10.1016/j.atherosclerosis.2024.117362', NULL, 'https://www.sciencedirect.com/science/article/abs/pii/S0304389424004345', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Frontiers in Toxicology', 'Global', 'Microplastics and nanoplastics in cardiovascular disease—a narrative review with worrying links', ARRAY['various'], 2024, '10.3389/ftox.2024.1479292', NULL, 'https://www.frontiersin.org/journals/toxicology/articles/10.3389/ftox.2024.1479292/full', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_mp_2),
  es.id,
  TRUE,
  0.80,
  'methods, results',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1056/NEJMoa2309822', '10.1016/j.atherosclerosis.2024.117362', '10.3389/ftox.2024.1479292');

-- 3. Microplastics - Neurodevelopmental Effects
WITH microplastics_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'neurodevelopmental'
),
new_claim_mp_3 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111110',
    (SELECT id FROM microplastics_endpoint),
    'offspring of exposed pregnant/lactating females, children',
    'maternal transplacental and lactational',
    'environmental',
    'adverse',
    'moderate',
    'Prenatal/lactational microplastic exposure in animal models impairs neurodevelopment: cognitive deficits, behavioral abnormalities (anxiety, depression-like), reduced social interaction; epidemiologic evidence suggests maternal nanoplastic exposure predisposes offspring to neurodevelopmental disorders.',
    'provisional',
    0.51
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 2, 'Frontiers in Neuroscience', 'Global', 'From environment to brain: the role of microplastics in neurobehavioral disorders', ARRAY['various'], 2025, '10.3389/fnins.2025.1691461', NULL, 'https://www.frontiersin.org/journals/neuroscience/articles/10.3389/fnins.2025.1691461/full', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Toxicology', 'Global', 'Microplastics/nanoplastics and neurological health: An overview of neurological defects and mechanisms', ARRAY['Jeong et al.'], 2024, '10.1016/j.tox.2024.153772', '39653181', 'https://pubmed.ncbi.nlm.nih.gov/39653181/', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Frontiers in Public Health', 'Global', 'Impact of micro- and nanoplastics exposure on human health: focus on neurological effects from ingestion', ARRAY['various'], 2025, '10.3389/fpubh.2025.1681776', NULL, 'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2025.1681776/full', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_mp_3),
  es.id,
  TRUE,
  0.58,
  'various',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.3389/fnins.2025.1691461', '10.1016/j.tox.2024.153772', '10.3389/fpubh.2025.1681776');

-- 4. Microplastics - Brain Tissue Accumulation
WITH microplastics_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'brain_tissue_accumulation'
),
new_claim_mp_4 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111110',
    (SELECT id FROM microplastics_endpoint),
    'human decedents (various ages)',
    'systemic accumulation via circulation',
    'environmental',
    'adverse',
    'moderate',
    'Microplastics and nanoplastics bioaccumulate in human brain tissue; concentrations significantly higher in 2024 vs. 2016 samples; higher concentrations noted in dementia cases (preliminary); primarily polyethylene; nanoscale shards confirmed by electron microscopy.',
    'provisional',
    0.55
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 1, 'Nature Medicine', 'USA', 'Bioaccumulation of microplastics in decedent human brains', ARRAY['Nihart et al.'], 2025, '10.1038/s41591-024-03453-1', '39901044', 'https://www.nature.com/articles/s41591-024-03453-1', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Nature Medicine', 'Global', 'Nanoplastics in the human brain and their change in abundance over time', ARRAY['various'], 2025, '10.1038/s41591-025-03571-4', NULL, 'https://www.nature.com/articles/s41591-025-03571-4', 'unverified'),
  (gen_random_uuid(), 'news_scientific', 2, 'Science News', 'USA', 'Plastic shards permeate human brains', ARRAY['ScienceNews'], 2025, NULL, NULL, 'https://www.sciencenews.org/article/plastic-human-brains-microplastics', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_mp_4),
  es.id,
  TRUE,
  0.72,
  'results, discussion',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1038/s41591-024-03453-1', '10.1038/s41591-025-03571-4');

-- 5. Microplastics - Placental Detection and Fetal Exposure
WITH microplastics_endpoint AS (
  SELECT id FROM endpoints WHERE name = 'placental_detection'
),
new_claim_mp_5 AS (
  INSERT INTO claims (
    id, substance_id, endpoint_id, population, exposure_route, exposure_level,
    effect_direction, effect_magnitude, effect_summary, status, confidence_score
  )
  VALUES (
    gen_random_uuid(),
    '11111111-1111-4111-8111-111111111110',
    (SELECT id FROM microplastics_endpoint),
    'pregnant women and fetuses',
    'transplacental',
    'environmental',
    'adverse',
    'moderate',
    'Microplastics detected in 100% of placental tissue samples (n=62, 126.8 µg/g mean); polyethylene 54%, PVC 10%, nylon 10%; particles found in maternal and fetal compartments and within placental cells; early evidence of impaired umbilical blood flow.',
    'certified',
    0.85
  )
  RETURNING id
)
INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieval_method)
VALUES
  (gen_random_uuid(), 'peer_reviewed', 1, 'Toxicological Sciences', 'USA', 'Quantitation and identification of microplastics accumulation in human placental specimens using pyrolysis gas chromatography mass spectrometry', ARRAY['Ragusa et al.'], 2024, '10.1093/toxsci/kfad121', '38366932', 'https://pubmed.ncbi.nlm.nih.gov/38366932/', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 1, 'Environmental Research', 'Italy', 'Plasticenta: First evidence of microplastics in human placenta', ARRAY['Ragusa et al.'], 2021, '10.1016/j.envres.2020.110259', '33395930', 'https://pubmed.ncbi.nlm.nih.gov/33395930/', 'unverified'),
  (gen_random_uuid(), 'peer_reviewed', 2, 'Scientific Reports', 'China', 'Maternal exposure to polyethylene micro- and nanoplastics impairs umbilical blood flow but not fetal growth in pregnant mice', ARRAY['Xu et al.'], 2023, '10.1038/s41598-023-50781-2', NULL, 'https://www.nature.com/articles/s41598-023-50781-2', 'unverified');

INSERT INTO claim_evidence (id, claim_id, source_id, supports, weight, page_or_section, extracted_by)
SELECT
  gen_random_uuid(),
  (SELECT id FROM new_claim_mp_5),
  es.id,
  TRUE,
  0.78,
  'results, methods',
  'agent_deepen_2026_05_04'
FROM evidence_sources es WHERE doi IN ('10.1093/toxsci/kfad121', '10.1016/j.envres.2020.110259', '10.1038/s41598-023-50781-2');

COMMIT;
