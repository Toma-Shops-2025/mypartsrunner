import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Car, 
  Package, 
  Users, 
  Phone, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SafetyGuidePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Safety Guide</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your safety is our top priority. This guide provides essential safety information for customers, drivers, and merchants using MyPartsRunner™.
          </p>
        </div>

        {/* Emergency Contact */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-red-800">24/7 Emergency Line</p>
                <p className="text-red-600 text-lg">(555) 911-HELP</p>
              </div>
              <div>
                <p className="font-semibold text-red-800">Safety Support</p>
                <p className="text-red-600">safety@mypartsrunner.com</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety Guidelines by User Type */}
        <Tabs defaultValue="customers" className="mb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Drivers</span>
            </TabsTrigger>
            <TabsTrigger value="merchants" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Merchants</span>
            </TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Safe Delivery Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Meet in well-lit areas</p>
                      <p className="text-sm text-muted-foreground">Choose public, well-lit locations for delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Verify driver identity</p>
                      <p className="text-sm text-muted-foreground">Check driver details in the app before accepting delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Inspect packages</p>
                      <p className="text-sm text-muted-foreground">Check your order before signing for delivery</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Report issues immediately</p>
                      <p className="text-sm text-muted-foreground">Contact support for any safety concerns</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    What to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Meeting in isolated areas</p>
                      <p className="text-sm text-muted-foreground">Avoid dark or secluded locations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Sharing personal information</p>
                      <p className="text-sm text-muted-foreground">Don't share unnecessary personal details</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Accepting damaged packages</p>
                      <p className="text-sm text-muted-foreground">Refuse delivery if package appears damaged</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Ignoring safety concerns</p>
                      <p className="text-sm text-muted-foreground">Always report suspicious behavior</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Driver Safety Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Vehicle maintenance</p>
                      <p className="text-sm text-muted-foreground">Keep your vehicle in good condition</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Follow traffic laws</p>
                      <p className="text-sm text-muted-foreground">Obey all traffic regulations and speed limits</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Secure cargo</p>
                      <p className="text-sm text-muted-foreground">Properly secure all packages in your vehicle</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Professional conduct</p>
                      <p className="text-sm text-muted-foreground">Maintain professional behavior at all times</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    Driver Safety Don'ts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Distracted driving</p>
                      <p className="text-sm text-muted-foreground">No phone use while driving</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Speeding</p>
                      <p className="text-sm text-muted-foreground">Never exceed speed limits</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Unsecured packages</p>
                      <p className="text-sm text-muted-foreground">Don't leave packages unsecured</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Aggressive behavior</p>
                      <p className="text-sm text-muted-foreground">Maintain calm and professional demeanor</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Merchants Tab */}
          <TabsContent value="merchants" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Merchant Safety Practices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Secure storage</p>
                      <p className="text-sm text-muted-foreground">Store products securely and safely</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Quality control</p>
                      <p className="text-sm text-muted-foreground">Inspect all products before packaging</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Proper packaging</p>
                      <p className="text-sm text-muted-foreground">Use appropriate packaging materials</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Driver verification</p>
                      <p className="text-sm text-muted-foreground">Verify driver identity before handing over orders</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    Merchant Safety Don'ts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Selling unsafe products</p>
                      <p className="text-sm text-muted-foreground">Never sell defective or unsafe items</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Poor packaging</p>
                      <p className="text-sm text-muted-foreground">Avoid inadequate packaging</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Ignoring safety recalls</p>
                      <p className="text-sm text-muted-foreground">Don't sell recalled products</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Unverified drivers</p>
                      <p className="text-sm text-muted-foreground">Never hand orders to unverified drivers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* General Safety Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">General Safety Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-center">Stay Connected</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Keep your phone charged and accessible. Use the in-app communication features to stay in touch with drivers and support.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-center">Location Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Choose safe, public locations for deliveries. Avoid isolated areas and ensure good lighting for evening deliveries.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-center">Be Prepared</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Plan ahead for deliveries. Have payment ready and be available at the specified time to avoid delays.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Safety Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Safety Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Background Checks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All drivers undergo thorough background checks and verification processes.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-lg">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  24/7 emergency support line for immediate assistance with safety concerns.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Real-time Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track your delivery in real-time and share location with trusted contacts.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Community Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Report safety concerns and help maintain a safe community for all users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary text-primary-foreground rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Safety is Our Priority</h2>
          <p className="text-xl mb-8 opacity-90">
            If you have any safety concerns or need assistance, don't hesitate to contact us immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              <Phone className="h-4 w-4 mr-2" />
              Emergency: (555) 911-HELP
            </Button>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidePage;