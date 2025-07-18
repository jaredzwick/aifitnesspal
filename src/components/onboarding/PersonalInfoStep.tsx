import React, { useState } from 'react';
import { FitnessUser } from '../../types';

interface PersonalInfoStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [formData, setFormData] = useState({
    name: userData.name || '',
    email: userData.email || '',
    age: userData.age || '',
    gender: userData.gender || '',
    height: userData.height || '',
    weight: userData.weight || '',
    heightFeet: '',
    heightInches: '',
  });

  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('ft');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('lbs');

  // Convert height from feet/inches to cm
  const convertHeightToCm = (feet: number, inches: number) => {
    return Math.round((feet * 12 + inches) * 2.54);
  };

  // Convert height from cm to feet/inches
  const convertHeightToFeetInches = (cm: number) => {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  };

  // Convert weight from lbs to kg
  const convertWeightToKg = (lbs: number) => {
    return Math.round(lbs * 0.453592 * 10) / 10;
  };

  // Convert weight from kg to lbs
  const convertWeightToLbs = (kg: number) => {
    return Math.round(kg * 2.20462 * 10) / 10;
  };

  const handleHeightUnitChange = (unit: 'cm' | 'ft') => {
    if (unit === heightUnit) return;
    
    setHeightUnit(unit);
    
    if (unit === 'ft' && formData.height) {
      const { feet, inches } = convertHeightToFeetInches(Number(formData.height));
      setFormData(prev => ({
        ...prev,
        heightFeet: feet.toString(),
        heightInches: inches.toString(),
      }));
    } else if (unit === 'cm' && formData.heightFeet && formData.heightInches) {
      const cm = convertHeightToCm(Number(formData.heightFeet), Number(formData.heightInches));
      setFormData(prev => ({
        ...prev,
        height: cm.toString(),
      }));
    }
  };

  const handleWeightUnitChange = (unit: 'kg' | 'lbs') => {
    if (unit === weightUnit) return;
    
    setWeightUnit(unit);
    
    if (formData.weight) {
      const currentWeight = Number(formData.weight);
      let newWeight;
      
      if (unit === 'lbs' && weightUnit === 'kg') {
        newWeight = convertWeightToLbs(currentWeight);
      } else if (unit === 'kg' && weightUnit === 'lbs') {
        newWeight = convertWeightToKg(currentWeight);
      }
      
      if (newWeight) {
        setFormData(prev => ({
          ...prev,
          weight: newWeight.toString(),
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalHeight = Number(formData.height);
    let finalWeight = Number(formData.weight);
    
    // Convert height to cm if in feet/inches
    if (heightUnit === 'ft' && formData.heightFeet && formData.heightInches) {
      finalHeight = convertHeightToCm(Number(formData.heightFeet), Number(formData.heightInches));
    }
    
    // Convert weight to kg if in lbs
    if (weightUnit === 'lbs') {
      finalWeight = convertWeightToKg(Number(formData.weight));
    }
    
    onUpdate({
      name: formData.name,
      email: formData.email,
      age: Number(formData.age),
      gender: formData.gender as 'male' | 'female' | 'other',
      height: finalHeight,
      weight: finalWeight,
    });
    onNext();
  };

  const isValid = formData.name && formData.age && formData.gender && 
    ((heightUnit === 'cm' && formData.height) || 
     (heightUnit === 'ft' && formData.heightFeet && formData.heightInches)) &&
    formData.weight;

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tell us about yourself
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          This helps us create a personalized experience just for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            What's your name?
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="25"
              min="13"
              max="100"
              required
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Height Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Height
            </label>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleHeightUnitChange('cm')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  heightUnit === 'cm'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                cm
              </button>
              <button
                type="button"
                onClick={() => handleHeightUnitChange('ft')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  heightUnit === 'ft'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                ft/in
              </button>
            </div>
          </div>

          {heightUnit === 'cm' ? (
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              placeholder="170"
              min="100"
              max="250"
              required
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  value={formData.heightFeet}
                  onChange={(e) => setFormData({ ...formData, heightFeet: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="5"
                  min="3"
                  max="8"
                  required
                />
                <label className="block text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  feet
                </label>
              </div>
              <div>
                <input
                  type="number"
                  value={formData.heightInches}
                  onChange={(e) => setFormData({ ...formData, heightInches: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  placeholder="10"
                  min="0"
                  max="11"
                  required
                />
                <label className="block text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  inches
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Weight Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fasted Weight
              </label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-xs text-blue-600 dark:text-blue-400">i</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Fasted weight means the weight you are in the morning when you first wake up before adding substance
                </p>
              </div>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleWeightUnitChange('kg')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  weightUnit === 'kg'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                kg
              </button>
              <button
                type="button"
                onClick={() => handleWeightUnitChange('lbs')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  weightUnit === 'lbs'
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                lbs
              </button>
            </div>
          </div>

          <input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            placeholder={weightUnit === 'kg' ? '70' : '154'}
            min={weightUnit === 'kg' ? '30' : '66'}
            max={weightUnit === 'kg' ? '200' : '440'}
            required
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};