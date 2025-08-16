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
  Truck,
  Sparkles,
  Calendar,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';

export default function DriverStripeOnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const handleOnboardingComplete = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate('/driver-application');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Driver Payment Setup
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Set up your payment account to start earning money for every delivery you complete
            </p>
          </div>
        </div>

        {/* Benefits Overview */}
        <Card className="mb-8 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-center justify-center">
              <Sparkles className="h-5 w-5 text-green-600" />
              Why Drivers Love Our Payment System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-1">Fast Payouts</h3>
                <p className="text-sm text-gray-600">Get paid weekly with instant access</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-1">Great Earnings</h3>
                <p className="text-sm text-gray-600">80% of delivery fees plus tips</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-1">Bonus Rewards</h3>
                <p className="text-sm text-gray-600">Extra earnings for top performers</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold mb-1">Flexible Schedule</h3>
                <p className="text-sm text-gray-600">Work when you want, get paid fast</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Driver Payments Work */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              How Driver Payments Work
            </CardTitle>
            <CardDescription>
              Understanding when and how you get paid for deliveries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  1
                </div>
                <h3 className="font-semibold mb-2">Accept Delivery</h3>
                <p className="text-sm text-gray-600">
                  Pick up orders from merchants and deliver to customers safely
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  2
                </div>
                <h3 className="font-semibold mb-2">Complete Delivery</h3>
                <p className="text-sm text-gray-600">
                  Confirm delivery completion in the app - <strong>you get paid instantly!</strong>
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                  3
                </div>
                <h3 className="font-semibold mb-2">Weekly Payouts</h3>
                <p className="text-sm text-gray-600">
                  All earnings are automatically transferred to your bank account weekly
                </p>
              </div>
            </div>

            <Alert className="mt-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Instant Earnings:</strong> You earn 80% of the delivery fee plus 100% of tips. 
                Money is available in your account as soon as delivery is confirmed!
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Earnings Example */}
        <Card className="mb-8 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Your Earning Potential
            </CardTitle>
            <CardDescription>
              See how much you can earn with every delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">$15.00</div>
                  <div className="text-sm text-gray-600">Delivery Fee</div>
                  <div className="text-xs text-green-700 mt-1">You earn: $12.00 (80%)</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">$5.00</div>
                  <div className="text-sm text-gray-600">Customer Tip</div>
                  <div className="text-xs text-blue-700 mt-1">You earn: $5.00 (100%)</div>
                </div>
                
                <div className="text-center border-l-2 border-dashed border-gray-300 pl-4 md:pl-0 md:border-l-0">
                  <div className="text-3xl font-bold text-purple-600">$17.00</div>
                  <div className="text-sm text-gray-600">Total Earnings</div>
                  <div className="text-xs text-purple-700 mt-1">Per delivery average</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Average driver earnings:</strong> $20-30/hour during peak times | 
                  <strong>Weekly average:</strong> $800-1,200 for full-time drivers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Connect Onboarding Component */}
        <div className="max-w-4xl mx-auto">
          <StripeConnectOnboarding 
            userType="driver"
            onComplete={handleOnboardingComplete}
          />
        </div>

        {/* Support Section */}
        <Card className="mt-8 border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Driver Support</h3>
              <p className="text-gray-600 mb-4">
                Need help getting set up? Our driver support team is here to assist you 24/7.
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
              
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>📞 Driver Support:</strong> 1-800-DRIVE-PR (1-800-374-8377)<br/>
                  <strong>📧 Email:</strong> drivers@mypartsrunner.com<br/>
                  <strong>💬 Live Chat:</strong> Available 24/7 for drivers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 