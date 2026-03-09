-- 002_cases.sql — Case management extension for Toxicology Knowledge Garden
-- Adds litigation case tracking, document cataloging, party management
-- Run against Supabase via service-role key
-- 2026-03-09

-- ============================================
-- ENUM TYPES (case-specific)
-- ============================================
CREATE TYPE case_type AS ENUM (
  'toxic_tort','class_action','personal_injury','environmental',
  'product_liability','regulatory','workers_comp','other'
);

CREATE TYPE case_status AS ENUM (
  'active','discovery','trial_prep','trial','settled',
  'verdict','appeal','closed','on_hold'
);

CREATE TYPE party_role AS ENUM (
  'plaintiff','defendant','expert_plaintiff','expert_defense',
  'counsel_plaintiff','counsel_defense','judge','mediator','witness'
);

CREATE TYPE document_category AS ENUM (
  'deposition','expert_report','medical_record','testing_data',
  'correspondence','motion','verdict','trial_doc','rebuttal',
  'presentation','graphic','article','regulation','epa_data',
  'exposure_data','neuroimaging','blood_data','plaintiff_file',
  'defense_material','email','meeting_notes','travel','other'
);

-- ============================================
-- CORE: cases
-- ============================================
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  case_number TEXT,
  case_type case_type NOT NULL DEFAULT 'toxic_tort',
  status case_status NOT NULL DEFAULT 'active',
  jurisdiction TEXT,
  court TEXT,
  description TEXT,
  primary_substance TEXT,
  location TEXT,
  date_filed DATE,
  date_closed DATE,
  expert_id UUID,
  drive_folder_url TEXT,
  metadata JSONB DEFAULT '{}',
  search_vector tsvector,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cases_name ON cases USING gin(name gin_trgm_ops);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_type ON cases(case_type);
CREATE INDEX idx_cases_search ON cases USING gin(search_vector);

-- ============================================
-- experts (doctors, toxicologists)
-- ============================================
CREATE TABLE experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  credentials TEXT,
  organization TEXT,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_experts_name ON experts USING gin(name gin_trgm_ops);

-- Add FK from cases to experts
ALTER TABLE cases ADD CONSTRAINT fk_cases_expert
  FOREIGN KEY (expert_id) REFERENCES experts(id) ON DELETE SET NULL;

-- ============================================
-- case_parties (plaintiffs, defendants, counsel, etc.)
-- ============================================
CREATE TABLE case_parties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role party_role NOT NULL,
  organization TEXT,
  contact_info TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_parties_case ON case_parties(case_id);
CREATE INDEX idx_case_parties_role ON case_parties(role);

-- ============================================
-- case_substances (M2M linking cases to substances in DB)
-- ============================================
CREATE TABLE case_substances (
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  substance_id UUID NOT NULL REFERENCES substances(id) ON DELETE CASCADE,
  relevance TEXT,
  notes TEXT,
  PRIMARY KEY (case_id, substance_id)
);

-- ============================================
-- case_documents (catalog of files from Drive/local)
-- ============================================
CREATE TABLE case_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category document_category NOT NULL DEFAULT 'other',
  file_type TEXT,
  file_size_bytes BIGINT,
  drive_url TEXT,
  drive_folder_path TEXT,
  local_path TEXT,
  description TEXT,
  date_created DATE,
  metadata JSONB DEFAULT '{}',
  search_vector tsvector,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_docs_case ON case_documents(case_id);
CREATE INDEX idx_case_docs_category ON case_documents(category);
CREATE INDEX idx_case_docs_search ON case_documents USING gin(search_vector);
CREATE INDEX idx_case_docs_name ON case_documents USING gin(name gin_trgm_ops);

-- ============================================
-- case_events (timeline: depositions, motions, trial dates)
-- ============================================
CREATE TABLE case_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_date DATE,
  description TEXT,
  participants TEXT[],
  outcome TEXT,
  document_ids UUID[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_events_case ON case_events(case_id);
CREATE INDEX idx_case_events_date ON case_events(event_date);

-- ============================================
-- TRIGGERS: auto-update search vectors
-- ============================================
CREATE OR REPLACE FUNCTION update_case_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.case_number, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.jurisdiction, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.primary_substance, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.location, '')), 'B');
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_case_search_vector
  BEFORE INSERT OR UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_case_search_vector();

CREATE OR REPLACE FUNCTION update_case_doc_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.drive_folder_path, '')), 'C');
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_case_doc_search_vector
  BEFORE INSERT OR UPDATE ON case_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_case_doc_search_vector();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_events ENABLE ROW LEVEL SECURITY;

-- Public read access (matches 001_foundation pattern)
CREATE POLICY "Public read cases" ON cases FOR SELECT USING (true);
CREATE POLICY "Public read experts" ON experts FOR SELECT USING (true);
CREATE POLICY "Public read case_parties" ON case_parties FOR SELECT USING (true);
CREATE POLICY "Public read case_substances" ON case_substances FOR SELECT USING (true);
CREATE POLICY "Public read case_documents" ON case_documents FOR SELECT USING (true);
CREATE POLICY "Public read case_events" ON case_events FOR SELECT USING (true);

-- ============================================
-- CONVENIENCE VIEW: case_full
-- ============================================
CREATE OR REPLACE VIEW case_full AS
SELECT
  c.id, c.name, c.case_number, c.case_type, c.status,
  c.jurisdiction, c.court, c.description,
  c.primary_substance, c.location,
  c.date_filed, c.date_closed, c.drive_folder_url,
  c.metadata, c.created_at, c.updated_at,
  e.name AS expert_name, e.credentials AS expert_credentials,
  e.organization AS expert_organization,
  COUNT(DISTINCT cd.id) AS document_count,
  COUNT(DISTINCT cp.id) AS party_count,
  ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) AS substance_names,
  ARRAY_AGG(DISTINCT cp.name) FILTER (WHERE cp.role = 'plaintiff') AS plaintiff_names,
  ARRAY_AGG(DISTINCT cp.name) FILTER (WHERE cp.role = 'defendant') AS defendant_names
FROM cases c
LEFT JOIN experts e ON e.id = c.expert_id
LEFT JOIN case_documents cd ON cd.case_id = c.id
LEFT JOIN case_parties cp ON cp.case_id = c.id
LEFT JOIN case_substances cs ON cs.case_id = c.id
LEFT JOIN substances s ON s.id = cs.substance_id
GROUP BY c.id, c.name, c.case_number, c.case_type, c.status,
  c.jurisdiction, c.court, c.description,
  c.primary_substance, c.location,
  c.date_filed, c.date_closed, c.drive_folder_url,
  c.metadata, c.created_at, c.updated_at,
  e.name, e.credentials, e.organization;
