import React, { useState } from 'react';
import { User as FitnessUser } from '../../types';

interface GoalsStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const goals = [
  { id: 'weight-loss', label: 'Lose Weight', icon: '⚖️' },
  { id: 'muscle-gain', label: 'Build Muscle', icon: '💪' },
  { id: 'endurance', label: 'Improve Endurance', icon: '🏃' },
  { id: 'strength', label: 'Get Stronger', icon: '🏋️' },
  { id: 'flexibility', label: 'Increase Flexibility', icon: '🧘' },
  { id: 'general-fitness', label: 'General Fitness', icon: '❤️' },
];

export const GoalsStep: React.FC<GoalsStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(userData.goals || []);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSubmit = () => {
    onUpdate({ goals: selectedGoals });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What are your fitness goals?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Select all that apply. We'll customize your experience based on your goals.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center hover:shadow-lg ${
              selectedGoals.includes(goal.id)
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
            }`}
          >
            <div className="text-2xl mb-2">{goal.icon}</div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {goal.label}
            </span>
          </button>
        ))}
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
          disabled={selectedGoals.length === 0}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};