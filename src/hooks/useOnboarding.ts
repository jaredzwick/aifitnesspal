import { useState } from 'react';
import { User as FitnessUser } from '../types';
import { useUserProfile } from './useUserProfile';

export const useOnboarding = () => {
  const { saveProfile } = useUserProfile();
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<Partial<FitnessUser>>({});

  const updateUserData = (data: Partial<FitnessUser>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => Math.max(0, prev - 1));

  const completeOnboarding = async () => {
    const user: FitnessUser = {
      ...userData,
      id: crypto.randomUUID(),
      onboardingComplete: true,
    } as FitnessUser;
    
    // Save to Supabase instead of localStorage
    await saveProfile(user);
    return user;
  };

  return {
    step,
    userData,
    updateUserData,
    nextStep,
    prevStep,
    completeOnboarding,
  };
};