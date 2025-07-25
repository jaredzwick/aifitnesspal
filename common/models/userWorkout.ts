import { Database } from "../../supabase/database/supabase";

export type UserWorkout = Database["public"]["Tables"]["user_workouts"]["Row"];
