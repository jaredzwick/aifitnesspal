import { FITNESS_GOALS } from "../constants.ts";
import { PersonalizedPlan } from "../types.ts";

export interface FitnessUser {
  name: string;
  email: string;
  gender: "male" | "female" | "other";
  age: number;
  height: number;
  weight: number;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  goal: FITNESS_GOALS;
  cardioDaysPerWeek: number;
  trainDaysPerWeek: number;
  canDoMore: boolean;
  dailyCalories: number;
  detailedEating?: string;
  pastInjuries: string[];
  dietaryRestrictions: string[];
  additionalHealthNotes?: string;
  sub: string;
  email_verified: boolean;
  phone_verified: boolean;
  personalizedPlan?: PersonalizedPlan;
  progressPhotos?: Array<{
    type: "front" | "side" | "back";
    file: File;
    preview: string;
  }>;
}
