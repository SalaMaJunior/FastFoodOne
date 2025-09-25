import { Express } from 'express';
import { paymentRoutes } from './payment';

export const setupRoutes = (app: Express) => {
  app.use('/api/payments', paymentRoutes);
};

