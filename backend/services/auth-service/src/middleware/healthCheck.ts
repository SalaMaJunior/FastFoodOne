import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: 'Auth service is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
};

