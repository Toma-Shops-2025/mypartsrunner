import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  BarChart3, 
  DollarSign, 
  Users, 
  Settings,
  ShoppingCart,
  Truck,
  Bell,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import InventoryManager from '@/components/InventoryManager';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import NotificationSystem from '@/components/NotificationSystem';
import OrderManagement from '@/components/OrderManagement';
import DynamicPricing from '@/components/DynamicPricing';

const MerchantDashboardPage: React.FC = () => {
  const { user } = useAppContext();

  // Mock merchant data
  const merchantStats = {
    totalOrders: 234,
    pendingOrders: 12,
    totalRevenue: 45670,
    monthlyGrowth: 15.2,
    averageOrderValue: 89.50,
    customerRating: 4.7,
    lowStockItems: 8,
    outOfStockItems: 3
  };

  const recentActivity = [
    {
      id: '1',
      type: 'order',
      message: 'New order #MP-2024-001 received',
      time: '5 minutes ago',
      status: 'new'
    },
    {
      id: '2',
      type: 'inventory',
      message: 'Brake pads running low (5 remaining)',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      id: '3',
      type: 'payment',
      message: 'Payment of $450.00 processed',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: '4',
      type: 'review',
      message: 'New 5-star review from Sarah Johnson',
      time: '3 hours ago',
      status: 'success'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart;
      case 'inventory': return Package;
      case 'payment': return DollarSign;
      case 'review': return Users;
      default: return Bell;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Merchant Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.firstName || 'Merchant'}! Manage your auto parts business.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="h-3 w-3 mr-1" />
              Store Active
            </Badge>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Store Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold">{merchantStats.totalOrders}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +{merchantStats.monthlyGrowth}% this month
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Revenue</p>
                  <p className="text-3xl font-bold">${merchantStats.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Avg: ${merchantStats.averageOrderValue.toFixed(2)}
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
                  <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold">{merchantStats.pendingOrders}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Need attention
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <Truck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Customer Rating</p>
                  <p className="text-3xl font-bold">{merchantStats.customerRating}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    ⭐ Excellent rating
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Cards */}
        {(merchantStats.lowStockItems > 0 || merchantStats.outOfStockItems > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {merchantStats.lowStockItems > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Low Stock Alert</p>
                      <p className="text-sm text-yellow-700">
                        {merchantStats.lowStockItems} items are running low on stock
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      View Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {merchantStats.outOfStockItems > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium text-red-800">Out of Stock</p>
                      <p className="text-sm text-red-700">
                        {merchantStats.outOfStockItems} items are completely out of stock
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Restock Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className={`p-2 rounded-full ${getActivityColor(activity.status)}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.message}</p>
                            <p className="text-xs text-gray-600">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common merchant tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Add New Product
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Sales Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Customer Reviews
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Store Settings
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your store's performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">98.5%</div>
                    <div className="text-sm text-gray-600">Order Fulfillment</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">24h</div>
                    <div className="text-sm text-gray-600">Avg Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">567</div>
                    <div className="text-sm text-gray-600">Active Customers</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">156</div>
                    <div className="text-sm text-gray-600">Products Listed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager merchantId={user?.id || 'demo-merchant'} />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard userRole="merchant" />
          </TabsContent>

          <TabsContent value="pricing">
            <DynamicPricing 
              basePrice={89.99}
              onPriceChange={(result) => {
                console.log('Price updated:', result);
              }}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem userRole="merchant" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MerchantDashboardPage; 