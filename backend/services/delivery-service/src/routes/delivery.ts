import { Router } from 'express';
import { deliveryController } from '../controllers/deliveryController';

const router = Router();

// Delivery routes
router.get('/track/:orderId', deliveryController.trackOrder);
router.post('/assign', deliveryController.assignDriver);
router.put('/status/:orderId', deliveryController.updateStatus);
router.get('/driver/:driverId', deliveryController.getDriverDeliveries);
router.post('/location', deliveryController.updateLocation);

export { router as deliveryRoutes };

