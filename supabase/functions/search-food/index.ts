import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { Kysely, PostgresDialect, sql } from "npm:kysely";
import { Pool } from "npm:pg";
import type { Database as KyselyDatabase } from "../../database/kysely.ts";
import type { Database as SupabaseDatabase } from "../../database/supabase.ts";
import { corsHeaders } from "../_shared/cors.ts";
console.log("Hello from Functions!");

export const kysely = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: Deno.env.get("SUPABASE_DB_URL") ?? "",
    }),
  }),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const query = url.searchParams.get("query");
  const limit = parseInt(url.searchParams.get("limit") || "10");

  if (!query || query.length < 2) {
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const cleanQuery = normalize(query);

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

  try {
    // Use hybrid search with deduplication
    const results = await sql`
      SELECT DISTINCT ON (category, SUBSTRING(description, 1, 20))
        id, description, category, kilocalories, protein, carbohydrate, total_lipid as total_fat
      FROM hybrid_search(${cleanQuery}, ${0.2}, ${limit * 2})
      ORDER BY category, SUBSTRING(description, 1, 20), similarity DESC
      LIMIT ${limit}
    `.execute(kysely);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching food data:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
// Normalization function
function normalize(term: string): string {
  return term.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(ml?|g|grams?|oz|cups?)\b/g, "");
}
