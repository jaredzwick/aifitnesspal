import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createWeeklyTrainingSchedule } from "../../services/training/training.ts";
import { generateNutritionRegimen } from "../../services/nutrition/nutrition.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));

  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    console.log("req", req);
    const userData = await req.json();
    console.log("userData", userData);
    const trainingRegimen = createWeeklyTrainingSchedule(userData);
    const nutritionRegimen = generateNutritionRegimen(userData);

    const responseData = {
      trainingRegimen,
      nutritionRegimen,
    };
    console.log("responseData", responseData);
    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error generating plan recommendation:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate plan recommendation" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
