-- Complete Payment System Migration for MyPartsRunner
-- This script migrates your existing database to support the payment system
-- Run this in your Supabase SQL Editor

-- Step 1: Add payment system columns to existing orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS item_total DECIMAL(10,2) CHECK (item_total >= 0),
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10,2) DEFAULT 0 CHECK (delivery_fee >= 0),
ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10,2) DEFAULT 0 CHECK (service_fee >= 0),
ADD COLUMN IF NOT EXISTS payout_status TEXT DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Step 2: Update existing orders with default values
UPDATE orders 
SET 
    item_total = COALESCE(subtotal, 0),
    delivery_fee = COALESCE("deliveryFee", 0),
    service_fee = COALESCE(tax, 0)
WHERE item_total IS NULL OR delivery_fee IS NULL OR service_fee IS NULL;

-- Step 3: Make columns NOT NULL
ALTER TABLE orders 
ALTER COLUMN item_total SET NOT NULL,
ALTER COLUMN delivery_fee SET NOT NULL,
ALTER COLUMN service_fee SET NOT NULL;

-- Step 4: Create wallets table if it doesn't exist
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency TEXT DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    role TEXT NOT NULL CHECK (role IN ('merchant', 'driver', 'house')),
    description TEXT NOT NULL,
    transaction_type TEXT DEFAULT 'payout' CHECK (transaction_type IN ('payout', 'refund', 'adjustment')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    external_reference TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create payment settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value DECIMAL(10,4) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Insert default payment settings
INSERT INTO payment_settings (key, value, description) VALUES
    ('driver_payout_percentage', 0.80, 'Percentage of delivery fee that goes to driver'),
    ('tax_rate_service_fee', 0.00, 'Tax rate applied to service fees'),
    ('house_service_fee_percentage', 0.25, 'Percentage of delivery fee that goes to house'),
    ('minimum_payout_amount', 5.00, 'Minimum amount required for payout processing')
ON CONFLICT (key) DO NOTHING;

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_payout_status ON orders(payout_status);
CREATE INDEX IF NOT EXISTS idx_orders_completed_at ON orders(completed_at);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_recipient_id ON transactions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- Step 9: Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 10: Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON payment_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Create function to ensure wallet exists for new users
CREATE OR REPLACE FUNCTION ensure_wallet_exists()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets (user_id, balance) VALUES (NEW.id, 0.00)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 12: Create trigger to auto-create wallet for new users
DROP TRIGGER IF EXISTS create_wallet_for_new_user ON profiles;
CREATE TRIGGER create_wallet_for_new_user AFTER INSERT ON profiles
    FOR EACH ROW EXECUTE FUNCTION ensure_wallet_exists();

-- Step 13: Create wallets for existing users
INSERT INTO wallets (user_id, balance)
SELECT id, 0.00 FROM profiles
WHERE id NOT IN (SELECT user_id FROM wallets)
ON CONFLICT (user_id) DO NOTHING;

-- Step 14: Grant necessary permissions
GRANT ALL ON wallets TO authenticated;
GRANT ALL ON transactions TO authenticated;
GRANT ALL ON payment_settings TO authenticated;

-- Step 15: Enable Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Step 16: RLS Policies for wallets
DROP POLICY IF EXISTS "Users can view their own wallet" ON wallets;
CREATE POLICY "Users can view their own wallet" ON wallets
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can update wallet balances" ON wallets;
CREATE POLICY "System can update wallet balances" ON wallets
    FOR UPDATE USING (true);

-- Step 17: RLS Policies for transactions
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "System can create transactions" ON transactions;
CREATE POLICY "System can create transactions" ON transactions
    FOR INSERT WITH CHECK (true);

-- Step 18: RLS Policies for payment settings
DROP POLICY IF EXISTS "Everyone can view payment settings" ON payment_settings;
CREATE POLICY "Everyone can view payment settings" ON payment_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can update payment settings" ON payment_settings;
CREATE POLICY "Admins can update payment settings" ON payment_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Step 19: Verify the migration
SELECT 'Migration completed successfully!' as status;

-- Step 20: Show the current orders table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;

-- Step 21: Show sample data
SELECT 
    id,
    "item_total",
    "delivery_fee", 
    "service_fee",
    "payout_status",
    "completed_at"
FROM orders 
LIMIT 5; 