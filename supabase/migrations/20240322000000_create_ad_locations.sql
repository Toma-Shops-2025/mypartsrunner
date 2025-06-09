-- Create the ad_locations table
CREATE TABLE ad_locations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    price_per_day DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the ad_location_bookings table
CREATE TABLE ad_location_bookings (
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

-- Insert some initial ad locations
INSERT INTO ad_locations (name, description, price_per_day) VALUES
    ('video-feed-top', 'Premium ad space at the top of the video feed', 99.99),
    ('video-feed-middle', 'High-visibility ad space in the middle of the video feed', 79.99),
    ('video-feed-bottom', 'Effective ad space at the bottom of the video feed', 59.99);

-- Enable Row Level Security (RLS)
ALTER TABLE ad_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_location_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for ad_locations
CREATE POLICY "Allow public read access to ad_locations"
    ON ad_locations FOR SELECT
    TO public
    USING (true);

-- Create policies for ad_location_bookings
CREATE POLICY "Allow public read access to active ad_location_bookings"
    ON ad_location_bookings FOR SELECT
    TO public
    USING (status = 'active');

CREATE POLICY "Allow advertisers to manage their own bookings"
    ON ad_location_bookings FOR ALL
    TO authenticated
    USING (advertiser_id = auth.uid());

-- Create ad_locations table
create table public.ad_locations (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text not null,
    type text not null check (type in ('banner', 'sidebar', 'video-preroll', 'video-overlay', 'featured')),
    dimensions text not null, -- e.g., '728x90', '300x250'
    price_per_day numeric not null,
    max_duration_days integer not null,
    is_available boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ad_location_availability table for tracking booked periods
create table public.ad_location_bookings (
    id uuid default gen_random_uuid() primary key,
    location_id uuid references public.ad_locations(id) on delete cascade,
    start_date date not null,
    end_date date not null,
    ad_id uuid references public.ads(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ad_locations enable row level security;
alter table public.ad_location_bookings enable row level security;

-- Create policies
create policy "Anyone can view ad locations"
    on public.ad_locations for select
    using (true);

create policy "Only admins can manage ad locations"
    on public.ad_locations for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

create policy "Anyone can view ad location bookings"
    on public.ad_location_bookings for select
    using (true);

create policy "Only admins can manage bookings"
    on public.ad_location_bookings for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Create indexes
create index ad_location_bookings_location_id_idx on public.ad_location_bookings(location_id);
create index ad_location_bookings_date_range_idx on public.ad_location_bookings(start_date, end_date);

-- Insert default ad locations
insert into public.ad_locations 
(name, description, type, dimensions, price_per_day, max_duration_days) values
-- Premium Positions
('Homepage Hero Banner', 'Premium banner at the very top of the homepage - highest visibility', 'banner', '1200x300', 99.99, 30),
('Featured Product Spotlight', 'Premium featured product placement at the top of search results and category pages', 'featured', '600x600', 89.99, 14),
('Video Feed Pre-roll Premium', 'Video advertisement shown before trending videos', 'video-preroll', '1920x1080', 79.99, 14),

-- Standard Positions
('Homepage Sidebar Premium', 'Prominent sidebar advertisement on the homepage', 'sidebar', '300x600', 49.99, 30),
('Category Banner', 'Banner displayed at the top of category pages', 'banner', '728x90', 39.99, 30),
('Search Results Banner', 'Banner displayed in search results', 'banner', '728x90', 34.99, 30),

-- Video Positions
('Video Feed Mid-roll', 'Video advertisement shown during video playback', 'video-preroll', '1920x1080', 59.99, 14),
('Video Overlay Premium', 'Semi-transparent overlay during premium video content', 'video-overlay', '480x90', 44.99, 14),
('Video Feed End-card', 'Advertisement shown at the end of videos', 'video-preroll', '1920x1080', 29.99, 14),

-- Sidebar Positions
('Sidebar Standard', 'Standard sidebar advertisement position', 'sidebar', '300x250', 24.99, 30),
('Sidebar Bottom', 'Bottom sidebar advertisement position', 'sidebar', '300x250', 19.99, 30),

-- Mobile-Specific
('Mobile Header Banner', 'Premium banner optimized for mobile devices', 'banner', '320x100', 39.99, 30),
('Mobile Video Pre-roll', 'Video ads optimized for mobile viewing', 'video-preroll', '640x360', 49.99, 14),

-- Special Packages
('Homepage Premium Bundle', 'Premium bundle including homepage banner, sidebar, and featured spot', 'banner', '728x90,300x600,600x400', 199.99, 7),
('Video Premium Bundle', 'Premium bundle including pre-roll, mid-roll, and overlay ads', 'video-preroll', '1920x1080', 159.99, 7); 