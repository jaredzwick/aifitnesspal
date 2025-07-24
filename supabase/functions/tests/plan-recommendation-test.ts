// Import required libraries and modules
import { assert, assertEquals } from "jsr:@std/assert@1";
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";
import { recommendPlan } from "../../services/plan-recommendation-service.ts";
import { mockFitnessUser } from "./mocks/mockFitnessUser.ts";
// Will load the .env file to Deno.env
import "jsr:@std/dotenv/load";
import { FITNESS_GOALS } from "../../../common/constants.ts";

// Set up the configuration for the Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
};

// Test the creation and functionality of the Supabase client
const testClientCreation = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options,
  );
  // Verify if the Supabase URL and key are provided
  if (!supabaseUrl) throw new Error("supabaseUrl is required.");
  if (!supabaseKey) throw new Error("supabaseKey is required.");
  // Test a simple query to the database
  const { data: table_data, error: table_error } = await client
    .from("progress_photos")
    .select("*")
    .limit(1);

  console.log(table_data);
  if (table_error) {
    throw new Error("Invalid Supabase client: " + table_error.message);
  }
  assert(table_data, "Data should be returned from the query.");
};

// Test the 'hello-world' function
const testHelloWorld = async () => {
  const client: SupabaseClient = createClient(
    supabaseUrl,
    supabaseKey,
    options,
  );
  // Invoke the 'hello-world' function with a parameter
  const { data: func_data, error: func_error } = await client.functions.invoke(
    "hello-world",
    {
      body: { name: "bar" },
    },
  );
  // Check for errors from the function invocation
  if (func_error) {
    throw new Error("Invalid response: " + func_error.message);
  }
  // Log the response from the function
  console.log(JSON.stringify(func_data, null, 2));
  // Assert that the function returned the expected result
  assertEquals(func_data.message, "Hello bar!");
};

const testPlanRecommendationService = async () => {
  const result = await recommendPlan(mockFitnessUser);
  console.log(result);

  // === TRAINING REGIMEN TESTS ===
  // Verify the training regimen has exactly 7 days
  assertEquals(result.trainingRegimen.length, 7);

  // Count workout days and rest days
  const workoutDays = result.trainingRegimen.filter((day) =>
    day.workout !== undefined
  );
  const restDays = result.trainingRegimen.filter((day) =>
    day.workout === undefined
  );

  // Verify exactly 5 workout days and 2 rest days
  assertEquals(workoutDays.length, 4, "Should have exactly 4 workout days");
  assertEquals(restDays.length, 3, "Should have exactly 3 rest days");

  // Verify each day has a day property
  result.trainingRegimen.forEach((day, index) => {
    assert(day.day, `Day ${index + 1} should have a day property`);
  });

  // Verify workout days have exercise arrays
  workoutDays.forEach((day) => {
    assert(
      Array.isArray(day.workout),
      "Workout days should have an array of exercises",
    );
    assert(
      day.workout!.length > 0,
      "Workout days should have at least one exercise",
    );
  });

  // === NUTRITION REGIMEN TESTS ===
  const nutrition = result.nutritionRegimen;

  // Verify nutrition regimen exists and has required properties
  assert(nutrition, "Should have a nutrition regimen");
  assert(
    typeof nutrition.dailyCalorieTarget === "number",
    "Should have daily calorie target",
  );
  assert(
    nutrition.dailyCalorieTarget > 0,
    "Daily calorie target should be positive",
  );

  // Verify macro targets
  assert(nutrition.macroTargets, "Should have macro targets");
  assert(
    typeof nutrition.macroTargets.protein === "number",
    "Should have protein target",
  );
  assert(
    typeof nutrition.macroTargets.carbs === "number",
    "Should have carbs target",
  );
  assert(
    typeof nutrition.macroTargets.fat === "number",
    "Should have fat target",
  );
  assert(
    nutrition.macroTargets.protein > 0,
    "Protein target should be positive",
  );
  assert(nutrition.macroTargets.carbs > 0, "Carbs target should be positive");
  assert(nutrition.macroTargets.fat > 0, "Fat target should be positive");

  // Verify percentages add up to 100
  const totalPercentage = nutrition.macroTargets.proteinPercentage +
    nutrition.macroTargets.carbsPercentage +
    nutrition.macroTargets.fatPercentage;
  assertEquals(totalPercentage, 100, "Macro percentages should add up to 100");

  // Verify meal plan
  assert(Array.isArray(nutrition.mealPlan), "Should have a meal plan array");
  assertEquals(
    nutrition.mealPlan.length,
    4,
    "Should have 4 meals (breakfast, lunch, dinner, snack)",
  );

  const expectedMealTypes = ["breakfast", "lunch", "dinner", "snack"];
  nutrition.mealPlan.forEach((meal) => {
    assert(
      expectedMealTypes.includes(meal.mealType),
      `Invalid meal type: ${meal.mealType}`,
    );
    assert(
      typeof meal.targetCalories === "number",
      "Meal should have target calories",
    );
    assert(meal.targetCalories > 0, "Meal target calories should be positive");
    assert(meal.targetMacros, "Meal should have target macros");
    assert(
      Array.isArray(meal.suggestions),
      "Meal should have suggestions array",
    );
    assert(
      meal.suggestions.length > 0,
      "Meal should have at least one suggestion",
    );

    // Verify meal suggestions structure
    meal.suggestions.forEach((suggestion) => {
      assert(
        typeof suggestion.name === "string",
        "Suggestion should have a name",
      );
      assert(
        Array.isArray(suggestion.ingredients),
        "Suggestion should have ingredients array",
      );
      assert(
        typeof suggestion.calories === "number",
        "Suggestion should have calories",
      );
      assert(suggestion.macros, "Suggestion should have macros");
      assert(
        typeof suggestion.prepTime === "number",
        "Suggestion should have prep time",
      );
      assert(
        ["easy", "medium", "hard"].includes(suggestion.difficulty),
        "Suggestion should have valid difficulty",
      );
    });
  });

  // Verify hydration target
  assert(
    typeof nutrition.hydrationTarget === "number",
    "Should have hydration target",
  );
  assert(
    nutrition.hydrationTarget >= 2,
    "Hydration target should be at least 2L",
  );

  // Verify supplements
  assert(Array.isArray(nutrition.supplements), "Should have supplements array");
  assert(
    nutrition.supplements.length > 0,
    "Should have at least one supplement",
  );
  assert(
    nutrition.supplements.includes("Multivitamin"),
    "Should include basic multivitamin",
  );
  assert(
    nutrition.supplements.includes("Omega-3"),
    "Should include basic omega-3",
  );

  // Verify goal-specific supplements for muscle building
  if (mockFitnessUser.goal === FITNESS_GOALS.MUSCLE_GROWTH) {
    assert(
      nutrition.supplements.includes("Creatine"),
      "Should include creatine for muscle growth",
    );
  }

  console.log("✅ All training and nutrition tests passed!");
};

// Deno.test('Client Creation Test', testClientCreation)
// Deno.test('Hello-world Function Test', testHelloWorld)
Deno.test("Plan Recommendation Service Test", testPlanRecommendationService);
