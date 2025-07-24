import React, { useEffect } from 'react';
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

  // Smooth scroll to top when step changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Focus management for accessibility - focus the main container
    const mainContainer = document.querySelector('.onboarding-container');
    if (mainContainer && mainContainer instanceof HTMLElement) {
      mainContainer.focus();
    }
  }, [step]);

  // Enhanced next step function with scroll
  const handleNextStep = () => {
    nextStep();
  };

  // Enhanced prev step function with scroll
  const handlePrevStep = () => {
    prevStep();
  };

  const steps = [
    <WelcomeStep key="welcome" onNext={handleNextStep} />,
    <FitnessLevelStep
      key="fitness-level"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <GoalsStep
      key="goals"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <ActivityLevelStep
      key="activity-level"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <NutritionStep
      key="nutrition"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <HealthInfoStep
      key="health-info"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <PersonalInfoStep
      key="personal-info"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <PhotosStep
      key="photos"
      userData={userData}
      onUpdate={updateUserData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <PlanGenerationStep
      key="plan-generation"
      userData={userData}
      onNext={handleNextStep}
      onPrev={handlePrevStep}
    />,
    <AuthStep
      key="auth"
      userData={userData}
      onComplete={() => { }}
      onPrev={handlePrevStep}
    />,

  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <main
        className="onboarding-container w-full max-w-4xl focus:outline-none"
        role="main"
        aria-label="Onboarding process"
        tabIndex={-1}
      >
        {/* Progress bar */}
        {step > 0 && (
          <div className="mb-8" role="progressbar" aria-label="Onboarding progress">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(step / 9) * 100}%` }}
                aria-valuenow={step}
                aria-valuemin={0}
                aria-valuemax={9}
              />
            </div>
          </div>
        )}

        {/* Step content with smooth transition */}
        <div
          className="transition-all duration-300 ease-in-out transform"
          key={step}
        >
          {steps[step]}
        </div>
      </main>
    </div>
  );
};