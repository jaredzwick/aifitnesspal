import React, { useState } from 'react';
import { FitnessUser } from '../../../common/models/fitnessUser';
import { FITNESS_GOALS } from '../../../common/constants';

interface GoalsStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const goals = [
  {
    id: FITNESS_GOALS.FAT_LOSS,
    label: 'Fat Loss',
    icon: '🔥',
    description: 'Lose weight and reduce body fat percentage',
    benefits: ['Burn calories efficiently', 'Improve cardiovascular health', 'Increase energy levels']
  },
  {
    id: FITNESS_GOALS.MUSCLE_GROWTH,
    label: 'Muscle Growth',
    icon: '💪',
    description: 'Build lean muscle mass and strength',
    benefits: ['Increase muscle size', 'Boost metabolism', 'Improve functional strength']
  },
];

export const GoalsStep: React.FC<GoalsStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>(
    userData.goal || ''
  );

  const handleSubmit = () => {
    onUpdate({ goal: selectedGoal as FITNESS_GOALS });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select your Fitness Goal
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg transform hover:scale-102 ${selectedGoal === goal.id
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg scale-102'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-3">{goal.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {goal.label}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-base">
                {goal.description}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                What you'll get:
              </h4>
              <ul className="space-y-2">
                {goal.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedGoal === goal.id && (
              <div className="mt-4 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
                <div className="flex items-center text-emerald-700 dark:text-emerald-300">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center mr-2">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-sm">Selected as your primary goal</span>
                </div>
              </div>
            )}
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
          disabled={!selectedGoal}
          className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};