import { Product, Store } from './store';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface DeliveryAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  instructions?: string;
  latitude: number;
  longitude: number;
}

export interface Runner {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  totalDeliveries: number;
  isAvailable: boolean;
  currentLocation?: {
    latitude: number;
    longitude: number;
    lastUpdated: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  store: Store;
  items: OrderItem[];
  runner?: Runner;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  paymentIntentId: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  estimatedDeliveryTime: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface PaymentMethod {
  id: string;
  type: 'card';
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
} 