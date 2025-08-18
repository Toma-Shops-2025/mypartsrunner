import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  User, 
  Truck, 
  Store, 
  Crown, 
  Search,
  HelpCircle,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Video,
  ExternalLink,
  ChevronRight,
  CreditCard,
  Package,
  Shield,
  Settings,
  AlertTriangle,
  Users
} from 'lucide-react';
import { HelpCenter } from '@/components/HelpCenter';
import { CustomerGuide } from '@/components/guides/CustomerGuide';
import { DriverGuide } from '@/components/guides/DriverGuide';
import { MerchantGuide } from '@/components/guides/MerchantGuide';
import { OwnerGuide } from '@/components/guides/OwnerGuide';

export const HelpPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('help-center');

  const quickLinks = [
    {
      title: 'Getting Started',
      description: 'New user setup and first steps',
      icon: <BookOpen className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-700',
      userTypes: ['customer', 'driver', 'merchant']
    },
    {
      title: 'Account Management',
      description: 'Profile settings and preferences',
      icon: <User className="h-6 w-6" />,
      color: 'bg-green-100 text-green-700',
      userTypes: ['customer', 'driver', 'merchant', 'admin']
    },
    {
      title: 'Payment & Billing',
      description: 'Payment methods and billing questions',
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-700',
      userTypes: ['customer', 'driver', 'merchant']
    },
    {
      title: 'Delivery & Orders',
      description: 'Order tracking and delivery issues',
      icon: <Package className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-700',
      userTypes: ['customer', 'driver', 'merchant']
    },
    {
      title: 'Safety & Security',
      description: 'Safety guidelines and security features',
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-red-100 text-red-700',
      userTypes: ['driver', 'merchant', 'admin']
    },
    {
      title: 'Technical Support',
      description: 'App issues and technical problems',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-gray-100 text-gray-700',
      userTypes: ['customer', 'driver', 'merchant', 'admin']
    }
  ];

  const contactMethods = [
    {
      method: 'Phone Support',
      contact: '(502) 812-2456',
      description: 'Speak directly with our support team',
      icon: <Phone className="h-5 w-5" />,
      availability: 'Mon-Fri 8AM-8PM, Sat 9AM-6PM',
      response: 'Immediate'
    },
    {
      method: 'Live Chat',
      contact: 'Available in app',
      description: 'Real-time chat with support agents',
      icon: <MessageSquare className="h-5 w-5" />,
      availability: '24/7',
      response: 'Within 2 minutes'
    },
    {
      method: 'Email Support',
      contact: 'support@mypartsrunner.com',
      description: 'Send detailed questions and issues',
      icon: <Mail className="h-5 w-5" />,
      availability: '24/7',
      response: 'Within 4 hours'
    },
    {
      method: 'Emergency',
      contact: '911 for emergencies',
      description: 'For safety and medical emergencies',
      icon: <AlertTriangle className="h-5 w-5" />,
      availability: '24/7',
      response: 'Immediate'
    }
  ];

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features',
      icon: <Video className="h-5 w-5" />,
      link: '#',
      type: 'Learning'
    },
    {
      title: 'FAQ Database',
      description: 'Searchable answers to common questions',
      icon: <FileText className="h-5 w-5" />,
      link: '#',
      type: 'Reference'
    },
    {
      title: 'User Manuals',
      description: 'Comprehensive documentation for each role',
      icon: <BookOpen className="h-5 w-5" />,
      link: '#',
      type: 'Documentation'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users and share tips',
      icon: <Users className="h-5 w-5" />,
      link: '#',
      type: 'Community'
    }
  ];

  return (
    <div className="min-h-screen animated-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
      </div>
      <div className="container mx-auto py-10 space-y-8 relative z-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Help & Support Center</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to know about MyPartsRunner™. Find answers, learn features, 
          and get support when you need it.
        </p>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Quick Help Links</CardTitle>
          <CardDescription>
            Find help for common topics and issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex-col items-start gap-3 text-left"
              >
                <div className={`p-2 rounded-lg ${link.color}`}>
                  {link.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{link.title}</h4>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Help Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="help-center">Help Center</TabsTrigger>
          <TabsTrigger value="customer-guide">Customer Guide</TabsTrigger>
          <TabsTrigger value="driver-guide">Driver Guide</TabsTrigger>
          <TabsTrigger value="merchant-guide">Merchant Guide</TabsTrigger>
          <TabsTrigger value="owner-guide">Owner Guide</TabsTrigger>
        </TabsList>

        {/* Help Center Tab */}
        <TabsContent value="help-center">
          <HelpCenter />
        </TabsContent>

        {/* Customer Guide Tab */}
        <TabsContent value="customer-guide">
          <CustomerGuide />
        </TabsContent>

        {/* Driver Guide Tab */}
        <TabsContent value="driver-guide">
          <DriverGuide />
        </TabsContent>

        {/* Merchant Guide Tab */}
        <TabsContent value="merchant-guide">
          <MerchantGuide />
        </TabsContent>

        {/* Owner Guide Tab */}
        <TabsContent value="owner-guide">
          <OwnerGuide />
        </TabsContent>
      </Tabs>

      {/* Contact Information */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-700">Get Help When You Need It</CardTitle>
          <CardDescription>
            Multiple ways to reach our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-4">
                <div className="p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  {method.icon}
                </div>
                <h4 className="font-semibold mb-2">{method.method}</h4>
                <p className="text-lg font-medium text-blue-600 mb-2">{method.contact}</p>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <p><strong>Availability:</strong> {method.availability}</p>
                  <p><strong>Response:</strong> {method.response}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Additional Resources</CardTitle>
          <CardDescription>
            More ways to learn and get help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((resource, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {resource.icon}
                  </div>
                  <Badge variant="outline">{resource.type}</Badge>
                </div>
                <h4 className="font-semibold mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Access Resource
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Team Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            Meet Our Support Team
          </h3>
          <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
            Our dedicated support team is here to help you succeed with MyPartsRunner. 
            Whether you're a customer, driver, merchant, or business owner, we're committed 
            to providing exceptional service and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Phone className="h-4 w-4 mr-2" />
              Call Support Team
            </Button>
            <Button variant="outline" className="border-blue-300 text-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start Live Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage; 