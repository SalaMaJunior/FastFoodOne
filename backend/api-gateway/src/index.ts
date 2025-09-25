import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthCheck } from './middleware/healthCheck';
import { setupRoutes } from './routes';
import { logger } from './utils/logger';
import { config } from './config';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const PORT = config.port || 3000;

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(requestLogger);

// Health check endpoint
app.get('/health', healthCheck);

// API Documentation
if (config.swagger.enabled) {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'FastBite Food Delivery API',
        version: '1.0.0',
        description: 'Comprehensive API for FastBite Food Delivery Platform',
        contact: {
          name: 'FastBite Team',
          email: 'api-support@fastbite.com',
        },
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server',
        },
        {
          url: 'https://api.fastbite.com',
          description: 'Production server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./src/routes/*.ts', './src/middleware/*.ts'],
  };

  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use(config.swagger.path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// Setup API routes
setupRoutes(app);

// WebSocket connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  // Join user-specific room for personalized updates
  socket.on('join-user-room', (userId: string) => {
    socket.join(`user-${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  // Join order-specific room for order tracking
  socket.on('join-order-room', (orderId: string) => {
    socket.join(`order-${orderId}`);
    logger.info(`Client joined order room: ${orderId}`);
  });

  // Handle order status updates
  socket.on('order-status-update', (data: { orderId: string; status: string; message: string }) => {
    io.to(`order-${data.orderId}`).emit('order-update', data);
    logger.info(`Order status update broadcasted: ${data.orderId} - ${data.status}`);
  });

  // Handle delivery tracking updates
  socket.on('delivery-update', (data: { orderId: string; location: any; estimatedArrival: string }) => {
    io.to(`order-${data.orderId}`).emit('delivery-tracking', data);
    logger.info(`Delivery update broadcasted: ${data.orderId}`);
  });

  // Handle notifications
  socket.on('send-notification', (data: { userId: string; notification: any }) => {
    io.to(`user-${data.userId}`).emit('notification', data.notification);
    logger.info(`Notification sent to user: ${data.userId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Global error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 FastBite API Gateway running on port ${PORT}`);
  logger.info(`📚 API Documentation available at http://localhost:${PORT}${config.swagger.path}`);
  logger.info(`🏥 Health check available at http://localhost:${PORT}/health`);
  logger.info(`🔌 WebSocket server running on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

export default app;

