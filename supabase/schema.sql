--
-- TomaShops Database Schema
--

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ad Locations Table
CREATE TABLE IF NOT EXISTS public.ad_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ad Location Bookings Table
CREATE TABLE IF NOT EXISTS public.ad_location_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location_id UUID REFERENCES ad_locations(id) NOT NULL,
    advertiser_id UUID REFERENCES auth.users(id) NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    click_url TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ad_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_location_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Allow public read access to ad_locations"
    ON public.ad_locations FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Allow public read access to active ad_location_bookings"
    ON public.ad_location_bookings FOR SELECT
    TO public
    USING (status = 'active');

CREATE POLICY "Allow advertisers to manage their own bookings"
    ON public.ad_location_bookings FOR ALL
    TO authenticated
    USING (advertiser_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_location_id ON public.ad_location_bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_advertiser_id ON public.ad_location_bookings(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_status ON public.ad_location_bookings(status);
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_dates ON public.ad_location_bookings(start_date, end_date);

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[],
  video_url TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'active',
  category_id UUID,
  seller_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for products
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can insert their own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = seller_id);

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products(seller_id);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);

-- Insert some default categories
INSERT INTO categories (id, name, description)
VALUES 
  (uuid_generate_v4(), 'Electronics', 'Electronic devices and accessories'),
  (uuid_generate_v4(), 'Fashion', 'Clothing, shoes, and accessories'),
  (uuid_generate_v4(), 'Home & Garden', 'Home decor, furniture, and garden supplies'),
  (uuid_generate_v4(), 'Sports & Outdoors', 'Sports equipment and outdoor gear')
ON CONFLICT DO NOTHING; 

-- Delivery App Tables

-- Runners Table
CREATE TABLE IF NOT EXISTS public.runners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_deliveries INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    current_latitude DECIMAL(9,6),
    current_longitude DECIMAL(9,6),
    last_updated TIMESTAMP WITH TIME ZONE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL, -- customer
    store_id UUID REFERENCES public.stores(id) NOT NULL,
    runner_id UUID REFERENCES public.runners(id),
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered', 'cancelled')),
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    delivery_address JSONB NOT NULL,
    payment_intent_id TEXT,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')) DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_runner_id ON public.orders(runner_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runners ENABLE ROW LEVEL SECURITY;

-- Policies (examples, adjust as needed)
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Stores can view their own orders" ON public.orders FOR SELECT USING (store_id IN (SELECT id FROM public.stores WHERE owner_id = auth.uid()));
CREATE POLICY "Runners can view their assigned orders" ON public.orders FOR SELECT USING (runner_id = (SELECT id FROM public.runners WHERE user_id = auth.uid())); 