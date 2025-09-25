import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { config } from './index';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

