import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Camera, 
  Utensils, 
  Clock,
  Zap,
  Target,
  TrendingUp,
  Edit3,
  Trash2,
  BarChart3,
  Apple,
  Coffee,
  Sandwich,
  Cookie,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Timer,
  Scale,
  Activity
} from 'lucide-react';
import { useQuery, useMutation } from '../../hooks/useApi';
import { nutritionService, NutritionEntry, Food, Meal, MealFood } from '../../services/nutritionService';
import { LoadingSpinner, ButtonSpinner, SkeletonCard } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface MacroTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface FoodSearchResult extends Food {
  selected_quantity?: number;
  selected_unit?: string;
}

export const NutritionTracker: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMacroDetails, setShowMacroDetails] = useState(false);
  const [editingFood, setEditingFood] = useState<{ mealId: string; foodId: string } | null>(null);

  // Mock targets - would come from user profile/goals
  const targets: MacroTarget = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 67,
    fiber: 25,
  };

  // Get nutrition entry for selected date
  const {
    data: nutritionEntry,
    loading: entryLoading,
    error: entryError,
    execute: refreshEntry,
  } = useQuery(
    () => nutritionService.getNutritionEntry(selectedDate),
    {
      immediate: true,
    }
  );

  // Search foods
  const {
    data: searchResults,
    loading: searchLoading,
    execute: searchFoods,
    reset: resetSearch,
  } = useMutation((query: string) => nutritionService.searchFoods(query));

  // Add food to meal
  const {
    execute: addFoodToMeal,
    loading: addingFood,
  } = useMutation(
    async ({ food, quantity, unit, mealType }: { 
      food: Food; 
      quantity: number; 
      unit: string; 
      mealType: string;
    }) => {
      // Create meal if it doesn't exist, then add food
      const result = await nutritionService.addFoodToMeal({
        food,
        quantity,
        unit,
        mealType,
        date: selectedDate,
      });
      return result;
    },
    {
      onSuccess: () => {
        setShowFoodSearch(false);
        setSearchQuery('');
        resetSearch();
        refreshEntry();
      },
    }
  );

  // Update food quantity
  const {
    execute: updateFoodQuantity,
    loading: updatingFood,
  } = useMutation(
    async ({ mealFoodId, quantity }: { mealFoodId: string; quantity: number }) => {
      return nutritionService.updateMealFood(mealFoodId, { quantity });
    },
    {
      onSuccess: () => {
        setEditingFood(null);
        refreshEntry();
      },
    }
  );

  // Remove food from meal
  const {
    execute: removeFoodFromMeal,
    loading: removingFood,
  } = useMutation(
    (mealFoodId: string) => nutritionService.removeMealFood(mealFoodId),
    {
      onSuccess: () => {
        refreshEntry();
      },
    }
  );

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      await searchFoods(searchQuery);
    }
  };

  const handleAddFood = async (food: Food, quantity: number = 100, unit: string = 'g') => {
    await addFoodToMeal({ food, quantity, unit, mealType: selectedMealType });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 80) return 'bg-yellow-500';
    if (percentage < 100) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return Coffee;
      case 'lunch': return Sandwich;
      case 'dinner': return Utensils;
      case 'snack': return Cookie;
      default: return Apple;
    }
  };

  const getMealTime = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return '7:00 AM';
      case 'lunch': return '12:00 PM';
      case 'dinner': return '7:00 PM';
      case 'snack': return '3:00 PM';
      default: return 'Anytime';
    }
  };

  const calculateMealNutrition = (meal: Meal) => {
    if (!meal.meal_foods) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    
    return meal.meal_foods.reduce((totals, mealFood) => {
      if (!mealFood.food) return totals;
      
      const factor = mealFood.quantity / 100; // Assuming per 100g values
      
      return {
        calories: totals.calories + (mealFood.food.calories_per_100g * factor),
        protein: totals.protein + (mealFood.food.protein_per_100g * factor),
        carbs: totals.carbs + (mealFood.food.carbs_per_100g * factor),
        fat: totals.fat + (mealFood.food.fat_per_100g * factor),
        fiber: totals.fiber + ((mealFood.food.fiber_per_100g || 0) * factor),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  if (entryError) {
    return (
      <div className="p-6">
        <ErrorMessage
          error={entryError}
          onRetry={refreshEntry}
          variant="card"
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Nutrition Tracker</h2>
              <p className="text-orange-100 text-lg">
                {formatDate(selectedDate)}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={() => setShowFoodSearch(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-xl font-semibold transition-all duration-200 border border-white/30"
              >
                <Plus className="w-5 h-5" />
                <span>Add Food</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5" />
                <span className="font-medium">Calories</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(nutritionEntry?.total_calories || 0)}
              </div>
              <div className="text-sm text-orange-100">
                of {targets.calories}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5" />
                <span className="font-medium">Protein</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(nutritionEntry?.total_protein || 0)}g
              </div>
              <div className="text-sm text-orange-100">
                of {targets.protein}g
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Apple className="w-5 h-5" />
                <span className="font-medium">Carbs</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(nutritionEntry?.total_carbs || 0)}g
              </div>
              <div className="text-sm text-orange-100">
                of {targets.carbs}g
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5" />
                <span className="font-medium">Fat</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(nutritionEntry?.total_fat || 0)}g
              </div>
              <div className="text-sm text-orange-100">
                of {targets.fat}g
              </div>
            </div>
          </div>
        </div>

        {/* Macro Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Daily Progress
            </h3>
            <button
              onClick={() => setShowMacroDetails(!showMacroDetails)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Details</span>
              {showMacroDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Calories</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.round(nutritionEntry?.total_calories || 0)} / {targets.calories}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(nutritionEntry?.total_calories || 0, targets.calories)}`}
                  style={{ width: `${calculateProgress(nutritionEntry?.total_calories || 0, targets.calories)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(calculateProgress(nutritionEntry?.total_calories || 0, targets.calories))}% of goal
              </div>
            </div>

            {/* Protein */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Protein</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.round(nutritionEntry?.total_protein || 0)}g / {targets.protein}g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(nutritionEntry?.total_protein || 0, targets.protein)}`}
                  style={{ width: `${calculateProgress(nutritionEntry?.total_protein || 0, targets.protein)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(calculateProgress(nutritionEntry?.total_protein || 0, targets.protein))}% of goal
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Carbs</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.round(nutritionEntry?.total_carbs || 0)}g / {targets.carbs}g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(nutritionEntry?.total_carbs || 0, targets.carbs)}`}
                  style={{ width: `${calculateProgress(nutritionEntry?.total_carbs || 0, targets.carbs)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(calculateProgress(nutritionEntry?.total_carbs || 0, targets.carbs))}% of goal
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">Fat</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {Math.round(nutritionEntry?.total_fat || 0)}g / {targets.fat}g
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(nutritionEntry?.total_fat || 0, targets.fat)}`}
                  style={{ width: `${calculateProgress(nutritionEntry?.total_fat || 0, targets.fat)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(calculateProgress(nutritionEntry?.total_fat || 0, targets.fat))}% of goal
              </div>
            </div>
          </div>

          {/* Detailed Macro Breakdown */}
          {showMacroDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Macronutrient Ratio</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Protein</span>
                      <span>{Math.round(((nutritionEntry?.total_protein || 0) * 4 / (nutritionEntry?.total_calories || 1)) * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Carbs</span>
                      <span>{Math.round(((nutritionEntry?.total_carbs || 0) * 4 / (nutritionEntry?.total_calories || 1)) * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fat</span>
                      <span>{Math.round(((nutritionEntry?.total_fat || 0) * 9 / (nutritionEntry?.total_calories || 1)) * 100)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Remaining</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calories</span>
                      <span>{Math.max(0, targets.calories - (nutritionEntry?.total_calories || 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Protein</span>
                      <span>{Math.max(0, targets.protein - (nutritionEntry?.total_protein || 0))}g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Fiber</span>
                      <span>{Math.max(0, targets.fiber - (nutritionEntry?.total_fiber || 0))}g</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">Hydration</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Today</span>
                      <span>{nutritionEntry?.water_intake || 0}ml</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Goal</span>
                      <span>2000ml</span>
                    </div>
                    <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(((nutritionEntry?.water_intake || 0) / 2000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {entryLoading && (
          <div className="grid gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} className="h-48" />
            ))}
          </div>
        )}

        {/* Meals */}
        {!entryLoading && (
          <div className="space-y-6">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
              const meal = nutritionEntry?.meals?.find(m => m.meal_type === mealType);
              const mealNutrition = meal ? calculateMealNutrition(meal) : { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
              const MealIcon = getMealIcon(mealType);
              
              return (
                <div
                  key={mealType}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Meal Header */}
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <MealIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                            {mealType}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getMealTime(mealType)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-4 h-4" />
                              <span>{Math.round(mealNutrition.calories)} cal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedMealType(mealType as any);
                          setShowFoodSearch(true);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Food</span>
                      </button>
                    </div>

                    {/* Meal Macros */}
                    {meal && meal.meal_foods && meal.meal_foods.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {Math.round(mealNutrition.calories)}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Calories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {Math.round(mealNutrition.protein)}g
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Protein</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600 dark:text-green-400">
                            {Math.round(mealNutrition.carbs)}g
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Carbs</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                            {Math.round(mealNutrition.fat)}g
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300">Fat</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Meal Foods */}
                  <div className="p-6">
                    {meal?.meal_foods && meal.meal_foods.length > 0 ? (
                      <div className="space-y-3">
                        {meal.meal_foods.map((mealFood) => (
                          <div
                            key={mealFood.id}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <Apple className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  {mealFood.food?.name}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                  <span>{mealFood.quantity}{mealFood.unit}</span>
                                  <span>•</span>
                                  <span>{Math.round((mealFood.food?.calories_per_100g || 0) * mealFood.quantity / 100)} cal</span>
                                  {mealFood.food?.brand && (
                                    <>
                                      <span>•</span>
                                      <span>{mealFood.food.brand}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {editingFood?.mealId === meal.id && editingFood?.foodId === mealFood.id ? (
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="number"
                                    defaultValue={mealFood.quantity}
                                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        const newQuantity = parseFloat((e.target as HTMLInputElement).value);
                                        updateFoodQuantity({ mealFoodId: mealFood.id, quantity: newQuantity });
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => setEditingFood(null)}
                                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setEditingFood({ mealId: meal.id, foodId: mealFood.id })}
                                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => removeFoodFromMeal(mealFood.id)}
                                    disabled={removingFood}
                                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                                  >
                                    {removingFood ? (
                                      <LoadingSpinner size="sm" />
                                    ) : (
                                      <Trash2 className="w-4 h-4" />
                                    )}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <Utensils className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium mb-2">No foods added yet</p>
                        <p className="text-sm">Add foods to track your {mealType} nutrition</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Food Search Modal */}
        {showFoodSearch && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Add Food to {selectedMealType}</h3>
                  <button
                    onClick={() => {
                      setShowFoodSearch(false);
                      setSearchQuery('');
                      resetSearch();
                    }}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                    <input
                      type="text"
                      placeholder="Search for foods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={searchLoading || !searchQuery.trim()}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:opacity-50 rounded-xl font-semibold transition-colors border border-white/30"
                  >
                    {searchLoading ? <ButtonSpinner /> : 'Search'}
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {searchResults && searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((food) => (
                      <div
                        key={food.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center">
                            <Apple className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {food.name}
                            </p>
                            {food.brand && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {food.brand}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{food.calories_per_100g} cal/100g</span>
                              <span>P: {food.protein_per_100g}g</span>
                              <span>C: {food.carbs_per_100g}g</span>
                              <span>F: {food.fat_per_100g}g</span>
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleAddFood(food)}
                          disabled={addingFood}
                          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                        >
                          {addingFood ? (
                            <ButtonSpinner />
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : searchQuery && !searchLoading ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-2">No foods found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-2">Search for foods</p>
                    <p className="text-sm">Enter a food name to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};