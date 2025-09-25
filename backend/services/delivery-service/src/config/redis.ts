import Redis from 'ioredis';
import { logger } from '../utils/logger';
import { config } from './index';

let redis: Redis;

export const connectRedis = async () => {
  try {
    redis = new Redis({
      host: config.redisHost,
      port: config.redisPort,
    });
    
    redis.on('connect', () => {
      logger.info('Connected to Redis');
    });
    
    redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
  } catch (error) {
    logger.error('Redis connection error:', error);
    throw error;
  }
};

export { redis };

