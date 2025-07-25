import { UserWorkout } from "../../common/types";
import { apiClient } from "../lib/api";

// Workout service
export const workoutService = {
  // Start workout
  startWorkout: (day: string): Promise<UserWorkout> => {
    return apiClient.post(`/user-workouts`, {
      name: day,
      status: "in_progress",
      started_at: new Date().toISOString(),
    });
  },
  getActiveWorkout: () => {
    return apiClient.get<UserWorkout>(`/user-workouts?status=in_progress`);
  },
};
