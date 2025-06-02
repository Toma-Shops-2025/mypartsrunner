import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { getAdPrice } from './ad-pricing';

// Initialize Stripe with your secret key
const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16', // Use the latest API version
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface CreateCheckoutParams {
  adId: string;
  userId: string;
  location: string;
  size: string;
  title: string;
  startDate: string;
  endDate: string;
}

export async function createCheckoutSession({
  adId,
  userId,
  location,
  size,
  title,
  startDate,
  endDate,
}: CreateCheckoutParams) {
  try {
    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Get daily rate
    const dailyRate = getAdPrice(location, size);
    const totalAmount = Math.round(dailyRate * days * 100); // Convert to cents

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ad Space: ${title}`,
              description: `${size} ad in ${location} for ${days} days`,
            },
            unit_amount: totalAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ads/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/ads/cancel`,
      metadata: {
        ad_id: adId,
        user_id: userId,
      },
    });

    // Create payment record
    await supabase.from('payments').insert({
      user_id: userId,
      ad_id: adId,
      stripe_session_id: session.id,
      amount: totalAmount / 100, // Convert back to dollars
      currency: 'usd',
    });

    return { sessionId: session.id };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(error.message);
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

export { stripe }; 