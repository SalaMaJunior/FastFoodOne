import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Service URLs
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    user: process.env.USER_SERVICE_URL || 'http://localhost:3002',
    restaurant: process.env.RESTAURANT_SERVICE_URL || 'http://localhost:3003',
    order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
    payment: process.env.PAYMENT_SERVICE_URL || 'http://localhost:3005',
    delivery: process.env.DELIVERY_SERVICE_URL || 'http://localhost:3006',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3007',
    ai: process.env.AI_SERVICE_URL || 'http://localhost:3008',
    analytics: process.env.ANALYTICS_SERVICE_URL || 'http://localhost:3009',
  },

  // Database
  database: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fastbite',
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
    },
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },

  // Swagger
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true' || config.nodeEnv === 'development',
    path: process.env.SWAGGER_PATH || '/docs',
  },

  // WebSocket
  websocket: {
    enabled: process.env.WEBSOCKET_ENABLED === 'true' || true,
    port: parseInt(process.env.WEBSOCKET_PORT || '3000', 10),
  },

  // External APIs
  external: {
    googleMaps: {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
      phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY,
    },
  },
};

export default config;

