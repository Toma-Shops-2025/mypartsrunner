# MyPartsRunner™ Deployment Guide

This guide covers deploying the MyPartsRunner application to various platforms and preparing it for Google Play Store submission.

## 🚀 Quick Deployment Options

### 1. Vercel (Recommended for Web)

Vercel provides the easiest deployment experience with automatic builds and deployments.

#### Setup Steps:

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_MAPBOX_TOKEN=your_mapbox_token
     ```

3. **Automatic Deployments**
   - Connect your GitHub repository to Vercel
   - Every push to main branch will trigger automatic deployment

### 2. Netlify

Netlify is another excellent option for static site hosting.

#### Setup Steps:

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add the same environment variables as above

### 3. Firebase Hosting

Firebase provides excellent hosting with CDN and SSL.

#### Setup Steps:

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase**
   ```bash
   firebase init hosting
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 📱 Mobile App Deployment

### 1. PWA (Progressive Web App)

The web app is already PWA-ready. To enhance PWA features:

1. **Update manifest.json**
   ```json
   {
     "name": "MyPartsRunner",
     "short_name": "MyPartsRunner",
     "description": "Auto parts delivery platform",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#000000",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Service Worker**
   - The app includes basic service worker functionality
   - Enhance for offline capabilities

### 2. React Native Conversion

To convert to a native mobile app:

1. **Create React Native Project**
   ```bash
   npx react-native init MyPartsRunnerMobile
   ```

2. **Port Components**
   - Convert React components to React Native
   - Replace HTML elements with React Native components
   - Update navigation to use React Navigation

3. **Platform-Specific Features**
   - Add push notifications
   - Implement location services
   - Add camera functionality for product images

### 3. Capacitor (Recommended)

Capacitor allows you to wrap the web app as a native app.

#### Setup Steps:

1. **Install Capacitor**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init MyPartsRunner com.mypartsrunner.app
   ```

2. **Add Platforms**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

3. **Build and Sync**
   ```bash
   npm run build
   npx cap sync
   ```

4. **Open in Native IDEs**
   ```bash
   npx cap open android  # Opens Android Studio
   npx cap open ios      # Opens Xcode
   ```

## 🏪 Google Play Store Preparation

### 1. Android App Requirements

1. **App Bundle**
   ```bash
   # Generate signed APK/AAB
   cd android
   ./gradlew bundleRelease
   ```

2. **App Signing**
   - Create keystore for app signing
   - Configure signing in `android/app/build.gradle`

3. **Required Assets**
   - App icon (512x512 PNG)
   - Feature graphic (1024x500 PNG)
   - Screenshots (minimum 2)
   - App description
   - Privacy policy URL

### 2. Google Play Console Setup

1. **Create Developer Account**
   - Pay $25 one-time fee
   - Complete account verification

2. **Create App**
   - Package name: `com.mypartsrunner.app`
   - App name: "MyPartsRunner"
   - Category: "Auto & Vehicles"

3. **Content Rating**
   - Complete content rating questionnaire
   - Get appropriate rating (likely 3+)

4. **App Release**
   - Upload AAB file
   - Add release notes
   - Set up staged rollout

### 3. Privacy and Legal

1. **Privacy Policy**
   - Create comprehensive privacy policy
   - Include data collection practices
   - GDPR compliance if targeting EU

2. **Terms of Service**
   - User terms and conditions
   - Service provider agreements
   - Liability limitations

3. **Data Protection**
   - Implement data encryption
   - Secure API communications
   - User data handling procedures

## 🔧 Production Configuration

### 1. Environment Variables

Create `.env.production`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_APP_URL=https://your-domain.com
```

### 2. Supabase Production Setup

1. **Database Optimization**
   ```sql
   -- Add indexes for better performance
   CREATE INDEX CONCURRENTLY idx_orders_status_created ON orders(status, created_at);
   CREATE INDEX CONCURRENTLY idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || description));
   ```

2. **Backup Strategy**
   - Enable automated backups
   - Set up point-in-time recovery
   - Test restore procedures

3. **Monitoring**
   - Set up Supabase dashboard monitoring
   - Configure alerts for errors
   - Monitor database performance

### 3. Performance Optimization

1. **Build Optimization**
   ```bash
   # Analyze bundle size
   npm run build -- --analyze
   
   # Optimize images
   npm install imagemin-webpack-plugin
   ```

2. **Caching Strategy**
   - Implement service worker caching
   - Configure CDN caching headers
   - Use browser caching for static assets

3. **Database Optimization**
   - Optimize queries with proper indexes
   - Implement connection pooling
   - Use read replicas for heavy queries

## 🔒 Security Checklist

### 1. Authentication
- [ ] Enable MFA for admin accounts
- [ ] Implement session management
- [ ] Set up password policies
- [ ] Configure OAuth providers

### 2. Data Protection
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for all communications
- [ ] Implement API rate limiting
- [ ] Set up data backup encryption

### 3. Application Security
- [ ] Input validation and sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection

## 📊 Monitoring and Analytics

### 1. Error Tracking
```bash
# Install Sentry
npm install @sentry/react @sentry/tracing
```

### 2. Analytics
```bash
# Install Google Analytics
npm install gtag
```

### 3. Performance Monitoring
- Set up Core Web Vitals monitoring
- Monitor API response times
- Track user engagement metrics

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain configured

### Post-Deployment
- [ ] Verify all features working
- [ ] Test payment processing
- [ ] Check email notifications
- [ ] Monitor error logs
- [ ] Performance testing

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
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

## 📞 Support and Maintenance

### 1. Monitoring Setup
- Set up uptime monitoring
- Configure error alerting
- Monitor database performance
- Track user analytics

### 2. Backup Strategy
- Daily database backups
- Weekly full system backups
- Test restore procedures monthly
- Store backups in multiple locations

### 3. Update Strategy
- Regular dependency updates
- Security patch management
- Feature release planning
- User communication plan

---

This deployment guide covers the essential steps to get MyPartsRunner™ from development to production, including mobile app preparation for Google Play Store submission. 