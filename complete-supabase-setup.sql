-- =====================================================
-- MyPartsRunner Complete Database Setup for New Supabase Project
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. Go to your new Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this ENTIRE script
-- 4. Click "Run" to execute
-- 5. Wait for all tables, indexes, and policies to be created
--
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    firstName TEXT,
    lastName TEXT,
    businessName TEXT,
    phone TEXT,
    role TEXT CHECK (role IN ('customer', 'driver', 'merchant', 'admin')) DEFAULT 'customer',
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Create driver_profiles table for additional driver information
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

-- Create merchant_profiles table for additional merchant information
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

-- =====================================================
-- MERCHANT INTEGRATION TABLES
-- =====================================================

-- Create merchant_integrations table for website integration
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

-- Create external_orders table for orders from merchant websites
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
    items JSONB NOT NULL, -- Array of items with name, quantity, price
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
-- INDEXES FOR PERFORMANCE
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
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_merchant_profiles_updated_at BEFORE UPDATE ON merchant_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_merchant_integrations_updated_at BEFORE UPDATE ON merchant_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_external_orders_updated_at BEFORE UPDATE ON external_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
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
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Stores policies
CREATE POLICY "Anyone can view active stores" ON stores FOR SELECT USING (isActive = true);
CREATE POLICY "Merchants can manage their own stores" ON stores FOR ALL USING (
    auth.uid() IN (
        SELECT id FROM profiles WHERE role = 'merchant'
    ) AND merchantId = auth.uid()
);

-- Products policies
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

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON order_items FOR SELECT USING (
    orderId IN (
        SELECT id FROM orders WHERE customerId = auth.uid() OR driverId = auth.uid() OR storeId IN (
            SELECT id FROM stores WHERE merchantId = auth.uid()
        )
    )
);

-- Cart items policies
CREATE POLICY "Customers can manage their own cart" ON cart_items FOR ALL USING (customerId = auth.uid());

-- Favorites policies
CREATE POLICY "Customers can manage their own favorites" ON favorites FOR ALL USING (customerId = auth.uid());

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Customers can create reviews for their orders" ON reviews FOR INSERT WITH CHECK (
    customerId = auth.uid() AND orderId IN (
        SELECT id FROM orders WHERE customerId = auth.uid()
    )
);

-- Driver profiles policies
CREATE POLICY "Drivers can manage their own profile" ON driver_profiles FOR ALL USING (id = auth.uid());
CREATE POLICY "Anyone can view available drivers" ON driver_profiles FOR SELECT USING (isAvailable = true);

-- Merchant profiles policies
CREATE POLICY "Merchants can manage their own profile" ON merchant_profiles FOR ALL USING (id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (userId = auth.uid());
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (userId = auth.uid());

-- Merchant integrations policies
CREATE POLICY "Merchants can manage their own integrations" ON merchant_integrations FOR ALL USING (merchantId = auth.uid());

-- External orders policies
CREATE POLICY "Merchants can view their own external orders" ON external_orders FOR SELECT USING (merchantId = auth.uid());
CREATE POLICY "Merchants can create external orders" ON external_orders FOR INSERT WITH CHECK (merchantId = auth.uid());
CREATE POLICY "Drivers can view assigned external orders" ON external_orders FOR SELECT USING (driverId = auth.uid());
CREATE POLICY "Drivers can update assigned external orders" ON external_orders FOR UPDATE USING (driverId = auth.uid());

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to get nearby stores
CREATE OR REPLACE FUNCTION get_nearby_stores(
    user_lat DECIMAL(10, 8),
    user_lng DECIMAL(11, 8),
    radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    storeType TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zipCode TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    distance_km DECIMAL(10, 2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.description,
        s.storeType,
        s.address,
        s.city,
        s.state,
        s.zipCode,
        s.latitude,
        s.longitude,
        (6371 * acos(cos(radians(user_lat)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(user_lng)) + sin(radians(user_lat)) * sin(radians(s.latitude)))) AS distance_km
    FROM stores s
    WHERE s.isActive = true
    AND (6371 * acos(cos(radians(user_lat)) * cos(radians(s.latitude)) * cos(radians(s.longitude) - radians(user_lng)) + sin(radians(user_lat)) * sin(radians(s.latitude)))) <= radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Function to get available drivers
CREATE OR REPLACE FUNCTION get_available_drivers(
    user_lat DECIMAL(10, 8),
    user_lng DECIMAL(11, 8),
    radius_km INTEGER DEFAULT 50
)
RETURNS TABLE (
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
    AND (6371 * acos(cos(radians(user_lat)) * cos(radians(dp.currentLocationLatitude)) * cos(radians(dp.currentLocationLongitude) - radians(user_lng)) + sin(radians(user_lat)) * sin(radians(dp.currentLocationLatitude)))) <= radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

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

-- Function to create external order from merchant website
CREATE OR REPLACE FUNCTION create_external_order(
    p_merchant_id UUID,
    p_store_id UUID,
    p_external_order_id TEXT,
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_delivery_address TEXT,
    p_delivery_city TEXT,
    p_delivery_state TEXT,
    p_delivery_zip_code TEXT,
    p_delivery_latitude DECIMAL(10, 8),
    p_delivery_longitude DECIMAL(11, 8),
    p_items JSONB,
    p_subtotal DECIMAL(10, 2),
    p_tax DECIMAL(10, 2),
    p_delivery_fee DECIMAL(10, 2),
    p_total DECIMAL(10, 2),
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_external_order_id UUID;
BEGIN
    INSERT INTO external_orders (
        merchantId,
        storeId,
        externalOrderId,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryCity,
        deliveryState,
        deliveryZipCode,
        deliveryLatitude,
        deliveryLongitude,
        items,
        subtotal,
        tax,
        deliveryFee,
        total,
        notes
    ) VALUES (
        p_merchant_id,
        p_store_id,
        p_external_order_id,
        p_customer_name,
        p_customer_email,
        p_customer_phone,
        p_delivery_address,
        p_delivery_city,
        p_delivery_state,
        p_delivery_zip_code,
        p_delivery_latitude,
        p_delivery_longitude,
        p_items,
        p_subtotal,
        p_tax,
        p_delivery_fee,
        p_total,
        p_notes
    ) RETURNING id INTO v_external_order_id;
    
    RETURN v_external_order_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- The database is now ready for production use!
-- 
-- NEXT STEPS:
-- 1. Update your environment variables in Netlify with the new Supabase URL and API key
-- 2. Test the registration functionality
-- 3. Set up merchant integrations for website delivery buttons
--
-- ===================================================== 