/*
  # Create Storage Buckets for File Uploads

  1. Storage Buckets
    - `progress-photos` - User progress photos and body images
    - `meal-photos` - Food and meal photos for nutrition tracking
    - `workout-videos` - Custom workout videos and form checks

  2. Storage Policies
    - Users can upload to their own folders
    - Users can read their own files
    - Public read access for verified content
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('progress-photos', 'progress-photos', false),
  ('meal-photos', 'meal-photos', false),
  ('workout-videos', 'workout-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Progress photos policies
CREATE POLICY "Users can upload progress photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own progress photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own progress photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own progress photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Meal photos policies
CREATE POLICY "Users can upload meal photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'meal-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own meal photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'meal-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own meal photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'meal-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own meal photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'meal-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Workout videos policies
CREATE POLICY "Users can upload workout videos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'workout-videos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own workout videos" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'workout-videos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own workout videos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'workout-videos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own workout videos" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'workout-videos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );