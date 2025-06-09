import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';
import config from '@/config';
import { logError } from '@/lib/logger';

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: config.security.rateLimiting.windowMs,
  max: config.security.rateLimiting.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = config.integrations.api.allowedOrigins;
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Webhook signature verification
export const verifyWebhookSignature = (secret: string) => {
  return (req: any, res: any, next: any) => {
    const signature = req.headers['x-webhook-signature'];
    if (!signature) {
      logError('Missing webhook signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    const hmac = crypto.createHmac('sha256', secret);
    const calculatedSignature = hmac
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature !== calculatedSignature) {
      logError('Invalid webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    next();
  };
};

// Security headers middleware using helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.mypartsrunner.com'],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
});

// API key rotation
export const rotateApiKey = (userId: string): string => {
  const newKey = crypto.randomBytes(32).toString('hex');
  // TODO: Save the new API key to the database
  // TODO: Set expiration for the old key (give users time to update)
  return newKey;
};

// Request sanitization
export const sanitizeRequest = (req: any, res: any, next: any) => {
  // Remove any potentially dangerous keys
  const sanitize = (obj: any) => {
    const dangerous = ['$where', '$regex', '$gt', '$lt', '__proto__', 'constructor'];
    for (const key in obj) {
      if (dangerous.includes(key)) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

// Export all security middleware
export const security = {
  rateLimiter,
  cors: cors(corsOptions),
  helmet: securityHeaders,
  verifyWebhookSignature,
  sanitizeRequest,
}; 