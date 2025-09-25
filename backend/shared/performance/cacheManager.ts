import Redis from 'ioredis';
import { logger } from '../utils/logger';

interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix: string;
  serialize?: boolean;
}

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  namespace?: string;
}

class CacheManager {
  private redis: Redis;
  private defaultTTL: number = 300; // 5 minutes
  private keyPrefix: string = 'fastbite:';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryDelayOnFailover: 100,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
    });
  }

  // Basic cache operations
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(this.buildKey(key));
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch {
        return value as T;
      }
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<boolean> {
    try {
      const ttl = options.ttl || this.defaultTTL;
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      
      await this.redis.setex(this.buildKey(key), ttl, serializedValue);
      
      // Add to tags if provided
      if (options.tags && options.tags.length > 0) {
        await this.addToTags(key, options.tags);
      }
      
      return true;
    } catch (error) {
      logger.error('Cache set error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(this.buildKey(key));
      return result > 0;
    } catch (error) {
      logger.error('Cache delete error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(this.buildKey(key));
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  // Advanced cache operations
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }

      const value = await fetcher();
      await this.set(key, value, options);
      return value;
    } catch (error) {
      logger.error('Cache getOrSet error:', error);
      throw error;
    }
  }

  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const prefixedKeys = keys.map(key => this.buildKey(key));
      const values = await this.redis.mget(...prefixedKeys);
      
      return values.map(value => {
        if (!value) return null;
        try {
          return JSON.parse(value);
        } catch {
          return value as T;
        }
      });
    } catch (error) {
      logger.error('Cache mget error:', error);
      return keys.map(() => null);
    }
  }

  async mset<T>(keyValuePairs: Record<string, T>, options: CacheOptions = {}): Promise<boolean> {
    try {
      const ttl = options.ttl || this.defaultTTL;
      const pipeline = this.redis.pipeline();
      
      for (const [key, value] of Object.entries(keyValuePairs)) {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        pipeline.setex(this.buildKey(key), ttl, serializedValue);
      }
      
      await pipeline.exec();
      return true;
    } catch (error) {
      logger.error('Cache mset error:', error);
      return false;
    }
  }

  // Tag-based cache operations
  async addToTags(key: string, tags: string[]): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      
      for (const tag of tags) {
        pipeline.sadd(`tags:${tag}`, this.buildKey(key));
        pipeline.expire(`tags:${tag}`, 86400); // 24 hours
      }
      
      await pipeline.exec();
    } catch (error) {
      logger.error('Cache addToTags error:', error);
    }
  }

  async invalidateByTag(tag: string): Promise<number> {
    try {
      const keys = await this.redis.smembers(`tags:${tag}`);
      if (keys.length === 0) return 0;
      
      const result = await this.redis.del(...keys);
      await this.redis.del(`tags:${tag}`);
      
      return result;
    } catch (error) {
      logger.error('Cache invalidateByTag error:', error);
      return 0;
    }
  }

  async invalidateByPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(this.buildKey(pattern));
      if (keys.length === 0) return 0;
      
      return await this.redis.del(...keys);
    } catch (error) {
      logger.error('Cache invalidateByPattern error:', error);
      return 0;
    }
  }

  // Cache warming
  async warmCache<T>(
    keys: string[],
    fetcher: (key: string) => Promise<T>,
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const pipeline = this.redis.pipeline();
      const ttl = options.ttl || this.defaultTTL;
      
      for (const key of keys) {
        try {
          const value = await fetcher(key);
          const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
          pipeline.setex(this.buildKey(key), ttl, serializedValue);
        } catch (error) {
          logger.warn(`Cache warming failed for key ${key}:`, error);
        }
      }
      
      await pipeline.exec();
    } catch (error) {
      logger.error('Cache warming error:', error);
    }
  }

  // Cache statistics
  async getStats(): Promise<{
    memory: {
      used: string;
      peak: string;
      fragmentation: number;
    };
    keys: {
      total: number;
      expired: number;
      evicted: number;
    };
    hits: number;
    misses: number;
    hitRate: number;
  }> {
    try {
      const info = await this.redis.info('memory');
      const stats = await this.redis.info('stats');
      
      const memoryInfo = this.parseInfoSection(info, 'memory');
      const statsInfo = this.parseInfoSection(stats, 'stats');
      
      const totalKeys = await this.redis.dbsize();
      const hits = parseInt(statsInfo.keyspace_hits || '0');
      const misses = parseInt(statsInfo.keyspace_misses || '0');
      const total = hits + misses;
      
      return {
        memory: {
          used: memoryInfo.used_memory_human || '0B',
          peak: memoryInfo.used_memory_peak_human || '0B',
          fragmentation: parseFloat(memoryInfo.mem_fragmentation_ratio || '0'),
        },
        keys: {
          total: totalKeys,
          expired: parseInt(statsInfo.expired_keys || '0'),
          evicted: parseInt(statsInfo.evicted_keys || '0'),
        },
        hits,
        misses,
        hitRate: total > 0 ? (hits / total) * 100 : 0,
      };
    } catch (error) {
      logger.error('Cache stats error:', error);
      return {
        memory: { used: '0B', peak: '0B', fragmentation: 0 },
        keys: { total: 0, expired: 0, evicted: 0 },
        hits: 0,
        misses: 0,
        hitRate: 0,
      };
    }
  }

  // Cache health check
  async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    latency: number;
    memory: string;
  }> {
    try {
      const start = Date.now();
      await this.redis.ping();
      const latency = Date.now() - start;
      
      const info = await this.redis.info('memory');
      const memoryInfo = this.parseInfoSection(info, 'memory');
      
      return {
        status: latency < 100 ? 'healthy' : 'unhealthy',
        latency,
        memory: memoryInfo.used_memory_human || '0B',
      };
    } catch (error) {
      logger.error('Cache health check error:', error);
      return {
        status: 'unhealthy',
        latency: -1,
        memory: '0B',
      };
    }
  }

  // Utility methods
  private buildKey(key: string): string {
    return `${this.keyPrefix}${key}`;
  }

  private parseInfoSection(info: string, section: string): Record<string, string> {
    const lines = info.split('\r\n');
    const sectionStart = lines.findIndex(line => line === `# ${section}`);
    const sectionEnd = lines.findIndex((line, index) => 
      index > sectionStart && line.startsWith('# ')
    );
    
    const sectionLines = sectionEnd > 0 
      ? lines.slice(sectionStart + 1, sectionEnd)
      : lines.slice(sectionStart + 1);
    
    const result: Record<string, string> = {};
    sectionLines.forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':', 2);
        result[key] = value;
      }
    });
    
    return result;
  }

  // Cleanup
  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      logger.error('Cache close error:', error);
    }
  }
}

export const cacheManager = new CacheManager();

