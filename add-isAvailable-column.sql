-- Add isAvailable column to profiles table for driver status
-- Run this in your Supabase SQL Editor

-- Add the isAvailable column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "isAvailable" BOOLEAN DEFAULT false;

-- Update existing driver profiles to have isAvailable = false by default
UPDATE profiles SET "isAvailable" = false WHERE "isAvailable" IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'isAvailable';

-- Show sample data
SELECT id, email, role, "isAvailable" 
FROM profiles 
WHERE role = 'driver' 
LIMIT 5; 