# 🗄️ MyPartsRunner Database Setup Guide

## 📋 **Prerequisites**

- Supabase account (free tier works fine)
- Access to your Supabase project dashboard

## 🚀 **Quick Setup (5 minutes)**

### **Step 1: Access Supabase SQL Editor**

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your MyPartsRunner project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"+ New query"**

### **Step 2: Run the Complete Setup Script**

1. Copy the entire contents of `COMPLETE_DATABASE_SETUP.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** (or press `Ctrl + Enter`)
4. Wait for all queries to complete (~30-60 seconds)

### **Step 3: Verify Setup**

Check that all tables were created:

```sql
-- Run this to see all your tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- ✅ `profiles`
- ✅ `stores`  
- ✅ `products`
- ✅ `orders`
- ✅ `order_items`
- ✅ `cart_items`
- ✅ `favorites`
- ✅ `driver_profiles`
- ✅ `reviews`
- ✅ `notifications`

### **Step 4: Test Profile Creation**

The database will automatically create a profile when users register. Test this by:

1. Going to `mypartsrunner.com/register`
2. Creating a new account
3. Checking the `profiles` table in Supabase

## 🔧 **Environment Variables**

Your app needs these environment variables (check Netlify dashboard):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in: **Supabase Dashboard → Settings → API**

## 🔐 **Row Level Security (RLS)**

✅ **Already Configured!** The setup script includes:

- **Profiles**: Users can only access their own data
- **Orders**: Customers, drivers, and merchants see relevant orders
- **Cart/Favorites**: Private to each user
- **Products/Stores**: Public viewing, restricted editing
- **Driver Profiles**: Public for availability, private for editing

## 🧪 **Testing the Database**

### **Test 1: User Registration**
1. Register at `/register`
2. Check `profiles` table for new entry

### **Test 2: Driver Profile**
1. Register as a driver
2. Go to driver dashboard
3. Check `driver_profiles` table

### **Test 3: Cart Functionality**
1. Add products to cart
2. Check `cart_items` table

## 📊 **Advanced Features**

### **Geolocation Functions**
Find nearby drivers:
```sql
SELECT * FROM find_nearby_drivers(40.7128, -74.0060, 10);
```

### **Order Calculations**
Calculate order totals:
```sql
SELECT calculate_order_total('order-uuid-here');
```

### **Performance Monitoring**
View query performance:
```sql
-- Check active connections
SELECT * FROM pg_stat_activity;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE schemaname = 'public';
```

## 🛠️ **Troubleshooting**

### **Problem: Tables not created**
- **Solution**: Make sure you have the right permissions
- Check: Settings → Database → Connection pooling is enabled

### **Problem: RLS blocking queries**
- **Solution**: Check your policies are correct
- Debug: Temporarily disable RLS to test:
  ```sql
  ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
  ```

### **Problem: Trigger not working**
- **Solution**: Check function exists:
  ```sql
  SELECT routine_name 
  FROM information_schema.routines 
  WHERE routine_type = 'FUNCTION';
  ```

### **Problem: Authentication issues**
- **Solution**: Verify environment variables
- Check: Supabase → Authentication → Settings

## 🔄 **Updates & Migrations**

When you need to update the schema:

1. **Never drop tables in production!**
2. Use `ALTER TABLE` statements
3. Test migrations on a copy first
4. Always backup before major changes

Example migration:
```sql
-- Add new column safely
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS new_field TEXT;

-- Update RLS if needed
DROP POLICY IF EXISTS "policy_name" ON table_name;
CREATE POLICY "new_policy_name" ON table_name 
  FOR SELECT USING (condition);
```

## 🎯 **Production Checklist**

- ✅ All tables created
- ✅ RLS policies active
- ✅ Triggers working
- ✅ Functions tested
- ✅ Indexes created
- ✅ Environment variables set
- ✅ Test user registration/login
- ✅ Test all major features

## 🆘 **Need Help?**

If something goes wrong:

1. **Check Supabase logs**: Dashboard → Logs
2. **Test authentication**: Try the demo login first
3. **Verify environment**: Double-check your API keys
4. **Manual testing**: Use SQL Editor to run test queries

Your database is now **production-ready** with enterprise-level security and performance! 🎉 