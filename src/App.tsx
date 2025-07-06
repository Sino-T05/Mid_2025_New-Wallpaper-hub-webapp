import React, { useState } from 'react'
import { Header } from './components/Header'
import { SearchBar } from './components/SearchBar'
import { ImageGrid } from './components/ImageGrid'
import { Footer } from './components/Footer'
import { AuthModal } from './components/AuthModal'
import { UploadModal } from './components/UploadModal'
import { ImageModal } from './components/ImageModal'
import { useAuth } from './hooks/useAuth'
import { useImages } from './hooks/useImages'
import type { Database } from './lib/supabase'

type Image = Database['public']['Tables']['images']['Row']

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<Image | null>(null)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const { user, loading: authLoading } = useAuth()
  const { images, loading: imagesLoading, searchImages, fetchImages } = useImages()

  const handleImageClick = (image: Image) => {
    setSelectedImage(image)
    setImageModalOpen(true)
  }

  const handleSearch = (query: string) => {
    searchImages(query)
  }

  const handleUploadClick = () => {
    if (user) {
      setUploadModalOpen(true)
    } else {
      setAuthModalOpen(true)
    }
  }

  const handleAuthRequired = () => {
    setAuthModalOpen(true)
  }

  const handleRefresh = () => {
    // Refresh images and scroll to top
    fetchImages()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNextImage = () => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    const nextIndex = (currentIndex + 1) % images.length
    setSelectedImage(images[nextIndex])
  }

  const handlePreviousImage = () => {
    if (!selectedImage) return
    const currentIndex = images.findIndex(img => img.id === selectedImage.id)
    const previousIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    setSelectedImage(images[previousIndex])
  }

  // Create background content for modal
  const backgroundContent = (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              WallpaperHub
            </h1>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover stunning HD wallpapers for your desktop, mobile, and tablet. 
            Transform your screen with breathtaking imagery from around the world.
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <SearchBar onSearch={handleSearch} placeholder="Search wallpapers by category, color, or style..." />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-blue-400">{images.length}+</div>
              <div className="text-sm text-gray-300">Wallpapers</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-purple-400">4K</div>
              <div className="text-sm text-gray-300">Ultra HD</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-pink-400">Free</div>
              <div className="text-sm text-gray-300">Download</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-green-400">Daily</div>
              <div className="text-sm text-gray-300">Updates</div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Nature', 'Abstract', 'Space', 'Architecture', 'Minimal', 'Dark', 'Colorful'].map((category) => (
              <button
                key={category}
                onClick={() => handleSearch(category.toLowerCase())}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        {!imagesLoading && (
          <ImageGrid images={images} onImageClick={handleImageClick} />
        )}
      </div>
    </div>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading WallpaperHub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header 
        onUploadClick={handleUploadClick} 
        onAuthClick={() => setAuthModalOpen(true)}
        onRefresh={handleRefresh}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              WallpaperHub
            </h1>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover stunning HD wallpapers for your desktop, mobile, and tablet. 
            Transform your screen with breathtaking imagery from around the world.
          </p>
          
          {/* Search Bar */}
          <div className="flex justify-center mb-12">
            <SearchBar onSearch={handleSearch} placeholder="Search wallpapers by category, color, or style..." />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-blue-400">{images.length}+</div>
              <div className="text-sm text-gray-300">Wallpapers</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-purple-400">4K</div>
              <div className="text-sm text-gray-300">Ultra HD</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-pink-400">Free</div>
              <div className="text-sm text-gray-300">Download</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-green-400">Daily</div>
              <div className="text-sm text-gray-300">Updates</div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Nature', 'Abstract', 'Space', 'Architecture', 'Minimal', 'Dark', 'Colorful'].map((category) => (
              <button
                key={category}
                onClick={() => handleSearch(category.toLowerCase())}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-white transition-all duration-300 hover:scale-105"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {imagesLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-300 text-lg">Loading stunning wallpapers...</p>
          </div>
        )}

        {/* Image Grid */}
        {!imagesLoading && (
          <ImageGrid images={images} onImageClick={handleImageClick} />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      
      <UploadModal 
        isOpen={uploadModalOpen} 
        onClose={() => setUploadModalOpen(false)} 
      />
      
      <ImageModal
        image={selectedImage}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onNext={images.length > 1 ? handleNextImage : undefined}
        onPrevious={images.length > 1 ? handlePreviousImage : undefined}
        onAuthRequired={handleAuthRequired}
        backgroundContent={backgroundContent}
      />
    </div>
  )
}

export default App