-- 001_foundation.sql — Toxicology Knowledge Garden normalized schema
-- Run against Supabase via service-role key
-- 2026-03-07

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE alias_type AS ENUM ('common','trade','iupac','synonym','abbreviation','cas_variant');
CREATE TYPE classification_type AS ENUM ('chemical_class','use_category','regulatory_category','source_category');
CREATE TYPE evidence_level AS ENUM ('known','probable','possible','inadequate','not_classified');
CREATE TYPE agency_name AS ENUM ('EPA','WHO','EWG','EU','CalEPA','state','IARC','NTP','ATSDR');
CREATE TYPE limit_type AS ENUM ('MCL','MCLG','guideline','advisory','action_level','health_goal','reference_dose');
CREATE TYPE exposure_route_name AS ENUM ('drinking_water','air','food','dermal','occupational','inhalation');
CREATE TYPE source_type AS ENUM ('ewg_tapwater','pubchem','epa_iris','atsdr','who','ntp','iarc','manual');

-- ============================================
-- CORE: substances
-- ============================================
CREATE TABLE substances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  cas_number TEXT UNIQUE,
  iupac_name TEXT,
  molecular_formula TEXT,
  molecular_weight NUMERIC,
  smiles TEXT,
  inchi_key TEXT,
  pubchem_cid INTEGER,
  description TEXT,
  embedding vector(1536),
  search_vector tsvector,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_substances_cas ON substances(cas_number);
CREATE INDEX idx_substances_name ON substances USING gin(name gin_trgm_ops);
CREATE INDEX idx_substances_search ON substances USING gin(search_vector);
CREATE INDEX idx_substances_pubchem ON substances(pubchem_cid);

-- ============================================
-- substance_aliases
-- ============================================
CREATE TABLE substance_aliases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  alias_type alias_type DEFAULT 'common',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_aliases_substance ON substance_aliases(substance_id);
CREATE INDEX idx_aliases_name ON substance_aliases USING gin(alias gin_trgm_ops);

-- ============================================
-- classifications (hierarchical)
-- ============================================
CREATE TABLE classifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES classifications(id),
  classification_type classification_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE substance_classifications (
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  classification_id UUID NOT NULL REFERENCES classifications(id) ON DELETE CASCADE,
  PRIMARY KEY (substance_id, classification_id)
);

-- ============================================
-- health_effects
-- ============================================
CREATE TABLE health_effects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icd_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE substance_health_effects (
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  health_effect_id UUID NOT NULL REFERENCES health_effects(id) ON DELETE CASCADE,
  evidence_level evidence_level DEFAULT 'not_classified',
  evidence_source TEXT,
  notes TEXT,
  PRIMARY KEY (substance_id, health_effect_id)
);

-- ============================================
-- regulatory_limits
-- ============================================
CREATE TABLE regulatory_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  agency agency_name NOT NULL,
  limit_type limit_type NOT NULL,
  limit_value NUMERIC,
  limit_unit TEXT DEFAULT 'ppb',
  effective_date DATE,
  source_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reglimits_substance ON regulatory_limits(substance_id);
CREATE INDEX idx_reglimits_agency ON regulatory_limits(agency);

-- ============================================
-- exposure_routes
-- ============================================
CREATE TABLE exposure_routes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name exposure_route_name NOT NULL UNIQUE,
  description TEXT
);

-- Seed exposure routes
INSERT INTO exposure_routes (name, description) VALUES
  ('drinking_water', 'Exposure through contaminated drinking water'),
  ('air', 'Exposure through airborne particles or gases'),
  ('food', 'Exposure through contaminated food'),
  ('dermal', 'Exposure through skin contact'),
  ('occupational', 'Workplace exposure'),
  ('inhalation', 'Direct inhalation exposure');

CREATE TABLE substance_exposures (
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  exposure_route_id UUID NOT NULL REFERENCES exposure_routes(id) ON DELETE CASCADE,
  description TEXT,
  PRIMARY KEY (substance_id, exposure_route_id)
);

-- ============================================
-- water_data (EWG tap water detection)
-- ============================================
CREATE TABLE water_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  states_detected INTEGER,
  states_tested INTEGER,
  systems_detected INTEGER,
  people_affected BIGINT,
  detection_period TEXT,
  source source_type DEFAULT 'ewg_tapwater',
  scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_water_substance ON water_data(substance_id);

-- ============================================
-- source_documents (provenance tracking)
-- ============================================
CREATE TABLE source_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name TEXT NOT NULL,
  source_url TEXT,
  document_type TEXT,
  content_text TEXT,
  content_embedding vector(1536),
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE substance_sources (
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  source_document_id UUID NOT NULL REFERENCES source_documents(id) ON DELETE CASCADE,
  data_extracted JSONB,
  PRIMARY KEY (substance_id, source_document_id)
);

-- ============================================
-- TRIGGERS: auto-update search_vector
-- ============================================
CREATE OR REPLACE FUNCTION update_substance_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.cas_number, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.iupac_name, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.molecular_formula, '')), 'B');
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_substance_search_vector
  BEFORE INSERT OR UPDATE ON substances
  FOR EACH ROW
  EXECUTE FUNCTION update_substance_search_vector();

-- ============================================
-- ROW LEVEL SECURITY (public read, service-role write)
-- ============================================
ALTER TABLE substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE substance_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE substance_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE substance_health_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE exposure_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE substance_exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE substance_sources ENABLE ROW LEVEL SECURITY;

-- Public read access (anon + authenticated)
CREATE POLICY "Public read substances" ON substances FOR SELECT USING (true);
CREATE POLICY "Public read aliases" ON substance_aliases FOR SELECT USING (true);
CREATE POLICY "Public read classifications" ON classifications FOR SELECT USING (true);
CREATE POLICY "Public read sub_class" ON substance_classifications FOR SELECT USING (true);
CREATE POLICY "Public read health_effects" ON health_effects FOR SELECT USING (true);
CREATE POLICY "Public read sub_health" ON substance_health_effects FOR SELECT USING (true);
CREATE POLICY "Public read reg_limits" ON regulatory_limits FOR SELECT USING (true);
CREATE POLICY "Public read exposure_routes" ON exposure_routes FOR SELECT USING (true);
CREATE POLICY "Public read sub_exposures" ON substance_exposures FOR SELECT USING (true);
CREATE POLICY "Public read water_data" ON water_data FOR SELECT USING (true);
CREATE POLICY "Public read source_docs" ON source_documents FOR SELECT USING (true);
CREATE POLICY "Public read sub_sources" ON substance_sources FOR SELECT USING (true);

-- ============================================
-- SEED: classifications
-- ============================================
INSERT INTO classifications (name, classification_type, description) VALUES
  ('PFAS', 'chemical_class', 'Per- and polyfluoroalkyl substances'),
  ('VOC', 'chemical_class', 'Volatile organic compounds'),
  ('Heavy Metal', 'chemical_class', 'Heavy metals and metalloids'),
  ('Pesticide', 'use_category', 'Agricultural and household pesticides'),
  ('Herbicide', 'use_category', 'Weed-killing chemicals'),
  ('Disinfection Byproduct', 'source_category', 'Byproducts of water disinfection'),
  ('Industrial Solvent', 'use_category', 'Industrial cleaning and degreasing solvents'),
  ('Naturally Occurring', 'source_category', 'Substances found naturally in the environment'),
  ('Radiological', 'chemical_class', 'Radioactive contaminants'),
  ('Pharmaceutical', 'use_category', 'Pharmaceutical residues in water'),
  ('Microbiological', 'chemical_class', 'Microbial contaminants'),
  ('Nutrient', 'chemical_class', 'Nutrient contaminants like nitrate/nitrite');

-- ============================================
-- SEED: health_effects
-- ============================================
INSERT INTO health_effects (name, description) VALUES
  ('Cancer', 'Increased risk of cancer (any type)'),
  ('Liver Damage', 'Hepatotoxicity or liver disease'),
  ('Kidney Damage', 'Nephrotoxicity or kidney disease'),
  ('Nervous System', 'Neurotoxicity, neurological effects'),
  ('Reproductive', 'Reproductive toxicity, fertility effects'),
  ('Developmental', 'Developmental effects, birth defects'),
  ('Endocrine Disruption', 'Hormone/endocrine system disruption'),
  ('Immune System', 'Immunotoxicity, immune suppression'),
  ('Cardiovascular', 'Heart and blood vessel effects'),
  ('Respiratory', 'Lung and respiratory system effects'),
  ('Gastrointestinal', 'Stomach and intestinal effects'),
  ('Skin', 'Dermatological effects, skin irritation'),
  ('Eye', 'Ocular effects, eye irritation'),
  ('Blood', 'Hematological effects, anemia'),
  ('Bone', 'Skeletal effects, bone disease'),
  ('Thyroid', 'Thyroid gland disruption'),
  ('Adrenal', 'Adrenal gland effects'),
  ('Genotoxicity', 'DNA damage, mutagenicity');

-- ============================================
-- CONVENIENCE VIEW: substance_full
-- ============================================
CREATE OR REPLACE VIEW substance_full AS
SELECT
  s.id, s.name, s.cas_number, s.iupac_name,
  s.molecular_formula, s.molecular_weight,
  s.smiles, s.inchi_key, s.pubchem_cid,
  s.description, s.created_at, s.updated_at,
  wd.states_detected, wd.states_tested,
  wd.systems_detected, wd.people_affected,
  ARRAY_AGG(DISTINCT he.name) FILTER (WHERE he.name IS NOT NULL) AS health_effect_names,
  ARRAY_AGG(DISTINCT c.name) FILTER (WHERE c.name IS NOT NULL) AS classification_names,
  ARRAY_AGG(DISTINCT sa.alias) FILTER (WHERE sa.alias IS NOT NULL) AS aliases
FROM substances s
LEFT JOIN water_data wd ON wd.substance_id = s.id
LEFT JOIN substance_health_effects she ON she.substance_id = s.id
LEFT JOIN health_effects he ON he.id = she.health_effect_id
LEFT JOIN substance_classifications sc ON sc.substance_id = s.id
LEFT JOIN classifications c ON c.id = sc.classification_id
LEFT JOIN substance_aliases sa ON sa.substance_id = s.id
GROUP BY s.id, s.name, s.cas_number, s.iupac_name,
  s.molecular_formula, s.molecular_weight,
  s.smiles, s.inchi_key, s.pubchem_cid,
  s.description, s.created_at, s.updated_at,
  wd.states_detected, wd.states_tested,
  wd.systems_detected, wd.people_affected;
