export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          price: number
          product_name: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          price: number
          product_name: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          price?: number
          product_name?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_ai: boolean | null
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          message: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_ai?: boolean | null
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_meal_plans: {
        Row: {
          breakfast_meal_id: string | null
          created_at: string | null
          date: string
          dinner_meal_id: string | null
          id: string
          lunch_meal_id: string | null
          snack_meal_id: string | null
          user_id: string
        }
        Insert: {
          breakfast_meal_id?: string | null
          created_at?: string | null
          date: string
          dinner_meal_id?: string | null
          id?: string
          lunch_meal_id?: string | null
          snack_meal_id?: string | null
          user_id: string
        }
        Update: {
          breakfast_meal_id?: string | null
          created_at?: string | null
          date?: string
          dinner_meal_id?: string | null
          id?: string
          lunch_meal_id?: string | null
          snack_meal_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_meal_plans_breakfast_meal_id_fkey"
            columns: ["breakfast_meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_meal_plans_dinner_meal_id_fkey"
            columns: ["dinner_meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_meal_plans_lunch_meal_id_fkey"
            columns: ["lunch_meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_meal_plans_snack_meal_id_fkey"
            columns: ["snack_meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_reminders: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          reminder_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reminder_time?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          reminder_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string
          day_of_week: number | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          instructions: string | null
          name: string
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          name: string
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          name?: string
        }
        Relationships: []
      }
      image_bank: {
        Row: {
          created_at: string | null
          file_size: number | null
          filename: string
          id: string
          mime_type: string | null
          original_name: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          filename: string
          id?: string
          mime_type?: string | null
          original_name: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          filename?: string
          id?: string
          mime_type?: string | null
          original_name?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_completions: {
        Row: {
          completed_date: string
          created_at: string | null
          id: string
          meal_id: string
          meal_type: string
          user_id: string
        }
        Insert: {
          completed_date: string
          created_at?: string | null
          id?: string
          meal_id: string
          meal_type: string
          user_id: string
        }
        Update: {
          completed_date?: string
          created_at?: string | null
          id?: string
          meal_id?: string
          meal_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_completions_meal_id_fkey"
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
          carbs: number | null
          created_at: string | null
          description: string | null
          fat: number | null
          id: string
          image_url: string | null
          ingredients: string | null
          instructions: string | null
          name: string
          protein: number | null
          type: string
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          description?: string | null
          fat?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          instructions?: string | null
          name: string
          protein?: number | null
          type?: string
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          description?: string | null
          fat?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          instructions?: string | null
          name?: string
          protein?: number | null
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          avatar_url: string | null
          created_at: string | null
          current_weight: number | null
          dietary_preferences: string | null
          dietary_restrictions: string | null
          email: string | null
          full_name: string | null
          goals: string | null
          height: number | null
          id: string
          is_trial_active: boolean | null
          medical_conditions: string | null
          target_weight: number | null
          trial_end: string | null
          updated_at: string | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          current_weight?: number | null
          dietary_preferences?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          full_name?: string | null
          goals?: string | null
          height?: number | null
          id: string
          is_trial_active?: boolean | null
          medical_conditions?: string | null
          target_weight?: number | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          avatar_url?: string | null
          created_at?: string | null
          current_weight?: number | null
          dietary_preferences?: string | null
          dietary_restrictions?: string | null
          email?: string | null
          full_name?: string | null
          goals?: string | null
          height?: number | null
          id?: string
          is_trial_active?: boolean | null
          medical_conditions?: string | null
          target_weight?: number | null
          trial_end?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          recorded_date: string
          user_id: string
          weight: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recorded_date: string
          user_id: string
          weight: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recorded_date?: string
          user_id?: string
          weight?: number
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
