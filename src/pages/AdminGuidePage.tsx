import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Settings, Users, BarChart3, Shield, AlertTriangle, TrendingUp, Globe, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminGuidePage: React.FC = () => {
  const dashboardSections = [
    {
      title: "User Management",
      description: "Manage customers, drivers, and merchants",
      features: [
        "View all registered users",
        "Approve/reject driver applications",
        "Verify merchant businesses",
        "Handle user disputes and issues",
        "Monitor user activity and ratings"
      ],
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Order Management",
      description: "Monitor and manage all platform orders",
      features: [
        "View real-time order status",
        "Handle order disputes and refunds",
        "Monitor delivery performance",
        "Track revenue and analytics",
        "Manage payment processing"
      ],
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: "Store Management",
      description: "Oversee merchant stores and products",
      features: [
        "Approve new store registrations",
        "Monitor store performance",
        "Review product listings",
        "Handle store disputes",
        "Manage store categories"
      ],
      icon: <Globe className="h-6 w-6" />
    },
    {
      title: "System Settings",
      description: "Configure platform settings and policies",
      features: [
        "Set delivery fees and pricing",
        "Configure payment methods",
        "Manage platform policies",
        "Set up automated notifications",
        "Configure security settings"
      ],
      icon: <Settings className="h-6 w-6" />
    }
  ];

  const dailyTasks = [
    {
      task: "Review Driver Applications",
      priority: "High",
      description: "Approve or reject new driver applications within 24 hours",
      frequency: "Daily"
    },
    {
      task: "Monitor Order Disputes",
      priority: "High",
      description: "Resolve customer and merchant disputes promptly",
      frequency: "As needed"
    },
    {
      task: "Review Store Applications",
      priority: "Medium",
      description: "Verify and approve new merchant store registrations",
      frequency: "Daily"
    },
    {
      task: "Check System Health",
      priority: "Medium",
      description: "Monitor platform performance and server status",
      frequency: "Daily"
    },
    {
      task: "Review Analytics",
      priority: "Low",
      description: "Analyze platform metrics and user behavior",
      frequency: "Weekly"
    }
  ];

  const securityMeasures = [
    {
      title: "User Verification",
      description: "Verify all driver and merchant identities",
      steps: [
        "Review submitted documents",
        "Conduct background checks",
        "Verify business licenses",
        "Check insurance coverage"
      ]
    },
    {
      title: "Payment Security",
      description: "Ensure secure payment processing",
      steps: [
        "Monitor payment transactions",
        "Review fraud detection alerts",
        "Handle chargeback disputes",
        "Verify payment method validity"
      ]
    },
    {
      title: "Data Protection",
      description: "Protect user data and privacy",
      steps: [
        "Monitor data access logs",
        "Review privacy compliance",
        "Handle data breach incidents",
        "Update security policies"
      ]
    }
  ];

  const analytics = [
    {
      metric: "Total Users",
      description: "Track user growth across all categories",
      tools: ["User registration trends", "Active user counts", "User retention rates"]
    },
    {
      metric: "Order Volume",
      description: "Monitor order processing and delivery",
      tools: ["Daily order counts", "Revenue tracking", "Delivery success rates"]
    },
    {
      metric: "Store Performance",
      description: "Analyze merchant store success",
      tools: ["Store revenue", "Product performance", "Customer satisfaction"]
    },
    {
      metric: "Driver Performance",
      description: "Track driver efficiency and ratings",
      tools: ["Delivery times", "Driver ratings", "Earnings analysis"]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Admin Guide</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Complete guide to managing the MyPartsRunner platform
        </p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Platform Administrator
        </Badge>
      </div>

      {/* Dashboard Overview */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Dashboard Overview</CardTitle>
          <CardDescription>
            Key areas to monitor and manage on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardSections.map((section, index) => (
              <Card key={index} className="border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {section.icon}
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily Tasks */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Daily Administrative Tasks</CardTitle>
          <CardDescription>
            Essential tasks to keep the platform running smoothly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyTasks.map((task, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Badge 
                    variant={task.priority === "High" ? "destructive" : task.priority === "Medium" ? "default" : "secondary"}
                    className="mb-2"
                  >
                    {task.priority}
                  </Badge>
                  <div className="text-xs text-muted-foreground">{task.frequency}</div>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{task.task}</h4>
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Measures */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Security & Compliance</CardTitle>
          <CardDescription>
            Essential security measures to protect the platform and users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {securityMeasures.map((measure, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold">{measure.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{measure.description}</p>
                <ul className="space-y-1">
                  {measure.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics & Reporting */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Analytics & Reporting</CardTitle>
          <CardDescription>
            Key metrics to monitor for platform success
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analytics.map((metric, index) => (
              <Card key={index} className="border">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">{metric.metric}</CardTitle>
                  </div>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {metric.tools.map((tool, toolIndex) => (
                      <li key={toolIndex} className="text-sm text-muted-foreground">
                        • {tool}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Procedures */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Emergency Procedures</CardTitle>
          <CardDescription>
            How to handle critical situations and platform issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-600 mb-2">System Outage</h4>
              <ol className="text-sm space-y-1">
                <li>1. Check server status and error logs</li>
                <li>2. Notify technical team immediately</li>
                <li>3. Update status page and social media</li>
                <li>4. Communicate with affected users</li>
                <li>5. Monitor recovery progress</li>
              </ol>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-orange-600 mb-2">Security Breach</h4>
              <ol className="text-sm space-y-1">
                <li>1. Assess the scope of the breach</li>
                <li>2. Secure affected systems immediately</li>
                <li>3. Notify security team and legal counsel</li>
                <li>4. Contact affected users if necessary</li>
                <li>5. Document incident and response</li>
              </ol>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-600 mb-2">Payment Issues</h4>
              <ol className="text-sm space-y-1">
                <li>1. Verify payment processor status</li>
                <li>2. Check for system-wide payment failures</li>
                <li>3. Contact payment provider support</li>
                <li>4. Update users on payment status</li>
                <li>5. Process manual refunds if needed</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Best Practices</CardTitle>
          <CardDescription>
            Guidelines for effective platform management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Daily Operations:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Check system status first thing each morning</li>
                <li>• Review pending applications within 24 hours</li>
                <li>• Monitor user support tickets</li>
                <li>• Check for any system alerts or warnings</li>
                <li>• Review daily analytics and reports</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Communication:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Respond to urgent issues within 1 hour</li>
                <li>• Keep users informed of system updates</li>
                <li>• Maintain clear communication with team</li>
                <li>• Document all major decisions and actions</li>
                <li>• Regular status updates to stakeholders</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col">
              <Users className="h-5 w-5 mb-2" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <BarChart3 className="h-5 w-5 mb-2" />
              <span>View Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Settings className="h-5 w-5 mb-2" />
              <span>System Settings</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <AlertTriangle className="h-5 w-5 mb-2" />
              <span>Handle Disputes</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Database className="h-5 w-5 mb-2" />
              <span>Data Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col">
              <Shield className="h-5 w-5 mb-2" />
              <span>Security</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGuidePage; 