import React, { useState } from 'react';
import {
    Dumbbell,
    Apple,
    Zap,
    Activity,
    Timer,
    Coffee,
    Sandwich,
    Utensils,
    Cookie,
    Pause,
    ChevronDown,
    ChevronUp,
    Target
} from 'lucide-react';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { PersonalizedPlan } from '../../../common/types';

export const TrainingRegimen: React.FC<{ plan: PersonalizedPlan }> = ({ plan }) => {
    const [selectedView, setSelectedView] = useState<'training' | 'nutrition'>('training');
    const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([0, 1, 2]));
    // TODO: Mutate the training regimen
    const toggleDayExpansion = (dayIndex: number) => {
        const newExpanded = new Set(expandedDays);
        if (newExpanded.has(dayIndex)) {
            newExpanded.delete(dayIndex);
        } else {
            newExpanded.add(dayIndex);
        }
        setExpandedDays(newExpanded);
    };

    const getExerciseTypeIcon = (type: string) => {
        switch (type) {
            case 'strength': return Dumbbell;
            case 'cardio': return Activity;
            case 'flexibility': return Timer;
            default: return Activity;
        }
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

    const formatDuration = (duration?: number) => {
        if (!duration) return '';
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <ErrorBoundary>
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Training & Nutrition Regimen</h2>
                            <p className="text-emerald-100 text-lg">
                                Your personalized fitness and nutrition plan
                            </p>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
                        <button
                            onClick={() => setSelectedView('training')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'training'
                                ? 'bg-white/20 text-white shadow-lg'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Dumbbell className="w-5 h-5" />
                            <span>Training Plan</span>
                        </button>
                        <button
                            onClick={() => setSelectedView('nutrition')}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${selectedView === 'nutrition'
                                ? 'bg-white/20 text-white shadow-lg'
                                : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <Apple className="w-5 h-5" />
                            <span>Nutrition Plan</span>
                        </button>
                    </div>
                </div>

                {/* Training Plan View */}
                {selectedView === 'training' && (
                    <div className="space-y-6">
                        {plan.trainingRegimen.map((dayPlan, dayIndex) => {
                            const isExpanded = expandedDays.has(dayIndex);
                            const isRestDay = !dayPlan.workout || dayPlan.workout.length === 0;
                            return (
                                <div
                                    key={dayIndex}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                >
                                    {/* Day Header */}
                                    <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isRestDay
                                                    ? 'bg-gradient-to-br from-gray-400 to-gray-500'
                                                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                                    }`}>
                                                    {isRestDay ? (
                                                        <Pause className="w-6 h-6 text-white" />
                                                    ) : (
                                                        <Dumbbell className="w-6 h-6 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                        {dayPlan.day.charAt(0).toUpperCase() + dayPlan.day.slice(1)}
                                                    </h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                                        {isRestDay ? (
                                                            <span>Rest Day</span>
                                                        ) : (
                                                            <>
                                                                <span>{dayPlan.workout?.length} exercises</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toggleDayExpansion(dayIndex)}
                                                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            >
                                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Exercises */}
                                    {isExpanded && (
                                        <div className="p-6">
                                            {dayPlan.workout && dayPlan.workout.length > 0 ? (
                                                <div className="space-y-4">
                                                    {dayPlan.workout.map((exercise, exerciseIndex) => {
                                                        const ExerciseIcon = getExerciseTypeIcon(exercise.type);

                                                        return (
                                                            <div
                                                                key={exerciseIndex}
                                                                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                                                            >
                                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center mt-1">
                                                                    <ExerciseIcon className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                                        {exercise.name}
                                                                    </h4>
                                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                                                                        <span className="capitalize">{exercise.type}</span>
                                                                        {exercise.numberOfSets && <span>{exercise.numberOfSets} sets</span>}
                                                                        {exercise.reps && <span>{exercise.reps} reps</span>}
                                                                        {exercise.duration && <span>{formatDuration(exercise.duration)}</span>}
                                                                        <span>{exercise.restTime}s rest</span>
                                                                    </div>
                                                                    {exercise.instructions && exercise.instructions.length > 0 && (
                                                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                                                            <p className="font-medium mb-1">Instructions:</p>
                                                                            <ul className="list-disc list-inside space-y-1">
                                                                                {exercise.instructions.map((instruction, i) => (
                                                                                    <li key={i}>{instruction}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                                    <Pause className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                                    <p className="text-lg font-medium mb-2">Rest Day</p>
                                                    <p className="text-sm">No exercises scheduled for today</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Nutrition Plan View */}
                {selectedView === 'nutrition' && (
                    <div className="space-y-6">
                        {/* Nutrition Overview */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Nutrition Targets
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        <span className="font-medium text-orange-900 dark:text-orange-100">Daily Calories</span>
                                    </div>
                                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                        {plan.nutritionRegimen.dailyCalorieTarget}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-blue-900 dark:text-blue-100">Protein</span>
                                    </div>
                                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {plan.nutritionRegimen.macroTargets.protein}g
                                    </div>
                                    <div className="text-sm text-blue-700 dark:text-blue-300">
                                        {plan.nutritionRegimen.macroTargets.proteinPercentage}%
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Apple className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        <span className="font-medium text-green-900 dark:text-green-100">Carbs</span>
                                    </div>
                                    <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                                        {plan.nutritionRegimen.macroTargets.carbs}g
                                    </div>
                                    <div className="text-sm text-green-700 dark:text-green-300">
                                        {plan.nutritionRegimen.macroTargets.carbsPercentage}%
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium text-purple-900 dark:text-purple-100">Fat</span>
                                    </div>
                                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                        {plan.nutritionRegimen.macroTargets.fat}g
                                    </div>
                                    <div className="text-sm text-purple-700 dark:text-purple-300">
                                        {plan.nutritionRegimen.macroTargets.fatPercentage}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Meal Plan */}
                        <div className="space-y-4">
                            {plan.nutritionRegimen.mealPlan.map((meal, mealIndex) => {
                                const MealIcon = getMealIcon(meal.mealType);

                                return (
                                    <div
                                        key={mealIndex}
                                        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                    >
                                        {/* Meal Header */}
                                        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                                                    <MealIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                                        {meal.mealType}
                                                    </h3>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                                        <span>{meal.targetCalories} cal</span>
                                                        <span>P: {meal.targetMacros.protein}g</span>
                                                        <span>C: {meal.targetMacros.carbs}g</span>
                                                        <span>F: {meal.targetMacros.fat}g</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meal Suggestions */}
                                        <div className="p-6">
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                                                Meal Suggestions ({meal.suggestions.length})
                                            </h4>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {meal.suggestions.map((suggestion, suggestionIndex) => (
                                                    <div
                                                        key={suggestionIndex}
                                                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                            {suggestion.name}
                                                        </h5>
                                                        <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                                                            <div className="flex justify-between">
                                                                <span>Calories:</span>
                                                                <span>{suggestion.calories}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Prep time:</span>
                                                                <span>{suggestion.prepTime} min</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span>Difficulty:</span>
                                                                <span className="capitalize">{suggestion.difficulty}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                <span>P: {suggestion.macros.protein}g</span>
                                                                <span className="mx-2">•</span>
                                                                <span>C: {suggestion.macros.carbs}g</span>
                                                                <span className="mx-2">•</span>
                                                                <span>F: {suggestion.macros.fat}g</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
};