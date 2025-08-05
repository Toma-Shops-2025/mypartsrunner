# MyPartsRunner - Auto Parts Delivery Platform

MyPartsRunner™ is a comprehensive platform that connects auto parts suppliers, drivers, and customers for efficient delivery of auto parts and hardware supplies.

## 🚀 Features

### For Customers
- **Browse Products**: Search and filter auto parts by category, brand, and price
- **Shopping Cart**: Add items to cart, manage quantities, and view totals
- **Secure Checkout**: Multiple payment options including Stripe, Cash App, Venmo, and cash
- **Order Tracking**: Real-time order status updates and delivery tracking
- **Delivery Management**: Specify delivery address and special instructions
- **Order History**: View past orders and reorder functionality

### For Merchants
- **Store Management**: Create and manage store profiles
- **Product Catalog**: Add, edit, and manage product listings
- **Order Management**: View and process incoming orders
- **Inventory Tracking**: Monitor stock levels and update availability
- **Analytics Dashboard**: View sales reports and performance metrics

### For Drivers
- **Delivery Management**: Accept and manage delivery assignments
- **Real-time Tracking**: Update delivery status and location
- **Earnings Tracking**: Monitor delivery earnings and payment history
- **Route Optimization**: Get optimized delivery routes
- **Availability Control**: Set availability status and working hours

### Platform Features
- **Real-time Notifications**: Instant updates on order status changes
- **Location Services**: Find nearby stores and track deliveries
- **Multi-role Authentication**: Secure role-based access control
- **Responsive Design**: Mobile-optimized interface
- **PWA Ready**: Progressive Web App capabilities

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Maps**: Mapbox GL JS
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Mapbox API key (optional, for maps functionality)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mypartsrunner.git
cd mypartsrunner
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the database schema from `database-schema.sql` in your Supabase SQL editor
3. Update the environment variables with your Supabase credentials

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## 🗄️ Database Schema

The application uses the following main tables:

- **profiles**: User profiles and authentication
- **stores**: Merchant store information
- **products**: Product catalog and inventory
- **orders**: Order management and tracking
- **cart_items**: Shopping cart functionality
- **driver_profiles**: Driver-specific information
- **merchant_profiles**: Merchant-specific information
- **reviews**: Customer reviews and ratings
- **notifications**: Real-time notifications

## 📱 Mobile App Preparation

This web app is designed to be easily converted to a mobile app using:

- **React Native**: Direct code conversion
- **Capacitor**: Web-to-native wrapper
- **PWA**: Progressive Web App features

### PWA Features
- Offline functionality
- Push notifications
- App-like experience
- Install prompts

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your web server
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Enable Row Level Security (RLS)
3. Configure authentication providers
4. Set up storage buckets for images
5. Configure real-time subscriptions

### Mapbox Setup (Optional)

1. Create a Mapbox account
2. Generate an access token
3. Add token to environment variables

## 📊 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🧪 Sample Data

The database schema includes sample data for testing:

- Sample users (admin, merchant, driver, customer)
- Sample store with products
- Sample orders and reviews

## 🔒 Security Features

- Row Level Security (RLS) policies
- Role-based access control
- Secure authentication with Supabase Auth
- Input validation and sanitization
- HTTPS enforcement

## 📈 Performance Optimization

- Lazy loading of components
- Image optimization
- Code splitting
- Caching strategies
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@mypartsrunner.com or join our Slack channel.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ User authentication and profiles
- ✅ Product browsing and cart
- ✅ Order management
- ✅ Basic delivery tracking

### Phase 2 (Next)
- 🔄 Advanced driver app
- 🔄 Real-time delivery tracking
- 🔄 Payment processing integration
- 🔄 Push notifications

### Phase 3 (Future)
- 📋 Mobile app development
- 📋 Advanced analytics
- 📋 AI-powered recommendations
- 📋 Multi-language support

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Vite](https://vitejs.dev) for the build tool

---

**MyPartsRunner™** - Revolutionizing auto parts delivery, one order at a time. 