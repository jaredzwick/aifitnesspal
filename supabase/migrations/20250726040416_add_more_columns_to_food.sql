-- Add missing columns to the food table to match CSV headers

ALTER TABLE food 
ADD COLUMN IF NOT EXISTS lutein_and_zeaxanthin NUMERIC,
ADD COLUMN IF NOT EXISTS retinol NUMERIC,
ADD COLUMN IF NOT EXISTS sugar_total NUMERIC,
ADD COLUMN IF NOT EXISTS water NUMERIC,
ADD COLUMN IF NOT EXISTS monosaturated_fat NUMERIC,
ADD COLUMN IF NOT EXISTS polysaturated_fat NUMERIC,
ADD COLUMN IF NOT EXISTS total_lipid NUMERIC,
ADD COLUMN IF NOT EXISTS first_household_weight NUMERIC,
ADD COLUMN IF NOT EXISTS first_household_weight_description TEXT,
ADD COLUMN IF NOT EXISTS second_household_weight NUMERIC,
ADD COLUMN IF NOT EXISTS second_household_weight_description TEXT;

-- Update existing columns that have different names
-- Note: The original migration had some naming inconsistencies
-- These columns already exist but with slightly different names:
-- lutein_zeaxanthin -> lutein_and_zeaxanthin (already added above)
-- sugar -> sugar_total (already added above)
-- water_content -> water (already added above)
-- monounsaturated_fat -> monosaturated_fat (already added above)
-- polyunsaturated_fat -> polysaturated_fat (already added above)
-- total_fat -> total_lipid (already added above)
-- household_weight_1 -> first_household_weight (already added above)
-- household_weight_1_desc -> first_household_weight_description (already added above)
-- household_weight_2 -> second_household_weight (already added above)
-- household_weight_2_desc -> second_household_weight_description (already added above)