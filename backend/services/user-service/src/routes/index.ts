import { Express } from 'express';
import { userRoutes } from './user';

export const setupRoutes = (app: Express) => {
  app.use('/api/users', userRoutes);
};

