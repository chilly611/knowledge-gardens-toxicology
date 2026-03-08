-- Fix search_substances_hybrid — clean replacement
-- Returns: name, cas_number, description, match_type, score

DROP FUNCTION IF EXISTS search_substances_hybrid(TEXT, INTEGER);

CREATE OR REPLACE FUNCTION search_substances_hybrid(
  query_text TEXT,
  max_results INTEGER DEFAULT 10
)
RETURNS TABLE (
  name TEXT,
  cas_number TEXT,
  description TEXT,
  match_type TEXT,
  score REAL
) AS $$
BEGIN
  -- Try FTS first
  RETURN QUERY
    SELECT s.name, s.cas_number, s.description,
      'fts'::TEXT AS match_type,
      ts_rank(s.search_vector, plainto_tsquery('english', query_text)) AS score
    FROM substances s
    WHERE s.search_vector @@ plainto_tsquery('english', query_text)
    ORDER BY score DESC
    LIMIT max_results;
  IF FOUND THEN RETURN; END IF;

  -- Try CAS number exact match
  RETURN QUERY
    SELECT s.name, s.cas_number, s.description,
      'cas'::TEXT AS match_type,
      1.0::REAL AS score
    FROM substances s
    WHERE s.cas_number = query_text
    LIMIT max_results;

  IF FOUND THEN RETURN; END IF;

  -- Try alias match
  RETURN QUERY
    SELECT s.name, s.cas_number, s.description,
      'alias'::TEXT AS match_type,
      0.8::REAL AS score
    FROM substances s
    JOIN substance_aliases sa ON sa.substance_id = s.id
    WHERE sa.alias ILIKE '%' || query_text || '%'
    LIMIT max_results;

  IF FOUND THEN RETURN; END IF;

  -- Fuzzy fallback
  RETURN QUERY
    SELECT s.name, s.cas_number, s.description,
      'fuzzy'::TEXT AS match_type,
      similarity(s.name, query_text) AS score
    FROM substances s
    WHERE similarity(s.name, query_text) > 0.15
       OR s.name ILIKE '%' || query_text || '%'
    ORDER BY similarity(s.name, query_text) DESC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant access
GRANT EXECUTE ON FUNCTION search_substances_hybrid(TEXT, INTEGER) TO anon, authenticated;
