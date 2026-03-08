-- 002_search.sql — Full-text search + hybrid search functions
-- Run against Supabase SQL Editor
-- 2026-03-07

-- ============================================
-- 1. Full-text search function (keyword search)
-- ============================================
CREATE OR REPLACE FUNCTION search_substances_fts(
  query_text TEXT,
  max_results INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID, name TEXT, cas_number TEXT, description TEXT,
  molecular_formula TEXT, pubchem_cid INTEGER,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id, s.name, s.cas_number, s.description,
    s.molecular_formula, s.pubchem_cid,
    ts_rank(s.search_vector, plainto_tsquery('english', query_text)) AS rank
  FROM substances s
  WHERE s.search_vector @@ plainto_tsquery('english', query_text)
  ORDER BY rank DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 2. Fuzzy name search (trigram similarity)
-- ============================================
CREATE OR REPLACE FUNCTION search_substances_fuzzy(
  query_text TEXT,
  max_results INTEGER DEFAULT 20,
  min_similarity REAL DEFAULT 0.15
)
RETURNS TABLE (
  id UUID, name TEXT, cas_number TEXT, description TEXT,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, s.cas_number, s.description,
    similarity(s.name, query_text) AS sim
  FROM substances s
  WHERE similarity(s.name, query_text) > min_similarity
     OR s.name ILIKE '%' || query_text || '%'
     OR s.cas_number = query_text
  ORDER BY sim DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 3. Vector similarity search (requires embeddings)
-- ============================================
CREATE OR REPLACE FUNCTION search_substances_semantic(
  query_embedding vector(1536),
  max_results INTEGER DEFAULT 20,
  min_similarity REAL DEFAULT 0.5
)
RETURNS TABLE (
  id UUID, name TEXT, cas_number TEXT, description TEXT,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, s.cas_number, s.description,
    1 - (s.embedding <=> query_embedding) AS sim
  FROM substances s
  WHERE s.embedding IS NOT NULL
    AND 1 - (s.embedding <=> query_embedding) > min_similarity
  ORDER BY s.embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 4. Combined hybrid search (FTS + fuzzy + alias)
-- ============================================
CREATE OR REPLACE FUNCTION search_substances_hybrid(
  query_text TEXT,
  max_results INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID, name TEXT, cas_number TEXT, description TEXT,
  molecular_formula TEXT, pubchem_cid INTEGER,
  match_type TEXT, score REAL
) AS $$
BEGIN
  RETURN QUERY
  -- FTS matches (highest priority)
  SELECT DISTINCT ON (sub.id)
    sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'fts'::TEXT AS match_type,
    ts_rank(sub.search_vector, plainto_tsquery('english', query_text)) * 10 AS score
  FROM substances sub
  WHERE sub.search_vector @@ plainto_tsquery('english', query_text)

  UNION ALL

  -- Fuzzy name matches
  SELECT sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'fuzzy'::TEXT, similarity(sub.name, query_text) * 5
  FROM substances sub
  WHERE similarity(sub.name, query_text) > 0.15
    AND sub.id NOT IN (
      SELECT s2.id FROM substances s2
      WHERE s2.search_vector @@ plainto_tsquery('english', query_text)
    )

  UNION ALL

  -- CAS number exact match
  SELECT sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'cas'::TEXT, 100.0::REAL
  FROM substances sub
  WHERE sub.cas_number = query_text

  UNION ALL

  -- Alias matches
  SELECT sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'alias'::TEXT, similarity(sa.alias, query_text) * 3
  FROM substance_aliases sa
  JOIN substances sub ON sub.id = sa.substance_id
  WHERE sa.alias ILIKE '%' || query_text || '%'
    AND sub.id NOT IN (
      SELECT s2.id FROM substances s2
      WHERE s2.search_vector @@ plainto_tsquery('english', query_text)
    )
    AND sub.id NOT IN (
      SELECT s3.id FROM substances s3
      WHERE similarity(s3.name, query_text) > 0.15
    )

  ORDER BY score DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 5. Get full substance details (for API/MCP)
-- ============================================
CREATE OR REPLACE FUNCTION get_substance_details(substance_id_param UUID)
RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'id', s.id, 'name', s.name, 'cas_number', s.cas_number,
    'iupac_name', s.iupac_name, 'molecular_formula', s.molecular_formula,
    'molecular_weight', s.molecular_weight, 'smiles', s.smiles,
    'inchi_key', s.inchi_key, 'pubchem_cid', s.pubchem_cid,
    'description', s.description,
    'health_effects', (
      SELECT json_agg(json_build_object('name', he.name, 'evidence', she.evidence_level))
      FROM substance_health_effects she
      JOIN health_effects he ON he.id = she.health_effect_id
      WHERE she.substance_id = s.id
    ),
    'classifications', (
      SELECT json_agg(c.name)
      FROM substance_classifications sc
      JOIN classifications c ON c.id = sc.classification_id
      WHERE sc.substance_id = s.id
    ),
    'regulatory_limits', (
      SELECT json_agg(json_build_object(
        'agency', rl.agency, 'limit_type', rl.limit_type,
        'limit_value', rl.limit_value, 'limit_unit', rl.limit_unit
      ))
      FROM regulatory_limits rl WHERE rl.substance_id = s.id
    ),
    'water_data', (
      SELECT json_build_object(
        'states_detected', wd.states_detected, 'states_tested', wd.states_tested,
        'systems_detected', wd.systems_detected, 'people_affected', wd.people_affected
      )
      FROM water_data wd WHERE wd.substance_id = s.id LIMIT 1
    ),
    'aliases', (
      SELECT json_agg(sa.alias)
      FROM substance_aliases sa WHERE sa.substance_id = s.id
    )
  ) INTO result
  FROM substances s WHERE s.id = substance_id_param;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 6. Find substances by health effect
-- ============================================
CREATE OR REPLACE FUNCTION find_by_health_effect(
  effect_name TEXT,
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID, name TEXT, cas_number TEXT, description TEXT,
  effect TEXT, evidence_level evidence_level
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, s.cas_number, s.description,
    he.name AS effect, she.evidence_level
  FROM substances s
  JOIN substance_health_effects she ON she.substance_id = s.id
  JOIN health_effects he ON he.id = she.health_effect_id
  WHERE he.name ILIKE '%' || effect_name || '%'
  ORDER BY she.evidence_level, s.name
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 7. Compare two substances
-- ============================================
CREATE OR REPLACE FUNCTION compare_substances(id_a UUID, id_b UUID)
RETURNS JSON AS $$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(
    'substance_a', (SELECT get_substance_details(id_a)),
    'substance_b', (SELECT get_substance_details(id_b))
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 8. Get water contamination stats
-- ============================================
CREATE OR REPLACE FUNCTION get_water_stats(
  min_people_affected BIGINT DEFAULT 0,
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID, name TEXT, cas_number TEXT,
  people_affected BIGINT, systems_detected INTEGER,
  states_detected INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name, s.cas_number,
    wd.people_affected, wd.systems_detected, wd.states_detected
  FROM substances s
  JOIN water_data wd ON wd.substance_id = s.id
  WHERE wd.people_affected >= min_people_affected
  ORDER BY wd.people_affected DESC NULLS LAST
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 9. HNSW index for vector similarity search
-- ============================================
CREATE INDEX IF NOT EXISTS idx_substances_embedding
  ON substances USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ============================================
-- 10. Grant execute permissions to anon/authenticated
-- ============================================
GRANT EXECUTE ON FUNCTION search_substances_fts TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_substances_fuzzy TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_substances_semantic TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_substances_hybrid TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_substance_details TO anon, authenticated;
GRANT EXECUTE ON FUNCTION find_by_health_effect TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compare_substances TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_water_stats TO anon, authenticated;
