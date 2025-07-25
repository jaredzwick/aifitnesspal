import { Database } from "../../supabase/database/supabase.ts";

export type UserWorkout = Database["public"]["Tables"]["user_workouts"]["Row"];
