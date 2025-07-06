/*
  # User Downloads Tracking

  1. New Tables
    - `user_downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `image_id` (uuid, references images)
      - `downloaded_at` (timestamp)

  2. Functions
    - Function to track downloads
    - Function to get user downloads

  3. Security
    - Enable RLS on user_downloads table
    - Add policies for user data protection
*/

-- Create user_downloads table
CREATE TABLE IF NOT EXISTS user_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_id uuid REFERENCES images(id) ON DELETE CASCADE NOT NULL,
  downloaded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, image_id)
);

-- Enable RLS
ALTER TABLE user_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own downloads"
  ON user_downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own downloads"
  ON user_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_downloads_user_id ON user_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_user_downloads_image_id ON user_downloads(image_id);
CREATE INDEX IF NOT EXISTS idx_user_downloads_downloaded_at ON user_downloads(downloaded_at DESC);

-- Function to track download
CREATE OR REPLACE FUNCTION track_download(user_id uuid, image_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO user_downloads (user_id, image_id)
  VALUES (track_download.user_id, track_download.image_id)
  ON CONFLICT (user_id, image_id) DO NOTHING;
  
  -- Update user profile download count
  UPDATE user_profiles 
  SET total_downloads = total_downloads + 1,
      updated_at = now()
  WHERE user_profiles.user_id = track_download.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user downloads
CREATE OR REPLACE FUNCTION get_user_downloads(user_id uuid)
RETURNS TABLE(
  image_id uuid,
  title text,
  image_url text,
  downloaded_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.image_url,
    ud.downloaded_at
  FROM user_downloads ud
  JOIN images i ON i.id = ud.image_id
  WHERE ud.user_id = get_user_downloads.user_id
  ORDER BY ud.downloaded_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;