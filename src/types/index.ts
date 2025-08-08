// Define user roles
export type UserRole = 'customer' | 'driver' | 'merchant' | 'admin';

// User interface
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  businessName?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// Store interface
export interface Store {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  storeType: 'auto' | 'hardware';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Customer specific data
export interface Customer extends User {
  role: 'customer';
  favorites: string[]; // IDs of favorite stores and items
  cart: CartItem[];
  orders: Order[];
}

// Driver specific data
export interface Driver extends User {
  role: 'driver';
  licenseVerified: boolean;
  insuranceVerified: boolean;
  vehicleType: 'car' | 'suv' | 'truck' | 'van';
  isAvailable: boolean;
  paymentMethods: {
    stripe?: string;
    cashApp?: string;
    venmo?: string;
  };
}

// Merchant specific data
export interface Merchant extends User {
  role: 'merchant';
  storeName: string;
  storeType: 'auto' | 'hardware';
  location: Location;
  products: Product[];
}

// Admin specific data
export interface Admin extends User {
  role: 'admin';
}

// Product interface
export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  brand?: string;
  partNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Cart item interface
export interface CartItem {
  id: string;
  customerId: string;
  productId: string;
  quantity: number;
  product?: Product;
  createdAt: Date;
  updatedAt: Date;
}

// Order interface
export interface Order {
  id: string;
  customerId: string;
  driverId?: string;
  storeId: string;
  items: CartItem[];
  status: 'pending' | 'accepted' | 'in-progress' | 'delivered' | 'cancelled';
  deliveryNotes?: string;
  paymentMethod: 'stripe' | 'cashApp' | 'venmo' | 'cash';
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Location interface
export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

// Review interface
export interface Review {
  id: string;
  customerId: string;
  storeId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: Date;
}
