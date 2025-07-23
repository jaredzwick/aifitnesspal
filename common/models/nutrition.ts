// Nutrition types
export interface Food {
    id: string;
    name: string;
    brand?: string;
    barcode?: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g?: number;
    sugar_per_100g?: number;
    sodium_per_100g?: number;
    serving_size?: number;
    serving_unit?: string;
    created_by?: string;
    created_at?: string;
  }
  
  export interface MealFood {
    id: string;
    meal_id: string;
    food_id: string;
    quantity: number;
    unit: string;
    added_at?: string;
    food?: Food;
  }
  
  export interface Meal {
    id: string;
    nutrition_entry_id: string;
    meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name?: string;
    consumed_at?: string;
    meal_foods?: MealFood[];
  }
  
  export interface NutritionEntry {
    id: string;
    user_id: string;
    date: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fat: number;
    total_fiber?: number;
    water_intake?: number;
    notes?: string;
    meals?: Meal[];
    created_at?: string;
    updated_at?: string;
  }
  
  export interface NutritionGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    water: number;
  }
  