import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAppContext } from '@/contexts/AppContext';
import { DatabaseService } from '@/lib/database';
import { toast } from '@/components/ui/use-toast';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { user } = useAppContext();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZipCode: '',
    deliveryNotes: '',
    paymentMethod: 'stripe' as 'stripe' | 'cashApp' | 'venmo' | 'cash',
    contactPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({ ...formData, paymentMethod: value as any });
  };

  const calculateTax = () => getCartTotal() * 0.0825;
  const calculateDeliveryFee = () => 5.99;
  const calculateTotal = () => getCartTotal() + calculateTax() + calculateDeliveryFee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your order.",
        variant: "destructive"
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!formData.deliveryAddress || !formData.deliveryCity || !formData.deliveryState || !formData.deliveryZipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required delivery information.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Create order
      const orderData = {
        customerId: user.id,
        storeId: items[0]?.product?.storeId || '', // Assuming all items are from same store
        status: 'pending' as const,
        deliveryNotes: formData.deliveryNotes,
        paymentMethod: formData.paymentMethod,
        subtotal: getCartTotal(),
        tax: calculateTax(),
        deliveryFee: calculateDeliveryFee(),
        total: calculateTotal(),
        deliveryAddress: formData.deliveryAddress,
        deliveryCity: formData.deliveryCity,
        deliveryState: formData.deliveryState,
        deliveryZipCode: formData.deliveryZipCode,
        deliveryLatitude: 0, // Will be set by geocoding
        deliveryLongitude: 0, // Will be set by geocoding
      };

      const order = await DatabaseService.createOrder(orderData);

      if (order) {
        // Clear cart after successful order
        await clearCart();
        
        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and is being processed.",
        });

        // Navigate to order confirmation
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Button onClick={() => navigate('/browse')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Input
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryCity">City *</Label>
                    <Input
                      id="deliveryCity"
                      name="deliveryCity"
                      value={formData.deliveryCity}
                      onChange={handleInputChange}
                      placeholder="Dallas"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="deliveryState">State *</Label>
                    <Input
                      id="deliveryState"
                      name="deliveryState"
                      value={formData.deliveryState}
                      onChange={handleInputChange}
                      placeholder="TX"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryZipCode">ZIP Code *</Label>
                    <Input
                      id="deliveryZipCode"
                      name="deliveryZipCode"
                      value={formData.deliveryZipCode}
                      onChange={handleInputChange}
                      placeholder="75001"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                  <Textarea
                    id="deliveryNotes"
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for delivery..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={handlePaymentMethodChange}>
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="stripe" id="stripe" />
                    <Label htmlFor="stripe" className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit/Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="cashApp" id="cashApp" />
                    <Label htmlFor="cashApp" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Cash App
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-4">
                    <RadioGroupItem value="venmo" id="venmo" />
                    <Label htmlFor="venmo" className="flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Venmo
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Cash on Delivery
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${(item.product?.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (8.25%)</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${calculateDeliveryFee().toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Place Order - $${calculateTotal().toFixed(2)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage; 