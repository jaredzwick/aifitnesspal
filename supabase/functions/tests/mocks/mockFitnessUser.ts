import { FitnessUser } from "../../../../common/models/fitnessUser.ts";
import { FITNESS_GOALS } from "../../../../common/constants.ts";

export const mockFitnessUser: FitnessUser = {
  age: 25,
  sub: "635d4e74-96cc-4bd0-b0f3-8fd5d24f4f13",
  goal: FITNESS_GOALS.MUSCLE_GROWTH,
  name: "Jared Zwick",
  email: "jareddzwick@gmail.com",
  gender: "male",
  height: 185,
  weight: 74.8,
  canDoMore: true,
  fitnessLevel: "intermediate",
  pastInjuries: [
    "Shoulder injury",
    "my right should is kinda fucked up",
  ],
  dailyCalories: 2000,
  detailedEating: "i live off a coffee and pizza diet",
  email_verified: true,
  phone_verified: false,
  progressPhotos: [],
  trainDaysPerWeek: 3,
  cardioDaysPerWeek: 1,
  prefersMetric: true,
  dietaryRestrictions: [
    "asdf",
    "Vegetarian",
  ],
};
