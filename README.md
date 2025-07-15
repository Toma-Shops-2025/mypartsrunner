# TomaShops Video First Marketplace

A modern video-first marketplace platform that enables users to buy and sell items through video listings, with features similar to OfferUp.

## Features

- Video-first product listings
- Real-time video feed
- Interactive map view with product locations
- Secure payment processing with Stripe
- Real-time chat and notifications
- Mobile-responsive design
- Social sharing capabilities
- Like/favorite system
- Advanced search and filtering

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Supabase account
- Mapbox account
- Stripe account (for payments)

## Environment Setup

1. Clone the repository
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in the environment variables in `.env` with your credentials:
   - Supabase credentials
   - Mapbox token
   - Stripe keys
   - Firebase config (optional)

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in the `dist` directory

### Deployment Options

1. **Vercel (Recommended)**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy automatically

2. **Netlify**
   - Connect your GitHub repository
   - Configure environment variables
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Manual Deployment**
   - Upload the `dist` directory to your hosting provider
   - Configure your server to serve the static files
   - Set up environment variables

## Security Considerations

1. **API Keys**
   - Never commit `.env` files
   - Use environment variables for sensitive data
   - Restrict API key permissions

2. **File Upload**
   - Maximum file size: 10MB
   - Allowed file types: jpeg, png, gif, mp4, quicktime

3. **User Data**
   - Data encryption at rest
   - Secure session management
   - Rate limiting on API endpoints

## Monitoring and Analytics

1. **Error Tracking**
   - Integration with error tracking services
   - Logging system for debugging

2. **Performance Monitoring**
   - Real-time metrics
   - User engagement analytics
   - System health monitoring

## Support and Maintenance

1. **Regular Updates**
   - Security patches
   - Dependency updates
   - Feature enhancements

2. **Backup Strategy**
   - Regular database backups
   - File storage redundancy
   - Disaster recovery plan

## License

Proprietary - All rights reserved

## Contact

For support or inquiries, please contact support@tomashops.com