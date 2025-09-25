import { Request, Response } from 'express';
import { config } from '../config';
import { HealthCheckResponse, ServiceHealth } from '../types';
import axios from 'axios';

const checkServiceHealth = async (serviceName: string, url: string): Promise<ServiceHealth> => {
  const start = Date.now();
  
  try {
    const response = await axios.get(`${url}/health`, { timeout: 5000 });
    const responseTime = Date.now() - start;
    
    return {
      name: serviceName,
      status: response.status === 200 ? 'healthy' : 'unhealthy',
      responseTime,
      lastCheck: new Date().toISOString(),
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    
    return {
      name: serviceName,
      status: 'unhealthy',
      responseTime,
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const healthCheck = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = Object.entries(config.services);
    const serviceHealthChecks = await Promise.all(
      services.map(([name, url]) => checkServiceHealth(name, url))
    );

    const servicesHealth: Record<string, ServiceHealth> = {};
    serviceHealthChecks.forEach(health => {
      servicesHealth[health.name] = health;
    });

    const overallStatus = serviceHealthChecks.every(health => health.status === 'healthy')
      ? 'healthy'
      : serviceHealthChecks.some(health => health.status === 'healthy')
      ? 'degraded'
      : 'unhealthy';

    const memoryUsage = process.memoryUsage();
    const totalMemory = memoryUsage.heapTotal + memoryUsage.external;

    const response: HealthCheckResponse = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: servicesHealth,
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        free: Math.round((totalMemory - memoryUsage.heapUsed) / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
      },
    };

    const statusCode = overallStatus === 'healthy' ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
};

