-- Comprehensive fix for profiles table and RLS policies
-- Run this in your Supabase SQL Editor

-- First, let's see what tables actually exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if there's a users table and what it contains
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('users', 'profiles', 'auth.users')
ORDER BY table_name, ordinal_position;

-- Check foreign key constraints on profiles table
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='profiles';

-- Check if profiles table references auth.users using pg_constraint
SELECT 
    conname as constraint_name,
    contype,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass;

-- Now let's see the current profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Clean up duplicate columns - standardize to camelCase
-- First, update data from lowercase columns to camelCase columns
UPDATE profiles 
SET "firstName" = COALESCE("firstName", firstname, '')
WHERE "firstName" IS NULL OR "firstName" = '';

UPDATE profiles 
SET "lastName" = COALESCE("lastName", lastname, '')
WHERE "lastName" IS NULL OR "lastName" = '';

-- Now drop the lowercase columns
ALTER TABLE profiles DROP COLUMN IF EXISTS firstname;
ALTER TABLE profiles DROP COLUMN IF EXISTS lastname;

-- Ensure all required columns exist with proper names
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "firstName" TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "lastName" TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "businessName" TEXT DEFAULT '';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update any null values
UPDATE profiles SET "firstName" = '' WHERE "firstName" IS NULL;
UPDATE profiles SET "lastName" = '' WHERE "lastName" IS NULL;
UPDATE profiles SET "businessName" = '' WHERE "businessName" IS NULL;
UPDATE profiles SET "createdAt" = NOW() WHERE "createdAt" IS NULL;

-- Check if we need to drop and recreate the foreign key constraint
-- First, let's see what the current constraint looks like
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
    AND contype = 'f';

-- Drop the problematic foreign key constraint if it exists
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT conname INTO constraint_name
    FROM pg_constraint 
    WHERE conrelid = 'profiles'::regclass 
        AND contype = 'f'
        AND pg_get_constraintdef(oid) LIKE '%users%';
    
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE profiles DROP CONSTRAINT ' || constraint_name;
        RAISE NOTICE 'Dropped foreign key constraint: %', constraint_name;
    ELSE
        RAISE NOTICE 'No foreign key constraint to users table found';
    END IF;
END $$;

-- Create a function to handle profile creation during signup
CREATE OR REPLACE FUNCTION create_user_profile(
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    user_first_name TEXT,
    user_last_name TEXT,
    user_business_name TEXT,
    user_role TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO profiles (
        id, 
        email, 
        name, 
        "firstName", 
        "lastName", 
        "businessName", 
        role, 
        "createdAt"
    ) VALUES (
        user_id,
        user_email,
        user_name,
        COALESCE(user_first_name, ''),
        COALESCE(user_last_name, ''),
        COALESCE(user_business_name, ''),
        user_role,
        NOW()
    ) ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        "businessName" = EXCLUDED."businessName",
        role = EXCLUDED.role,
        "createdAt" = EXCLUDED."createdAt";
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_user_profile(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Completely reset RLS policies for profiles table
-- First, disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable select for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies
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

-- Allow public read access to basic profile info (for search/discovery)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (true);

-- CRITICAL FIX: Create a more permissive insert policy for registration
-- This allows new users to create profiles during signup
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
CREATE POLICY "Allow profile creation during signup" ON profiles
    FOR INSERT WITH CHECK (true);

-- Also create a policy that allows authenticated users to insert their own profile
CREATE POLICY "Allow authenticated users to insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Verify the final setup
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Verify RLS policies exist using pg_policies
SELECT 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Test the function (this should work now)
SELECT create_user_profile(
    gen_random_uuid(),
    'test@example.com',
    'Test User',
    'Test',
    'User',
    'Test Business',
    'customer'
);

-- Clean up test data
DELETE FROM profiles WHERE email = 'test@example.com';

-- Show final table structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position; 