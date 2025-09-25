import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
  skip?: (req: Request) => boolean;
  keyGenerator?: (req: Request) => string;
}

class RateLimiter {
  private redis: Redis;
  private configs: Map<string, RateLimitConfig> = new Map();

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    });

    this.initializeConfigs();
  }

  private initializeConfigs(): void {
    // API Gateway rate limits
    this.configs.set('api', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // 100 requests per window
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });

    // Authentication rate limits
    this.configs.set('auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 login attempts per window
      message: 'Too many authentication attempts, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => `auth:${req.ip}:${req.body.email || req.body.phone}`,
    });

    // Password reset rate limits
    this.configs.set('password-reset', {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 3, // 3 password reset attempts per hour
      message: 'Too many password reset attempts, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => `password-reset:${req.body.email}`,
    });

    // OTP rate limits
    this.configs.set('otp', {
      windowMs: 5 * 60 * 1000, // 5 minutes
      max: 3, // 3 OTP requests per 5 minutes
      message: 'Too many OTP requests, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => `otp:${req.body.email || req.body.phone}`,
    });

    // Order creation rate limits
    this.configs.set('order', {
      windowMs: 60 * 1000, // 1 minute
      max: 10, // 10 orders per minute
      message: 'Too many order requests, please slow down.',
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => `order:${req.user?.id || req.ip}`,
    });

    // Search rate limits
    this.configs.set('search', {
      windowMs: 60 * 1000, // 1 minute
      max: 30, // 30 searches per minute
      message: 'Too many search requests, please slow down.',
      standardHeaders: true,
      legacyHeaders: false,
    });

    // File upload rate limits
    this.configs.set('upload', {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 50, // 50 uploads per hour
      message: 'Too many file uploads, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => `upload:${req.user?.id || req.ip}`,
    });
  }

  createLimiter(type: string): rateLimit.RateLimit {
    const config = this.configs.get(type);
    if (!config) {
      throw new Error(`Rate limit configuration for type '${type}' not found`);
    }

    return rateLimit({
      ...config,
      store: new RedisStore({
        client: this.redis,
        prefix: `rl:${type}:`,
      }),
      handler: (req: Request, res: Response) => {
        logger.warn(`Rate limit exceeded for ${type}`, {
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          endpoint: req.path,
          method: req.method,
        });

        res.status(429).json({
          success: false,
          message: config.message,
          retryAfter: Math.round(config.windowMs / 1000),
        });
      },
      skip: (req: Request) => {
        // Skip rate limiting for admin users
        if (req.user && req.user.role === 'admin') {
          return true;
        }
        return config.skip ? config.skip(req) : false;
      },
    });
  }

  // Dynamic rate limiting based on user behavior
  async getDynamicLimit(userId: string, type: string): Promise<number> {
    try {
      const userBehavior = await this.redis.hgetall(`user:behavior:${userId}`);
      const baseLimit = this.configs.get(type)?.max || 100;

      // Adjust limits based on user behavior
      if (userBehavior.trustScore) {
        const trustScore = parseFloat(userBehavior.trustScore);
        return Math.floor(baseLimit * (1 + trustScore));
      }

      return baseLimit;
    } catch (error) {
      logger.error('Error getting dynamic limit:', error);
      return this.configs.get(type)?.max || 100;
    }
  }

  // Track user behavior for dynamic rate limiting
  async trackUserBehavior(userId: string, action: string, success: boolean): Promise<void> {
    try {
      const key = `user:behavior:${userId}`;
      const now = Date.now();

      // Update trust score based on action success
      const trustScoreChange = success ? 0.01 : -0.02;
      await this.redis.hincrbyfloat(key, 'trustScore', trustScoreChange);

      // Track action frequency
      await this.redis.hincrby(key, `action:${action}`, 1);
      await this.redis.hset(key, 'lastAction', now);

      // Set expiration
      await this.redis.expire(key, 7 * 24 * 60 * 60); // 7 days
    } catch (error) {
      logger.error('Error tracking user behavior:', error);
    }
  }

  // Get rate limit status for a user
  async getRateLimitStatus(identifier: string, type: string): Promise<{
    limit: number;
    remaining: number;
    resetTime: number;
  }> {
    try {
      const key = `rl:${type}:${identifier}`;
      const data = await this.redis.hmget(key, 'count', 'resetTime');
      
      const count = parseInt(data[0] || '0');
      const resetTime = parseInt(data[1] || '0');
      const limit = this.configs.get(type)?.max || 100;

      return {
        limit,
        remaining: Math.max(0, limit - count),
        resetTime,
      };
    } catch (error) {
      logger.error('Error getting rate limit status:', error);
      return { limit: 100, remaining: 100, resetTime: Date.now() };
    }
  }

  // Clear rate limit for a user (admin function)
  async clearRateLimit(identifier: string, type: string): Promise<void> {
    try {
      const key = `rl:${type}:${identifier}`;
      await this.redis.del(key);
      logger.info(`Rate limit cleared for ${identifier} on ${type}`);
    } catch (error) {
      logger.error('Error clearing rate limit:', error);
    }
  }
}

// Redis store for rate limiting
class RedisStore implements rateLimit.Store {
  private client: Redis;
  private prefix: string;

  constructor(options: { client: Redis; prefix: string }) {
    this.client = options.client;
    this.prefix = options.prefix;
  }

  async increment(key: string, cb: rateLimit.StoreIncrementCallback): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const resetTime = now + windowMs;

    try {
      const pipeline = this.client.pipeline();
      
      // Increment counter
      pipeline.hincrby(fullKey, 'count', 1);
      
      // Set reset time if first request
      pipeline.hsetnx(fullKey, 'resetTime', resetTime);
      
      // Set expiration
      pipeline.expire(fullKey, Math.ceil(windowMs / 1000));
      
      const results = await pipeline.exec();
      
      if (results) {
        const count = results[0][1] as number;
        const resetTime = results[1][1] as number;
        
        cb(null, count, resetTime);
      } else {
        cb(new Error('Pipeline execution failed'), 0, 0);
      }
    } catch (error) {
      cb(error as Error, 0, 0);
    }
  }

  async decrement(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    await this.client.hincrby(fullKey, 'count', -1);
  }

  async resetKey(key: string): Promise<void> {
    const fullKey = `${this.prefix}${key}`;
    await this.client.del(fullKey);
  }
}

export const rateLimiter = new RateLimiter();

