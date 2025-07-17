export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  preferences: {
    workoutTypes: string[];
    dietaryRestrictions: string[];
    availableTime: number;
  };
  onboardingComplete: boolean;
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