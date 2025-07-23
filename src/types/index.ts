
export interface PersonalizedPlan {
  trainingRegimen: TrainingRegimen;
  nutritionRegimen: NutritionRegimen;
  createdAt: Date;
  lastUpdated: Date;
}

export interface TrainingRegimen {
  weeklySchedule: WeeklyWorkoutPlan[];
  progressionPlan: {
    phase: 'foundation' | 'development' | 'advanced';
    duration: number; // weeks
    nextPhase?: string;
  };
  restDays: number;
  estimatedCaloriesBurned: number;
}

export interface WeeklyWorkoutPlan {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  workout?: WorkoutTemplate;
  isRestDay: boolean;
}

export interface WorkoutTemplate {
  name: string;
  type: 'strength' | 'cardio' | 'hiit' | 'flexibility' | 'mixed';
  duration: number;
  targetMuscleGroups: string[];
  exercises: ExerciseTemplate[];
  estimatedCalories: number;
}

export interface ExerciseTemplate {
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  sets?: number;
  reps?: number;
  duration?: number; // for cardio/time-based exercises
  restTime: number;
  instructions: string[];
  modifications: {
    beginner?: string;
    advanced?: string;
  };
}

export interface NutritionRegimen {
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
}

export interface MealPlanTemplate {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  targetCalories: number;
  targetMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: MealSuggestion[];
}

export interface MealSuggestion {
  name: string;
  ingredients: string[];
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  prepTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  exercises: Exercise[];
  calories: number;
  completed: boolean;
  completedAt?: Date;
}

export interface WorkoutRequest {
  name: string;
  duration: number;
  exercises: string[];
  intensity: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
  instructions: string[];
}

export interface NutritionEntry {
  id: string;
  date: Date;
  meals: Meal[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  calories: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  unit: string;
}

export interface Theme {
  isDark: boolean;
}