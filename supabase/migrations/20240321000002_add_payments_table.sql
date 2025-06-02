-- Add total_price column to ads table
alter table public.ads
add column total_price numeric(10,2);

-- Create payments table
create table public.payments (
    id uuid default gen_random_uuid() primary key,
    ad_id uuid references public.ads(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    amount numeric(10,2) not null,
    stripe_session_id text unique not null,
    stripe_payment_intent_id text unique,
    status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index payments_ad_id_idx on public.payments(ad_id);
create index payments_user_id_idx on public.payments(user_id);
create index payments_stripe_session_id_idx on public.payments(stripe_session_id);
create index payments_status_idx on public.payments(status);

-- Enable RLS
alter table public.payments enable row level security;

-- Create policies
create policy "Users can view their own payments"
    on public.payments for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Admins can view all payments"
    on public.payments for all
    to authenticated
    using (
        exists (
            select 1 from public.users
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Create function to update updated_at timestamp
create trigger handle_payments_updated_at
    before update on public.payments
    for each row
    execute procedure public.handle_updated_at(); 