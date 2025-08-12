import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  BarChart3, 
  Users, 
  DollarSign, 
  Settings, 
  Shield,
  TrendingUp,
  Globe,
  Phone,
  MessageSquare,
  FileText,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

export const OwnerGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const businessMetrics = [
    {
      metric: 'Total Revenue',
      value: '$125,450',
      change: '+15.3%',
      trend: 'up',
      description: 'Monthly recurring revenue'
    },
    {
      metric: 'Active Users',
      value: '2,847',
      change: '+8.7%',
      trend: 'up',
      description: 'Monthly active users'
    },
    {
      metric: 'Delivery Success',
      value: '98.2%',
      change: '+2.1%',
      trend: 'up',
      description: 'Successful deliveries'
    },
    {
      metric: 'Customer Rating',
      value: '4.8/5',
      change: '+0.2',
      trend: 'up',
      description: 'Average customer satisfaction'
    }
  ];

  const expansionPlans = [
    {
      location: 'Frankfort, KY',
      timeline: 'Q2 2025',
      status: 'Planning',
      potential: 'High',
      description: 'State capital with government employees'
    },
    {
      location: 'Lexington, KY',
      timeline: 'Q3 2025',
      status: 'Research',
      potential: 'Very High',
      description: 'University town with high student population'
    },
    {
      location: 'Cincinnati, OH',
      timeline: 'Q4 2025',
      status: 'Research',
      potential: 'Very High',
      description: 'Major metro area with diverse market'
    },
    {
      location: 'Indianapolis, IN',
      timeline: 'Q1 2026',
      status: 'Future',
      potential: 'High',
      description: 'Growing tech hub with young professionals'
    }
  ];

  const platformFeatures = [
    {
      feature: 'Real-Time Analytics',
      description: 'Live dashboard with business metrics and insights',
      status: 'Active',
      priority: 'High'
    },
    {
      feature: 'Driver Management',
      description: 'Comprehensive driver onboarding and performance tracking',
      status: 'Active',
      priority: 'High'
    },
    {
      feature: 'Merchant Portal',
      description: 'Advanced store management and order processing',
      status: 'Active',
      priority: 'High'
    },
    {
      feature: 'Customer App',
      description: 'Mobile app for ordering and tracking deliveries',
      status: 'Active',
      priority: 'High'
    },
    {
      feature: 'Payment Processing',
      description: 'Secure payment handling and payout management',
      status: 'Active',
      priority: 'High'
    },
    {
      feature: 'Safety & Compliance',
      description: 'Background checks, insurance verification, and safety protocols',
      status: 'Active',
      priority: 'Critical'
    }
  ];

  const growthStrategies = [
    {
      strategy: 'Market Expansion',
      description: 'Expand to new cities and regions based on market analysis',
      timeline: '6-12 months',
      investment: '$50K-100K',
      roi: '200-300%'
    },
    {
      strategy: 'Technology Enhancement',
      description: 'Upgrade platform with AI, machine learning, and automation',
      timeline: '3-6 months',
      investment: '$25K-50K',
      roi: '150-250%'
    },
    {
      strategy: 'Partnership Development',
      description: 'Strategic partnerships with major retailers and manufacturers',
      timeline: '4-8 months',
      investment: '$15K-30K',
      roi: '300-500%'
    },
    {
      strategy: 'Marketing Campaigns',
      description: 'Digital marketing, influencer partnerships, and brand awareness',
      timeline: '2-4 months',
      investment: '$20K-40K',
      roi: '120-180%'
    }
  ];

  const operationalInsights = [
    {
      insight: 'Peak Hours Analysis',
      description: 'Lunch (11-2) and dinner (5-8) show highest demand',
      action: 'Optimize driver scheduling during peak hours',
      impact: 'Increase revenue by 25-35%'
    },
    {
      insight: 'Customer Retention',
      description: '80% of customers return within 30 days',
      action: 'Implement loyalty program and personalized offers',
      impact: 'Boost repeat orders by 40-60%'
    },
    {
      insight: 'Driver Satisfaction',
      description: 'Driver retention rate is 85% after 6 months',
      action: 'Enhance driver benefits and career development',
      impact: 'Reduce recruitment costs by 30-50%'
    },
    {
      insight: 'Market Penetration',
      description: 'Current market share in Louisville is 12%',
      action: 'Aggressive marketing and competitive pricing',
      impact: 'Increase market share to 25% within 18 months'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Owner's Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your comprehensive guide to managing and growing MyPartsRunner™. 
          Monitor performance, plan expansion, and optimize operations.
        </p>
      </div>

      {/* Business Overview */}
      <Card className="border-2 border-purple-100">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-purple-700">
            <Crown className="h-5 w-5" />
            Business Overview
          </CardTitle>
          <CardDescription>
            Key performance indicators and business metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-2xl font-bold text-purple-700 mb-1">
                  {metric.value}
                </h3>
                <p className="text-sm text-purple-600 mb-2">{metric.metric}</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className={`h-4 w-4 ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{metric.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Guide Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="expansion">Expansion</TabsTrigger>
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Vision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Mission</h4>
                      <p className="text-sm text-gray-600">
                        Revolutionize auto parts and hardware delivery by connecting customers, 
                        merchants, and drivers through innovative technology.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Vision</h4>
                      <p className="text-sm text-gray-600">
                        Become the leading delivery platform for automotive and hardware industries 
                        across the United States.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Values</h4>
                      <p className="text-sm text-gray-600">
                        Innovation, reliability, safety, customer satisfaction, and community growth.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Service Area</h4>
                      <p className="text-sm text-gray-600">Louisville, KY and Jefferson County</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Active Users</h4>
                      <p className="text-sm text-gray-600">2,847 customers, 156 drivers, 89 merchants</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Revenue Model</h4>
                      <p className="text-sm text-gray-600">Delivery fees, merchant commissions, premium services</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Growth Rate</h4>
                      <p className="text-sm text-gray-600">15-20% month-over-month growth</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expansion Tab */}
        <TabsContent value="expansion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expansion Roadmap</CardTitle>
              <CardDescription>
                Strategic expansion plans for new markets and regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expansionPlans.map((plan, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{plan.location}</h4>
                      <Badge className={
                        plan.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                        plan.status === 'Research' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">Timeline: {plan.timeline}</span>
                      <Badge variant="outline" className={
                        plan.potential === 'Very High' ? 'border-green-300 text-green-700' :
                        plan.potential === 'High' ? 'border-blue-300 text-blue-700' :
                        'border-gray-300 text-gray-700'
                      }>
                        {plan.potential} Potential
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Tab */}
        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Platform Features</CardTitle>
              <CardDescription>
                Current and planned platform capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platformFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{feature.feature}</h4>
                        <Badge className="bg-green-100 text-green-800">
                          {feature.status}
                        </Badge>
                        <Badge variant="outline" className={
                          feature.priority === 'Critical' ? 'border-red-300 text-red-700' :
                          'border-blue-300 text-blue-700'
                        }>
                          {feature.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Strategies</CardTitle>
              <CardDescription>
                Investment opportunities and growth initiatives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {growthStrategies.map((strategy, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">{strategy.strategy}</h4>
                    <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Timeline:</span>
                        <p className="font-medium">{strategy.timeline}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Investment:</span>
                        <p className="font-medium">{strategy.investment}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">ROI:</span>
                        <p className="font-medium text-green-600">{strategy.roi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Operational Insights</CardTitle>
              <CardDescription>
                Key insights and actionable recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operationalInsights.map((insight, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">{insight.insight}</h4>
                    <p className="text-sm text-blue-700 mb-2">{insight.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-blue-800">Recommended Action:</span>
                        <p className="text-sm text-blue-700">{insight.action}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-800">Expected Impact:</span>
                        <p className="text-sm text-green-700">{insight.impact}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-20 flex-col gap-2" variant="outline">
          <BarChart3 className="h-6 w-6" />
          <span>Analytics Dashboard</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Phone className="h-6 w-6" />
          <span>Executive Support</span>
        </Button>
        
        <Button className="h-20 flex-col gap-2" variant="outline">
          <Settings className="h-6 w-6" />
          <span>Platform Settings</span>
        </Button>
      </div>
    </div>
  );
}; 