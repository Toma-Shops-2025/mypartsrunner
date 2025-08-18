import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  Zap,
  Shield,
  Users,
  Star,
  AlertTriangle,
  CheckCircle,
  Headphones,
  Truck,
  Store
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours."
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: ''
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      value: "support@mypartsrunner.com",
      description: "General inquiries and support",
      color: "text-cyan-400"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone Support",
      value: "(502) 555-PARTS",
      description: "Talk to our team directly",
      color: "text-green-400"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Service Area",
      value: "Louisville, KY Metro",
      description: "Jefferson County coverage",
      color: "text-purple-400"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Business Hours",
      value: "24/7 Delivery Available",
      description: "Support: Mon-Fri 8AM-6PM",
      color: "text-pink-400"
    }
  ];

  const supportCategories = [
    { icon: <Users className="w-4 h-4" />, title: "Customer Support", color: "text-cyan-400" },
    { icon: <Store className="w-4 h-4" />, title: "Merchant Onboarding", color: "text-purple-400" },
    { icon: <Truck className="w-4 h-4" />, title: "Driver Registration", color: "text-green-400" },
    { icon: <Headphones className="w-4 h-4" />, title: "Technical Issues", color: "text-pink-400" },
    { icon: <Star className="w-4 h-4" />, title: "Partnership Inquiries", color: "text-orange-400" }
  ];

  const faqs = [
    {
      question: "How do I become a driver?",
      answer: "Apply through our driver portal, complete background checks, and attend orientation. We'll help you get started earning with deliveries."
    },
    {
      question: "How do I list my store?",
      answer: "Contact our merchant team to discuss partnership opportunities and get your store listed on our platform with competitive rates."
    },
    {
      question: "What are the delivery fees?",
      answer: "Delivery fees start at $2.99 and vary by distance and order size. All fees are clearly displayed before checkout."
    },
    {
      question: "How do I track my order?",
      answer: "Use the real-time tracking feature in your dashboard or mobile app to see live updates on your delivery location."
    }
  ];

  return (
    <div className="min-h-screen animated-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 pulse-neon">
              <MessageSquare className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              <span className="gradient-text">Contact</span>{' '}
              <span className="neon-text">Our Team</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have questions about MyPartsRunner™? We're here to help! Get in touch with our team for support, partnerships, or general inquiries.
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="glass-card border-0 shadow-xl glow-card text-center hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className={`${method.color} mb-4 flex justify-center`}>
                    {method.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-cyan-400 font-semibold mb-1">{method.value}</p>
                  <p className="text-gray-400 text-sm">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <div>
              <Card className="glass-card border-0 shadow-2xl glow-card">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                    <Send className="w-6 h-6 text-cyan-400" />
                    <span className="gradient-text">Send us a Message</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-base">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-white text-sm font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="neon-input h-12 mt-2"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white text-sm font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="neon-input h-12 mt-2"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-white text-sm font-medium">Inquiry Category</Label>
                      <Select value={formData.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="neon-input h-12 mt-2">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="glass-card border border-cyan-400/30">
                          <SelectItem value="general" className="text-gray-300 hover:text-cyan-400">General Inquiry</SelectItem>
                          <SelectItem value="support" className="text-gray-300 hover:text-cyan-400">Technical Support</SelectItem>
                          <SelectItem value="partnership" className="text-gray-300 hover:text-cyan-400">Partnership</SelectItem>
                          <SelectItem value="billing" className="text-gray-300 hover:text-cyan-400">Billing Question</SelectItem>
                          <SelectItem value="feedback" className="text-gray-300 hover:text-cyan-400">Feedback</SelectItem>
                          <SelectItem value="other" className="text-gray-300 hover:text-cyan-400">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-white text-sm font-medium">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="neon-input h-12 mt-2"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-white text-sm font-medium">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="neon-input mt-2"
                        placeholder="Please provide details about your inquiry..."
                        required
                      />
                    </div>

                    <Button type="submit" className="neon-button w-full h-12 text-base font-semibold" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="neon-spinner w-4 h-4"></div>
                          Sending Message...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information and Support */}
            <div className="space-y-6">
              {/* Support Categories */}
              <Card className="glass-card border-0 shadow-xl glow-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Headphones className="w-6 h-6 text-cyan-400" />
                    <span className="gradient-text">Support Categories</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Quick access to specialized support teams
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {supportCategories.map((category, index) => (
                      <div 
                        key={index} 
                        className="flex items-center space-x-3 p-3 glass-card border border-gray-600 rounded-lg hover:border-cyan-400/50 transition-colors cursor-pointer group"
                      >
                        <span className={`${category.color} group-hover:text-cyan-400 transition-colors`}>
                          {category.icon}
                        </span>
                        <span className="text-gray-300 group-hover:text-white transition-colors">{category.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="glass-card border border-red-400/30 shadow-xl glow-card bg-gradient-to-br from-red-900/20 to-pink-900/20">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6" />
                    Emergency Support
                  </CardTitle>
                  <CardDescription className="text-red-300">
                    For urgent delivery issues or safety concerns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-bold text-red-300">24/7 Emergency Line</p>
                      <p className="text-red-400 font-semibold">(502) 911-HELP</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card className="glass-card border-0 shadow-xl glow-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Users className="w-6 h-6 text-purple-400" />
                    <span className="gradient-text">Leadership Team</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold">TA</span>
                      </div>
                      <div>
                        <p className="font-bold text-white">TomaAdkins</p>
                        <p className="text-cyan-400 text-sm">Founder & CEO</p>
                        <p className="text-gray-400 text-xs">Louisville, Kentucky</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Badge className="bg-gradient-to-r from-cyan-400 to-purple-600 text-black text-xs">
                        Founded 2024
                      </Badge>
                      <Badge className="bg-gradient-to-r from-green-400 to-cyan-600 text-black text-xs">
                        Louisville Based
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="gradient-text">Frequently Asked</span>{' '}
              <span className="neon-text">Questions</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="glass-card border-0 shadow-xl glow-card hover:scale-105 transition-transform duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
