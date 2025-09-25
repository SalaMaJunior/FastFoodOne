import { Express } from 'express';
import { restaurantRoutes } from './restaurant';

export const setupRoutes = (app: Express) => {
  app.use('/api/restaurants', restaurantRoutes);
};

