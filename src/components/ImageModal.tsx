import React, { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Download, Calendar, User, Tag, ImageIcon, Heart } from 'lucide-react'
import { useLikes } from '../hooks/useLikes'
import { useAuth } from '../hooks/useAuth'
import type { Database } from '../lib/supabase'

type Image = Database['public']['Tables']['images']['Row']

interface ImageModalProps {
  image: Image | null
  isOpen: boolean
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  onAuthRequired?: () => void
  backgroundContent?: React.ReactNode
}

export function ImageModal({ 
  image, 
  isOpen, 
  onClose, 
  onPrevious, 
  onNext, 
  onAuthRequired,
  backgroundContent 
}: ImageModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()

  if (!isOpen || !image) return null

  const handleDownload = async () => {
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

      // Track download if user is authenticated
      if (user && !image.id.startsWith('demo-')) {
        // You can add download tracking here if needed
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Blurred Background */}
      <div className="absolute inset-0 backdrop-blur-md bg-slate-900/80">
        {backgroundContent && (
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            {backgroundContent}
          </div>
        )}
      </div>

      {/* Modal Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4">
        <div className="max-w-7xl max-h-[95vh] w-full flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Navigation Buttons */}
            {onPrevious && (
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/20 z-10 hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
            )}
            {onNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-white/20 z-10 hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Image */}
            <div className="relative max-w-full max-h-full">
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                </div>
              )}
              <img
                src={image.image_url}
                alt={image.title}
                className={`max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:w-80 bg-white/10 backdrop-blur-md rounded-lg lg:ml-4 mt-4 lg:mt-0 max-h-[80vh] overflow-y-auto border border-white/20 shadow-2xl">
            {/* Header */}
            <div className="p-4 border-b border-white/20 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white truncate">{image.title}</h2>
              <div className="flex items-center gap-2">
                <LikeButtonModal imageId={image.id} onAuthRequired={onAuthRequired} />
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-300 hover:text-blue-400 transition-colors hover:scale-110"
                  title="Download HD Wallpaper"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors hover:scale-110"
                  title="Close"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Description */}
              {image.description && (
                <div>
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 leading-relaxed">{image.description}</p>
                </div>
              )}

              {/* Tags */}
              {image.tags && image.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-white mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {image.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="space-y-3 border-t border-white/20 pt-4">
                <h3 className="font-semibold text-white">Details</h3>
                
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Calendar size={16} />
                  <span>Uploaded {formatDate(image.created_at)}</span>
                </div>

                {image.width && image.height && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <ImageIcon size={16} />
                    <span>{image.width} × {image.height} pixels</span>
                  </div>
                )}

                {image.file_size && (
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="w-4 h-4 bg-gray-400 rounded-sm" />
                    <span>{formatFileSize(image.file_size)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LikeButtonModal({ imageId, onAuthRequired }: { imageId: string; onAuthRequired?: () => void }) {
  const { likeCount, isLiked, loading, toggleLike, canLike } = useLikes(imageId)
  const { user } = useAuth()

  const handleLike = async () => {
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
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium hover:scale-105 ${
        isLiked 
          ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30' 
          : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isLiked ? 'Unlike' : 'Like'}
    >
      <Heart 
        size={16} 
        className={`transition-all duration-300 ${isLiked ? 'fill-red-400 text-red-400 scale-110' : ''}`} 
      />
      <span>{likeCount}</span>
    </button>
  )
}