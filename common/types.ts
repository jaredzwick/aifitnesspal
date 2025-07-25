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
  numberOfSets?: number;
  reps?: number;
  duration?: number; // for cardio/time-based exercises
  restTime: number;
  instructions: string[];
  modifications: {
    beginner?: string;
    advanced?: string;
  };
  userSets?: WorkoutSet[];
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

export type WorkoutSet = {
  id: string;
  exercise_id: string;
  set_number: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rest_time?: number;
  completed: boolean;
  notes?: string;
};

export type Exercise = {
  id: string;
  name: string;
  description?: string;
  instructions: string[];
  muscle_groups: string[];
  equipment_needed: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  exercise_type: string;
};

export type UserWorkout = {
  id: string;
  user_id: string;
  workout_id: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  notes?: string;
};

export type WorkoutFilters = {
  type?: string;
  difficulty?: string;
  is_template?: boolean;
  muscle_groups?: string[];
};
