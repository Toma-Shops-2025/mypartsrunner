-- Test Payment System for MyPartsRunner
-- Run this in your Supabase SQL Editor to test the payment system

-- Step 1: Create test users and wallets
DO $$
DECLARE
    test_merchant_id UUID;
    test_driver_id UUID;
    test_customer_id UUID;
    house_wallet_id UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
    -- Create test merchant
    INSERT INTO profiles (id, email, name, role, "firstName", "lastName") 
    VALUES (gen_random_uuid(), 'test-merchant@example.com', 'Test Auto Parts Store', 'merchant', 'Test', 'Merchant')
    RETURNING id INTO test_merchant_id;
    
    -- Create test driver
    INSERT INTO profiles (id, email, name, role, "firstName", "lastName") 
    VALUES (gen_random_uuid(), 'test-driver@example.com', 'Test Driver', 'driver', 'Test', 'Driver')
    RETURNING id INTO test_driver_id;
    
    -- Create test customer
    INSERT INTO profiles (id, email, name, role, "firstName", "lastName") 
    VALUES (gen_random_uuid(), 'test-customer@example.com', 'Test Customer', 'driver', 'Test', 'Customer')
    RETURNING id INTO test_customer_id;
    
    -- Create wallets for test users
    INSERT INTO wallets (user_id, balance) VALUES (test_merchant_id, 0.00);
    INSERT INTO wallets (user_id, balance) VALUES (test_driver_id, 0.00);
    INSERT INTO wallets (user_id, balance) VALUES (test_customer_id, 0.00);
    
    -- Store IDs for later use
    PERFORM set_config('test.merchant_id', test_merchant_id::text, false);
    PERFORM set_config('test.driver_id', test_driver_id::text, false);
    PERFORM set_config('test.customer_id', test_customer_id::text, false);
    
    RAISE NOTICE 'Test users created: Merchant: %, Driver: %, Customer: %', 
        test_merchant_id, test_driver_id, test_customer_id;
END $$;

-- Step 2: Create test order
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
        100.00,  -- Item total (includes merchant's tax)
        20.00,   -- Delivery fee
        5.00,    -- Service fee
        'pending',
        'pending'
    ) RETURNING id INTO test_order_id;
    
    -- Store order ID for later use
    PERFORM set_config('test.order_id', test_order_id::text, false);
    
    RAISE NOTICE 'Test order created: %', test_order_id;
    RAISE NOTICE 'Order details: Item: $100.00, Delivery: $20.00, Service: $5.00';
END $$;

-- Step 3: Test payout calculation (without processing)
DO $$
DECLARE
    test_order_id UUID;
    calc_result RECORD;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    -- View payout calculation
    SELECT * INTO calc_result FROM view_payout_calculation(test_order_id);
    
    RAISE NOTICE 'Payout Calculation Results:';
    RAISE NOTICE 'Merchant Amount: $%', calc_result.merchant_amount;
    RAISE NOTICE 'Driver Amount: $%', calc_result.driver_amount;
    RAISE NOTICE 'House Amount: $%', calc_result.house_amount;
    RAISE NOTICE 'Service Fee Tax: $%', calc_result.service_fee_tax;
    RAISE NOTICE 'Total Payout: $%', calc_result.total_payout;
    RAISE NOTICE 'Order Total: $%', calc_result.order_total;
    
    -- Verify calculations
    IF calc_result.total_payout = calc_result.order_total THEN
        RAISE NOTICE '✅ Calculation verification: PASSED';
    ELSE
        RAISE NOTICE '❌ Calculation verification: FAILED';
    END IF;
    
    -- Expected values based on your specifications
    IF calc_result.merchant_amount = 100.00 THEN
        RAISE NOTICE '✅ Merchant payout: PASSED ($100.00)';
    ELSE
        RAISE NOTICE '❌ Merchant payout: FAILED (Expected: $100.00, Got: $%)', calc_result.merchant_amount;
    END IF;
    
    IF calc_result.driver_amount = 16.00 THEN
        RAISE NOTICE '✅ Driver payout: PASSED ($16.00)';
    ELSE
        RAISE NOTICE '❌ Driver payout: FAILED (Expected: $16.00, Got: $%)', calc_result.driver_amount;
    END IF;
    
    IF calc_result.house_amount = 9.00 THEN
        RAISE NOTICE '✅ House payout: PASSED ($9.00)';
    ELSE
        RAISE NOTICE '❌ House payout: FAILED (Expected: $9.00, Got: $%)', calc_result.house_amount;
    END IF;
END $$;

-- Step 4: Check initial wallet balances
DO $$
DECLARE
    test_merchant_id UUID;
    test_driver_id UUID;
    house_wallet_id UUID := '00000000-0000-0000-0000-000000000000';
    merchant_balance DECIMAL;
    driver_balance DECIMAL;
    house_balance DECIMAL;
BEGIN
    test_merchant_id := current_setting('test.merchant_id')::UUID;
    test_driver_id := current_setting('test.driver_id')::UUID;
    
    -- Get initial balances
    SELECT balance INTO merchant_balance FROM wallets WHERE user_id = test_merchant_id;
    SELECT balance INTO driver_balance FROM wallets WHERE user_id = test_driver_id;
    SELECT balance INTO house_balance FROM wallets WHERE user_id = house_wallet_id;
    
    RAISE NOTICE 'Initial Wallet Balances:';
    RAISE NOTICE 'Merchant: $%', merchant_balance;
    RAISE NOTICE 'Driver: $%', driver_balance;
    RAISE NOTICE 'House: $%', house_balance;
END $$;

-- Step 5: Complete the order to trigger automatic payout
DO $$
DECLARE
    test_order_id UUID;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    -- Update order status to completed (this will trigger the automatic payout)
    UPDATE orders 
    SET status = 'completed',
        completed_at = NOW(),
        updated_at = NOW()
    WHERE id = test_order_id;
    
    RAISE NOTICE 'Order % marked as completed - automatic payout should be triggered', test_order_id;
END $$;

-- Step 6: Verify automatic payout processing
DO $$
DECLARE
    test_order_id UUID;
    test_merchant_id UUID;
    test_driver_id UUID;
    house_wallet_id UUID := '00000000-0000-0000-0000-000000000000';
    merchant_balance DECIMAL;
    driver_balance DECIMAL;
    house_balance DECIMAL;
    transaction_count INTEGER;
    order_payout_status TEXT;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    test_merchant_id := current_setting('test.merchant_id')::UUID;
    test_driver_id := current_setting('test.driver_id')::UUID;
    
    -- Wait a moment for trigger to process
    PERFORM pg_sleep(1);
    
    -- Check final wallet balances
    SELECT balance INTO merchant_balance FROM wallets WHERE user_id = test_merchant_id;
    SELECT balance INTO driver_balance FROM wallets WHERE user_id = test_driver_id;
    SELECT balance INTO house_balance FROM wallets WHERE user_id = house_wallet_id;
    
    -- Check transaction count
    SELECT COUNT(*) INTO transaction_count FROM transactions WHERE order_id = test_order_id;
    
    -- Check order payout status
    SELECT payout_status INTO order_payout_status FROM orders WHERE id = test_order_id;
    
    RAISE NOTICE '=== AUTOMATIC PAYOUT VERIFICATION ===';
    RAISE NOTICE 'Final Wallet Balances:';
    RAISE NOTICE 'Merchant: $% (Expected: $100.00)', merchant_balance;
    RAISE NOTICE 'Driver: $% (Expected: $16.00)', driver_balance;
    RAISE NOTICE 'House: $% (Expected: $9.00)', house_balance;
    RAISE NOTICE 'Transaction Count: % (Expected: 3)', transaction_count;
    RAISE NOTICE 'Order Payout Status: % (Expected: completed)', order_payout_status;
    
    -- Verify results
    IF merchant_balance = 100.00 THEN
        RAISE NOTICE '✅ Merchant payout: PASSED';
    ELSE
        RAISE NOTICE '❌ Merchant payout: FAILED';
    END IF;
    
    IF driver_balance = 16.00 THEN
        RAISE NOTICE '✅ Driver payout: PASSED';
    ELSE
        RAISE NOTICE '❌ Driver payout: FAILED';
    END IF;
    
    IF house_balance = 9.00 THEN
        RAISE NOTICE '✅ House payout: PASSED';
    ELSE
        RAISE NOTICE '❌ House payout: FAILED';
    END IF;
    
    IF transaction_count = 3 THEN
        RAISE NOTICE '✅ Transaction creation: PASSED';
    ELSE
        RAISE NOTICE '❌ Transaction creation: FAILED';
    END IF;
    
    IF order_payout_status = 'completed' THEN
        RAISE NOTICE '✅ Order payout status: PASSED';
    ELSE
        RAISE NOTICE '❌ Order payout status: FAILED';
    END IF;
    
END $$;

-- Step 7: View all transactions for the test order
DO $$
DECLARE
    test_order_id UUID;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    RAISE NOTICE '=== TRANSACTION DETAILS ===';
    RAISE NOTICE 'Order ID: %', test_order_id;
    
    -- Display all transactions
    FOR rec IN 
        SELECT 
            t.role,
            t.amount,
            t.description,
            t.status,
            t.created_at
        FROM transactions t
        WHERE t.order_id = test_order_id
        ORDER BY t.created_at
    LOOP
        RAISE NOTICE 'Role: %, Amount: $%, Status: %, Created: %', 
            rec.role, rec.amount, rec.status, rec.created_at;
        RAISE NOTICE 'Description: %', rec.description;
        RAISE NOTICE '---';
    END LOOP;
END $$;

-- Step 8: Test manual payout trigger
DO $$
DECLARE
    test_order_id UUID;
    result TEXT;
BEGIN
    test_order_id := current_setting('test.order_id')::UUID;
    
    -- Try to manually trigger payout (should fail since already completed)
    SELECT manual_trigger_payout(test_order_id) INTO result;
    
    RAISE NOTICE 'Manual payout trigger result: %', result;
END $$;

-- Step 9: Test user payout summary
DO $$
DECLARE
    test_merchant_id UUID;
    test_driver_id UUID;
    merchant_summary RECORD;
    driver_summary RECORD;
BEGIN
    test_merchant_id := current_setting('test.merchant_id')::UUID;
    test_driver_id := current_setting('test.driver_id')::UUID;
    
    -- Get merchant payout summary
    SELECT * INTO merchant_summary FROM get_user_payout_summary(test_merchant_id, 30);
    
    -- Get driver payout summary
    SELECT * INTO driver_summary FROM get_user_payout_summary(test_driver_id, 30);
    
    RAISE NOTICE '=== USER PAYOUT SUMMARIES ===';
    RAISE NOTICE 'Merchant Summary:';
    RAISE NOTICE '  Total Earnings: $%', merchant_summary.total_earnings;
    RAISE NOTICE '  Total Transactions: %', merchant_summary.total_transactions;
    RAISE NOTICE '  Average Payout: $%', merchant_summary.average_payout;
    RAISE NOTICE '  Last Payout: %', merchant_summary.last_payout_date;
    
    RAISE NOTICE 'Driver Summary:';
    RAISE NOTICE '  Total Earnings: $%', driver_summary.total_earnings;
    RAISE NOTICE '  Total Transactions: %', driver_summary.total_transactions;
    RAISE NOTICE '  Average Payout: $%', driver_summary.average_payout;
    RAISE NOTICE '  Last Payout: %', driver_summary.last_payout_date;
END $$;

-- Step 10: Cleanup test data (optional - comment out if you want to keep test data)
/*
DO $$
DECLARE
    test_merchant_id UUID;
    test_driver_id UUID;
    test_customer_id UUID;
    test_order_id UUID;
BEGIN
    test_merchant_id := current_setting('test.merchant_id')::UUID;
    test_driver_id := current_setting('test.driver_id')::UUID;
    test_customer_id := current_setting('test.customer_id')::UUID;
    test_order_id := current_setting('test.order_id')::UUID;
    
    -- Delete test data
    DELETE FROM transactions WHERE order_id = test_order_id;
    DELETE FROM orders WHERE id = test_order_id;
    DELETE FROM wallets WHERE user_id IN (test_merchant_id, test_driver_id, test_customer_id);
    DELETE FROM profiles WHERE id IN (test_merchant_id, test_driver_id, test_customer_id);
    
    RAISE NOTICE 'Test data cleaned up';
END $$;
*/

-- Final verification
SELECT 'Payment system test completed! Check the NOTICE messages above for results.' as status; 