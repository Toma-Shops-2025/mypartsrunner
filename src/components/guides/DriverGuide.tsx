import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  DollarSign, 
  MapPin, 
  Clock, 
  Star, 
  Shield,
  Package,
  CreditCard,
  User,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Award,
  Phone,
  MessageSquare,
  Wifi,
  WifiOff,
  Camera,
  FileText,
  ChevronRight
} from 'lucide-react';

export const DriverGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('onboarding');

  const onboardingSteps = [
    {
      step: 1,
      title: 'Account Verification',
      description: 'Complete background check and identity verification',
      icon: <Shield className="h-5 w-5" />,
      time: '1-2 business days',
      required: true
    },
    {
      step: 2,
      title: 'Document Upload',
      description: 'Upload driver\'s license, insurance, and vehicle registration',
      icon: <FileText className="h-5 w-5" />,
      time: '30 minutes',
      required: true
    },
    {
      step: 3,
      title: 'Training Completion',
      description: 'Complete safety and delivery training modules',
      icon: <Award className="h-5 w-5" />,
      time: '2-3 hours',
      required: true
    },
    {
      step: 4,
      title: 'Vehicle Inspection',
      description: 'Ensure vehicle meets safety requirements',
      icon: <Truck className="h-5 w-5" />,
      time: '15 minutes',
      required: true
    },
    {
      step: 5,
      title: 'First Delivery',
      description: 'Accept and complete your first delivery',
      icon: <Package className="h-5 w-5" />,
      time: 'Varies',
      required: true
    }
  ];

  const earningsTips = [
    {
      tip: 'Peak Hour Driving',
      description: 'Work during lunch (11-2) and dinner (5-8) for higher demand',
      earnings: '+$15-25/hour'
    },
    {
      tip: 'Strategic Location',
      description: 'Position yourself in high-demand areas like downtown',
      earnings: '+$10-20/hour'
    },
    {
      tip: 'Multi-Delivery Routes',
      description: 'Accept multiple deliveries in the same direction',
      earnings: '+$5-15 per delivery'
    },
    {
      tip: 'Maintain High Rating',
      description: 'Keep 4.8+ rating for priority access to premium deliveries',
      earnings: '+$20-30/hour'
    },
    {
      tip: 'Weekend Premium',
      description: 'Work weekends when demand is highest',
      earnings: '+$25-35/hour'
    }
  ];

  const safetyGuidelines = [
    {
      guideline: 'Vehicle Maintenance',
      description: 'Regular inspections and maintenance checks',
      priority: 'High',
      icon: <Truck className="h-4 w-4 text-red-600" />
    },
    {
      guideline: 'Defensive Driving',
      description: 'Always maintain safe following distance',
      priority: 'High',
      icon: <Shield className="h-4 w-4 text-red-600" />
    },
    {
      guideline: 'Customer Interaction',
      description: 'Professional communication and conflict resolution',
      priority: 'Medium',
      icon: <User className="h-4 w-4 text-yellow-600" />
    },
    {
      guideline: 'Package Handling',
      description: 'Proper lifting techniques and secure loading',
      priority: 'Medium',
      icon: <Package className="h-4 w-4 text-yellow-600" />
    },
    {
      guideline: 'Emergency Procedures',
      description: 'Know how to handle accidents and emergencies',
      priority: 'High',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  ];

  const appFeatures = [
    {
      feature: 'Online/Offline Toggle',
      description: 'Control when you receive delivery requests',
      icon: <Wifi className="h-5 w-5" />,
      benefit: 'Manage your availability'
    },
    {
      feature: 'Real-Time Tracking',
      description: 'GPS tracking for accurate delivery times',
      icon: <MapPin className="h-5 w-5" />,
      benefit: 'Better customer experience'
    },
    {
      feature: 'Earnings Dashboard',
      description: 'Track your income and performance metrics',
      icon: <DollarSign className="h-5 w-5" />,
      benefit: 'Monitor your success'
    },
    {
      feature: 'Safety Features',
      description: 'Emergency contacts and incident reporting',
      icon: <Shield className="h-5 w-5" />,
      benefit: 'Stay protected on the road'
    },
    {
      feature: 'Training Modules',
      description: 'Continuous learning and skill development',
      icon: <Award className="h-5 w-5" />,
      benefit: 'Improve your performance'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Driver Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your complete guide to becoming a successful MyPartsRunner™ driver. 
          Learn how to maximize earnings, stay safe, and provide excellent service.
        </p>
      </div>

      {/* Onboarding Progress */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-blue-700">
            <User className="h-5 w-5" />
            Driver Onboarding Checklist
          </CardTitle>
          <CardDescription>
            Complete these steps to start earning with MyPartsRunner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {onboardingSteps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                    step.required ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <span className={`font-bold ${
                      step.required ? 'text-blue-600' : 'text-gray-600'
                    }`}>{step.step}</span>
                  </div>
                  {step.step < 5 && (
                    <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                      <ChevronRight className="h-6 w-6 text-blue-300" />
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-lg mb-2 ${
                  step.required ? 'bg-blue-50' : 'bg-gray-50'
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
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
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
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="app">App Guide</TabsTrigger>
        </TabsList>

        {/* Onboarding Tab */}
        <TabsContent value="onboarding" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Driver's License</h4>
                      <p className="text-sm text-gray-600">Valid, unexpired driver's license</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Auto Insurance</h4>
                      <p className="text-sm text-gray-600">Proof of current insurance coverage</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vehicle Registration</h4>
                      <p className="text-sm text-gray-600">Current registration for your vehicle</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Camera className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vehicle Photos</h4>
                      <p className="text-sm text-gray-600">Clear photos of your vehicle</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Safety Training</h4>
                      <p className="text-sm text-gray-600">Defensive driving and safety protocols</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Delivery Training</h4>
                      <p className="text-sm text-gray-600">Best practices for package handling</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Customer Service</h4>
                      <p className="text-sm text-gray-600">Professional communication skills</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">App Navigation</h4>
                      <p className="text-sm text-gray-600">How to use the driver app effectively</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earnings Structure</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Base Delivery Fee</h4>
                      <p className="text-sm text-gray-600">$5-15 per delivery depending on distance</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Distance Bonus</h4>
                      <p className="text-sm text-gray-600">Additional $0.50 per mile over 5 miles</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Peak Hour Bonus</h4>
                      <p className="text-sm text-gray-600">20% bonus during high-demand hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Rating Bonus</h4>
                      <p className="text-sm text-gray-600">$2 bonus for 5-star ratings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Weekly Payouts</h4>
                      <p className="text-sm text-gray-600">Automatic transfers every Monday</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Instant Payouts</h4>
                      <p className="text-sm text-gray-600">Immediate transfers (2.5% fee)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Multiple Options</h4>
                      <p className="text-sm text-gray-600">PayPal, Bank, Cash App, Venmo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Earnings Tracking</h4>
                      <p className="text-sm text-gray-600">Real-time earnings and analytics</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Money-Saving Tips */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle className="text-lg text-green-700">Earnings Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earningsTips.map((tip, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">{tip.tip}</h4>
                    <p className="text-sm text-green-700 mb-2">{tip.description}</p>
                    <Badge className="bg-green-200 text-green-800">
                      {tip.earnings}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Safety Protocols</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {safetyGuidelines.map((guideline, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {guideline.icon}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{guideline.guideline}</h4>
                          <Badge className={
                            guideline.priority === 'High' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {guideline.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{guideline.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Procedures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Accident Response</h4>
                      <p className="text-sm text-gray-600">Call 911, document scene, contact support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Medical Emergency</h4>
                      <p className="text-sm text-gray-600">Seek medical attention, notify support</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Package Issues</h4>
                      <p className="text-sm text-gray-600">Document damage, contact customer service</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Customer Conflicts</h4>
                      <p className="text-sm text-gray-600">Stay professional, contact support if needed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* App Guide Tab */}
        <TabsContent value="app" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key App Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appFeatures.map((feature, index) => (
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
                <CardTitle className="text-lg">App Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Wifi className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Dashboard</h4>
                      <p className="text-sm text-gray-600">Main hub for status and quick actions</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Deliveries</h4>
                      <p className="text-sm text-gray-600">View and manage active deliveries</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Earnings</h4>
                      <p className="text-sm text-gray-600">Track income and payment methods</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Profile</h4>
                      <p className="text-sm text-gray-600">Manage personal and vehicle information</p>
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
          <Truck className="h-6 w-6" />
          <span>Go Online</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Phone className="h-6 w-6" />
          <span>Driver Support</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <MessageSquare className="h-6 w-6" />
          <span>Live Chat</span>
        </Button>
      </div>
    </div>
  );
}; 