export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_type: string
          description: string | null
          earned_at: string | null
          icon: string | null
          id: string
          is_public: boolean | null
          metadata: Json | null
          points: number | null
          title: string
          user_id: string
        }
        Insert: {
          achievement_type: string
          description?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          points?: number | null
          title: string
          user_id: string
        }
        Update: {
          achievement_type?: string
          description?: string | null
          earned_at?: string | null
          icon?: string | null
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          points?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          confidence_score: number | null
          content: string
          created_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          reasoning: string | null
          recommendation_type: string
          status: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          content: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type: string
          status?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          content?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          reasoning?: string | null
          recommendation_type?: string
          status?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      body_measurements: {
        Row: {
          bicep_cm: number | null
          body_fat_percentage: number | null
          chest_cm: number | null
          created_at: string | null
          hips_cm: number | null
          id: string
          measured_at: string | null
          muscle_mass_kg: number | null
          neck_cm: number | null
          notes: string | null
          thigh_cm: number | null
          user_id: string
          waist_cm: number | null
          weight_kg: number | null
        }
        Insert: {
          bicep_cm?: number | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string | null
          hips_cm?: number | null
          id?: string
          measured_at?: string | null
          muscle_mass_kg?: number | null
          neck_cm?: number | null
          notes?: string | null
          thigh_cm?: number | null
          user_id: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Update: {
          bicep_cm?: number | null
          body_fat_percentage?: number | null
          chest_cm?: number | null
          created_at?: string | null
          hips_cm?: number | null
          id?: string
          measured_at?: string | null
          muscle_mass_kg?: number | null
          neck_cm?: number | null
          notes?: string | null
          thigh_cm?: number | null
          user_id?: string
          waist_cm?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          calories_per_minute: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string | null
          equipment: string[] | null
          exercise_type: string
          id: string
          image_url: string | null
          instructions: string[] | null
          is_custom: boolean | null
          muscle_groups: string[] | null
          name: string
          video_url: string | null
        }
        Insert: {
          calories_per_minute?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          equipment?: string[] | null
          exercise_type: string
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_custom?: boolean | null
          muscle_groups?: string[] | null
          name: string
          video_url?: string | null
        }
        Update: {
          calories_per_minute?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          equipment?: string[] | null
          exercise_type?: string
          id?: string
          image_url?: string | null
          instructions?: string[] | null
          is_custom?: boolean | null
          muscle_groups?: string[] | null
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      food: {
        Row: {
          alpha_carotene: number | null
          ash: number | null
          beta_carotene: number | null
          beta_cryptoxanthin: number | null
          calcium: number | null
          carbohydrate: number | null
          category: string | null
          cholesterol: number | null
          choline: number | null
          copper: number | null
          created_at: string | null
          description: string
          fiber: number | null
          first_household_weight: number | null
          first_household_weight_description: string | null
          household_weight_1: number | null
          household_weight_1_desc: string | null
          household_weight_2: number | null
          household_weight_2_desc: string | null
          id: string
          iron: number | null
          kilocalories: number
          lutein_and_zeaxanthin: number | null
          lutein_zeaxanthin: number | null
          lycopene: number | null
          magnesium: number | null
          manganese: number | null
          monosaturated_fat: number | null
          monounsaturated_fat: number | null
          niacin: number | null
          nutrient_data_bank_number: string
          pantothenic_acid: number | null
          phosphorus: number | null
          polysaturated_fat: number | null
          polyunsaturated_fat: number | null
          potassium: number | null
          protein: number | null
          refuse_percentage: number | null
          retinol: number | null
          riboflavin: number | null
          saturated_fat: number | null
          search_vector: unknown | null
          second_household_weight: number | null
          second_household_weight_description: string | null
          selenium: number | null
          serving_size: number | null
          serving_unit: string | null
          sodium: number | null
          sugar: number | null
          sugar_total: number | null
          thiamin: number | null
          total_fat: number | null
          total_lipid: number | null
          vitamin_a_iu: number | null
          vitamin_a_rae: number | null
          vitamin_b12: number | null
          vitamin_b6: number | null
          vitamin_c: number | null
          vitamin_e: number | null
          vitamin_k: number | null
          water: number | null
          water_content: number | null
          zinc: number | null
        }
        Insert: {
          alpha_carotene?: number | null
          ash?: number | null
          beta_carotene?: number | null
          beta_cryptoxanthin?: number | null
          calcium?: number | null
          carbohydrate?: number | null
          category?: string | null
          cholesterol?: number | null
          choline?: number | null
          copper?: number | null
          created_at?: string | null
          description: string
          fiber?: number | null
          first_household_weight?: number | null
          first_household_weight_description?: string | null
          household_weight_1?: number | null
          household_weight_1_desc?: string | null
          household_weight_2?: number | null
          household_weight_2_desc?: string | null
          id?: string
          iron?: number | null
          kilocalories: number
          lutein_and_zeaxanthin?: number | null
          lutein_zeaxanthin?: number | null
          lycopene?: number | null
          magnesium?: number | null
          manganese?: number | null
          monosaturated_fat?: number | null
          monounsaturated_fat?: number | null
          niacin?: number | null
          nutrient_data_bank_number: string
          pantothenic_acid?: number | null
          phosphorus?: number | null
          polysaturated_fat?: number | null
          polyunsaturated_fat?: number | null
          potassium?: number | null
          protein?: number | null
          refuse_percentage?: number | null
          retinol?: number | null
          riboflavin?: number | null
          saturated_fat?: number | null
          search_vector?: unknown | null
          second_household_weight?: number | null
          second_household_weight_description?: string | null
          selenium?: number | null
          serving_size?: number | null
          serving_unit?: string | null
          sodium?: number | null
          sugar?: number | null
          sugar_total?: number | null
          thiamin?: number | null
          total_fat?: number | null
          total_lipid?: number | null
          vitamin_a_iu?: number | null
          vitamin_a_rae?: number | null
          vitamin_b12?: number | null
          vitamin_b6?: number | null
          vitamin_c?: number | null
          vitamin_e?: number | null
          vitamin_k?: number | null
          water?: number | null
          water_content?: number | null
          zinc?: number | null
        }
        Update: {
          alpha_carotene?: number | null
          ash?: number | null
          beta_carotene?: number | null
          beta_cryptoxanthin?: number | null
          calcium?: number | null
          carbohydrate?: number | null
          category?: string | null
          cholesterol?: number | null
          choline?: number | null
          copper?: number | null
          created_at?: string | null
          description?: string
          fiber?: number | null
          first_household_weight?: number | null
          first_household_weight_description?: string | null
          household_weight_1?: number | null
          household_weight_1_desc?: string | null
          household_weight_2?: number | null
          household_weight_2_desc?: string | null
          id?: string
          iron?: number | null
          kilocalories?: number
          lutein_and_zeaxanthin?: number | null
          lutein_zeaxanthin?: number | null
          lycopene?: number | null
          magnesium?: number | null
          manganese?: number | null
          monosaturated_fat?: number | null
          monounsaturated_fat?: number | null
          niacin?: number | null
          nutrient_data_bank_number?: string
          pantothenic_acid?: number | null
          phosphorus?: number | null
          polysaturated_fat?: number | null
          polyunsaturated_fat?: number | null
          potassium?: number | null
          protein?: number | null
          refuse_percentage?: number | null
          retinol?: number | null
          riboflavin?: number | null
          saturated_fat?: number | null
          search_vector?: unknown | null
          second_household_weight?: number | null
          second_household_weight_description?: string | null
          selenium?: number | null
          serving_size?: number | null
          serving_unit?: string | null
          sodium?: number | null
          sugar?: number | null
          sugar_total?: number | null
          thiamin?: number | null
          total_fat?: number | null
          total_lipid?: number | null
          vitamin_a_iu?: number | null
          vitamin_a_rae?: number | null
          vitamin_b12?: number | null
          vitamin_b6?: number | null
          vitamin_c?: number | null
          vitamin_e?: number | null
          vitamin_k?: number | null
          water?: number | null
          water_content?: number | null
          zinc?: number | null
        }
        Relationships: []
      }
      meal_foods: {
        Row: {
          calories: number
          carbs_g: number | null
          created_at: string | null
          fat_g: number | null
          food_id: string
          id: string
          meal_id: string
          protein_g: number | null
          quantity: number
          unit: string
        }
        Insert: {
          calories: number
          carbs_g?: number | null
          created_at?: string | null
          fat_g?: number | null
          food_id: string
          id?: string
          meal_id: string
          protein_g?: number | null
          quantity?: number
          unit?: string
        }
        Update: {
          calories?: number
          carbs_g?: number | null
          created_at?: string | null
          fat_g?: number | null
          food_id?: string
          id?: string
          meal_id?: string
          protein_g?: number | null
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number | null
          carbs_g: number | null
          consumed_at: string | null
          created_at: string | null
          fat_g: number | null
          id: string
          meal_type: string
          name: string | null
          nutrition_entry_id: string
          protein_g: number | null
        }
        Insert: {
          calories?: number | null
          carbs_g?: number | null
          consumed_at?: string | null
          created_at?: string | null
          fat_g?: number | null
          id?: string
          meal_type: string
          name?: string | null
          nutrition_entry_id: string
          protein_g?: number | null
        }
        Update: {
          calories?: number | null
          carbs_g?: number | null
          consumed_at?: string | null
          created_at?: string | null
          fat_g?: number | null
          id?: string
          meal_type?: string
          name?: string | null
          nutrition_entry_id?: string
          protein_g?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_nutrition_entry_id_fkey"
            columns: ["nutrition_entry_id"]
            isOneToOne: false
            referencedRelation: "nutrition_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_entries: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          total_calories: number | null
          total_carbs_g: number | null
          total_fat_g: number | null
          total_fiber_g: number | null
          total_protein_g: number | null
          total_sodium_mg: number | null
          total_sugar_g: number | null
          updated_at: string | null
          user_id: string
          water_ml: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_fiber_g?: number | null
          total_protein_g?: number | null
          total_sodium_mg?: number | null
          total_sugar_g?: number | null
          updated_at?: string | null
          user_id: string
          water_ml?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          total_calories?: number | null
          total_carbs_g?: number | null
          total_fat_g?: number | null
          total_fiber_g?: number | null
          total_protein_g?: number | null
          total_sodium_mg?: number | null
          total_sugar_g?: number | null
          updated_at?: string | null
          user_id?: string
          water_ml?: number | null
        }
        Relationships: []
      }
      progress_photos: {
        Row: {
          body_fat_percentage: number | null
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean | null
          notes: string | null
          photo_type: string | null
          taken_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          created_at?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          notes?: string | null
          photo_type?: string | null
          taken_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean | null
          notes?: string | null
          photo_type?: string | null
          taken_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_value: number | null
          description: string | null
          goal_type: string
          id: string
          is_public: boolean | null
          priority: number | null
          status: string
          target_date: string | null
          target_value: number | null
          title: string
          unit: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type: string
          id?: string
          is_public?: boolean | null
          priority?: number | null
          status?: string
          target_date?: string | null
          target_value?: number | null
          title: string
          unit?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          goal_type?: string
          id?: string
          is_public?: boolean | null
          priority?: number | null
          status?: string
          target_date?: string | null
          target_value?: number | null
          title?: string
          unit?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_coaching_level: string | null
          created_at: string | null
          id: string
          notification_settings: Json | null
          nutrition_preferences: Json | null
          preferred_units: string | null
          privacy_settings: Json | null
          timezone: string | null
          updated_at: string | null
          user_id: string
          workout_preferences: Json | null
        }
        Insert: {
          ai_coaching_level?: string | null
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          nutrition_preferences?: Json | null
          preferred_units?: string | null
          privacy_settings?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
          workout_preferences?: Json | null
        }
        Update: {
          ai_coaching_level?: string | null
          created_at?: string | null
          id?: string
          notification_settings?: Json | null
          nutrition_preferences?: Json | null
          preferred_units?: string | null
          privacy_settings?: Json | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
          workout_preferences?: Json | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age: number | null
          available_time: number | null
          created_at: string | null
          dietary_restrictions: string[] | null
          fitness_level: string | null
          goals: string[] | null
          height: number | null
          name: string
          onboarding_complete: boolean | null
          updated_at: string | null
          user_id: string
          weight: number | null
          workout_types: string[] | null
        }
        Insert: {
          age?: number | null
          available_time?: number | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          fitness_level?: string | null
          goals?: string[] | null
          height?: number | null
          name: string
          onboarding_complete?: boolean | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
          workout_types?: string[] | null
        }
        Update: {
          age?: number | null
          available_time?: number | null
          created_at?: string | null
          dietary_restrictions?: string[] | null
          fitness_level?: string | null
          goals?: string[] | null
          height?: number | null
          name?: string
          onboarding_complete?: boolean | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
          workout_types?: string[] | null
        }
        Relationships: []
      }
      user_workout_exercises: {
        Row: {
          calories_burned: number | null
          completed: boolean | null
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps_completed: number[] | null
          sets_completed: number | null
          user_workout_id: string
          weight_used_kg: number[] | null
        }
        Insert: {
          calories_burned?: number | null
          completed?: boolean | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number
          reps_completed?: number[] | null
          sets_completed?: number | null
          user_workout_id: string
          weight_used_kg?: number[] | null
        }
        Update: {
          calories_burned?: number | null
          completed?: boolean | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps_completed?: number[] | null
          sets_completed?: number | null
          user_workout_id?: string
          weight_used_kg?: number[] | null
        }
        Relationships: [
          {
            foreignKeyName: "user_workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_workout_exercises_user_workout_id_fkey"
            columns: ["user_workout_id"]
            isOneToOne: false
            referencedRelation: "user_workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_workouts: {
        Row: {
          calories_burned: number | null
          completed_at: string | null
          created_at: string | null
          exercises: Json | null
          id: string
          name: string
          notes: string | null
          rating: number | null
          scheduled_date: string | null
          started_at: string | null
          status: string
          total_duration_minutes: number | null
          updated_at: string | null
          user_id: string
          workout_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          exercises?: Json | null
          id?: string
          name: string
          notes?: string | null
          rating?: number | null
          scheduled_date?: string | null
          started_at?: string | null
          status?: string
          total_duration_minutes?: number | null
          updated_at?: string | null
          user_id: string
          workout_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          completed_at?: string | null
          created_at?: string | null
          exercises?: Json | null
          id?: string
          name?: string
          notes?: string | null
          rating?: number | null
          scheduled_date?: string | null
          started_at?: string | null
          status?: string
          total_duration_minutes?: number | null
          updated_at?: string | null
          user_id?: string
          workout_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_workouts_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_exercises: {
        Row: {
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          weight_kg: number | null
          workout_id: string
        }
        Insert: {
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id: string
        }
        Update: {
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          calories_burned_estimate: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty: string
          duration_minutes: number
          equipment_needed: string[] | null
          id: string
          is_template: boolean | null
          muscle_groups: string[] | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          calories_burned_estimate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty: string
          duration_minutes?: number
          equipment_needed?: string[] | null
          id?: string
          is_template?: boolean | null
          muscle_groups?: string[] | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          calories_burned_estimate?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty?: string
          duration_minutes?: number
          equipment_needed?: string[] | null
          id?: string
          is_template?: boolean | null
          muscle_groups?: string[] | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
