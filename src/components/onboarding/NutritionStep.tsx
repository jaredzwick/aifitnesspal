import React, { useState } from 'react';
import { FitnessUser } from '../../types';

interface NutritionStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const NutritionStep: React.FC<NutritionStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [dailyCalories, setDailyCalories] = useState<string>(userData.dailyCalories?.toString() || '');
  const [detailedEating, setDetailedEating] = useState<string>(userData.detailedEating || '');

  const handleSubmit = () => {
    onUpdate({
      dailyCalories: dailyCalories ? parseInt(dailyCalories) : undefined,
      detailedEating: detailedEating.trim() || undefined,
    });
    onNext();
  };

  const isValid = dailyCalories && parseInt(dailyCalories) > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Nutrition Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help us understand your current eating habits to create a personalized nutrition plan.
        </p>
      </div>

      <div className="space-y-8">
        {/* Daily Calories */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-100 dark:border-orange-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Calorie Intake
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Rough estimate of calories you consume daily
              </p>
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              value={dailyCalories}
              onChange={(e) => setDailyCalories(e.target.value)}
              className="w-full px-4 py-4 text-2xl font-bold text-center rounded-xl border border-orange-200 dark:border-orange-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              placeholder="2000"
              min="800"
              max="5000"
              required
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
              calories
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-4">
            {[1500, 2000, 2500, 3000].map((calories) => (
              <button
                key={calories}
                onClick={() => setDailyCalories(calories.toString())}
                className="py-2 px-3 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-orange-300 dark:hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
              >
                {calories}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Eating Information */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Detailed Eating Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Optional: Describe a typical day of eating in as much detail as possible
              </p>
            </div>
          </div>

          <textarea
            value={detailedEating}
            onChange={(e) => setDetailedEating(e.target.value)}
            className="w-full px-4 py-4 rounded-xl border border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
            rows={6}
            placeholder="Example: 
Breakfast: 2 eggs, 1 slice whole wheat toast, 1 cup coffee
Lunch: Chicken salad with mixed greens, olive oil dressing
Snack: Apple with peanut butter
Dinner: Grilled salmon, quinoa, steamed broccoli
Evening: Greek yogurt with berries

Include brands, portions, cooking methods, timing, etc."
          />

          <div className="mt-3 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-xs text-blue-600 dark:text-blue-400">💡</span>
            </div>
            <p>The more detail you provide, the better we can personalize your nutrition plan</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="flex-1 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};