import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { demoImages } from '../data/demoImages'
import type { Database } from '../lib/supabase'

type Image = Database['public']['Tables']['images']['Row']

export function useImages() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured) {
        // Use demo images when Supabase is not configured
        const demoImagesWithIds = demoImages.map((img, index) => ({
          id: `demo-${index}`,
          title: img.title,
          description: img.description,
          image_url: img.image_url,
          thumbnail_url: null,
          tags: img.tags,
          uploaded_by: null,
          file_size: img.file_size,
          width: img.width,
          height: img.height,
          created_at: new Date(Date.now() - index * 86400000).toISOString(),
          updated_at: new Date(Date.now() - index * 86400000).toISOString()
        }))
        setImages(demoImagesWithIds)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // If no images in database, use demo images
      if (!data || data.length === 0) {
        const demoImagesWithIds = demoImages.map((img, index) => ({
          id: `demo-${index}`,
          title: img.title,
          description: img.description,
          image_url: img.image_url,
          thumbnail_url: null,
          tags: img.tags,
          uploaded_by: null,
          file_size: img.file_size,
          width: img.width,
          height: img.height,
          created_at: new Date(Date.now() - index * 86400000).toISOString(),
          updated_at: new Date(Date.now() - index * 86400000).toISOString()
        }))
        setImages(demoImagesWithIds)
      } else {
        setImages(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch images')
      // Fallback to demo images on error
      const demoImagesWithIds = demoImages.map((img, index) => ({
        id: `demo-${index}`,
        title: img.title,
        description: img.description,
        image_url: img.image_url,
        thumbnail_url: null,
        tags: img.tags,
        uploaded_by: null,
        file_size: img.file_size,
        width: img.width,
        height: img.height,
        created_at: new Date(Date.now() - index * 86400000).toISOString(),
        updated_at: new Date(Date.now() - index * 86400000).toISOString()
      }))
      setImages(demoImagesWithIds)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const searchImages = async (query: string) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isSupabaseConfigured) {
        // Search demo images when Supabase is not configured
        const filteredDemoImages = query.trim() 
          ? demoImages.filter(img => 
              img.title.toLowerCase().includes(query.toLowerCase()) ||
              img.description.toLowerCase().includes(query.toLowerCase()) ||
              img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            )
          : demoImages

        const demoImagesWithIds = filteredDemoImages.map((img, index) => ({
          id: `demo-${index}`,
          title: img.title,
          description: img.description,
          image_url: img.image_url,
          thumbnail_url: null,
          tags: img.tags,
          uploaded_by: null,
          file_size: img.file_size,
          width: img.width,
          height: img.height,
          created_at: new Date(Date.now() - index * 86400000).toISOString(),
          updated_at: new Date(Date.now() - index * 86400000).toISOString()
        }))
        setImages(demoImagesWithIds)
        setLoading(false)
        return
      }

      let queryBuilder = supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`
        )
      }

      const { data, error } = await queryBuilder
      
      if (error) throw error
      
      // If no database results or empty database, search demo images
      if (!data || data.length === 0) {
        const filteredDemoImages = query.trim() 
          ? demoImages.filter(img => 
              img.title.toLowerCase().includes(query.toLowerCase()) ||
              img.description.toLowerCase().includes(query.toLowerCase()) ||
              img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            )
          : demoImages

        const demoImagesWithIds = filteredDemoImages.map((img, index) => ({
          id: `demo-${index}`,
          title: img.title,
          description: img.description,
          image_url: img.image_url,
          thumbnail_url: null,
          tags: img.tags,
          uploaded_by: null,
          file_size: img.file_size,
          width: img.width,
          height: img.height,
          created_at: new Date(Date.now() - index * 86400000).toISOString(),
          updated_at: new Date(Date.now() - index * 86400000).toISOString()
        }))
        setImages(demoImagesWithIds)
      } else {
        setImages(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search images')
      // Fallback to searching demo images
      const filteredDemoImages = query.trim() 
        ? demoImages.filter(img => 
            img.title.toLowerCase().includes(query.toLowerCase()) ||
            img.description.toLowerCase().includes(query.toLowerCase()) ||
            img.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
          )
        : demoImages

      const demoImagesWithIds = filteredDemoImages.map((img, index) => ({
        id: `demo-${index}`,
        title: img.title,
        description: img.description,
        image_url: img.image_url,
        thumbnail_url: null,
        tags: img.tags,
        uploaded_by: null,
        file_size: img.file_size,
        width: img.width,
        height: img.height,
        created_at: new Date(Date.now() - index * 86400000).toISOString(),
        updated_at: new Date(Date.now() - index * 86400000).toISOString()
      }))
      setImages(demoImagesWithIds)
    } finally {
      setLoading(false)
    }
  }

  const uploadImage = async (file: File, metadata: {
    title: string
    description?: string
    tags: string[]
  }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please set up your environment variables to upload images.')
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Must be authenticated to upload')

      // Validate HD quality and landscape orientation
      const dimensions = await getImageDimensions(file)
      
      // Check landscape orientation
      if (dimensions.width <= dimensions.height) {
        throw new Error('Only landscape orientation wallpapers are allowed (width must be greater than height)')
      }

      // Check HD quality (minimum 1920x1080)
      if (dimensions.width < 1920 || dimensions.height < 1080) {
        throw new Error(`Image must be at least 1920×1080 pixels for HD quality. Your image is ${dimensions.width}×${dimensions.height}`)
      }

      // Check file size (max 15MB for HD)
      if (file.size > 15 * 1024 * 1024) {
        throw new Error('File size must be less than 15MB for HD quality uploads')
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)')
      }

      // Upload file to storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('wallpaper-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('wallpaper-images')
        .getPublicUrl(fileName)

      // Save to database
      const { data, error } = await supabase
        .from('images')
        .insert({
          title: metadata.title,
          description: metadata.description,
          image_url: publicUrl,
          tags: metadata.tags,
          uploaded_by: user.id,
          file_size: file.size,
          width: dimensions.width,
          height: dimensions.height,
        })
        .select()
        .single()

      if (error) throw error

      // Update user profile upload count
      await supabase.rpc('increment_user_uploads', { user_id: user.id })

      // Refresh images
      await fetchImages()
      
      return data
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload image')
    }
  }

  const deleteImage = async (id: string) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured.')
    }

    try {
      // Don't allow deletion of demo images
      if (id.startsWith('demo-')) {
        throw new Error('Cannot delete demo images')
      }

      const { error } = await supabase
        .from('images')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Refresh images
      await fetchImages()
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete image')
    }
  }

  const getUserImages = async (userId: string) => {
    if (!isSupabaseConfigured) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('uploaded_by', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Error fetching user images:', err)
      return []
    }
  }

  return {
    images,
    loading,
    error,
    fetchImages,
    searchImages,
    uploadImage,
    deleteImage,
    getUserImages,
    isConfigured: isSupabaseConfigured,
  }
}

// Helper function to get image dimensions with HD validation
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension analysis'))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}