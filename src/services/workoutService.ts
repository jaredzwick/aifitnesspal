import { apiClient } from "../lib/api";

// Workout types
export interface Workout {
  id: string;
  name: string;
  description?: string;
  type: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  calories_burned_estimate: number;
  equipment_needed: string[];
  muscle_groups: string[];
  is_template: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions: string[];
  muscle_groups: string[];
  equipment_needed: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  exercise_type: string;
}

export interface UserWorkout {
  id: string;
  user_id: string;
  workout_id: string;
  scheduled_for?: string;
  started_at?: string;
  completed_at?: string;
  status: "scheduled" | "in_progress" | "completed" | "skipped";
  notes?: string;
  workout?: Workout;
}

export interface WorkoutFilters {
  type?: string;
  difficulty?: string;
  is_template?: boolean;
  muscle_groups?: string[];
}

// Workout service
export const workoutService = {
  // Get workouts with optional filters
  getWorkouts: (filters: WorkoutFilters = {}): Promise<Workout[]> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.append(key, String(value));
        }
      }
    });

    const queryString = params.toString();
    return apiClient.get(`/workouts${queryString ? `?${queryString}` : ""}`);
  },

  // Get specific workout by ID
  getWorkout: (id: string): Promise<Workout> => {
    return apiClient.get(`/workouts/${id}`);
  },

  // Create new workout
  createWorkout: (
    workout: Omit<Workout, "id" | "created_at" | "updated_at" | "created_by">,
  ): Promise<Workout> => {
    return apiClient.post("/workouts", workout);
  },

  // Update workout
  updateWorkout: (id: string, workout: Partial<Workout>): Promise<Workout> => {
    return apiClient.put(`/workouts/${id}`, workout);
  },

  // Delete workout
  deleteWorkout: (id: string): Promise<{ success: boolean }> => {
    return apiClient.delete(`/workouts/${id}`);
  },

  // Get user's workout history
  getUserWorkouts: (
    filters: { status?: string; date?: string } = {},
  ): Promise<UserWorkout[]> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    const queryString = params.toString();
    return apiClient.get(
      `/user-workouts${queryString ? `?${queryString}` : ""}`,
    );
  },

  // Schedule workout
  scheduleWorkout: (
    workoutId: string,
    scheduledFor: string,
  ): Promise<UserWorkout> => {
    return apiClient.post("/user-workouts", {
      workout_id: workoutId,
      scheduled_for: scheduledFor,
      status: "scheduled",
    });
  },

  // Start workout
  startWorkout: (userWorkoutId: string): Promise<UserWorkout> => {
    return apiClient.put(`/user-workouts/${userWorkoutId}`, {
      status: "in_progress",
      started_at: new Date().toISOString(),
    });
  },

  // Complete workout
  completeWorkout: (
    userWorkoutId: string,
    notes?: string,
  ): Promise<UserWorkout> => {
    return apiClient.put(`/user-workouts/${userWorkoutId}`, {
      status: "completed",
      completed_at: new Date().toISOString(),
      notes,
    });
  },

  // Get user's current active workout
  getActiveWorkout: (): Promise<UserWorkout | null> => {
    return apiClient.get("/user-workouts?status=in_progress").then((workouts) =>
      (workouts as UserWorkout[])[0] || null
    );
  },

  // Update workout exercise set
  updateWorkoutSet: (
    userWorkoutId: string,
    exerciseId: string,
    setData: any,
  ): Promise<any> => {
    return apiClient.put(
      `/user-workouts/${userWorkoutId}/exercises/${exerciseId}/sets`,
      setData,
    );
  },

  // Add set to workout exercise
  addWorkoutSet: (
    userWorkoutId: string,
    exerciseId: string,
    setData: any,
  ): Promise<any> => {
    return apiClient.post(
      `/user-workouts/${userWorkoutId}/exercises/${exerciseId}/sets`,
      setData,
    );
  },
};
