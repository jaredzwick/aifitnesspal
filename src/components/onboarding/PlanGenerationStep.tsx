import React, { useEffect } from 'react';
import { FitnessUser } from '../../../common/models/fitnessUser';
import { useQuery } from '@tanstack/react-query';
import { planService } from '../../services/planService';
import { ErrorScreen } from '../ErrorScreen';

interface PlanGenerationStepProps {
    userData: Partial<FitnessUser>;
    onUpdate: (data: Partial<FitnessUser>) => void;
    onNext: () => void;
    onPrev: () => void;
}

const formatGoal = (goal?: string) => {
    if (!goal) return '';
    return goal.replace('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export const PlanGenerationStep: React.FC<PlanGenerationStepProps> = ({
    userData,
    onNext,
    onPrev,
    onUpdate,
}) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['genPlan', userData],
        queryFn: () => planService.generatePlan(userData),
        enabled: !!userData,
    })

    useEffect(() => {
        if (data) {
            onUpdate({
                personalizedPlan: data,
            });
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
                <div className="text-center">
                    <div className="mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Crafting Your Perfect Plan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Our AI is analyzing your goals and creating a personalized fitness and nutrition plan just for you...
                        </p>
                    </div>

                    <div className="space-y-4 text-left max-w-md mx-auto">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-700 dark:text-gray-300">Analyzing your fitness goals</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-100"></div>
                            <span className="text-gray-700 dark:text-gray-300">Calculating optimal workout schedule</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-200"></div>
                            <span className="text-gray-700 dark:text-gray-300">Designing nutrition plan</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse delay-300"></div>
                            <span className="text-gray-700 dark:text-gray-300">Customizing for your preferences</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) return <ErrorScreen message={`Failed to generate plan with error: ${error?.message}`} />;

    const workoutDays = data.trainingRegimen.filter((day) =>
        day.workout !== undefined
    );
    const restDays = data.trainingRegimen.filter((day) =>
        day.workout === undefined
    );
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Your Personalized Plan is Ready! 🎯
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Here's your custom training and nutrition regimen designed specifically for your {formatGoal(userData.goal)} goal.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Training Regimen */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
                        <span className="mr-2">💪</span>
                        Training Regimen
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-800 dark:text-blue-200">Workout Days:</span>
                            <span className="font-semibold text-blue-900 dark:text-blue-100">
                                {workoutDays.length} days/week
                            </span>
                        </div>

                        {/* Show specific workout days */}
                        <div className="space-y-2">
                            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Training Schedule:</span>
                            <div className="flex flex-wrap gap-2">
                                {workoutDays.map((day, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full"
                                    >
                                        {day.day}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-blue-800 dark:text-blue-200">Rest Days:</span>
                            <span className="font-semibold text-blue-900 dark:text-blue-100">
                                {restDays.length} days/week
                            </span>
                        </div>

                        {/* Show specific rest days */}
                        {restDays.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">Rest Days:</span>
                                <div className="flex flex-wrap gap-2">
                                    {restDays.map((day, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium rounded-full"
                                        >
                                            {day.day}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Nutrition Regimen */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center">
                        <span className="mr-2">🥗</span>
                        Nutrition Regimen
                    </h3>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-green-800 dark:text-green-200">Daily Calories:</span>
                            <span className="font-semibold text-green-900 dark:text-green-100">
                                {data.nutritionRegimen.dailyCalorieTarget} cal
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-green-800 dark:text-green-200">Protein:</span>
                            <span className="font-semibold text-green-900 dark:text-green-100">
                                {data.nutritionRegimen.macroTargets.protein}g ({data.nutritionRegimen.macroTargets.proteinPercentage}%)
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-green-800 dark:text-green-200">Carbs:</span>
                            <span className="font-semibold text-green-900 dark:text-green-100">
                                {data.nutritionRegimen.macroTargets.carbs}g ({data.nutritionRegimen.macroTargets.carbsPercentage}%)
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-green-800 dark:text-green-200">Fat:</span>
                            <span className="font-semibold text-green-900 dark:text-green-100">
                                {data.nutritionRegimen.macroTargets.fat}g ({data.nutritionRegimen.macroTargets.fatPercentage}%)
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-green-800 dark:text-green-200">Water Target:</span>
                            <span className="font-semibold text-green-900 dark:text-green-100">
                                {data.nutritionRegimen.hydrationTarget}L/day
                            </span>
                        </div>

                        {data.nutritionRegimen.supplements && data.nutritionRegimen.supplements.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Recommended Supplements:</h4>
                                <div className="flex flex-wrap gap-1">
                                    {data.nutritionRegimen.supplements.map((supplement, index) => (
                                        <span key={index} className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                                            {supplement}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sample Previews Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sample Workout Preview */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/30 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                                Sample Workout
                            </h3>
                            <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                                {workoutDays.length > 0 ? workoutDays[0].day : 'Your first workout'}
                            </p>
                        </div>
                    </div>

                    {(() => {
                        if (!workoutDays.length) {
                            return (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-emerald-200 dark:bg-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <p className="text-emerald-700 dark:text-emerald-300">Rest day - recovery time!</p>
                                </div>
                            );
                        }
                        return (
                            <div className="space-y-4">
                                {workoutDays[0].workout?.slice(0, 3).map((exercise, index) => (
                                    <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 group">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {exercise.name}
                                            </h4>
                                            <div className="bg-emerald-100 dark:bg-emerald-900/50 px-3 py-1 rounded-full">
                                                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                                    {exercise.sets ? `${exercise.sets} × ${exercise.reps}` : `${exercise.duration}s`}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {exercise.instructions[0]}
                                        </p>
                                        <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {exercise.restTime}s rest
                                        </div>
                                    </div>
                                ))}
                                {workoutDays[0].workout && workoutDays[0].workout.length > 3 && (
                                    <div className="text-center pt-2">
                                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                            +2 more exercises
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* Sample Meal Preview */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100">
                                Sample Meal Plan
                            </h3>
                            <p className="text-orange-700 dark:text-orange-300 text-sm">
                                Daily nutrition breakdown
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {data.nutritionRegimen.mealPlan.slice(0, 3).map((meal, index) => {
                            // Sample meal suggestions based on meal type
                            const sampleMeals = {
                                breakfast: [
                                    { name: "Greek Yogurt Parfait", description: "Greek yogurt with berries and granola" },
                                    { name: "Protein Smoothie", description: "Banana, protein powder, spinach, almond milk" },
                                    { name: "Oatmeal Bowl", description: "Steel-cut oats with nuts and fruit" }
                                ],
                                lunch: [
                                    { name: "Grilled Chicken Salad", description: "Mixed greens, chicken breast, avocado" },
                                    { name: "Quinoa Power Bowl", description: "Quinoa, roasted vegetables, tahini dressing" },
                                    { name: "Turkey Wrap", description: "Whole wheat wrap with lean turkey and veggies" }
                                ],
                                dinner: [
                                    { name: "Salmon & Sweet Potato", description: "Baked salmon with roasted sweet potato" },
                                    { name: "Lean Beef Stir-fry", description: "Grass-fed beef with mixed vegetables" },
                                    { name: "Chicken & Rice Bowl", description: "Grilled chicken with brown rice and broccoli" }
                                ],
                                snack: [
                                    { name: "Apple & Almond Butter", description: "Sliced apple with natural almond butter" },
                                    { name: "Protein Shake", description: "Post-workout protein with banana" },
                                    { name: "Mixed Nuts", description: "Handful of mixed nuts and seeds" }
                                ]
                            };

                            const mealSuggestions = sampleMeals[meal.mealType as keyof typeof sampleMeals] || sampleMeals.snack;
                            const randomMeal = mealSuggestions[index % mealSuggestions.length];

                            return (
                                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors capitalize">
                                                {meal.mealType}
                                            </h4>
                                            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                                {randomMeal.name}
                                            </p>
                                        </div>
                                        <div className="bg-orange-100 dark:bg-orange-900/50 px-3 py-1 rounded-full">
                                            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                                                {meal.targetCalories} cal
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                                        {randomMeal.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex space-x-4">
                                            <span className="text-orange-600 dark:text-orange-400">
                                                <span className="font-medium">{meal.targetMacros.protein}g</span> protein
                                            </span>
                                            <span className="text-orange-600 dark:text-orange-400">
                                                <span className="font-medium">{meal.targetMacros.carbs}g</span> carbs
                                            </span>
                                            <span className="text-orange-600 dark:text-orange-400">
                                                <span className="font-medium">{meal.targetMacros.fat}g</span> fat
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {data.nutritionRegimen.mealPlan.length > 3 && (
                            <div className="text-center pt-2">
                                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                                    +1 snack or shake
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
                <button
                    onClick={onPrev}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    Back
                </button>

                <div className="flex space-x-4">
                    <button
                        onClick={onNext}
                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 font-semibold"
                    >
                        Accept Plan & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
