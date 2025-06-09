-- Function to create ad_locations table
CREATE OR REPLACE FUNCTION create_ad_locations_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.ad_locations (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

    -- Enable RLS
    ALTER TABLE public.ad_locations ENABLE ROW LEVEL SECURITY;

    -- Create policies
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
END;
$$;

-- Function to create ad_location_bookings table
CREATE OR REPLACE FUNCTION create_ad_bookings_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Create the table if it doesn't exist
    CREATE TABLE IF NOT EXISTS public.ad_location_bookings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    ALTER TABLE public.ad_location_bookings ENABLE ROW LEVEL SECURITY;

    -- Create policies
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
END;
$$; 