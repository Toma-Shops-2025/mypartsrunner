import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body || '',
      sig,
      webhookSecret
    );

    // Handle the event
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Add your payment success logic here
        break;
      
      case 'checkout.session.completed':
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        console.log('Checkout completed:', session.id);
        // Add your checkout completion logic here
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('Webhook error:', err);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
}; 