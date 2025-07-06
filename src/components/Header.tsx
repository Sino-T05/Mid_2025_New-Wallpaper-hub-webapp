import React, { useState } from 'react'
import { Monitor, Plus, User, LogOut, Sparkles, Settings, RefreshCw } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { UserProfile } from './UserProfile'

interface HeaderProps {
  onUploadClick: () => void
  onAuthClick: () => void
  onRefresh?: () => void
}

export function Header({ onUploadClick, onAuthClick, onRefresh }: HeaderProps) {
  const { user, signOut } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleLogoClick = () => {
    if (onRefresh) {
      setRefreshing(true)
      onRefresh()
      setTimeout(() => setRefreshing(false), 1000)
    }
  }

  const handlePullToRefresh = () => {
    if (onRefresh) {
      setRefreshing(true)
      onRefresh()
      setTimeout(() => setRefreshing(false), 1000)
    }
  }

  return (
    <>
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <button
                  onClick={handleLogoClick}
                  className="flex items-center group transition-all duration-300 hover:scale-105"
                  title="Refresh (Windows) / Pull to refresh (Mobile)"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Monitor className="text-white" size={20} />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      WallpaperHub
                    </h1>
                    <p className="text-xs text-gray-400">HD Wallpapers Collection</p>
                  </div>
                </button>
                
                {/* Mobile Pull-to-Refresh Indicator */}
                <div className="ml-3 md:hidden">
                  <button
                    onClick={handlePullToRefresh}
                    className={`p-2 rounded-full bg-white/10 border border-white/20 text-gray-300 hover:text-white transition-all duration-300 ${
                      refreshing ? 'animate-spin' : 'hover:scale-110'
                    }`}
                    title="Pull to refresh"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={onUploadClick}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Plus size={16} />
                    <span className="hidden sm:inline">Upload</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProfileOpen(true)}
                      className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                      title="View Profile"
                    >
                      <User size={16} className="text-white" />
                    </button>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-400 hover:text-red-400 transition-colors hover:scale-110"
                      title="Sign out"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">Join Hub</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Refresh indicator for desktop */}
        {refreshing && (
          <div className="absolute top-full left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
        )}
      </header>

      {/* User Profile Modal */}
      <UserProfile 
        isOpen={profileOpen} 
        onClose={() => setProfileOpen(false)} 
      />
    </>
  )
}