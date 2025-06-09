import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import {
  PlayCircle,
  BarChart2,
  Clock,
  DollarSign,
  MapPin,
  Shield,
  Truck,
  Users,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

export function MerchantLearn() {
  const [activeVideo, setActiveVideo] = useState('overview');

  const videos = {
    overview: {
      title: 'Platform Overview',
      url: 'https://mypartsrunner.com/videos/platform-overview.mp4',
      duration: '2:15'
    },
    integration: {
      title: 'Integration Guide',
      url: 'https://mypartsrunner.com/videos/integration-guide.mp4',
      duration: '3:45'
    },
    dashboard: {
      title: 'Dashboard Tutorial',
      url: 'https://mypartsrunner.com/videos/dashboard-tutorial.mp4',
      duration: '4:30'
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Learn About MyPartsRunner™</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <div className="text-sm text-gray-600">Delivery Success Rate</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">45min</div>
            <div className="text-sm text-gray-600">Average Delivery Time</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">1000+</div>
            <div className="text-sm text-gray-600">Active Merchants</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
            <div className="text-sm text-gray-600">Customer Rating</div>
          </Card>
        </div>

        <Tabs defaultValue="demo" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mx-auto">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Interactive Demo</h2>
              <p className="text-gray-600 mb-6">
                Try our platform right now with this interactive demo. No signup required.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-4">Simulate a Delivery Request</h3>
                <div className="space-y-4">
                  {/* Demo form would go here */}
                  <Button className="w-full md:w-auto">Start Demo</Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">What You'll See</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Real-time delivery tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Automated dispatching
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Customer notifications
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Features to Try</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Multiple delivery options
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Price calculations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Delivery scheduling
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(videos).map(([key, video]) => (
                <Card 
                  key={key}
                  className={`p-4 cursor-pointer transition-all ${
                    activeVideo === key ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setActiveVideo(key)}
                >
                  <div className="relative">
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-primary" />
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </span>
                  </div>
                  <h3 className="font-semibold mt-2">{video.title}</h3>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                <p className="text-gray-600">
                  Monitor deliveries in real-time with precise GPS tracking and status updates.
                </p>
              </Card>
              
              <Card className="p-6">
                <BarChart2 className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Comprehensive analytics to track performance and optimize operations.
                </p>
              </Card>

              <Card className="p-6">
                <Shield className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
                <p className="text-gray-600">
                  Enterprise-grade security with encrypted transactions and data protection.
                </p>
              </Card>

              <Card className="p-6">
                <Truck className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Smart Dispatching</h3>
                <p className="text-gray-600">
                  AI-powered dispatch system assigns the best runner for each delivery.
                </p>
              </Card>

              <Card className="p-6">
                <Users className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Customer Updates</h3>
                <p className="text-gray-600">
                  Automated notifications keep customers informed throughout delivery.
                </p>
              </Card>

              <Card className="p-6">
                <MapPin className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Route Optimization</h3>
                <p className="text-gray-600">
                  Efficient routing algorithms ensure fastest possible deliveries.
                </p>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">How much does it cost?</h3>
                  <p className="text-gray-600">
                    We operate on a pay-per-delivery model with no monthly fees or commitments. 
                    Pricing starts at $8.99 per delivery and varies based on distance and size.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">How long does integration take?</h3>
                  <p className="text-gray-600">
                    With our widget, you can be up and running in under 5 minutes. 
                    API integration typically takes 1-2 days depending on your requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">What areas do you cover?</h3>
                  <p className="text-gray-600">
                    We currently operate in major metropolitan areas across the US, 
                    with new locations being added monthly. Contact us to check coverage in your area.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">How are runners vetted?</h3>
                  <p className="text-gray-600">
                    All runners undergo thorough background checks, vehicle inspections, 
                    and training before joining our platform. We maintain strict quality standards.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call-to-Action */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <PhoneCall className="h-5 w-5" />
            <span className="font-semibold">Need more information?</span>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link to="/merchant/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link to="/merchant/contact">Schedule Demo Call</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 