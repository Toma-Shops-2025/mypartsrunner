import { supabase } from './supabase';
import { User, Product, Order, CartItem, Store, Review, Driver, Merchant } from '@/types';

// Database service class for all database operations
export class DatabaseService {
  // User/Profile operations
  static async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  static async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  }

  // Store operations
  static async getStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('isActive', true);

    if (error) {
      console.error('Error fetching stores:', error);
      return [];
    }

    return data || [];
  }

  static async getStoreById(storeId: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (error) {
      console.error('Error fetching store:', error);
      return null;
    }

    return data;
  }

  static async getStoresByMerchant(merchantId: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('merchantId', merchantId);

    if (error) {
      console.error('Error fetching merchant stores:', error);
      return [];
    }

    return data || [];
  }

  static async createStore(storeData: Omit<Store, 'id' | 'createdAt' | 'updatedAt'>): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .insert([storeData])
      .select()
      .single();

    if (error) {
      console.error('Error creating store:', error);
      return null;
    }

    return data;
  }

  static async updateStore(storeId: string, updates: Partial<Store>): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', storeId)
      .select()
      .single();

    if (error) {
      console.error('Error updating store:', error);
      return null;
    }

    return data;
  }

  // Product operations
  static async getProducts(storeId?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*, stores(*)')
      .eq('isActive', true);

    if (storeId) {
      query = query.eq('storeId', storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return data || [];
  }

  static async getProductById(productId: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, stores(*)')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }

    return data;
  }

  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) {
      console.error('Error creating product:', error);
      return null;
    }

    return data;
  }

  static async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return null;
    }

    return data;
  }

  static async deleteProduct(productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      return false;
    }

    return true;
  }

  // Cart operations
  static async getCartItems(customerId: string): Promise<CartItem[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*, stores(*))')
      .eq('customerId', customerId);

    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }

    return data || [];
  }

  static async addToCart(customerId: string, productId: string, quantity: number = 1): Promise<CartItem | null> {
    // Check if item already exists in cart
    const existingItem = await this.getCartItem(customerId, productId);
    
    if (existingItem) {
      // Update quantity
      return this.updateCartItemQuantity(customerId, productId, existingItem.quantity + quantity);
    }

    const { data, error } = await supabase
      .from('cart_items')
      .insert([{
        customerId,
        productId,
        quantity
      }])
      .select('*, products(*, stores(*))')
      .single();

    if (error) {
      console.error('Error adding to cart:', error);
      return null;
    }

    return data;
  }

  static async updateCartItemQuantity(customerId: string, productId: string, quantity: number): Promise<CartItem | null> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('customerId', customerId)
      .eq('productId', productId)
      .select('*, products(*, stores(*))')
      .single();

    if (error) {
      console.error('Error updating cart item:', error);
      return null;
    }

    return data;
  }

  static async removeFromCart(customerId: string, productId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('customerId', customerId)
      .eq('productId', productId);

    if (error) {
      console.error('Error removing from cart:', error);
      return false;
    }

    return true;
  }

  static async getCartItem(customerId: string, productId: string): Promise<CartItem | null> {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*, stores(*))')
      .eq('customerId', customerId)
      .eq('productId', productId)
      .single();

    if (error) {
      return null;
    }

    return data;
  }

  static async clearCart(customerId: string): Promise<boolean> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('customerId', customerId);

    if (error) {
      console.error('Error clearing cart:', error);
      return false;
    }

    return true;
  }

  // Order operations
  static async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return null;
    }

    return data;
  }

  static async getOrders(customerId?: string, driverId?: string, storeId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*, order_items(*, products(*)), stores(*)');

    if (customerId) {
      query = query.eq('customerId', customerId);
    }
    if (driverId) {
      query = query.eq('driverId', driverId);
    }
    if (storeId) {
      query = query.eq('storeId', storeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data || [];
  }

  static async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*)), stores(*)')
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return null;
    }

    return data;
  }

  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      return null;
    }

    return data;
  }

  // Driver operations
  static async getAvailableDrivers(lat: number, lng: number, radiusKm: number = 50): Promise<Driver[]> {
    const { data, error } = await supabase
      .rpc('get_available_drivers', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radiusKm
      });

    if (error) {
      console.error('Error fetching available drivers:', error);
      return [];
    }

    return data || [];
  }

  static async updateDriverLocation(driverId: string, lat: number, lng: number): Promise<boolean> {
    const { error } = await supabase
      .from('driver_profiles')
      .update({
        currentLocationLatitude: lat,
        currentLocationLongitude: lng
      })
      .eq('id', driverId);

    if (error) {
      console.error('Error updating driver location:', error);
      return false;
    }

    return true;
  }

  static async updateDriverAvailability(driverId: string, isAvailable: boolean): Promise<boolean> {
    const { error } = await supabase
      .from('driver_profiles')
      .update({ isAvailable })
      .eq('id', driverId);

    if (error) {
      console.error('Error updating driver availability:', error);
      return false;
    }

    return true;
  }

  // Review operations
  static async createReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<Review | null> {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return null;
    }

    return data;
  }

  static async getStoreReviews(storeId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(name)')
      .eq('storeId', storeId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching store reviews:', error);
      return [];
    }

    return data || [];
  }

  // Search operations
  static async searchProducts(query: string, category?: string): Promise<Product[]> {
    let supabaseQuery = supabase
      .from('products')
      .select('*, stores(*)')
      .eq('isActive', true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    if (category) {
      supabaseQuery = supabaseQuery.eq('category', category);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    return data || [];
  }

  static async getNearbyStores(lat: number, lng: number, radiusKm: number = 50): Promise<Store[]> {
    const { data, error } = await supabase
      .rpc('get_nearby_stores', {
        user_lat: lat,
        user_lng: lng,
        radius_km: radiusKm
      });

    if (error) {
      console.error('Error fetching nearby stores:', error);
      return [];
    }

    return data || [];
  }

  // Notification operations
  static async createNotification(notificationData: {
    userId: string;
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    relatedEntityType?: string;
    relatedEntityId?: string;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .insert([notificationData]);

    if (error) {
      console.error('Error creating notification:', error);
      return false;
    }

    return true;
  }

  static async getUserNotifications(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }
}

export default DatabaseService; 