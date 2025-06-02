create table public.ads (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    image_url text not null,
    link_url text not null,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
    location text not null,
    start_date date not null,
    end_date date not null,
    advertiser_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.ads enable row level security;

-- Allow users to view approved ads
create policy "Anyone can view approved ads"
    on public.ads for select
    using (status = 'approved');

-- Allow users to create ads
create policy "Authenticated users can create ads"
    on public.ads for insert
    to authenticated
    with check (true);

-- Allow users to update their own ads
create policy "Users can update own ads"
    on public.ads for update
    to authenticated
    using (auth.uid() = advertiser_id);

-- Allow admins to manage all ads
create policy "Admins can manage all ads"
    on public.ads for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for updated_at
create trigger handle_ads_updated_at
    before update on public.ads
    for each row
    execute procedure public.handle_updated_at(); 