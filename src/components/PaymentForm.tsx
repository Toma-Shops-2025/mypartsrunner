import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  DollarSign,
  Truck,
  Package,
  Clock,
  MapPin,
  User,
  Phone,
  Building,
  Shield,
  Zap,
  Calculator,
  Receipt
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
  merchantId: string;
}

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  deliveryAddress: DeliveryAddress;
  estimatedDeliveryTime: string;
  selectedStore: string;
}

interface PaymentFormProps {
  orderSummary: OrderSummary;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: string) => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#374151',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      '::placeholder': {
        color: '#9CA3AF',
      },
    },
    invalid: {
      color: '#EF4444',
      iconColor: '#EF4444',
    },
  },
  hidePostalCode: false,
};

const CheckoutForm: React.FC<PaymentFormProps> = ({
  orderSummary,
  onPaymentSuccess,
  onPaymentError
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAppContext();
  
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cashapp' | 'venmo'>('card');
  const [billingAddress, setBillingAddress] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [sameAsDelivery, setSameAsDelivery] = useState(false);
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  useEffect(() => {
    if (sameAsDelivery) {
      setBillingAddress(prev => ({
        ...prev,
        street: orderSummary.deliveryAddress.street,
        city: orderSummary.deliveryAddress.city,
        state: orderSummary.deliveryAddress.state,
        zipCode: orderSummary.deliveryAddress.zipCode
      }));
    }
  }, [sameAsDelivery, orderSummary.deliveryAddress]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onPaymentError('Stripe has not loaded yet. Please try again.');
      return;
    }

    if (paymentMethod === 'card') {
      await handleCardPayment();
    } else {
      await handleAlternativePayment();
    }
  };

  const handleCardPayment = async () => {
    const cardElement = elements!.getElement(CardElement);

    if (!cardElement) {
      onPaymentError('Card element not found');
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent on server
      const paymentIntentResponse = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(orderSummary.total * 100), // Convert to cents
          currency: 'usd',
          orderDetails: {
            items: orderSummary.items,
            deliveryAddress: orderSummary.deliveryAddress,
            customerId: user?.id,
            merchantId: orderSummary.items[0]?.merchantId, // For single-merchant orders
            storeId: orderSummary.selectedStore,
            breakdown: {
              subtotal: orderSummary.subtotal,
              deliveryFee: orderSummary.deliveryFee,
              serviceFee: orderSummary.serviceFee,
              tax: orderSummary.tax
            }
          },
          metadata: {
            customerName: billingAddress.name,
            customerEmail: billingAddress.email,
            customerPhone: billingAddress.phone,
            deliveryAddress: `${orderSummary.deliveryAddress.street}, ${orderSummary.deliveryAddress.city}, ${orderSummary.deliveryAddress.state} ${orderSummary.deliveryAddress.zipCode}`,
            orderType: 'delivery'
          }
        })
      });

      const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();

      if (!clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingAddress.name,
            email: billingAddress.email,
            phone: billingAddress.phone,
            address: {
              line1: billingAddress.street,
              city: billingAddress.city,
              state: billingAddress.state,
              postal_code: billingAddress.zipCode,
              country: 'US'
            }
          }
        },
        setup_future_usage: savePaymentMethod ? 'on_session' : undefined
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Process the order with automatic payouts
        await processOrderWithPayouts(paymentIntent);
        onPaymentSuccess(paymentIntent);
        
        toast({
          title: "Payment successful! 🎉",
          description: "Your order has been placed and the merchant has been notified.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      onPaymentError(error.message || 'Payment failed. Please try again.');
      
      toast({
        title: "Payment failed",
        description: error.message || "Please check your card details and try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleAlternativePayment = async () => {
    setProcessing(true);
    
    try {
      // For Cash App and Venmo, we'll create a pending order and handle payment offline
      const response = await fetch('/.netlify/functions/create-pending-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderDetails: {
            items: orderSummary.items,
            deliveryAddress: orderSummary.deliveryAddress,
            customerId: user?.id,
            merchantId: orderSummary.items[0]?.merchantId,
            storeId: orderSummary.selectedStore,
            breakdown: {
              subtotal: orderSummary.subtotal,
              deliveryFee: orderSummary.deliveryFee,
              serviceFee: orderSummary.serviceFee,
              tax: orderSummary.tax,
              total: orderSummary.total
            }
          },
          paymentMethod: paymentMethod,
          customerInfo: billingAddress
        })
      });

      const result = await response.json();

      if (response.ok) {
        onPaymentSuccess({ id: result.orderId, payment_method: paymentMethod });
        
        toast({
          title: `${paymentMethod === 'cashapp' ? 'Cash App' : 'Venmo'} order created!`,
          description: "You'll receive payment instructions shortly.",
          variant: "default"
        });
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Alternative payment error:', error);
      onPaymentError(error.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  const processOrderWithPayouts = async (paymentIntent: any) => {
    try {
      // Process automatic payouts to merchant, driver, and house
      await fetch('/.netlify/functions/process-order-payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          orderDetails: {
            items: orderSummary.items,
            merchantId: orderSummary.items[0]?.merchantId,
            storeId: orderSummary.selectedStore,
            breakdown: {
              subtotal: orderSummary.subtotal,
              deliveryFee: orderSummary.deliveryFee,
              serviceFee: orderSummary.serviceFee,
              tax: orderSummary.tax
            }
          }
        })
      });
    } catch (error) {
      console.error('Payout processing error:', error);
      // Don't fail the order, just log the error
    }
  };

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orderSummary.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">
                    {item.storeName} • Qty: {item.quantity}
                  </div>
                </div>
                <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${orderSummary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  Delivery Fee
                </span>
                <span>${orderSummary.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>${orderSummary.serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${orderSummary.tax.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">
                Estimated delivery: {orderSummary.estimatedDeliveryTime}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">
                {orderSummary.deliveryAddress.street}, {orderSummary.deliveryAddress.city}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="font-medium">Credit/Debit Card</span>
                {paymentMethod === 'card' && <Badge variant="default" className="ml-auto">Selected</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-1">Instant payment</p>
            </div>

            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                paymentMethod === 'cashapp' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('cashapp')}
            >
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Cash App</span>
                {paymentMethod === 'cashapp' && <Badge variant="default" className="ml-auto">Selected</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-1">Pay via Cash App</p>
            </div>

            <div 
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                paymentMethod === 'venmo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setPaymentMethod('venmo')}
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Venmo</span>
                {paymentMethod === 'venmo' && <Badge variant="default" className="ml-auto">Selected</Badge>}
              </div>
              <p className="text-xs text-gray-500 mt-1">Pay via Venmo</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {paymentMethod === 'card' ? 'Card Information' : 'Contact Information'}
            </CardTitle>
            <CardDescription>
              {paymentMethod === 'card' 
                ? 'Your payment information is secure and encrypted'
                : 'We\'ll send payment instructions to your email'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {paymentMethod === 'card' && (
              <>
                <div className="p-4 border border-gray-300 rounded-lg">
                  <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="savePaymentMethod"
                    checked={savePaymentMethod}
                    onChange={(e) => setSavePaymentMethod(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="savePaymentMethod" className="text-sm">
                    Save payment method for future orders
                  </Label>
                </div>
              </>
            )}

            {/* Billing Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Billing Information</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAsDelivery"
                    checked={sameAsDelivery}
                    onChange={(e) => setSameAsDelivery(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="sameAsDelivery" className="text-sm">
                    Same as delivery address
                  </Label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={billingAddress.name}
                    onChange={(e) => handleBillingAddressChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingAddress.email}
                    onChange={(e) => handleBillingAddressChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={billingAddress.phone}
                    onChange={(e) => handleBillingAddressChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="street">Address *</Label>
                  <Input
                    id="street"
                    value={billingAddress.street}
                    onChange={(e) => handleBillingAddressChange('street', e.target.value)}
                    disabled={sameAsDelivery}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={billingAddress.city}
                    onChange={(e) => handleBillingAddressChange('city', e.target.value)}
                    disabled={sameAsDelivery}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={billingAddress.state}
                    onChange={(e) => handleBillingAddressChange('state', e.target.value)}
                    disabled={sameAsDelivery}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={billingAddress.zipCode}
                    onChange={(e) => handleBillingAddressChange('zipCode', e.target.value)}
                    disabled={sameAsDelivery}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Secure Payment:</strong> Your payment is processed securely by Stripe. 
                We never store your card information.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-lg"
              disabled={!stripe || processing}
            >
              {processing ? (
                <>
                  <Package className="mr-2 h-5 w-5 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-5 w-5" />
                  {paymentMethod === 'card' 
                    ? `Pay $${orderSummary.total.toFixed(2)}` 
                    : `Place Order - $${orderSummary.total.toFixed(2)}`
                  }
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By placing this order, you agree to our Terms of Service and Privacy Policy.
              {paymentMethod === 'card' 
                ? ' Your card will be charged immediately.'
                : ` You'll receive ${paymentMethod === 'cashapp' ? 'Cash App' : 'Venmo'} payment instructions via email.`
              }
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export const PaymentForm: React.FC<PaymentFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}; 