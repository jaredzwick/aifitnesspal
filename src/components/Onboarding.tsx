import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { WelcomeStep } from './onboarding/WelcomeStep';
import { PersonalInfoStep } from './onboarding/PersonalInfoStep';
import { FitnessLevelStep } from './onboarding/FitnessLevelStep';
import { GoalsStep } from './onboarding/GoalsStep';
import { PreferencesStep } from './onboarding/PreferencesStep';
import { AuthStep } from './onboarding/AuthStep';

export const Onboarding: React.FC = () => {
  const { step, userData, updateUserData, nextStep, prevStep } = useOnboarding();

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} />,
    <PersonalInfoStep 
      key="personal-info" 
      userData={userData} 
      onUpdate={updateUserData} 
      onNext={nextStep} 
      onPrev={prevStep} 
    />,
    <FitnessLevelStep 
      key="fitness-level" 
      userData={userData} 
      onUpdate={updateUserData} 
      onNext={nextStep} 
      onPrev={prevStep} 
    />,
    <GoalsStep 
      key="goals" 
      userData={userData} 
      onUpdate={updateUserData} 
      onNext={nextStep} 
      onPrev={prevStep} 
    />,
    <PreferencesStep 
      key="preferences" 
      userData={userData} 
      onUpdate={updateUserData} 
      onNext={nextStep} 
      onPrev={prevStep} 
    />,
    <AuthStep
      key="auth"
      userData={userData}
      onComplete={() => {}}
      onPrev={prevStep}
    />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="flex justify-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Step {step} of 5
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {steps[step]}
      </div>
    </div>
  );
};