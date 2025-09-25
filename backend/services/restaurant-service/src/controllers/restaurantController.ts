import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export const restaurantController = {
  getRestaurants: async (req: Request, res: Response) => {
    try {
      logger.info('Getting restaurants');
      
      // Mock restaurants data
      const restaurants = [
        {
          id: '1',
          name: 'Pizza Palace',
          cuisine: 'Italian',
          rating: 4.5,
          deliveryTime: '30-45 min',
          image: 'https://example.com/pizza.jpg'
        },
        {
          id: '2',
          name: 'Burger King',
          cuisine: 'American',
          rating: 4.2,
          deliveryTime: '25-35 min',
          image: 'https://example.com/burger.jpg'
        }
      ];
      
      res.json({
        success: true,
        data: restaurants
      });
    } catch (error) {
      logger.error('Get restaurants error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get restaurants'
      });
    }
  },

  getRestaurantById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Getting restaurant: ${id}`);
      
      // Mock restaurant data
      const restaurant = {
        id,
        name: 'Pizza Palace',
        cuisine: 'Italian',
        rating: 4.5,
        deliveryTime: '30-45 min',
        address: '123 Main St, City, State',
        phone: '+1234567890',
        image: 'https://example.com/pizza.jpg'
      };
      
      res.json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      logger.error('Get restaurant error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get restaurant'
      });
    }
  },

  createRestaurant: async (req: Request, res: Response) => {
    try {
      const restaurantData = req.body;
      logger.info('Creating restaurant');
      
      // Mock restaurant creation
      const restaurant = {
        id: 'REST' + Date.now(),
        ...restaurantData,
        createdAt: new Date().toISOString()
      };
      
      res.status(201).json({
        success: true,
        data: restaurant
      });
    } catch (error) {
      logger.error('Create restaurant error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create restaurant'
      });
    }
  },

  updateRestaurant: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      logger.info(`Updating restaurant: ${id}`);
      
      res.json({
        success: true,
        message: 'Restaurant updated successfully'
      });
    } catch (error) {
      logger.error('Update restaurant error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update restaurant'
      });
    }
  },

  deleteRestaurant: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Deleting restaurant: ${id}`);
      
      res.json({
        success: true,
        message: 'Restaurant deleted successfully'
      });
    } catch (error) {
      logger.error('Delete restaurant error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete restaurant'
      });
    }
  },

  getMenu: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      logger.info(`Getting menu for restaurant: ${id}`);
      
      // Mock menu data
      const menu = [
        {
          id: '1',
          name: 'Margherita Pizza',
          description: 'Classic tomato and mozzarella',
          price: 12.99,
          category: 'Pizza',
          image: 'https://example.com/margherita.jpg'
        },
        {
          id: '2',
          name: 'Pepperoni Pizza',
          description: 'Pepperoni and mozzarella',
          price: 14.99,
          category: 'Pizza',
          image: 'https://example.com/pepperoni.jpg'
        }
      ];
      
      res.json({
        success: true,
        data: menu
      });
    } catch (error) {
      logger.error('Get menu error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get menu'
      });
    }
  },

  addMenuItem: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const menuItem = req.body;
      logger.info(`Adding menu item to restaurant: ${id}`);
      
      res.status(201).json({
        success: true,
        message: 'Menu item added successfully'
      });
    } catch (error) {
      logger.error('Add menu item error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to add menu item'
      });
    }
  }
};
