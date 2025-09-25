import { Request, Response } from 'express';

export const healthCheck = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    service: 'delivery-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

