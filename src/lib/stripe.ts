import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface CreateCheckoutData {
  adId: string;
  totalAmount: number;
  locationName: string;
  startDate: string;
  endDate: string;
}

export const createCheckoutSession = async (data: CreateCheckoutData) => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      throw new Error('User must be logged in');
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        userId: user.data.user.id,
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      throw new Error(session.message || 'Error creating checkout session');
    }

    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 