/*
  # Add Likes System

  1. New Tables
    - `image_likes`
      - `id` (uuid, primary key)
      - `image_id` (uuid, references images)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)

  2. Functions
    - Function to get like count for an image
    - Function to check if user liked an image

  3. Security
    - Enable RLS on `image_likes` table
    - Add policies for authenticated users to like/unlike
    - Add policy for public to view like counts

  4. Indexes
    - Composite index on (image_id, user_id) for performance
    - Index on image_id for like counting
*/

-- Create image_likes table
CREATE TABLE IF NOT EXISTS image_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id uuid REFERENCES images(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(image_id, user_id)
);

-- Enable RLS
ALTER TABLE image_likes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view likes"
  ON image_likes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can like images"
  ON image_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own likes"
  ON image_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_image_likes_image_id ON image_likes(image_id);
CREATE INDEX IF NOT EXISTS idx_image_likes_user_id ON image_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_image_likes_composite ON image_likes(image_id, user_id);

-- Function to get like count for an image
CREATE OR REPLACE FUNCTION get_image_like_count(image_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::integer
    FROM image_likes
    WHERE image_likes.image_id = get_image_like_count.image_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user liked an image
CREATE OR REPLACE FUNCTION user_liked_image(image_id uuid, user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM image_likes
    WHERE image_likes.image_id = user_liked_image.image_id
    AND image_likes.user_id = user_liked_image.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;