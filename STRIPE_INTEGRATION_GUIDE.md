# 🚀 Stripe Integration Guide for MyPartsRunner

This guide will walk you through setting up Stripe for real money movement in your MyPartsRunner application.

## 📋 Prerequisites

1. **Stripe Account**: You need a Stripe account (free to create)
2. **Domain**: A live domain for webhook endpoints (localhost works for development)
3. **Bank Account**: For receiving payouts

## 🔑 Step 1: Get Your Stripe API Keys

### 1.1 Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and sign up
- Complete your business verification
- Switch to "Live" mode when ready (or stay in "Test" mode for development)

### 1.2 Get Your API Keys
- In your Stripe Dashboard, go to **Developers** → **API keys**
- Copy your **Publishable key** and **Secret key**
- For webhooks, you'll also need a **Webhook signing secret**

## 🌍 Step 2: Environment Configuration

Create a `.env` file in your project root with these variables:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your publishable key
VITE_STRIPE_SECRET_KEY=sk_test_...      # Your secret key (server-side only)
VITE_STRIPE_WEBHOOK_SECRET=whsec_...    # Your webhook secret
```

**⚠️ Important**: Never expose your secret key in client-side code!

## 🔧 Step 3: Database Schema Updates

The payment system requires these additional tables. Run the migration script:

```sql
-- Add Stripe-related columns to merchant_profiles
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS stripe_charges_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS stripe_payouts_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE merchant_profiles ADD COLUMN IF NOT EXISTS stripe_details_submitted BOOLEAN DEFAULT FALSE;

-- Add Stripe-related columns to orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Add Stripe-related columns to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS stripe_transfer_id TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS stripe_payout_id TEXT;
```

## 🏪 Step 4: Merchant Onboarding

### 4.1 Merchant Stripe Connect Setup
Merchants need to complete Stripe Connect onboarding:

1. **Create Connect Account**: The system automatically creates a Stripe Connect account
2. **Complete Onboarding**: Merchants fill out business information
3. **Verify Identity**: Upload required documents
4. **Connect Bank Account**: For receiving payouts

### 4.2 Onboarding Flow
```typescript
// 1. Create Connect account
const account = await createConnectAccount(email, 'US', 'individual');

// 2. Generate onboarding link
const link = await createAccountLink(account.id, refreshUrl, returnUrl);

// 3. Redirect merchant to complete setup
window.location.href = link;
```

## 💳 Step 5: Customer Payment Processing

### 5.1 Payment Flow
1. **Customer places order** → Creates payment intent
2. **Payment processed** → Stripe charges customer
3. **Merchant paid immediately** → Via Stripe Connect transfer
4. **Driver/House paid on delivery** → Via automatic payouts

### 5.2 Payment Form Integration
```tsx
import PaymentForm from './components/PaymentForm';

<PaymentForm
  orderId="order-123"
  amount={125.00}
  currency="usd"
  onSuccess={(paymentIntentId) => {
    console.log('Payment successful:', paymentIntentId);
  }}
  onError={(error) => {
    console.error('Payment failed:', error);
  }}
/>
```

## 🔄 Step 6: Webhook Setup

### 6.1 Webhook Endpoint
Create a webhook endpoint in your backend:

```typescript
// POST /api/webhooks/stripe
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const payload = req.body;
  
  try {
    const event = await handleWebhook(payload, sig, webhookSecret);
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

### 6.2 Required Webhook Events
Configure these events in your Stripe Dashboard:

- `payment_intent.succeeded` - Customer payment successful
- `payment_intent.payment_failed` - Customer payment failed
- `account.updated` - Merchant account status changes
- `transfer.created` - Payout to merchant successful
- `payout.paid` - Driver/House payout successful

### 6.3 Webhook URL
- **Development**: Use [ngrok](https://ngrok.com) to expose localhost
- **Production**: Your live domain (e.g., `https://yourapp.com/api/webhooks/stripe`)

## 💰 Step 7: Payout System

### 7.1 Automatic Payouts
The system automatically handles payouts:

```typescript
// Merchant gets paid immediately on customer payment
await processInstantPayout(merchantAccountId, itemTotal, 'usd', {
  order_id: orderId,
  role: 'merchant',
  type: 'immediate_payout'
});

// Driver and House get paid on delivery completion
await processInstantPayout(driverAccountId, driverAmount, 'usd', {
  order_id: orderId,
  role: 'driver',
  type: 'delivery_payout'
});
```

### 7.2 Payout Schedule
- **Merchant**: Immediate (same day as customer payment)
- **Driver**: On delivery completion
- **House**: On delivery completion

## 🧪 Step 8: Testing

### 8.1 Test Cards
Use Stripe's test cards for development:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### 8.2 Test Mode vs Live Mode
- **Test Mode**: No real money, perfect for development
- **Live Mode**: Real money, real customers

## 🚀 Step 9: Go Live

### 9.1 Production Checklist
- [ ] Switch to Live mode in Stripe Dashboard
- [ ] Update environment variables with live keys
- [ ] Set up production webhook endpoint
- [ ] Test with small amounts first
- [ ] Verify all payout flows work correctly

### 9.2 Monitoring
Monitor these metrics in Stripe Dashboard:
- Payment success rates
- Payout success rates
- Dispute rates
- Revenue analytics

## 🔒 Security Best Practices

### 9.1 API Key Security
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Use different keys for test/live

### 9.2 Webhook Security
- Always verify webhook signatures
- Use HTTPS in production
- Implement idempotency
- Log all webhook events

### 9.3 PCI Compliance
- Stripe handles most PCI compliance
- Don't store raw card data
- Use Stripe Elements for card input
- Implement proper error handling

## 📱 Frontend Integration

### 9.1 Payment Form
The `PaymentForm` component handles:
- Stripe Elements integration
- Payment processing
- Success/error states
- Loading states

### 9.2 Merchant Dashboard
The `StripeConnectOnboarding` component handles:
- Stripe Connect setup
- Account status monitoring
- Onboarding flow

## 🐛 Troubleshooting

### Common Issues

#### 1. Payment Intent Creation Fails
- Check API key configuration
- Verify amount format (cents vs dollars)
- Check Stripe account status

#### 2. Webhook Not Receiving Events
- Verify webhook endpoint URL
- Check webhook secret
- Ensure endpoint is accessible
- Check Stripe Dashboard for failed deliveries

#### 3. Payouts Not Processing
- Verify merchant account is fully activated
- Check payout schedule settings
- Verify bank account is connected
- Check for account holds or restrictions

#### 4. 3D Secure Issues
- Test with 3D Secure test cards
- Verify 3D Secure is enabled in Stripe
- Check browser compatibility

## 📞 Support

### Stripe Support
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- [Stripe Community](https://community.stripe.com)

### MyPartsRunner Support
- Check the logs for detailed error messages
- Verify all environment variables are set
- Ensure database schema is up to date
- Test with Stripe's test mode first

## 🎯 Next Steps

After completing Stripe integration:

1. **Test thoroughly** with test cards
2. **Monitor webhook delivery** in Stripe Dashboard
3. **Verify payout flows** work correctly
4. **Go live** with small amounts first
5. **Scale up** as you gain confidence

---

**🎉 Congratulations!** You now have a fully integrated Stripe payment system that handles real money movement for your MyPartsRunner application. 