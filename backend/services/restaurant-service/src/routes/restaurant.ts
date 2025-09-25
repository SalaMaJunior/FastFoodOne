import { Router } from 'express';
import { restaurantController } from '../controllers/restaurantController';

const router = Router();

// Restaurant routes
router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.post('/', restaurantController.createRestaurant);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);
router.get('/:id/menu', restaurantController.getMenu);
router.post('/:id/menu', restaurantController.addMenuItem);

export { router as restaurantRoutes };

