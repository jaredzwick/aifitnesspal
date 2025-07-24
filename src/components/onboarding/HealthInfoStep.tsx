import React, { useState } from 'react';
import { FitnessUser } from '../../../common/models/fitnessUser';

interface HealthInfoStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const commonInjuries = [
  'Knee injury',
  'Back injury',
  'Shoulder injury',
  'Ankle injury',
  'Wrist injury',
  'Hip injury',
  'Neck injury',
];

const commonRestrictions = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Nut allergy',
  'Shellfish allergy',
  'Keto',
  'Paleo',
  'Low sodium',
  'Diabetic',
];

export const HealthInfoStep: React.FC<HealthInfoStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [injuries, setInjuries] = useState<string[]>(userData.pastInjuries || []);
  const [customInjury, setCustomInjury] = useState<string>('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(userData.dietaryRestrictions || []);
  const [customRestriction, setCustomRestriction] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>(userData.additionalHealthNotes || '');

  const toggleInjury = (injury: string) => {
    setInjuries(prev => 
      prev.includes(injury) 
        ? prev.filter(i => i !== injury)
        : [...prev, injury]
    );
  };

  const addCustomInjury = () => {
    if (customInjury.trim() && !injuries.includes(customInjury.trim())) {
      setInjuries(prev => [...prev, customInjury.trim()]);
      setCustomInjury('');
    }
  };

  const toggleRestriction = (restriction: string) => {
    setDietaryRestrictions(prev => 
      prev.includes(restriction) 
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  const addCustomRestriction = () => {
    if (customRestriction.trim() && !dietaryRestrictions.includes(customRestriction.trim())) {
      setDietaryRestrictions(prev => [...prev, customRestriction.trim()]);
      setCustomRestriction('');
    }
  };

  const handleSubmit = () => {
    onUpdate({
      pastInjuries: injuries,
      dietaryRestrictions,
      additionalHealthNotes: additionalNotes.trim() || undefined,
    });
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Health Information
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Help us create a safe and effective plan by sharing any health considerations.
        </p>
      </div>

      <div className="space-y-8">
        {/* Past Injuries */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-100 dark:border-red-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🩹</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Past Injuries
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select any past or current injuries we should be aware of
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {commonInjuries.map((injury) => (
              <button
                key={injury}
                onClick={() => toggleInjury(injury)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  injuries.includes(injury)
                    ? 'bg-gradient-to-br from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-600'
                }`}
              >
                {injury}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={customInjury}
              onChange={(e) => setCustomInjury(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInjury()}
              className="flex-1 px-4 py-2 rounded-lg border border-red-200 dark:border-red-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
              placeholder="Add custom injury..."
            />
            <button
              onClick={addCustomInjury}
              disabled={!customInjury.trim()}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          {injuries.length === 0 && (
            <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                ✅ No injuries selected - great for creating an unrestricted workout plan!
              </p>
            </div>
          )}
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🥗</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dietary Restrictions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Select any dietary restrictions, allergies, or preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {commonRestrictions.map((restriction) => (
              <button
                key={restriction}
                onClick={() => toggleRestriction(restriction)}
                className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  dietaryRestrictions.includes(restriction)
                    ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
                }`}
              >
                {restriction}
              </button>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              value={customRestriction}
              onChange={(e) => setCustomRestriction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomRestriction()}
              className="flex-1 px-4 py-2 rounded-lg border border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              placeholder="Add custom restriction..."
            />
            <button
              onClick={addCustomRestriction}
              disabled={!customRestriction.trim()}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              Add
            </button>
          </div>

          {dietaryRestrictions.length === 0 && (
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300 text-center">
                ℹ️ No restrictions selected - we'll include all food options in your plan
              </p>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-6 border border-purple-100 dark:border-purple-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Additional Health Notes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Any other health information, medications, or considerations
              </p>
            </div>
          </div>

          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            className="w-full px-4 py-4 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
            rows={4}
            placeholder="Example:
- Taking blood pressure medication
- Prefer morning workouts
- Have access to a home gym
- Previous surgery on left knee (2019)
- Lactose intolerant but can handle small amounts"
          />
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
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200"
        >
          Continue
        </button>
      </div>
    </div>
  );
};