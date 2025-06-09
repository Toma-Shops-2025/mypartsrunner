import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getAdPrice } from './ad-pricing';

// Initialize Stripe with environment-specific keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface CreateCheckoutParams {
  adId: string;
  userId: string;
  totalAmount: number;
  locationName: string;
  size: string;
  title: string;
  startDate: string;
  endDate: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  try {
    // Calculate number of days
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ad Space: ${params.title}`,
              description: `${params.size} ad in ${params.locationName} for ${days} days`,
            },
            unit_amount: params.totalAmount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ads/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ads/cancel`,
      metadata: {
        ad_id: params.adId,
        user_id: params.userId,
      },
    });

    // Create payment record
    await supabase.from('payments').insert({
      user_id: params.userId,
      ad_id: params.adId,
      stripe_session_id: session.id,
      amount: params.totalAmount,
      status: 'pending',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export async function getPaymentStatus(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      paymentIntentId: session.payment_intent,
    };
  } catch (error: any) {
    console.error('Error getting payment status:', error);
    throw new Error(error.message);
  }
}

export async function createPaymentIntent(amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function createAdPayment(adData: {
  amount: number;
  title: string;
  advertiser_email: string;
}) {
  try {
    // Create a customer
    const customer = await stripe.customers.create({
      email: adData.advertiser_email,
    });

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(adData.amount * 100),
      currency: 'usd',
      customer: customer.id,
      metadata: {
        title: adData.title,
        type: 'advertisement',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
    };
  } catch (error) {
    console.error('Error creating ad payment:', error);
    throw error;
  }
}

export const payments = {
  // Customer payments
  async processDeliveryPayment(amount: number, customerId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: customerId,
        payment_method_types: ['card'],
        capture_method: 'manual', // Only capture after delivery confirmation
        metadata: {
          type: 'delivery_fee'
        }
      });
      return paymentIntent;
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  },

  // Merchant payouts
  async processMerchantPayout(merchantId: string, amount: number) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        destination: merchantId, // Merchant's Stripe Connect account
        metadata: {
          type: 'merchant_payout'
        }
      });
      return transfer;
    } catch (error) {
      console.error('Merchant payout error:', error);
      throw error;
    }
  },

  // Runner payouts
  async processRunnerPayout(runnerId: string, amount: number) {
    try {
      const transfer = await stripe.transfers.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        destination: runnerId, // Runner's Stripe Connect account
        metadata: {
          type: 'runner_payout'
        }
      });
      return transfer;
    } catch (error) {
      console.error('Runner payout error:', error);
      throw error;
    }
  },

  // Refund processing
  async processRefund(paymentIntentId: string, amount?: number) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined,
      });
      return refund;
    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  },

  // Payment method management
  async addPaymentMethod(customerId: string, paymentMethodId: string) {
    try {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      return true;
    } catch (error) {
      console.error('Add payment method error:', error);
      throw error;
    }
  },

  // Account verification
  async verifyConnectedAccount(accountId: string) {
    try {
      const account = await stripe.accounts.retrieve(accountId);
      return {
        verified: account.charges_enabled && account.payouts_enabled,
        requirements: account.requirements,
      };
    } catch (error) {
      console.error('Account verification error:', error);
      throw error;
    }
  }
};

export { stripe }; 