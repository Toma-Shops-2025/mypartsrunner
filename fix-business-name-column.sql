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

-- Fix RLS policies for profiles table
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;

-- Create new RLS policies
-- Allow users to insert their own profile during registration
CREATE POLICY "Enable insert for authenticated users only" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to view their own profile
CREATE POLICY "Enable select for users based on user_id" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for users based on user_id" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow users to delete their own profile
CREATE POLICY "Enable delete for users based on user_id" ON profiles
    FOR DELETE USING (auth.uid() = id);

-- Verify columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Verify RLS policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles'; 