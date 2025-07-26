CREATE OR REPLACE FUNCTION hybrid_search(
  term TEXT, 
  match_threshold FLOAT, 
  limit_num INT
) RETURNS TABLE (
  id UUID,
  description TEXT,
  category TEXT,
  kilocalories NUMERIC,
  protein NUMERIC,
  carbohydrate NUMERIC,
  total_fat NUMERIC,
  serving_size NUMERIC,
  serving_unit TEXT,
  similarity FLOAT,
  rank FLOAT
) AS $$
SELECT
  id,
  description,
  category,
  kilocalories,
  protein,
  carbohydrate,
  total_fat,
  serving_size,
  serving_unit,
  similarity(description, term) AS similarity,
  ts_rank(search_vector, websearch_to_tsquery('english', term)) AS rank
FROM food
WHERE 
  description % term  -- Trigram match
  OR search_vector @@ websearch_to_tsquery('english', term)  -- Full-text match
ORDER BY
  GREATEST(
    similarity(description, term),
    ts_rank(search_vector, websearch_to_tsquery('english', term))
  ) DESC
LIMIT limit_num;
$$ LANGUAGE sql STABLE;