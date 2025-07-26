-- Deduplicate food database entries
-- This migration removes duplicate food entries based on different criteria

-- Step 1: Remove exact duplicates based on nutrient_data_bank_number
-- Keep the first occurrence (lowest ID)
DELETE FROM food a 
USING food b 
WHERE a.id > b.id 
AND a.nutrient_data_bank_number = b.nutrient_data_bank_number;

-- Step 2: Remove duplicates with identical descriptions and similar nutritional values
-- This catches cases where the same food has slightly different entries
DELETE FROM food a 
USING food b 
WHERE a.id > b.id 
AND a.description = b.description 
AND a.category = b.category
AND ABS(COALESCE(a.kilocalories, 0) - COALESCE(b.kilocalories, 0)) < 5
AND ABS(COALESCE(a.protein, 0) - COALESCE(b.protein, 0)) < 1;

-- Step 3: Remove very similar descriptions (fuzzy matching)
-- Only run this if pg_trgm extension is available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
    -- Remove foods with very similar descriptions (>95% similarity) and same category
    DELETE FROM food a 
    USING food b 
    WHERE a.id > b.id 
    AND a.category = b.category
    AND similarity(a.description, b.description) > 0.95
    AND a.description != b.description;
  END IF;
END $$;

-- Step 4: Add constraints to prevent future duplicates
ALTER TABLE food 
ADD CONSTRAINT unique_nutrient_data_bank_number 
UNIQUE (nutrient_data_bank_number);

-- Step 5: Create index for better duplicate detection in the future
CREATE INDEX IF NOT EXISTS idx_food_description_category 
ON food (description, category);

-- Step 6: Update search vector for remaining foods to ensure consistency
UPDATE food SET search_vector = 
  setweight(to_tsvector('english', COALESCE(description, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(category, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(first_household_weight_description, '')), 'C') ||
  setweight(to_tsvector('english', COALESCE(second_household_weight_description, '')), 'C')
WHERE search_vector IS NULL;

-- Step 7: Analyze table for better query performance
ANALYZE food;