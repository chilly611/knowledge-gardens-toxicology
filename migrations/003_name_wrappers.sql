-- 003_name_wrappers.sql — Name-based wrapper functions for MCP server
-- Wraps UUID-based functions so MCP can pass substance names directly

-- Get details by name (wraps get_substance_details)
CREATE OR REPLACE FUNCTION get_substance_details_by_name(substance_name TEXT)
RETURNS JSON AS $$
DECLARE
  sid UUID;
  result JSON;
BEGIN
  SELECT id INTO sid FROM substances WHERE name ILIKE substance_name LIMIT 1;
  IF sid IS NULL THEN RETURN NULL; END IF;
  RETURN get_substance_details(sid);
END;
$$ LANGUAGE plpgsql STABLE;

-- Compare by names (wraps compare_substances)
CREATE OR REPLACE FUNCTION compare_substances_by_name(name_a TEXT, name_b TEXT)
RETURNS JSON AS $$
DECLARE
  id_a UUID; id_b UUID;
BEGIN
  SELECT id INTO id_a FROM substances WHERE name ILIKE name_a LIMIT 1;
  SELECT id INTO id_b FROM substances WHERE name ILIKE name_b LIMIT 1;
  IF id_a IS NULL OR id_b IS NULL THEN RETURN NULL; END IF;
  RETURN compare_substances(id_a, id_b);
END;
$$ LANGUAGE plpgsql STABLE;

-- Enhanced water stats with health effects included
CREATE OR REPLACE FUNCTION get_water_stats_enhanced(
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  substance_name TEXT, cas_number TEXT,
  people_affected BIGINT, systems_detected INTEGER,
  states_detected INTEGER, health_effects TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.name AS substance_name, s.cas_number,
    wd.people_affected, wd.systems_detected, wd.states_detected,
    ARRAY_AGG(DISTINCT he.name) FILTER (WHERE he.name IS NOT NULL) AS health_effects
  FROM substances s
  JOIN water_data wd ON wd.substance_id = s.id
  LEFT JOIN substance_health_effects she ON she.substance_id = s.id
  LEFT JOIN health_effects he ON he.id = she.health_effect_id
  WHERE wd.people_affected > 0
  GROUP BY s.name, s.cas_number, wd.people_affected, wd.systems_detected, wd.states_detected
  ORDER BY wd.people_affected DESC NULLS LAST
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- Enhanced find_by_health_effect with people_affected
CREATE OR REPLACE FUNCTION find_by_health_effect_enhanced(
  effect_name TEXT,
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  substance_name TEXT, cas_number TEXT,
  evidence_level evidence_level, people_affected BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.name AS substance_name, s.cas_number,
    she.evidence_level,
    wd.people_affected
  FROM substances s
  JOIN substance_health_effects she ON she.substance_id = s.id
  JOIN health_effects he ON he.id = she.health_effect_id
  LEFT JOIN water_data wd ON wd.substance_id = s.id
  WHERE he.name ILIKE '%' || effect_name || '%'
  ORDER BY wd.people_affected DESC NULLS LAST, s.name
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

GRANT EXECUTE ON FUNCTION get_substance_details_by_name TO anon, authenticated;
GRANT EXECUTE ON FUNCTION compare_substances_by_name TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_water_stats_enhanced TO anon, authenticated;
GRANT EXECUTE ON FUNCTION find_by_health_effect_enhanced TO anon, authenticated;
