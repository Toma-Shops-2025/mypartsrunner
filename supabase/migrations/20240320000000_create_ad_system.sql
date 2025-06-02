-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create ads table
CREATE TABLE ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    destination_url TEXT NOT NULL,
    size TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
    location TEXT NOT NULL CHECK (location IN ('sidebar', 'header', 'footer', 'content')),
    daily_rate DECIMAL(10,2) NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ad_views table
CREATE TABLE ad_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT
);

-- Create ad_clicks table
CREATE TABLE ad_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    user_id UUID,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address TEXT
);

-- Create payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'usd',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ads table
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- Create policies for ads table
CREATE POLICY "Users can view all active ads" ON ads
    FOR SELECT
    USING (status = 'active');

CREATE POLICY "Users can create their own ads" ON ads
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ads" ON ads
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Enable RLS on ad_views table
ALTER TABLE ad_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create ad views" ON ad_views
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own ad views" ON ad_views
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM ads
        WHERE ads.id = ad_views.ad_id
        AND ads.user_id = auth.uid()
    ));

-- Enable RLS on ad_clicks table
ALTER TABLE ad_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create ad clicks" ON ad_clicks
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Users can view their own ad clicks" ON ad_clicks
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM ads
        WHERE ads.id = ad_clicks.ad_id
        AND ads.user_id = auth.uid()
    ));

-- Enable RLS on payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON payments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create functions for analytics
CREATE OR REPLACE FUNCTION get_ad_analytics(ad_id UUID)
RETURNS TABLE (
    views_count BIGINT,
    clicks_count BIGINT,
    ctr DECIMAL(5,2)
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
            ELSE (clicks.click_count::DECIMAL / views.view_count::DECIMAL) * 100
        END as ctr
    FROM views, clicks;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 