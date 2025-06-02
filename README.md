# TomaShops Advertising System

A comprehensive advertising system for TomaShops, allowing businesses to purchase and manage ad spaces across the platform.

## Features

- Multiple ad space locations (sidebar, header, footer, content)
- Various size options (small, medium, large)
- Dynamic pricing based on location and size
- Real-time analytics (views, clicks, CTR)
- Secure payment processing with Stripe
- Admin dashboard for ad management
- Advertiser dashboard for campaign monitoring

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_BASE_URL=https://tomashops.com
```

## Deployment Steps

1. Install dependencies:
```bash
npm install
```

2. Run database migrations:
```bash
npx supabase db push
```

3. Build the application:
```bash
npm run build
```

4. Start the production server:
```bash
npm start
```

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Install the Stripe CLI for local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
4. Update your Stripe webhook endpoint in production to:
```
https://tomashops.com/api/stripe/webhook
```

## Security Considerations

- All sensitive data is stored securely in Supabase with Row Level Security (RLS)
- Stripe handles all payment information, no credit card data is stored on our servers
- API keys and secrets are stored as environment variables
- All user actions require authentication
- Admin actions are protected by role-based access control

## Monitoring

Monitor your application using:
- Supabase Dashboard for database and authentication
- Stripe Dashboard for payments and subscriptions
- Vercel Analytics for application performance (if deployed on Vercel)

## Support

For support, please contact:
- Technical issues: [Create an issue](https://github.com/tomashops/advertising/issues)
- Billing questions: billing@tomashops.com
- General inquiries: support@tomashops.com