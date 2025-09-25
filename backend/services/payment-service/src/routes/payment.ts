import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const router = Router();

// Payment routes
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm-payment', paymentController.confirmPayment);
router.get('/:paymentId', paymentController.getPayment);
router.post('/refund', paymentController.refundPayment);

export { router as paymentRoutes };

