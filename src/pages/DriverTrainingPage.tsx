import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  MessageSquare, 
  Camera, 
  CheckCircle, 
  DollarSign,
  MapPin,
  Clock,
  Phone,
  AlertTriangle,
  Shield,
  FileText,
  Navigation,
  Package,
  Star
} from 'lucide-react';

const DriverTrainingPage: React.FC = () => {
  return (
    <div className="min-h-screen animated-bg">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Driver</span>{' '}
              <span className="neon-text">Training Center</span>
            </h1>
            <p className="text-gray-300">Everything you need to know to be a successful MyPartsRunner driver</p>
          </div>

          {/* Quick Start Guide */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-6 w-6 text-cyan-400" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>
                Get up and running in 5 minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-cyan-400/10 rounded-lg">
                  <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Go Online</h3>
                  <p className="text-sm text-gray-300">Click "Go Online" in your dashboard to start receiving delivery requests</p>
                </div>
                <div className="text-center p-4 bg-green-400/10 rounded-lg">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Accept Orders</h3>
                  <p className="text-sm text-gray-300">Review and accept delivery requests that match your location</p>
                </div>
                <div className="text-center p-4 bg-yellow-400/10 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Pickup & Deliver</h3>
                  <p className="text-sm text-gray-300">Navigate to store, pickup items, and deliver to customer</p>
                </div>
                <div className="text-center p-4 bg-purple-400/10 rounded-lg">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-black font-bold">4</span>
                  </div>
                  <h3 className="font-semibold mb-2">Get Paid</h3>
                  <p className="text-sm text-gray-300">Complete delivery and receive automatic payment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Workflow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Accepting Orders */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  How to Accept Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Stay Online</h4>
                    <p className="text-sm text-gray-300">Keep your driver status "Online" to receive delivery requests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Review Request</h4>
                    <p className="text-sm text-gray-300">Check pickup location, delivery address, and estimated earnings</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Accept or Decline</h4>
                    <p className="text-sm text-gray-300">Click "Accept" if you can complete the delivery, or "Decline" if not</p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-400">Important</span>
                  </div>
                  <p className="text-sm text-yellow-300">Only accept orders you can complete. Canceling after acceptance affects your rating.</p>
                </div>
              </CardContent>
            </Card>

            {/* Customer Communication */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  Customer Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Initial Contact</h4>
                    <p className="text-sm text-gray-300">Send a message when you accept the order to introduce yourself</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Pickup Updates</h4>
                    <p className="text-sm text-gray-300">Notify customer when you arrive at the store and when you leave</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-black text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Delivery Updates</h4>
                    <p className="text-sm text-gray-300">Send ETA updates and notify when you're approaching</p>
                  </div>
                </div>
                <div className="p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-semibold text-blue-400">Pro Tip</span>
                  </div>
                  <p className="text-sm text-blue-300">Good communication leads to better ratings and tips!</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Process */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-purple-400" />
                Complete Delivery Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-cyan-400">1. Pickup Phase</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Navigate to pickup location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Verify items with store staff</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Take photo of items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Notify customer of pickup</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-green-400">2. Delivery Phase</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Navigate to delivery address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Contact customer if needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Find safe delivery location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Take delivery photo</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-purple-400">3. Completion Phase</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Mark delivery as complete</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Payment processed automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Customer can rate your service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Ready for next delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Safety & Best Practices */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  Safety Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Always wear your seatbelt and follow traffic laws</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Never leave items unattended in your vehicle</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Park in safe, well-lit areas for deliveries</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Trust your instincts - if a location feels unsafe, contact support</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Keep your phone charged and have backup power</p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Be professional and friendly with customers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Handle packages with care and respect</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Take clear photos for delivery confirmation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Communicate proactively about delays or issues</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">Keep your vehicle clean and presentable</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                Payment & Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">How You Get Paid</h3>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>Base Pay:</strong> $5-15 per delivery depending on distance</p>
                    <p>• <strong>Tips:</strong> 100% of customer tips go to you</p>
                    <p>• <strong>Bonuses:</strong> Earn extra for peak hours and high demand</p>
                    <p>• <strong>Weekly Payouts:</strong> Every Tuesday via your chosen payment method</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Payment Methods</h3>
                  <div className="space-y-2 text-sm">
                    <p>• <strong>Cash App:</strong> Instant transfers</p>
                    <p>• <strong>Venmo:</strong> Instant transfers</p>
                    <p>• <strong>PayPal:</strong> 1-2 business days</p>
                    <p>• <strong>Direct Deposit:</strong> 2-3 business days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support & Resources */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                Support & Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-gray-300">Call or text our support team anytime</p>
                  <p className="text-sm font-mono text-cyan-400">(555) 123-DRIVE</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Driver Chat</h3>
                  <p className="text-sm text-gray-300">Connect with other drivers</p>
                  <p className="text-sm text-gray-300">Share tips and experiences</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="font-semibold mb-2">Help Center</h3>
                  <p className="text-sm text-gray-300">FAQs and troubleshooting guides</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Visit Help Center
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverTrainingPage;
