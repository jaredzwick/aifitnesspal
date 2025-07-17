import React, { useState } from 'react';
import { User as FitnessUser } from '../../types';

interface PreferencesStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const workoutTypes = [
  { id: 'cardio', label: 'Cardio', icon: '🏃' },
  { id: 'strength', label: 'Strength Training', icon: '🏋️' },
  { id: 'yoga', label: 'Yoga', icon: '🧘' },
  { id: 'hiit', label: 'HIIT', icon: '💥' },
  { id: 'pilates', label: 'Pilates', icon: '🤸' },
  { id: 'swimming', label: 'Swimming', icon: '🏊' },
];

const dietaryRestrictions = [
  { id: 'none', label: 'No Restrictions' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'dairy-free', label: 'Dairy-Free' },
  { id: 'keto', label: 'Keto' },
];

export const PreferencesStep: React.FC<PreferencesStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>(
    userData.preferences?.workoutTypes || []
  );
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState<string[]>(
    userData.preferences?.dietaryRestrictions || []
  );
  const [availableTime, setAvailableTime] = useState<number>(
    userData.preferences?.availableTime || 30
  );

  const toggleWorkout = (workoutId: string) => {
    setSelectedWorkouts(prev => 
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  const toggleDietaryRestriction = (restrictionId: string) => {
    setSelectedDietaryRestrictions(prev => 
      prev.includes(restrictionId)
        ? prev.filter(id => id !== restrictionId)
        : [...prev, restrictionId]
    );
  };

  const handleNext = () => {
    onUpdate({
      preferences: {
        workoutTypes: selectedWorkouts,
        dietaryRestrictions: selectedDietaryRestrictions,
        availableTime,
      },
    });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Your preferences
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Let us know your preferences so we can create the perfect plan for you.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preferred workout types
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {workoutTypes.map((workout) => (
              <button
                key={workout.id}
                onClick={() => toggleWorkout(workout.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm hover:shadow-md ${
                  selectedWorkouts.includes(workout.id)
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                <div className="text-lg mb-1">{workout.icon}</div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {workout.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Dietary preferences
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {dietaryRestrictions.map((restriction) => (
              <button
                key={restriction.id}
                onClick={() => toggleDietaryRestriction(restriction.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 text-center text-sm hover:shadow-md ${
                  selectedDietaryRestrictions.includes(restriction.id)
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {restriction.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Available time per workout
          </h3>
          <div className="max-w-md">
            <input
              type="range"
              min="15"
              max="120"
              step="15"
              value={availableTime}
              onChange={(e) => setAvailableTime(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
              <span>15 min</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {availableTime} minutes
              </span>
              <span>120 min</span>
            </div>
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
          onClick={handleNext}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};