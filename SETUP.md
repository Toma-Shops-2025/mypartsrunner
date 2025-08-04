# MyPartsRunner™ - Complete Setup Guide

## 🚀 Overview

MyPartsRunner™ is a comprehensive auto parts delivery platform similar to DoorDash, connecting customers with local auto parts stores and delivery drivers. This guide will help you set up the complete application for production deployment.

## 📋 Prerequisites

- **Node.js 18+** and npm
- **Supabase account** (free tier available)
- **Mapbox account** (free tier available)
- **Git** for version control

## 🛠️ Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd MyPartsRunner

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your credentials
nano .env.local
```

**Required Environment Variables:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_access_token
```

### 3. Database Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

2. **Run Database Schema:**
   - Open Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `database-schema.sql`
   - Execute the script

3. **Configure Row Level Security (RLS):**
   - The schema includes RLS policies
   - Enable RLS on all tables in Supabase Dashboard

### 4. Development Server

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Project Structure

```
MyPartsRunner/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts (Auth, Cart)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and services
│   ├── pages/              # Application pages
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets and PWA files
├── database-schema.sql     # Complete database schema
├── README.md              # Project documentation
├── DEPLOYMENT.md          # Deployment instructions
└── SETUP.md              # This file
```

## 🔧 Core Features Implemented

### ✅ Authentication & User Management
- User registration and login
- Role-based access (Customer, Driver, Merchant, Admin)
- Session management
- Profile management

### ✅ Shopping Experience
- Product browsing with search and filters
- Shopping cart functionality
- Secure checkout process
- Order management

### ✅ Database & Backend
- Complete PostgreSQL schema
- Row Level Security (RLS)
- Real-time updates
- Comprehensive API layer

### ✅ PWA & Mobile Ready
- Progressive Web App features
- Offline functionality
- Mobile-responsive design
- App-like experience

## 📱 PWA Features

The application is configured as a Progressive Web App with:

- **Service Worker** for offline functionality
- **Web App Manifest** for app-like experience
- **Install prompts** for mobile devices
- **Offline page** for disconnected users
- **Background sync** for offline actions

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize and deploy
firebase init hosting
firebase deploy
```

### Option 4: Manual Deployment

```bash
# Build for production
npm run build

# Upload dist/ folder to your hosting provider
```

## 📊 Database Schema

The application uses a comprehensive PostgreSQL schema with the following tables:

- **profiles** - User profiles and authentication
- **stores** - Auto parts stores
- **products** - Product catalog
- **orders** - Customer orders
- **order_items** - Order line items
- **cart_items** - Shopping cart
- **driver_profiles** - Driver information
- **merchant_profiles** - Store owner profiles
- **reviews** - Customer reviews
- **notifications** - System notifications

## 🔐 Security Features

- **Row Level Security (RLS)** on all tables
- **JWT authentication** via Supabase Auth
- **Role-based access control**
- **Input validation** and sanitization
- **HTTPS enforcement** in production

## 📱 Mobile App Preparation

The PWA is ready for conversion to native mobile apps:

### Capacitor (Recommended)
```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli

# Initialize Capacitor
npx cap init MyPartsRunner com.mypartsrunner.app

# Add platforms
npx cap add android
npx cap add ios

# Build and sync
npm run build
npx cap sync
```

### React Native
The web components can be converted to React Native using:
- React Native Web
- Expo
- Custom native components

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📈 Analytics & Monitoring

### Google Analytics
Add your GA4 tracking ID to `.env.local`:
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Error Monitoring
Add Sentry DSN for error tracking:
```env
VITE_SENTRY_DSN=https://your-sentry-dsn
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🎯 Google Play Store Preparation

### PWA to TWA (Trusted Web Activity)
1. **Create Android App:**
   ```bash
   npx @bubblewrap/cli init --manifest https://your-domain.com/manifest.json
   ```

2. **Build APK:**
   ```bash
   npx @bubblewrap/cli build
   ```

3. **Sign and Upload:**
   - Sign the APK with your keystore
   - Upload to Google Play Console

### App Store Requirements
- Privacy Policy (implemented)
- Terms of Service (implemented)
- App icons (included)
- Screenshots (create from app)
- App description (provided)

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading:**
   - Ensure `.env.local` is in the root directory
   - Restart the development server

2. **Database Connection Issues:**
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure tables are created

3. **PWA Not Working:**
   - Check service worker registration
   - Verify manifest.json is accessible
   - Test on HTTPS (required for PWA)

4. **Build Errors:**
   - Clear node_modules and reinstall
   - Check TypeScript errors
   - Verify all dependencies are installed

### Support

For issues and questions:
- Check the [README.md](README.md) for detailed documentation
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment-specific issues
- Create an issue in the repository

## 🎉 Next Steps

1. **Customize Branding:**
   - Update colors in `tailwind.config.ts`
   - Replace logos in `public/icons/`
   - Update app name and description

2. **Add Payment Processing:**
   - Integrate Stripe for payments
   - Add payment forms and validation
   - Implement webhook handling

3. **Implement Push Notifications:**
   - Set up VAPID keys
   - Add notification service
   - Configure notification preferences

4. **Add Analytics:**
   - Implement user tracking
   - Add conversion tracking
   - Set up custom events

5. **Scale Infrastructure:**
   - Set up CDN for assets
   - Configure database backups
   - Implement monitoring and alerting

## 📞 Support & Contact

- **Email:** support@mypartsrunner.com
- **Documentation:** [README.md](README.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

**MyPartsRunner™** - Fast delivery of auto parts and hardware supplies 🚗⚡ 