-- Deduplicate food records by category
-- This migration removes duplicate food entries within each category,
-- keeping the most complete record (most non-null nutritional data) for each category

-- Step 1: Create a temporary table to identify the best record for each category
CREATE TEMP TABLE category_best_foods AS
SELECT DISTINCT ON (category) 
  id,
  category,
  description,
  -- Count of non-null nutritional fields to determine completeness
  (
    CASE WHEN protein IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN carbohydrate IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN total_fat IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN saturated_fat IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN fiber IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN sugar IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN kilocalories IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN sodium IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN calcium IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN iron IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN potassium IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN vitamin_c IS NOT NULL THEN 1 ELSE 0 END
  ) AS completeness_score
FROM food 
WHERE category IS NOT NULL
ORDER BY 
  category,
  -- Prioritize records with more complete nutritional data
  (
    CASE WHEN protein IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN carbohydrate IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN total_fat IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN saturated_fat IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN fiber IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN sugar IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN kilocalories IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN sodium IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN calcium IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN iron IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN potassium IS NOT NULL THEN 1 ELSE 0 END +
    CASE WHEN vitamin_c IS NOT NULL THEN 1 ELSE 0 END
  ) DESC,
  -- Secondary sort by description length (more detailed descriptions preferred)
  LENGTH(description) DESC,
  -- Tertiary sort by ID to ensure deterministic results
  id ASC;

-- Step 2: Log what we're about to delete for debugging
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM food f
  WHERE f.category IS NOT NULL
    AND f.id NOT IN (SELECT id FROM category_best_foods);
  
  RAISE NOTICE 'About to delete % duplicate food records by category', duplicate_count;
END $$;

-- Step 3: Delete all foods that are not the "best" representative for their category
DELETE FROM food 
WHERE category IS NOT NULL
  AND id NOT IN (SELECT id FROM category_best_foods);

-- Step 4: Handle foods with NULL categories separately
-- Keep foods with unique descriptions even if category is NULL
DELETE FROM food a
USING food b
WHERE a.id > b.id
  AND a.category IS NULL
  AND b.category IS NULL
  AND a.description = b.description;

-- Step 5: Update statistics and log results
DO $$
DECLARE
  remaining_count INTEGER;
  categories_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_count FROM food;
  SELECT COUNT(DISTINCT category) INTO categories_count FROM food WHERE category IS NOT NULL;
  
  RAISE NOTICE 'Deduplication complete. % food records remaining across % categories', remaining_count, categories_count;
END $$;

-- Step 6: Refresh search vectors for remaining foods
UPDATE food SET search_vector = 
  setweight(to_tsvector('english', COALESCE(description, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(first_household_weight_description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(second_household_weight_description, '')), 'C')
WHERE search_vector IS NULL OR search_vector = '';

-- Step 7: Create index on category for better performance
CREATE INDEX IF NOT EXISTS idx_food_category ON food (category) WHERE category IS NOT NULL;

-- Step 8: Analyze table for better query planning
ANALYZE food;