-- Drop the old foods table
-- This removes the existing foods table to make way for the new food table structure

DROP TABLE IF EXISTS foods CASCADE;

-- Also drop any related indexes or triggers that might exist
DROP INDEX IF EXISTS idx_foods_name;
DROP INDEX IF EXISTS idx_foods_category;
DROP INDEX IF EXISTS idx_foods_calories;

-- Remove any functions related to the old foods table
DROP FUNCTION IF EXISTS foods_search_vector_update() CASCADE;