interface Config {
  stripe: {
    publicKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  maps: {
    mapboxToken: string;
    defaultStyle: string;
    defaultZoom: number;
    defaultCenter: {
      lat: number;
      lng: number;
    };
  };
  socket: {
    serverUrl: string;
    options: {
      reconnectionDelay: number;
      reconnectionDelayMax: number;
      timeout: number;
    };
  };
  api: {
    baseUrl: string;
    version: string;
    timeout: number;
  };
  app: {
    name: string;
    environment: string;
    debug: boolean;
    version: string;
  };
  services: {
    maxDeliveryRadius: number; // in miles
    defaultDeliveryFee: number;
    minimumOrderAmount: number;
    maxConcurrentDeliveries: number;
    autoAcceptOrders: boolean;
  };
  notifications: {
    email: {
      enabled: boolean;
      fromAddress: string;
      provider: string;
    };
    sms: {
      enabled: boolean;
      provider: string;
    };
    push: {
      enabled: boolean;
      vapidPublicKey: string;
      vapidPrivateKey: string;
    };
  };
  security: {
    jwtSecret: string;
    jwtExpiresIn: string;
    bcryptRounds: number;
    rateLimiting: {
      windowMs: number;
      maxRequests: number;
    };
  };
  integrations: {
    api: {
      allowedOrigins: string[];
      rateLimits: {
        windowMs: number;
        maxRequests: number;
      };
    };
  };
}

const config: Config = {
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY!,
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!
  },
  maps: {
    mapboxToken: process.env.MAPBOX_ACCESS_TOKEN!,
    defaultStyle: 'mapbox://styles/mapbox/streets-v12',
    defaultZoom: 12,
    defaultCenter: {
      lat: 39.8283, // Default to center of US
      lng: -98.5795
    }
  },
  socket: {
    serverUrl: process.env.SOCKET_SERVER_URL || 'wss://api.mypartsrunner.com',
    options: {
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000
    }
  },
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://api.mypartsrunner.com',
    version: 'v1',
    timeout: 30000
  },
  app: {
    name: 'MyPartsRunner',
    environment: process.env.NODE_ENV || 'development',
    debug: process.env.NODE_ENV !== 'production',
    version: '1.0.0'
  },
  services: {
    maxDeliveryRadius: 50,
    defaultDeliveryFee: 8.99,
    minimumOrderAmount: 0,
    maxConcurrentDeliveries: 3,
    autoAcceptOrders: false
  },
  notifications: {
    email: {
      enabled: true,
      fromAddress: 'notifications@mypartsrunner.com',
      provider: 'sendgrid'
    },
    sms: {
      enabled: true,
      provider: 'twilio'
    },
    push: {
      enabled: true,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY!,
      vapidPrivateKey: process.env.VAPID_PRIVATE_KEY!
    }
  },
  security: {
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: '7d',
    bcryptRounds: 10,
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100
    }
  },
  integrations: {
    api: {
      allowedOrigins: process.env.API_ALLOWED_ORIGINS?.split(',') || ['*'],
      rateLimits: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 100
      }
    }
  }
};

// Validate required environment variables
const requiredEnvVars = [
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'MAPBOX_ACCESS_TOKEN',
  'JWT_SECRET',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export default config; 