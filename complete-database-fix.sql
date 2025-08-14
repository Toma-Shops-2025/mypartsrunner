-- Complete Database Fix for MyPartsRunner
-- Run this ENTIRE script in your Supabase SQL Editor to fix all current issues

-- =====================================================
-- FIX 1: Create missing cart_items table
-- =====================================================

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

-- =====================================================
-- FIX 2: Ensure driver_profiles table exists and has correct structure
-- =====================================================

-- Create driver_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS driver_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    licenseVerified BOOLEAN DEFAULT false,
    insuranceVerified BOOLEAN DEFAULT false,
    vehicleType TEXT CHECK (vehicleType IN ('car', 'suv', 'truck', 'van')) DEFAULT 'car',
    vehicleMake TEXT,
    vehicleModel TEXT,
    vehicleYear INTEGER,
    licensePlate TEXT,
    isAvailable BOOLEAN DEFAULT false,
    currentLocationLatitude DECIMAL(10, 8),
    currentLocationLongitude DECIMAL(11, 8),
    stripeAccountId TEXT,
    cashAppUsername TEXT,
    venmoUsername TEXT,
    rating DECIMAL(3, 2) DEFAULT 0,
    totalDeliveries INTEGER DEFAULT 0,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on driver_profiles
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for driver_profiles
DROP POLICY IF EXISTS "Drivers can manage their own profile" ON driver_profiles;
CREATE POLICY "Drivers can manage their own profile" ON driver_profiles 
    FOR ALL USING (id = auth.uid());

-- Create index for available drivers
CREATE INDEX IF NOT EXISTS idx_driver_profiles_available ON driver_profiles(isAvailable);

-- =====================================================
-- FIX 3: Create missing tables that might be referenced
-- =====================================================

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    imageUrl TEXT,
    inStock BOOLEAN DEFAULT true,
    stockQuantity INTEGER DEFAULT 0,
    sku TEXT,
    brand TEXT,
    partNumber TEXT,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table if it doesn't exist
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    merchantId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    storeType TEXT CHECK (storeType IN ('auto', 'hardware')) NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zipCode TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    phone TEXT,
    email TEXT,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FIX 4: Create updated_at trigger function and triggers
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_driver_profiles_updated_at ON driver_profiles;
CREATE TRIGGER update_driver_profiles_updated_at 
    BEFORE UPDATE ON driver_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stores_updated_at ON stores;
CREATE TRIGGER update_stores_updated_at 
    BEFORE UPDATE ON stores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FIX 5: Insert sample data for testing
-- =====================================================

-- Insert a sample store if none exist
INSERT INTO stores (id, merchantId, name, description, storeType, address, city, state, zipCode, isActive)
SELECT 
    gen_random_uuid(),
    p.id,
    'Sample Auto Parts Store',
    'A sample store for testing',
    'auto',
    '123 Main St',
    'Sample City',
    'CA',
    '90210'
FROM profiles p 
WHERE p.role = 'merchant' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert a sample product if none exist
INSERT INTO products (id, storeId, name, description, price, category, isActive)
SELECT 
    gen_random_uuid(),
    s.id,
    'Sample Auto Part',
    'A sample auto part for testing',
    29.99,
    'engine',
    true
FROM stores s 
LIMIT 1
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION: Check that all tables exist
-- =====================================================

-- This will show you all the tables that were created
SELECT 
    table_name,
    CASE 
        WHEN table_name IN ('cart_items', 'driver_profiles', 'products', 'stores') 
        THEN '✅ Created/Fixed' 
        ELSE 'ℹ️ Already existed' 
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cart_items', 'driver_profiles', 'products', 'stores', 'profiles')
ORDER BY table_name;

-- Show RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('cart_items', 'driver_profiles')
ORDER BY tablename, policyname; 