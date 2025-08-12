-- Payment System Database Schema for MyPartsRunner
-- Run this in your Supabase SQL Editor

-- Create the orders table with payment-related fields
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES profiles(id) NOT NULL,
    driver_id UUID REFERENCES profiles(id),
    customer_id UUID REFERENCES profiles(id) NOT NULL,
    item_total DECIMAL(10,2) NOT NULL CHECK (item_total >= 0),
    delivery_fee DECIMAL(10,2) NOT NULL CHECK (delivery_fee >= 0),
    service_fee DECIMAL(10,2) NOT NULL CHECK (service_fee >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    completed_at TIMESTAMP WITH TIME ZONE,
    payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the wallets table for user balances
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL UNIQUE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the transactions table for payment logging
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) NOT NULL,
    recipient_id UUID REFERENCES profiles(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    role TEXT NOT NULL CHECK (role IN ('merchant', 'driver', 'house')),
    description TEXT NOT NULL,
    transaction_type TEXT DEFAULT 'payout' CHECK (transaction_type IN ('payout', 'refund', 'adjustment')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    external_reference TEXT, -- For payment processor references
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the settings table for configurable payment parameters
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value DECIMAL(10,4) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default payment settings
INSERT INTO payment_settings (key, value, description) VALUES
    ('driver_payout_percentage', 0.80, 'Percentage of delivery fee that goes to driver'),
    ('tax_rate_service_fee', 0.00, 'Tax rate applied to service fees'),
    ('house_service_fee_percentage', 0.25, 'Percentage of delivery fee that goes to house'),
    ('minimum_payout_amount', 5.00, 'Minimum amount required for payout processing')
ON CONFLICT (key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payout_status ON orders(payout_status);
CREATE INDEX IF NOT EXISTS idx_orders_completed_at ON orders(completed_at);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to ensure wallet exists for new users
CREATE OR REPLACE FUNCTION ensure_wallet_exists()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id, balance) VALUES (NEW.id, 0.00)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-create wallet for new users
CREATE TRIGGER create_wallet_for_new_user AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION ensure_wallet_exists();

-- Grant necessary permissions
GRANT ALL ON orders TO authenticated;
GRANT ALL ON wallets TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT ALL ON payment_settings TO authenticated;

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        auth.uid() = customer_id OR 
        auth.uid() = merchant_id OR 
        auth.uid() = driver_id
    );

CREATE POLICY "Merchants can update their orders" ON orders
    FOR UPDATE USING (auth.uid() = merchant_id);

CREATE POLICY "Drivers can update order status" ON orders
    FOR UPDATE USING (auth.uid() = driver_id);

-- RLS Policies for wallets
CREATE POLICY "Users can view their own wallet" ON wallets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can update wallet balances" ON wallets
    FOR UPDATE USING (true);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "System can create transactions" ON transactions
    FOR INSERT WITH CHECK (true);

-- RLS Policies for payment settings
CREATE POLICY "Everyone can view payment settings" ON payment_settings
    FOR SELECT USING (true);

CREATE POLICY "Admins can update payment settings" ON payment_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Verify the setup
SELECT 'Database schema created successfully!' as status; 