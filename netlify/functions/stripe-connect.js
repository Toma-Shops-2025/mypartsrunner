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
    const body = JSON.parse(event.body);
    const { action, userId, email, country, accountId } = body;

    switch (action) {
      case 'create_connect_account':
        return await createConnectAccount(userId, email, country);
      case 'check_account_status':
        return await checkAccountStatus(accountId);
      case 'check_account':
        return await checkExistingAccount(userId);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }

  } catch (error) {
    console.error('Stripe Connect function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Function Error: ${error.message}` })
    };
  }
};

// Create a new Stripe Connect account
async function createConnectAccount(userId, email, country = 'US') {
  try {
    // Create the Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        user_id: userId,
        source: 'mypartsrunner',
        created_at: new Date().toISOString()
      }
    });

    // Create onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.URL || 'https://mypartsrunner.com'}/dashboard`,
      return_url: `${process.env.URL || 'https://mypartsrunner.com'}/dashboard`,
      type: 'account_onboarding',
    });

    console.log('Connect account created:', account.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        account_id: account.id,
        onboarding_url: accountLink.url,
        status: 'pending'
      })
    };

  } catch (error) {
    console.error('Error creating Connect account:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to create account: ${error.message}` })
    };
  }
}

// Check the status of a Connect account
async function checkAccountStatus(accountId) {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        account_id: account.id,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted,
        status: account.charges_enabled && account.payouts_enabled ? 'active' : 'pending'
      })
    };

  } catch (error) {
    console.error('Error checking account status:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to check account: ${error.message}` })
    };
  }
}

// Check if user already has a Connect account
async function checkExistingAccount(userId) {
  try {
    // In a real app, you'd store this in your database
    // For now, we'll return a placeholder
    return {
      statusCode: 200,
      body: JSON.stringify({
        account_id: null,
        status: 'none'
      })
    };

  } catch (error) {
    console.error('Error checking existing account:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to check existing account: ${error.message}` })
    };
  }
} 