import React, { useState } from 'react';
import { FitnessUser } from '../../../common/models/fitnessUser';
import { FITNESS_EXPERIENCE_LEVELS } from '../../../common/constants';

interface FitnessLevelStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const fitnessLevels = [
  {
    level: FITNESS_EXPERIENCE_LEVELS.BEGINNER,
    title: 'Beginner',
    description: 'Less than 6 months of training',
    icon: '🌱',
  },
  {
    level: FITNESS_EXPERIENCE_LEVELS.INTERMEDIATE,
    title: 'Intermediate',
    description: '6 months - 2 years of consistent training',
    icon: '💪',
  },
  {
    level: FITNESS_EXPERIENCE_LEVELS.ADVANCED,
    title: 'Advanced',
    description: '2+ years of consistent training',
    icon: '🏆',
  },
];

export const FitnessLevelStep: React.FC<FitnessLevelStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>(userData.fitnessLevel || '');

  const handleSubmit = () => {
    onUpdate({ fitnessLevel: selectedLevel as FitnessUser['fitnessLevel'] });
    onNext();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What's your fitness level?
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This allows us to identify the most suited training program for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fitnessLevels.map((level) => (
          <button
            key={level.level}
            onClick={() => setSelectedLevel(level.level)}
            className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${selectedLevel === level.level
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
          >
            <div className="text-3xl mb-3">{level.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {level.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {level.description}
            </p>
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
          disabled={!selectedLevel}
          className="flex-1 py-3 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};