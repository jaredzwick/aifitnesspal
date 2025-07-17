import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

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
    const setId = segments[segments.length - 1];

    switch (req.method) {
      case 'GET':
        // Get sets for a specific user workout exercise
        const exerciseId = url.searchParams.get('exercise_id');
        
        if (!exerciseId) {
          return new Response(JSON.stringify({ error: 'exercise_id parameter required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: sets, error: setsError } = await supabaseClient
          .from('user_workout_sets')
          .select(`
            *,
            user_workout_exercises!inner (
              user_workouts!inner (
                user_id
              )
            )
          `)
          .eq('user_workout_exercise_id', exerciseId)
          .eq('user_workout_exercises.user_workouts.user_id', user.user.id)
          .order('set_number');

        if (setsError) throw setsError;

        return new Response(JSON.stringify(sets), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'POST':
        const setData = await req.json();
        
        // Verify the exercise belongs to the user
        const { data: exercise, error: exerciseError } = await supabaseClient
          .from('user_workout_exercises')
          .select(`
            *,
            user_workouts!inner (
              user_id
            )
          `)
          .eq('id', setData.user_workout_exercise_id)
          .eq('user_workouts.user_id', user.user.id)
          .single();

        if (exerciseError || !exercise) {
          return new Response(JSON.stringify({ error: 'Exercise not found or unauthorized' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { data: newSet, error: createError } = await supabaseClient
          .from('user_workout_sets')
          .insert(setData)
          .select()
          .single();

        if (createError) throw createError;

        return new Response(JSON.stringify(newSet), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        const updateData = await req.json();
        
        // Verify the set belongs to the user
        const { data: existingSet, error: setError } = await supabaseClient
          .from('user_workout_sets')
          .select(`
            *,
            user_workout_exercises!inner (
              user_workouts!inner (
                user_id
              )
            )
          `)
          .eq('id', setId)
          .eq('user_workout_exercises.user_workouts.user_id', user.user.id)
          .single();

        if (setError || !existingSet) {
          return new Response(JSON.stringify({ error: 'Set not found or unauthorized' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // If marking as completed, set completed_at timestamp
        if (updateData.completed && !existingSet.completed) {
          updateData.completed_at = new Date().toISOString();
        }

        const { data: updatedSet, error: updateError } = await supabaseClient
          .from('user_workout_sets')
          .update(updateData)
          .eq('id', setId)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify(updatedSet), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        // Verify the set belongs to the user before deleting
        const { data: setToDelete, error: verifyError } = await supabaseClient
          .from('user_workout_sets')
          .select(`
            *,
            user_workout_exercises!inner (
              user_workouts!inner (
                user_id
              )
            )
          `)
          .eq('id', setId)
          .eq('user_workout_exercises.user_workouts.user_id', user.user.id)
          .single();

        if (verifyError || !setToDelete) {
          return new Response(JSON.stringify({ error: 'Set not found or unauthorized' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const { error: deleteError } = await supabaseClient
          .from('user_workout_sets')
          .delete()
          .eq('id', setId);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});