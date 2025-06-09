import { config } from 'dotenv';
import { join } from 'path';

// Load test environment variables
config({ path: join(__dirname, '../../.env.test') });

// Mock external services
jest.mock('@/lib/stripe', () => ({
  createCheckoutSession: jest.fn(),
  getPaymentStatus: jest.fn(),
  createPaymentIntent: jest.fn(),
  createAdPayment: jest.fn(),
  payments: {
    processDeliveryPayment: jest.fn(),
    processMerchantPayout: jest.fn(),
    processRunnerPayout: jest.fn(),
    processRefund: jest.fn(),
    addPaymentMethod: jest.fn(),
    verifyConnectedAccount: jest.fn(),
  },
}));

jest.mock('@/lib/maps', () => ({
  mapsService: {
    calculateDeliveryEstimates: jest.fn(),
    getOptimalRoute: jest.fn(),
    geocodeAddress: jest.fn(),
    snapToRoads: jest.fn(),
    validateAddress: jest.fn(),
    isInServiceArea: jest.fn(),
  },
}));

jest.mock('@/lib/realtime', () => ({
  realtime: {
    connect: jest.fn(),
    disconnect: jest.fn(),
    subscribeToDelivery: jest.fn(),
    unsubscribeFromDelivery: jest.fn(),
    subscribeToRunner: jest.fn(),
    unsubscribeFromRunner: jest.fn(),
    broadcastLocation: jest.fn(),
    subscribeToOrder: jest.fn(),
    unsubscribeFromOrder: jest.fn(),
    updateDeliveryStatus: jest.fn(),
    updateOrderStatus: jest.fn(),
    sendCustomerNotification: jest.fn(),
    sendMerchantNotification: jest.fn(),
    sendRunnerNotification: jest.fn(),
  },
})); 