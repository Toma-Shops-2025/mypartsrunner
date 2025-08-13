-- Stripe Integration Migration Script
-- This script adds Stripe-related columns to support real money movement

-- Step 1: Add Stripe columns to merchant_profiles table
DO $$
BEGIN
    -- Add stripe_account_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'merchant_profiles' AND column_name = 'stripe_account_id'
    ) THEN
        ALTER TABLE merchant_profiles ADD COLUMN stripe_account_id TEXT;
        RAISE NOTICE 'Added stripe_account_id column to merchant_profiles';
    ELSE
        RAISE NOTICE 'stripe_account_id column already exists in merchant_profiles';
    END IF;

    -- Add stripe_charges_enabled if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'merchant_profiles' AND column_name = 'stripe_charges_enabled'
    ) THEN
        ALTER TABLE merchant_profiles ADD COLUMN stripe_charges_enabled BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added stripe_charges_enabled column to merchant_profiles';
    ELSE
        RAISE NOTICE 'stripe_charges_enabled column already exists in merchant_profiles';
    END IF;

    -- Add stripe_payouts_enabled if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'merchant_profiles' AND column_name = 'stripe_payouts_enabled'
    ) THEN
        ALTER TABLE merchant_profiles ADD COLUMN stripe_payouts_enabled BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added stripe_payouts_enabled column to merchant_profiles';
    ELSE
        RAISE NOTICE 'stripe_payouts_enabled column already exists in merchant_profiles';
    END IF;

    -- Add stripe_details_submitted if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'merchant_profiles' AND column_name = 'stripe_details_submitted'
    ) THEN
        ALTER TABLE merchant_profiles ADD COLUMN stripe_details_submitted BOOLEAN DEFAULT FALSE;
        RAISE NOTICE 'Added stripe_details_submitted column to merchant_profiles';
    ELSE
        RAISE NOTICE 'stripe_details_submitted column already exists in merchant_profiles';
    END IF;
END $$;

-- Step 2: Add Stripe columns to orders table
DO $$
BEGIN
    -- Add stripe_payment_intent_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'stripe_payment_intent_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN stripe_payment_intent_id TEXT;
        RAISE NOTICE 'Added stripe_payment_intent_id column to orders';
    ELSE
        RAISE NOTICE 'stripe_payment_intent_id column already exists in orders';
    END IF;

    -- Add stripe_customer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN stripe_customer_id TEXT;
        RAISE NOTICE 'Added stripe_customer_id column to orders';
    ELSE
        RAISE NOTICE 'stripe_customer_id column already exists in orders';
    END IF;
END $$;

-- Step 3: Add Stripe columns to transactions table
DO $$
BEGIN
    -- Add stripe_transfer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'stripe_transfer_id'
    ) THEN
        ALTER TABLE transactions ADD COLUMN stripe_transfer_id TEXT;
        RAISE NOTICE 'Added stripe_transfer_id column to transactions';
    ELSE
        RAISE NOTICE 'stripe_transfer_id column already exists in transactions';
    END IF;

    -- Add stripe_payout_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'transactions' AND column_name = 'stripe_payout_id'
    ) THEN
        ALTER TABLE transactions ADD COLUMN stripe_payout_id TEXT;
        RAISE NOTICE 'Added stripe_payout_id column to transactions';
    ELSE
        RAISE NOTICE 'stripe_payout_id column already exists in transactions';
    END IF;
END $$;

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_stripe_account_id ON merchant_profiles(stripe_account_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_customer_id ON orders(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_transfer_id ON transactions(stripe_transfer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_payout_id ON transactions(stripe_payout_id);

-- Step 5: Add comments for documentation
COMMENT ON COLUMN merchant_profiles.stripe_account_id IS 'Stripe Connect account ID for this merchant';
COMMENT ON COLUMN merchant_profiles.stripe_charges_enabled IS 'Whether this merchant can accept payments via Stripe';
COMMENT ON COLUMN merchant_profiles.stripe_payouts_enabled IS 'Whether this merchant can receive payouts via Stripe';
COMMENT ON COLUMN merchant_profiles.stripe_details_submitted IS 'Whether this merchant has completed Stripe onboarding';

COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'Stripe PaymentIntent ID for this order';
COMMENT ON COLUMN orders.stripe_customer_id IS 'Stripe Customer ID for this order';

COMMENT ON COLUMN transactions.stripe_transfer_id IS 'Stripe Transfer ID for this transaction';
COMMENT ON COLUMN transactions.stripe_payout_id IS 'Stripe Payout ID for this transaction';

-- Step 6: Verify the migration
DO $$
DECLARE
    merchant_profiles_columns TEXT[];
    orders_columns TEXT[];
    transactions_columns TEXT[];
BEGIN
    -- Check merchant_profiles columns
    SELECT array_agg(column_name) INTO merchant_profiles_columns
    FROM information_schema.columns 
    WHERE table_name = 'merchant_profiles' 
    AND column_name LIKE 'stripe_%';
    
    RAISE NOTICE 'Merchant profiles Stripe columns: %', merchant_profiles_columns;
    
    -- Check orders columns
    SELECT array_agg(column_name) INTO orders_columns
    FROM information_schema.columns 
    WHERE table_name = 'orders' 
    AND column_name LIKE 'stripe_%';
    
    RAISE NOTICE 'Orders Stripe columns: %', orders_columns;
    
    -- Check transactions columns
    SELECT array_agg(column_name) INTO transactions_columns
    FROM information_schema.columns 
    WHERE table_name = 'transactions' 
    AND column_name LIKE 'stripe_%';
    
    RAISE NOTICE 'Transactions Stripe columns: %', transactions_columns;
    
    RAISE NOTICE '✅ Stripe integration migration completed successfully!';
END $$; 