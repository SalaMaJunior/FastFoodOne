import { Router } from 'express';
import { orderController } from '../controllers/orderController';

const router = Router();

// Order routes
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderController.createOrder);
router.put('/:id/status', orderController.updateOrderStatus);

export { router as orderRoutes };

