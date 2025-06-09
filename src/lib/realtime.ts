import { io, Socket } from 'socket.io-client';
import { EventEmitter } from 'events';

class RealtimeService extends EventEmitter {
  private socket: Socket;
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;

  constructor() {
    super();
    this.socket = io(process.env.SOCKET_SERVER_URL!, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Connection events
    this.socket.on('connect', () => {
      console.log('Connected to realtime service');
      this.reconnectAttempts = 0;
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from realtime service:', reason);
      this.emit('disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      this.emit('error', error);
    });

    // Delivery updates
    this.socket.on('delivery_status_update', (data) => {
      this.emit('deliveryUpdate', data);
    });

    // Runner location updates
    this.socket.on('runner_location_update', (data) => {
      this.emit('runnerLocationUpdate', data);
    });

    // Order updates
    this.socket.on('order_update', (data) => {
      this.emit('orderUpdate', data);
    });

    // Customer notifications
    this.socket.on('customer_notification', (data) => {
      this.emit('customerNotification', data);
    });

    // Merchant notifications
    this.socket.on('merchant_notification', (data) => {
      this.emit('merchantNotification', data);
    });

    // Runner notifications
    this.socket.on('runner_notification', (data) => {
      this.emit('runnerNotification', data);
    });
  }

  // Connection management
  connect(userId: string, userType: 'customer' | 'merchant' | 'runner') {
    this.socket.auth = { userId, userType };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  // Delivery tracking
  subscribeToDelivery(deliveryId: string) {
    this.socket.emit('subscribe_delivery', { deliveryId });
  }

  unsubscribeFromDelivery(deliveryId: string) {
    this.socket.emit('unsubscribe_delivery', { deliveryId });
  }

  // Runner tracking
  subscribeToRunner(runnerId: string) {
    this.socket.emit('subscribe_runner', { runnerId });
  }

  unsubscribeFromRunner(runnerId: string) {
    this.socket.emit('unsubscribe_runner', { runnerId });
  }

  // Runner location broadcasting
  broadcastLocation(location: { lat: number; lng: number }) {
    this.socket.emit('update_location', location);
  }

  // Order management
  subscribeToOrder(orderId: string) {
    this.socket.emit('subscribe_order', { orderId });
  }

  unsubscribeFromOrder(orderId: string) {
    this.socket.emit('unsubscribe_order', { orderId });
  }

  // Status updates
  updateDeliveryStatus(deliveryId: string, status: DeliveryStatus) {
    this.socket.emit('update_delivery_status', { deliveryId, status });
  }

  updateOrderStatus(orderId: string, status: OrderStatus) {
    this.socket.emit('update_order_status', { orderId, status });
  }

  // Notifications
  sendCustomerNotification(customerId: string, notification: Notification) {
    this.socket.emit('send_customer_notification', { customerId, notification });
  }

  sendMerchantNotification(merchantId: string, notification: Notification) {
    this.socket.emit('send_merchant_notification', { merchantId, notification });
  }

  sendRunnerNotification(runnerId: string, notification: Notification) {
    this.socket.emit('send_runner_notification', { runnerId, notification });
  }
}

// Types
interface Notification {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}

type DeliveryStatus = 
  | 'pending'
  | 'accepted'
  | 'picked_up'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

type OrderStatus =
  | 'created'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

// Export singleton instance
export const realtime = new RealtimeService(); 