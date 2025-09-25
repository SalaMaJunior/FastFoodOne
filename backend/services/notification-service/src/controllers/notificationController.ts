import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const notificationController = {
  sendNotification: async (req: Request, res: Response) => {
    try {
      const { userId, title, message, type } = req.body;
      logger.info(`Sending notification to user: ${userId}`);
      
      // Mock notification sending
      const notification = {
        id: 'notif_' + Date.now(),
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      logger.error('Send notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send notification'
      });
    }
  },

  getUserNotifications: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      logger.info(`Getting notifications for user: ${userId}`);
      
      // Mock notifications data
      const notifications = [
        {
          id: '1',
          title: 'Order Confirmed',
          message: 'Your order has been confirmed',
          type: 'order',
          read: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Order Ready',
          message: 'Your order is ready for pickup',
          type: 'order',
          read: true,
          createdAt: new Date().toISOString()
        }
      ];
      
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications'
      });
    }
  },

  markAsRead: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Marking notification as read: ${id}`);
      
      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  },

  deleteNotification: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Deleting notification: ${id}`);
      
      res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  }
};

