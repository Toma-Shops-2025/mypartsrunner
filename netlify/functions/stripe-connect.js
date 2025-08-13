const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

// Initialize Supabase
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

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
    const { action, userId, email, country, accountId, businessType } = body;

    switch (action) {
      case 'create_connect_account':
        return await createConnectAccount(userId, email, country, businessType);
      case 'check_account_status':
        return await checkAccountStatus(accountId);
      case 'check_account':
        return await checkExistingAccount(userId);
      case 'get_onboarding_link':
        return await getOnboardingLink(accountId);
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
async function createConnectAccount(userId, email, country = 'US', businessType = 'individual') {
  try {
    // Check if user already has a merchant profile
    const { data: existingProfile, error: profileError } = await supabase
      .from('merchant_profiles')
      .select('*')
      .eq('id', userId) // Use the same ID as profiles table
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(`Database error: ${profileError.message}`);
    }

    // Create the Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      country,
      email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: businessType,
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

    // Update or create merchant profile with Stripe account ID
    if (existingProfile) {
      const { error: updateError } = await supabase
        .from('merchant_profiles')
        .update({ 
          stripe_account_id: account.id,
          stripe_charges_enabled: false,
          stripe_payouts_enabled: false,
          stripe_details_submitted: false,
          updatedat: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating merchant profile:', updateError);
      }
    } else {
      // Create a basic merchant profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('merchant_profiles')
        .insert({
          id: userId, // Use the same ID as profiles table
          stripe_account_id: account.id,
          stripe_charges_enabled: false,
          stripe_payouts_enabled: false,
          stripe_details_submitted: false,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating merchant profile:', insertError);
      }
    }

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
    
    // Update merchant profile with latest status
    const { error: updateError } = await supabase
      .from('merchant_profiles')
      .update({
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_details_submitted: account.details_submitted,
        updatedat: new Date().toISOString()
      })
      .eq('stripe_account_id', accountId);

    if (updateError) {
      console.error('Error updating merchant profile status:', updateError);
    }
    
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
    // Check merchant profile for existing Stripe account
    const { data: profile, error: profileError } = await supabase
      .from('merchant_profiles')
      .select('stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_details_submitted')
      .eq('id', userId) // Use the same ID as profiles table
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw new Error(`Database error: ${profileError.message}`);
    }

    if (profile && profile.stripe_account_id) {
      // Check if account is active
      const status = profile.stripe_charges_enabled && profile.stripe_payouts_enabled ? 'active' : 'pending';
      
      return {
        statusCode: 200,
        body: JSON.stringify({
          account_id: profile.stripe_account_id,
          charges_enabled: profile.stripe_charges_enabled,
          payouts_enabled: profile.stripe_payouts_enabled,
          details_submitted: profile.stripe_details_submitted,
          status: status
        })
      };
    }

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

// Get onboarding link for existing account
async function getOnboardingLink(accountId) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.URL || 'https://mypartsrunner.com'}/dashboard`,
      return_url: `${process.env.URL || 'https://mypartsrunner.com'}/dashboard`,
      type: 'account_onboarding',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        onboarding_url: accountLink.url
      })
    };

  } catch (error) {
    console.error('Error creating onboarding link:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Failed to create onboarding link: ${error.message}` })
    };
  }
} 