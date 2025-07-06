import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if environment variables are properly configured
const isConfigured = supabaseUrl && 
  supabaseKey && 
  supabaseUrl !== 'https://your-project.supabase.co' && 
  supabaseKey !== 'your-anon-key-here' &&
  supabaseUrl.startsWith('https://')

// Create Supabase client with minimal configuration to avoid token issues
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false, // Disable auto refresh to prevent errors
        persistSession: false,   // Don't persist sessions to avoid token issues
        detectSessionInUrl: false // Don't detect sessions from URL
      }
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key')

export const isSupabaseConfigured = isConfigured

// Helper function to clear stale auth tokens
export const clearAuthTokens = () => {
  try {
    // Clear all possible auth-related items from storage
    const keysToRemove = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.includes('supabase') || key.includes('auth') || key.includes('sb-'))) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    // Also clear session storage
    const sessionKeysToRemove = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key && (key.includes('supabase') || key.includes('auth') || key.includes('sb-'))) {
        sessionKeysToRemove.push(key)
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key))
  } catch (error) {
    console.warn('Error clearing auth tokens:', error)
  }
}

export type Database = {
  public: {
    Tables: {
      images: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          thumbnail_url: string | null
          tags: string[]
          uploaded_by: string | null
          file_size: number | null
          width: number | null
          height: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          thumbnail_url?: string | null
          tags?: string[]
          uploaded_by?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          thumbnail_url?: string | null
          tags?: string[]
          uploaded_by?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          username: string | null
          full_name: string | null
          bio: string | null
          avatar_url: string | null
          website: string | null
          total_uploads: number
          total_downloads: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          total_uploads?: number
          total_downloads?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          username?: string | null
          full_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          website?: string | null
          total_uploads?: number
          total_downloads?: number
          created_at?: string
          updated_at?: string
        }
      }
      image_likes: {
        Row: {
          id: string
          image_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          image_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          image_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}