import { apiClient } from '../lib/api';

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

// Nutrition service
export const nutritionService = {
  // Get nutrition entries
  getNutritionEntries: (filters: { 
    date?: string; 
    start_date?: string; 
    end_date?: string;
    limit?: number;
  } = {}): Promise<NutritionEntry[]> => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    const queryString = params.toString();
    return apiClient.get(`/nutrition/entries${queryString ? `?${queryString}` : ''}`);
  },

  // Get nutrition entry for specific date
  getNutritionEntry: async (date: string): Promise<NutritionEntry | null> => {
    const entries = await nutritionService.getNutritionEntries({ date });
    return entries[0] || null;
  },

  // Create or update nutrition entry
  saveNutritionEntry: (entry: Omit<NutritionEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<NutritionEntry> => {
    return apiClient.post('/nutrition/entries', entry);
  },

  // Update nutrition entry
  updateNutritionEntry: (id: string, entry: Partial<NutritionEntry>): Promise<NutritionEntry> => {
    return apiClient.put(`/nutrition/entries/${id}`, entry);
  },

  // Delete nutrition entry
  deleteNutritionEntry: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/nutrition/entries/${id}`);
  },

  // Search foods
  searchFoods: (query: string): Promise<Food[]> => {
    return apiClient.get(`/nutrition/foods?search=${encodeURIComponent(query)}`);
  },

  // Get food by barcode
  getFoodByBarcode: async (barcode: string): Promise<Food | null> => {
    const foods = await apiClient.get(`/nutrition/foods?barcode=${barcode}`);
    return foods[0] || null;
  },

  // Get food by ID
  getFood: (id: string): Promise<Food> => {
    return apiClient.get(`/nutrition/foods/${id}`);
  },

  // Create custom food
  createFood: (food: Omit<Food, 'id' | 'created_by' | 'created_at'>): Promise<Food> => {
    return apiClient.post('/nutrition/foods', food);
  },

  // Update food
  updateFood: (id: string, food: Partial<Food>): Promise<Food> => {
    return apiClient.put(`/nutrition/foods/${id}`, food);
  },

  // Delete food
  deleteFood: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/nutrition/foods/${id}`);
  },

  // Get meals for nutrition entry
  getMeals: (nutritionEntryId: string): Promise<Meal[]> => {
    return apiClient.get(`/nutrition/meals?nutrition_entry_id=${nutritionEntryId}`);
  },

  // Create meal
  createMeal: (meal: Omit<Meal, 'id' | 'meal_foods'>): Promise<Meal> => {
    return apiClient.post('/nutrition/meals', meal);
  },

  // Update meal
  updateMeal: (id: string, meal: Partial<Meal>): Promise<Meal> => {
    return apiClient.put(`/nutrition/meals/${id}`, meal);
  },

  // Delete meal
  deleteMeal: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/nutrition/meals/${id}`);
  },

  // Add food to meal
  addFoodToMeal: async (params: {
    food: Food;
    quantity: number;
    unit: string;
    mealType: string;
    date: string;
  }): Promise<MealFood> => {
    const { food, quantity, unit, mealType, date } = params;

    // First, ensure nutrition entry exists for the date
    let nutritionEntry = await nutritionService.getNutritionEntry(date);
    
    if (!nutritionEntry) {
      nutritionEntry = await nutritionService.saveNutritionEntry({
        date,
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
        total_fiber: 0,
        water_intake: 0,
      });
    }

    // Find or create meal
    let meal = nutritionEntry.meals?.find(m => m.meal_type === mealType);
    
    if (!meal) {
      meal = await nutritionService.createMeal({
        nutrition_entry_id: nutritionEntry.id,
        meal_type: mealType as Meal['meal_type'],
        consumed_at: new Date().toISOString(),
      });
    }

    // Add food to meal
    const mealFood = await apiClient.post('/nutrition/meal-foods', {
      meal_id: meal.id,
      food_id: food.id,
      quantity,
      unit,
      added_at: new Date().toISOString(),
    });

    // Update nutrition entry totals
    const factor = quantity / 100; // Assuming per 100g values
    const updatedEntry = await nutritionService.updateNutritionEntry(nutritionEntry.id, {
      total_calories: (nutritionEntry.total_calories || 0) + (food.calories_per_100g * factor),
      total_protein: (nutritionEntry.total_protein || 0) + (food.protein_per_100g * factor),
      total_carbs: (nutritionEntry.total_carbs || 0) + (food.carbs_per_100g * factor),
      total_fat: (nutritionEntry.total_fat || 0) + (food.fat_per_100g * factor),
      total_fiber: (nutritionEntry.total_fiber || 0) + ((food.fiber_per_100g || 0) * factor),
    });

    return mealFood;
  },

  // Update meal food
  updateMealFood: (id: string, mealFood: Partial<MealFood>): Promise<MealFood> => {
    return apiClient.put(`/nutrition/meal-foods/${id}`, mealFood);
  },

  // Remove food from meal
  removeMealFood: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/nutrition/meal-foods/${id}`);
  },

  // Get nutrition goals for user
  getNutritionGoals: (): Promise<NutritionGoals> => {
    return apiClient.get('/nutrition/goals');
  },

  // Update nutrition goals
  updateNutritionGoals: (goals: Partial<NutritionGoals>): Promise<NutritionGoals> => {
    return apiClient.put('/nutrition/goals', goals);
  },

  // Calculate nutrition totals for foods
  calculateNutrition: (foods: Array<{ food: Food; quantity: number; unit: string }>): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } => {
    return foods.reduce((totals, { food, quantity }) => {
      // Assuming quantity is in grams for simplicity
      const factor = quantity / 100;
      
      return {
        calories: totals.calories + (food.calories_per_100g * factor),
        protein: totals.protein + (food.protein_per_100g * factor),
        carbs: totals.carbs + (food.carbs_per_100g * factor),
        fat: totals.fat + (food.fat_per_100g * factor),
        fiber: totals.fiber + ((food.fiber_per_100g || 0) * factor),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  },

  // Get nutrition analytics
  getNutritionAnalytics: (params: {
    start_date: string;
    end_date: string;
    metric?: 'calories' | 'protein' | 'carbs' | 'fat';
  }): Promise<Array<{ date: string; value: number }>> => {
    const queryParams = new URLSearchParams(params);
    return apiClient.get(`/nutrition/analytics?${queryParams}`);
  },

  // Get popular foods
  getPopularFoods: (limit: number = 20): Promise<Food[]> => {
    return apiClient.get(`/nutrition/foods/popular?limit=${limit}`);
  },

  // Get recent foods
  getRecentFoods: (limit: number = 10): Promise<Food[]> => {
    return apiClient.get(`/nutrition/foods/recent?limit=${limit}`);
  },

  // Upload meal photo
  uploadMealPhoto: async (file: File, mealId: string): Promise<{ url: string }> => {
    const uploadResult = await apiClient.uploadFile(file, 'meal-photos', 'meals');
    
    // Associate photo with meal
    await apiClient.post(`/nutrition/meals/${mealId}/photos`, {
      image_url: uploadResult.data.publicUrl,
      uploaded_at: new Date().toISOString(),
    });

    return { url: uploadResult.data.publicUrl };
  },

  // Get meal suggestions based on time and preferences
  getMealSuggestions: (params: {
    meal_type: string;
    dietary_restrictions?: string[];
    calorie_target?: number;
  }): Promise<Food[]> => {
    const queryParams = new URLSearchParams();
    queryParams.append('meal_type', params.meal_type);
    
    if (params.dietary_restrictions) {
      params.dietary_restrictions.forEach(restriction => 
        queryParams.append('dietary_restrictions', restriction)
      );
    }
    
    if (params.calorie_target) {
      queryParams.append('calorie_target', String(params.calorie_target));
    }

    return apiClient.get(`/nutrition/suggestions?${queryParams}`);
  },
};