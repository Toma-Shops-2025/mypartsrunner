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
    const { paymentIntentId, orderDetails } = JSON.parse(event.body);

    if (!paymentIntentId || !orderDetails) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get payment intent details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment not successful' })
      };
    }

    const orderId = paymentIntent.metadata.order_id;

    // 1. MERCHANT PAYOUT (Immediate - already handled by transfer_data in payment intent)
    // The merchant automatically receives: subtotal + tax
    const merchantAmount = orderDetails.breakdown.subtotal + orderDetails.breakdown.tax;
    
    // Update order status to show merchant has been paid
    await supabase
      .from('orders')
      .update({
        status: 'confirmed',
        paymentStatus: 'completed',
        merchantPaymentStatus: 'completed',
        updatedAt: new Date().toISOString()
      })
      .eq('paymentIntentId', paymentIntentId);

    // Record merchant transaction
    await supabase
      .from('transactions')
      .insert([{
        recipient_id: orderDetails.merchantId,
        amount: merchantAmount,
        type: 'order_payment',
        status: 'completed',
        description: `Order payment for ${orderId}`,
        metadata: JSON.stringify({
          orderId: orderId,
          paymentIntentId: paymentIntentId,
          breakdown: {
            subtotal: orderDetails.breakdown.subtotal,
            tax: orderDetails.breakdown.tax
          }
        }),
        created_at: new Date().toISOString()
      }]);

    // 2. DELIVERY FEE ALLOCATION (Held for driver assignment)
    // This will be paid out when delivery is completed
    const deliveryFee = orderDetails.breakdown.deliveryFee;
    const driverShare = deliveryFee * 0.8; // 80% to driver
    const houseDeliveryShare = deliveryFee * 0.2; // 20% to house

    // 3. SERVICE FEE (Goes to house immediately)
    const serviceFee = orderDetails.breakdown.serviceFee;
    
    // Record pending delivery transactions (will be completed when delivery finishes)
    await supabase
      .from('pending_payouts')
      .insert([
        {
          order_id: orderId,
          recipient_type: 'driver',
          amount: driverShare,
          type: 'delivery_fee',
          description: `Delivery fee for order ${orderId}`,
          status: 'pending_delivery',
          created_at: new Date().toISOString()
        },
        {
          order_id: orderId,
          recipient_type: 'house',
          amount: houseDeliveryShare + serviceFee,
          type: 'service_fee',
          description: `Service fee + delivery portion for order ${orderId}`,
          status: 'pending_delivery',
          created_at: new Date().toISOString()
        }
      ]);

    // Send notifications
    await Promise.all([
      sendMerchantNotification(orderDetails.merchantId, orderId, merchantAmount),
      sendOrderConfirmationNotification(paymentIntent.metadata.customer_id, orderId)
    ]);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        orderId: orderId,
        payouts: {
          merchant: {
            amount: merchantAmount,
            status: 'completed',
            description: 'Immediate payment via Stripe Connect'
          },
          driver: {
            amount: driverShare,
            status: 'pending_delivery',
            description: 'Will be paid upon delivery completion'
          },
          house: {
            amount: houseDeliveryShare + serviceFee,
            status: 'pending_delivery',
            description: 'Service fee + delivery portion'
          }
        }
      })
    };

  } catch (error) {
    console.error('Payout processing error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Payout processing failed', 
        details: error.message 
      })
    };
  }
};

async function sendMerchantNotification(merchantId, orderId, amount) {
  try {
    // In a real app, this would send email/SMS/push notification
    console.log(`Merchant ${merchantId} received $${amount} for order ${orderId}`);
    
    // You could integrate with email service here
    // await sendEmail({
    //   to: merchant.email,
    //   subject: 'New Order - Payment Received',
    //   template: 'merchant-order-notification',
    //   data: { orderId, amount }
    // });
    
  } catch (error) {
    console.error('Error sending merchant notification:', error);
  }
}

async function sendOrderConfirmationNotification(customerId, orderId) {
  try {
    // In a real app, this would send order confirmation to customer
    console.log(`Order confirmation sent to customer ${customerId} for order ${orderId}`);
    
    // You could integrate with email service here
    // await sendEmail({
    //   to: customer.email,
    //   subject: 'Order Confirmed - Fast Delivery Coming!',
    //   template: 'customer-order-confirmation',
    //   data: { orderId }
    // });
    
  } catch (error) {
    console.error('Error sending customer notification:', error);
  }
} 