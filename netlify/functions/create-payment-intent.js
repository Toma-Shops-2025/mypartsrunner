const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { amount, currency, orderDetails, metadata } = JSON.parse(event.body);

    // Validate required fields
    if (!amount || !orderDetails || !orderDetails.customerId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get merchant's Stripe account ID
    const { data: merchantProfile, error: merchantError } = await supabase
      .from('merchant_profiles')
      .select('stripe_account_id')
      .eq('id', orderDetails.merchantId)
      .single();

    if (merchantError || !merchantProfile?.stripe_account_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: 'Merchant payment setup not complete. Please contact the store.' 
        })
      };
    }

    // Calculate platform fee (MyPartsRunner's cut)
    const platformFeeAmount = Math.round(
      (orderDetails.breakdown.serviceFee + orderDetails.breakdown.deliveryFee * 0.2) * 100
    );

    // Create payment intent with application fee
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Total amount in cents
      currency: currency || 'usd',
      application_fee_amount: platformFeeAmount,
      transfer_data: {
        destination: merchantProfile.stripe_account_id,
      },
      metadata: {
        order_id: `order_${Date.now()}`,
        customer_id: orderDetails.customerId,
        merchant_id: orderDetails.merchantId,
        store_id: orderDetails.storeId,
        subtotal: (orderDetails.breakdown.subtotal * 100).toString(),
        delivery_fee: (orderDetails.breakdown.deliveryFee * 100).toString(),
        service_fee: (orderDetails.breakdown.serviceFee * 100).toString(),
        tax: (orderDetails.breakdown.tax * 100).toString(),
        customer_name: metadata.customerName || '',
        customer_email: metadata.customerEmail || '',
        customer_phone: metadata.customerPhone || '',
        delivery_address: metadata.deliveryAddress || '',
        order_type: metadata.orderType || 'delivery',
        created_at: new Date().toISOString()
      },
      description: `MyPartsRunner Order - ${metadata.customerName}`,
      receipt_email: metadata.customerEmail,
      shipping: {
        name: metadata.customerName,
        address: {
          line1: orderDetails.deliveryAddress.street,
          city: orderDetails.deliveryAddress.city,
          state: orderDetails.deliveryAddress.state,
          postal_code: orderDetails.deliveryAddress.zipCode,
          country: 'US'
        }
      }
    });

    // Create order record in database
    const orderRecord = {
      id: paymentIntent.metadata.order_id,
      customerId: orderDetails.customerId,
      merchantId: orderDetails.merchantId,
      storeId: orderDetails.storeId,
      paymentIntentId: paymentIntent.id,
      status: 'pending_payment',
      paymentStatus: 'pending',
      merchantPaymentStatus: 'pending',
      deliveryPaymentStatus: 'pending',
      paymentMethod: 'stripe',
      itemTotal: orderDetails.breakdown.subtotal,
      deliveryFee: orderDetails.breakdown.deliveryFee,
      serviceFee: orderDetails.breakdown.serviceFee,
      tax: orderDetails.breakdown.tax,
      total: amount / 100,
      deliveryAddress: `${orderDetails.deliveryAddress.street}, ${orderDetails.deliveryAddress.city}, ${orderDetails.deliveryAddress.state} ${orderDetails.deliveryAddress.zipCode}`,
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      customerPhone: metadata.customerPhone,
      items: JSON.stringify(orderDetails.items),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { error: orderError } = await supabase
      .from('orders')
      .insert([orderRecord]);

    if (orderError) {
      console.error('Error creating order record:', orderError);
      // Continue anyway - the payment intent is created
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: paymentIntent.metadata.order_id,
        amount: amount,
        platformFee: platformFeeAmount,
        merchantReceives: amount - platformFeeAmount
      })
    };

  } catch (error) {
    console.error('Payment intent creation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Payment processing failed', 
        details: error.message 
      })
    };
  }
}; 