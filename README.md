# 🎨 WallpaperHub - HD Wallpaper Collection

<div align="center">

![WallpaperHub Logo](https://via.placeholder.com/200x100/6366f1/ffffff?text=WallpaperHub)

**A modern wallpaper gallery application built with React, TypeScript, and Supabase**

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green.svg)](https://supabase.com/)

</div>

---

## 📖 Description

WallpaperHub is a wallpaper gallery app where users can discover, upload, and download high-quality wallpapers. Built with modern web technologies, it features a sleek design, authentication, and secure file uploads.

---

## ✨ Features

### 🖼️ Wallpaper Management
- HD quality enforcement
- Upload validation
- Real-time likes
- Download tracking
- Search and filter system

### 👤 User Experience
- Authentication (email/password)
- Personal profiles
- Responsive design
- Pull-to-refresh (mobile)

### 🎨 UI/UX
- Glassmorphism design
- Smooth animations
- Dark theme
- Skeleton loading states

### 🔐 Security & Performance
- Row Level Security (Supabase)
- Lazy loading
- Image validation
- Secure environment config

---

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (icons)

### Backend
- Supabase (PostgreSQL, Auth, Storage, RLS)
- Supabase Edge Functions

### Dev Tools
- ESLint + TypeScript rules
- PostCSS + Autoprefixer

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Installation

```bash
git clone https://github.com/yourusername/wallpaper-hub.git
cd wallpaper-hub
npm install
cp .env.example .env
```

#### ⚠️ Add your Supabase credentials in `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> 🔒 **Never share your real `.env` file or credentials publicly.**

---

## 📁 Project Structure

```
src/
  components/
  hooks/
  lib/
  data/
supabase/
public/
...
```

---

## 🔧 Supabase Setup

Create tables in SQL editor:

```sql
-- Example table
CREATE TABLE images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  ...
);
```

Also set up:
- Supabase storage bucket (e.g., wallpaper-images)
- Auth config (email/password)
- RLS policies

---

## 🧪 Development Scripts

```bash
npm run dev     # Dev server
npm run build   # Production build
npm run preview # Local preview
npm run lint    # Lint check
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Make your changes  
4. Open a pull request  

> Please follow existing code style and add documentation for new features.

---

## 📄 License

This project is licensed under the MIT License — free to use, modify, and distribute.

---

<div align="center">

**Made with ❤️ for learning and building cool stuff**

</div>
