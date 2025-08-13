import Stripe from 'stripe';
import { supabase } from './supabase';

// Initialize Stripe
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

// Types for Stripe integration
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface StripeConnectAccount {
  id: string;
  business_type: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  country: string;
}

export interface StripePayout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  arrival_date: number;
}

// Customer Management
export async function createStripeCustomer(
  email: string,
  name?: string,
  phone?: string
): Promise<StripeCustomer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      phone,
      metadata: {
        source: 'mypartsrunner',
        created_at: new Date().toISOString()
      }
    });

    return {
      id: customer.id,
      email: customer.email || '',
      name: customer.name || undefined,
      phone: customer.phone || undefined
    };
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error(`Failed to create Stripe customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getStripeCustomer(customerId: string): Promise<StripeCustomer> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    
    if (customer.deleted) {
      throw new Error('Customer has been deleted');
    }

    return {
      id: customer.id,
      email: customer.email || '',
      name: customer.name || undefined,
      phone: customer.phone || undefined
    };
  } catch (error) {
    console.error('Error retrieving Stripe customer:', error);
    throw new Error(`Failed to retrieve Stripe customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Payment Processing
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  customerId?: string,
  metadata?: Record<string, string>
): Promise<StripePaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      metadata: {
        ...metadata,
        source: 'mypartsrunner',
        created_at: new Date().toISOString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount / 100, // Convert back to dollars
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      client_secret: paymentIntent.client_secret || ''
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function confirmPaymentIntent(
  paymentIntentId: string
): Promise<boolean> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error confirming payment intent:', error);
    return false;
  }
}

// Stripe Connect (Merchant Onboarding)
export async function createConnectAccount(
  email: string,
  country: string = 'US',
  businessType: 'individual' | 'company' = 'individual'
): Promise<StripeConnectAccount> {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      business_type: businessType,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: {
        source: 'mypartsrunner',
        created_at: new Date().toISOString()
      }
    });

    return {
      id: account.id,
      business_type: account.business_type || 'individual',
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      country: account.country || 'US'
    };
  } catch (error) {
    console.error('Error creating Connect account:', error);
    throw new Error(`Failed to create Connect account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getConnectAccount(accountId: string): Promise<StripeConnectAccount> {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    
    return {
      id: account.id,
      business_type: account.business_type || 'individual',
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted,
      country: account.country || 'US'
    };
  } catch (error) {
    console.error('Error retrieving Connect account:', error);
    throw new Error(`Failed to retrieve Connect account: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
): Promise<string> {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return accountLink.url;
  } catch (error) {
    console.error('Error creating account link:', error);
    throw new Error(`Failed to create account link: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Automatic Payouts
export async function processInstantPayout(
  accountId: string,
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<StripePayout> {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      destination: accountId,
      metadata: {
        ...metadata,
        source: 'mypartsrunner',
        created_at: new Date().toISOString()
      }
    });

    return {
      id: transfer.id,
      amount: transfer.amount / 100, // Convert back to dollars
      currency: transfer.currency,
      status: transfer.status,
      arrival_date: transfer.arrival_date || 0
    };
  } catch (error) {
    console.error('Error processing instant payout:', error);
    throw new Error(`Failed to process instant payout: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createScheduledPayout(
  accountId: string,
  amount: number,
  currency: string = 'usd',
  scheduleDate: Date,
  metadata?: Record<string, string>
): Promise<StripePayout> {
  try {
    const payout = await stripe.payouts.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      method: 'instant', // or 'standard' for next business day
      metadata: {
        ...metadata,
        source: 'mypartsrunner',
        created_at: new Date().toISOString(),
        scheduled_for: scheduleDate.toISOString()
      }
    });

    return {
      id: payout.id,
      amount: payout.amount / 100, // Convert back to dollars
      currency: payout.currency,
      status: payout.status,
      arrival_date: payout.arrival_date || 0
    };
  } catch (error) {
    console.error('Error creating scheduled payout:', error);
    throw new Error(`Failed to create scheduled payout: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Webhook Handling
export async function handleWebhook(
  payload: string,
  signature: string,
  webhookSecret: string
): Promise<Stripe.Event> {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    
    // Process the event
    await processWebhookEvent(event);
    
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error(`Webhook signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function processWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    case 'account.updated':
      await handleAccountUpdated(event.data.object as Stripe.Account);
      break;
    case 'transfer.created':
      await handleTransferCreated(event.data.object as Stripe.Transfer);
      break;
    case 'payout.paid':
      await handlePayoutPaid(event.data.object as Stripe.Payout);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  try {
    const orderId = paymentIntent.metadata.order_id;
    if (!orderId) return;

    // Update order payment status
    const { error } = await supabase
      .from('orders')
      .update({
        customer_payment_status: 'paid',
        customer_payment_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order payment status:', error);
    }

    // Process immediate merchant payout
    await processCustomerPayment(orderId, paymentIntent.id);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  try {
    const orderId = paymentIntent.metadata.order_id;
    if (!orderId) return;

    // Update order payment status
    const { error } = await supabase
      .from('orders')
      .update({
        customer_payment_status: 'failed',
        customer_payment_id: paymentIntent.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order payment status:', error);
    }
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

async function handleAccountUpdated(account: Stripe.Account): Promise<void> {
  try {
    // Update merchant profile with Stripe account status
    const { error } = await supabase
      .from('merchant_profiles')
      .update({
        stripe_account_id: account.id,
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_details_submitted: account.details_submitted,
        updated_at: new Date().toISOString()
      })
      .eq('stripe_account_id', account.id);

    if (error) {
      console.error('Error updating merchant profile:', error);
    }
  } catch (error) {
    console.error('Error handling account updated:', error);
  }
}

async function handleTransferCreated(transfer: Stripe.Transfer): Promise<void> {
  try {
    // Update transaction with Stripe transfer ID
    const { error } = await supabase
      .from('transactions')
      .update({
        external_reference: transfer.id,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', transfer.metadata.order_id)
      .eq('role', transfer.metadata.role);

    if (error) {
      console.error('Error updating transaction:', error);
    }
  } catch (error) {
    console.error('Error handling transfer created:', error);
  }
}

async function handlePayoutPaid(payout: Stripe.Payout): Promise<void> {
  try {
    // Update transaction with Stripe payout ID
    const { error } = await supabase
      .from('transactions')
      .update({
        external_reference: payout.id,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('order_id', payout.metadata.order_id)
      .eq('role', payout.metadata.role);

    if (error) {
      console.error('Error updating transaction:', error);
    }
  } catch (error) {
    console.error('Error handling payout paid:', error);
  }
}

// Helper function to process customer payment (called from webhook)
async function processCustomerPayment(orderId: string, stripePaymentId: string): Promise<void> {
  try {
    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error('Order not found');
    }

    // Get merchant profile to find Stripe account
    const { data: merchantProfile, error: merchantError } = await supabase
      .from('merchant_profiles')
      .select('stripe_account_id')
      .eq('user_id', order.storeid)
      .single();

    if (merchantError || !merchantProfile?.stripe_account_id) {
      throw new Error('Merchant Stripe account not found');
    }

    // Process immediate merchant payout
    const payout = await processInstantPayout(
      merchantProfile.stripe_account_id,
      order.item_total,
      'usd',
      {
        order_id: orderId,
        role: 'merchant',
        type: 'immediate_payout'
      }
    );

    // Update order status
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        merchant_payment_status: 'paid',
        merchant_payout_id: payout.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        order_id: orderId,
        recipient_id: order.storeid,
        amount: order.item_total,
        role: 'merchant',
        description: `Immediate payment for order ${orderId} - Item total`,
        transaction_type: 'payout',
        status: 'completed',
        external_reference: payout.id
      });

    if (transactionError) {
      throw new Error(`Failed to create transaction: ${transactionError.message}`);
    }

    console.log(`✅ Immediate merchant payout processed: $${payout.amount} to ${merchantProfile.stripe_account_id}`);
  } catch (error) {
    console.error('Error processing customer payment:', error);
    throw error;
  }
}

// Export the helper function for external use
export { processCustomerPayment }; 