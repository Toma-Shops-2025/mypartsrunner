-- Fix businessName and createdAt columns issue
-- Run this in your Supabase SQL Editor

-- First, let's see what columns currently exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Check if businessName column exists in any form
DO $$
DECLARE
    column_exists boolean;
BEGIN
    -- Check if businessName column exists (exact case)
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'businessName'
    ) INTO column_exists;
    
    IF column_exists THEN
        RAISE NOTICE 'businessName column already exists';
    ELSE
        -- Check for lowercase version
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = 'businessname'
        ) INTO column_exists;
        
        IF column_exists THEN
            RAISE NOTICE 'Renaming businessname to businessName';
            ALTER TABLE profiles RENAME COLUMN businessname TO "businessName";
        ELSE
            -- Check for snake_case version
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'profiles' 
                AND column_name = 'business_name'
            ) INTO column_exists;
            
            IF column_exists THEN
                RAISE NOTICE 'Renaming business_name to businessName';
                ALTER TABLE profiles RENAME COLUMN business_name TO "businessName";
            ELSE
                RAISE NOTICE 'Adding businessName column';
                ALTER TABLE profiles ADD COLUMN "businessName" TEXT DEFAULT '';
            END IF;
        END IF;
    END IF;
END $$;

-- Check if createdAt column exists
DO $$
DECLARE
    column_exists boolean;
BEGIN
    -- Check if createdAt column exists (exact case)
    SELECT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'createdAt'
    ) INTO column_exists;
    
    IF column_exists THEN
        RAISE NOTICE 'createdAt column already exists';
    ELSE
        -- Check for lowercase version
        SELECT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'profiles' 
            AND column_name = 'createdat'
        ) INTO column_exists;
        
        IF column_exists THEN
            RAISE NOTICE 'Renaming createdat to createdAt';
            ALTER TABLE profiles RENAME COLUMN createdat TO "createdAt";
        ELSE
            -- Check for snake_case version
            SELECT EXISTS (
                SELECT 1 
                FROM information_schema.columns 
                WHERE table_name = 'profiles' 
                AND column_name = 'created_at'
            ) INTO column_exists;
            
            IF column_exists THEN
                RAISE NOTICE 'Renaming created_at to createdAt';
                ALTER TABLE profiles RENAME COLUMN created_at TO "createdAt";
            ELSE
                RAISE NOTICE 'Adding createdAt column';
                ALTER TABLE profiles ADD COLUMN "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();
            END IF;
        END IF;
    END IF;
END $$;

-- Update any null businessName values to empty string
UPDATE profiles 
SET "businessName" = COALESCE("businessName", '') 
WHERE "businessName" IS NULL;

-- Update any null createdAt values to current timestamp
UPDATE profiles 
SET "createdAt" = COALESCE("createdAt", NOW()) 
WHERE "createdAt" IS NULL;

-- Verify the final result
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('businessName', 'createdAt')
ORDER BY column_name;

-- Show a sample of the data
SELECT id, email, "businessName", "createdAt", role 
FROM profiles 
LIMIT 5; 