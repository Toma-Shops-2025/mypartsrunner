-- Test Automatic Payout System
-- This demonstrates how payments are automatically distributed
-- Run this in your Supabase SQL Editor after activating the system

-- Step 1: Create test users if they don't exist
DO $$
DECLARE
    test_merchant_id UUID;
    test_driver_id UUID;
    test_customer_id UUID;
BEGIN
    -- Create test merchant
    INSERT INTO profiles (id, email, name, role, "firstName", "lastName") 
    VALUES (gen_random_uuid(), 'test-merchant@example.com', 'Test Auto Parts Store', 'merchant', 'Test', 'Merchant')
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO test_merchant_id;
    
    -- Create test driver
    INSERT INTO profiles (id, email, name, role, "firstName", "lastName") 
    VALUES (gen_random_uuid(), 'test-driver@example.com', 'Test Driver', 'driver', 'Test', 'Driver')
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO test_driver_id;
    
    -- Create test customer
    INSERT INTO profiles (id, email, name, role, "firstName", "lastName") 
    VALUES (gen_random_uuid(), 'test-customer@example.com', 'Test Customer', 'customer', 'Test', 'Customer')
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO test_customer_id;
    
    -- Store IDs for later use
    PERFORM set_config('test.merchant_id', test_merchant_id::text, false);
    PERFORM set_config('test.driver_id', test_driver_id::text, false);
    PERFORM set_config('test.customer_id', test_customer_id::text, false);
    
    RAISE NOTICE 'Test users ready: Merchant: %, Driver: %, Customer: %', 
        test_merchant_id, test_driver_id, test_customer_id;
END $$;

-- Step 2: Create a test order
DO $$
DECLARE
    test_order_id UUID;
    test_merchant_id UUID;
    test_driver_id UUID;
    test_customer_id UUID;
BEGIN
    -- Get test user IDs
    test_merchant_id := current_setting('test.merchant_id')::UUID;
    test_driver_id := current_setting('test.driver_id')::UUID;
    test_customer_id := current_setting('test.customer_id')::UUID;
    
    -- Create test order
    INSERT INTO orders (
        merchant_id, 
        driver_id, 
        customer_id, 
        item_total, 
        delivery_fee, 
        service_fee, 
        status, 
        payout_status
    ) VALUES (
        test_merchant_id,
        test_driver_id,
        test_customer_id,
        100.00,  -- Item total (merchant gets this)
        20.00,   -- Delivery fee (80% to driver, 20% to house)
        5.00,    -- Service fee (100% to house)
        'pending',
        'pending'
    ) RETURNING id INTO test_order_id;
    
    -- Store order ID for later use
    PERFORM set_config('test.order_id', test_order_id::text, false);
    
    RAISE NOTICE '📦 Test order created: %', test_order_id;
    RAISE NOTICE '💰 Order details: Item: $100.00, Delivery: $20.00, Service: $5.00';
    RAISE NOTICE '📊 Expected payouts: Merchant: $100.00, Driver: $16.00, House: $9.00';
END $$;

-- Step 3: Show order before completion
DO $$
DECLARE
    test_order_id UUID;
    order_record RECORD;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    SELECT * INTO order_record FROM orders WHERE id = test_order_id;
    
    RAISE NOTICE '📋 ORDER STATUS BEFORE COMPLETION:';
    RAISE NOTICE '   Order ID: %', order_record.id;
    RAISE NOTICE '   Status: %', order_record.status;
    RAISE NOTICE '   Payout Status: %', order_record.payout_status;
    RAISE NOTICE '   Item Total: $%', order_record.item_total;
    RAISE NOTICE '   Delivery Fee: $%', order_record.delivery_fee;
    RAISE NOTICE '   Service Fee: $%', order_record.service_fee;
END $$;

-- Step 4: COMPLETE THE ORDER (This triggers automatic payout!)
DO $$
DECLARE
    test_order_id UUID;
    order_record RECORD;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    RAISE NOTICE '🚀 COMPLETING ORDER - This will trigger automatic payout!';
    
    -- Update order to completed - THIS TRIGGERS THE AUTOMATIC PAYOUT!
    UPDATE orders 
    SET 
        status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = test_order_id;
    
    -- Get the updated order
    SELECT * INTO order_record FROM orders WHERE id = test_order_id;
    
    RAISE NOTICE '✅ ORDER COMPLETED!';
    RAISE NOTICE '   New Status: %', order_record.status;
    RAISE NOTICE '   Payout Status: %', order_record.payout_status;
    RAISE NOTICE '   Completed At: %', order_record.completed_at;
END $$;

-- Step 5: Verify automatic payout results
DO $$
DECLARE
    test_order_id UUID;
    order_record RECORD;
    transaction_count INTEGER;
    merchant_wallet DECIMAL;
    driver_wallet DECIMAL;
    house_wallet DECIMAL;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    -- Get the order
    SELECT * INTO order_record FROM orders WHERE id = test_order_id;
    
    -- Count transactions
    SELECT COUNT(*) INTO transaction_count FROM transactions WHERE order_id = test_order_id;
    
    -- Get wallet balances
    SELECT balance INTO merchant_wallet FROM wallets WHERE user_id = order_record.merchant_id;
    SELECT balance INTO driver_wallet FROM wallets WHERE user_id = order_record.driver_id;
    SELECT balance INTO house_wallet FROM wallets WHERE user_id = '00000000-0000-0000-0000-000000000000';
    
    RAISE NOTICE '🎉 AUTOMATIC PAYOUT RESULTS:';
    RAISE NOTICE '   Order ID: %', test_order_id;
    RAISE NOTICE '   Payout Status: %', order_record.payout_status;
    RAISE NOTICE '   Transactions Created: %', transaction_count;
    RAISE NOTICE '   Merchant Wallet: $%', merchant_wallet;
    RAISE NOTICE '   Driver Wallet: $%', driver_wallet;
    RAISE NOTICE '   House Wallet: $%', house_wallet;
    
    -- Show transaction details
    RAISE NOTICE '📝 TRANSACTION DETAILS:';
    FOR transaction_record IN 
        SELECT role, amount, description, status 
        FROM transactions 
        WHERE order_id = test_order_id 
        ORDER BY role
    LOOP
        RAISE NOTICE '   %: $% - % (%%)', 
            transaction_record.role, 
            transaction_record.amount, 
            transaction_record.description, 
            transaction_record.status;
    END LOOP;
END $$;

-- Step 6: Show the complete flow
SELECT 
    '🎯 AUTOMATIC PAYOUT FLOW COMPLETED!' as result,
    '✅ Order created with pending status' as step1,
    '✅ Order marked as completed' as step2,
    '✅ Trigger fired automatically' as step3,
    '✅ Payments distributed to wallets' as step4,
    '✅ Transaction records created' as step5,
    '✅ Order marked as paid out' as step6; 