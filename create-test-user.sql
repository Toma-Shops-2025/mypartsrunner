-- Create a test user for Stripe Connect testing
-- Run this in your Supabase SQL editor

INSERT INTO profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  created_at,
  updated_at
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'test-merchant@mypartsrunner.com',
  'Test',
  'Merchant',
  'merchant',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- Also create a merchant profile for this user
INSERT INTO merchant_profiles (
  user_id,
  business_name,
  business_type,
  country,
  created_at,
  updated_at
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  'Test Auto Parts Store',
  'individual',
  'US',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  business_name = EXCLUDED.business_name,
  business_type = EXCLUDED.business_type,
  country = EXCLUDED.country,
  updated_at = NOW();

-- Verify the user was created
SELECT 
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.role,
  mp.business_name,
  mp.business_type
FROM profiles p
LEFT JOIN merchant_profiles mp ON p.id = mp.user_id
WHERE p.id = '123e4567-e89b-12d3-a456-426614174000'; 