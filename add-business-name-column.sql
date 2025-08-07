-- Add businessName column to profiles table
-- Run this in your Supabase SQL editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS businessName TEXT;

-- Update existing profiles to have empty businessName if null
UPDATE profiles 
SET businessName = '' 
WHERE businessName IS NULL; 