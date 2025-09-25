import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthCheck } from './middleware/healthCheck';
import { setupRoutes } from './routes';
import { logger } from './utils/logger';
import { config } from './config';
import { connectDatabase } from './config/database';
import { connectRedis } from './config/redis';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
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

// Health check
app.use('/health', healthCheck);

// Routes
setupRoutes(app);

// Socket.IO for real-time tracking
io.on('connection', (socket) => {
  logger.info(`Driver connected: ${socket.id}`);

  socket.on('driver-location-update', (data) => {
    socket.broadcast.emit('location-update', data);
  });

  socket.on('delivery-status-update', (data) => {
    socket.broadcast.emit('delivery-update', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Driver disconnected: ${socket.id}`);
  });
});

// Global error handler
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const startServer = async () => {
  try {
    await connectDatabase();
    await connectRedis();
    
    const PORT = config.port;
    server.listen(PORT, () => {
      logger.info(`Delivery Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { io };