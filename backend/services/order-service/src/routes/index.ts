import { Express } from 'express';
import { orderRoutes } from './order';

export const setupRoutes = (app: Express) => {
  app.use('/api/orders', orderRoutes);
};

