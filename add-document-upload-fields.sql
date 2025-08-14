-- Add document upload fields to driver_applications table
-- Run this in your Supabase SQL Editor

-- Add document storage fields
ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS driver_license_url TEXT,
ADD COLUMN IF NOT EXISTS insurance_card_url TEXT,
ADD COLUMN IF NOT EXISTS vehicle_registration_url TEXT,
ADD COLUMN IF NOT EXISTS background_check_consent_url TEXT;

-- Add comments for clarity
COMMENT ON COLUMN driver_applications.driver_license_url IS 'URL to uploaded driver license photo';
COMMENT ON COLUMN driver_applications.insurance_card_url IS 'URL to uploaded insurance card photo';
COMMENT ON COLUMN driver_applications.vehicle_registration_url IS 'URL to uploaded vehicle registration photo';
COMMENT ON COLUMN driver_applications.background_check_consent_url IS 'URL to uploaded background check consent form';

-- Create indexes for document fields
CREATE INDEX IF NOT EXISTS idx_driver_applications_documents ON driver_applications(driver_license_url, insurance_card_url, vehicle_registration_url);

-- Update the updated_at trigger to include new columns
-- (The existing trigger will automatically handle these new columns) 