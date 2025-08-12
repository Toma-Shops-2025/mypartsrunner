# 🚀 MyPartsRunner Payment System

## Overview

MyPartsRunner's payment system automatically calculates and distributes payouts when orders are completed. The system handles:

- **Automatic payout calculations** for Merchants, Drivers, and House
- **Real-time wallet balance updates**
- **Comprehensive transaction logging**
- **Tax handling and service fee calculations**
- **Database triggers for instant processing**

## 🏗️ System Architecture

### Core Components

1. **Database Schema** (`payment-system-schema.sql`)
2. **Payment Processor** (`src/lib/payment-processor.ts`)
3. **React Hook** (`src/hooks/use-payouts.ts`)
4. **Payout Dashboard** (`src/components/PayoutDashboard.tsx`)
5. **Order Management** (`src/components/OrderManagement.tsx`)
6. **Automatic Triggers** (`automatic-payout-trigger.sql`)

## 💰 Payment Calculation Logic

### Input Values
- `item_total`: Merchant's price (includes their own sales tax if any)
- `delivery_fee`: App-charged delivery fee
- `service_fee`: App-charged service fee

### Payout Distribution

| Party | Calculation | Example |
|-------|-------------|---------|
| **Merchant** | `item_total` | $100.00 |
| **Driver** | `delivery_fee × 80%` | $16.00 |
| **House** | `(delivery_fee × 20%) + service_fee + tax` | $9.00 |

### Example Calculation
```
Order Total: $125.00
├── Item Total: $100.00 (Merchant)
├── Delivery Fee: $20.00
│   ├── Driver: $16.00 (80%)
│   └── House: $4.00 (20%)
└── Service Fee: $5.00 (House)
    └── Tax: $0.00 (0% rate)
```

## 🗄️ Database Tables

### 1. `orders`
```sql
- id (UUID, PK)
- merchant_id (UUID, FK to profiles)
- driver_id (UUID, FK to profiles)
- customer_id (UUID, FK to profiles)
- item_total (DECIMAL)
- delivery_fee (DECIMAL)
- service_fee (DECIMAL)
- status (TEXT: pending, in_progress, completed, cancelled)
- payout_status (TEXT: pending, processing, completed, failed)
- completed_at (TIMESTAMP)
```

### 2. `wallets`
```sql
- id (UUID, PK)
- user_id (UUID, FK to profiles)
- balance (DECIMAL)
- currency (TEXT, default: USD)
```

### 3. `transactions`
```sql
- id (UUID, PK)
- order_id (UUID, FK to orders)
- recipient_id (UUID, FK to profiles)
- amount (DECIMAL)
- role (TEXT: merchant, driver, house)
- description (TEXT)
- transaction_type (TEXT: payout, refund, adjustment)
- status (TEXT: pending, completed, failed, cancelled)
```

### 4. `payment_settings`
```sql
- key (TEXT, unique)
- value (DECIMAL)
- description (TEXT)
```

## ⚡ Automatic Processing

### Trigger Function
The system uses a PostgreSQL trigger that automatically fires when:
- Order status changes to `'completed'`
- Payout status is `'pending'`

### Process Flow
1. **Fetch order data** and payment settings
2. **Calculate payouts** for all parties
3. **Create transaction records** in database
4. **Update wallet balances** instantly
5. **Mark order as paid out**
6. **Fire completion events** for external integrations

## 🧪 Testing the System

### 1. Run Database Schema
```sql
-- Execute in Supabase SQL Editor
\i payment-system-schema.sql
```

### 2. Run Automatic Trigger
```sql
-- Execute in Supabase SQL Editor
\i automatic-payout-trigger.sql
```

### 3. Test with Sample Data
```sql
-- Execute in Supabase SQL Editor
\i test-payment-system.sql
```

### 4. Frontend Testing
1. Navigate to Dashboard → Payouts tab
2. Use Order Management to create test orders
3. Complete orders to trigger automatic payouts
4. View results in Payout Dashboard

## 🔧 Configuration

### Payment Settings
```sql
-- View current settings
SELECT * FROM payment_settings;

-- Update driver payout percentage
UPDATE payment_settings 
SET value = 0.85 
WHERE key = 'driver_payout_percentage';

-- Update service fee tax rate
UPDATE payment_settings 
SET value = 0.08 
WHERE key = 'tax_rate_service_fee';
```

### Default Values
- `driver_payout_percentage`: 0.80 (80%)
- `tax_rate_service_fee`: 0.00 (0%)
- `house_service_fee_percentage`: 0.25 (25%)
- `minimum_payout_amount`: 5.00 ($5.00)

## 📊 Monitoring & Analytics

### Key Metrics
- **Wallet balances** for all users
- **Transaction history** with detailed logging
- **Payout success rates**
- **Earnings breakdown** by role and time period

### Database Functions
```sql
-- Get user payout summary
SELECT * FROM get_user_payout_summary(user_id, 30);

-- View payout calculation without processing
SELECT * FROM view_payout_calculation(order_id);

-- Manual payout trigger (for testing)
SELECT manual_trigger_payout(order_id);
```

## 🚨 Error Handling

### Common Issues
1. **Insufficient funds**: System prevents negative balances
2. **Calculation mismatches**: Automatic validation ensures accuracy
3. **Failed transactions**: Comprehensive logging for debugging
4. **Duplicate processing**: Prevents double payouts

### Logging
All payout operations are logged with:
- Timestamps
- User IDs
- Amounts
- Success/failure status
- Error messages (if applicable)

## 🔌 Integration Points

### External Payment Processors
The system is designed to integrate with:
- **Stripe Connect** for instant payouts
- **PayPal Payouts** for mass disbursements
- **Bank transfers** for large amounts
- **Webhook notifications** for merchant systems

### Event System
```typescript
// Fire payout completed event
await firePayoutCompletedEvent(orderId, calculations);

// Example webhook payload
{
  "event": "payout.completed",
  "order_id": "uuid",
  "timestamp": "2024-01-01T00:00:00Z",
  "calculations": {
    "merchant_amount": 100.00,
    "driver_amount": 16.00,
    "house_amount": 9.00
  }
}
```

## 🛡️ Security Features

### Row Level Security (RLS)
- Users can only view their own transactions
- Merchants can only manage their own orders
- System functions run with elevated privileges

### Data Validation
- Amount validation (non-negative values)
- Calculation verification (totals must match)
- Status transition validation
- Duplicate processing prevention

## 📱 Frontend Components

### PayoutDashboard
- **Overview**: Quick stats and recent activity
- **Payouts**: Complete transaction history
- **Analytics**: Earnings breakdown and charts
- **Test Mode**: Safe testing without processing

### OrderManagement
- **Create Test Orders**: Simulate real orders
- **Order Status**: Track order lifecycle
- **Manual Completion**: Trigger payouts manually
- **Real-time Updates**: Live status monitoring

## 🚀 Deployment

### 1. Database Setup
```bash
# Run in Supabase SQL Editor
\i payment-system-schema.sql
\i automatic-payout-trigger.sql
```

### 2. Frontend Integration
```bash
# Install dependencies
npm install

# Build and deploy
npm run build
```

### 3. Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🔍 Troubleshooting

### Build Errors
```bash
# Check for missing exports
npm run build

# Verify component imports
grep -r "export.*HelpPage" src/
```

### Database Issues
```sql
-- Check table structure
SELECT * FROM information_schema.columns WHERE table_name = 'orders';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'orders';

-- Test trigger function
SELECT process_automatic_payout();
```

### Payout Failures
1. **Check order status**: Must be 'completed'
2. **Verify payout status**: Must be 'pending'
3. **Review transaction logs**: Check for errors
4. **Validate calculations**: Ensure totals match

## 📈 Future Enhancements

### Planned Features
- **Multi-currency support**
- **Advanced tax calculations**
- **Recurring payouts**
- **Batch processing**
- **Real-time notifications**
- **Advanced analytics dashboard**

### Extensibility
The system is designed to be easily extended with:
- **New payment methods**
- **Custom fee structures**
- **Additional user roles**
- **Complex business rules**

## 📞 Support

For technical support or questions about the payment system:
- **Email**: support@mypartsrunner.com
- **Phone**: (502) 812-2456
- **Documentation**: This README and inline code comments

---

**Built with ❤️ for MyPartsRunner™**

*Last updated: January 2024* 