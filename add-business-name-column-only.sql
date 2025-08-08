-- Add businessName column to profiles table
-- Run this in your Supabase SQL Editor

-- Add the businessName column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS businessName TEXT;

-- Update existing profiles to have empty businessName if null
UPDATE profiles 
SET businessName = '' 
WHERE businessName IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'businessName'; 