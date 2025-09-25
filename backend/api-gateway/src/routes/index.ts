import { Express } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config';
import { authMiddleware, optionalAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

export const setupRoutes = (app: Express): void => {
  // Health check route
  app.get('/health', require('../middleware/healthCheck').healthCheck);

  // API Documentation
  app.get('/docs', (req, res) => {
    res.redirect('/docs/');
  });

  // Authentication routes (no auth required)
  app.use('/api/auth', createProxyMiddleware({
    target: config.services.auth,
    changeOrigin: true,
    pathRewrite: {
      '^/api/auth': '/auth',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Authentication service unavailable',
        error: err.message,
      });
    },
  }));

  // User routes (auth required)
  app.use('/api/users', authMiddleware, createProxyMiddleware({
    target: config.services.user,
    changeOrigin: true,
    pathRewrite: {
      '^/api/users': '/users',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'User service unavailable',
        error: err.message,
      });
    },
  }));

  // Restaurant routes (optional auth for public data)
  app.use('/api/restaurants', optionalAuth, createProxyMiddleware({
    target: config.services.restaurant,
    changeOrigin: true,
    pathRewrite: {
      '^/api/restaurants': '/restaurants',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Restaurant service unavailable',
        error: err.message,
      });
    },
  }));

  // Menu routes (optional auth for public data)
  app.use('/api/menu', optionalAuth, createProxyMiddleware({
    target: config.services.restaurant,
    changeOrigin: true,
    pathRewrite: {
      '^/api/menu': '/menu',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Menu service unavailable',
        error: err.message,
      });
    },
  }));

  // Order routes (auth required)
  app.use('/api/orders', authMiddleware, createProxyMiddleware({
    target: config.services.order,
    changeOrigin: true,
    pathRewrite: {
      '^/api/orders': '/orders',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Order service unavailable',
        error: err.message,
      });
    },
  }));

  // Payment routes (auth required)
  app.use('/api/payments', authMiddleware, createProxyMiddleware({
    target: config.services.payment,
    changeOrigin: true,
    pathRewrite: {
      '^/api/payments': '/payments',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Payment service unavailable',
        error: err.message,
      });
    },
  }));

  // Delivery routes (auth required)
  app.use('/api/delivery', authMiddleware, createProxyMiddleware({
    target: config.services.delivery,
    changeOrigin: true,
    pathRewrite: {
      '^/api/delivery': '/delivery',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Delivery service unavailable',
        error: err.message,
      });
    },
  }));

  // AI routes (auth required)
  app.use('/api/ai', authMiddleware, createProxyMiddleware({
    target: config.services.ai,
    changeOrigin: true,
    pathRewrite: {
      '^/api/ai': '/ai',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'AI service unavailable',
        error: err.message,
      });
    },
  }));

  // Analytics routes (auth required)
  app.use('/api/analytics', authMiddleware, createProxyMiddleware({
    target: config.services.analytics,
    changeOrigin: true,
    pathRewrite: {
      '^/api/analytics': '/analytics',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Analytics service unavailable',
        error: err.message,
      });
    },
  }));

  // Notification routes (auth required)
  app.use('/api/notifications', authMiddleware, createProxyMiddleware({
    target: config.services.notification,
    changeOrigin: true,
    pathRewrite: {
      '^/api/notifications': '/notifications',
    },
    onError: (err, req, res) => {
      res.status(500).json({
        success: false,
        message: 'Notification service unavailable',
        error: err.message,
      });
    },
  }));

  // WebSocket endpoint for real-time features
  app.get('/ws', (req, res) => {
    res.json({
      success: true,
      message: 'WebSocket endpoint available',
      url: `ws://${req.get('host')}/socket.io/`,
    });
  });
};

