import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StripeConnectOnboarding } from '@/components/StripeConnectOnboarding';
import { 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  DollarSign, 
  Shield, 
  Zap,
  TrendingUp,
  BarChart3,
  Building,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

export default function MerchantStripeOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate('/merchant-application');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleGoBack}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Application
          </Button>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Setup
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Complete your payment setup to start receiving money instantly when customers place orders
            </p>
          </div>
        </div>

        {/* Benefits Overview */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Why Merchants Love Our Payment System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Instant Payments</h3>
                <p className="text-sm text-gray-600">Get paid immediately when orders are placed</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Secure Processing</h3>
                <p className="text-sm text-gray-600">Bank-level security powered by Stripe</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Revenue Tracking</h3>
                <p className="text-sm text-gray-600">Real-time sales and earnings dashboard</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-1">Analytics</h3>
                <p className="text-sm text-gray-600">Detailed insights on your delivery business</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              How Our Payment Flow Works
            </CardTitle>
            <CardDescription>
              Understanding how you get paid when customers place delivery orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Customer Places Order</h3>
                <p className="text-sm text-gray-600">
                  Customer selects your products and pays securely with their card
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">You Get Paid Instantly</h3>
                <p className="text-sm text-gray-600">
                  <strong>Product cost + tax</strong> is transferred to your account immediately
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Driver Gets Order</h3>
                <p className="text-sm text-gray-600">
                  Driver fee is paid separately when delivery is completed
                </p>
              </div>
            </div>

            <Alert className="mt-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>No Risk:</strong> You receive payment before your products leave your store. 
                Delivery fees and platform costs are handled separately.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Stripe Connect Onboarding Component */}
        <div className="max-w-4xl mx-auto">
          <StripeConnectOnboarding 
            userType="merchant"
            onComplete={handleOnboardingComplete}
          />
        </div>

        {/* Support Section */}
        <Card className="mt-8 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Need Assistance?</h3>
              <p className="text-gray-600 mb-4">
                Our team is here to help you get set up quickly and start earning right away.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline">
                  📧 Email Support
                </Button>
                <Button variant="outline">
                  📞 Call Us
                </Button>
                <Button variant="outline">
                  💬 Live Chat
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📞 Merchant Support:</strong> 1-800-PARTS-RUN (1-800-727-8778)<br/>
                  <strong>📧 Email:</strong> merchants@mypartsrunner.com<br/>
                  <strong>💬 Live Chat:</strong> Available 7am-7pm EST
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 