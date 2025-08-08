-- Fix all missing columns in profiles table
-- Run this in your Supabase SQL Editor

-- First, let's see what columns currently exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Function to add column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    table_name text,
    column_name text,
    column_type text,
    default_value text DEFAULT NULL
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = $1 
        AND column_name = $2
    ) THEN
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', $1, $2, $3);
        
        IF $4 IS NOT NULL THEN
            EXECUTE format('ALTER TABLE %I ALTER COLUMN %I SET DEFAULT %s', $1, $2, $4);
        END IF;
        
        RAISE NOTICE 'Added column % to table %', $2, $1;
    ELSE
        RAISE NOTICE 'Column % already exists in table %', $2, $1;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add all missing columns
SELECT add_column_if_not_exists('profiles', 'firstName', 'TEXT', '');
SELECT add_column_if_not_exists('profiles', 'lastName', 'TEXT', '');
SELECT add_column_if_not_exists('profiles', 'businessName', 'TEXT', '');
SELECT add_column_if_not_exists('profiles', 'createdAt', 'TIMESTAMP WITH TIME ZONE', 'NOW()');

-- Update any null values to defaults
UPDATE profiles 
SET "firstName" = COALESCE("firstName", '') 
WHERE "firstName" IS NULL;

UPDATE profiles 
SET "lastName" = COALESCE("lastName", '') 
WHERE "lastName" IS NULL;

UPDATE profiles 
SET "businessName" = COALESCE("businessName", '') 
WHERE "businessName" IS NULL;

UPDATE profiles 
SET "createdAt" = COALESCE("createdAt", NOW()) 
WHERE "createdAt" IS NULL;

-- Verify all columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('firstName', 'lastName', 'businessName', 'createdAt')
ORDER BY column_name;

-- Show a sample of the data
SELECT id, email, "firstName", "lastName", "businessName", "createdAt", role 
FROM profiles 
LIMIT 5;

-- Clean up the function
DROP FUNCTION IF EXISTS add_column_if_not_exists(text, text, text, text); 