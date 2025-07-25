-- Example: Add new columns, modify existing ones, etc.
ALTER TABLE user_workouts ADD COLUMN IF NOT EXISTS exercises JSONB;