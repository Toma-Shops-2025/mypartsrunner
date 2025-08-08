-- =====================================================
-- MyPartsRunner Database Fix Script
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your Supabase project dashboard (vzynutgjvlwccpubbkwg)
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this ENTIRE script
-- 4. Click "Run" to execute
-- 5. Wait for all changes to be applied
--
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FIX PROFILES TABLE
-- =====================================================

-- Add businessName column to profiles table if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS businessName TEXT;

-- Add firstName column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS firstName TEXT;

-- Add lastName column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS lastName TEXT;

-- Update existing profiles to have empty values if null
UPDATE profiles 
SET businessName = COALESCE(businessName, ''),
    firstName = COALESCE(firstName, ''),
    lastName = COALESCE(lastName, '')
WHERE businessName IS NULL 
   OR firstName IS NULL 
   OR lastName IS NULL;

-- =====================================================
-- CREATE MISSING TABLES IF THEY DON'T EXIST
-- =====================================================

-- Create stores table for merchants
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    driverId UUID REFERENCES profiles(id) ON DELETE SET NULL,
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'in-progress', 'delivered', 'cancelled')) DEFAULT 'pending',
    deliveryNotes TEXT,
    paymentMethod TEXT CHECK (paymentMethod IN ('stripe', 'cashApp', 'venmo', 'cash')) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    deliveryFee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    deliveryAddress TEXT NOT NULL,
    deliveryCity TEXT NOT NULL,
    deliveryState TEXT NOT NULL,
    deliveryZipCode TEXT NOT NULL,
    deliveryLatitude DECIMAL(10, 8),
    deliveryLongitude DECIMAL(11, 8),
    estimatedDeliveryTime TIMESTAMP WITH TIME ZONE,
    actualDeliveryTime TIMESTAMP WITH TIME ZONE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    orderId UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customerId, productId)
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customerId, productId)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    orderId UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customerId, orderId)
);

-- Create driver_profiles table
CREATE TABLE IF NOT EXISTS driver_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    licenseVerified BOOLEAN DEFAULT false,
    insuranceVerified BOOLEAN DEFAULT false,
    vehicleType TEXT CHECK (vehicleType IN ('car', 'suv', 'truck', 'van')) NOT NULL,
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

-- Create merchant_profiles table
CREATE TABLE IF NOT EXISTS merchant_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    businessLicense TEXT,
    taxId TEXT,
    stripeAccountId TEXT,
    bankAccountInfo JSONB,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
    isRead BOOLEAN DEFAULT false,
    relatedEntityType TEXT,
    relatedEntityId UUID,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create merchant_integrations table
CREATE TABLE IF NOT EXISTS merchant_integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    merchantId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    integrationType TEXT CHECK (integrationType IN ('website', 'api', 'widget')) NOT NULL,
    websiteUrl TEXT,
    apiKey TEXT,
    webhookUrl TEXT,
    isActive BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create external_orders table
CREATE TABLE IF NOT EXISTS external_orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    merchantId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    externalOrderId TEXT NOT NULL,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT NOT NULL,
    deliveryAddress TEXT NOT NULL,
    deliveryCity TEXT NOT NULL,
    deliveryState TEXT NOT NULL,
    deliveryZipCode TEXT NOT NULL,
    deliveryLatitude DECIMAL(10, 8),
    deliveryLongitude DECIMAL(11, 8),
    items JSONB NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    deliveryFee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'accepted', 'in-progress', 'delivered', 'cancelled')) DEFAULT 'pending',
    driverId UUID REFERENCES profiles(id) ON DELETE SET NULL,
    estimatedDeliveryTime TIMESTAMP WITH TIME ZONE,
    actualDeliveryTime TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(merchantId, externalOrderId)
);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_stores_merchant_id ON stores(merchantId);
CREATE INDEX IF NOT EXISTS idx_stores_location ON stores(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(storeId);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customerId);
CREATE INDEX IF NOT EXISTS idx_orders_driver_id ON orders(driverId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customerId);
CREATE INDEX IF NOT EXISTS idx_favorites_customer_id ON favorites(customerId);
CREATE INDEX IF NOT EXISTS idx_reviews_store_id ON reviews(storeId);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_available ON driver_profiles(isAvailable);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(isRead);
CREATE INDEX IF NOT EXISTS idx_merchant_integrations_merchant_id ON merchant_integrations(merchantId);
CREATE INDEX IF NOT EXISTS idx_external_orders_merchant_id ON external_orders(merchantId);
CREATE INDEX IF NOT EXISTS idx_external_orders_status ON external_orders(status);

-- =====================================================
-- CREATE TRIGGERS (WITH EXISTING CHECK)
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at (only if they don't exist)
DO $$
BEGIN
    -- Profiles trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
        CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Stores trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_stores_updated_at') THEN
        CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Products trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_products_updated_at') THEN
        CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Orders trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_orders_updated_at') THEN
        CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Cart items trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cart_items_updated_at') THEN
        CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Driver profiles trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_driver_profiles_updated_at') THEN
        CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Merchant profiles trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_merchant_profiles_updated_at') THEN
        CREATE TRIGGER update_merchant_profiles_updated_at BEFORE UPDATE ON merchant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Merchant integrations trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_merchant_integrations_updated_at') THEN
        CREATE TRIGGER update_merchant_integrations_updated_at BEFORE UPDATE ON merchant_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- External orders trigger
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_external_orders_updated_at') THEN
        CREATE TRIGGER update_external_orders_updated_at BEFORE UPDATE ON external_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =====================================================
-- ENABLE RLS AND CREATE POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE merchant_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_orders ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Stores policies
DROP POLICY IF EXISTS "Anyone can view active stores" ON stores;
DROP POLICY IF EXISTS "Merchants can manage their own stores" ON stores;

CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (isActive = true);
CREATE POLICY "Merchants can manage their own stores" ON stores FOR ALL USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'merchant'
    ) AND merchantId = auth.uid()
);

-- Products policies
DROP POLICY IF EXISTS "Anyone can view active products from active stores" ON products;
DROP POLICY IF EXISTS "Merchants can manage products in their stores" ON products;

CREATE POLICY "Anyone can view active products from active stores" ON products FOR SELECT USING (
    isActive = true AND storeId IN (
        SELECT id FROM stores WHERE isActive = true
    )
);
CREATE POLICY "Merchants can manage products in their stores" ON products FOR ALL USING (
    auth.uid() IN (
        SELECT s.merchantId FROM stores s WHERE s.id = products.storeId AND s.merchantId = auth.uid()
    )
);

-- Orders policies
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Drivers can view assigned orders" ON orders;
DROP POLICY IF EXISTS "Merchants can view orders for their stores" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Drivers can update assigned orders" ON orders;
DROP POLICY IF EXISTS "Merchants can update orders for their stores" ON orders;

CREATE POLICY "Customers can view their own orders" ON orders FOR SELECT USING (customerId = auth.uid());
CREATE POLICY "Drivers can view assigned orders" ON orders FOR SELECT USING (driverId = auth.uid());
CREATE POLICY "Merchants can view orders for their stores" ON orders FOR SELECT USING (
    storeId IN (
        SELECT id FROM stores WHERE merchantId = auth.uid()
    )
);
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (customerId = auth.uid());
CREATE POLICY "Drivers can update assigned orders" ON orders FOR UPDATE USING (driverId = auth.uid());
CREATE POLICY "Merchants can update orders for their stores" ON orders FOR UPDATE USING (
    storeId IN (
        SELECT id FROM stores WHERE merchantId = auth.uid()
    )
);

-- Cart items policies
DROP POLICY IF EXISTS "Customers can manage their own cart" ON cart_items;
CREATE POLICY "Customers can manage their own cart" ON cart_items FOR ALL USING (customerId = auth.uid());

-- Favorites policies
DROP POLICY IF EXISTS "Customers can manage their own favorites" ON favorites;
CREATE POLICY "Customers can manage their own favorites" ON favorites FOR ALL USING (customerId = auth.uid());

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
DROP POLICY IF EXISTS "Customers can create reviews for their orders" ON reviews;

CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews for their orders" ON reviews FOR INSERT WITH CHECK (
    customerId = auth.uid() AND orderId IN (
        SELECT id FROM orders WHERE customerId = auth.uid()
    )
);

-- Driver profiles policies
DROP POLICY IF EXISTS "Drivers can manage their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Anyone can view available drivers" ON driver_profiles;

CREATE POLICY "Drivers can manage their own profile" ON driver_profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "Anyone can view available drivers" ON driver_profiles FOR SELECT USING (isAvailable = true);

-- Merchant profiles policies
DROP POLICY IF EXISTS "Merchants can manage their own profile" ON merchant_profiles;
CREATE POLICY "Merchants can manage their own profile" ON merchant_profiles FOR ALL USING (id = auth.uid());

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (userId = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (userId = auth.uid());

-- Merchant integrations policies
DROP POLICY IF EXISTS "Merchants can manage their own integrations" ON merchant_integrations;
CREATE POLICY "Merchants can manage their own integrations" ON merchant_integrations FOR ALL USING (merchantId = auth.uid());

-- External orders policies
DROP POLICY IF EXISTS "Merchants can view their own external orders" ON external_orders;
DROP POLICY IF EXISTS "Merchants can create external orders" ON external_orders;
DROP POLICY IF EXISTS "Drivers can view assigned external orders" ON external_orders;
DROP POLICY IF EXISTS "Drivers can update assigned external orders" ON external_orders;

CREATE POLICY "Merchants can view their own external orders" ON external_orders FOR SELECT USING (merchantId = auth.uid());
CREATE POLICY "Merchants can create external orders" ON external_orders FOR INSERT WITH CHECK (merchantId = auth.uid());
CREATE POLICY "Drivers can view assigned external orders" ON external_orders FOR SELECT USING (driverId = auth.uid());
CREATE POLICY "Drivers can update assigned external orders" ON external_orders FOR UPDATE USING (driverId = auth.uid());

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Verify the businessName column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'businessName';

-- Show all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- The database is now ready for production use!
-- 
-- NEXT STEPS:
-- 1. Test the registration functionality
-- 2. Verify all tables and columns are created
-- 3. Set up merchant integrations for website delivery buttons
--
-- ===================================================== 