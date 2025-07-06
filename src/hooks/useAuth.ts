import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured, clearAuthTokens } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // Always set loading to false after a maximum of 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    if (!isSupabaseConfigured) {
      setLoading(false)
      clearTimeout(timeout)
      return
    }

    // Get initial session with aggressive error handling
    const initializeAuth = async () => {
      try {
        // Clear any potentially corrupted tokens first
        clearAuthTokens()
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.warn('Session error, clearing tokens:', error.message)
          clearAuthTokens()
          setUser(null)
          setProfile(null)
          setLoading(false)
          clearTimeout(timeout)
          return
        }

        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
        setLoading(false)
        clearTimeout(timeout)
      } catch (error) {
        console.warn('Auth initialization error, clearing tokens:', error)
        clearAuthTokens()
        setUser(null)
        setProfile(null)
        setLoading(false)
        clearTimeout(timeout)
      }
    }

    initializeAuth()

    // Listen for auth changes with error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null)
          if (session?.user) {
            await fetchUserProfile(session.user.id)
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.warn('Auth state change error:', error)
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
        clearTimeout(timeout)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (!data) {
        // Create profile if it doesn't exist
        await createUserProfile(userId)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          username: `user_${userId.slice(0, 8)}`,
          total_uploads: 0,
          total_downloads: 0
        })
        .select()
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error creating profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please set up your environment variables.') }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      // Clear tokens if sign in fails due to token issues
      if (error instanceof Error && error.message.includes('refresh_token')) {
        clearAuthTokens()
      }
      return { error }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured. Please set up your environment variables.') }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      return { error: new Error('Supabase is not configured.') }
    }

    try {
      const { error } = await supabase.auth.signOut()
      setProfile(null)
      // Clear tokens on sign out
      clearAuthTokens()
      return { error }
    } catch (error) {
      // Even if sign out fails, clear local tokens
      clearAuthTokens()
      setUser(null)
      setProfile(null)
      return { error }
    }
  }

  const updateProfile = async (updates: {
    username?: string
    full_name?: string
    bio?: string
    website?: string
  }) => {
    if (!user || !isSupabaseConfigured) return { error: new Error('Not authenticated') }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isConfigured: isSupabaseConfigured,
  }
}