import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Car, DollarSign, MapPin, Clock, Shield, Star, Zap, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const DriverGuidePage: React.FC = () => {
  const steps = [
    {
      step: 1,
      title: "Apply to Drive",
      description: "Complete your driver application and background check",
      details: [
        "Submit your personal information and contact details",
        "Upload your driver's license and insurance information",
        "Provide vehicle details (make, model, year, license plate)",
        "Complete background check and vehicle inspection"
      ],
      icon: <Shield className="h-6 w-6" />
    },
    {
      step: 2,
      title: "Get Approved",
      description: "Wait for approval and complete onboarding",
      details: [
        "Background check typically takes 1-2 business days",
        "Receive welcome package with delivery materials",
        "Download the driver app and complete training",
        "Set up your payment preferences"
      ],
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      step: 3,
      title: "Go Online",
      description: "Start accepting delivery requests",
      details: [
        "Open the driver app and go online",
        "Set your availability and preferred delivery areas",
        "Receive real-time delivery requests",
        "Accept or decline based on your schedule"
      ],
      icon: <Zap className="h-6 w-6" />
    },
    {
      step: 4,
      title: "Pick Up Orders",
      description: "Navigate to stores and collect orders",
      details: [
        "Receive pickup instructions and store location",
        "Navigate to the store using GPS",
        "Show your driver ID and collect the order",
        "Verify order contents and customer details"
      ],
      icon: <MapPin className="h-6 w-6" />
    },
    {
      step: 5,
      title: "Deliver Orders",
      description: "Deliver orders safely and efficiently",
      details: [
        "Follow GPS navigation to customer location",
        "Contact customer upon arrival",
        "Hand deliver the order and collect payment if needed",
        "Get customer signature and rating"
      ],
      icon: <Car className="h-6 w-6" />
    },
    {
      step: 6,
      title: "Earn Money",
      description: "Get paid for your deliveries",
      details: [
        "Earn base pay plus tips for each delivery",
        "Receive weekly payments via your preferred method",
        "Track your earnings in real-time",
        "Build your rating and earn bonuses"
      ],
      icon: <DollarSign className="h-6 w-6" />
    }
  ];

  const benefits = [
    {
      title: "Flexible Schedule",
      description: "Work when you want, as much or as little as you want",
      icon: <Clock className="h-8 w-8 text-blue-500" />
    },
    {
      title: "Great Pay",
      description: "Earn $15-25 per hour including tips and bonuses",
      icon: <DollarSign className="h-8 w-8 text-green-500" />
    },
    {
      title: "Weekly Payments",
      description: "Get paid every week via direct deposit or instant transfer",
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />
    },
    {
      title: "Keep All Tips",
      description: "100% of customer tips go directly to you",
      icon: <Star className="h-8 w-8 text-yellow-500" />
    },
    {
      title: "Insurance Coverage",
      description: "Comprehensive insurance coverage while on deliveries",
      icon: <Shield className="h-8 w-8 text-red-500" />
    },
    {
      title: "Support Team",
      description: "24/7 driver support for any questions or issues",
      icon: <Users className="h-8 w-8 text-orange-500" />
    }
  ];

  const requirements = [
    {
      category: "Personal Requirements",
      items: [
        "Must be 21 years or older",
        "Valid driver's license for at least 2 years",
        "Clean driving record (no major violations)",
        "Pass background check and drug screening",
        "Smartphone with GPS capability"
      ]
    },
    {
      category: "Vehicle Requirements",
      items: [
        "Reliable vehicle in good condition",
        "Valid registration and insurance",
        "Vehicle inspection (we'll help arrange)",
        "Clean vehicle interior",
        "Proof of ownership or lease agreement"
      ]
    },
    {
      category: "Insurance Requirements",
      items: [
        "Personal auto insurance with minimum coverage",
        "Liability coverage of at least $100,000",
        "Comprehensive and collision coverage recommended",
        "Named driver on policy",
        "Policy must cover commercial use"
      ]
    }
  ];

  const earnings = [
    {
      type: "Base Pay",
      amount: "$3-5",
      description: "Per delivery, based on distance and time"
    },
    {
      type: "Tips",
      amount: "$2-8",
      description: "Average tip per delivery (you keep 100%)"
    },
    {
      type: "Bonuses",
      amount: "$5-20",
      description: "Peak hours, promotions, and incentives"
    },
    {
      type: "Weekly Average",
      amount: "$400-800",
      description: "For 20-30 hours of work per week"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Driver Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Start earning money by delivering auto parts and hardware with MyPartsRunner
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link to="/register">Apply to Drive</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/driver-application">Learn More</Link>
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Why Drive with MyPartsRunner?</CardTitle>
          <CardDescription>
            Join our network of professional drivers and start earning today
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

      {/* Requirements Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Requirements to Drive</CardTitle>
          <CardDescription>
            Make sure you meet all requirements before applying
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requirements.map((req, index) => (
              <div key={index}>
                <h3 className="font-semibold mb-4 text-lg">{req.category}</h3>
                <ul className="space-y-2">
                  {req.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Guide */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">How to Get Started</CardTitle>
          <CardDescription>
            Follow these steps to become a MyPartsRunner driver
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

      {/* Earnings Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Earnings & Pay</CardTitle>
          <CardDescription>
            Transparent pay structure with multiple earning opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {earnings.map((earning, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{earning.type}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{earning.amount}</div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{earning.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Additional Earning Opportunities:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Peak hour bonuses (rush delivery times)</li>
              <li>• Referral bonuses for new drivers</li>
              <li>• Weekly performance bonuses</li>
              <li>• Holiday and weekend incentives</li>
              <li>• Long-distance delivery bonuses</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Driver Tips & Best Practices</CardTitle>
          <CardDescription>
            Maximize your earnings and provide excellent service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">For Higher Earnings:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Work during peak hours (lunch, dinner, weekends)</li>
                <li>• Accept rush deliveries for higher pay</li>
                <li>• Maintain a high customer rating</li>
                <li>• Complete deliveries quickly and accurately</li>
                <li>• Be friendly and professional with customers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For Better Service:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Keep your vehicle clean and presentable</li>
                <li>• Communicate clearly with customers</li>
                <li>• Handle packages with care</li>
                <li>• Follow delivery instructions precisely</li>
                <li>• Be punctual and reliable</li>
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
              <h4 className="font-semibold mb-2">How long does the application process take?</h4>
              <p className="text-sm text-muted-foreground">
                The entire process typically takes 3-5 business days, including background check and vehicle inspection.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What if I have a delivery issue?</h4>
              <p className="text-sm text-muted-foreground">
                Contact our 24/7 driver support team immediately. We'll help resolve any issues and ensure you're taken care of.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Can I choose my delivery area?</h4>
              <p className="text-sm text-muted-foreground">
                Yes! You can set your preferred delivery zones and only receive requests in those areas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What happens if a customer isn't available?</h4>
              <p className="text-sm text-muted-foreground">
                Contact the customer and wait 5 minutes. If still unavailable, contact support and we'll handle the return.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center mt-12 p-8 bg-primary text-primary-foreground rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
        <p className="mb-6">Join our team of professional drivers and start earning money today</p>
        <div className="flex justify-center gap-4">
          <Button variant="secondary" size="lg" asChild>
            <Link to="/register">Apply Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/driver-application">Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DriverGuidePage; 