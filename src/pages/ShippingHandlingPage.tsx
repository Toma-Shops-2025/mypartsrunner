import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ShippingHandlingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <Truck className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Shipping & Handling</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Fast, reliable delivery of auto parts and hardware supplies. Learn about our delivery process, policies, and how we ensure your orders arrive safely and on time.
          </p>
        </div>

        {/* Delivery Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Express Delivery</CardTitle>
                <CardDescription>Fastest delivery option</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-green-600">30-60 min</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get your auto parts delivered in as little as 30 minutes for urgent needs.
                </p>
                <Badge variant="secondary">Premium Service</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Standard Delivery</CardTitle>
                <CardDescription>Most popular option</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">1-2 hours</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Reliable delivery within 1-2 hours for most orders.
                </p>
                <Badge variant="outline">Best Value</Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Scheduled Delivery</CardTitle>
                <CardDescription>Plan ahead</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-orange-600">Same Day</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule delivery for a specific time that works for you.
                </p>
                <Badge variant="outline">Flexible</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">How Delivery Works</h2>
          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted transform -translate-y-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Order Placed</h3>
                <p className="text-sm text-muted-foreground">
                  Customer places order through app
                </p>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Store Prepares</h3>
                <p className="text-sm text-muted-foreground">
                  Store prepares parts for pickup
                </p>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Driver Picks Up</h3>
                <p className="text-sm text-muted-foreground">
                  Driver collects from store
                </p>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">On the Way</h3>
                <p className="text-sm text-muted-foreground">
                  Driver delivers to customer
                </p>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                  <span className="text-white font-bold">5</span>
                </div>
                <h3 className="font-semibold mb-2">Delivered</h3>
                <p className="text-sm text-muted-foreground">
                  Customer receives parts
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Fees */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Fees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Fee Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Base Delivery Fee</span>
                  <span className="font-bold">$5.99</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Express Delivery</span>
                  <span className="font-bold">+$3.00</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Distance Fee (5+ miles)</span>
                  <span className="font-bold">+$0.50/mile</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="font-medium">Large Order Fee</span>
                  <span className="font-bold">+$2.00</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Fee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Free delivery on orders over $50</p>
                    <p className="text-sm text-muted-foreground">Standard delivery only</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Transparent pricing</p>
                    <p className="text-sm text-muted-foreground">All fees shown at checkout</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">No hidden charges</p>
                    <p className="text-sm text-muted-foreground">What you see is what you pay</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Multiple payment options</p>
                    <p className="text-sm text-muted-foreground">Credit card, Cash App, Venmo, cash</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Areas */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Current Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Dallas Metro Area</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Fort Worth</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Arlington</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Plano</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Irving</span>
                    <Badge variant="secondary">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Coming Soon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Austin</span>
                    <Badge variant="outline">Q2 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Houston</span>
                    <Badge variant="outline">Q3 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">San Antonio</span>
                    <Badge variant="outline">Q3 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">El Paso</span>
                    <Badge variant="outline">Q4 2024</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Corpus Christi</span>
                    <Badge variant="outline">Q4 2024</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Handling & Packaging */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Handling & Packaging</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Safe Handling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Trained drivers</p>
                    <p className="text-sm text-muted-foreground">All drivers receive safety training</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Secure packaging</p>
                    <p className="text-sm text-muted-foreground">Parts are properly secured for transport</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Temperature control</p>
                    <p className="text-sm text-muted-foreground">Sensitive parts kept at proper temperature</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Fragile handling</p>
                    <p className="text-sm text-muted-foreground">Special care for delicate components</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Packaging Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Protective materials</p>
                    <p className="text-sm text-muted-foreground">Bubble wrap, foam, and padding</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Weather protection</p>
                    <p className="text-sm text-muted-foreground">Waterproof packaging when needed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Proper labeling</p>
                    <p className="text-sm text-muted-foreground">Clear handling instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Size optimization</p>
                    <p className="text-sm text-muted-foreground">Efficient packaging to reduce costs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Policies */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Delivery Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Service Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Sunday: 7:00 AM - 10:00 PM
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Peak Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Delivery times may be longer during peak hours (11 AM - 2 PM, 5 PM - 8 PM)
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Weather Delays</h3>
                  <p className="text-sm text-muted-foreground">
                    Severe weather may cause delivery delays. We'll notify you of any changes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Availability</h3>
                  <p className="text-sm text-muted-foreground">
                    Someone must be available to receive the delivery at the specified address.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">ID Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Valid ID may be required for high-value orders or age-restricted items.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Signature Required</h3>
                  <p className="text-sm text-muted-foreground">
                    Orders over $100 require signature confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary text-primary-foreground rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience fast, reliable delivery of auto parts and hardware supplies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button variant="secondary" size="lg">
                Browse Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" size="lg">
                <Phone className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingHandlingPage;