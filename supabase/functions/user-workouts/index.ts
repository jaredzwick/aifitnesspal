import { createClient } from "npm:@supabase/supabase-js@2";
import { Kysely, PostgresDialect } from "npm:kysely";
import { Pool } from "npm:pg";
import type { Database as KyselyDatabase } from "../../database/kysely.ts";
import type { Database as SupabaseDatabase } from "../../database/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { WORKOUT_STATUS } from "../../../common/constants.ts";
import { WeeklyWorkoutPlan } from "../../../common/types.ts";

export const kysely = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: Deno.env.get("SUPABASE_DB_URL") ?? "",
    }),
  }),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<SupabaseDatabase>(
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

    switch (req.method) {
      case "POST": {
        // Create user workout when user clicks "Start Workout" on a workout day
        const workoutData = await req.json();
        console.log(workoutData);
        const response = await kysely
          .insertInto("user_workouts")
          .values({
            user_id: user.user.id,
            ...workoutData,
          })
          .returningAll()
          .executeTakeFirst();

        return new Response(JSON.stringify(response), {
          status: 201,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "GET": {
        // Get active user workout
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
          .toISOString();
        const response = await kysely
          .selectFrom("user_workouts")
          .where("user_id", "=", user.user.id)
          .where("status", "=", WORKOUT_STATUS.IN_PROGRESS)
          .where("started_at", ">", twentyFourHoursAgo)
          .orderBy("started_at", "desc")
          .selectAll()
          .executeTakeFirst();

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      case "PUT": {
        // Update user workout - extract ID from URL path
        const url = new URL(req.url);
        const pathParts = url.pathname.split("/");
        const workoutId = pathParts[pathParts.length - 1];

        if (!workoutId) {
          return new Response(
            JSON.stringify({ error: "Workout ID is required" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        const workoutData: WeeklyWorkoutPlan = await req.json();

        // Fetch the current exercises array
        const currentWorkout = await kysely
          .selectFrom("user_workouts")
          .where("id", "=", workoutId)
          .where("user_id", "=", user.user.id)
          .select("exercises")
          .executeTakeFirst();

        if (!currentWorkout) {
          return new Response(JSON.stringify({ error: "Workout not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Parse the exercises array and update the matching day
        const exercisesArray = currentWorkout.exercises as WeeklyWorkoutPlan[];
        const updatedExercises = exercisesArray.map((exercise) => {
          if (exercise.day === workoutData.day) {
            // Update the workout for the matching day
            return {
              ...exercise,
              workout: workoutData.workout,
            };
          }
          return exercise; // Keep other days unchanged
        });

        // Build update query dynamically to handle both persistCompletedSet and completeWorkout
        const updateQuery = kysely
          .updateTable("user_workouts")
          .set({
            exercises: JSON.stringify(updatedExercises),
          })
          .where("id", "=", workoutId)
          .where("user_id", "=", user.user.id);

        const response = await updateQuery
          .returningAll()
          .executeTakeFirst();

        if (!response) {
          return new Response(
            JSON.stringify({ error: "Workout not found or access denied" }),
            {
              status: 404,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }

        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
