import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import config from '@/config';

interface WooCommerceOrder {
  id: number;
  shipping: {
    address_1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  billing: {
    email: string;
    phone: string;
  };
  line_items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export class WooCommerceIntegration {
  private api: WooCommerceRestApi;
  private siteUrl: string;

  constructor(siteUrl: string, consumerKey: string, consumerSecret: string) {
    this.siteUrl = siteUrl;
    this.api = new WooCommerceRestApi({
      url: siteUrl,
      consumerKey: consumerKey,
      consumerSecret: consumerSecret,
      version: 'wc/v3'
    });
  }

  // Handle new WooCommerce orders
  async handleNewOrder(order: WooCommerceOrder) {
    try {
      // Convert WooCommerce order to MyPartsRunner format
      const delivery = {
        pickup: {
          // Merchant's store address from their MyPartsRunner profile
          address: await this.getMerchantAddress(),
        },
        dropoff: {
          address: order.shipping.address_1,
          city: order.shipping.city,
          state: order.shipping.state,
          zip: order.shipping.postcode,
        },
        customer: {
          email: order.billing.email,
          phone: order.billing.phone,
        },
        items: order.line_items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        metadata: {
          source: 'woocommerce',
          woocommerce_order_id: order.id,
        }
      };

      // Create delivery in MyPartsRunner system
      const deliveryResponse = await this.createDelivery(delivery);

      // Update WooCommerce order with tracking info
      await this.updateWooCommerceOrder(order.id, {
        status: 'processing',
        meta_data: [
          {
            key: 'mypartsrunner_tracking_id',
            value: deliveryResponse.id
          },
          {
            key: 'mypartsrunner_tracking_url',
            value: `${config.app.baseUrl}/track/${deliveryResponse.id}`
          }
        ]
      });

      return deliveryResponse;
    } catch (error) {
      console.error('Error handling WooCommerce order:', error);
      throw error;
    }
  }

  // Install WooCommerce plugin and set up webhooks
  async install() {
    try {
      // Register webhooks
      await this.registerWebhooks([
        {
          name: 'Order created',
          topic: 'order.created',
          delivery_url: `${config.api.baseUrl}/webhooks/woocommerce/orders`
        },
        {
          name: 'Order cancelled',
          topic: 'order.cancelled',
          delivery_url: `${config.api.baseUrl}/webhooks/woocommerce/cancellations`
        }
      ]);

      // Sync existing orders
      await this.syncExistingOrders();

      // Add delivery options to checkout
      await this.addDeliveryOptions();

      return true;
    } catch (error) {
      console.error('Error installing WooCommerce integration:', error);
      throw error;
    }
  }

  // Sync existing orders
  private async syncExistingOrders() {
    try {
      const response = await this.api.get('orders', {
        status: 'processing',
        per_page: 100
      });

      for (const order of response.data) {
        if (!order.meta_data.find(meta => meta.key === 'mypartsrunner_tracking_id')) {
          await this.handleNewOrder(order);
        }
      }
    } catch (error) {
      console.error('Error syncing existing orders:', error);
      throw error;
    }
  }

  // Add MyPartsRunner delivery options to WooCommerce checkout
  private async addDeliveryOptions() {
    try {
      // Add shipping method
      await this.api.post('shipping/zones/0/methods', {
        method_id: 'mypartsrunner',
        method_title: 'Same-Day Delivery by MyPartsRunner',
        enabled: true
      });

      // Add shipping class
      await this.api.post('products/shipping_classes', {
        name: 'Same-Day Delivery',
        slug: 'same-day-delivery',
        description: 'Eligible for same-day delivery via MyPartsRunner'
      });

    } catch (error) {
      console.error('Error adding delivery options:', error);
      throw error;
    }
  }

  // Register webhooks in WooCommerce
  private async registerWebhooks(webhooks: Array<{ name: string; topic: string; delivery_url: string }>) {
    try {
      for (const webhook of webhooks) {
        await this.api.post('webhooks', {
          name: webhook.name,
          topic: webhook.topic,
          delivery_url: webhook.delivery_url,
          secret: config.integrations.woocommerce.webhookSecret
        });
      }
    } catch (error) {
      console.error('Error registering webhooks:', error);
      throw error;
    }
  }

  // Helper methods
  private async getMerchantAddress() {
    // Implementation to fetch merchant's address from their profile
    return {
      address: '',
      city: '',
      state: '',
      zip: '',
    };
  }

  private async createDelivery(delivery: any) {
    // Implementation to create delivery in MyPartsRunner system
    return { id: 'delivery_id' };
  }

  private async updateWooCommerceOrder(orderId: number, data: any) {
    try {
      await this.api.put(`orders/${orderId}`, data);
    } catch (error) {
      console.error('Error updating WooCommerce order:', error);
      throw error;
    }
  }
} 