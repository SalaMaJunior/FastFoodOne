import { Express } from 'express';
import authRoutes from './auth';

export const setupRoutes = (app: Express): void => {
  app.use('/api/auth', authRoutes);
};

