import React, { useState } from 'react'
import { Eye, Heart, Download, Calendar, Monitor, Smartphone, Tablet } from 'lucide-react'
import { useLikes } from '../hooks/useLikes'
import { useAuth } from '../hooks/useAuth'
import type { Database } from '../lib/supabase'

type Image = Database['public']['Tables']['images']['Row']

interface ImageGridProps {
  images: Image[]
  onImageClick: (image: Image) => void
}

interface LikeButtonProps {
  imageId: string
  onAuthRequired?: () => void
}

function LikeButton({ imageId, onAuthRequired }: LikeButtonProps) {
  const { likeCount, isLiked, loading, toggleLike, canLike } = useLikes(imageId)
  const { user } = useAuth()

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!user) {
      onAuthRequired?.()
      return
    }

    await toggleLike()
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-3 py-2 rounded-full transition-all duration-300 hover:scale-110 border border-white/20 text-sm font-medium ${
        isLiked ? 'bg-red-500/30 border-red-400/50' : ''
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart 
        size={14} 
        className={`transition-colors ${isLiked ? 'fill-red-400 text-red-400' : ''}`} 
      />
      <span>{likeCount}</span>
    </button>
  )
}

export function ImageGrid({ images, onImageClick }: ImageGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDeviceIcon = (width: number | null, height: number | null) => {
    if (!width || !height) return <Monitor size={12} />
    const aspectRatio = width / height
    if (aspectRatio > 1.5) return <Monitor size={12} />
    if (aspectRatio < 0.8) return <Smartphone size={12} />
    return <Tablet size={12} />
  }

  const handleDownload = async (e: React.MouseEvent, image: Image) => {
    e.stopPropagation()
    try {
      const response = await fetch(image.image_url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${image.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_wallpaper.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 border border-white/20">
          <Monitor className="text-purple-400" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No wallpapers found</h3>
        <p className="text-gray-400 text-lg">Upload some stunning wallpapers to get started or try a different search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image) => (
        <div
          key={image.id}
          className="group relative bg-black/20 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-white/10 hover:border-white/20 hover:scale-105"
          onClick={() => onImageClick(image)}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {!loadedImages.has(image.id) && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 bg-white/20 rounded-full animate-bounce" />
              </div>
            )}
            <img
              src={image.image_url}
              alt={image.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                loadedImages.has(image.id) ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(image.id)}
            />
            
            {/* Enhanced Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onImageClick(image)
                      }}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2.5 rounded-full transition-all duration-300 hover:scale-110 border border-white/20"
                    >
                      <Eye size={16} />
                    </button>
                    <LikeButton imageId={image.id} />
                  </div>
                  <button
                    onClick={(e) => handleDownload(e, image)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-full transition-all duration-300 hover:scale-110 shadow-lg flex items-center gap-2 text-sm font-medium"
                  >
                    <Download size={14} />
                    Download
                  </button>
                </div>
              </div>
            </div>

            {/* Resolution Badge */}
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-medium border border-white/20">
              {image.width && image.height ? `${image.width}×${image.height}` : 'HD'}
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-bold text-white mb-2 line-clamp-1 text-lg">
              {image.title}
            </h3>
            {image.description && (
              <p className="text-sm text-gray-300 mb-3 line-clamp-2 leading-relaxed">
                {image.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {formatDate(image.created_at)}
              </div>
              <div className="flex items-center gap-2">
                {image.width && image.height && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    {getDeviceIcon(image.width, image.height)}
                    <span className="text-xs">
                      {image.width > image.height ? 'Desktop' : 'Mobile'}
                    </span>
                  </div>
                )}
                {image.tags && image.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                    <span className="text-xs text-gray-400">
                      {image.tags.length} tag{image.tags.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}