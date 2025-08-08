-- Fix businessName column issue
-- Run this in your Supabase SQL Editor

-- Check current table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if businessName column exists (case insensitive)
DO $$
BEGIN
    -- Check for businessName (exact case)
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'businessName'
    ) THEN
        RAISE NOTICE 'businessName column already exists (exact case)';
    -- Check for businessname (lowercase)
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'businessname'
    ) THEN
        RAISE NOTICE 'businessname column exists (lowercase) - renaming to businessName';
        ALTER TABLE profiles RENAME COLUMN businessname TO "businessName";
    -- Check for business_name (snake_case)
    ELSIF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'business_name'
    ) THEN
        RAISE NOTICE 'business_name column exists (snake_case) - renaming to businessName';
        ALTER TABLE profiles RENAME COLUMN business_name TO "businessName";
    ELSE
        RAISE NOTICE 'Adding businessName column to profiles table';
        ALTER TABLE profiles ADD COLUMN "businessName" TEXT;
    END IF;
END $$;

-- Update existing profiles to have empty businessName if null
UPDATE profiles 
SET "businessName" = COALESCE("businessName", '') 
WHERE "businessName" IS NULL;

-- Verify the column exists and has correct data
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'businessName';

-- Show sample data to verify
SELECT id, email, "businessName", role 
FROM profiles 
LIMIT 5; 