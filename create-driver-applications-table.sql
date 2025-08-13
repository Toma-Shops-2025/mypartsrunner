-- Create driver_applications table for storing driver applications
-- Run this in your Supabase SQL Editor

-- Create the driver_applications table
CREATE TABLE IF NOT EXISTS driver_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  
  -- Driver Information
  license_number TEXT NOT NULL,
  license_state TEXT NOT NULL,
  license_expiry DATE NOT NULL,
  has_commercial_license BOOLEAN DEFAULT false,
  
  -- Vehicle Information
  vehicle_type TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year TEXT NOT NULL,
  license_plate TEXT NOT NULL,
  vehicle_color TEXT NOT NULL,
  
  -- Insurance Information
  insurance_company TEXT NOT NULL,
  policy_number TEXT NOT NULL,
  policy_expiry DATE NOT NULL,
  has_commercial_insurance BOOLEAN DEFAULT false,
  
  -- Experience & Availability
  driving_experience TEXT NOT NULL,
  preferred_areas TEXT,
  availability TEXT[], -- Array of available days
  max_distance TEXT,
  
  -- Payment Information
  payment_method TEXT NOT NULL,
  cash_app_username TEXT,
  venmo_username TEXT,
  
  -- Background & References
  has_criminal_record BOOLEAN DEFAULT false,
  criminal_record_details TEXT,
  emergency_contact TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  
  -- Agreements
  agree_to_terms BOOLEAN NOT NULL,
  agree_to_background_check BOOLEAN NOT NULL,
  agree_to_drug_test BOOLEAN NOT NULL,
  agree_to_vehicle_inspection BOOLEAN NOT NULL,
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'on_hold')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_driver_applications_email ON driver_applications(email);
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON driver_applications(status);
CREATE INDEX IF NOT EXISTS idx_driver_applications_created_at ON driver_applications(created_at);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_driver_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_driver_applications_updated_at
  BEFORE UPDATE ON driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_applications_updated_at();

-- Enable Row Level Security
ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can create applications
CREATE POLICY "Anyone can create driver applications" ON driver_applications
  FOR INSERT WITH CHECK (true);

-- Only admins can view all applications
CREATE POLICY "Admins can view all applications" ON driver_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update applications
CREATE POLICY "Admins can update applications" ON driver_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Applicants can view their own application
CREATE POLICY "Applicants can view own application" ON driver_applications
  FOR SELECT USING (
    email = (SELECT email FROM profiles WHERE id = auth.uid())
  );

-- Add comments for documentation
COMMENT ON TABLE driver_applications IS 'Stores driver applications before approval';
COMMENT ON COLUMN driver_applications.status IS 'Application status: pending, under_review, approved, rejected, on_hold';
COMMENT ON COLUMN driver_applications.availability IS 'Array of available days (e.g., ["monday", "tuesday"])'; 