# MyPartsRunner™

An on-demand delivery platform for auto parts and hardware stores.

## Features

- Real-time order tracking
- Merchant dashboard
- Runner management
- Secure payments via Stripe
- Live map integration
- Push notifications

## Tech Stack

- React 18
- TypeScript
- Vite
- TanStack Query
- Tailwind CSS
- Mapbox
- Stripe
- WebSocket

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Stripe account
- Mapbox account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mypartsrunner.git
cd mypartsrunner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=your_api_url
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_WS_URL=your_websocket_url
```

4. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Deployment

This project is configured for deployment on Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

## Environment Variables

Required environment variables for deployment:

- `VITE_API_URL`: Backend API URL
- `VITE_STRIPE_PUBLIC_KEY`: Stripe publishable key
- `VITE_MAPBOX_TOKEN`: Mapbox access token
- `VITE_WS_URL`: WebSocket server URL

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── contexts/      # React context providers
  ├── hooks/         # Custom React hooks
  ├── pages/         # Route components
  ├── types/         # TypeScript type definitions
  ├── utils/         # Helper functions
  └── App.tsx        # Root component
```

## License

MIT License - see LICENSE file for details