import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Store, 
  Car, 
  BarChart3, 
  Settings,
  Shield,
  Bell,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Package,
  MapPin,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import NotificationSystem from '@/components/NotificationSystem';
import RouteOptimizer from '@/components/RouteOptimizer';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data
  const platformStats = {
    totalUsers: 15420,
    activeDrivers: 234,
    activeMerchants: 89,
    totalOrders: 45678,
    totalRevenue: 2456789,
    systemHealth: 98.5,
    averageDeliveryTime: 38,
    customerSatisfaction: 4.7
  };

  const systemAlerts = [
    {
      id: '1',
      type: 'critical',
      title: 'High Server Load',
      message: 'Database server experiencing high load (85%)',
      time: '5 minutes ago',
      resolved: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Low Driver Availability',
      message: 'Manhattan area has only 3 available drivers',
      time: '15 minutes ago',
      resolved: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Scheduled Maintenance',
      message: 'Payment system maintenance tonight 2-4 AM',
      time: '1 hour ago',
      resolved: true
    }
  ];

  const recentUsers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-15',
      orders: 12
    },
    {
      id: '2',
      name: 'Mike Rodriguez',
      email: 'mike@example.com',
      role: 'driver',
      status: 'active',
      joinDate: '2024-01-10',
      deliveries: 156
    },
    {
      id: '3',
      name: 'AutoZone Downtown',
      email: 'manager@autozone.com',
      role: 'merchant',
      status: 'active',
      joinDate: '2024-01-05',
      orders: 234
    }
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertTriangle;
      case 'info': return Bell;
      default: return Bell;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'merchant': return 'bg-blue-100 text-blue-800';
      case 'driver': return 'bg-green-100 text-green-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {user?.firstName || 'Admin'}! Monitor and manage the MyPartsRunner platform.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={`${platformStats.systemHealth > 95 ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
              <CheckCircle className="h-3 w-3 mr-1" />
              System Health: {platformStats.systemHealth}%
            </Badge>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Platform Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold">{platformStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% this month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Platform Revenue</p>
                  <p className="text-3xl font-bold">${(platformStats.totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +18.2% growth
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Drivers</p>
                  <p className="text-3xl font-bold">{platformStats.activeDrivers}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {platformStats.activeMerchants} merchants
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Car className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Avg Delivery Time</p>
                  <p className="text-3xl font-bold">{platformStats.averageDeliveryTime}m</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    5% faster
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        {systemAlerts.filter(alert => !alert.resolved).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                System Alerts ({systemAlerts.filter(alert => !alert.resolved).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {systemAlerts.filter(alert => !alert.resolved).map((alert) => {
                  const Icon = getAlertIcon(alert.type);
                  return (
                    <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button size="sm">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent User Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent User Registrations</CardTitle>
                  <CardDescription>Latest users who joined the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{user.name}</h4>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRoleColor(user.role)}>
                                {user.role}
                              </Badge>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {user.role === 'driver' ? `${user.deliveries} deliveries` :
                             user.role === 'merchant' ? `${user.orders} orders` :
                             `${user.orders} orders`}
                          </p>
                          <p className="text-xs text-gray-500">{user.joinDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Platform Health */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                  <CardDescription>Real-time system status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Response Time</span>
                    <span className="text-sm">125ms</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database Performance</span>
                    <span className="text-sm">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Processing</span>
                    <span className="text-sm">98%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Notification Delivery</span>
                    <span className="text-sm">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Users className="h-5 w-5" />
                    <span className="text-xs">User Management</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Store className="h-5 w-5" />
                    <span className="text-xs">Merchant Approval</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Car className="h-5 w-5" />
                    <span className="text-xs">Driver Verification</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="text-xs">Generate Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Bell className="h-5 w-5" />
                    <span className="text-xs">Send Announcement</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Settings className="h-5 w-5" />
                    <span className="text-xs">System Config</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard userRole="admin" />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">User Management</h3>
                    <p className="text-gray-600">Manage all platform users</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input placeholder="Search users..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User List */}
            <Card>
              <CardHeader>
                <CardTitle>All Users ({recentUsers.length + 15417})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                            <span className="text-xs text-gray-500">{user.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations">
            <RouteOptimizer />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem userRole="admin" />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Configure platform-wide settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Configuration</h3>
                  <p className="text-gray-600 mb-4">
                    Advanced settings for platform management, security, and integrations.
                  </p>
                  <Button>
                    <Shield className="h-4 w-4 mr-2" />
                    Open Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboardPage; 