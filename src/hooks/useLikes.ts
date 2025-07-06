import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useLikes(imageId: string) {
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (imageId && !imageId.startsWith('demo-')) {
      fetchLikeData()
    } else {
      // For demo images, use random like counts
      setLikeCount(Math.floor(Math.random() * 100) + 10)
      setIsLiked(false)
    }
  }, [imageId, user])

  const fetchLikeData = async () => {
    if (!isSupabaseConfigured) return

    try {
      // Get like count
      const { data: likeCountData, error: countError } = await supabase
        .rpc('get_image_like_count', { image_id: imageId })

      if (countError) throw countError
      setLikeCount(likeCountData || 0)

      // Check if user liked this image
      if (user) {
        const { data: userLikedData, error: likedError } = await supabase
          .rpc('user_liked_image', { 
            image_id: imageId, 
            user_id: user.id 
          })

        if (likedError) throw likedError
        setIsLiked(userLikedData || false)
      } else {
        setIsLiked(false)
      }
    } catch (error) {
      console.error('Error fetching like data:', error)
    }
  }

  const toggleLike = async () => {
    if (!user || !isSupabaseConfigured || imageId.startsWith('demo-')) {
      return { success: false, error: 'Authentication required or demo image' }
    }

    setLoading(true)
    try {
      if (isLiked) {
        // Unlike the image
        const { error } = await supabase
          .from('image_likes')
          .delete()
          .eq('image_id', imageId)
          .eq('user_id', user.id)

        if (error) throw error
        
        setIsLiked(false)
        setLikeCount(prev => Math.max(0, prev - 1))
      } else {
        // Like the image
        const { error } = await supabase
          .from('image_likes')
          .insert({
            image_id: imageId,
            user_id: user.id
          })

        if (error) throw error
        
        setIsLiked(true)
        setLikeCount(prev => prev + 1)
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error toggling like:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to toggle like' 
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    likeCount,
    isLiked,
    loading,
    toggleLike,
    canLike: user && isSupabaseConfigured && !imageId.startsWith('demo-')
  }
}