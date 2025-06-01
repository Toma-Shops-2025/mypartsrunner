import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PaymentStatusModal from './PaymentStatusModal';

interface StripePaymentFormProps {
  total: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  shippingInfo?: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
  };
}

const StripePaymentForm = ({ 
  total, 
  onSuccess, 
  onError, 
  isProcessing, 
  setIsProcessing,
  shippingInfo
}: StripePaymentFormProps) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    email: ''
  });
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    status: 'pending' as 'success' | 'pending' | 'failed',
    message: '',
    transactionId: ''
  });
  const { toast } = useToast();

  const handlePayment = async () => {
    // Basic validation
    if (!cardData.email || !cardData.name || !cardData.number || !cardData.expiry || !cardData.cvv) {
      onError('Please fill in all payment fields');
      return;
    }

    if (!shippingInfo?.firstName || !shippingInfo?.lastName || !shippingInfo?.address || !shippingInfo?.city || !shippingInfo?.zip) {
      onError('Please fill in all shipping information');
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await fetch(
        'https://duzghrnrsgxcjodvqoiu.supabase.co/functions/v1/4da589d1-4c72-4b2e-9060-03ae14c775d3',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            currency: 'usd',
            cardData,
            shippingInfo
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        setStatusModal({
          isOpen: true,
          status: 'success',
          message: `Payment of $${total.toFixed(2)} processed successfully!`,
          transactionId: result.paymentIntentId
        });
        onSuccess();
      } else {
        throw new Error(result.error || 'Payment processing failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
      setStatusModal({
        isOpen: true,
        status: 'failed',
        message: errorMessage,
        transactionId: ''
      });
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              id="email" 
              type="email"
              placeholder="john@example.com"
              value={cardData.email}
              onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cardName">Cardholder Name *</Label>
            <Input 
              id="cardName" 
              placeholder="John Doe"
              value={cardData.name}
              onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="cardNumber">Card Number *</Label>
            <Input 
              id="cardNumber" 
              placeholder="4242 4242 4242 4242"
              value={cardData.number}
              onChange={(e) => setCardData(prev => ({ ...prev, number: e.target.value }))}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input 
                id="expiry" 
                placeholder="MM/YY"
                value={cardData.expiry}
                onChange={(e) => setCardData(prev => ({ ...prev, expiry: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV *</Label>
              <Input 
                id="cvv" 
                placeholder="123"
                value={cardData.cvv}
                onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </Button>
        </CardContent>
      </Card>
      
      <PaymentStatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        status={statusModal.status}
        message={statusModal.message}
        transactionId={statusModal.transactionId}
      />
    </>
  );
};

export default StripePaymentForm;