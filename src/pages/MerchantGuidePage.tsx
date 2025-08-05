import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Store, Truck, DollarSign, Users, TrendingUp, Shield, Zap, Globe, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const MerchantGuidePage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Register Your Store",
      description: "Create your merchant account and store profile",
      details: [
        "Sign up with your business email and contact information",
        "Provide your business license and tax information",
        "Set up your store profile with name, description, and logo",
        "Choose your store type (auto parts or hardware)"
      ],
      icon: <Store className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Complete Onboarding",
      description: "Verify your business and set up payment processing",
      details: [
        "Complete business verification process",
        "Set up Stripe account for payment processing",
        "Configure your bank account for deposits",
        "Review and accept merchant agreement"
      ],
      icon: <Shield className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Add Your Products",
      description: "Upload your inventory to the platform",
      details: [
        "Use our bulk upload tool or add products individually",
        "Include high-quality product images and descriptions",
        "Set accurate pricing and stock quantities",
        "Organize products by categories and subcategories"
      ],
      icon: <Settings className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Configure Delivery Settings",
      description: "Set up your delivery preferences and fees",
      details: [
        "Define your delivery radius and service areas",
        "Set minimum order amounts and delivery fees",
        "Configure store hours and delivery availability",
        "Set up order preparation time estimates"
      ],
      icon: <Truck className="h-6 w-6" />
    },
    {
      step: 5,
      title: "Start Receiving Orders",
      description: "Begin accepting and fulfilling delivery orders",
      details: [
        "Receive real-time order notifications",
        "Review and accept incoming orders",
        "Prepare orders within specified timeframes",
        "Coordinate with drivers for pickup"
      ],
      icon: <Zap className="h-6 w-6" />
    },
    {
      step: 6,
      title: "Grow Your Business",
      description: "Track performance and optimize your operations",
      details: [
        "Monitor sales analytics and customer feedback",
        "Optimize product offerings based on demand",
        "Participate in promotional campaigns",
        "Expand delivery areas as business grows"
      ],
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const benefits = [
    {
      title: "Zero Platform Fees",
      description: "No monthly fees, setup fees, or commission on sales",
      icon: <DollarSign className="h-8 w-8 text-green-500" />
    },
    {
      title: "Increased Sales",
      description: "Reach customers who prefer delivery over pickup",
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Easy Integration",
      description: "Simple setup with your existing inventory system",
      icon: <Settings className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Professional Delivery",
      description: "Reliable drivers handle all delivery logistics",
      icon: <Truck className="h-8 w-8 text-orange-500" />
    },
    {
      title: "Real-time Analytics",
      description: "Track performance and customer insights",
      icon: <Users className="h-8 w-8 text-red-500" />
    },
    {
      title: "24/7 Support",
      description: "Dedicated merchant support team",
      icon: <Shield className="h-8 w-8 text-yellow-500" />
    }
  ];

  const pricing = [
    {
      plan: "Free Plan",
      fee: "$0",
      features: [
        "No monthly fees",
        "No setup fees",
        "No commission on sales",
        "Basic analytics",
        "Standard support"
      ]
    },
    {
      plan: "Premium Plan",
      fee: "$29/month",
      features: [
        "Advanced analytics dashboard",
        "Priority customer support",
        "Custom delivery zones",
        "Bulk product upload",
        "Marketing tools",
        "API access"
      ]
    }
  ];

  const websiteIntegration = [
    {
      title: "Add Delivery Button",
      description: "Add a 'Deliver with MyPartsRunner' button to your website",
      code: `<button onclick="openMyPartsRunner()">Deliver with MyPartsRunner</button>`
    },
    {
      title: "Product Integration",
      description: "Show delivery availability on your product pages",
      code: `<div id="mypartsrunner-delivery" data-product-id="123"></div>`
    },
    {
      title: "Checkout Integration",
      description: "Add delivery option to your checkout process",
      code: `<script src="https://mypartsrunner.com/widget.js"></script>`
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Merchant Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Grow your business with fast, reliable delivery through MyPartsRunner
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/register">Register Your Store</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/merchant-application">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Why Partner with MyPartsRunner?</CardTitle>
          <CardDescription>
            Join hundreds of stores already growing their business with delivery
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

      {/* Pricing Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Pricing Plans</CardTitle>
          <CardDescription>
            Choose the plan that works best for your business
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pricing.map((plan, index) => (
              <Card key={index} className={index === 1 ? "border-primary" : ""}>
                <CardHeader>
                  <CardTitle className="text-xl">{plan.plan}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{plan.fee}</div>
                  {index === 1 && <Badge className="w-fit">Most Popular</Badge>}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6" variant={index === 1 ? "default" : "outline"}>
                    Choose Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Getting Started</CardTitle>
          <CardDescription>
            Follow these steps to start offering delivery with MyPartsRunner
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

      {/* Website Integration Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Website Integration</CardTitle>
          <CardDescription>
            Add MyPartsRunner delivery to your existing website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {websiteIntegration.map((integration, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">{integration.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  {integration.code}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Integration Benefits:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Seamless customer experience on your website</li>
              <li>• No redirects - customers stay on your site</li>
              <li>• Real-time delivery availability and pricing</li>
              <li>• Automatic order synchronization</li>
              <li>• Customizable branding and styling</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Best Practices</CardTitle>
          <CardDescription>
            Tips to maximize your success with MyPartsRunner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">For Higher Sales:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Keep product images high-quality and up-to-date</li>
                <li>• Maintain accurate inventory levels</li>
                <li>• Offer competitive pricing</li>
                <li>• Respond quickly to order requests</li>
                <li>• Provide detailed product descriptions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Better Operations:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Prepare orders within specified timeframes</li>
                <li>• Package items securely for delivery</li>
                <li>• Communicate clearly with drivers</li>
                <li>• Monitor analytics regularly</li>
                <li>• Provide excellent customer service</li>
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
              <h4 className="font-semibold mb-2">How much does it cost to join?</h4>
              <p className="text-sm text-muted-foreground">
                It's completely free to join! No setup fees, no monthly fees, and no commission on sales.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How do I get paid?</h4>
              <p className="text-sm text-muted-foreground">
                Payments are processed through Stripe and deposited directly to your bank account within 2-3 business days.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I integrate with my existing website?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! We provide simple integration tools to add delivery options to your existing website.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What if I can't fulfill an order?</h4>
              <p className="text-sm text-muted-foreground">
                Contact us immediately and we'll help cancel the order and notify the customer. No penalties for occasional issues.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center mt-12 p-8 bg-primary text-primary-foreground rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Grow Your Business?</h2>
        <p className="mb-6">Join hundreds of stores already offering delivery with MyPartsRunner</p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/merchant-application">Schedule Demo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MerchantGuidePage; 