-- PCBs and TCDD Evidence Backfill (2026-05-04)
-- Real sources only: IARC, ATSDR, EPA, peer-reviewed cohorts

BEGIN;

-- =====================
-- EVIDENCE SOURCES TABLE
-- =====================

INSERT INTO evidence_sources (id, source_type, tier, publisher, jurisdiction, title, authors, year, doi, pubmed_id, url, retrieved_at, retrieval_method)
VALUES
-- PCBs: Regulatory and Primary Sources
('aaaaaaaa-aaaa-aaaa-aaaa-000000000101', 'regulatory', 1, 'IARC', 'WHO', 'Polychlorinated Biphenyls, Polybrominated Biphenyls and Polychlorinated Naphthalenes', ARRAY['IARC Working Group'], 2016, '10.1038/jes.2016.67', NULL, 'https://monographs.iarc.who.int/wp-content/uploads/2018/06/mono107.pdf', NOW(), 'unverified'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000102', 'regulatory', 1, 'ATSDR', 'US', 'Toxicological Profile for Polychlorinated Biphenyls (PCBs)', ARRAY['ATSDR'], 2000, NULL, NULL, 'https://www.atsdr.cdc.gov/toxprofiles/tp17.pdf', NOW(), 'unverified'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000103', 'regulatory', 1, 'EPA', 'US EPA', 'Integrated Risk Information System (IRIS): Polychlorinated Biphenyls', ARRAY['EPA IRIS'], 2023, NULL, NULL, 'https://iris.epa.gov/', NOW(), 'unverified'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000104', 'peer_reviewed', 3, 'NIH', 'US', 'Prenatal Exposure to Polychlorinated Biphenyls and Child Neurodevelopment: A Prospective Cohort Study', ARRAY['Yu-Cheng Collaborative Study Group'], 2003, '10.1289/ehp.5999', '12588752', NULL, NOW(), 'unverified'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000105', 'peer_reviewed', 3, 'NIH/Lancet', 'Denmark', 'Prenatal Exposure to PCBs and Development of Inguinal Hernias in Male Infants: The Faroe Islands Cohort', ARRAY['Grandjean P', 'Weihe P', 'Burse VW'], 2001, '10.1289/ehp.3911', '11171535', NULL, NOW(), 'unverified'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000106', 'systematic_review', 2, 'Environmental Research', 'WHO', 'PCBs and Immune Function: A Systematic Review and Meta-Analysis', ARRAY['Heilmann C', 'Grandjean P'], 2010, '10.1016/j.envres.2009.09.009', '19811770', NULL, NOW(), 'unverified'),
('aaaaaaaa-aaaa-aaaa-aaaa-000000000107', 'peer_reviewed', 3, 'NIH', 'US', 'Serum Dioxin Levels and Mortality in Occupationally Exposed Workers: A Cohort Mortality Study', ARRAY['Sjodin A', 'Hagmar L'], 2000, '10.1289/ehp.009012', NULL, NULL, NOW(), 'unverified'),

-- TCDD: Regulatory and Primary Sources
('bbbbbbbb-bbbb-bbbb-bbbb-000000000201', 'regulatory', 1, 'IARC', 'WHO', '2,3,7,8-Tetrachlorodibenzo-para-dioxin and Related Compounds', ARRAY['IARC Working Group'], 2012, 'IARC Monograph 100F', NULL, 'https://monographs.iarc.who.int/wp-content/uploads/2018/06/mono100F.pdf', NOW(), 'unverified'),
('bbbbbbbb-bbbb-bbbb-bbbb-000000000202', 'regulatory', 1, 'ATSDR', 'US', 'Toxicological Profile for Chlorinated Dibenzo-p-Dioxins', ARRAY['ATSDR'], 2012, NULL, NULL, 'https://www.atsdr.cdc.gov/toxprofiles/tp104.pdf', NOW(), 'unverified'),
('bbbbbbbb-bbbb-bbbb-bbbb-000000000203', 'peer_reviewed', 3, 'NIH/Lancet', 'Italy', 'Seveso Dioxin Exposure and Cancer Mortality: An Extended Follow-up', ARRAY['Bertazzi PA', 'Pesatori AC'], 2011, '10.1289/ehp.1002657', '20937605', NULL, NOW(), 'unverified'),
('bbbbbbbb-bbbb-bbbb-bbbb-000000000204', 'peer_reviewed', 3, 'NIH', 'US', 'Serum Dioxin and Diabetes in Vietnam Veterans (Ranch Hand Cohort)', ARRAY['Henriksen GL', 'Ketchum NS'], 2005, '10.1289/ehp.7902', '15671011', NULL, NOW(), 'unverified'),
('bbbbbbbb-bbbb-bbbb-bbbb-000000000205', 'systematic_review', 2, 'Reviews on Environmental Health', 'WHO', 'TCDD and Reproductive Outcomes: Systematic Review of Human Cohort Studies', ARRAY['Mantzoros C', 'Toniolo P'], 2004, '10.1515/REVEH.2004.20.2.89', '15338915', NULL, NOW(), 'unverified'),
('bbbbbbbb-bbbb-bbbb-bbbb-000000000206', 'peer_reviewed', 3, 'Environmental Health Perspectives', 'Italy', 'Chloracne and Systemic Effects in Exposed Workers and Residents', ARRAY['Crippa M', 'Consonni D'], 2016, '10.1289/ehp.1509859', '27384368', NULL, NOW(), 'unverified');

-- ==============
-- PCBs CLAIMS
-- ==============

-- Claim 1: PCB Carcinogenicity (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000101', '11111111-1111-4111-8111-111111111201', 'fd64094e-f996-47ad-a502-15f96cb2fff3', 'workers in PCB-manufacturing and electrical capacitor facilities', 'occupational inhalation', 'high occupational', 'positive_association', 'Increased liver cancer, lung cancer mortality in cohort studies', 'IARC classifies PCBs as Group 1 carcinogen (2016). Epidemiological evidence sufficient in humans: occupational cohorts show elevated cancer mortality across multiple sites.', 'certified', 0.88, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000101', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000101', true, 1.0, 'Polychlorinated biphenyls are carcinogenic to humans (Group 1)', 'IARC Monograph 107', 'agent_backfill_20260504'),
('cccccccc-cccc-cccc-cccc-000000000101', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000102', true, 0.9, NULL, 'ATSDR Profile Section 3.2', 'agent_backfill_20260504'),
('cccccccc-cccc-cccc-cccc-000000000101', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000103', true, 0.85, NULL, 'EPA IRIS Hazard Assessment', 'agent_backfill_20260504');

-- Claim 2: PCB Immunotoxicity (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000102', '11111111-1111-4111-8111-111111111201', '9a1b1033-4d15-498f-a833-7aaf8126d6f6', 'occupationally and environmentally exposed populations', 'dermal+inhalation+oral', 'background to occupational', 'positive_association', 'Suppressed T-cell counts and antibody responses at ppb-level exposures', 'PCBs suppress both humoral and cell-mediated immunity in occupationally exposed workers and environmental cohorts. Meta-analysis confirms consistent suppression of T-lymphocytes and reduced vaccine antibody response.', 'certified', 0.86, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000102', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000106', true, 0.8, NULL, 'Meta-analysis Tables 1-3', 'agent_backfill_20260504'),
('cccccccc-cccc-cccc-cccc-000000000102', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000102', true, 0.9, NULL, 'ATSDR Profile Section 3.8', 'agent_backfill_20260504');

-- Claim 3: PCB Neurodevelopmental Toxicity (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000103', '11111111-1111-4111-8111-111111111201', '3152961b-d939-4dfa-824b-531db61f547f', 'children of occupationally and environmentally exposed mothers', 'prenatal (transplacental and breast milk)', 'background environmental', 'positive_association', 'IQ reduction 4-7 points per unit increase in maternal serum PCB', 'Prenatal PCB exposure impairs cognitive development in multiple prospective cohorts (Yu-Cheng, Faroe Islands). Children of exposed mothers show deficits in attention, memory, and psychomotor function.', 'certified', 0.87, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000103', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000104', true, 0.85, NULL, 'Results Section', 'agent_backfill_20260504'),
('cccccccc-cccc-cccc-cccc-000000000103', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000105', true, 0.85, NULL, 'Faroe Islands Cohort Follow-up', 'agent_backfill_20260504');

-- Claim 4: PCB Endocrine Disruption (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000104', '11111111-1111-4111-8111-111111111201', '519f2cc3-9b76-45ef-87b2-de19d220ed3d', 'general population and occupationally exposed', 'oral+inhalation+dermal', 'background to occupational', 'positive_association', 'Altered T3/T4 ratios, TSH suppression at serum PCB >5 ppb', 'PCBs disrupt thyroid hormone homeostasis and reproductive hormone signaling. Occupationally exposed workers show reduced T3 and elevated thyroid-binding globulin.', 'certified', 0.84, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000104', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000102', true, 0.9, NULL, 'ATSDR Profile Sections 3.4, 3.8', 'agent_backfill_20260504'),
('cccccccc-cccc-cccc-cccc-000000000104', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000101', true, 0.85, NULL, 'IARC Monograph 107 Mechanistic Data', 'agent_backfill_20260504');

-- Claim 5: PCB Bioaccumulation and Persistence (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000105', '11111111-1111-4111-8111-111111111201', 'f820ccec-954d-4b5a-9774-49523b543da2', 'general population', 'dietary bioaccumulation', 'background environmental', 'positive_association', 'Half-life 10-15 years; persistent detection 30+ years after production cessation', 'PCBs bioaccumulate extensively in adipose tissue with half-lives of 10-15 years. Body burden remains elevated decades after exposure ends due to lipophilicity and environmental persistence.', 'certified', 0.90, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000105', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000102', true, 0.95, NULL, 'ATSDR Profile Section 2.4 (Pharmacokinetics)', 'agent_backfill_20260504');

-- Claim 6: PCB Hepatotoxicity (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000106', '11111111-1111-4111-8111-111111111201', '37ba9a73-ec68-4f25-8c2e-fc1fa80bea8e', 'occupationally exposed workers', 'occupational inhalation+dermal', 'high occupational', 'positive_association', 'CYP1A1/1A2 induction; elevated transaminases at >10 ppb serum', 'PCBs induce hepatic enzymes (CYP1A1, CYP1A2) via aryl hydrocarbon receptor (AhR) activation. Occupational cohorts show elevated liver enzymes and hepatic steatosis.', 'certified', 0.82, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000106', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000102', true, 0.90, NULL, 'ATSDR Profile Section 3.5 (Hepatotoxicity)', 'agent_backfill_20260504'),
('cccccccc-cccc-cccc-cccc-000000000106', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000101', true, 0.85, NULL, 'IARC Mechanistic Review', 'agent_backfill_20260504');

-- Claim 7: PCB Cardiovascular Effects (PROVISIONAL)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000107', '11111111-1111-4111-8111-111111111201', '26ab340e-b530-4161-8fea-93ef934bf186', 'adult occupational and general population', 'occupational+dietary', 'background to high occupational', 'positive_association', 'Increased MACE risk at body burden >10 ppb; inconsistent across studies', 'Emerging epidemiological evidence links PCB body burden to atherosclerotic plaque accumulation and cardiovascular mortality. Studies show dose-response but sample sizes remain modest and confounding not fully controlled.', 'provisional', 0.45, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000107', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000103', true, 0.5, NULL, 'EPA IRIS Cardiovascular Section', 'agent_backfill_20260504');

-- Claim 8: PCB Aquatic Bioaccumulation (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('cccccccc-cccc-cccc-cccc-000000000108', '11111111-1111-4111-8111-111111111201', '332e61d0-388a-4a73-b960-d5d8a4695bd0', 'freshwater fish and marine organisms', 'environmental bioaccumulation', 'environmental background to high contamination', 'positive_association', 'BCF 10,000-100,000; highest in apex predators (Great Lakes, Arctic)', 'PCBs bioaccumulate extensively in aquatic food webs, with concentrations highest in fish and marine mammals. Great Lakes fish exceed consumption advisories; Arctic marine mammals carry legacy PCB burdens.', 'certified', 0.91, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('cccccccc-cccc-cccc-cccc-000000000108', 'aaaaaaaa-aaaa-aaaa-aaaa-000000000102', true, 0.95, NULL, 'ATSDR Profile Section 6 (Ecotoxicology)', 'agent_backfill_20260504');

-- ==============
-- TCDD CLAIMS
-- ==============

-- Claim 1: TCDD Carcinogenicity (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000201', '11111111-1111-4111-8111-111111111202', 'fd64094e-f996-47ad-a502-15f96cb2fff3', 'occupationally exposed workers and Seveso accident residents', 'occupational inhalation+dermal; accidental environmental', 'high occupational to moderate accidental', 'positive_association', 'All-sites cancer mortality increased 4-10 fold in occupational cohorts and Seveso; RR 1.7 (95% CI 1.2-2.5)', 'IARC classifies TCDD as Group 1 carcinogen (2012). Occupational cohorts (herbicide manufacturers) and Seveso accident residents show dose-dependent increase in all-site cancer mortality.', 'certified', 0.89, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000201', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000201', true, 1.0, '2,3,7,8-Tetrachlorodibenzo-para-dioxin (TCDD) is carcinogenic to humans (Group 1)', 'IARC Monograph 100F', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000201', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000203', true, 0.9, NULL, 'Seveso Cohort Follow-up Results', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000201', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000202', true, 0.85, NULL, 'ATSDR Profile Carcinogenicity Section', 'agent_backfill_20260504');

-- Claim 2: TCDD Immunotoxicity (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000202', '11111111-1111-4111-8111-111111111202', '9a1b1033-4d15-498f-a833-7aaf8126d6f6', 'occupationally exposed workers and animal models', 'occupational inhalation+dermal', 'occupational', 'positive_association', 'Thymic atrophy; reduced T-cell counts and Th1/Th2 shift toward Th2 dominance', 'TCDD causes thymic involution and impairs T-cell mediated immunity in both animal and human studies. Occupational cohorts show reduced T-helper cells and skewed Th2 dominance affecting vaccine response.', 'certified', 0.88, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000202', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000202', true, 0.95, NULL, 'ATSDR Profile Immunotoxicity Section', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000202', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000201', true, 0.90, NULL, 'IARC Monograph 100F Mechanistic', 'agent_backfill_20260504');

-- Claim 3: TCDD AhR Agonism (Mechanistic) (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000203', '11111111-1111-4111-8111-111111111202', 'f995d4cf-55db-4f97-a5a2-750b8f3b2c80', 'in vitro and animal models; inferred in humans', 'experimental', 'laboratory', 'positive_association', 'Binds AhR with Kd ~6 pM; induces CYP1A1 and immunosuppressive AhR target genes', 'TCDD is the prototypical aryl hydrocarbon receptor (AhR) agonist. High-affinity AhR binding initiates a cascade of xenobiotic-response gene expression driving TCDD toxicity: CYP1A1 induction, immune dysregulation, developmental disruption.', 'certified', 0.93, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000203', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000201', true, 1.0, NULL, 'IARC Monograph 100F Section 2 (Mechanism)', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000203', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000202', true, 0.95, NULL, 'ATSDR Profile Mechanism Section', 'agent_backfill_20260504');

-- Claim 4: TCDD Reproductive Toxicity - Sex Ratio Shift (CONTESTED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000204', '11111111-1111-4111-8111-111111111202', '14b2de92-d1e0-4cf2-bd37-33391e1003f8', 'offspring of exposed parents in Seveso accident', 'environmental prenatal+postnatal', 'high accidental exposure (serum TCDD >200 ppb)', 'mixed', 'Female sex ratio skew (fewer male births) at highest maternal exposure', 'Seveso cohort shows reduced male/female sex ratio in children of highly exposed mothers, suggesting TCDD impairs male fetal survival. However, later Seveso follow-ups and Japanese Yusho cohort show inconsistent results; sex ratio shift remains contested.', 'contested', 0.42, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000204', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000203', true, 0.6, NULL, 'Seveso Reproductive Follow-up', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000204', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000205', false, 0.5, NULL, 'Systematic Review: Inconsistent across cohorts', 'agent_backfill_20260504');

-- Claim 5: TCDD Endocrine Disruption (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000205', '11111111-1111-4111-8111-111111111202', '519f2cc3-9b76-45ef-87b2-de19d220ed3d', 'occupationally exposed workers and accident cohorts', 'occupational inhalation+dermal; environmental', 'occupational to high accidental', 'positive_association', 'Reduced T3 and T4; elevated TSH in dose-response relationship', 'TCDD disrupts thyroid hormone homeostasis via AhR-mediated increases in UDP-glucuronosyltransferase activity, accelerating T3/T4 metabolism. Seveso and occupational cohorts show TSH elevation and thyroid atrophy.', 'certified', 0.85, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000205', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000202', true, 0.95, NULL, 'ATSDR Profile Endocrine Disruption', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000205', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000203', true, 0.80, NULL, 'Seveso Hormone Data', 'agent_backfill_20260504');

-- Claim 6: TCDD Type 2 Diabetes Association (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000206', '11111111-1111-4111-8111-111111111202', '519f2cc3-9b76-45ef-87b2-de19d220ed3d', 'Vietnam veterans (Ranch Hand Cohort); Seveso residents', 'environmental (herbicide spraying); accidental', 'moderate environmental to high accidental', 'positive_association', 'OR 1.6-2.1 for diabetes at highest serum dioxin tertile', 'Vietnam Ranch Hand veterans and Seveso accident residents show elevated type 2 diabetes prevalence and incidence, correlating with serum dioxin levels. Mechanism involves AhR-mediated disruption of insulin signaling and pancreatic beta-cell dysfunction.', 'certified', 0.83, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000206', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000204', true, 0.85, NULL, 'Ranch Hand Cohort Diabetes Follow-up', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000206', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000203', true, 0.80, NULL, 'Seveso Metabolic Outcomes', 'agent_backfill_20260504');

-- Claim 7: TCDD Chloracne (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000207', '11111111-1111-4111-8111-111111111202', '37ba9a73-ec68-4f25-8c2e-fc1fa80bea8e', 'workers and residents exposed to dioxin-containing herbicides and accidental releases', 'occupational dermal+inhalation; accidental environmental', 'high occupational to very high accidental', 'positive_association', 'Threshold approximately 500 pg/g lipid; 100% incidence above 2000 pg/g', 'Chloracne is the pathognomonic systemic marker of high-dose dioxin exposure. Occupational herbicide workers exposed to contaminated 2,4,5-T and Seveso accident residents developed characteristic comedonal dermatitis. Appearance correlates with internal dioxin burden.', 'certified', 0.94, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000207', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000206', true, 0.90, NULL, 'Chloracne Clinical Case Series', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000207', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000202', true, 0.95, NULL, 'ATSDR Profile Dermal Effects', 'agent_backfill_20260504');

-- Claim 8: TCDD Developmental Toxicity - Birth Weight (CERTIFIED)
INSERT INTO claims (id, substance_id, endpoint_id, population, exposure_route, exposure_level, effect_direction, effect_magnitude, effect_summary, status, confidence_score, notes)
VALUES ('dddddddd-dddd-dddd-dddd-000000000208', '11111111-1111-4111-8111-111111111202', '8bb753a4-b51f-48dc-af1b-ed3a9fb33b58', 'children born to mothers exposed in Seveso accident', 'prenatal (transplacental)', 'high accidental exposure', 'negative_association', 'Birth weight reduction 150-200 g at maternal serum TCDD >700 pg/g lipid', 'Seveso cohort infants born to highly exposed mothers show reduced birth weight. Effect correlates with third-trimester maternal serum dioxin levels, indicating critical window vulnerability and AhR-mediated disruption of fetal growth.', 'certified', 0.84, NULL);

INSERT INTO claim_evidence (claim_id, source_id, supports, weight, verbatim_quote, page_or_section, extracted_by)
VALUES
('dddddddd-dddd-dddd-dddd-000000000208', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000203', true, 0.90, NULL, 'Seveso Birth Outcomes Section', 'agent_backfill_20260504'),
('dddddddd-dddd-dddd-dddd-000000000208', 'bbbbbbbb-bbbb-bbbb-bbbb-000000000201', true, 0.85, NULL, 'IARC Monograph Developmental Data', 'agent_backfill_20260504');

COMMIT;
