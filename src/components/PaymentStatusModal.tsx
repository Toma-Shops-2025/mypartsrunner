import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Info, Clock, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'pending' | 'failed';
  message: string;
  transactionId?: string;
}

const PaymentStatusModal = ({ 
  isOpen, 
  onClose, 
  status, 
  message, 
  transactionId 
}: PaymentStatusModalProps) => {
  const { toast } = useToast();

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'pending':
        return <Clock className="h-6 w-6 text-blue-600 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'pending':
        return 'border-blue-200 bg-blue-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'success':
        return 'Payment Successful!';
      case 'pending':
        return 'Payment Processing';
      case 'failed':
        return 'Payment Failed';
    }
  };

  const copyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      toast({
        title: 'Copied!',
        description: 'Transaction ID copied to clipboard'
      });
    }
  };

  const getNextSteps = () => {
    switch (status) {
      case 'success':
        return (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>What happens next:</strong></p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• You'll receive a confirmation email within 5 minutes</li>
                  <li>• Your order will be processed and shipped within 1-2 business days</li>
                  <li>• You'll receive tracking information once shipped</li>
                  <li>• Funds are held in escrow until delivery confirmation</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        );
      case 'pending':
        return (
          <Alert className="border-blue-200 bg-blue-50">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Payment Processing:</strong></p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Your payment is being verified by our secure payment processor</li>
                  <li>• This usually takes 1-3 minutes</li>
                  <li>• Bank charges may take 1-3 business days to appear</li>
                  <li>• You'll receive email confirmation once complete</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        );
      case 'failed':
        return (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p><strong>Common solutions:</strong></p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Check your card details and try again</li>
                  <li>• Ensure you have sufficient funds</li>
                  <li>• Contact your bank if the issue persists</li>
                  <li>• Try a different payment method</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {getStatusIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className={getStatusColor()}>
            <AlertDescription className="text-sm font-medium">
              {message}
            </AlertDescription>
          </Alert>
          
          {transactionId && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Transaction ID</p>
                  <p className="text-sm font-mono">{transactionId}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyTransactionId}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          
          {getNextSteps()}
          
          {status === 'success' && (
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Escrow Protection:</strong> Your payment is securely held until 
                you confirm receipt of your order. This protects both buyers and sellers.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2">
            {status === 'failed' && (
              <Button variant="outline" onClick={onClose}>
                Try Again
              </Button>
            )}
            <Button onClick={onClose} className={status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}>
              {status === 'success' ? 'Continue Shopping' : status === 'pending' ? 'I Understand' : 'Close'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentStatusModal;