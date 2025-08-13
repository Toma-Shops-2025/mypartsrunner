-- Create a merchant profile for the test user
-- Run this in your Supabase SQL editor

INSERT INTO merchant_profiles (
  id,
  stripe_account_id,
  stripe_charges_enabled,
  stripe_payouts_enabled,
  stripe_details_submitted,
  createdat,
  updatedat
) VALUES (
  '123e4567-e89b-12d3-a456-426614174000',
  NULL,
  false,
  false,
  false,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  stripe_account_id = EXCLUDED.stripe_account_id,
  stripe_charges_enabled = EXCLUDED.stripe_charges_enabled,
  stripe_payouts_enabled = EXCLUDED.stripe_payouts_enabled,
  stripe_details_submitted = EXCLUDED.stripe_details_submitted,
  updatedat = NOW();

-- Verify the merchant profile was created
SELECT 
  id,
  stripe_account_id,
  stripe_charges_enabled,
  stripe_payouts_enabled,
  stripe_details_submitted
FROM merchant_profiles 
WHERE id = '123e4567-e89b-12d3-a456-426614174000'; 