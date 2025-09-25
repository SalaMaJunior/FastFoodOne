import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';

const router = Router();

// Notification routes
router.post('/send', notificationController.sendNotification);
router.get('/:userId', notificationController.getUserNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export { router as notificationRoutes };

