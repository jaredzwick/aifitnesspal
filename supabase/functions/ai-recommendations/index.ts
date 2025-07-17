import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface WorkoutRecommendationRequest {
  goals: string[];
  fitness_level: string;
  available_time: number;
  equipment: string[];
  preferences: string[];
}

interface NutritionRecommendationRequest {
  menu_items: string[];
  dietary_restrictions: string[];
  goals: string[];
  current_macros?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface BodyAnalysisRequest {
  image_url: string;
  goals: string[];
  current_measurements?: {
    weight: number;
    height: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: user } = await supabaseClient.auth.getUser();
    if (!user.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const endpoint = segments[segments.length - 1];

    switch (req.method) {
      case 'GET':
        if (endpoint === 'recommendations') {
          // Get user's AI recommendations
          const status = url.searchParams.get('status');
          const type = url.searchParams.get('type');

          let query = supabaseClient
            .from('ai_recommendations')
            .select('*')
            .eq('user_id', user.user.id)
            .order('created_at', { ascending: false });

          if (status) query = query.eq('status', status);
          if (type) query = query.eq('recommendation_type', type);

          const { data, error } = await query;
          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'POST':
        const requestData = await req.json();

        if (endpoint === 'workout-plan') {
          // Generate workout plan recommendation
          const request: WorkoutRecommendationRequest = requestData;
          
          // Simulate AI workout recommendation logic
          const workoutRecommendation = generateWorkoutRecommendation(request);
          
          // Save recommendation to database
          const { data, error } = await supabaseClient
            .from('ai_recommendations')
            .insert({
              user_id: user.user.id,
              recommendation_type: 'workout',
              title: 'Personalized Workout Plan',
              content: JSON.stringify(workoutRecommendation),
              reasoning: `Based on your ${request.fitness_level} fitness level and ${request.available_time} minutes available time`,
              confidence_score: 0.85,
              metadata: { request },
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({
            recommendation: workoutRecommendation,
            saved_recommendation: data,
          }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (endpoint === 'nutrition-advice') {
          // Generate nutrition recommendation from menu
          const request: NutritionRecommendationRequest = requestData;
          
          const nutritionRecommendation = generateNutritionRecommendation(request);
          
          // Save recommendation
          const { data, error } = await supabaseClient
            .from('ai_recommendations')
            .insert({
              user_id: user.user.id,
              recommendation_type: 'nutrition',
              title: 'Menu Recommendations',
              content: JSON.stringify(nutritionRecommendation),
              reasoning: 'Based on your dietary preferences and fitness goals',
              confidence_score: 0.80,
              metadata: { request },
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({
            recommendation: nutritionRecommendation,
            saved_recommendation: data,
          }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else if (endpoint === 'body-analysis') {
          // Analyze body photo and generate recommendations
          const request: BodyAnalysisRequest = requestData;
          
          const bodyAnalysis = generateBodyAnalysis(request);
          
          // Save recommendation
          const { data, error } = await supabaseClient
            .from('ai_recommendations')
            .insert({
              user_id: user.user.id,
              recommendation_type: 'workout',
              title: 'Body Analysis Workout Plan',
              content: JSON.stringify(bodyAnalysis),
              reasoning: 'Based on your body composition analysis and stated goals',
              confidence_score: 0.75,
              metadata: { request },
            })
            .select()
            .single();

          if (error) throw error;

          return new Response(JSON.stringify({
            analysis: bodyAnalysis,
            saved_recommendation: data,
          }), {
            status: 201,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        break;

      case 'PUT':
        // Update recommendation status (accept/dismiss)
        const updateData = await req.json();
        const id = url.searchParams.get('id');

        const { data, error } = await supabaseClient
          .from('ai_recommendations')
          .update(updateData)
          .eq('id', id)
          .eq('user_id', user.user.id)
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simulated AI recommendation functions
function generateWorkoutRecommendation(request: WorkoutRecommendationRequest) {
  const { goals, fitness_level, available_time, equipment, preferences } = request;
  
  // This would be replaced with actual AI logic
  const workouts = [];
  
  if (goals.includes('weight-loss')) {
    workouts.push({
      name: 'HIIT Fat Burner',
      duration: Math.min(available_time, 25),
      exercises: ['Burpees', 'Mountain Climbers', 'Jump Squats'],
      intensity: fitness_level === 'beginner' ? 'moderate' : 'high',
    });
  }
  
  if (goals.includes('muscle-gain')) {
    workouts.push({
      name: 'Strength Builder',
      duration: Math.min(available_time, 45),
      exercises: ['Push-ups', 'Squats', 'Planks'],
      intensity: fitness_level === 'advanced' ? 'high' : 'moderate',
    });
  }
  
  return {
    recommended_workouts: workouts,
    weekly_schedule: generateWeeklySchedule(workouts, available_time),
    tips: [
      'Start with proper warm-up',
      'Focus on form over speed',
      'Stay hydrated throughout',
    ],
  };
}

function generateNutritionRecommendation(request: NutritionRecommendationRequest) {
  const { menu_items, dietary_restrictions, goals } = request;
  
  // Simulate menu analysis
  const recommendations = menu_items.map(item => ({
    item,
    recommendation: goals.includes('weight-loss') ? 'moderate' : 'good',
    calories_estimate: Math.floor(Math.random() * 600) + 200,
    protein_estimate: Math.floor(Math.random() * 30) + 10,
    notes: `Fits your ${goals.join(', ')} goals`,
  }));
  
  return {
    menu_analysis: recommendations,
    best_choices: recommendations.filter(r => r.recommendation === 'good').slice(0, 3),
    alternatives: [
      'Grilled chicken salad',
      'Quinoa bowl with vegetables',
      'Lean protein with steamed vegetables',
    ],
  };
}

function generateBodyAnalysis(request: BodyAnalysisRequest) {
  const { goals, current_measurements } = request;
  
  // Simulate body analysis (in real implementation, this would use computer vision)
  return {
    analysis: {
      body_composition: 'Average muscle definition',
      areas_to_focus: ['Core strength', 'Upper body'],
      estimated_body_fat: '15-20%',
    },
    recommended_plan: {
      focus_areas: ['Core', 'Upper body'],
      workout_frequency: '4-5 times per week',
      duration: '30-45 minutes',
    },
    exercises: [
      'Planks for core strength',
      'Push-ups for upper body',
      'Squats for lower body',
    ],
  };
}

function generateWeeklySchedule(workouts: any[], available_time: number) {
  const days = ['Monday', 'Wednesday', 'Friday'];
  return days.map((day, index) => ({
    day,
    workout: workouts[index % workouts.length],
    duration: available_time,
  }));
}