import express from 'express';
import { z } from 'zod';
import config from '@/config';

// Validation schemas
const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string().optional().default('US'),
});

const CustomerSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  name: z.string().optional(),
});

const ItemSchema = z.object({
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
});

const CreateDeliverySchema = z.object({
  pickup: z.object({
    address: AddressSchema,
    instructions: z.string().optional(),
    contact: CustomerSchema.optional(),
  }),
  dropoff: z.object({
    address: AddressSchema,
    instructions: z.string().optional(),
    contact: CustomerSchema,
  }),
  items: z.array(ItemSchema),
  scheduled_time: z.string().datetime().optional(),
  service_level: z.enum(['standard', 'express', 'same_day']).optional().default('standard'),
  metadata: z.record(z.string()).optional(),
});

export class APIIntegration {
  private router: express.Router;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes() {
    // Authentication middleware
    this.router.use(this.authenticate.bind(this));

    // Delivery endpoints
    this.router.post('/deliveries', this.createDelivery.bind(this));
    this.router.get('/deliveries/:id', this.getDelivery.bind(this));
    this.router.get('/deliveries', this.listDeliveries.bind(this));
    this.router.post('/deliveries/:id/cancel', this.cancelDelivery.bind(this));

    // Quote endpoints
    this.router.post('/quotes', this.getQuote.bind(this));

    // Tracking endpoints
    this.router.get('/tracking/:id', this.getTracking.bind(this));

    // Webhook management
    this.router.post('/webhooks', this.createWebhook.bind(this));
    this.router.delete('/webhooks/:id', this.deleteWebhook.bind(this));
    this.router.get('/webhooks', this.listWebhooks.bind(this));
  }

  // Authentication middleware
  private authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Missing or invalid authorization header'
      });
    }

    const token = authHeader.split(' ')[1];
    if (token !== this.apiKey) {
      return res.status(401).json({
        error: 'Invalid API key'
      });
    }

    next();
  }

  // Delivery endpoints
  private async createDelivery(req: express.Request, res: express.Response) {
    try {
      const data = CreateDeliverySchema.parse(req.body);
      
      // Create delivery in MyPartsRunner system
      const delivery = await this.createDeliveryInternal(data);
      
      res.status(201).json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(500).json({
          error: 'Internal server error'
        });
      }
    }
  }

  private async getDelivery(req: express.Request, res: express.Response) {
    try {
      const delivery = await this.getDeliveryInternal(req.params.id);
      
      if (!delivery) {
        return res.status(404).json({
          error: 'Delivery not found'
        });
      }
      
      res.json(delivery);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  private async listDeliveries(req: express.Request, res: express.Response) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      
      const deliveries = await this.listDeliveriesInternal({
        page: Number(page),
        limit: Number(limit),
        status: status as string
      });
      
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  private async cancelDelivery(req: express.Request, res: express.Response) {
    try {
      await this.cancelDeliveryInternal(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Quote endpoints
  private async getQuote(req: express.Request, res: express.Response) {
    try {
      const data = CreateDeliverySchema.parse(req.body);
      
      const quote = await this.calculateQuote(data);
      
      res.json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors
        });
      } else {
        res.status(500).json({
          error: 'Internal server error'
        });
      }
    }
  }

  // Tracking endpoints
  private async getTracking(req: express.Request, res: express.Response) {
    try {
      const tracking = await this.getTrackingInternal(req.params.id);
      
      if (!tracking) {
        return res.status(404).json({
          error: 'Tracking information not found'
        });
      }
      
      res.json(tracking);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Webhook management
  private async createWebhook(req: express.Request, res: express.Response) {
    try {
      const webhook = await this.createWebhookInternal(req.body);
      res.status(201).json(webhook);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  private async deleteWebhook(req: express.Request, res: express.Response) {
    try {
      await this.deleteWebhookInternal(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  private async listWebhooks(req: express.Request, res: express.Response) {
    try {
      const webhooks = await this.listWebhooksInternal();
      res.json(webhooks);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Internal implementation methods
  private async createDeliveryInternal(data: z.infer<typeof CreateDeliverySchema>) {
    // Implementation to create delivery in MyPartsRunner system
    return { id: 'delivery_id' };
  }

  private async getDeliveryInternal(id: string) {
    // Implementation to get delivery details
    return null;
  }

  private async listDeliveriesInternal(params: { page: number; limit: number; status?: string }) {
    // Implementation to list deliveries
    return {
      data: [],
      total: 0,
      page: params.page,
      limit: params.limit
    };
  }

  private async cancelDeliveryInternal(id: string) {
    // Implementation to cancel delivery
  }

  private async calculateQuote(data: z.infer<typeof CreateDeliverySchema>) {
    // Implementation to calculate delivery quote
    return {
      amount: 0,
      currency: 'USD',
      breakdown: {
        base_fee: 0,
        distance_fee: 0,
        time_fee: 0,
        service_fee: 0
      }
    };
  }

  private async getTrackingInternal(id: string) {
    // Implementation to get tracking information
    return null;
  }

  private async createWebhookInternal(data: any) {
    // Implementation to create webhook
    return { id: 'webhook_id' };
  }

  private async deleteWebhookInternal(id: string) {
    // Implementation to delete webhook
  }

  private async listWebhooksInternal() {
    // Implementation to list webhooks
    return [];
  }

  // Get the Express router
  public getRouter() {
    return this.router;
  }
} 