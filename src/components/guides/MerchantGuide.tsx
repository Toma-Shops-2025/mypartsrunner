import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Settings,
  Plus,
  Edit,
  BarChart3,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  Info,
  Zap,
  Shield,
  CreditCard,
  ChevronRight,
  Camera
} from 'lucide-react';

export const MerchantGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('setup');

  const setupSteps = [
    {
      step: 1,
      title: 'Store Registration',
      description: 'Create your store account and verify business',
      icon: <Store className="h-5 w-5" />,
      time: '15 minutes',
      required: true
    },
    {
      step: 2,
      title: 'Business Verification',
      description: 'Submit business license and tax information',
      icon: <Shield className="h-5 w-5" />,
      time: '1-2 business days',
      required: true
    },
    {
      step: 3,
      title: 'Store Profile',
      description: 'Add store details, hours, and location',
      icon: <MapPin className="h-5 w-5" />,
      time: '30 minutes',
      required: true
    },
    {
      step: 4,
      title: 'Product Catalog',
      description: 'Upload products with photos and descriptions',
      icon: <Package className="h-5 w-5" />,
      time: '1-2 hours',
      required: true
    },
    {
      step: 5,
      title: 'Payment Setup',
      description: 'Configure payment methods and bank accounts',
      icon: <CreditCard className="h-5 w-5" />,
      time: '20 minutes',
      required: true
    }
  ];

  const orderManagement = [
    {
      feature: 'Real-Time Notifications',
      description: 'Instant alerts for new orders and updates',
      icon: <Zap className="h-5 w-5" />,
      benefit: 'Respond quickly to customer needs'
    },
    {
      feature: 'Order Dashboard',
      description: 'Centralized view of all orders and status',
      icon: <BarChart3 className="h-5 w-5" />,
      benefit: 'Efficient order processing'
    },
    {
      feature: 'Driver Assignment',
      description: 'Automatic or manual driver assignment',
      icon: <Users className="h-5 w-5" />,
      benefit: 'Optimized delivery routes'
    },
    {
      feature: 'Inventory Updates',
      description: 'Real-time stock level management',
      icon: <Package className="h-5 w-5" />,
      benefit: 'Prevent overselling'
    },
    {
      feature: 'Customer Communication',
      description: 'Direct messaging with customers',
      icon: <MessageSquare className="h-5 w-5" />,
      benefit: 'Better customer service'
    }
  ];

  const growthStrategies = [
    {
      strategy: 'Product Optimization',
      description: 'High-quality photos, detailed descriptions, competitive pricing',
      impact: 'Increase sales by 25-40%'
    },
    {
      strategy: 'Customer Reviews',
      description: 'Encourage satisfied customers to leave positive reviews',
      impact: 'Build trust and attract new customers'
    },
    {
      strategy: 'Promotional Offers',
      description: 'Run sales, discounts, and bundle deals',
      impact: 'Boost order volume by 30-50%'
    },
    {
      strategy: 'Fast Fulfillment',
      description: 'Process orders quickly and accurately',
      impact: 'Improve customer satisfaction and ratings'
    },
    {
      strategy: 'Market Expansion',
      description: 'Add new product categories and services',
      impact: 'Increase revenue streams and customer base'
    }
  ];

  const bestPractices = [
    {
      practice: 'Product Photography',
      description: 'Use high-quality, well-lit photos from multiple angles',
      category: 'Visual Appeal',
      icon: <Camera className="h-4 w-4 text-blue-600" />
    },
    {
      practice: 'Inventory Management',
      description: 'Keep stock levels accurate and update regularly',
      category: 'Operations',
      icon: <Package className="h-4 w-4 text-green-600" />
    },
    {
      practice: 'Customer Service',
      description: 'Respond to inquiries within 2 hours',
      category: 'Service',
      icon: <MessageSquare className="h-4 w-4 text-purple-600" />
    },
    {
      practice: 'Order Processing',
      description: 'Process orders within 1 hour of receipt',
      category: 'Efficiency',
      icon: <Clock className="h-4 w-4 text-orange-600" />
    },
    {
      practice: 'Quality Control',
      description: 'Verify product condition before packaging',
      category: 'Quality',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Merchant Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your complete guide to running a successful store on MyPartsRunner™. 
          Learn how to set up, manage orders, and grow your business.
        </p>
      </div>

      {/* Store Setup Progress */}
      <Card className="border-2 border-green-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-green-700">
            <Store className="h-5 w-5" />
            Store Setup Checklist
          </CardTitle>
          <CardDescription>
            Complete these steps to start selling on MyPartsRunner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {setupSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                    step.required ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <span className={`font-bold ${
                      step.required ? 'text-green-600' : 'text-gray-600'
                    }`}>{step.step}</span>
                  </div>
                  {step.step < 5 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ChevronRight className="h-6 w-6 text-green-300" />
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-lg mb-2 ${
                  step.required ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  {step.icon}
                </div>
                <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="text-xs">
                    {step.time}
                  </Badge>
                  {step.required && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Guide Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Business Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Business License</h4>
                      <p className="text-sm text-gray-600">Valid business license or registration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Tax Information</h4>
                      <p className="text-sm text-gray-600">EIN or SSN for tax reporting</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Physical Location</h4>
                      <p className="text-sm text-gray-600">Storefront or warehouse address</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Contact Information</h4>
                      <p className="text-sm text-gray-600">Business phone and email</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Store Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Store className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Store Profile</h4>
                      <p className="text-sm text-gray-600">Name, description, and branding</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Business Hours</h4>
                      <p className="text-sm text-gray-600">Set your operating schedule</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Service Areas</h4>
                      <p className="text-sm text-gray-600">Define delivery coverage zones</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Pricing Strategy</h4>
                      <p className="text-sm text-gray-600">Set competitive prices and margins</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderManagement.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{feature.feature}</h4>
                        <p className="text-xs text-gray-600 mb-1">{feature.description}</p>
                        <p className="text-xs text-blue-600 font-medium">{feature.benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Workflow</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Received</h4>
                      <p className="text-sm text-gray-600">Instant notification via app and email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Confirmation</h4>
                      <p className="text-sm text-gray-600">Confirm order within 1 hour</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Preparation</h4>
                      <p className="text-sm text-gray-600">Gather and package items</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Driver Pickup</h4>
                      <p className="text-sm text-gray-600">Hand off to assigned driver</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Order Complete</h4>
                      <p className="text-sm text-gray-600">Customer receives delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Growth Strategies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {growthStrategies.map((strategy, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">{strategy.strategy}</h4>
                      <p className="text-sm text-blue-700 mb-2">{strategy.description}</p>
                      <Badge className="bg-blue-200 text-blue-800">
                        {strategy.impact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Marketing Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Promotional Campaigns</h4>
                      <p className="text-sm text-gray-600">Create sales and special offers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Customer Reviews</h4>
                      <p className="text-sm text-gray-600">Build trust and credibility</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Customer Loyalty</h4>
                      <p className="text-sm text-gray-600">Reward repeat customers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Analytics Dashboard</h4>
                      <p className="text-sm text-gray-600">Track performance and trends</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Best Practices Tab */}
        <TabsContent value="best-practices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operational Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestPractices.map((practice, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {practice.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{practice.practice}</h4>
                          <Badge variant="outline" className="text-xs">
                            {practice.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{practice.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Fast Response Times</h4>
                      <p className="text-sm text-gray-600">Respond to inquiries within 2 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Quality Packaging</h4>
                      <p className="text-sm text-gray-600">Ensure items arrive in perfect condition</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Clear Communication</h4>
                      <p className="text-sm text-gray-600">Keep customers informed of order status</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Issue Resolution</h4>
                      <p className="text-sm text-gray-600">Quickly resolve any problems or concerns</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Store className="h-6 w-6" />
          <span>Store Dashboard</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Phone className="h-6 w-6" />
          <span>Merchant Support</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <MessageSquare className="h-6 w-6" />
          <span>Live Chat</span>
        </Button>
      </div>
    </div>
  );
}; 