import React from 'react'
import { Heart, Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              WallpaperHub
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover and download stunning HD wallpapers for all your devices. 
              Transform your screen with beautiful imagery.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <div className="flex flex-wrap justify-center gap-2">
              {['Nature', 'Abstract', 'Space', 'Minimal'].map((category) => (
                <span
                  key={category}
                  className="text-xs text-gray-400 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Developer Info */}
          <div className="text-center md:text-right">
            <h4 className="text-white font-semibold mb-3">Developer</h4>
            <p className="text-gray-400 text-sm mb-2">
              Created by <span className="text-purple-400 font-medium">Ashish Muchahary</span>
            </p>
            <div className="flex items-center justify-center md:justify-end gap-2 text-xs text-gray-500">
              <Github size={12} />
              <span>Open Source Project</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* License */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>© 2025 Ashish Muchahary</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <ExternalLink size={12} />
                <span className="text-purple-400">MIT License</span>
              </div>
            </div>

            {/* Made with Love */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart size={14} className="text-red-400 animate-pulse" />
              <span>for wallpaper enthusiasts</span>
            </div>
          </div>

          {/* License Details */}
          <div className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="text-xs text-gray-500 leading-relaxed">
              <strong className="text-gray-400">MIT License:</strong> This project is open source and available under the MIT License. 
              You are free to use, modify, and distribute this software for any purpose, including commercial use, 
              as long as you include the original copyright notice and license terms.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}