import { Express } from 'express';
import { deliveryRoutes } from './delivery';

export const setupRoutes = (app: Express) => {
  app.use('/api/delivery', deliveryRoutes);
};

