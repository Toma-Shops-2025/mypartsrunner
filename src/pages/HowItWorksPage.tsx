import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Truck, 
  Store, 
  Search, 
  CreditCard, 
  Package, 
  MapPin, 
  Clock, 
  Star,
  Users,
  Shield,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How MyPartsRunner™ Works</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            MyPartsRunner™ connects auto parts stores, drivers, and customers to deliver auto parts and hardware supplies quickly and efficiently. Here's how it works for each user type.
          </p>
        </div>

        {/* User Type Tabs */}
        <Tabs defaultValue="customers" className="mb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center space-x-2">
              <Truck className="h-4 w-4" />
              <span>Drivers</span>
            </TabsTrigger>
            <TabsTrigger value="merchants" className="flex items-center space-x-2">
              <Store className="h-4 w-4" />
              <span>Merchants</span>
            </TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Find Parts</CardTitle>
                  <CardDescription>
                    Browse local auto parts stores and hardware suppliers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Search by part name or category</li>
                    <li>• Filter by location and availability</li>
                    <li>• Compare prices across stores</li>
                    <li>• Read customer reviews</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. Order & Pay</CardTitle>
                  <CardDescription>
                    Add items to cart and complete your order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Add parts to your cart</li>
                    <li>• Choose delivery address</li>
                    <li>• Select payment method</li>
                    <li>• Add delivery notes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Track & Receive</CardTitle>
                  <CardDescription>
                    Track your delivery in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Real-time delivery tracking</li>
                    <li>• Driver notifications</li>
                    <li>• Contactless delivery</li>
                    <li>• Rate your experience</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/register?role=customer">
                <Button size="lg">
                  Get Started as Customer
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Sign Up & Verify</CardTitle>
                  <CardDescription>
                    Complete registration and background checks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Create driver account</li>
                    <li>• Submit license and insurance</li>
                    <li>• Complete background check</li>
                    <li>• Attend orientation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. Accept Deliveries</CardTitle>
                  <CardDescription>
                    Choose deliveries in your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Browse available deliveries</li>
                    <li>• View earnings and distance</li>
                    <li>• Accept preferred orders</li>
                    <li>• Plan your route</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Deliver & Earn</CardTitle>
                  <CardDescription>
                    Pick up and deliver orders safely
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Pick up from stores</li>
                    <li>• Follow delivery instructions</li>
                    <li>• Update delivery status</li>
                    <li>• Earn money per delivery</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/register?role=driver">
                <Button size="lg">
                  Become a Driver
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* Merchants Tab */}
          <TabsContent value="merchants" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Store className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Partner With Us</CardTitle>
                  <CardDescription>
                    Join our network of auto parts stores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Apply for partnership</li>
                    <li>• Complete store verification</li>
                    <li>• Set up your store profile</li>
                    <li>• Configure inventory</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. Manage Orders</CardTitle>
                  <CardDescription>
                    Process incoming orders efficiently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Receive order notifications</li>
                    <li>• Prepare parts for pickup</li>
                    <li>• Update inventory levels</li>
                    <li>• Track order status</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Grow Your Business</CardTitle>
                  <CardDescription>
                    Expand your customer reach
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Reach new customers</li>
                    <li>• Increase sales volume</li>
                    <li>• Get customer feedback</li>
                    <li>• Access analytics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/register?role=merchant">
                <Button size="lg">
                  Partner With Us
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>

        {/* Platform Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose MyPartsRunner™?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get your auto parts delivered in as little as 30 minutes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Secure & Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Verified drivers and secure payment processing
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Local Stores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with local auto parts stores in your area
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-lg">Quality Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Customer satisfaction guaranteed with every delivery
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delivery Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">The Delivery Process</h2>
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

        {/* CTA Section */}
        <div className="text-center bg-primary text-primary-foreground rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of customers, drivers, and merchants using MyPartsRunner™
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=customer">
              <Button variant="secondary" size="lg">
                Order Parts Now
              </Button>
            </Link>
            <Link to="/register?role=driver">
              <Button variant="secondary" size="lg">
                Become a Driver
              </Button>
            </Link>
            <Link to="/register?role=merchant">
              <Button variant="secondary" size="lg">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
