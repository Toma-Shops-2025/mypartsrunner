# 🚀 Stripe Integration Setup Guide

## 🎯 Overview

This guide will help you set up Stripe for real money movement in MyPartsRunner. The integration includes:

- **Customer Payments**: Credit card processing via Stripe Elements
- **Merchant Onboarding**: Stripe Connect for merchant accounts
- **Automatic Payouts**: Real-time money distribution to merchants, drivers, and house
- **Webhook Handling**: Real-time payment status updates

## 📋 Prerequisites

1. **Stripe Account**: [Sign up at stripe.com](https://stripe.com)
2. **Domain**: For webhook endpoints (localhost works for development)
3. **Bank Account**: For receiving payouts

## 🔑 Step 1: Get Your Stripe API Keys

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete business verification
3. Choose **Test Mode** for development

### 1.2 Get API Keys
1. In Stripe Dashboard → **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)
4. Keep these secure - never commit them to version control!

## 🌍 Step 2: Environment Setup

### 2.1 Create Environment File
Create a `.env` file in your project root:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_STRIPE_SECRET_KEY=sk_test_your_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2.2 Install Dependencies
The required packages are already installed:
- `stripe` - Server-side Stripe SDK
- `@stripe/stripe-js` - Client-side Stripe SDK
- `@stripe/react-stripe-js` - React components

## 🗄️ Step 3: Database Migration

### 3.1 Run Migration Script
Execute the Stripe migration script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of stripe-integration-migration.sql
```

This adds:
- `stripe_account_id` to merchant profiles
- `stripe_payment_intent_id` to orders
- `stripe_transfer_id` to transactions
- Required indexes and constraints

## 🏪 Step 4: Merchant Onboarding

### 4.1 Enable Stripe Connect
1. In Stripe Dashboard → **Connect** → **Settings**
2. Enable **Express accounts** (recommended for most merchants)
3. Configure your branding and terms

### 4.2 Test Merchant Onboarding
1. Use the `StripeConnectOnboarding` component
2. Create a test merchant account
3. Complete the onboarding flow
4. Verify account activation

## 💳 Step 5: Customer Payment Testing

### 5.1 Test Cards
Use these test cards in development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### 5.2 Test Payment Flow
1. Create a test order
2. Use the `PaymentForm` component
3. Enter test card details
4. Verify payment success

## 🔄 Step 6: Webhook Setup

### 6.1 Development Webhooks
For local development, use [ngrok](https://ngrok.com):

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 3000

# Use the ngrok URL for webhooks
```

### 6.2 Configure Webhook Endpoint
1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set URL to: `https://your-ngrok-url.ngrok.io/api/webhooks/stripe`
4. Select these events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `account.updated`
   - `transfer.created`
   - `payout.paid`

### 6.3 Get Webhook Secret
1. After creating webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add to your `.env` file

## 🧪 Step 7: Testing the Integration

### 7.1 Test Complete Flow
1. **Create test merchant** with Stripe Connect
2. **Place test order** with customer payment
3. **Verify merchant gets paid** immediately
4. **Complete delivery** to trigger driver/house payouts
5. **Check all transactions** are recorded

### 7.2 Test Scenarios
- ✅ Successful payment
- ❌ Failed payment
- 🔄 Refund processing
- 📊 Payout verification

## 🚀 Step 8: Go Live

### 8.1 Production Checklist
- [ ] Switch to **Live mode** in Stripe
- [ ] Update environment variables with live keys
- [ ] Set up production webhook endpoint
- [ ] Test with small amounts first
- [ ] Verify all payout flows work

### 8.2 Live Mode Considerations
- **Real money** - test thoroughly first
- **PCI compliance** - Stripe handles most requirements
- **Fraud protection** - Stripe provides built-in protection
- **Support** - Stripe offers 24/7 support

## 🔒 Security Best Practices

### 8.1 API Key Security
- ✅ Use environment variables
- ✅ Never commit keys to version control
- ✅ Rotate keys regularly
- ✅ Use different keys for test/live

### 8.2 Webhook Security
- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Implement idempotency
- ✅ Log all webhook events

### 8.3 Data Security
- ✅ Don't store raw card data
- ✅ Use Stripe Elements for card input
- ✅ Implement proper error handling
- ✅ Follow PCI compliance guidelines

## 🐛 Troubleshooting

### Common Issues

#### 1. Payment Intent Creation Fails
```bash
# Check these:
- API key configuration
- Amount format (cents vs dollars)
- Stripe account status
- Network connectivity
```

#### 2. Webhook Not Receiving Events
```bash
# Verify:
- Webhook endpoint URL is accessible
- Webhook secret is correct
- Stripe Dashboard shows successful deliveries
- No firewall/network blocking
```

#### 3. Payouts Not Processing
```bash
# Check:
- Merchant account is fully activated
- Bank account is connected
- No account holds or restrictions
- Payout schedule settings
```

#### 4. 3D Secure Issues
```bash
# Test with:
- 3D Secure test cards
- Different browsers
- Mobile vs desktop
- Network conditions
```

## 📱 Frontend Integration

### Components Available
1. **`PaymentForm`** - Customer payment processing
2. **`StripeConnectOnboarding`** - Merchant setup
3. **Stripe Elements** - Secure card input

### Usage Examples
```tsx
// Customer Payment
<PaymentForm
  orderId="order-123"
  amount={125.00}
  currency="usd"
  onSuccess={handlePaymentSuccess}
  onError={handlePaymentError}
/>

// Merchant Onboarding
<StripeConnectOnboarding
  userId="user-123"
  onComplete={handleOnboardingComplete}
/>
```

## 📊 Monitoring & Analytics

### Stripe Dashboard
Monitor these metrics:
- **Payment success rates**
- **Payout success rates**
- **Dispute rates**
- **Revenue analytics**
- **Customer insights**

### Logging
The system logs:
- Payment processing events
- Payout transactions
- Webhook deliveries
- Error conditions

## 🆘 Support Resources

### Stripe Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)

### MyPartsRunner Support
- Check application logs
- Verify environment variables
- Ensure database schema is current
- Test with Stripe test mode first

## 🎯 Next Steps

After completing Stripe integration:

1. **Test thoroughly** with test cards
2. **Monitor webhook delivery** in Stripe Dashboard
3. **Verify payout flows** work correctly
4. **Go live** with small amounts first
5. **Scale up** as you gain confidence

## 🎉 Success Checklist

- [ ] Stripe account created and verified
- [ ] API keys configured in environment
- [ ] Database migration completed
- [ ] Webhook endpoint configured
- [ ] Test payments working
- [ ] Merchant onboarding tested
- [ ] Payout system verified
- [ ] Ready for production

---

**🚀 Congratulations!** You now have a fully integrated Stripe payment system that handles real money movement for your MyPartsRunner application.

**Need help?** Check the logs, verify your configuration, and don't hesitate to reach out to Stripe support for payment-specific issues. 