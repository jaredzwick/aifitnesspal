import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface Database {
  public: {
    Tables: {
      user_workouts: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          scheduled_for: string | null;
          started_at: string | null;
          completed_at: string | null;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          workout_id: string;
          scheduled_for?: string;
          started_at?: string;
          completed_at?: string;
          status?: string;
          notes?: string;
        };
        Update: {
          scheduled_for?: string;
          started_at?: string;
          completed_at?: string;
          status?: string;
          notes?: string;
        };
      };
      user_workout_exercises: {
        Row: {
          id: string;
          user_workout_id: string;
          exercise_id: string;
          order_index: number;
          target_sets: number;
          target_reps: number | null;
          target_weight: number | null;
          target_duration: number | null;
          target_distance: number | null;
          rest_time: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          user_workout_id: string;
          exercise_id: string;
          order_index: number;
          target_sets: number;
          target_reps?: number;
          target_weight?: number;
          target_duration?: number;
          target_distance?: number;
          rest_time?: number;
          notes?: string;
        };
        Update: {
          target_sets?: number;
          target_reps?: number;
          target_weight?: number;
          target_duration?: number;
          target_distance?: number;
          rest_time?: number;
          notes?: string;
        };
      };
      user_workout_sets: {
        Row: {
          id: string;
          user_workout_exercise_id: string;
          set_number: number;
          reps: number | null;
          weight: number | null;
          duration: number | null;
          distance: number | null;
          rest_time: number | null;
          completed: boolean;
          completed_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          user_workout_exercise_id: string;
          set_number: number;
          reps?: number;
          weight?: number;
          duration?: number;
          distance?: number;
          rest_time?: number;
          completed?: boolean;
          completed_at?: string;
          notes?: string;
        };
        Update: {
          reps?: number;
          weight?: number;
          duration?: number;
          distance?: number;
          rest_time?: number;
          completed?: boolean;
          completed_at?: string;
          notes?: string;
        };
      };
    };
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const { data: user } = await supabaseClient.auth.getUser();
    if (!user.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const userWorkoutId = segments[segments.length - 1];

    switch (req.method) {
      case "GET":
        if (userWorkoutId && userWorkoutId !== "user-workouts") {
          // Get specific user workout with full details
          const { data, error } = await supabaseClient
            .from("user_workouts")
            .select(`
              *,
              workouts (
                *,
                workout_exercises (
                  *,
                  exercises (*)
                )
              ),
              user_workout_exercises (
                *,
                exercises (*),
                user_workout_sets (*)
              )
            `)
            .eq("id", userWorkoutId)
            .eq("user_id", user.user.id)
            .single();

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          // Get user workouts with filters
          const status = url.searchParams.get("status");
          const date = url.searchParams.get("date");
          const limit = url.searchParams.get("limit");

          let query = supabaseClient
            .from("user_workouts")
            .select(`
              *,
              workouts (
                name,
                type,
                difficulty,
                duration_minutes,
                calories_burned_estimate
              )
            `)
            .eq("user_id", user.user.id)
            .order("created_at", { ascending: false });

          if (status) query = query.eq("status", status);
          if (date) {
            query = query.gte("scheduled_for", date).lt(
              "scheduled_for",
              `${date}T23:59:59`,
            );
          }
          if (limit) query = query.limit(parseInt(limit));

          const { data, error } = await query;

          if (error) throw error;

          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

      case "POST":
        const workoutData = await req.json();

        // Create user workout
        const { data: newUserWorkout, error: createError } =
          await supabaseClient
            .from("user_workouts")
            .insert({
              ...workoutData,
              user_id: user.user.id,
            })
            .select()
            .single();

        if (createError) throw createError;

        // If this is starting a workout, copy exercises from workout template
        if (
          workoutData.status === "in_progress" ||
          workoutData.status === "scheduled"
        ) {
          const { data: workoutExercises } = await supabaseClient
            .from("workout_exercises")
            .select("*, exercises(*)")
            .eq("workout_id", workoutData.workout_id)
            .order("order_index");

          if (workoutExercises) {
            // Create user workout exercises
            const userWorkoutExercises = workoutExercises.map((we) => ({
              user_workout_id: newUserWorkout.id,
              exercise_id: we.exercise_id,
              order_index: we.order_index,
              target_sets: we.target_sets,
              target_reps: we.target_reps,
              target_weight: we.target_weight,
              target_duration: we.target_duration,
              target_distance: we.target_distance,
              rest_time: we.rest_time,
            }));

            const { data: createdExercises } = await supabaseClient
              .from("user_workout_exercises")
              .insert(userWorkoutExercises)
              .select();

            // Create initial sets for each exercise
            if (createdExercises) {
              const allSets = [];
              for (const exercise of createdExercises) {
                for (let i = 1; i <= exercise.target_sets; i++) {
                  allSets.push({
                    user_workout_exercise_id: exercise.id,
                    set_number: i,
                    reps: exercise.target_reps,
                    weight: exercise.target_weight,
                    duration: exercise.target_duration,
                    distance: exercise.target_distance,
                    completed: false,
                  });
                }
              }

              await supabaseClient
                .from("user_workout_sets")
                .insert(allSets);
            }
          }
        }

        return new Response(JSON.stringify(newUserWorkout), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "PUT":
        const updateData = await req.json();

        const { data: updatedWorkout, error: updateError } =
          await supabaseClient
            .from("user_workouts")
            .update({
              ...updateData,
              updated_at: new Date().toISOString(),
            })
            .eq("id", userWorkoutId)
            .eq("user_id", user.user.id)
            .select()
            .single();

        if (updateError) throw updateError;

        return new Response(JSON.stringify(updatedWorkout), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "DELETE":
        const { error: deleteError } = await supabaseClient
          .from("user_workouts")
          .delete()
          .eq("id", userWorkoutId)
          .eq("user_id", user.user.id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
