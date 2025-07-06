import React, { useState, useEffect } from 'react'
import { User, Camera, Download, Calendar, Edit3, Save, X, Heart, Upload, Eye, Monitor } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useImages } from '../hooks/useImages'
import type { Database } from '../lib/supabase'

type Image = Database['public']['Tables']['images']['Row']

interface UserProfileProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, profile, updateProfile } = useAuth()
  const { getUserImages } = useImages()
  const [userImages, setUserImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'uploads' | 'downloads' | 'liked'>('uploads')
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: ''
  })

  useEffect(() => {
    if (isOpen && user && profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || ''
      })
      loadUserImages()
    }
  }, [isOpen, user, profile])

  const loadUserImages = async () => {
    if (!user) return
    setLoading(true)
    try {
      const images = await getUserImages(user.id)
      setUserImages(images)
    } catch (error) {
      console.error('Error loading user images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleImageClick = (image: Image) => {
    setSelectedImage(image)
    setImageModalOpen(true)
  }

  const handleCloseImageModal = () => {
    setImageModalOpen(false)
    setSelectedImage(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!isOpen || !user) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-white/20 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            {/* Profile Info */}
            <div className="flex items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <User size={32} className="text-white" />
              </div>
              
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Username"
                    />
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Full Name"
                    />
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Bio"
                      rows={3}
                    />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 backdrop-blur-sm"
                      placeholder="Website"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save size={16} />
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {profile?.full_name || profile?.username || 'Anonymous User'}
                      </h3>
                      <button
                        onClick={() => setEditing(true)}
                        className="text-gray-400 hover:text-white transition-colors hover:scale-110"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                    {profile?.username && (
                      <p className="text-purple-400 mb-2">@{profile.username}</p>
                    )}
                    {profile?.bio && (
                      <p className="text-gray-300 mb-3">{profile.bio}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Calendar size={14} />
                      Joined {formatDate(profile?.created_at || user.created_at)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-blue-400">{profile?.total_uploads || 0}</div>
                <div className="text-sm text-gray-400">Uploads</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-purple-400">{profile?.total_downloads || 0}</div>
                <div className="text-sm text-gray-400">Downloads</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-green-400">{userImages.length}</div>
                <div className="text-sm text-gray-400">Gallery</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-pink-400">HD</div>
                <div className="text-sm text-gray-400">Quality</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('uploads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === 'uploads'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Upload size={16} />
                My Uploads
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === 'downloads'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Download size={16} />
                Downloaded
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                  activeTab === 'liked'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Heart size={16} />
                Liked
              </button>
            </div>

            {/* Content based on active tab */}
            <div>
              {activeTab === 'uploads' && (
                <div>
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Camera size={20} />
                    My Wallpapers ({userImages.length})
                  </h4>
                  
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
                      <p className="text-gray-400">Loading your wallpapers...</p>
                    </div>
                  ) : userImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {userImages.map((image) => (
                        <div
                          key={image.id}
                          className="relative aspect-[4/3] bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer hover:scale-105"
                          onClick={() => handleImageClick(image)}
                        >
                          <img
                            src={image.image_url}
                            alt={image.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-white font-medium text-sm mb-1">{image.title}</p>
                              <div className="flex items-center justify-center gap-2 text-xs text-gray-300">
                                <Eye size={12} />
                                <span>{image.width}×{image.height}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                      <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">No wallpapers yet</h3>
                      <p className="text-gray-400">Upload your first wallpaper to get started!</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'downloads' && (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                  <Download className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Downloaded Images</h3>
                  <p className="text-gray-400">Your downloaded wallpapers will appear here soon!</p>
                  <p className="text-xs text-gray-500 mt-2">Feature coming in next update</p>
                </div>
              )}

              {activeTab === 'liked' && (
                <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">Liked Wallpapers</h3>
                  <p className="text-gray-400">Your liked wallpapers will appear here soon!</p>
                  <p className="text-xs text-gray-500 mt-2">Feature coming in next update</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal for user uploads */}
      {imageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-[60]">
          <div className="max-w-7xl max-h-[95vh] w-full mx-4 flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="flex-1 flex items-center justify-center relative">
              <div className="relative max-w-full max-h-full">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:w-80 bg-white/10 backdrop-blur-md rounded-lg lg:ml-4 mt-4 lg:mt-0 max-h-[80vh] overflow-y-auto border border-white/20 shadow-2xl">
              <div className="p-4 border-b border-white/20 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white truncate">{selectedImage.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30">
                    <Heart size={16} />
                    <span className="text-sm">Your Upload</span>
                  </div>
                  <button
                    onClick={handleCloseImageModal}
                    className="p-2 text-gray-300 hover:text-red-400 transition-colors hover:scale-110"
                    title="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {selectedImage.description && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Description</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedImage.description}</p>
                  </div>
                )}

                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedImage.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3 border-t border-white/20 pt-4">
                  <h3 className="font-semibold text-white">Details</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar size={16} />
                    <span>Uploaded {formatDate(selectedImage.created_at)}</span>
                  </div>

                  {selectedImage.width && selectedImage.height && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Monitor size={16} />
                      <span>{selectedImage.width} × {selectedImage.height} pixels</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}