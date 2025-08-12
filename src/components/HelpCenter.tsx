import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  User, 
  Truck, 
  Store, 
  Crown,
  HelpCircle,
  Video,
  FileText,
  Phone,
  MessageSquare,
  ExternalLink,
  ChevronRight,
  Star,
  Zap,
  Shield,
  DollarSign,
  ShoppingCart,
  MapPin,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'getting-started' | 'features' | 'troubleshooting' | 'tips';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  userTypes: ('customer' | 'driver' | 'merchant' | 'admin')[];
}

const helpSections: HelpSection[] = [
  // Getting Started
  {
    id: 'account-setup',
    title: 'Account Setup & Registration',
    description: 'Learn how to create and configure your account',
    icon: <User className="h-5 w-5" />,
    category: 'getting-started',
    difficulty: 'beginner',
    userTypes: ['customer', 'driver', 'merchant', 'admin']
  },
  {
    id: 'first-order',
    title: 'Placing Your First Order',
    description: 'Step-by-step guide to ordering auto parts and hardware',
    icon: <ShoppingCart className="h-5 w-5" />,
    category: 'getting-started',
    difficulty: 'beginner',
    userTypes: ['customer']
  },
  {
    id: 'driver-onboarding',
    title: 'Driver Onboarding',
    description: 'Complete setup process for new drivers',
    icon: <Truck className="h-5 w-5" />,
    category: 'getting-started',
    difficulty: 'beginner',
    userTypes: ['driver']
  },
  {
    id: 'store-setup',
    title: 'Store Setup & Configuration',
    description: 'Set up your store and start selling',
    icon: <Store className="h-5 w-5" />,
    category: 'getting-started',
    difficulty: 'beginner',
    userTypes: ['merchant']
  },
  
  // Features
  {
    id: 'delivery-tracking',
    title: 'Delivery Tracking',
    description: 'Track your orders in real-time',
    icon: <MapPin className="h-5 w-5" />,
    category: 'features',
    difficulty: 'beginner',
    userTypes: ['customer', 'driver']
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods & Billing',
    description: 'Manage your payment options and billing',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'features',
    difficulty: 'beginner',
    userTypes: ['customer', 'driver', 'merchant']
  },
  {
    id: 'driver-earnings',
    title: 'Driver Earnings & Payouts',
    description: 'Track earnings and manage payouts',
    icon: <DollarSign className="h-5 w-5" />,
    category: 'features',
    difficulty: 'intermediate',
    userTypes: ['driver']
  },
  {
    id: 'store-management',
    title: 'Store Management',
    description: 'Manage products, inventory, and orders',
    icon: <Store className="h-5 w-5" />,
    category: 'features',
    difficulty: 'intermediate',
    userTypes: ['merchant']
  },
  
  // Troubleshooting
  {
    id: 'common-issues',
    title: 'Common Issues & Solutions',
    description: 'Quick fixes for frequent problems',
    icon: <HelpCircle className="h-5 w-5" />,
    category: 'troubleshooting',
    difficulty: 'beginner',
    userTypes: ['customer', 'driver', 'merchant', 'admin']
  },
  {
    id: 'delivery-problems',
    title: 'Delivery Issues',
    description: 'Resolve delivery-related problems',
    icon: <Truck className="h-5 w-5" />,
    category: 'troubleshooting',
    difficulty: 'intermediate',
    userTypes: ['customer', 'driver']
  },
  {
    id: 'payment-issues',
    title: 'Payment Problems',
    description: 'Fix payment and billing issues',
    icon: <CreditCard className="h-5 w-5" />,
    category: 'troubleshooting',
    difficulty: 'intermediate',
    userTypes: ['customer', 'driver', 'merchant']
  },
  
  // Tips
  {
    id: 'money-saving-tips',
    title: 'Money-Saving Tips',
    description: 'Save money on your orders',
    icon: <DollarSign className="h-5 w-5" />,
    category: 'tips',
    difficulty: 'beginner',
    userTypes: ['customer']
  },
  {
    id: 'driver-optimization',
    title: 'Driver Optimization Tips',
    description: 'Maximize your earnings and efficiency',
    icon: <Zap className="h-5 w-5" />,
    category: 'tips',
    difficulty: 'intermediate',
    userTypes: ['driver']
  },
  {
    id: 'store-growth',
    title: 'Store Growth Strategies',
    description: 'Grow your business with MyPartsRunner',
    icon: <TrendingUp className="h-5 w-5" />,
    category: 'tips',
    difficulty: 'advanced',
    userTypes: ['merchant']
  }
];

interface HelpCenterProps {
  userRole?: 'customer' | 'driver' | 'merchant' | 'admin';
}

export const HelpCenter: React.FC<HelpCenterProps> = ({ userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredSections = helpSections.filter(section => {
    const matchesSearch = section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || section.difficulty === selectedDifficulty;
    const matchesUserType = !userRole || section.userTypes.includes(userRole);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesUserType;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <BookOpen className="h-4 w-4" />;
      case 'features': return <Star className="h-4 w-4" />;
      case 'troubleshooting': return <HelpCircle className="h-4 w-4" />;
      case 'tips': return <Zap className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Everything you need to know about using MyPartsRunner™. Find answers, learn features, and get the most out of our platform.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            placeholder="Search for help topics, features, or solutions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Contact Support</h3>
          <p className="text-sm text-gray-600">Get help from our team</p>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Live Chat</h3>
          <p className="text-sm text-gray-600">Chat with support agents</p>
        </Card>
        
        <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <Video className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <h3 className="font-semibold mb-2">Video Tutorials</h3>
          <p className="text-sm text-gray-600">Watch step-by-step guides</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="getting-started">Getting Started</SelectItem>
            <SelectItem value="features">Features</SelectItem>
            <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
            <SelectItem value="tips">Tips & Tricks</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Help Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map((section) => (
          <Card key={section.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(section.difficulty)}>
                      {section.difficulty}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryIcon(section.category)}
                      <span className="ml-1 capitalize">
                        {section.category.replace('-', ' ')}
                      </span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                {section.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {section.userTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                  ))}
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredSections.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No help topics found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
            setSelectedDifficulty('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Contact Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Still need help?
            </h3>
            <p className="text-blue-700 mb-4">
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Phone className="h-4 w-4 mr-2" />
                Call Support: (502) 812-2456
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Email: support@mypartsrunner.com
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 