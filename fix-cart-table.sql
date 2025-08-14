-- Fix Cart Items Table and RLS Policies
-- Run this in your Supabase SQL Editor

-- Create cart_items table if it doesn't exist
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customerId, productId)
);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for cart_items
DROP POLICY IF EXISTS "Customers can manage their own cart" ON cart_items;
CREATE POLICY "Customers can manage their own cart" ON cart_items 
    FOR ALL USING (customerId = auth.uid());

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customerId);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for cart_items updated_at
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 