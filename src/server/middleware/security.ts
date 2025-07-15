import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Rate limiting configuration
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'",
        'https://www.googletagmanager.com',
        'https://cdn.mxpnl.com',
        'https://api.mapbox.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'",
        'https://api.mapbox.com',
      ],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:',
        'https://api.mapbox.com',
      ],
      connectSrc: ["'self'",
        'https://api.mapbox.com',
        'https://*.supabase.co',
        'wss://*.supabase.co',
        process.env.VITE_API_URL || '',
        process.env.VITE_WEBSOCKET_URL || '',
      ],
      fontSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", 'data:', 'blob:', 'https:'],
      frameSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for video playback
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Required for external resources
});

// CORS configuration
export const corsOptions = {
  origin: process.env.VITE_ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// File upload configuration
export const fileUploadConfig = {
  limits: {
    fileSize: parseInt(process.env.VITE_MAX_FILE_SIZE || '10485760'), // 10MB in bytes
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
    const allowedTypes = (process.env.VITE_ALLOWED_FILE_TYPES || '')
      .split(',')
      .map(type => type.trim());

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};

// XSS Protection middleware
export function xssProtection(req: Request, res: Response, next: NextFunction) {
  // Clean user input
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key]
          .replace(/[<>]/g, '') // Remove < and >
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/data:/gi, '') // Remove data: protocol
          .trim();
      }
    });
  }
  next();
}

// SQL Injection Protection middleware
export function sqlInjectionProtection(req: Request, res: Response, next: NextFunction) {
  const sqlPattern = /(\b(select|insert|update|delete|drop|union|exec|declare)\b)|(['"])/gi;
  
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string' && sqlPattern.test(value)) {
      return true;
    }
    return false;
  };

  const hasSqlInjection = (obj: any): boolean => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (hasSqlInjection(obj[key])) return true;
      } else if (checkValue(obj[key])) {
        return true;
      }
    }
    return false;
  };

  if (hasSqlInjection(req.query) || hasSqlInjection(req.body)) {
    return res.status(403).json({ error: 'Potential SQL injection detected' });
  }

  next();
}

// Request validation middleware
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  // Validate Content-Type
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({ error: 'Unsupported Media Type' });
    }
  }

  // Validate request size
  const contentLength = parseInt(req.headers['content-length'] || '0');
  if (contentLength > 10485760) { // 10MB
    return res.status(413).json({ error: 'Payload Too Large' });
  }

  next();
} 