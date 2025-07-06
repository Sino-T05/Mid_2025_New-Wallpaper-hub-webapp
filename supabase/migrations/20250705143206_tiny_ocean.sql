/*
  # User Profiles and Enhanced Image Management

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `website` (text)
      - `total_uploads` (integer)
      - `total_downloads` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Storage
    - Create storage bucket for wallpaper images
    - Update RLS policies for enhanced security

  3. Functions
    - Function to increment user upload count
    - Function to increment download count

  4. Security
    - Enable RLS on all tables
    - Add comprehensive policies for user data protection
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username text UNIQUE,
  full_name text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  website text DEFAULT '',
  total_uploads integer DEFAULT 0,
  total_downloads integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update images table storage bucket name
INSERT INTO storage.buckets (id, name, public)
VALUES ('wallpaper-images', 'wallpaper-images', true)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies for wallpaper-images bucket
CREATE POLICY "Anyone can view wallpaper images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'wallpaper-images');

CREATE POLICY "Authenticated users can upload wallpaper images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'wallpaper-images');

CREATE POLICY "Users can update their own wallpaper images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'wallpaper-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own wallpaper images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'wallpaper-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to increment user uploads
CREATE OR REPLACE FUNCTION increment_user_uploads(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET total_uploads = total_uploads + 1,
      updated_at = now()
  WHERE user_profiles.user_id = increment_user_uploads.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment user downloads
CREATE OR REPLACE FUNCTION increment_user_downloads(user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET total_downloads = total_downloads + 1,
      updated_at = now()
  WHERE user_profiles.user_id = increment_user_downloads.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create updated_at trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_total_uploads ON user_profiles(total_uploads DESC);