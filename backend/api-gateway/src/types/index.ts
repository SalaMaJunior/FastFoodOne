export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path: string;
  method: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImage?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: 'customer' | 'driver' | 'restaurant' | 'admin';
  preferences?: UserPreferences;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dietaryRestrictions: string[];
  favoriteCuisines: string[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image?: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  cuisine: string;
  priceRange: string;
  isOpen: boolean;
  distance?: number;
  tags: string[];
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  hours: Record<string, string>;
  contact: {
    phone: string;
    email: string;
  };
  features: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  isVegetarian: boolean;
  isSpicy: boolean;
  allergens: string[];
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  customizations: Customization[];
  addOns: AddOn[];
  restaurant: {
    id: string;
    name: string;
  };
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  restaurant: {
    id: string;
    name: string;
    phone?: string;
    address?: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
  };
  deliveryAddress: Address;
  delivery?: {
    estimatedTime: string;
    driver?: {
      id: string;
      name: string;
      phone: string;
      rating: number;
      vehicle: string;
    };
    tracking?: {
      status: string;
      location: {
        lat: number;
        lng: number;
      };
      lastUpdated: string;
    };
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  item: {
    id: string;
    name: string;
    image?: string;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: any[];
  addOns: any[];
  specialInstructions?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  message: string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: string;
  transactionId?: string;
  processedAt?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string;
  status: 'assigned' | 'picked_up' | 'out_for_delivery' | 'delivered';
  estimatedArrival: string;
  actualArrival?: string;
  driver: {
    id: string;
    name: string;
    phone: string;
    rating: number;
    vehicle: string;
    location: {
      lat: number;
      lng: number;
      lastUpdated: string;
    };
  };
  route: {
    restaurant: {
      lat: number;
      lng: number;
    };
    delivery: {
      lat: number;
      lng: number;
    };
    currentLocation: {
      lat: number;
      lng: number;
    };
  };
}

export interface Notification {
  id: string;
  type: 'order_update' | 'promotion' | 'general';
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastCheck: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  services: Record<string, ServiceHealth>;
  memory: {
    used: number;
    free: number;
    total: number;
  };
}

