-- Debug Script: Find the Exact Constraint Issue
-- Run this to see what's happening with your orders table

-- Step 1: Check all constraints on the orders table
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'orders'::regclass;

-- Step 2: Check the exact column names and their constraints
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Step 3: Check if there are any triggers that might be causing issues
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'orders';

-- Step 4: Try to see what the actual constraint error is about
-- Let's look at the specific row that's failing
SELECT 
    id,
    status,
    "payout_status",
    "completed_at",
    "updated_at"
FROM orders 
ORDER BY "createdAt" DESC 
LIMIT 1;

-- Step 5: Check if there are any custom constraints we missed
SELECT 
    schemaname,
    tablename,
    constraintname,
    constrainttype,
    definition
FROM pg_constraints 
WHERE tablename = 'orders'; 