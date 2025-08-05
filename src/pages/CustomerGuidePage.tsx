import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, MapPin, ShoppingCart, CreditCard, Truck, Star, Clock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerGuidePage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up with your email and create a secure password",
      details: [
        "Enter your email address and create a strong password",
        "Add your name and phone number for delivery contact",
        "Verify your email address to activate your account",
        "Complete your profile with delivery address"
      ],
      icon: <Shield className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Find Local Stores",
      description: "Discover auto parts and hardware stores near you",
      details: [
        "Browse stores by category (auto parts or hardware)",
        "View store ratings, reviews, and delivery times",
        "Check store hours and availability",
        "See estimated delivery fees and times"
      ],
      icon: <MapPin className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Browse Products",
      description: "Search and filter products from your chosen store",
      details: [
        "Search by product name, brand, or part number",
        "Filter by category, price range, and availability",
        "View detailed product descriptions and specifications",
        "Check real-time stock availability"
      ],
      icon: <ShoppingCart className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Add to Cart & Checkout",
      description: "Build your order and complete your purchase",
      details: [
        "Add products to your cart with desired quantities",
        "Review your cart and apply any available discounts",
        "Enter delivery address and special instructions",
        "Choose payment method and complete checkout"
      ],
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      step: 5,
      title: "Track Your Delivery",
      description: "Monitor your order from pickup to delivery",
      details: [
        "Receive real-time updates on order status",
        "Track your driver's location in real-time",
        "Get estimated delivery time updates",
        "Contact driver directly if needed"
      ],
      icon: <Truck className="h-6 w-6" />
    },
    {
      step: 6,
      title: "Rate & Review",
      description: "Share your experience and help other customers",
      details: [
        "Rate your delivery experience (1-5 stars)",
        "Leave detailed feedback about the service",
        "Review product quality and accuracy",
        "Help improve the service for everyone"
      ],
      icon: <Star className="h-6 w-6" />
    }
  ];

  const benefits = [
    {
      title: "Fast Delivery",
      description: "Get your parts delivered in as little as 30 minutes",
      icon: <Zap className="h-8 w-8 text-yellow-500" />
    },
    {
      title: "Real-time Tracking",
      description: "Know exactly where your order is at all times",
      icon: <MapPin className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Verified Products",
      description: "All products come from trusted local stores",
      icon: <Shield className="h-8 w-8 text-green-500" />
    },
    {
      title: "Flexible Payment",
      description: "Pay with card, Cash App, Venmo, or cash",
      icon: <CreditCard className="h-8 w-8 text-purple-500" />
    },
    {
      title: "24/7 Support",
      description: "Get help anytime with our customer support",
      icon: <Clock className="h-8 w-8 text-orange-500" />
    },
    {
      title: "No Hidden Fees",
      description: "Transparent pricing with no surprises",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />
    }
  ];

  const pricing = [
    {
      type: "Standard Delivery",
      time: "1-2 hours",
      fee: "$5.99",
      description: "Perfect for non-urgent orders"
    },
    {
      type: "Express Delivery",
      time: "30-60 minutes",
      fee: "$9.99",
      description: "For when you need parts fast"
    },
    {
      type: "Rush Delivery",
      time: "15-30 minutes",
      fee: "$14.99",
      description: "Emergency situations only"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Customer Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Everything you need to know to get started with MyPartsRunner
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/browse">Browse Stores</Link>
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Why Choose MyPartsRunner?</CardTitle>
          <CardDescription>
            The fastest way to get auto parts and hardware delivered to your door
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className="flex-shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">How It Works</CardTitle>
          <CardDescription>
            Follow these simple steps to get your parts delivered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {step.icon}
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Delivery Pricing</CardTitle>
          <CardDescription>
            Transparent pricing with no hidden fees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricing.map((option, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{option.type}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{option.fee}</div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary" className="mb-3">{option.time}</Badge>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Additional Information:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• No delivery fee on orders over $50</li>
              <li>• Free returns within 24 hours</li>
              <li>• Price matching with local competitors</li>
              <li>• Loyalty rewards program available</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Pro Tips</CardTitle>
          <CardDescription>
            Make the most of your MyPartsRunner experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">For Best Results:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Have your vehicle make, model, and year ready</li>
                <li>• Know the part number if available</li>
                <li>• Provide clear delivery instructions</li>
                <li>• Keep your phone nearby for driver contact</li>
                <li>• Tip your driver for excellent service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Save Money:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Order multiple items together</li>
                <li>• Use express delivery only when necessary</li>
                <li>• Check for store promotions and discounts</li>
                <li>• Join our loyalty program</li>
                <li>• Refer friends for delivery credits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">What if my part is out of stock?</h4>
              <p className="text-sm text-muted-foreground">
                We'll notify you immediately and can check other nearby stores or order it for you with next-day delivery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I return items?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! Returns are free within 24 hours. Just contact us and we'll pick up the item and process your refund.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards, Cash App, Venmo, and cash on delivery.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I track my order?</h4>
              <p className="text-sm text-muted-foreground">
                You'll receive real-time updates via email and SMS. You can also track your driver's location in the app.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center mt-12 p-8 bg-primary text-primary-foreground rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Join thousands of customers who trust MyPartsRunner for fast, reliable delivery</p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/register">Create Account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/browse">Browse Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerGuidePage; 