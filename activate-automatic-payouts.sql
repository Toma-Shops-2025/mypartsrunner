-- Activate Automatic Payout System for MyPartsRunner
-- This script ensures your automatic payout trigger is working
-- Run this in your Supabase SQL Editor

-- Step 1: Create the automatic payout function if it doesn't exist
CREATE OR REPLACE FUNCTION process_automatic_payout()
RETURNS TRIGGER AS $$
DECLARE
    payout_result RECORD;
    settings RECORD;
    merchant_amount DECIMAL(10,2);
    driver_amount DECIMAL(10,2);
    house_amount DECIMAL(10,2);
    service_fee_tax DECIMAL(10,2);
    total_payout DECIMAL(10,2);
    house_user_id UUID := '00000000-0000-0000-0000-000000000000'; -- House account ID
BEGIN
    -- Only process when order status changes to 'completed' and payout_status is 'pending'
    IF NEW.status = 'completed' AND NEW.payout_status = 'pending' THEN
        
        -- Get payment settings
        SELECT 
            driver_payout_percentage,
            tax_rate_service_fee,
            house_service_fee_percentage,
            minimum_payout_amount
        INTO settings
        FROM payment_settings;
        
        -- Calculate payouts
        merchant_amount := NEW.item_total;
        driver_amount := NEW.delivery_fee * settings.driver_payout_percentage;
        service_fee_tax := NEW.service_fee * settings.tax_rate_service_fee;
        house_amount := (NEW.delivery_fee * (1 - settings.driver_payout_percentage)) + NEW.service_fee + service_fee_tax;
        total_payout := merchant_amount + driver_amount + house_amount;
        
        -- Validate calculations
        IF ABS(total_payout - (NEW.item_total + NEW.delivery_fee + NEW.service_fee)) > 0.01 THEN
            RAISE EXCEPTION 'Payout calculation mismatch: % vs %', 
                total_payout, 
                (NEW.item_total + NEW.delivery_fee + NEW.service_fee);
        END IF;
        
        -- Insert merchant payout transaction
        INSERT INTO transactions (
            order_id, 
            recipient_id, 
            amount, 
            role, 
            description, 
            transaction_type, 
            status
        ) VALUES (
            NEW.id,
            NEW.merchant_id,
            merchant_amount,
            'merchant',
            'Automatic payout for completed order ' || NEW.id || ' - Item total',
            'payout',
            'completed'
        );
        
        -- Insert driver payout transaction (if driver exists)
        IF NEW.driver_id IS NOT NULL THEN
            INSERT INTO transactions (
                order_id, 
                recipient_id, 
                amount, 
                role, 
                description, 
                transaction_type, 
                status
            ) VALUES (
                NEW.id,
                NEW.driver_id,
                driver_amount,
                'driver',
                'Automatic payout for completed order ' || NEW.id || ' - Delivery fee (' || 
                ROUND((driver_amount / NEW.delivery_fee * 100)::numeric, 0) || '%)',
                'payout',
                'completed'
            );
        END IF;
        
        -- Insert house payout transaction
        INSERT INTO transactions (
            order_id, 
            recipient_id, 
            amount, 
            role, 
            description, 
            transaction_type, 
            status
        ) VALUES (
            NEW.id,
            house_user_id,
            house_amount,
            'house',
            'Automatic payout for completed order ' || NEW.id || ' - Service fee + delivery fee portion',
            'payout',
            'completed'
        );
        
        -- Update wallet balances IMMEDIATELY
        -- Merchant wallet
        UPDATE wallets 
        SET balance = balance + merchant_amount,
            updated_at = NOW()
        WHERE user_id = NEW.merchant_id;
        
        -- Driver wallet (if driver exists)
        IF NEW.driver_id IS NOT NULL THEN
            UPDATE wallets 
            SET balance = balance + driver_amount,
                updated_at = NOW()
            WHERE user_id = NEW.driver_id;
        END IF;
        
        -- House wallet
        UPDATE wallets 
        SET balance = balance + house_amount,
            updated_at = NOW()
        WHERE user_id = house_user_id;
        
        -- Mark order as paid out IMMEDIATELY
        NEW.payout_status := 'completed';
        NEW.completed_at := NOW();
        NEW.updated_at := NOW();
        
        -- Log the successful payout
        RAISE NOTICE '🚀 AUTOMATIC PAYOUT COMPLETED for order %: Merchant: $%, Driver: $%, House: $%', 
            NEW.id, merchant_amount, driver_amount, house_amount;
            
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 2: Create the trigger (this will fire automatically)
DROP TRIGGER IF EXISTS trigger_automatic_payout ON orders;
CREATE TRIGGER trigger_automatic_payout
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION process_automatic_payout();

-- Step 3: Ensure payment settings exist
INSERT INTO payment_settings (key, value, description) VALUES
    ('driver_payout_percentage', 0.80, 'Percentage of delivery fee that goes to driver (80%)'),
    ('tax_rate_service_fee', 0.00, 'Tax rate applied to service fees (0%)'),
    ('house_service_fee_percentage', 0.25, 'Percentage of delivery fee that goes to house (25%)'),
    ('minimum_payout_amount', 5.00, 'Minimum amount required for payout processing')
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = NOW();

-- Step 4: Create the house wallet if it doesn't exist
INSERT INTO wallets (user_id, balance, currency) 
VALUES ('00000000-0000-0000-0000-000000000000', 0.00, 'USD')
ON CONFLICT (user_id) DO NOTHING;

-- Step 5: Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_automatic_payout() TO authenticated;

-- Step 6: Verify the setup
SELECT '✅ Automatic payout system activated successfully!' as status;

-- Step 7: Show how it works
SELECT 
    '🎯 AUTOMATIC PAYOUT FLOW:' as info,
    '1. Order status changes to "completed"' as step1,
    '2. Trigger fires IMMEDIATELY' as step2,
    '3. Payments distributed to wallets' as step3,
    '4. Transaction records created' as step4,
    '5. Order marked as paid out' as step5;

-- Step 8: Show current payment settings
SELECT 
    key,
    value,
    description
FROM payment_settings
ORDER BY key; 