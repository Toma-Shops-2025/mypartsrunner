import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { createPaymentIntent } from '../lib/stripe';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentFormProps {
  orderId: string;
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

interface PaymentFormInnerProps {
  orderId: string;
  amount: number;
  currency: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
}

function PaymentFormInner({ orderId, amount, currency, onSuccess, onError }: PaymentFormInnerProps) {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe is not loaded. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Confirm the payment
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?order_id=${orderId}`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        onError?.(submitError.message || 'Payment failed');
        return;
      }

      // Payment successful
      setSuccess(true);
      if (paymentIntentId) {
        onSuccess?.(paymentIntentId);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An unexpected error occurred. Please try again.');
      onError?.('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
        <h3 className="text-xl font-semibold">Payment Successful!</h3>
        <p className="text-muted-foreground">
          Your payment has been processed successfully. You will receive a confirmation email shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="text"
            value={`${currency.toUpperCase()} ${amount.toFixed(2)}`}
            disabled
            className="bg-muted"
          />
        </div>

        <div>
          <Label htmlFor="order-id">Order ID</Label>
          <Input
            id="order-id"
            type="text"
            value={orderId}
            disabled
            className="bg-muted font-mono text-sm"
          />
        </div>
      </div>

      <div className="space-y-4">
        <Label>Payment Details</Label>
        <PaymentElement />
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {currency.toUpperCase()} {amount.toFixed(2)}
          </>
        )}
      </Button>

      <div className="text-xs text-muted-foreground text-center">
        <p>Your payment is secured by Stripe's industry-standard encryption.</p>
        <p>You will not be charged until your order is confirmed.</p>
      </div>
    </form>
  );
}

export default function PaymentForm({ orderId, amount, currency = 'usd', onSuccess, onError }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createPaymentIntent(amount, currency, undefined, { order_id: orderId })
      .then((paymentIntent) => {
        setClientSecret(paymentIntent.client_secret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderId, amount, currency]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>Failed to initialize payment. Please try again.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Enter your payment details to complete your order
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Elements 
          stripe={stripePromise} 
          options={{
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#0f172a',
                colorBackground: '#ffffff',
                colorText: '#0f172a',
                colorDanger: '#ef4444',
                fontFamily: 'Inter, system-ui, sans-serif',
                spacingUnit: '4px',
                borderRadius: '6px',
              },
            },
          }}
        >
          <PaymentFormInner
            orderId={orderId}
            amount={amount}
            currency={currency}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  );
} 