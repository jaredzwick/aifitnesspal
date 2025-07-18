import React, { useState } from 'react';
import { FitnessUser } from '../../types';

interface ActivityLevelStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const ActivityLevelStep: React.FC<ActivityLevelStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [cardioDays, setCardioDays] = useState<number>(userData.cardioDaysPerWeek || 0);
  const [trainDays, setTrainDays] = useState<number>(userData.trainDaysPerWeek || 0);
  const [canDoMore, setCanDoMore] = useState<boolean>(userData.canDoMore || false);

  const handleSubmit = () => {
    onUpdate({
      cardioDaysPerWeek: cardioDays,
      trainDaysPerWeek: trainDays,
      canDoMore,
    });
    onNext();
  };

  const isValid = cardioDays > 0 || trainDays > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Current Activity Level
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your current exercise routine so we can build the perfect plan for you.
        </p>
      </div>

      <div className="space-y-8">
        {/* Cardio Days */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏃</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cardio / Week
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Running, cycling, swimming, etc.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((days) => (
              <button
                key={days}
                onClick={() => setCardioDays(days)}
                className={`aspect-square rounded-xl font-semibold transition-all duration-200 ${
                  cardioDays === days
                    ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600 hover:shadow-md'
                }`}
              >
                {days}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Days per week
          </p>
        </div>

        {/* Training Days */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏋️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Train / Week
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Weight training, resistance exercises
              </p>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((days) => (
              <button
                key={days}
                onClick={() => setTrainDays(days)}
                className={`aspect-square rounded-xl font-semibold transition-all duration-200 ${
                  trainDays === days
                    ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                }`}
              >
                {days}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Days per week
          </p>
        </div>

        {/* Can Do More */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💪</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ready for More?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Can you do more than your current routine?
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCanDoMore(true)}
              className={`p-4 rounded-xl font-semibold transition-all duration-200 ${
                canDoMore
                  ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              <div className="text-2xl mb-2">✅</div>
              <div>Yes, I can do more!</div>
              <div className="text-xs opacity-75 mt-1">Ready to level up</div>
            </button>

            <button
              onClick={() => setCanDoMore(false)}
              className={`p-4 rounded-xl font-semibold transition-all duration-200 ${
                !canDoMore
                  ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-600'
              }`}
            >
              <div className="text-2xl mb-2">🎯</div>
              <div>This is my limit</div>
              <div className="text-xs opacity-75 mt-1">Perfect as is</div>
            </button>
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