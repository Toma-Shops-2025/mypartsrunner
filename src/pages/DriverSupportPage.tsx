import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  HelpCircle, 
  Phone, 
  Shield, 
  AlertTriangle,
  MessageSquare,
  FileText,
  Search,
  ChevronRight,
  Clock,
  MapPin,
  Car,
  DollarSign,
  User,
  Settings,
  Send,
  CheckCircle
} from 'lucide-react';

const DriverSupportPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [emergencyVisible, setEmergencyVisible] = useState(false);

  const emergencyContacts = [
    { 
      name: 'Emergency Services', 
      number: '911', 
      description: 'Police, Fire, Medical Emergency',
      urgent: true 
    },
    { 
      name: 'MyPartsRunner Emergency Line', 
      number: '+1 (555) 911-HELP', 
      description: '24/7 driver support for urgent issues',
      urgent: true 
    },
    { 
      name: 'Roadside Assistance', 
      number: '+1 (555) ROADHELP', 
      description: 'Vehicle breakdown, flat tire, battery',
      urgent: false 
    },
    { 
      name: 'Customer Support', 
      number: '+1 (555) SUPPORT', 
      description: 'General questions and assistance',
      urgent: false 
    }
  ];

  const faqCategories = [
    {
      id: 'getting-started',
      icon: User,
      title: 'Getting Started',
      color: 'bg-blue-500',
      questions: [
        {
          q: 'How do I go online and start accepting deliveries?',
          a: 'Tap the toggle switch on your dashboard to go online. Make sure your location services are enabled.'
        },
        {
          q: 'What documents do I need to drive?',
          a: 'Valid driver\'s license, vehicle registration, insurance certificate, and completed background check.'
        },
        {
          q: 'How do I update my vehicle information?',
          a: 'Go to Profile > Vehicle Information and tap "Update Vehicle Info" to make changes.'
        }
      ]
    },
    {
      id: 'deliveries',
      icon: Car,
      title: 'Deliveries',
      color: 'bg-green-500',
      questions: [
        {
          q: 'What should I do if I can\'t find the customer?',
          a: 'Try calling them first. If no response, check special instructions. Use the "Customer Not Available" option in the app.'
        },
        {
          q: 'How do I report a damaged package?',
          a: 'Take photos immediately and use the "Report Issue" button in the delivery details. Contact support if needed.'
        },
        {
          q: 'Can I deliver multiple orders at once?',
          a: 'Yes! The app will optimize your route when you have multiple pickups and deliveries.'
        }
      ]
    },
    {
      id: 'payments',
      icon: DollarSign,
      title: 'Payments & Earnings',
      color: 'bg-purple-500',
      questions: [
        {
          q: 'When do I get paid?',
          a: 'Earnings are deposited weekly on Wednesdays. You can also cash out instantly for a small fee.'
        },
        {
          q: 'How are delivery fees calculated?',
          a: 'Base pay + distance + time + tips + any applicable bonuses or surge pricing.'
        },
        {
          q: 'Can I see my tax documents?',
          a: 'Yes, all tax documents are available in Profile > Payment Methods > Tax Documents.'
        }
      ]
    },
    {
      id: 'safety',
      icon: Shield,
      title: 'Safety & Security',
      color: 'bg-red-500',
      questions: [
        {
          q: 'What safety features are available?',
          a: 'Real-time GPS tracking, emergency contacts, incident reporting, and 24/7 safety support.'
        },
        {
          q: 'What should I do in an emergency?',
          a: 'Call 911 immediately for any emergency. Then contact MyPartsRunner emergency line for support.'
        },
        {
          q: 'How do I report inappropriate customer behavior?',
          a: 'Use the "Report Safety Issue" button immediately. Your safety is our top priority.'
        }
      ]
    }
  ];

  const quickActions = [
    {
      icon: AlertTriangle,
      title: 'Report Safety Issue',
      description: 'Immediate safety concerns',
      color: 'bg-red-500',
      action: () => setEmergencyVisible(true)
    },
    {
      icon: Car,
      title: 'Vehicle Problem',
      description: 'Breakdown or maintenance',
      color: 'bg-orange-500',
      action: () => window.open('tel:+15555ROADHELP')
    },
    {
      icon: MessageSquare,
      title: 'Customer Issue',
      description: 'Delivery or customer problem',
      color: 'bg-blue-500',
      action: () => setSelectedCategory('deliveries')
    },
    {
      icon: DollarSign,
      title: 'Payment Question',
      description: 'Earnings or payment issue',
      color: 'bg-green-500',
      action: () => setSelectedCategory('payments')
    }
  ];

  const handleSendMessage = () => {
    if (supportMessage.trim()) {
      // In a real app, this would send to support system
      alert('Message sent to support team! We\'ll respond within 1 hour.');
      setSupportMessage('');
    }
  };

  const filteredFAQs = selectedCategory 
    ? faqCategories.filter(cat => cat.id === selectedCategory)
    : faqCategories;

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Support Center</h1>
        <p className="text-gray-600">Get help when you need it most</p>
      </div>

      {/* Emergency Alert */}
      {emergencyVisible && (
        <Card className="mb-6 border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-800">Emergency Assistance</h3>
                <p className="text-sm text-red-700">For immediate help, use the contacts below</p>
              </div>
            </div>
            <div className="space-y-2">
              {emergencyContacts.filter(contact => contact.urgent).map((contact, index) => (
                <Button
                  key={index}
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  {contact.name}: {contact.number}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-3"
              onClick={() => setEmergencyVisible(false)}
            >
              Close Emergency Panel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center gap-2 p-4 border-2 border-transparent hover:border-gray-200 rounded-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {emergencyContacts.filter(contact => !contact.urgent).map((contact, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start"
                  onClick={() => window.open(`tel:${contact.number}`)}
                >
                  <div className="font-medium text-sm">{contact.name}</div>
                  <div className="text-xs text-gray-600">{contact.description}</div>
                  <div className="text-xs text-blue-600 mt-1">{contact.number}</div>
                </Button>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Send a Message</label>
              <Textarea
                placeholder="Describe your issue or question..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="mb-3"
              />
              <Button onClick={handleSendMessage} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Response time: Usually within 1 hour</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Search */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Selection */}
          {!selectedCategory && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:border-gray-300 transition-all"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${category.color}`}>
                    <category.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-sm">{category.title}</div>
                    <div className="text-xs text-gray-600">{category.questions.length} questions</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Back Button */}
          {selectedCategory && (
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCategory(null)}
              className="mb-4"
            >
              ← Back to Categories
            </Button>
          )}

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFAQs.map((category) =>
              category.questions
                .filter(q => 
                  !searchQuery || 
                  q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  q.a.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((faq, index) => (
                  <details key={`${category.id}-${index}`} className="border rounded-lg">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                      <span className="font-medium text-sm">{faq.q}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </summary>
                    <div className="p-4 pt-0 text-sm text-gray-600 border-t">
                      {faq.a}
                    </div>
                  </details>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Additional Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-between">
              <span>Driver Handbook</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Safety Guidelines</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Tax Information</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Community Forum</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Safety Reminder */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-800">Your Safety Matters</div>
              <div className="text-sm text-blue-700">
                If you ever feel unsafe, don't hesitate to contact emergency services or our 24/7 safety line.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverSupportPage; 