export type PersonalizedPlan = {
  trainingRegimen: WeeklyWorkoutPlan[];
  nutritionRegimen: NutritionRegimen;
};

export type WeeklyWorkoutPlan = {
  day: string;
  workout: ExerciseTemplate[] | undefined; // undefined = rest day
};

export type ExerciseTemplate = {
  name: string;
  type: "strength" | "cardio" | "flexibility";
  sets?: number;
  reps?: number;
  duration?: number; // for cardio/time-based exercises
  restTime: number;
  instructions: string[];
  modifications: {
    beginner?: string;
    advanced?: string;
  };
};

export type NutritionRegimen = {
  dailyCalorieTarget: number;
  macroTargets: {
    protein: number; // grams
    carbs: number; // grams
    fat: number; // grams
    proteinPercentage: number;
    carbsPercentage: number;
    fatPercentage: number;
  };
  mealPlan: MealPlanTemplate[];
  hydrationTarget: number; // liters
  supplements?: string[];
};

export type MealPlanTemplate = {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: MealSuggestion[];
};

export type MealSuggestion = {
  name: string;
  ingredients: string[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: number;
  difficulty: "easy" | "medium" | "hard";
};
