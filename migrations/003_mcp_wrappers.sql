-- 003_mcp_wrappers.sql — Name-based wrapper functions for MCP server
-- Fixes parameter name mismatches and UUID→name lookups
-- 2026-03-07

-- Drop old conflicting versions if any
DROP FUNCTION IF EXISTS get_substance_details(TEXT) CASCADE;
DROP FUNCTION IF EXISTS compare_substances(TEXT, TEXT) CASCADE;

-- ============================================
-- 1. get_substance_details by NAME (wraps UUID version)
-- ============================================
CREATE OR REPLACE FUNCTION get_substance_details(substance_name TEXT)
RETURNS JSON AS $$
DECLARE
  sub_id UUID;
  result JSON;
BEGIN
  SELECT id INTO sub_id FROM substances WHERE name ILIKE substance_name LIMIT 1;
  IF sub_id IS NULL THEN RETURN NULL; END IF;
  SELECT json_build_object(
    'id', s.id, 'name', s.name, 'cas_number', s.cas_number,
    'iupac_name', s.iupac_name, 'molecular_formula', s.molecular_formula,
    'molecular_weight', s.molecular_weight, 'smiles', s.smiles,
    'inchi_key', s.inchi_key, 'pubchem_cid', s.pubchem_cid,
    'description', s.description,
    'health_effects', (
      SELECT json_agg(json_build_object('name', he.name, 'evidence_level', she.evidence_level))
      FROM substance_health_effects she
      JOIN health_effects he ON he.id = she.health_effect_id
      WHERE she.substance_id = s.id
    ),
    'classifications', (
      SELECT json_agg(json_build_object('name', c.name))
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
  FROM substances s WHERE s.id = sub_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 2. compare_substances by NAME (wraps UUID version)
-- ============================================
CREATE OR REPLACE FUNCTION compare_substances(name_a TEXT, name_b TEXT)
RETURNS JSON AS $$
DECLARE
  id_a UUID;
  id_b UUID;
  result JSON;
BEGIN
  SELECT id INTO id_a FROM substances WHERE name ILIKE name_a LIMIT 1;
  SELECT id INTO id_b FROM substances WHERE name ILIKE name_b LIMIT 1;
  IF id_a IS NULL OR id_b IS NULL THEN RETURN '[]'::JSON; END IF;

  SELECT json_agg(sub_detail) INTO result FROM (
    SELECT get_substance_details(sub_name) AS sub_detail
    FROM (VALUES (name_a), (name_b)) AS t(sub_name)
  ) sub;
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 3. Re-deploy search_substances_hybrid (ensure it exists with correct params)
-- ============================================
DROP FUNCTION IF EXISTS search_substances_hybrid(TEXT, INTEGER);
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
  SELECT DISTINCT ON (sub.id)
    sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'fts'::TEXT AS match_type,
    ts_rank(sub.search_vector, plainto_tsquery('english', query_text)) * 10 AS score
  FROM substances sub
  WHERE sub.search_vector @@ plainto_tsquery('english', query_text)
  UNION ALL
  SELECT sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'fuzzy'::TEXT, similarity(sub.name, query_text) * 5
  FROM substances sub
  WHERE similarity(sub.name, query_text) > 0.15
    AND sub.id NOT IN (SELECT s2.id FROM substances s2 WHERE s2.search_vector @@ plainto_tsquery('english', query_text))
  UNION ALL
  SELECT sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'cas'::TEXT, 100.0::REAL
  FROM substances sub WHERE sub.cas_number = query_text
  UNION ALL
  SELECT sub.id, sub.name, sub.cas_number, sub.description,
    sub.molecular_formula, sub.pubchem_cid,
    'alias'::TEXT, similarity(sa.alias, query_text) * 3
  FROM substance_aliases sa
  JOIN substances sub ON sub.id = sa.substance_id
  WHERE sa.alias ILIKE '%' || query_text || '%'
    AND sub.id NOT IN (SELECT s2.id FROM substances s2 WHERE s2.search_vector @@ plainto_tsquery('english', query_text))
    AND sub.id NOT IN (SELECT s3.id FROM substances s3 WHERE similarity(s3.name, query_text) > 0.15)
  ORDER BY score DESC LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 4. GRANT permissions on new overloaded functions
-- ============================================
GRANT EXECUTE ON FUNCTION get_substance_details(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compare_substances(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_substances_hybrid(TEXT, INTEGER) TO anon, authenticated;
