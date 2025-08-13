import { NextApiRequest, NextApiResponse } from 'next';
import { handleWebhook } from '../../../lib/stripe';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sig = req.headers['stripe-signature'] as string;
    const payload = req.body;
    const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    if (!sig) {
      console.error('No Stripe signature found');
      return res.status(400).json({ error: 'No signature found' });
    }

    // Process the webhook
    const event = await handleWebhook(payload, sig, webhookSecret);
    
    console.log('Webhook processed successfully:', event.type);
    
    res.json({ received: true, event_type: event.type });
  } catch (error) {
    console.error('Webhook error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: `Webhook Error: ${errorMessage}` });
  }
}

// Configure body parser for raw body (required for webhook signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
}; 