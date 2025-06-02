import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PaymentForm } from './PaymentForm';
import { createPaymentIntent } from '@/lib/stripe';
import { useToast } from '@/hooks/use-toast';

export const TestPayment = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartPayment = async () => {
    try {
      // Create a test payment for $10
      const { clientSecret } = await createPaymentIntent(10);
      setClientSecret(clientSecret || null);
    } catch (error) {
      console.error('Error starting payment:', error);
      toast({
        title: 'Error',
        description: 'Could not initialize payment',
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = () => {
    toast({
      title: 'Success',
      description: 'Test payment completed successfully!',
    });
    setClientSecret(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Stripe Payment</h1>
      
      {!clientSecret ? (
        <Button onClick={handleStartPayment}>
          Start Test Payment ($10)
        </Button>
      ) : (
        <PaymentForm 
          clientSecret={clientSecret}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}; 