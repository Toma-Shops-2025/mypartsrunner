-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    banned BOOLEAN DEFAULT FALSE,
    role TEXT DEFAULT 'user'
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    image_url TEXT,
    seller_id UUID REFERENCES users(id),
    reported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    disputed BOOLEAN DEFAULT FALSE
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    reported_id UUID NOT NULL,
    reporter_id UUID REFERENCES users(id),
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    location TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    advertiser_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL
);

CREATE TABLE ad_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ip_address TEXT
);

CREATE TABLE ad_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ip_address TEXT
);

-- Create functions
CREATE OR REPLACE FUNCTION get_ad_analytics(ad_id UUID)
RETURNS TABLE (
    views_count BIGINT,
    clicks_count BIGINT,
    ctr NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH views AS (
        SELECT COUNT(*) as view_count
        FROM ad_views
        WHERE ad_views.ad_id = $1
    ),
    clicks AS (
        SELECT COUNT(*) as click_count
        FROM ad_clicks
        WHERE ad_clicks.ad_id = $1
    )
    SELECT 
        views.view_count,
        clicks.click_count,
        CASE 
            WHEN views.view_count = 0 THEN 0
            ELSE (clicks.click_count::NUMERIC / views.view_count::NUMERIC)
        END as ctr
    FROM views, clicks;
END;
$$ LANGUAGE plpgsql; 