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
    const { userId, accountType } = JSON.parse(event.body);

    if (!userId || !accountType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID and account type are required' })
      };
    }

    // Create Stripe Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: userId, // This will be updated with actual email
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: accountType === 'driver' ? 'individual' : 'company',
      metadata: {
        userId: userId,
        accountType: accountType,
        source: 'mypartsrunner'
      }
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.URL || 'https://mypartsrunner.com'}/dashboard`,
      return_url: `${process.env.URL || 'https://mypartsrunner.com'}/dashboard`,
      type: 'account_onboarding',
    });

    // Update user profile with Stripe Connect account ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripeConnectAccountId: account.id,
        stripeConnectStatus: 'pending',
        updatedAt: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      // Don't fail the entire process if profile update fails
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        accountId: account.id,
        accountLink: accountLink.url,
        status: 'pending'
      })
    };

  } catch (error) {
    console.error('Stripe Connect account creation error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to create Stripe Connect account',
        details: error.message 
      })
    };
  }
}; 