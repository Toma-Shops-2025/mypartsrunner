-- 🗄️ MYPARTSRUNNER SIMPLE DATABASE SETUP
-- This script sets up the core database schema
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. ENABLE EXTENSIONS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 2. CREATE CORE TABLES FIRST
-- ========================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    firstName TEXT,
    lastName TEXT,
    businessName TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('customer', 'driver', 'merchant', 'admin')) DEFAULT 'customer',
    isAvailable BOOLEAN DEFAULT false,
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zipCode TEXT,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver profiles table (additional driver data)
CREATE TABLE IF NOT EXISTS driver_profiles (
    id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    vehicleType TEXT,
    vehicleMake TEXT,
    vehicleModel TEXT,
    vehicleYear INTEGER,
    licensePlate TEXT,
    licenseNumber TEXT,
    licenseExpiry DATE,
    insuranceProvider TEXT,
    insurancePolicyNumber TEXT,
    insuranceExpiry DATE,
    isAvailable BOOLEAN DEFAULT false,
    currentLocationLatitude DECIMAL(10, 8),
    currentLocationLongitude DECIMAL(11, 8),
    rating DECIMAL(3, 2) DEFAULT 5.0,
    totalDeliveries INTEGER DEFAULT 0,
    totalEarnings DECIMAL(10, 2) DEFAULT 0,
    driverStatus TEXT CHECK (driverStatus IN ('offline', 'online', 'busy', 'break')) DEFAULT 'offline',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stores table for merchants
CREATE TABLE IF NOT EXISTS stores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    merchantId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    storeType TEXT CHECK (storeType IN ('auto', 'hardware', 'general')) NOT NULL,
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

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    originalPrice DECIMAL(10, 2),
    category TEXT NOT NULL,
    brand TEXT,
    imageUrl TEXT,
    inStock BOOLEAN DEFAULT true,
    stockQuantity INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    driverId UUID REFERENCES profiles(id),
    storeId UUID REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered', 'cancelled')) DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    deliveryFee DECIMAL(10, 2) DEFAULT 0,
    tip DECIMAL(10, 2) DEFAULT 0,
    deliveryAddress TEXT NOT NULL,
    deliveryLatitude DECIMAL(10, 8),
    deliveryLongitude DECIMAL(11, 8),
    estimatedDeliveryTime TIMESTAMP WITH TIME ZONE,
    actualDeliveryTime TIMESTAMP WITH TIME ZONE,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    orderId UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unitPrice DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customerId, productId)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    productId UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(customerId, productId)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    orderId UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    customerId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    driverId UUID REFERENCES profiles(id),
    productId UUID REFERENCES products(id),
    storeId UUID REFERENCES stores(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    type TEXT CHECK (type IN ('driver', 'product', 'store')) NOT NULL,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    userId UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('order', 'delivery', 'payment', 'system', 'promotion')) NOT NULL,
    isRead BOOLEAN DEFAULT false,
    data JSONB,
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. AUTOMATIC PROFILE CREATION FUNCTION
-- ========================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, firstName, lastName, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'firstName', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'lastName', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- 4. BASIC ROW LEVEL SECURITY
-- ========================================

-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can view and edit their own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Public profile viewing" ON profiles FOR SELECT USING (true);

CREATE POLICY "Drivers can manage their own profile" ON driver_profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "Public driver viewing" ON driver_profiles FOR SELECT USING (true);

CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (isActive = true);
CREATE POLICY "Merchants can manage their stores" ON stores FOR ALL USING (merchantId = auth.uid());

CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

CREATE POLICY "Users can view their orders" ON orders FOR SELECT USING (
    customerId = auth.uid() OR driverId = auth.uid()
);
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (customerId = auth.uid());

CREATE POLICY "Users can manage their cart" ON cart_items FOR ALL USING (customerId = auth.uid());

-- ========================================
-- 5. HELPER FUNCTIONS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ========================================
-- 6. PERFORMANCE INDEXES
-- ========================================

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_available ON driver_profiles(isAvailable);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_status ON driver_profiles(driverStatus);
CREATE INDEX IF NOT EXISTS idx_stores_merchant ON stores(merchantId);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(isActive);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(storeId);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customerId);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(driverId);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer ON cart_items(customerId);

-- ========================================
-- SETUP COMPLETE! 🎉
-- ========================================

-- Your MyPartsRunner database is now ready!
-- This simplified setup includes:
-- ✅ All core tables
-- ✅ Automatic profile creation 
-- ✅ Basic security policies
-- ✅ Performance indexes
-- ✅ Update triggers
--
-- You can now test registration and login! 