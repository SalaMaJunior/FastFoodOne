import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// User routes
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:id/profile', userController.getUserProfile);

export { router as userRoutes };

