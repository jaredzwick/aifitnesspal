import { useState } from 'react';
import { FitnessUser } from '../types';

export const useOnboarding = () => {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<Partial<FitnessUser>>({});

  const updateUserData = (data: Partial<FitnessUser>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));


  return {
    step,
    userData,
    updateUserData,
    nextStep,
    prevStep,
  };
};