import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

// Profile routes
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.delete('/account', authController.deleteAccount);

// Social auth routes
router.post('/google', authController.googleAuth);
router.post('/facebook', authController.facebookAuth);

export default router;