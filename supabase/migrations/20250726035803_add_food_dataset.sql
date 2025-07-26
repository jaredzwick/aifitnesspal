CREATE TABLE food (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Core food information
  category TEXT,
  description TEXT NOT NULL,
  nutrient_data_bank_number TEXT UNIQUE NOT NULL,
  
  -- Macronutrients (all in grams)
  protein NUMERIC,
  carbohydrate NUMERIC,
  total_fat NUMERIC,
  saturated_fat NUMERIC,
  monounsaturated_fat NUMERIC,
  polyunsaturated_fat NUMERIC,
  fiber NUMERIC,
  sugar NUMERIC,
  
  -- Vitamins (mixed units)
  vitamin_a_iu NUMERIC,
  vitamin_a_rae NUMERIC,
  vitamin_c NUMERIC,
  vitamin_e NUMERIC,
  vitamin_k NUMERIC,
  thiamin NUMERIC,
  riboflavin NUMERIC,
  niacin NUMERIC,
  vitamin_b6 NUMERIC,
  vitamin_b12 NUMERIC,
  pantothenic_acid NUMERIC,
  
  -- Minerals (all in mg)
  calcium NUMERIC,
  iron NUMERIC,
  magnesium NUMERIC,
  phosphorus NUMERIC,
  potassium NUMERIC,
  sodium NUMERIC,
  zinc NUMERIC,
  copper NUMERIC,
  manganese NUMERIC,
  selenium NUMERIC,
  
  -- Special compounds
  cholesterol NUMERIC,  -- mg
  choline NUMERIC,      -- mg
  ash NUMERIC,          -- g
  alpha_carotene NUMERIC,  -- mcg
  beta_carotene NUMERIC,   -- mcg
  beta_cryptoxanthin NUMERIC, -- mcg
  lutein_zeaxanthin NUMERIC,  -- mcg
  lycopene NUMERIC,           -- mcg
  
  -- Energy
  kilocalories NUMERIC NOT NULL,
  
  -- Serving information
  serving_size NUMERIC,
  serving_unit TEXT,
  refuse_percentage NUMERIC,
  
  -- Household weights
  household_weight_1 NUMERIC,
  household_weight_1_desc TEXT,
  household_weight_2 NUMERIC,
  household_weight_2_desc TEXT,
  
  -- Search optimization
  water_content NUMERIC,  -- g
  search_vector TSVECTOR
);

-- Enable extensions for search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Indexes for search performance
CREATE INDEX idx_food_description_trgm ON food USING GIN (description gin_trgm_ops);
CREATE INDEX idx_food_category ON food (category);
CREATE INDEX idx_food_calories ON food (kilocalories);
CREATE INDEX idx_food_search_vector ON food USING GIN (search_vector);

-- Generate search vector column
CREATE OR REPLACE FUNCTION food_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.household_weight_1_desc, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.household_weight_2_desc, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER food_search_vector_trigger
BEFORE INSERT OR UPDATE ON food
FOR EACH ROW EXECUTE FUNCTION food_search_vector_update();