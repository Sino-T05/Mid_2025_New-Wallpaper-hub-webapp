import React, { useState, useRef } from 'react'
import { X, Upload, Image as ImageIcon, Plus, Tag, AlertCircle, CheckCircle, Monitor, Smartphone } from 'lucide-react'
import { useImages } from '../hooks/useImages'
import { useAuth } from '../hooks/useAuth'

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ImageDimensions {
  width: number
  height: number
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadImage, isConfigured } = useImages()
  const { user } = useAuth()

  if (!isOpen) return null

  // HD Quality Requirements
  const HD_REQUIREMENTS = {
    MIN_WIDTH: 1920,
    MIN_HEIGHT: 1080,
    MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB for HD images
    SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }

  const getImageDimensions = (file: File): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
        URL.revokeObjectURL(img.src)
      }
      img.onerror = () => {
        reject(new Error('Failed to load image'))
        URL.revokeObjectURL(img.src)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const validateImageFile = async (file: File): Promise<{ valid: boolean; error?: string; dimensions?: ImageDimensions }> => {
    // Check file type
    if (!HD_REQUIREMENTS.SUPPORTED_FORMATS.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Please upload a valid image file (JPEG, PNG, or WebP)' 
      }
    }

    // Check file size
    if (file.size > HD_REQUIREMENTS.MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `File size must be less than ${HD_REQUIREMENTS.MAX_FILE_SIZE / (1024 * 1024)}MB for HD quality` 
      }
    }

    try {
      const dimensions = await getImageDimensions(file)
      
      // Check if image is landscape (width > height)
      if (dimensions.width <= dimensions.height) {
        return { 
          valid: false, 
          error: 'Only landscape orientation wallpapers are allowed (width must be greater than height)' 
        }
      }

      // Check HD quality requirements
      if (dimensions.width < HD_REQUIREMENTS.MIN_WIDTH || dimensions.height < HD_REQUIREMENTS.MIN_HEIGHT) {
        return { 
          valid: false, 
          error: `Image must be at least ${HD_REQUIREMENTS.MIN_WIDTH}×${HD_REQUIREMENTS.MIN_HEIGHT} pixels for HD quality. Your image is ${dimensions.width}×${dimensions.height}` 
        }
      }

      return { valid: true, dimensions }
    } catch (err) {
      return { 
        valid: false, 
        error: 'Failed to process image. Please try a different file.' 
      }
    }
  }

  const getQualityLabel = (dimensions: ImageDimensions) => {
    if (dimensions.width >= 3840 && dimensions.height >= 2160) return '4K Ultra HD'
    if (dimensions.width >= 2560 && dimensions.height >= 1440) return '2K QHD'
    if (dimensions.width >= 1920 && dimensions.height >= 1080) return 'Full HD'
    return 'HD'
  }

  const handleFileSelect = async (file: File) => {
    setError(null)
    setImageDimensions(null)
    
    const validation = await validateImageFile(file)
    
    if (!validation.valid) {
      setError(validation.error!)
      return
    }

    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setImageDimensions(validation.dimensions!)
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const addTag = () => {
    const trimmedTag = newTag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag])
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const validateForm = () => {
    if (!selectedFile) return 'Please select an HD landscape image file'
    if (!title.trim()) return 'Title is required'
    if (title.length > 100) return 'Title must be less than 100 characters'
    if (description.length > 500) return 'Description must be less than 500 characters'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    if (!user) {
      setError('You must be signed in to upload images')
      return
    }

    if (!isConfigured) {
      setError('Backend is not configured. Please set up Supabase to enable uploads.')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      await uploadImage(selectedFile!, {
        title: title.trim(),
        description: description.trim() || undefined,
        tags,
      })
      
      setSuccess('HD wallpaper uploaded successfully!')
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTags([])
    setNewTag('')
    setSelectedFile(null)
    setPreview(null)
    setImageDimensions(null)
    setDragActive(false)
    setError(null)
    setSuccess(null)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Upload HD Wallpaper</h2>
            <p className="text-sm text-gray-300 mt-1">Only landscape HD quality images (1920×1080 or higher)</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {!isConfigured && (
          <div className="mx-6 mt-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-300">
              <AlertCircle size={16} />
              <span className="text-sm font-medium">Demo Mode</span>
            </div>
            <p className="text-xs text-yellow-200 mt-1">
              Backend not configured. Set up Supabase to enable HD image uploads.
            </p>
          </div>
        )}

        {/* HD Requirements Info */}
        <div className="mx-6 mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Monitor size={16} />
            <span className="text-sm font-medium">HD Quality Requirements</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-blue-200">
            <div>• Minimum: 1920×1080 pixels (Full HD)</div>
            <div>• Orientation: Landscape only</div>
            <div>• Formats: JPEG, PNG, WebP</div>
            <div>• Max size: 15MB</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              dragActive
                ? 'border-purple-400 bg-purple-500/10'
                : 'border-white/30 hover:border-white/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    setPreview(null)
                    setImageDimensions(null)
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-lg"
                >
                  <X size={16} />
                </button>
                
                {/* Image Quality Info */}
                {imageDimensions && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div className="flex items-center justify-center gap-4 text-green-300">
                      <div className="flex items-center gap-2">
                        <Monitor size={16} />
                        <span className="font-medium">{getQualityLabel(imageDimensions)}</span>
                      </div>
                      <div className="text-sm">
                        {imageDimensions.width}×{imageDimensions.height}
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        Landscape
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-white" />
                  </div>
                </div>
                <p className="text-lg font-medium text-white mb-2">
                  Drop your HD wallpaper here, or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  HD Quality • Landscape Only • JPEG, PNG, WebP • Max 15MB
                </p>
                
                {/* Quality Examples */}
                <div className="flex justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Monitor size={12} />
                    <span>1920×1080 (Full HD)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Monitor size={12} />
                    <span>2560×1440 (2K)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Monitor size={12} />
                    <span>3840×2160 (4K)</span>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
              placeholder="Enter wallpaper title"
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
              rows={3}
              placeholder="Describe your HD wallpaper (optional)"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (max 10)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                >
                  <Tag size={14} className="mr-1" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-400 hover:text-purple-200 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Add a tag (e.g., nature, abstract, 4k)"
                disabled={tags.length >= 10}
              />
              <button
                type="button"
                onClick={addTag}
                disabled={tags.length >= 10 || !newTag.trim()}
                className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <div className="flex items-start gap-3 text-red-300">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Upload Requirements Not Met</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle size={16} />
                <p className="text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || !title.trim() || uploading || !isConfigured || !imageDimensions}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 shadow-lg"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Uploading HD Wallpaper...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload HD Wallpaper
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}