import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: string;
          difficulty: string;
          duration_minutes: number;
          calories_burned_estimate: number;
          equipment_needed: string[];
          muscle_groups: string[];
          is_template: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string;
          type: string;
          difficulty: string;
          duration_minutes?: number;
          calories_burned_estimate?: number;
          equipment_needed?: string[];
          muscle_groups?: string[];
          is_template?: boolean;
          created_by?: string;
        };
        Update: {
          name?: string;
          description?: string;
          type?: string;
          difficulty?: string;
          duration_minutes?: number;
          calories_burned_estimate?: number;
          equipment_needed?: string[];
          muscle_groups?: string[];
        };
      };
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    const workoutId = segments[segments.length - 1];

    switch (req.method) {
      case 'GET':
        if (workoutId && workoutId !== 'workouts') {
          // Get specific workout
          const { data, error } = await supabaseClient
            .from('workouts')
            .select(`
              *,
              workout_exercises (
                *,
                exercises (*)
              )
            `)
            .eq('id', workoutId)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } else {
          // Get all workouts with filters
          const type = url.searchParams.get('type');
          const difficulty = url.searchParams.get('difficulty');
          const isTemplate = url.searchParams.get('is_template');

          let query = supabaseClient
            .from('workouts')
            .select('*')
            .order('created_at', { ascending: false });

          if (type) query = query.eq('type', type);
          if (difficulty) query = query.eq('difficulty', difficulty);
          if (isTemplate !== null) query = query.eq('is_template', isTemplate === 'true');

          const { data, error } = await query;

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

      case 'POST':
        const { data: user } = await supabaseClient.auth.getUser();
        if (!user.user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const workoutData = await req.json();
        const { data, error } = await supabaseClient
          .from('workouts')
          .insert({
            ...workoutData,
            created_by: user.user.id,
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify(data), {
          status: 201,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'PUT':
        const updateData = await req.json();
        const { data: updatedWorkout, error: updateError } = await supabaseClient
          .from('workouts')
          .update(updateData)
          .eq('id', workoutId)
          .select()
          .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify(updatedWorkout), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'DELETE':
        const { error: deleteError } = await supabaseClient
          .from('workouts')
          .delete()
          .eq('id', workoutId);

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