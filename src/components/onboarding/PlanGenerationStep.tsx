import React from 'react';
import { FitnessUser } from '../../../common/models/fitnessUser';
import { useQuery } from '@tanstack/react-query';
import { planService } from '../../services/planService';
import { ErrorScreen } from '../ErrorScreen';

interface PlanGenerationStepProps {
    userData: Partial<FitnessUser>;
    onNext: () => void;
    onPrev: () => void;
}

export const PlanGenerationStep: React.FC<PlanGenerationStepProps> = ({
    userData,
    onNext,
    onPrev,
}) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['genPlan', userData],
        queryFn: () => planService.generatePlan(userData),
        enabled: !!userData,
    })

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
                    Here's your custom training and nutrition regimen designed specifically for your {userData.goal?.replace('-', ' ')} goal.
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

                        <div className="flex justify-between items-center">
                            <span className="text-blue-800 dark:text-blue-200">Rest Days:</span>
                            <span className="font-semibold text-blue-900 dark:text-blue-100">
                                {restDays.length} days/week
                            </span>
                        </div>

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

            {/* Sample Workout Preview */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Sample Workout Preview
                </h3>

                {(() => {
                    if (!workoutDays.length) return null;


                    return (
                        <div>
                            <div className="grid gap-3">
                                {workoutDays[0].workout?.slice(0, 3).map((exercise, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {exercise.name}
                                            </span>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                {exercise.sets ? `${exercise.sets} sets × ${exercise.reps} reps` : `${exercise.duration}s`}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            {exercise.instructions[0]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
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
