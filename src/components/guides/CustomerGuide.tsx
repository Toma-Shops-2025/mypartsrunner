import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star, 
  Truck,
  Package,
  CreditCard,
  User,
  Heart,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Phone,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

export const CustomerGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('getting-started');

  const quickSteps = [
    {
      step: 1,
      title: 'Create Account',
      description: 'Sign up with email and verify your account',
      icon: <User className="h-5 w-5" />,
      time: '2 minutes'
    },
    {
      step: 2,
      title: 'Find Your Store',
      description: 'Search for auto parts or hardware stores near you',
      icon: <Search className="h-5 w-5" />,
      time: '1 minute'
    },
    {
      step: 3,
      title: 'Browse & Select',
      description: 'Find the parts you need and add to cart',
      icon: <Package className="h-5 w-5" />,
      time: '5-10 minutes'
    },
    {
      step: 4,
      title: 'Checkout & Pay',
      description: 'Enter delivery address and payment info',
      icon: <CreditCard className="h-5 w-5" />,
      time: '3 minutes'
    },
    {
      step: 5,
      title: 'Track Delivery',
      description: 'Follow your order in real-time',
      icon: <Truck className="h-5 w-5" />,
      time: 'Ongoing'
    }
  ];

  const moneySavingTips = [
    {
      tip: 'Bundle Orders',
      description: 'Order multiple items together to save on delivery fees',
      savings: 'Save $3-5 per order'
    },
    {
      tip: 'Use Promo Codes',
      description: 'Check for available discounts and promotional offers',
      savings: 'Save 10-25%'
    },
    {
      tip: 'Choose Standard Delivery',
      description: 'Opt for standard delivery instead of express when possible',
      savings: 'Save $2-4 per order'
    },
    {
      tip: 'Shop Local',
      description: 'Choose stores closer to you for lower delivery costs',
      savings: 'Save $1-3 per order'
    },
    {
      tip: 'Join Rewards Program',
      description: 'Earn points on every purchase for future discounts',
      savings: 'Save 5-15% over time'
    }
  ];

  const commonIssues = [
    {
      issue: 'Item Out of Stock',
      solution: 'Contact the store directly or wait for restock notification',
      icon: <AlertCircle className="h-4 w-4 text-orange-600" />
    },
    {
      issue: 'Delivery Delayed',
      solution: 'Check tracking updates or contact driver support',
      icon: <Clock className="h-4 w-4 text-yellow-600" />
    },
    {
      issue: 'Wrong Item Received',
      solution: 'Report issue within 24 hours for replacement/refund',
      icon: <Package className="h-4 w-4 text-red-600" />
    },
    {
      issue: 'Payment Failed',
      solution: 'Verify card details or try alternative payment method',
      icon: <CreditCard className="h-4 w-4 text-red-600" />
    },
    {
      issue: 'Store Not Responding',
      solution: 'Contact MyPartsRunner support for assistance',
      icon: <Phone className="h-4 w-4 text-blue-600" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Customer Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about ordering auto parts and hardware with MyPartsRunner™. 
          Get started quickly and save money on every order.
        </p>
      </div>

      {/* Quick Start Steps */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-blue-700">
            <Zap className="h-5 w-5" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>
            Get your first order delivered in under 20 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {quickSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="font-bold text-blue-600">{step.step}</span>
                  </div>
                  {step.step < 5 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ChevronRight className="h-6 w-6 text-blue-300" />
                    </div>
                  )}
                </div>
                <div className="p-2 bg-blue-50 rounded-lg mb-2">
                  {step.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                <Badge variant="outline" className="text-xs">
                  {step.time}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Guide Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="ordering">Ordering</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sign Up</h4>
                      <p className="text-sm text-gray-600">Use your email and create a secure password</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Verify Email</h4>
                      <p className="text-sm text-gray-600">Check your inbox and click the verification link</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Complete Profile</h4>
                      <p className="text-sm text-gray-600">Add your name, phone, and delivery address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Add Payment Method</h4>
                      <p className="text-sm text-gray-600">Save your credit card or PayPal for quick checkout</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finding Stores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Location-Based Search</h4>
                      <p className="text-sm text-gray-600">Find stores within your delivery area</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Product Search</h4>
                      <p className="text-sm text-gray-600">Search for specific parts or brands</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Filter className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Advanced Filters</h4>
                      <p className="text-sm text-gray-600">Filter by store type, rating, and delivery time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Store Ratings</h4>
                      <p className="text-sm text-gray-600">Choose stores with high customer satisfaction</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ordering Tab */}
        <TabsContent value="ordering" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Shopping Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Browse Products</h4>
                      <p className="text-sm text-gray-600">View product details, photos, and specifications</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Add to Cart</h4>
                      <p className="text-sm text-gray-600">Select quantity and add items to your cart</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Save Favorites</h4>
                      <p className="text-sm text-gray-600">Create wishlists for future purchases</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Review Cart</h4>
                      <p className="text-sm text-gray-600">Verify items, quantities, and total cost</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Checkout Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Delivery Address</h4>
                      <p className="text-sm text-gray-600">Confirm or add new delivery location</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Delivery Time</h4>
                      <p className="text-sm text-gray-600">Choose standard or express delivery</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Payment Method</h4>
                      <p className="text-sm text-gray-600">Use saved card or add new payment option</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Confirmation</h4>
                      <p className="text-sm text-gray-600">Review and confirm your order</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Delivery Tab */}
        <TabsContent value="delivery" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tracking Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Real-Time Updates</h4>
                      <p className="text-sm text-gray-600">Track driver location and delivery progress</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Estimated Arrival</h4>
                      <p className="text-sm text-gray-600">Get accurate delivery time estimates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Driver Communication</h4>
                      <p className="text-sm text-gray-600">Message driver for delivery instructions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Delivery Confirmation</h4>
                      <p className="text-sm text-gray-600">Confirm receipt and rate your experience</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Delivery Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Standard Delivery</h4>
                      <p className="text-sm text-gray-600">2-4 hours, lowest cost option</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Express Delivery</h4>
                      <p className="text-sm text-gray-600">1-2 hours, premium pricing</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Contactless Delivery</h4>
                      <p className="text-sm text-gray-600">Leave at door, no contact required</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Specific Instructions</h4>
                      <p className="text-sm text-gray-600">Add delivery notes for driver</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Phone Support</h4>
                      <p className="text-sm text-gray-600">Call (502) 812-2456 for immediate help</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Live Chat</h4>
                      <p className="text-sm text-gray-600">Chat with support agents in real-time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Issues</h4>
                      <p className="text-sm text-gray-600">Report problems within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">FAQ Section</h4>
                      <p className="text-sm text-gray-600">Find answers to common questions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commonIssues.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {item.icon}
                      <div>
                        <h4 className="font-medium text-sm">{item.issue}</h4>
                        <p className="text-xs text-gray-600">{item.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Money Saving Tips */}
      <Card className="border-2 border-green-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-green-700">
            <DollarSign className="h-5 w-5" />
            Money-Saving Tips
          </CardTitle>
          <CardDescription>
            Maximize your savings on every order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moneySavingTips.map((tip, index) => (
              <div key={index} className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">{tip.tip}</h4>
                <p className="text-sm text-green-700 mb-2">{tip.description}</p>
                <Badge className="bg-green-200 text-green-800">
                  {tip.savings}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-20 flex-col gap-2" variant="outline">
          <ShoppingCart className="h-6 w-6" />
          <span>Start Shopping</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Phone className="h-6 w-6" />
          <span>Call Support</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <MessageSquare className="h-6 w-6" />
          <span>Live Chat</span>
        </Button>
      </div>
    </div>
  );
}; 