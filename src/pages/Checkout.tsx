import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useMap } from '@/contexts/MapContext';
import { useToast } from '@/components/ui/use-toast';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { DeliveryAddress } from '@/types/order';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(5, 'Valid ZIP code is required'),
  instructions: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, total, clearCart } = useCart();
  const { geocodeAddress } = useMap();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: '',
      unit: '',
      city: '',
      state: '',
      zip: '',
      instructions: '',
    },
  });

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const deliveryFee = 5;
  const tax = total * 0.08;
  const finalTotal = total + deliveryFee + tax;

  const handleSubmit = async (values: AddressFormData) => {
    if (!stripe || !elements) {
      toast({
        title: 'Error',
        description: 'Payment system is not ready. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Geocode the address
      const { latitude, longitude } = await geocodeAddress(
        `${values.street}, ${values.city}, ${values.state} ${values.zip}`
      );

      const deliveryAddress: DeliveryAddress = {
        street: values.street,
        unit: values.unit,
        city: values.city,
        state: values.state,
        zip: values.zip,
        instructions: values.instructions,
        latitude,
        longitude,
      };

      // 2. Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          deliveryAddress,
          amount: Math.round(finalTotal * 100), // Convert to cents
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // 3. Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // 4. Create order in our system
        const orderResponse = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items,
            deliveryAddress,
            paymentIntentId: paymentIntent.id,
            subtotal: total,
            deliveryFee,
            tax,
            total: finalTotal,
          }),
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }

        const { orderId } = await orderResponse.json();

        // 5. Clear cart and redirect to order confirmation
        clearCart();
        navigate(`/orders/${orderId}`);

        toast({
          title: 'Order Placed!',
          description: 'Your order has been successfully placed.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid gap-8 md:grid-cols-[1fr,300px]">
              <div>
                {/* Delivery Address */}
                <div className="bg-card rounded-lg p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h2>
                  <Form {...form}>
                    <form className="space-y-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123 Main St" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Apartment/Unit (Optional)</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Apt 4B" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delivery Instructions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Gate code, landmarks, etc."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>

                {/* Payment */}
                <div className="bg-card rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </h2>
                  <div className="bg-background rounded border p-4">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: '16px',
                            color: '#030712',
                            '::placeholder': {
                              color: '#6b7280',
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-lg p-6 h-fit">
                <h2 className="font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  className="w-full mt-6"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${finalTotal.toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}