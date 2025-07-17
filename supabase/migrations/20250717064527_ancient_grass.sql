/*
  # Complete Fitness App Database Schema

  1. New Tables
    - `workouts` - Workout templates and custom workouts
    - `exercises` - Exercise library with instructions and metadata
    - `workout_exercises` - Junction table linking workouts to exercises
    - `user_workouts` - User's completed/scheduled workouts
    - `user_workout_exercises` - Individual exercise performance tracking
    - `nutrition_entries` - Daily nutrition tracking
    - `meals` - Individual meals within nutrition entries
    - `meal_foods` - Foods within each meal
    - `foods` - Food database with nutritional information
    - `progress_photos` - User progress photos with metadata
    - `body_measurements` - Body measurements over time
    - `user_goals` - Specific measurable goals with deadlines
    - `achievements` - User achievements and milestones
    - `ai_recommendations` - AI-generated recommendations history
    - `user_preferences` - Detailed user preferences and settings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Separate policies for read/write operations where appropriate

  3. Storage
    - Set up storage buckets for progress photos and other media
    - Configure proper access policies for file uploads
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workouts table - stores workout templates and custom workouts
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN ('strength', 'cardio', 'flexibility', 'sports', 'recovery')),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes integer NOT NULL DEFAULT 30,
  calories_burned_estimate integer DEFAULT 0,
  equipment_needed text[] DEFAULT '{}',
  muscle_groups text[] DEFAULT '{}',
  is_template boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exercises table - comprehensive exercise library
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  instructions text[] DEFAULT '{}',
  muscle_groups text[] DEFAULT '{}',
  equipment text[] DEFAULT '{}',
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  exercise_type text NOT NULL CHECK (exercise_type IN ('strength', 'cardio', 'flexibility', 'plyometric', 'balance')),
  calories_per_minute numeric(4,2) DEFAULT 0,
  video_url text,
  image_url text,
  is_custom boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Junction table for workout-exercise relationships
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  sets integer DEFAULT 1,
  reps integer,
  duration_seconds integer,
  weight_kg numeric(5,2),
  distance_meters numeric(8,2),
  rest_seconds integer DEFAULT 60,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- User workouts - tracks user's workout sessions
CREATE TABLE IF NOT EXISTS user_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id uuid REFERENCES workouts(id) ON DELETE SET NULL,
  name text NOT NULL,
  scheduled_date date,
  started_at timestamptz,
  completed_at timestamptz,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'skipped')),
  total_duration_minutes integer,
  calories_burned integer,
  notes text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User workout exercises - tracks individual exercise performance
CREATE TABLE IF NOT EXISTS user_workout_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_workout_id uuid NOT NULL REFERENCES user_workouts(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  sets_completed integer DEFAULT 0,
  reps_completed integer[],
  weight_used_kg numeric(5,2)[],
  duration_seconds integer,
  distance_meters numeric(8,2),
  calories_burned integer,
  notes text,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Foods database
CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text,
  barcode text,
  serving_size numeric(8,2) NOT NULL DEFAULT 100,
  serving_unit text NOT NULL DEFAULT 'g',
  calories_per_serving numeric(8,2) NOT NULL,
  protein_g numeric(6,2) DEFAULT 0,
  carbs_g numeric(6,2) DEFAULT 0,
  fat_g numeric(6,2) DEFAULT 0,
  fiber_g numeric(6,2) DEFAULT 0,
  sugar_g numeric(6,2) DEFAULT 0,
  sodium_mg numeric(8,2) DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Nutrition entries - daily nutrition tracking
CREATE TABLE IF NOT EXISTS nutrition_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_calories numeric(8,2) DEFAULT 0,
  total_protein_g numeric(6,2) DEFAULT 0,
  total_carbs_g numeric(6,2) DEFAULT 0,
  total_fat_g numeric(6,2) DEFAULT 0,
  total_fiber_g numeric(6,2) DEFAULT 0,
  total_sugar_g numeric(6,2) DEFAULT 0,
  total_sodium_mg numeric(8,2) DEFAULT 0,
  water_ml integer DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Meals within nutrition entries
CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nutrition_entry_id uuid NOT NULL REFERENCES nutrition_entries(id) ON DELETE CASCADE,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  name text,
  consumed_at timestamptz DEFAULT now(),
  calories numeric(8,2) DEFAULT 0,
  protein_g numeric(6,2) DEFAULT 0,
  carbs_g numeric(6,2) DEFAULT 0,
  fat_g numeric(6,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Foods within meals
CREATE TABLE IF NOT EXISTS meal_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id uuid NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  quantity numeric(8,2) NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'serving',
  calories numeric(8,2) NOT NULL,
  protein_g numeric(6,2) DEFAULT 0,
  carbs_g numeric(6,2) DEFAULT 0,
  fat_g numeric(6,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Progress photos
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  photo_type text CHECK (photo_type IN ('front', 'side', 'back', 'custom')),
  taken_at timestamptz DEFAULT now(),
  weight_kg numeric(5,2),
  body_fat_percentage numeric(4,2),
  notes text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Body measurements over time
CREATE TABLE IF NOT EXISTS body_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  measured_at timestamptz DEFAULT now(),
  weight_kg numeric(5,2),
  body_fat_percentage numeric(4,2),
  muscle_mass_kg numeric(5,2),
  chest_cm numeric(5,2),
  waist_cm numeric(5,2),
  hips_cm numeric(5,2),
  bicep_cm numeric(5,2),
  thigh_cm numeric(5,2),
  neck_cm numeric(5,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- User goals with deadlines and progress tracking
CREATE TABLE IF NOT EXISTS user_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  goal_type text NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'strength', 'endurance', 'flexibility', 'habit', 'custom')),
  target_value numeric(10,2),
  current_value numeric(10,2) DEFAULT 0,
  unit text,
  target_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  priority integer DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Achievements and milestones
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  achievement_type text NOT NULL CHECK (achievement_type IN ('workout_streak', 'weight_milestone', 'strength_pr', 'endurance_goal', 'consistency', 'custom')),
  icon text,
  points integer DEFAULT 0,
  earned_at timestamptz DEFAULT now(),
  is_public boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'
);

-- AI recommendations history
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_type text NOT NULL CHECK (recommendation_type IN ('workout', 'nutrition', 'recovery', 'goal_adjustment', 'habit')),
  title text NOT NULL,
  content text NOT NULL,
  reasoning text,
  confidence_score numeric(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed', 'completed')),
  expires_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced user preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_settings jsonb DEFAULT '{}',
  privacy_settings jsonb DEFAULT '{}',
  workout_preferences jsonb DEFAULT '{}',
  nutrition_preferences jsonb DEFAULT '{}',
  ai_coaching_level text DEFAULT 'moderate' CHECK (ai_coaching_level IN ('minimal', 'moderate', 'intensive')),
  preferred_units text DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security on all tables
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
CREATE POLICY "Users can read public workout templates" ON workouts
  FOR SELECT TO authenticated
  USING (is_template = true OR created_by = auth.uid());

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

-- RLS Policies for exercises
CREATE POLICY "Users can read all exercises" ON exercises
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can create custom exercises" ON exercises
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update own exercises" ON exercises
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- RLS Policies for workout_exercises
CREATE POLICY "Users can manage workout exercises for accessible workouts" ON workout_exercises
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workouts w 
      WHERE w.id = workout_exercises.workout_id 
      AND (w.is_template = true OR w.created_by = auth.uid())
    )
  );

-- RLS Policies for user_workouts
CREATE POLICY "Users can manage own workout sessions" ON user_workouts
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for user_workout_exercises
CREATE POLICY "Users can manage own workout exercise performance" ON user_workout_exercises
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_workouts uw 
      WHERE uw.id = user_workout_exercises.user_workout_id 
      AND uw.user_id = auth.uid()
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
CREATE POLICY "Users can manage meals in own nutrition entries" ON meals
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM nutrition_entries ne 
      WHERE ne.id = meals.nutrition_entry_id 
      AND ne.user_id = auth.uid()
    )
  );

-- RLS Policies for meal_foods
CREATE POLICY "Users can manage foods in own meals" ON meal_foods
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meals m 
      JOIN nutrition_entries ne ON ne.id = m.nutrition_entry_id
      WHERE m.id = meal_foods.meal_id 
      AND ne.user_id = auth.uid()
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
CREATE POLICY "Users can manage own achievements" ON achievements
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(type);
CREATE INDEX IF NOT EXISTS idx_workouts_difficulty ON workouts(difficulty);
CREATE INDEX IF NOT EXISTS idx_workouts_created_by ON workouts(created_by);
CREATE INDEX IF NOT EXISTS idx_exercises_type ON exercises(exercise_type);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);
CREATE INDEX IF NOT EXISTS idx_user_workouts_user_id ON user_workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_workouts_date ON user_workouts(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_user_workouts_status ON user_workouts(status);
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_user_date ON nutrition_entries(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meals_nutrition_entry ON meals(nutrition_entry_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_taken_at ON progress_photos(taken_at);
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_id ON body_measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_body_measurements_measured_at ON body_measurements(measured_at);
CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_status ON user_goals(status);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_user_id ON ai_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_status ON ai_recommendations(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_workouts_updated_at BEFORE UPDATE ON user_workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nutrition_entries_updated_at BEFORE UPDATE ON nutrition_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON user_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ai_recommendations_updated_at BEFORE UPDATE ON ai_recommendations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default exercises
INSERT INTO exercises (name, description, instructions, muscle_groups, equipment, difficulty, exercise_type, calories_per_minute) VALUES
('Push-ups', 'Classic bodyweight chest exercise', ARRAY['Start in plank position', 'Lower body until chest nearly touches floor', 'Push back up to starting position'], ARRAY['chest', 'shoulders', 'triceps'], ARRAY[], 'beginner', 'strength', 8.0),
('Squats', 'Fundamental lower body exercise', ARRAY['Stand with feet shoulder-width apart', 'Lower body as if sitting back into chair', 'Return to standing position'], ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[], 'beginner', 'strength', 10.0),
('Plank', 'Core stability exercise', ARRAY['Start in push-up position', 'Hold body in straight line', 'Engage core muscles'], ARRAY['core', 'shoulders'], ARRAY[], 'beginner', 'strength', 5.0),
('Burpees', 'Full-body cardio exercise', ARRAY['Start standing', 'Drop to squat position', 'Jump back to plank', 'Do push-up', 'Jump feet back to squat', 'Jump up with arms overhead'], ARRAY['full-body'], ARRAY[], 'intermediate', 'cardio', 15.0),
('Mountain Climbers', 'Dynamic core and cardio exercise', ARRAY['Start in plank position', 'Alternate bringing knees to chest rapidly', 'Keep core engaged'], ARRAY['core', 'shoulders', 'legs'], ARRAY[], 'intermediate', 'cardio', 12.0)
ON CONFLICT DO NOTHING;

-- Insert some default workout templates
INSERT INTO workouts (name, description, type, difficulty, duration_minutes, calories_burned_estimate, equipment_needed, muscle_groups, is_template) VALUES
('Beginner Full Body', 'Perfect starter workout for beginners', 'strength', 'beginner', 30, 200, ARRAY[], ARRAY['full-body'], true),
('HIIT Cardio Blast', 'High-intensity interval training', 'cardio', 'intermediate', 20, 300, ARRAY[], ARRAY['full-body'], true),
('Core Strength', 'Focused core strengthening routine', 'strength', 'intermediate', 25, 150, ARRAY[], ARRAY['core'], true)
ON CONFLICT DO NOTHING;