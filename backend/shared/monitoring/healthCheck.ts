import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { createClient } from 'redis';
import mongoose from 'mongoose';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: ServiceHealth;
    redis: ServiceHealth;
    external: ServiceHealth;
  };
  metrics: {
    memory: MemoryMetrics;
    cpu: CPUMetrics;
    requests: RequestMetrics;
  };
}

interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

interface MemoryMetrics {
  used: number;
  free: number;
  total: number;
  percentage: number;
}

interface CPUMetrics {
  usage: number;
  loadAverage: number[];
}

interface RequestMetrics {
  total: number;
  success: number;
  error: number;
  averageResponseTime: number;
}

class HealthChecker {
  private startTime: number;
  private requestCount: number = 0;
  private successCount: number = 0;
  private errorCount: number = 0;
  private responseTimes: number[] = [];
  private redis: any;
  private mongo: typeof mongoose;

  constructor() {
    this.startTime = Date.now();
    this.initializeServices();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize Redis connection
      this.redis = createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      });

      // Initialize MongoDB connection
      this.mongo = mongoose;
    } catch (error) {
      logger.error('Error initializing health check services:', error);
    }
  }

  async checkHealth(): Promise<HealthStatus> {
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;

    try {
      const [databaseHealth, redisHealth, externalHealth] = await Promise.all([
        this.checkDatabase(),
        this.checkRedis(),
        this.checkExternalServices(),
      ]);

      const services = {
        database: databaseHealth,
        redis: redisHealth,
        external: externalHealth,
      };

      const overallStatus = this.determineOverallStatus(services);
      const metrics = this.getMetrics();

      return {
        status: overallStatus,
        timestamp,
        uptime,
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services,
        metrics,
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp,
        uptime,
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
          database: { status: 'unhealthy', responseTime: 0, lastCheck: timestamp, error: error.message },
          redis: { status: 'unhealthy', responseTime: 0, lastCheck: timestamp, error: error.message },
          external: { status: 'unhealthy', responseTime: 0, lastCheck: timestamp, error: error.message },
        },
        metrics: this.getMetrics(),
      };
    }
  }

  private async checkDatabase(): Promise<ServiceHealth> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      if (!this.mongo.connection.readyState) {
        throw new Error('Database not connected');
      }

      // Test database connection with a simple query
      await this.mongo.connection.db.admin().ping();
      
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        responseTime,
        lastCheck: timestamp,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: 'unhealthy',
        responseTime,
        lastCheck: timestamp,
        error: error.message,
      };
    }
  }

  private async checkRedis(): Promise<ServiceHealth> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      if (!this.redis.isOpen) {
        await this.redis.connect();
      }

      // Test Redis connection with a ping
      await this.redis.ping();
      
      const responseTime = Date.now() - startTime;
      return {
        status: 'healthy',
        responseTime,
        lastCheck: timestamp,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: 'unhealthy',
        responseTime,
        lastCheck: timestamp,
        error: error.message,
      };
    }
  }

  private async checkExternalServices(): Promise<ServiceHealth> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
      // Check external services (payment gateways, notification services, etc.)
      const externalChecks = await Promise.allSettled([
        this.checkPaymentGateway(),
        this.checkNotificationService(),
        this.checkAIService(),
      ]);

      const failedChecks = externalChecks.filter(result => result.status === 'rejected');
      
      if (failedChecks.length === 0) {
        const responseTime = Date.now() - startTime;
        return {
          status: 'healthy',
          responseTime,
          lastCheck: timestamp,
        };
      } else if (failedChecks.length < externalChecks.length) {
        const responseTime = Date.now() - startTime;
        return {
          status: 'degraded',
          responseTime,
          lastCheck: timestamp,
          error: `${failedChecks.length} external services unavailable`,
        };
      } else {
        const responseTime = Date.now() - startTime;
        return {
          status: 'unhealthy',
          responseTime,
          lastCheck: timestamp,
          error: 'All external services unavailable',
        };
      }
    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        status: 'unhealthy',
        responseTime,
        lastCheck: timestamp,
        error: error.message,
      };
    }
  }

  private async checkPaymentGateway(): Promise<void> {
    // Simulate payment gateway health check
    // In real implementation, this would ping the actual payment service
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve();
        } else {
          reject(new Error('Payment gateway unavailable'));
        }
      }, 100);
    });
  }

  private async checkNotificationService(): Promise<void> {
    // Simulate notification service health check
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 98% success rate
        if (Math.random() > 0.02) {
          resolve();
        } else {
          reject(new Error('Notification service unavailable'));
        }
      }, 150);
    });
  }

  private async checkAIService(): Promise<void> {
    // Simulate AI service health check
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 99% success rate
        if (Math.random() > 0.01) {
          resolve();
        } else {
          reject(new Error('AI service unavailable'));
        }
      }, 200);
    });
  }

  private determineOverallStatus(services: any): 'healthy' | 'unhealthy' | 'degraded' {
    const statuses = Object.values(services).map((service: any) => service.status);
    
    if (statuses.every(status => status === 'healthy')) {
      return 'healthy';
    } else if (statuses.some(status => status === 'unhealthy')) {
      return 'unhealthy';
    } else {
      return 'degraded';
    }
  }

  private getMetrics(): { memory: MemoryMetrics; cpu: CPUMetrics; requests: RequestMetrics } {
    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external;
    const usedMemory = memoryUsage.heapUsed;

    return {
      memory: {
        used: usedMemory,
        free: totalMemory - usedMemory,
        total: totalMemory,
        percentage: (usedMemory / totalMemory) * 100,
      },
      cpu: {
        usage: process.cpuUsage().user / 1000000, // Convert to seconds
        loadAverage: process.platform === 'win32' ? [0, 0, 0] : require('os').loadavg(),
      },
      requests: {
        total: this.requestCount,
        success: this.successCount,
        error: this.errorCount,
        averageResponseTime: this.responseTimes.length > 0 
          ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
          : 0,
      },
    };
  }

  // Track request metrics
  trackRequest(responseTime: number, success: boolean): void {
    this.requestCount++;
    if (success) {
      this.successCount++;
    } else {
      this.errorCount++;
    }
    this.responseTimes.push(responseTime);
    
    // Keep only last 1000 response times for average calculation
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  }

  // Express middleware for health check endpoint
  healthCheckMiddleware = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await this.checkHealth();
      
      const statusCode = health.status === 'healthy' ? 200 : 
                        health.status === 'degraded' ? 200 : 503;
      
      res.status(statusCode).json(health);
    } catch (error) {
      logger.error('Health check middleware error:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      });
    }
  };

  // Express middleware for metrics tracking
  metricsMiddleware = (req: Request, res: Response, next: Function): void => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const success = res.statusCode >= 200 && res.statusCode < 400;
      this.trackRequest(responseTime, success);
    });
    
    next();
  };
}

export const healthChecker = new HealthChecker();

