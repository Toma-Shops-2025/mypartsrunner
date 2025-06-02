import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  try {
    const {
      adId,
      totalAmount,
      locationName,
      startDate,
      endDate,
      userId,
    } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Advertisement - ${locationName}`,
              description: `From ${startDate} to ${endDate}`,
            },
            unit_amount: Math.round(totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        adId,
        userId,
        startDate,
        endDate,
        locationName,
      },
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/advertiser/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/advertiser/dashboard`,
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { message: 'Error creating checkout session' },
      { status: 500 }
    );
  }
} 