-- 🗄️ MYPARTSRUNNER COMPLETE DATABASE SETUP (FIXED)
-- This script sets up the entire database schema for production use
-- Run this in your Supabase SQL Editor

-- ========================================
-- 1. ENABLE EXTENSIONS
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- 2. CORE TABLES
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
    isAvailable BOOLEAN DEFAULT false, -- For drivers
    avatar_url TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zipCode TEXT,
    stripeConnectAccountId TEXT, -- Stripe Connect account ID for payments
    stripeConnectStatus TEXT CHECK (stripeConnectStatus IN ('pending', 'active', 'restricted', 'disabled')) DEFAULT 'pending',
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
    -- Payout fields
    merchantPayoutId TEXT,
    merchantPayoutAmount DECIMAL(10, 2),
    merchantPayoutStatus TEXT CHECK (merchantPayoutStatus IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
    driverPayoutId TEXT,
    driverPayoutAmount DECIMAL(10, 2),
    driverPayoutStatus TEXT CHECK (driverPayoutStatus IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
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
-- 3. ROW LEVEL SECURITY (RLS)
-- ========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Anyone can view public profile data" ON profiles;
CREATE POLICY "Anyone can view public profile data" ON profiles FOR SELECT USING (true);

-- Stores policies
DROP POLICY IF EXISTS "Anyone can view active stores" ON stores;
CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (isActive = true);

DROP POLICY IF EXISTS "Merchants can manage their own stores" ON stores;
CREATE POLICY "Merchants can manage their own stores" ON stores FOR ALL USING (
    merchantId = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products policies
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = products.storeId AND stores.isActive = true)
);

DROP POLICY IF EXISTS "Merchants can manage their products" ON products;
CREATE POLICY "Merchants can manage their products" ON products FOR ALL USING (
    EXISTS (SELECT 1 FROM stores WHERE stores.id = products.storeId AND stores.merchantId = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Orders policies
DROP POLICY IF EXISTS "Users can view their related orders" ON orders;
CREATE POLICY "Users can view their related orders" ON orders FOR SELECT USING (
    customerId = auth.uid() OR 
    driverId = auth.uid() OR
    EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.storeId AND stores.merchantId = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Customers can create orders" ON orders;
CREATE POLICY "Customers can create orders" ON orders FOR INSERT WITH CHECK (customerId = auth.uid());

DROP POLICY IF EXISTS "Authorized users can update orders" ON orders;
CREATE POLICY "Authorized users can update orders" ON orders FOR UPDATE USING (
    customerId = auth.uid() OR 
    driverId = auth.uid() OR
    EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.storeId AND stores.merchantId = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Order items policies
DROP POLICY IF EXISTS "Users can view order items for their orders" ON order_items;
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.orderId 
        AND (
            orders.customerId = auth.uid() OR 
            orders.driverId = auth.uid() OR
            EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.storeId AND stores.merchantId = auth.uid()) OR
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        )
    )
);

-- Cart items policies
DROP POLICY IF EXISTS "Customers can manage their own cart" ON cart_items;
CREATE POLICY "Customers can manage their own cart" ON cart_items FOR ALL USING (customerId = auth.uid());

-- Favorites policies
DROP POLICY IF EXISTS "Customers can manage their own favorites" ON favorites;
CREATE POLICY "Customers can manage their own favorites" ON favorites FOR ALL USING (customerId = auth.uid());

-- Driver profiles policies
DROP POLICY IF EXISTS "Drivers can manage their own profile" ON driver_profiles;
CREATE POLICY "Drivers can manage their own profile" ON driver_profiles FOR ALL USING (
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Anyone can view available drivers" ON driver_profiles;
CREATE POLICY "Anyone can view available drivers" ON driver_profiles FOR SELECT USING (isAvailable = true OR driverStatus = 'online');

-- Reviews policies
DROP POLICY IF EXISTS "Anyone can view reviews" ON reviews;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Customers can create reviews for their orders" ON reviews;
CREATE POLICY "Customers can create reviews for their orders" ON reviews FOR INSERT WITH CHECK (
    customerId = auth.uid() AND
    EXISTS (SELECT 1 FROM orders WHERE orders.id = reviews.orderId AND orders.customerId = auth.uid())
);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (userId = auth.uid());

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (userId = auth.uid());

-- ========================================
-- 4. FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

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

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    total DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO total
    FROM order_items
    WHERE orderId = order_id;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby drivers
CREATE OR REPLACE FUNCTION find_nearby_drivers(user_lat DECIMAL, user_lng DECIMAL, radius_km DECIMAL DEFAULT 10)
RETURNS TABLE(
    id UUID,
    name TEXT,
    vehicleType TEXT,
    rating DECIMAL(3, 2),
    totalDeliveries INTEGER,
    distance_km DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        dp.vehicleType,
        dp.rating,
        dp.totalDeliveries,
        (6371 * acos(cos(radians(user_lat)) * cos(radians(dp.currentLocationLatitude)) * cos(radians(dp.currentLocationLongitude) - radians(user_lng)) + sin(radians(user_lat)) * sin(radians(dp.currentLocationLatitude)))) AS distance_km
    FROM profiles p
    JOIN driver_profiles dp ON p.id = dp.id
    WHERE p.role = 'driver'
    AND dp.isAvailable = true
    AND dp.driverStatus = 'online'
    AND (6371 * acos(cos(radians(user_lat)) * cos(radians(dp.currentLocationLatitude)) * cos(radians(dp.currentLocationLongitude) - radians(user_lng)) + sin(radians(user_lat)) * sin(radians(dp.currentLocationLatitude)))) <= radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 5. SAMPLE DATA (OPTIONAL)
-- ========================================

-- Insert sample products (if stores exist)
-- This will be populated when merchants register

-- ========================================
-- 6. INDEXES FOR PERFORMANCE
-- ========================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_stores_merchant ON stores(merchantId);
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(isActive);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(storeId);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_instock ON products(inStock);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customerId);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(driverId);
CREATE INDEX IF NOT EXISTS idx_orders_store ON orders(storeId);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(orderId);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer ON cart_items(customerId);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_available ON driver_profiles(isAvailable);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_status ON driver_profiles(driverStatus);
CREATE INDEX IF NOT EXISTS idx_driver_profiles_location ON driver_profiles(currentLocationLatitude, currentLocationLongitude);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(userId);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(userId, isRead);

-- ========================================
-- SETUP COMPLETE! 🎉
-- ========================================

-- Your MyPartsRunner database is now ready for production!
-- 
-- Next steps:
-- 1. Set up your environment variables in .env
-- 2. Test registration and login
-- 3. Create some sample stores and products
-- 
-- All tables have proper RLS policies for security
-- All functions and triggers are in place
-- Performance indexes are created 