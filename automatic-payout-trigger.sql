-- Automatic Payout Processing Trigger for MyPartsRunner
-- Run this in your Supabase SQL Editor

-- Create the payout processing function
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
        
        -- Update wallet balances
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
        
        -- Mark order as paid out
        NEW.payout_status := 'completed';
        NEW.updated_at := NOW();
        
        -- Log the successful payout
        RAISE NOTICE 'Automatic payout processed for order %: Merchant: $%, Driver: $%, House: $%', 
            NEW.id, merchant_amount, driver_amount, house_amount;
            
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER trigger_automatic_payout
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION process_automatic_payout();

-- Create a function to manually trigger payouts (for testing or manual processing)
CREATE OR REPLACE FUNCTION manual_trigger_payout(order_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    order_record RECORD;
    result TEXT;
BEGIN
    -- Get the order
    SELECT * INTO order_record FROM orders WHERE id = order_uuid;
    
    IF NOT FOUND THEN
        RETURN 'Order not found';
    END IF;
    
    IF order_record.status != 'completed' THEN
        RETURN 'Order is not completed. Current status: ' || order_record.status;
    END IF;
    
    IF order_record.payout_status = 'completed' THEN
        RETURN 'Order already paid out';
    END IF;
    
    -- Manually trigger the payout by updating the order
    UPDATE orders 
    SET payout_status = 'pending',
        updated_at = NOW()
    WHERE id = order_uuid;
    
    -- The trigger will automatically process the payout
    RETURN 'Manual payout trigger successful for order ' || order_uuid;
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'Error triggering payout: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to view payout calculations without processing
CREATE OR REPLACE FUNCTION view_payout_calculation(order_uuid UUID)
RETURNS TABLE(
    merchant_amount DECIMAL(10,2),
    driver_amount DECIMAL(10,2),
    house_amount DECIMAL(10,2),
    service_fee_tax DECIMAL(10,2),
    total_payout DECIMAL(10,2),
    order_total DECIMAL(10,2)
) AS $$
DECLARE
    order_record RECORD;
    settings RECORD;
    merchant_amount DECIMAL(10,2);
    driver_amount DECIMAL(10,2);
    house_amount DECIMAL(10,2);
    service_fee_tax DECIMAL(10,2);
    total_payout DECIMAL(10,2);
BEGIN
    -- Get the order
    SELECT * INTO order_record FROM orders WHERE id = order_uuid;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    -- Get payment settings
    SELECT 
        driver_payout_percentage,
        tax_rate_service_fee,
        house_service_fee_percentage,
        minimum_payout_amount
    INTO settings
    FROM payment_settings;
    
    -- Calculate payouts
    merchant_amount := order_record.item_total;
    driver_amount := order_record.delivery_fee * settings.driver_payout_percentage;
    service_fee_tax := order_record.service_fee * settings.tax_rate_service_fee;
    house_amount := (order_record.delivery_fee * (1 - settings.driver_payout_percentage)) + 
                   order_record.service_fee + service_fee_tax;
    total_payout := merchant_amount + driver_amount + house_amount;
    
    RETURN QUERY SELECT
        merchant_amount,
        driver_amount,
        house_amount,
        service_fee_tax,
        total_payout,
        (order_record.item_total + order_record.delivery_fee + order_record.service_fee) as order_total;
        
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get payout summary for a user
CREATE OR REPLACE FUNCTION get_user_payout_summary(user_uuid UUID, period_days INTEGER DEFAULT 30)
RETURNS TABLE(
    total_earnings DECIMAL(10,2),
    total_transactions INTEGER,
    average_payout DECIMAL(10,2),
    last_payout_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(t.amount), 0) as total_earnings,
        COUNT(t.id) as total_transactions,
        CASE 
            WHEN COUNT(t.id) > 0 THEN COALESCE(SUM(t.amount), 0) / COUNT(t.id)
            ELSE 0 
        END as average_payout,
        MAX(t.created_at) as last_payout_date
    FROM transactions t
    WHERE t.recipient_id = user_uuid
      AND t.transaction_type = 'payout'
      AND t.status = 'completed'
      AND t.created_at >= NOW() - INTERVAL '1 day' * period_days;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION process_automatic_payout() TO authenticated;
GRANT EXECUTE ON FUNCTION manual_trigger_payout(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION view_payout_calculation(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_payout_summary(UUID, INTEGER) TO authenticated;

-- Create the house wallet if it doesn't exist
INSERT INTO wallets (user_id, balance, currency) 
VALUES ('00000000-0000-0000-0000-000000000000', 0.00, 'USD')
ON CONFLICT (user_id) DO NOTHING;

-- Verify the setup
SELECT 'Automatic payout trigger created successfully!' as status; 