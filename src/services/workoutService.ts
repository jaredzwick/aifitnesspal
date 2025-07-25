import { WeeklyWorkoutPlan } from "../../common/types";
import { UserWorkout, WORKOUT_STATUS } from "../../common";
import { apiClient } from "../lib/api";

interface StartWorkoutParams {
  day: string;
  workout: WeeklyWorkoutPlan;
}

interface PersistCompletedSetParams {
  activeWorkout: WeeklyWorkoutPlan;
  userWorkout: UserWorkout;
}

interface CompleteWorkoutParams {
  activeWorkout: WeeklyWorkoutPlan;
  userWorkout: UserWorkout;
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
  persistCompletedSet: ({
    activeWorkout,
    userWorkout,
  }: PersistCompletedSetParams) => {
    return apiClient.put(`/user-workouts/${userWorkout.id}`, activeWorkout);
  },
  completeWorkout: ({
    activeWorkout,
    userWorkout,
  }: CompleteWorkoutParams) => {
    return apiClient.put(`/user-workouts/${userWorkout.id}`, {
      activeWorkout,
      status: WORKOUT_STATUS.COMPLETED,
      completed_at: new Date().toISOString(),
    });
  },
};
