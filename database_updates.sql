-- MyPartsRunner Database Updates
-- Add fields to driver_applications table for auto-approval functionality

-- Add status field to track application status
ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected', 'under_review'));

-- Add is_active field to control driver's online availability
ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Add created_at and updated_at timestamps if they don't exist
ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE driver_applications 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create an index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON driver_applications(status);

-- Create an index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_driver_applications_is_active ON driver_applications(is_active);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_driver_applications_email ON driver_applications(email);

-- Update existing records to have default values
UPDATE driver_applications 
SET status = 'pending' 
WHERE status IS NULL;

UPDATE driver_applications 
SET is_active = false 
WHERE is_active IS NULL;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update updated_at on row updates
DROP TRIGGER IF EXISTS update_driver_applications_updated_at ON driver_applications;
CREATE TRIGGER update_driver_applications_updated_at
    BEFORE UPDATE ON driver_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments to document the fields
COMMENT ON COLUMN driver_applications.status IS 'Application status: pending, approved, rejected, under_review';
COMMENT ON COLUMN driver_applications.is_active IS 'Whether the driver is active and can accept deliveries';
COMMENT ON COLUMN driver_applications.created_at IS 'When the application was created';
COMMENT ON COLUMN driver_applications.updated_at IS 'When the application was last updated';

-- Optional: Create a view for active drivers
CREATE OR REPLACE VIEW active_drivers AS
SELECT 
    id,
    first_name,
    last_name,
    email,
    phone,
    status,
    is_active,
    created_at,
    updated_at
FROM driver_applications 
WHERE status = 'approved' AND is_active = true;

-- Grant necessary permissions (adjust as needed for your RLS policies)
-- These might need to be adjusted based on your current RLS setup
-- ALTER TABLE driver_applications ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for drivers to see their own applications
-- CREATE POLICY "Drivers can view own applications" ON driver_applications
--     FOR SELECT USING (auth.email() = email);

-- Example RLS policy for drivers to insert their own applications
-- CREATE POLICY "Drivers can insert own applications" ON driver_applications
--     FOR INSERT WITH CHECK (auth.email() = email);

-- Example RLS policy for drivers to update their own applications
-- CREATE POLICY "Drivers can update own applications" ON driver_applications
--     FOR UPDATE USING (auth.email() = email);
