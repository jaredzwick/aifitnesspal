@@ .. @@
 -- Sample exercises
 INSERT INTO exercises (name, description, instructions, muscle_groups, equipment_needed, difficulty_level, exercise_type) VALUES
-('Push-ups', 'Classic bodyweight chest exercise', ARRAY['Start in plank position', 'Lower body to ground', 'Push back up', 'Repeat'], ARRAY['chest', 'shoulders', 'triceps'], ARRAY[], 'beginner', 'strength'),
-('Squats', 'Fundamental lower body exercise', ARRAY['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up', 'Return to standing'], ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[], 'beginner', 'strength'),
-('Plank', 'Core stability exercise', ARRAY['Start in push-up position', 'Hold body straight', 'Engage core muscles', 'Breathe normally'], ARRAY['core', 'shoulders'], ARRAY[], 'beginner', 'strength'),
-('Jumping Jacks', 'Full body cardio exercise', ARRAY['Start with feet together', 'Jump feet apart while raising arms', 'Jump back to start position', 'Repeat rapidly'], ARRAY['full body'], ARRAY[], 'beginner', 'cardio'),
-('Burpees', 'High intensity full body exercise', ARRAY['Start standing', 'Drop to squat position', 'Jump back to plank', 'Do push-up', 'Jump feet to squat', 'Jump up with arms overhead'], ARRAY['full body'], ARRAY[], 'intermediate', 'cardio'),
-('Deadlifts', 'Compound strength exercise', ARRAY['Stand with feet hip-width apart', 'Hold barbell with overhand grip', 'Hinge at hips and lower bar', 'Drive hips forward to return'], ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'intermediate', 'strength'),
-('Pull-ups', 'Upper body pulling exercise', ARRAY['Hang from pull-up bar', 'Pull body up until chin over bar', 'Lower with control', 'Repeat'], ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'intermediate', 'strength'),
-('Mountain Climbers', 'Dynamic core and cardio exercise', ARRAY['Start in plank position', 'Bring one knee to chest', 'Switch legs rapidly', 'Keep core engaged'], ARRAY['core', 'shoulders'], ARRAY[], 'beginner', 'cardio');
+('Push-ups', 'Classic bodyweight chest exercise', ARRAY['Start in plank position', 'Lower body to ground', 'Push back up', 'Repeat'], ARRAY['chest', 'shoulders', 'triceps'], ARRAY[]::text[], 'beginner', 'strength'),
+('Squats', 'Fundamental lower body exercise', ARRAY['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Keep chest up', 'Return to standing'], ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY[]::text[], 'beginner', 'strength'),
+('Plank', 'Core stability exercise', ARRAY['Start in push-up position', 'Hold body straight', 'Engage core muscles', 'Breathe normally'], ARRAY['core', 'shoulders'], ARRAY[]::text[], 'beginner', 'strength'),
+('Jumping Jacks', 'Full body cardio exercise', ARRAY['Start with feet together', 'Jump feet apart while raising arms', 'Jump back to start position', 'Repeat rapidly'], ARRAY['full body'], ARRAY[]::text[], 'beginner', 'cardio'),
+('Burpees', 'High intensity full body exercise', ARRAY['Start standing', 'Drop to squat position', 'Jump back to plank', 'Do push-up', 'Jump feet to squat', 'Jump up with arms overhead'], ARRAY['full body'], ARRAY[]::text[], 'intermediate', 'cardio'),
+('Deadlifts', 'Compound strength exercise', ARRAY['Stand with feet hip-width apart', 'Hold barbell with overhand grip', 'Hinge at hips and lower bar', 'Drive hips forward to return'], ARRAY['hamstrings', 'glutes', 'back'], ARRAY['barbell'], 'intermediate', 'strength'),
+('Pull-ups', 'Upper body pulling exercise', ARRAY['Hang from pull-up bar', 'Pull body up until chin over bar', 'Lower with control', 'Repeat'], ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'intermediate', 'strength'),
+('Mountain Climbers', 'Dynamic core and cardio exercise', ARRAY['Start in plank position', 'Bring one knee to chest', 'Switch legs rapidly', 'Keep core engaged'], ARRAY['core', 'shoulders'], ARRAY[]::text[], 'beginner', 'cardio');
 
 -- Sample foods
 INSERT INTO foods (name, brand, barcode, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fiber_per_100g, sugar_per_100g, sodium_per_100g, serving_size_g, serving_unit) VALUES