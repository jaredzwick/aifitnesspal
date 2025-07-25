import { createClient } from "npm:@supabase/supabase-js@2";
import { Kysely, PostgresDialect } from "npm:kysely";
import { Pool } from "npm:pg";
import type { Database as KyselyDatabase } from "../../database/kysely.ts";
import type { Database as SupabaseDatabase } from "../../database/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";

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
          .where("status", "=", "in_progress")
          .where("started_at", ">", twentyFourHoursAgo)
          .selectAll()
          .executeTakeFirst();

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
