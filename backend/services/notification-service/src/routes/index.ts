import { Express } from 'express';
import { notificationRoutes } from './notification';

export const setupRoutes = (app: Express) => {
  app.use('/api/notifications', notificationRoutes);
};

