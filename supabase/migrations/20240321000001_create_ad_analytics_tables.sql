-- Create ad_views table
create table public.ad_views (
    id uuid default gen_random_uuid() primary key,
    ad_id uuid references public.ads(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    location text not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create ad_clicks table
create table public.ad_clicks (
    id uuid default gen_random_uuid() primary key,
    ad_id uuid references public.ads(id) on delete cascade,
    user_id uuid references auth.users(id) on delete set null,
    location text not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index ad_views_ad_id_idx on public.ad_views(ad_id);
create index ad_views_user_id_idx on public.ad_views(user_id);
create index ad_views_timestamp_idx on public.ad_views(timestamp);

create index ad_clicks_ad_id_idx on public.ad_clicks(ad_id);
create index ad_clicks_user_id_idx on public.ad_clicks(user_id);
create index ad_clicks_timestamp_idx on public.ad_clicks(timestamp);

-- Enable RLS
alter table public.ad_views enable row level security;
alter table public.ad_clicks enable row level security;

-- Create policies for ad_views
create policy "Advertisers can view their own ad views"
    on public.ad_views for select
    to authenticated
    using (
        exists (
            select 1 from public.ads
            where id = ad_views.ad_id
            and advertiser_id = auth.uid()
        )
    );

create policy "Admins can view all ad views"
    on public.ad_views for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Create policies for ad_clicks
create policy "Advertisers can view their own ad clicks"
    on public.ad_clicks for select
    to authenticated
    using (
        exists (
            select 1 from public.ads
            where id = ad_clicks.ad_id
            and advertiser_id = auth.uid()
        )
    );

create policy "Admins can view all ad clicks"
    on public.ad_clicks for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Create policy for inserting views/clicks
create policy "Anyone can insert views"
    on public.ad_views for insert
    with check (true);

create policy "Anyone can insert clicks"
    on public.ad_clicks for insert
    with check (true); 