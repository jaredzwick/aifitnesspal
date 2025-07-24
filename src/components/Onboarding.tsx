import React from 'react';
import { useOnboarding } from '../hooks/useOnboarding';
import { WelcomeStep } from './onboarding/WelcomeStep';
import { PersonalInfoStep } from './onboarding/PersonalInfoStep';
import { FitnessLevelStep } from './onboarding/FitnessLevelStep';
import { GoalsStep } from './onboarding/GoalsStep';
import { ActivityLevelStep } from './onboarding/ActivityLevelStep';
import { NutritionStep } from './onboarding/NutritionStep';
import { HealthInfoStep } from './onboarding/HealthInfoStep';
import { PhotosStep } from './onboarding/PhotosStep';
import { AuthStep } from './onboarding/AuthStep';
import { PlanGenerationStep } from './onboarding/PlanGenerationStep';

export const Onboarding: React.FC = () => {
  const { step, userData, updateUserData, nextStep, prevStep } = useOnboarding();

  const steps = [
    <WelcomeStep key="welcome" onNext={nextStep} />,
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
    <ActivityLevelStep
      key="activity-level"
      userData={userData}
      onUpdate={updateUserData}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <NutritionStep
      key="nutrition"
      userData={userData}
      onUpdate={updateUserData}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <HealthInfoStep
      key="health-info"
      userData={userData}
      onUpdate={updateUserData}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <PersonalInfoStep
      key="personal-info"
      userData={userData}
      onUpdate={updateUserData}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <PhotosStep
      key="photos"
      userData={userData}
      onUpdate={updateUserData}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <PlanGenerationStep
      key="plan-generation"
      userData={userData}
      onNext={nextStep}
      onPrev={prevStep}
    />,
    <AuthStep
      key="auth"
      userData={userData}
      onComplete={() => { }}
      onPrev={prevStep}
    />,

  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress bar */}
        {step > 0 && (
          <div className="mb-8">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 9) * 100}%` }}
              />
            </div>
          </div>
        )}

        {steps[step]}
      </div>
    </div>
  );
};