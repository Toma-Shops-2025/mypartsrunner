-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the ad_locations table
CREATE TABLE IF NOT EXISTS public.ad_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    max_duration_days INTEGER NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the ad_location_bookings table
CREATE TABLE IF NOT EXISTS public.ad_location_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    location_id UUID REFERENCES public.ad_locations(id) ON DELETE CASCADE,
    advertiser_id UUID REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    click_url TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.ad_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_location_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for ad_locations
DROP POLICY IF EXISTS "Anyone can view ad locations" ON public.ad_locations;
CREATE POLICY "Anyone can view ad locations"
    ON public.ad_locations FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Only admins can manage ad locations" ON public.ad_locations;
CREATE POLICY "Only admins can manage ad locations"
    ON public.ad_locations FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create policies for ad_location_bookings
DROP POLICY IF EXISTS "Anyone can view active bookings" ON public.ad_location_bookings;
CREATE POLICY "Anyone can view active bookings"
    ON public.ad_location_bookings FOR SELECT
    USING (status = 'active');

DROP POLICY IF EXISTS "Advertisers can manage their own bookings" ON public.ad_location_bookings;
CREATE POLICY "Advertisers can manage their own bookings"
    ON public.ad_location_bookings FOR ALL
    TO authenticated
    USING (advertiser_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_location_id 
    ON public.ad_location_bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_advertiser_id 
    ON public.ad_location_bookings(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_status 
    ON public.ad_location_bookings(status);
CREATE INDEX IF NOT EXISTS idx_ad_location_bookings_dates 
    ON public.ad_location_bookings(start_date, end_date);

-- Insert initial ad locations
INSERT INTO public.ad_locations (name, description, type, dimensions, price_per_day, max_duration_days, is_available)
VALUES
    ('video-feed-top', 'Premium ad space at the top of the video feed', 'video-feed', '1200x300', 99.99, 30, true),
    ('video-feed-middle', 'High-visibility ad space in the middle of the video feed', 'video-feed', '1200x300', 79.99, 30, true),
    ('video-feed-bottom', 'Effective ad space at the bottom of the video feed', 'video-feed', '1200x300', 59.99, 30, true)
ON CONFLICT (name) DO NOTHING; 