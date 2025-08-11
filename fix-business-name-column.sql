-- Simple fix for missing columns in profiles table
-- Run this in your Supabase SQL Editor

-- Add missing columns directly
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "firstName" TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "lastName" TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "businessName" TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update any null values
UPDATE profiles SET "firstName" = '' WHERE "firstName" IS NULL;
UPDATE profiles SET "lastName" = '' WHERE "lastName" IS NULL;
UPDATE profiles SET "businessName" = '' WHERE "businessName" IS NULL;
UPDATE profiles SET "createdAt" = NOW() WHERE "createdAt" IS NULL;

-- Verify columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 