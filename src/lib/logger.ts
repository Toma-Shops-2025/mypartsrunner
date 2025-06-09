import winston from 'winston';
import config from '@/config';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = config.app.environment;
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Tell winston that we want to link the colors
winston.addColors(colors);

// Define the format for logs
const format = winston.format.combine(
  // Add timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // Add colors
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports the logger must use to print out messages
const transports = [
  // Print to console
  new winston.transports.Console(),
  // Print all error logs to error.log
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
  }),
  // Print all logs to combined.log
  new winston.transports.File({ filename: 'logs/combined.log' }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Middleware to log HTTP requests
export const httpLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });
  next();
};

// Error logging middleware
export const errorLogger = (err: any, req: any, res: any, next: any) => {
  logger.error('Error:', {
    error: {
      message: err.message,
      stack: err.stack,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
    },
  });
  next(err);
};

// Create convenience methods
export const logError = (message: string, error?: any) => {
  logger.error(message, error);
};

export const logWarning = (message: string, data?: any) => {
  logger.warn(message, data);
};

export const logInfo = (message: string, data?: any) => {
  logger.info(message, data);
};

export const logDebug = (message: string, data?: any) => {
  logger.debug(message, data);
};

// Export the logger instance
export default logger; 