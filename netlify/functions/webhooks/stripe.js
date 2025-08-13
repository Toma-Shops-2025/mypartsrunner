const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const sig = event.headers['stripe-signature'];
    const payload = event.body;
    const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Webhook secret not configured' })
      };
    }

    if (!sig) {
      console.error('No Stripe signature found');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No signature found' })
      };
    }

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` })
      };
    }

    // Process the webhook event
    console.log('Webhook received:', event.type);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;
      case 'account.updated':
        await handleAccountUpdated(event.data.object);
        break;
      case 'transfer.created':
        await handleTransferCreated(event.data.object);
        break;
      case 'payout.paid':
        await handlePayoutPaid(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true, event_type: event.type })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Webhook Error: ${error.message}` })
    };
  }
};

// Webhook event handlers
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log('Payment intent succeeded:', paymentIntent.id);
    
    // Here you would typically:
    // 1. Update your database
    // 2. Send confirmation emails
    // 3. Trigger other business logic
    
    // For now, just log the event
    console.log('Payment succeeded for:', {
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
      metadata: paymentIntent.metadata
    });
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    console.log('Payment intent failed:', paymentIntent.id);
    
    // Handle failed payment logic here
    console.log('Payment failed for:', {
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
      last_payment_error: paymentIntent.last_payment_error
    });
    
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

async function handleAccountUpdated(account) {
  try {
    console.log('Account updated:', account.id);
    
    // Handle account update logic here
    console.log('Account status:', {
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      details_submitted: account.details_submitted
    });
    
  } catch (error) {
    console.error('Error handling account updated:', error);
  }
}

async function handleTransferCreated(transfer) {
  try {
    console.log('Transfer created:', transfer.id);
    
    // Handle transfer logic here
    console.log('Transfer details:', {
      amount: transfer.amount / 100,
      currency: transfer.currency,
      destination: account.destination,
      metadata: transfer.metadata
    });
    
  } catch (error) {
    console.error('Error handling transfer created:', error);
  }
}

async function handlePayoutPaid(payout) {
  try {
    console.log('Payout paid:', payout.id);
    
    // Handle payout logic here
    console.log('Payout details:', {
      amount: payout.amount / 100,
      currency: payout.currency,
      method: payout.method,
      metadata: payout.metadata
    });
    
  } catch (error) {
    console.error('Error handling payout paid:', error);
  }
} 