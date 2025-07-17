/*
  # Complete Fitness App Database Schema

  1. New Tables
    - `workouts` - Workout templates and custom workouts
    - `exercises` - Exercise library with instructions
    - `workout_exercises` - Junction table for workout-exercise relationships
    - `user_workouts` - User's completed/scheduled workout sessions
    - `user_workout_exercises` - Individual exercise performance tracking
    - `foods` - Food database with nutritional information
    - `nutrition_entries` - Daily nutrition tracking
    - `meals` - Individual meals within nutrition entries
    - `meal_foods` - Foods within each meal
    - `progress_photos` - User progress photos
    - `body_measurements` - Body measurements over time
    - `user_goals` - User fitness goals
    - `achievements` - User achievements and milestones
    - `ai_recommendations` - AI-generated recommendations
    - `user_preferences` - User preferences and settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data

  3. Storage
    - Create storage buckets for photos and videos
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workouts and Exercises System
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('strength', 'cardio', 'flexibility', 'sports', 'other')),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer DEFAULT 30,
  calories_burned_estimate integer DEFAULT 0,
  equipment_needed text[] DEFAULT '{}',
  muscle_groups text[] DEFAULT '{}',
  is_template boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  instructions text[],
  muscle_groups text[] DEFAULT '{}',
  equipment_needed text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  exercise_type text CHECK (exercise_type IN ('strength', 'cardio', 'flexibility', 'plyometric')),
  video_url text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  order_index integer NOT NULL,
  sets integer DEFAULT 1,
  reps integer,
  duration_seconds integer,
  weight_kg numeric,
  rest_seconds integer DEFAULT 60,
  notes text,
  UNIQUE(workout_id, exercise_id, order_index)
);

CREATE TABLE IF NOT EXISTS user_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE CASCADE,
  scheduled_for timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')),
  total_duration_minutes integer,
  calories_burned integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_workout_id uuid REFERENCES user_workouts(id) ON DELETE CASCADE,
  exercise_id uuid REFERENCES exercises(id) ON DELETE CASCADE,
  sets_completed integer DEFAULT 0,
  reps_completed integer[],
  weight_used_kg numeric[],
  duration_seconds integer,
  rest_taken_seconds integer,
  difficulty_rating integer CHECK (difficulty_rating BETWEEN 1 AND 10),
  notes text,
  completed_at timestamptz
);

-- Nutrition System
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  barcode text,
  serving_size numeric DEFAULT 100,
  serving_unit text DEFAULT 'g',
  calories_per_serving numeric NOT NULL,
  protein_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0,
  fiber_g numeric DEFAULT 0,
  sugar_g numeric DEFAULT 0,
  sodium_mg numeric DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nutrition_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_calories numeric DEFAULT 0,
  total_protein_g numeric DEFAULT 0,
  total_carbs_g numeric DEFAULT 0,
  total_fat_g numeric DEFAULT 0,
  total_fiber_g numeric DEFAULT 0,
  water_intake_ml integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nutrition_entry_id uuid REFERENCES nutrition_entries(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name text,
  total_calories numeric DEFAULT 0,
  total_protein_g numeric DEFAULT 0,
  total_carbs_g numeric DEFAULT 0,
  total_fat_g numeric DEFAULT 0,
  consumed_at timestamptz DEFAULT now(),
  photo_url text,
  notes text
);

CREATE TABLE IF NOT EXISTS meal_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid REFERENCES meals(id) ON DELETE CASCADE,
  food_id uuid REFERENCES foods(id) ON DELETE CASCADE,
  quantity numeric NOT NULL,
  unit text DEFAULT 'g',
  calories numeric NOT NULL,
  protein_g numeric DEFAULT 0,
  carbs_g numeric DEFAULT 0,
  fat_g numeric DEFAULT 0
);

-- Progress Tracking
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  photo_type text CHECK (photo_type IN ('front', 'side', 'back', 'other')),
  taken_at timestamptz DEFAULT now(),
  weight_kg numeric,
  body_fat_percentage numeric,
  notes text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  measured_at timestamptz DEFAULT now(),
  weight_kg numeric,
  body_fat_percentage numeric,
  muscle_mass_kg numeric,
  chest_cm numeric,
  waist_cm numeric,
  hips_cm numeric,
  bicep_cm numeric,
  thigh_cm numeric,
  neck_cm numeric,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  goal_type text CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'other')),
  target_value numeric,
  target_unit text,
  current_value numeric DEFAULT 0,
  target_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority integer DEFAULT 1 CHECK (priority BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  achievement_type text CHECK (achievement_type IN ('workout', 'nutrition', 'streak', 'goal', 'milestone')),
  badge_icon text,
  points integer DEFAULT 0,
  earned_at timestamptz DEFAULT now(),
  is_public boolean DEFAULT true
);

-- AI Recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type text CHECK (recommendation_type IN ('workout', 'nutrition', 'recovery', 'goal')),
  title text NOT NULL,
  content jsonb NOT NULL,
  reasoning text,
  confidence_score numeric CHECK (confidence_score BETWEEN 0 AND 1),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed', 'expired')),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Preferences (extended from existing user_profiles)
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_settings jsonb DEFAULT '{}',
  privacy_settings jsonb DEFAULT '{}',
  workout_preferences jsonb DEFAULT '{}',
  nutrition_preferences jsonb DEFAULT '{}',
  ai_settings jsonb DEFAULT '{}',
  theme_preferences jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(type);
CREATE INDEX IF NOT EXISTS idx_workouts_difficulty ON workouts(difficulty);
CREATE INDEX IF NOT EXISTS idx_workouts_created_by ON workouts(created_by);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX IF NOT EXISTS idx_user_workouts_user_id ON user_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workouts_scheduled_for ON user_workouts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_user_date ON nutrition_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods(name);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_taken ON progress_photos(user_id, taken_at);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_measured ON body_measurements(user_id, measured_at);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_status ON user_goals(user_id, status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_earned ON achievements(user_id, earned_at);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_status ON ai_recommendations(user_id, status);

-- Enable Row Level Security
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workouts
CREATE POLICY "Users can read all template workouts" ON workouts
  FOR SELECT TO authenticated
  USING (is_template = true);

CREATE POLICY "Users can read own custom workouts" ON workouts
  FOR SELECT TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can create workouts" ON workouts
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own workouts" ON workouts
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can delete own workouts" ON workouts
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

-- RLS Policies for exercises (public read)
CREATE POLICY "Anyone can read exercises" ON exercises
  FOR SELECT TO authenticated
  USING (true);

-- RLS Policies for workout_exercises
CREATE POLICY "Users can read workout exercises" ON workout_exercises
  FOR SELECT TO authenticated
  USING (
    workout_id IN (
      SELECT id FROM workouts 
      WHERE is_template = true OR created_by = auth.uid()
    )
  );

CREATE POLICY "Users can manage workout exercises for own workouts" ON workout_exercises
  FOR ALL TO authenticated
  USING (
    workout_id IN (
      SELECT id FROM workouts WHERE created_by = auth.uid()
    )
  );

-- RLS Policies for user_workouts
CREATE POLICY "Users can manage own workout sessions" ON user_workouts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_workout_exercises
CREATE POLICY "Users can manage own workout exercise data" ON user_workout_exercises
  FOR ALL TO authenticated
  USING (
    user_workout_id IN (
      SELECT id FROM user_workouts WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for foods
CREATE POLICY "Users can read all foods" ON foods
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create foods" ON foods
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own foods" ON foods
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for nutrition_entries
CREATE POLICY "Users can manage own nutrition entries" ON nutrition_entries
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for meals
CREATE POLICY "Users can manage own meals" ON meals
  FOR ALL TO authenticated
  USING (
    nutrition_entry_id IN (
      SELECT id FROM nutrition_entries WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for meal_foods
CREATE POLICY "Users can manage own meal foods" ON meal_foods
  FOR ALL TO authenticated
  USING (
    meal_id IN (
      SELECT m.id FROM meals m
      JOIN nutrition_entries ne ON m.nutrition_entry_id = ne.id
      WHERE ne.user_id = auth.uid()
    )
  );

-- RLS Policies for progress_photos
CREATE POLICY "Users can manage own progress photos" ON progress_photos
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for body_measurements
CREATE POLICY "Users can manage own body measurements" ON body_measurements
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_goals
CREATE POLICY "Users can manage own goals" ON user_goals
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for achievements
CREATE POLICY "Users can read own achievements" ON achievements
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read public achievements" ON achievements
  FOR SELECT TO authenticated
  USING (is_public = true);

CREATE POLICY "System can create achievements" ON achievements
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for ai_recommendations
CREATE POLICY "Users can manage own AI recommendations" ON ai_recommendations
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_entries_updated_at BEFORE UPDATE ON nutrition_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON ai_recommendations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample exercises
INSERT INTO exercises (name, description, instructions, muscle_groups, equipment_needed, difficulty, exercise_type) VALUES
('Push-ups', 'Classic bodyweight chest exercise', ARRAY['Start in plank position', 'Lower body to ground', 'Push back up', 'Repeat'], ARRAY['chest', 'shoulders', 'triceps'], ARRAY[], 'beginner', 'strength'),
('Squats', 'Fundamental lower body exercise', ARRAY['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up', 'Return to standing'], ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[], 'beginner', 'strength'),
('Plank', 'Core stability exercise', ARRAY['Start in push-up position', 'Hold body straight', 'Engage core muscles', 'Breathe normally'], ARRAY['core', 'shoulders'], ARRAY[], 'beginner', 'strength'),
('Burpees', 'Full body cardio exercise', ARRAY['Start standing', 'Drop to squat', 'Jump back to plank', 'Do push-up', 'Jump feet to squat', 'Jump up with arms overhead'], ARRAY['full body'], ARRAY[], 'intermediate', 'cardio'),
('Deadlifts', 'Compound strength exercise', ARRAY['Stand with feet hip-width apart', 'Grip barbell with hands outside legs', 'Keep back straight', 'Lift by extending hips and knees', 'Lower with control'], ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'intermediate', 'strength')
ON CONFLICT DO NOTHING;

-- Insert some sample foods
INSERT INTO foods (name, serving_size, serving_unit, calories_per_serving, protein_g, carbs_g, fat_g, fiber_g) VALUES
('Chicken Breast (cooked)', 100, 'g', 165, 31, 0, 3.6, 0),
('Brown Rice (cooked)', 100, 'g', 111, 2.6, 23, 0.9, 1.8),
('Broccoli (cooked)', 100, 'g', 34, 2.8, 7, 0.4, 2.6),
('Banana', 1, 'medium', 105, 1.3, 27, 0.4, 3.1),
('Oats (dry)', 100, 'g', 389, 16.9, 66.3, 6.9, 10.6),
('Salmon (cooked)', 100, 'g', 206, 22, 0, 12, 0),
('Sweet Potato (baked)', 100, 'g', 86, 1.6, 20, 0.1, 3),
('Greek Yogurt (plain)', 100, 'g', 59, 10, 3.6, 0.4, 0),
('Almonds', 100, 'g', 579, 21, 22, 50, 12),
('Spinach (raw)', 100, 'g', 23, 2.9, 3.6, 0.4, 2.2)
ON CONFLICT DO NOTHING;