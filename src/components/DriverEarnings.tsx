import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Wallet,
  TrendingUp,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentMethod {
  type: 'paypal' | 'bankAccount' | 'debitCard' | 'cashApp' | 'venmo' | 'stripe';
  label: string;
  icon: React.ReactNode;
  value: string;
  isVerified: boolean;
  isDefault: boolean;
}

interface DriverEarningsProps {
  driver: any; // Replace with proper Driver type
  onUpdatePaymentMethods: (methods: any) => Promise<void>;
}

export const DriverEarnings: React.FC<DriverEarningsProps> = ({ 
  driver, 
  onUpdatePaymentMethods 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      type: 'paypal',
      label: 'PayPal',
      icon: <CreditCard className="h-4 w-4" />,
      value: driver.paymentMethods?.paypal || '',
      isVerified: false,
      isDefault: false
    },
    {
      type: 'bankAccount',
      label: 'Bank Account',
      icon: <Banknote className="h-4 w-4" />,
      value: driver.paymentMethods?.bankAccount || '',
      isVerified: false,
      isDefault: false
    },
    {
      type: 'debitCard',
      label: 'Debit Card',
      icon: <CreditCard className="h-4 w-4" />,
      value: driver.paymentMethods?.debitCard || '',
      isVerified: false,
      isDefault: false
    },
    {
      type: 'cashApp',
      label: 'Cash App',
      icon: <Smartphone className="h-4 w-4" />,
      value: driver.paymentMethods?.cashApp || '',
      isVerified: false,
      isDefault: false
    },
    {
      type: 'venmo',
      label: 'Venmo',
      icon: <Smartphone className="h-4 w-4" />,
      value: driver.paymentMethods?.venmo || '',
      isVerified: false,
      isDefault: false
    }
  ]);

  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingBalance, setPendingBalance] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);

  const handlePaymentMethodChange = (type: string, value: string) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.type === type 
          ? { ...method, value, isVerified: false }
          : method
      )
    );
  };

  const handleSavePaymentMethods = async () => {
    try {
      const methods = paymentMethods.reduce((acc, method) => {
        acc[method.type] = method.value;
        return acc;
      }, {} as any);

      await onUpdatePaymentMethods(methods);
      setIsEditing(false);
      
      toast({
        title: "Payment methods updated",
        description: "Your payment methods have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update payment methods. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePayout = async (amount: number) => {
    try {
      // TODO: Implement actual payout logic
      toast({
        title: "Payout initiated",
        description: `$${amount.toFixed(2)} will be transferred to your default payment method.`,
        variant: "default"
      });
      
      setAvailableBalance(prev => prev - amount);
    } catch (error) {
      toast({
        title: "Payout failed",
        description: "Failed to initiate payout. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-600" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(availableBalance)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Ready for immediate payout
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Pending Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {formatCurrency(pendingBalance)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Available in 2-3 business days
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency(totalEarnings)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Payout */}
      {availableBalance > 0 && (
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="h-5 w-5 text-orange-600" />
              Quick Payout
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Transfer your available balance to your default payment method
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handlePayout(availableBalance)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Payout All ${availableBalance.toFixed(2)}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handlePayout(Math.min(availableBalance, 100))}
                  >
                    Payout $100
                  </Button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Default Method</p>
                <p className="font-semibold">PayPal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <CardDescription>
                Manage how you receive your earnings
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "default" : "outline"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save Changes" : "Edit Methods"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.type} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  {method.icon}
                  <div className="flex-1">
                    <Label htmlFor={method.type} className="font-medium">
                      {method.label}
                    </Label>
                    {isEditing ? (
                      <Input
                        id={method.type}
                        value={method.value}
                        onChange={(e) => handlePaymentMethodChange(method.type, e.target.value)}
                        placeholder={`Enter your ${method.label} details`}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-600 mt-1">
                        {method.value || 'Not configured'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {method.isVerified ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : method.value ? (
                    <Badge variant="outline" className="text-yellow-600">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Not Set
                    </Badge>
                  )}
                  
                  {method.isDefault && (
                    <Badge variant="default" className="bg-blue-100 text-blue-800">
                      Default
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {isEditing && (
            <div className="mt-4 pt-4 border-t">
              <Button onClick={handleSavePaymentMethods} className="w-full">
                Save Payment Methods
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payout History</CardTitle>
          <CardDescription>
            Track your previous payouts and transfers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Sample payout history - replace with real data */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Send className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Payout to PayPal</p>
                  <p className="text-sm text-gray-600">Dec 15, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">$125.50</p>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Completed
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Send className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Payout to Bank</p>
                  <p className="text-sm text-gray-600">Dec 8, 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">$89.75</p>
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Completed
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Payout History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 