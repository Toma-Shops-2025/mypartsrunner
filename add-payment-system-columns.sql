-- Add Payment System Columns to Existing Orders Table
-- This migration adds the payment system columns to the existing orders table
-- Run this in your Supabase SQL Editor

-- Add payment system columns to the existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS item_total DECIMAL(10,2) CHECK (item_total >= 0),
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10,2) DEFAULT 0 CHECK (service_fee >= 0),
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing orders to have default values for new columns
UPDATE orders 
SET 
    item_total = COALESCE(subtotal, 0),
    delivery_fee = COALESCE("deliveryFee", 0),
    service_fee = COALESCE(tax, 0)
WHERE item_total IS NULL OR delivery_fee IS NULL OR service_fee IS NULL;

-- Make the new columns NOT NULL after setting default values
ALTER TABLE orders 
ALTER COLUMN item_total SET NOT NULL,
ALTER COLUMN delivery_fee SET NOT NULL,
ALTER COLUMN service_fee SET NOT NULL;

-- Add index for payout status
CREATE INDEX IF NOT EXISTS idx_orders_payout_status ON orders(payout_status);
CREATE INDEX IF NOT EXISTS idx_orders_completed_at ON orders(completed_at);

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN ('item_total', 'delivery_fee', 'service_fee', 'payout_status', 'completed_at')
ORDER BY column_name;

-- Show sample data to verify
SELECT 
    id,
    "item_total",
    "delivery_fee", 
    "service_fee",
    "payout_status",
    "completed_at"
FROM orders 
LIMIT 5; 