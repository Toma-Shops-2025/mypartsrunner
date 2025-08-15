import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Clock, 
  Star,
  Smartphone,
  Monitor,
  Code,
  Palette,
  BarChart3,
  Shield,
  Truck,
  Package,
  Copy,
  Play,
  ExternalLink,
  MessageSquare,
  Phone,
  Calendar,
  Settings,
  Sparkles,
  Rocket,
  Target,
  Award,
  Heart,
  Gift
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MerchantApplication {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  businessType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  currentPlatform: string;
  monthlyOrders: string;
  integrationType: 'widget' | 'embedded' | 'both' | 'full-service';
  needsAssistance: boolean;
  preferredContactMethod: 'email' | 'phone' | 'demo';
  additionalInfo: string;
}

export default function MerchantApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [application, setApplication] = useState<MerchantApplication>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    businessType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    currentPlatform: '',
    monthlyOrders: '',
    integrationType: 'both',
    needsAssistance: true,
    preferredContactMethod: 'demo',
    additionalInfo: ''
  });

  const handleInputChange = (field: keyof MerchantApplication, value: any) => {
    setApplication(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      // Mock submission
      console.log('Merchant application:', application);
      
      toast({
        title: "Application Submitted! 🎉",
        description: "We'll contact you within 24 hours to set up your integration.",
        variant: "default"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Application error:', error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact support",
        variant: "destructive"
      });
    }
  };

  const steps = [
    { title: "Choose Integration", icon: <Target className="h-5 w-5" /> },
    { title: "Business Info", icon: <Globe className="h-5 w-5" /> },
    { title: "Setup Preferences", icon: <Settings className="h-5 w-5" /> },
    { title: "Launch! 🚀", icon: <Rocket className="h-5 w-5" /> }
  ];

  const benefits = [
    {
      icon: <Clock className="h-6 w-6 text-green-500" />,
      title: "5-Minute Setup",
      description: "Go live with delivery in under 5 minutes"
    },
    {
      icon: <Code className="h-6 w-6 text-blue-500" />,
      title: "Zero Coding Required",
      description: "We handle all technical integration"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-500" />,
      title: "Instant Revenue",
      description: "Start earning delivery fees immediately"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-500" />,
      title: "30% More Sales",
      description: "Avg increase in customer orders"
    }
  ];

  const successStories = [
    {
      name: "AutoZone Store #1523",
      increase: "+45%",
      metric: "Sales",
      quote: "Best decision we ever made. Customers love the fast delivery!"
    },
    {
      name: "O'Reilly Auto Parts",
      increase: "+67%",
      metric: "New Customers",
      quote: "Integration was seamless. Started seeing results day one."
    },
    {
      name: "NAPA Auto Center",
      increase: "+89%",
      metric: "Revenue",
      quote: "MyPartsRunner transformed our business completely."
    }
  ];

  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              REVOLUTIONARY INTEGRATION SYSTEM
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Don't Change Anything.
              </span>
              <br />
              <span className="text-gray-900">Just Add Delivery.</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Keep your existing website exactly as it is. We'll add fast delivery to your customers 
              in under 5 minutes with <strong>zero product entry required</strong>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 text-lg"
                onClick={() => setCurrentStep(1)}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Integration (FREE)
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowDemo(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-6 border-2 border-transparent hover:border-blue-200 transition-all">
                <CardContent className="pt-4">
                  <div className="flex justify-center mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Integration Options */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Choose Your Integration Style</h2>
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Embedded Store */}
              <Card 
                className={`cursor-pointer transition-all p-6 ${
                  application.integrationType === 'embedded' || application.integrationType === 'both'
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleInputChange('integrationType', 'embedded')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Monitor className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Embedded Store</CardTitle>
                  <CardDescription>Your website inside MyPartsRunner</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Full website embedded</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom URL: mypartsrunner.com/stores/yourstore</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Delivery overlay added automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Zero changes to your current site</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800 font-medium">
                      Perfect for: Driving new customers to your products
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Widget */}
              <Card 
                className={`cursor-pointer transition-all p-6 ${
                  application.integrationType === 'widget' || application.integrationType === 'both'
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => handleInputChange('integrationType', 'widget')}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smartphone className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Smart Widget</CardTitle>
                  <CardDescription>Add delivery to your existing site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">One line of code integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Auto-detects products on your site</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Floating "Deliver Fast" button</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Works with ANY website platform</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium">
                      Perfect for: Adding delivery to existing customers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Both Option */}
            <Card 
              className={`cursor-pointer transition-all p-6 mt-6 ${
                application.integrationType === 'both'
                  ? 'ring-2 ring-green-500 bg-green-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleInputChange('integrationType', 'both')}
            >
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">🎉 RECOMMENDED: Get Both!</h3>
                  <p className="text-gray-600 mb-4">
                    Maximize your reach with embedded store + widget integration
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Embedded Store Benefits:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Attract new customers through MyPartsRunner</li>
                        <li>• Professional delivery-focused storefront</li>
                        <li>• SEO benefits from our domain authority</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Widget Benefits:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Convert existing website visitors</li>
                        <li>• Keep customers on YOUR domain</li>
                        <li>• Seamless integration with current flow</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm text-green-800 font-bold">
                      🚀 Double your delivery potential - Same easy setup!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Success Stories */}
          <div className="max-w-6xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Merchant Success Stories</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {successStories.map((story, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="pt-4">
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-green-600 mb-1">{story.increase}</div>
                      <div className="text-sm text-gray-600">{story.metric} Increase</div>
                    </div>
                    <h3 className="font-bold mb-2">{story.name}</h3>
                    <p className="text-gray-600 text-sm italic">"{story.quote}"</p>
                    <div className="flex justify-center mt-3">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-xl opacity-90 mb-8">
              Join hundreds of merchants already boosting sales with fast delivery
            </p>
            
            <Alert className="bg-white/10 border-white/20 text-white max-w-2xl mx-auto mb-8">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-left">
                <strong>🔒 We Handle Everything:</strong> Technical setup, testing, go-live support, 
                and ongoing optimization. You focus on your business, we handle the delivery magic.
              </AlertDescription>
            </Alert>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                onClick={() => setCurrentStep(1)}
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Your Integration
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg"
              >
                <Phone className="mr-2 h-5 w-5" />
                Talk to Expert
              </Button>
            </div>
          </div>
        </div>

        {/* Demo Modal */}
        {showDemo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">See The Magic In Action</h3>
                  <Button variant="ghost" onClick={() => setShowDemo(false)}>
                    ×
                  </Button>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <Play className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                  <h4 className="text-xl font-bold mb-2">Interactive Demo</h4>
                  <p className="text-gray-600 mb-4">
                    See how the widget detects products and creates instant delivery options
                  </p>
                  <Button className="mb-4">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Launch Demo Site
                  </Button>
                  <div className="text-sm text-gray-500">
                    Demo includes: Widget installation, product detection, customer flow
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Application Steps (1-3)
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStep - 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className="text-xs mt-1 text-center">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Merchant Application - Step {currentStep} of {steps.length - 1}</CardTitle>
            <CardDescription>
              We'll have you up and running with delivery in no time!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {currentStep === 1 && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={application.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="AutoZone Store #1523"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={application.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      placeholder="John Smith"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={application.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@autozone.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={application.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Current Website *</Label>
                  <Input
                    id="website"
                    value={application.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.autozone.com/store/1523"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select
                    value={application.businessType}
                    onValueChange={(value) => handleInputChange('businessType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto-parts">Auto Parts Store</SelectItem>
                      <SelectItem value="hardware">Hardware Store</SelectItem>
                      <SelectItem value="automotive">Automotive Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={application.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={application.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Los Angeles"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={application.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={application.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="90210"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <Label htmlFor="currentPlatform">Current Website Platform</Label>
                  <Select
                    value={application.currentPlatform}
                    onValueChange={(value) => handleInputChange('currentPlatform', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shopify">Shopify</SelectItem>
                      <SelectItem value="woocommerce">WooCommerce</SelectItem>
                      <SelectItem value="magento">Magento</SelectItem>
                      <SelectItem value="bigcommerce">BigCommerce</SelectItem>
                      <SelectItem value="squarespace">Squarespace</SelectItem>
                      <SelectItem value="custom">Custom Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="none">No Website Yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthlyOrders">Monthly Orders (Estimate)</Label>
                  <Select
                    value={application.monthlyOrders}
                    onValueChange={(value) => handleInputChange('monthlyOrders', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-10">0-10 orders/month</SelectItem>
                      <SelectItem value="11-50">11-50 orders/month</SelectItem>
                      <SelectItem value="51-100">51-100 orders/month</SelectItem>
                      <SelectItem value="101-500">101-500 orders/month</SelectItem>
                      <SelectItem value="500+">500+ orders/month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <Switch
                      checked={application.needsAssistance}
                      onCheckedChange={(checked) => handleInputChange('needsAssistance', checked)}
                    />
                    <Label className="font-medium">🛠️ I want MyPartsRunner to handle the integration for me</Label>
                  </div>
                  <p className="text-sm text-blue-700">
                    <strong>Recommended:</strong> Our team will set up everything for you - widget installation, 
                    testing, and go-live. Completely hands-off for you!
                  </p>
                </div>

                <div>
                  <Label>Preferred Contact Method for Setup</Label>
                  <div className="grid gap-3 mt-2">
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer ${
                        application.preferredContactMethod === 'demo' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('preferredContactMethod', 'demo')}
                    >
                      <div className="flex items-center gap-3">
                        <Monitor className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Live Demo & Setup Call</div>
                          <div className="text-sm text-gray-600">See it working + we set it up together (30 min)</div>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer ${
                        application.preferredContactMethod === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('preferredContactMethod', 'phone')}
                    >
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Phone Setup</div>
                          <div className="text-sm text-gray-600">Quick call to get you started (15 min)</div>
                        </div>
                      </div>
                    </div>
                    <div 
                      className={`border rounded-lg p-3 cursor-pointer ${
                        application.preferredContactMethod === 'email' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('preferredContactMethod', 'email')}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Email Instructions</div>
                          <div className="text-sm text-gray-600">Step-by-step guide sent to your inbox</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={application.additionalInfo}
                    onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                    placeholder="Any specific requirements, questions, or goals you'd like us to know about..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Ready to Launch! 🚀</h2>
                <p className="text-gray-600 mb-6">
                  Review your application details and submit to get started.
                </p>

                <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4 mb-6">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div><strong>Business:</strong> {application.businessName}</div>
                    <div><strong>Contact:</strong> {application.contactName}</div>
                    <div><strong>Website:</strong> {application.website}</div>
                    <div><strong>Integration:</strong> {
                      application.integrationType === 'both' ? 'Embedded Store + Widget' :
                      application.integrationType === 'embedded' ? 'Embedded Store' :
                      application.integrationType === 'widget' ? 'Smart Widget' : 'Full Service'
                    }</div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Setup Assistance: {application.needsAssistance ? 'Yes - Handle it for me!' : 'Self-service'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Contact Method: {
                        application.preferredContactMethod === 'demo' ? 'Live Demo & Setup' :
                        application.preferredContactMethod === 'phone' ? 'Phone Call' : 'Email'
                      }</span>
                    </div>
                  </div>
                </div>

                <Alert className="mb-6">
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Next Steps:</strong> We'll contact you within 24 hours to schedule your setup. 
                    Most merchants are live and taking delivery orders within 48 hours!
                  </AlertDescription>
                </Alert>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white"
                  onClick={handleSubmit}
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Submit Application & Get Started!
                </Button>
              </div>
            )}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                  Back
                </Button>
              )}
              {currentStep < 3 && (
                <Button 
                  className="ml-auto"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 