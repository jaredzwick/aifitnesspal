export interface FitnessUser {
    name: string;
    email: string;
    gender: 'male' | 'female' | 'other';
    age: number;
    height: number;
    weight: number;
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
    goal: string;
    cardioDaysPerWeek: number;
    trainDaysPerWeek: number;
    canDoMore: boolean;
    dailyCalories: number;
    detailedEating?: string;
    pastInjuries: string[];
    dietaryRestrictions: string[];
    additionalHealthNotes?: string;
    progressPhotos?: Array<{
      type: 'front' | 'side' | 'back';
      file: File;
      preview: string;
    }>;
    preferences: {
      workoutTypes: string[];
      dietaryRestrictions: string[];
      availableTime: number;
    };
    onboardingComplete: boolean;
}
  