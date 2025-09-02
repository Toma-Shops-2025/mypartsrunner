const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { orderId } = JSON.parse(event.body);

    if (!orderId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Order ID is required' })
      };
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        stores!inner(merchantId),
        profiles!inner(stripeConnectAccountId)
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Order not found' })
      };
    }

    // Check if order is delivered and ready for payout
    if (order.status !== 'delivered') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Order is not delivered yet' })
      };
    }

    // Calculate payout amounts
    const orderTotal = order.total;
    const deliveryFee = order.deliveryFee || 0;
    const platformFee = orderTotal * 0.15; // 15% platform fee
    const merchantPayout = orderTotal - platformFee;
    const driverPayout = deliveryFee * 0.8; // Driver gets 80% of delivery fee

    // Process merchant payout
    if (merchantPayout > 0 && order.profiles.stripeConnectAccountId) {
      try {
        const transfer = await stripe.transfers.create({
          amount: Math.round(merchantPayout * 100), // Convert to cents
          currency: 'usd',
          destination: order.profiles.stripeConnectAccountId,
          description: `Payout for order ${orderId}`,
          metadata: {
            order_id: orderId,
            type: 'merchant_payout',
            amount: merchantPayout.toString()
          }
        });

        // Update order with payout information
        await supabase
          .from('orders')
          .update({
            merchantPayoutId: transfer.id,
            merchantPayoutAmount: merchantPayout,
            merchantPayoutStatus: 'completed',
            updatedAt: new Date().toISOString()
          })
          .eq('id', orderId);

      } catch (transferError) {
        console.error('Merchant payout failed:', transferError);
        // Continue with driver payout even if merchant payout fails
      }
    }

    // Process driver payout (if driver exists)
    if (order.driverId && driverPayout > 0) {
      try {
        // Get driver's Stripe Connect account
        const { data: driverProfile, error: driverError } = await supabase
          .from('profiles')
          .select('stripeConnectAccountId')
          .eq('id', order.driverId)
          .single();

        if (!driverError && driverProfile?.stripeConnectAccountId) {
          const driverTransfer = await stripe.transfers.create({
            amount: Math.round(driverPayout * 100), // Convert to cents
            currency: 'usd',
            destination: driverProfile.stripeConnectAccountId,
            description: `Delivery fee for order ${orderId}`,
            metadata: {
              order_id: orderId,
              type: 'driver_payout',
              amount: driverPayout.toString()
            }
          });

          // Update order with driver payout information
          await supabase
            .from('orders')
            .update({
              driverPayoutId: driverTransfer.id,
              driverPayoutAmount: driverPayout,
              driverPayoutStatus: 'completed',
              updatedAt: new Date().toISOString()
            })
            .eq('id', orderId);
        }
      } catch (driverTransferError) {
        console.error('Driver payout failed:', driverTransferError);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Payouts processed successfully',
        orderId: orderId,
        merchantPayout: merchantPayout,
        driverPayout: driverPayout
      })
    };

  } catch (error) {
    console.error('Payout processing error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to process payouts',
        details: error.message 
      })
    };
  }
}; 