export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          website: string | null
          github_username: string | null
          linkedin_url: string | null
          learning_goals: string[] | null
          interests: string[] | null
          preferred_learning_style: 'visual' | 'auditory' | 'kinesthetic' | null
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          github_username?: string | null
          linkedin_url?: string | null
          learning_goals?: string[] | null
          interests?: string[] | null
          preferred_learning_style?: 'visual' | 'auditory' | 'kinesthetic' | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          github_username?: string | null
          linkedin_url?: string | null
          learning_goals?: string[] | null
          interests?: string[] | null
          preferred_learning_style?: 'visual' | 'auditory' | 'kinesthetic' | null
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string
          color: string | null
          course_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon: string
          color?: string | null
          course_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string
          color?: string | null
          course_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      instructors: {
        Row: {
          id: string
          name: string
          title: string
          bio: string | null
          avatar_url: string | null
          email: string | null
          website: string | null
          social_links: Json | null
          expertise: string[] | null
          rating: number | null
          total_students: number
          total_courses: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          bio?: string | null
          avatar_url?: string | null
          email?: string | null
          website?: string | null
          social_links?: Json | null
          expertise?: string[] | null
          rating?: number | null
          total_students?: number
          total_courses?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          bio?: string | null
          avatar_url?: string | null
          email?: string | null
          website?: string | null
          social_links?: Json | null
          expertise?: string[] | null
          rating?: number | null
          total_students?: number
          total_courses?: number
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string | null
          duration_minutes: number
          level: 'beginner' | 'intermediate' | 'advanced'
          category_id: string
          instructor_id: string
          price: number | null
          currency: string
          tags: string[] | null
          learning_objectives: string[] | null
          prerequisites: string[] | null
          rating: number | null
          review_count: number
          enrolled_count: number
          is_featured: boolean
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url?: string | null
          duration_minutes: number
          level: 'beginner' | 'intermediate' | 'advanced'
          category_id: string
          instructor_id: string
          price?: number | null
          currency?: string
          tags?: string[] | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          rating?: number | null
          review_count?: number
          enrolled_count?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string | null
          duration_minutes?: number
          level?: 'beginner' | 'intermediate' | 'advanced'
          category_id?: string
          instructor_id?: string
          price?: number | null
          currency?: string
          tags?: string[] | null
          learning_objectives?: string[] | null
          prerequisites?: string[] | null
          rating?: number | null
          review_count?: number
          enrolled_count?: number
          is_featured?: boolean
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string | null
          content_type: 'video' | 'text' | 'quiz' | 'exercise' | 'assignment'
          content_url: string | null
          duration_minutes: number | null
          order_index: number
          is_preview: boolean
          transcript: string | null
          resources: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description?: string | null
          content_type: 'video' | 'text' | 'quiz' | 'exercise' | 'assignment'
          content_url?: string | null
          duration_minutes?: number | null
          order_index: number
          is_preview?: boolean
          transcript?: string | null
          resources?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string | null
          content_type?: 'video' | 'text' | 'quiz' | 'exercise' | 'assignment'
          content_url?: string | null
          duration_minutes?: number | null
          order_index?: number
          is_preview?: boolean
          transcript?: string | null
          resources?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          enrolled_at: string
          completed_at: string | null
          progress_percentage: number
          last_accessed_at: string | null
          certificate_url: string | null
          rating: number | null
          review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          last_accessed_at?: string | null
          certificate_url?: string | null
          rating?: number | null
          review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          enrolled_at?: string
          completed_at?: string | null
          progress_percentage?: number
          last_accessed_at?: string | null
          certificate_url?: string | null
          rating?: number | null
          review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          time_spent_minutes: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          time_spent_minutes?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          time_spent_minutes?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      coaching_sessions: {
        Row: {
          id: string
          user_id: string
          coach_id: string
          title: string
          description: string | null
          scheduled_at: string
          duration_minutes: number
          status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          meeting_url: string | null
          notes: string | null
          feedback: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          coach_id: string
          title: string
          description?: string | null
          scheduled_at: string
          duration_minutes: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          meeting_url?: string | null
          notes?: string | null
          feedback?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          coach_id?: string
          title?: string
          description?: string | null
          scheduled_at?: string
          duration_minutes?: number
          status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled'
          meeting_url?: string | null
          notes?: string | null
          feedback?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'tool'
          category: string | null
          file_url: string | null
          external_url: string | null
          file_size: number | null
          file_type: string | null
          tags: string[] | null
          is_premium: boolean
          download_count: number
          rating: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'document' | 'video' | 'audio' | 'image' | 'link' | 'tool'
          category?: string | null
          file_url?: string | null
          external_url?: string | null
          file_size?: number | null
          file_type?: string | null
          tags?: string[] | null
          is_premium?: boolean
          download_count?: number
          rating?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'document' | 'video' | 'audio' | 'image' | 'link' | 'tool'
          category?: string | null
          file_url?: string | null
          external_url?: string | null
          file_size?: number | null
          file_type?: string | null
          tags?: string[] | null
          is_premium?: boolean
          download_count?: number
          rating?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          criteria: Json
          points: number
          badge_color: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon: string
          criteria: Json
          points?: number
          badge_color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          criteria?: Json
          points?: number
          badge_color?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          earned_at: string
          progress: number
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          earned_at?: string
          progress?: number
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          earned_at?: string
          progress?: number
          metadata?: Json | null
          created_at?: string
        }
      }
      learning_paths: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail_url: string | null
          estimated_duration_hours: number | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          tags: string[] | null
          is_featured: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail_url?: string | null
          estimated_duration_hours?: number | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          tags?: string[] | null
          is_featured?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail_url?: string | null
          estimated_duration_hours?: number | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          tags?: string[] | null
          is_featured?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      learning_path_courses: {
        Row: {
          id: string
          learning_path_id: string
          course_id: string
          order_index: number
          is_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          learning_path_id: string
          course_id: string
          order_index: number
          is_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          learning_path_id?: string
          course_id?: string
          order_index?: number
          is_required?: boolean
          created_at?: string
        }
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