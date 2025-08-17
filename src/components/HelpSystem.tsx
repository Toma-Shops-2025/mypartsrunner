import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, 
  Search, 
  Book, 
  Video, 
  MessageCircle, 
  Phone, 
  Mail,
  FileText,
  Users,
  Settings,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Star,
  Clock
} from 'lucide-react';

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: string;
  videoUrl?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

const HelpSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [helpfulRatings, setHelpfulRatings] = useState<Record<string, boolean>>({});

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book },
    { id: 'getting-started', name: 'Getting Started', icon: Users },
    { id: 'ordering', name: 'Ordering', icon: FileText },
    { id: 'delivery', name: 'Delivery', icon: MessageCircle },
    { id: 'payments', name: 'Payments', icon: Settings },
    { id: 'account', name: 'Account', icon: Users },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: HelpCircle }
  ];

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'How to Place Your First Order',
      content: 'Learn how to search for auto parts, add them to your cart, and complete your first order on MyPartsRunner.',
      category: 'getting-started',
      tags: ['ordering', 'beginner', 'tutorial'],
      views: 1250,
      helpful: 95,
      lastUpdated: '2024-01-15',
      videoUrl: 'https://example.com/tutorial-video-1'
    },
    {
      id: '2',
      title: 'Understanding Delivery Times',
      content: 'Find out how delivery times work, factors that affect them, and how to track your orders in real-time.',
      category: 'delivery',
      tags: ['delivery', 'tracking', 'timing'],
      views: 890,
      helpful: 87,
      lastUpdated: '2024-01-12'
    },
    {
      id: '3',
      title: 'Payment Methods and Security',
      content: 'Learn about accepted payment methods, how your payment information is protected, and managing payment preferences.',
      category: 'payments',
      tags: ['payment', 'security', 'cards'],
      views: 675,
      helpful: 92,
      lastUpdated: '2024-01-10'
    },
    {
      id: '4',
      title: 'Managing Your Account Settings',
      content: 'Update your profile, change preferences, manage addresses, and customize your MyPartsRunner experience.',
      category: 'account',
      tags: ['profile', 'settings', 'preferences'],
      views: 543,
      helpful: 88,
      lastUpdated: '2024-01-08'
    },
    {
      id: '5',
      title: 'Troubleshooting Common Issues',
      content: 'Solutions to frequently encountered problems including login issues, payment errors, and app performance.',
      category: 'troubleshooting',
      tags: ['troubleshooting', 'errors', 'fixes'],
      views: 1120,
      helpful: 85,
      lastUpdated: '2024-01-14'
    }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How fast is delivery?',
      answer: 'Most orders are delivered within 30-60 minutes, depending on your location and the merchant\'s proximity.',
      category: 'delivery',
      helpful: 145
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, PayPal, and Apple Pay for secure transactions.',
      category: 'payments',
      helpful: 128
    },
    {
      id: '3',
      question: 'Can I cancel my order?',
      answer: 'Orders can be cancelled within 5 minutes of placement if they haven\'t been confirmed by the merchant.',
      category: 'ordering',
      helpful: 98
    },
    {
      id: '4',
      question: 'How do I track my delivery?',
      answer: 'You\'ll receive real-time updates via the app, SMS, and email. You can also view live tracking on the map.',
      category: 'delivery',
      helpful: 156
    },
    {
      id: '5',
      question: 'What if I receive the wrong part?',
      answer: 'Contact our support team immediately. We\'ll arrange for a return and send the correct part at no extra cost.',
      category: 'ordering',
      helpful: 89
    }
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const markHelpful = (id: string, helpful: boolean) => {
    setHelpfulRatings(prev => ({ ...prev, [id]: helpful }));
    // In real app, send to API
    console.log(`Marked ${id} as ${helpful ? 'helpful' : 'not helpful'}`);
  };

  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSelectedArticle(null)}
          >
            ← Back to Help Center
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span>{categories.find(c => c.id === selectedArticle.category)?.name}</span>
          <ChevronRight className="h-4 w-4" />
          <span>{selectedArticle.title}</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {selectedArticle.lastUpdated}
              </span>
              <span>{selectedArticle.views} views</span>
              <Badge>{selectedArticle.helpful}% helpful</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {selectedArticle.videoUrl && (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">Video Tutorial Available</h3>
                <Button>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Watch Video Guide
                </Button>
              </div>
            )}

            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed">{selectedArticle.content}</p>
              
              {/* Mock detailed content */}
              <h3>Step-by-Step Instructions</h3>
              <ol>
                <li>Navigate to the main search page</li>
                <li>Use the search bar to find your auto part</li>
                <li>Filter results by brand, price, or compatibility</li>
                <li>Add desired items to your cart</li>
                <li>Review your order and proceed to checkout</li>
                <li>Enter delivery information and payment details</li>
                <li>Confirm your order and track delivery progress</li>
              </ol>

              <h3>Tips for Success</h3>
              <ul>
                <li>Use specific part numbers when available</li>
                <li>Check vehicle compatibility before ordering</li>
                <li>Add delivery notes for special instructions</li>
                <li>Keep your phone nearby for driver communication</li>
              </ul>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t">
              <span className="text-sm font-medium">Was this article helpful?</span>
              <div className="flex gap-2">
                <Button
                  variant={helpfulRatings[selectedArticle.id] === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => markHelpful(selectedArticle.id, true)}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Yes
                </Button>
                <Button
                  variant={helpfulRatings[selectedArticle.id] === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => markHelpful(selectedArticle.id, false)}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  No
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Still need help?</h4>
              <p className="text-blue-700 text-sm mb-3">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <div className="flex gap-2">
                <Button size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers, guides, and get support for MyPartsRunner</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedCategory === category.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-2 ${
                selectedCategory === category.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-sm font-medium text-center">{category.name}</div>
            </button>
          );
        })}
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent 
                className="p-6"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-3">{article.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{article.views} views</span>
                      <span>{article.helpful}% helpful</span>
                      <Badge variant="outline">
                        {categories.find(c => c.id === article.category)?.name}
                      </Badge>
                      {article.videoUrl && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredArticles.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search terms or browse by category.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600 mb-4">{faq.answer}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{faq.helpful} people found this helpful</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markHelpful(faq.id, true)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markHelpful(faq.id, false)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                <Button className="w-full">Start Chat</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Send us a detailed message</p>
                <Button variant="outline" className="w-full">
                  support@mypartsrunner.com
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Speak directly with our team</p>
                <Button variant="outline" className="w-full">
                  1-800-PARTS-RUN
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Platform Services</h4>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Payment Processing</h4>
                  <p className="text-sm text-gray-600">Processing normally</p>
                </div>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Delivery Network</h4>
                  <p className="text-sm text-gray-600">234 drivers active</p>
                </div>
                <Badge className="bg-green-600">Online</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSystem; 