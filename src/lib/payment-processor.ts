import { supabase } from './supabase';

// Types for the payment system
export interface Order {
  id: string;
  merchant_id: string;
  driver_id: string;
  customer_id: string;
  item_total: number;
  delivery_fee: number;
  service_fee: number;
  status: string;
  completed_at?: string;
  payout_status: string;
}

export interface PaymentSettings {
  driver_payout_percentage: number;
  tax_rate_service_fee: number;
  house_service_fee_percentage: number;
  minimum_payout_amount: number;
}

export interface PayoutCalculation {
  merchant_amount: number;
  driver_amount: number;
  house_amount: number;
  service_fee_tax: number;
  total_payout: number;
}

export interface Transaction {
  order_id: string;
  recipient_id: string;
  amount: number;
  role: 'merchant' | 'driver' | 'house';
  description: string;
  transaction_type: 'payout' | 'refund' | 'adjustment';
  status: string;
  external_reference?: string;
}

export interface PayoutResult {
  success: boolean;
  order_id: string;
  calculations: PayoutCalculation;
  transactions: Transaction[];
  error?: string;
}

/**
 * Calculate payouts for a completed order
 */
export function calculatePayouts(
  order: Order,
  settings: PaymentSettings
): PayoutCalculation {
  const { item_total, delivery_fee, service_fee } = order;
  const { driver_payout_percentage, tax_rate_service_fee } = settings;

  // Merchant gets the full item total (includes their own tax if any)
  const merchant_amount = item_total;

  // Driver gets percentage of delivery fee
  const driver_amount = delivery_fee * driver_payout_percentage;

  // House gets remaining delivery fee + service fee + service fee tax
  const house_delivery_portion = delivery_fee * (1 - driver_payout_percentage);
  const service_fee_tax = service_fee * tax_rate_service_fee;
  const house_amount = house_delivery_portion + service_fee + service_fee_tax;

  // Total payout verification
  const total_payout = merchant_amount + driver_amount + house_amount;
  const order_total = item_total + delivery_fee + service_fee;

  // Validate calculations
  if (Math.abs(total_payout - order_total) > 0.01) {
    throw new Error(`Payout calculation mismatch: ${total_payout} vs ${order_total}`);
  }

  return {
    merchant_amount: Number(merchant_amount.toFixed(2)),
    driver_amount: Number(driver_amount.toFixed(2)),
    house_amount: Number(house_amount.toFixed(2)),
    service_fee_tax: Number(service_fee_tax.toFixed(2)),
    total_payout: Number(total_payout.toFixed(2))
  };
}

/**
 * Fetch payment settings from database
 */
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const { data, error } = await supabase
    .from('payment_settings')
    .select('key, value');

  if (error) {
    throw new Error(`Failed to fetch payment settings: ${error.message}`);
  }

  const settings: PaymentSettings = {
    driver_payout_percentage: 0.80,
    tax_rate_service_fee: 0.00,
    house_service_fee_percentage: 0.25,
    minimum_payout_amount: 5.00
  };

  // Override defaults with database values
  data?.forEach(setting => {
    switch (setting.key) {
      case 'driver_payout_percentage':
        settings.driver_payout_percentage = Number(setting.value);
        break;
      case 'tax_rate_service_fee':
        settings.tax_rate_service_fee = Number(setting.value);
        break;
      case 'house_service_fee_percentage':
        settings.house_service_fee_percentage = Number(setting.value);
        break;
      case 'minimum_payout_amount':
        settings.minimum_payout_amount = Number(setting.value);
        break;
    }
  });

  return settings;
}

/**
 * Create transaction records for payouts
 */
export function createTransactionRecords(
  order: Order,
  calculations: PayoutCalculation
): Transaction[] {
  const transactions: Transaction[] = [
    {
      order_id: order.id,
      recipient_id: order.merchant_id,
      amount: calculations.merchant_amount,
      role: 'merchant',
      description: `Payout for order ${order.id} - Item total`,
      transaction_type: 'payout',
      status: 'pending'
    },
    {
      order_id: order.id,
      recipient_id: order.driver_id,
      amount: calculations.driver_amount,
      role: 'driver',
      description: `Payout for order ${order.id} - Delivery fee (${(calculations.driver_amount / order.delivery_fee * 100).toFixed(0)}%)`,
      transaction_type: 'payout',
      status: 'pending'
    },
    {
      order_id: order.id,
      recipient_id: '00000000-0000-0000-0000-000000000000', // House account ID
      amount: calculations.house_amount,
      role: 'house',
      description: `Payout for order ${order.id} - Service fee + delivery fee portion`,
      transaction_type: 'payout',
      status: 'pending'
    }
  ];

  return transactions;
}

/**
 * Update wallet balances for all recipients
 */
export async function updateWalletBalances(
  transactions: Transaction[]
): Promise<void> {
  for (const transaction of transactions) {
    const { data: wallet, error: fetchError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', transaction.recipient_id)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch wallet for user ${transaction.recipient_id}: ${fetchError.message}`);
    }

    const newBalance = Number(wallet.balance) + transaction.amount;

    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', transaction.recipient_id);

    if (updateError) {
      throw new Error(`Failed to update wallet for user ${transaction.recipient_id}: ${updateError.message}`);
    }
  }
}

/**
 * Insert transaction records into database
 */
export async function insertTransactions(
  transactions: Transaction[]
): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .insert(transactions);

  if (error) {
    throw new Error(`Failed to insert transactions: ${error.message}`);
  }
}

/**
 * Mark order as paid out
 */
export async function markOrderAsPaidOut(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ 
      payout_status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (error) {
    throw new Error(`Failed to mark order as paid out: ${error.message}`);
  }
}

/**
 * Main payout processing function
 */
export async function processPayout(orderId: string): Promise<PayoutResult> {
  try {
    // 1. Fetch order data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .eq('status', 'completed')
      .eq('payout_status', 'pending')
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found or not eligible for payout: ${orderError?.message || 'Order not found'}`);
    }

    // 2. Fetch payment settings
    const settings = await getPaymentSettings();

    // 3. Calculate payouts
    const calculations = calculatePayouts(order, settings);

    // 4. Create transaction records
    const transactions = createTransactionRecords(order, calculations);

    // 5. Insert transactions
    await insertTransactions(transactions);

    // 6. Update wallet balances
    await updateWalletBalances(transactions);

    // 7. Mark order as paid out
    await markOrderAsPaidOut(orderId);

    // 8. Fire payout.completed event (for external integrations)
    await firePayoutCompletedEvent(orderId, calculations);

    return {
      success: true,
      order_id: orderId,
      calculations,
      transactions
    };

  } catch (error) {
    console.error('Payout processing failed:', error);
    return {
      success: false,
      order_id: orderId,
      calculations: {
        merchant_amount: 0,
        driver_amount: 0,
        house_amount: 0,
        service_fee_tax: 0,
        total_payout: 0
      },
      transactions: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fire payout completed event for external integrations
 */
async function firePayoutCompletedEvent(
  orderId: string,
  calculations: PayoutCalculation
): Promise<void> {
  // This would integrate with your event system (e.g., webhooks, message queues)
  // For now, we'll log it and could extend to call external APIs
  
  console.log('Payout completed event fired:', {
    order_id: orderId,
    timestamp: new Date().toISOString(),
    calculations
  });

  // Example: Call Stripe Connect API for instant payouts
  // await processInstantPayouts(orderId, calculations);
  
  // Example: Send webhook to merchant's system
  // await sendWebhookToMerchant(orderId, calculations);
}

/**
 * Test payout calculation without database updates
 */
export async function testPayoutCalculation(orderId: string): Promise<PayoutResult> {
  try {
    // Fetch order data
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order not found: ${orderError?.message || 'Order not found'}`);
    }

    // Fetch payment settings
    const settings = await getPaymentSettings();

    // Calculate payouts
    const calculations = calculatePayouts(order, settings);

    // Create transaction records (but don't insert)
    const transactions = createTransactionRecords(order, calculations);

    return {
      success: true,
      order_id: orderId,
      calculations,
      transactions
    };

  } catch (error) {
    console.error('Test payout calculation failed:', error);
    return {
      success: false,
      order_id: orderId,
      calculations: {
        merchant_amount: 0,
        driver_amount: 0,
        house_amount: 0,
        service_fee_tax: 0,
        total_payout: 0
      },
      transactions: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get payout history for a user
 */
export async function getUserPayoutHistory(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('recipient_id', userId)
    .eq('transaction_type', 'payout')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch payout history: ${error.message}`);
  }

  return data || [];
}

/**
 * Get wallet balance for a user
 */
export async function getUserWalletBalance(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch wallet balance: ${error.message}`);
  }

  return Number(data.balance);
} 