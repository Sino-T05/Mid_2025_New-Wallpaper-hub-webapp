/*
  # Storage Setup for Wallpaper Images

  1. Storage Bucket
    - Create `wallpaper-images` bucket for storing wallpaper files
    - Enable public access for viewing images

  2. Storage Policies
    - Public read access for all images
    - Authenticated users can upload to their own folders
    - Users can manage their own uploaded images

  3. Helper Functions
    - Function to increment user upload counts
*/

-- Create storage bucket for wallpaper images (ignore if exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('wallpaper-images', 'wallpaper-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'wallpaper-images');

-- Allow authenticated users to upload images to their own folder
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'wallpaper-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'wallpaper-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'wallpaper-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to increment user upload count
CREATE OR REPLACE FUNCTION increment_user_uploads(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_profiles 
  SET total_uploads = total_uploads + 1,
      updated_at = now()
  WHERE user_profiles.user_id = increment_user_uploads.user_id;
  
  -- Insert profile if it doesn't exist
  INSERT INTO user_profiles (user_id, total_uploads)
  VALUES (increment_user_uploads.user_id, 1)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;