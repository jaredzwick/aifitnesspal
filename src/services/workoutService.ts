import { WeeklyWorkoutPlan } from "../../common/types";
import { UserWorkout, WORKOUT_STATUS } from "../../common";
import { apiClient } from "../lib/api";

interface StartWorkoutParams {
  day: string;
  workout: WeeklyWorkoutPlan;
}

// Workout service
export const workoutService = {
  // Start workout
  startWorkout: ({
    day,
    workout,
  }: StartWorkoutParams): Promise<UserWorkout> => {
    return apiClient.post(`/user-workouts`, {
      name: day,
      status: WORKOUT_STATUS.IN_PROGRESS,
      started_at: new Date().toISOString(),
      exercises: workout,
    });
  },
  getActiveWorkout: (): Promise<UserWorkout> => {
    return apiClient.get<UserWorkout>(`/user-workouts`);
  },
};
