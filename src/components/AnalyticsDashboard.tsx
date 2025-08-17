import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Package, 
  Car,
  Clock,
  Star,
  MapPin,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';

interface AnalyticsMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage' | 'time';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

interface AnalyticsDashboardProps {
  dateRange?: string;
  userRole?: 'admin' | 'merchant' | 'driver';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  dateRange = '30d',
  userRole = 'admin'
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState(dateRange);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock analytics data
  const keyMetrics: AnalyticsMetric[] = [
    {
      id: 'revenue',
      label: 'Total Revenue',
      value: 284750,
      change: 12.5,
      changeType: 'increase',
      format: 'currency',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 'orders',
      label: 'Total Orders',
      value: 1842,
      change: 8.3,
      changeType: 'increase',
      format: 'number',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      id: 'customers',
      label: 'Active Customers',
      value: 756,
      change: 15.2,
      changeType: 'increase',
      format: 'number',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 'drivers',
      label: 'Active Drivers',
      value: 45,
      change: 2.1,
      changeType: 'increase',
      format: 'number',
      icon: Car,
      color: 'text-orange-600'
    },
    {
      id: 'avg_delivery_time',
      label: 'Avg Delivery Time',
      value: 38,
      change: -5.4,
      changeType: 'increase', // Decrease in time is good
      format: 'time',
      icon: Clock,
      color: 'text-emerald-600'
    },
    {
      id: 'satisfaction',
      label: 'Customer Satisfaction',
      value: 4.7,
      change: 3.2,
      changeType: 'increase',
      format: 'number',
      icon: Star,
      color: 'text-yellow-600'
    }
  ];

  const revenueChartData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [18500, 22300, 28900, 25600, 32100, 38200, 35800, 42300, 39600, 45200, 48100, 52400],
        color: '#10b981'
      },
      {
        label: 'Orders',
        data: [145, 182, 234, 198, 267, 312, 289, 345, 324, 378, 392, 425],
        color: '#3b82f6'
      }
    ]
  };

  const deliveryPerformance = {
    onTime: 92.5,
    early: 5.8,
    late: 1.7,
    totalDeliveries: 1842
  };

  const topPerformers = {
    drivers: [
      { name: 'Alex Rodriguez', deliveries: 234, rating: 4.9, earnings: 8950 },
      { name: 'Sarah Johnson', deliveries: 198, rating: 4.8, earnings: 7680 },
      { name: 'Mike Chen', deliveries: 187, rating: 4.7, earnings: 7450 },
      { name: 'Lisa Wong', deliveries: 156, rating: 4.9, earnings: 6890 },
      { name: 'David Park', deliveries: 142, rating: 4.6, earnings: 5980 }
    ],
    merchants: [
      { name: 'AutoZone Downtown', orders: 456, revenue: 89450, rating: 4.8 },
      { name: 'O\'Reilly Auto Parts', orders: 389, revenue: 67230, rating: 4.7 },
      { name: 'Advance Auto Parts', orders: 312, revenue: 54890, rating: 4.6 },
      { name: 'NAPA Auto Parts', orders: 278, revenue: 48750, rating: 4.5 },
      { name: 'Pep Boys', orders: 234, revenue: 42180, rating: 4.4 }
    ],
    products: [
      { name: 'Brake Pads', sales: 234, revenue: 18900, growth: 15.2 },
      { name: 'Oil Filters', sales: 456, revenue: 12450, growth: 8.7 },
      { name: 'Spark Plugs', sales: 189, revenue: 8970, growth: 22.1 },
      { name: 'Air Filters', sales: 167, revenue: 7850, growth: 5.4 },
      { name: 'Batteries', sales: 89, revenue: 15600, growth: 12.8 }
    ]
  };

  const geographicData = [
    { region: 'Manhattan', orders: 567, revenue: 89450, growth: 12.5 },
    { region: 'Brooklyn', orders: 432, revenue: 67890, growth: 8.9 },
    { region: 'Queens', orders: 398, revenue: 58760, growth: 15.2 },
    { region: 'Bronx', orders: 245, revenue: 38920, growth: 6.7 },
    { region: 'Staten Island', orders: 200, revenue: 29730, growth: 18.4 }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'time':
        return `${value} min`;
      default:
        return value.toLocaleString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'increase' ? TrendingUp : TrendingDown;
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon;
          const ChangeIcon = getChangeIcon(metric.changeType);
          
          return (
            <Card key={metric.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">
                      {formatValue(metric.value, metric.format)}
                    </p>
                    <div className={`flex items-center gap-1 mt-2 text-sm ${getChangeColor(metric.changeType)}`}>
                      <ChangeIcon className="h-3 w-3" />
                      <span>{Math.abs(metric.change)}%</span>
                      <span className="text-gray-500">vs last period</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full bg-gray-50`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Revenue & Orders Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Chart</h3>
                  <p className="text-gray-600 max-w-md">
                    Revenue trending upward with {revenueChartData.datasets[0].data[revenueChartData.datasets[0].data.length - 1] / revenueChartData.datasets[0].data[0] * 100 - 100}% growth year-over-year.
                    Peak performance in Q4 with ${revenueChartData.datasets[0].data[revenueChartData.datasets[0].data.length - 1].toLocaleString()} revenue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Delivery Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Deliveries</span>
                      <span className="font-medium">{deliveryPerformance.onTime}%</span>
                    </div>
                    <Progress value={deliveryPerformance.onTime} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Early Deliveries</span>
                      <span className="font-medium">{deliveryPerformance.early}%</span>
                    </div>
                    <Progress value={deliveryPerformance.early} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Late Deliveries</span>
                      <span className="font-medium">{deliveryPerformance.late}%</span>
                    </div>
                    <Progress value={deliveryPerformance.late} className="h-2 bg-red-100" />
                  </div>
                  <div className="text-center pt-2 border-t">
                    <div className="text-2xl font-bold">{deliveryPerformance.totalDeliveries}</div>
                    <div className="text-sm text-gray-600">Total Deliveries</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Drivers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.drivers.slice(0, 5).map((driver, index) => (
                    <div key={driver.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{driver.name}</div>
                          <div className="text-xs text-gray-600">
                            {driver.deliveries} deliveries • ⭐ {driver.rating}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">${driver.earnings.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Top Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.products.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-gray-600">
                            {product.sales} sales • +{product.growth}% growth
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">${product.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.drivers.map((driver, index) => (
                    <div key={driver.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Car className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{driver.name}</div>
                          <div className="text-sm text-gray-600">
                            {driver.deliveries} deliveries this month
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${driver.earnings.toLocaleString()}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {driver.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Merchant Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.merchants.map((merchant, index) => (
                    <div key={merchant.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{merchant.name}</div>
                          <div className="text-sm text-gray-600">
                            {merchant.orders} orders this month
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${merchant.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {merchant.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geographic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {geographicData.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{region.region}</div>
                        <div className="text-sm text-gray-600">
                          {region.orders} orders • +{region.growth}% growth
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${region.revenue.toLocaleString()}</div>
                        <Progress 
                          value={(region.revenue / Math.max(...geographicData.map(r => r.revenue))) * 100} 
                          className="w-20 h-2 mt-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg h-80">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Geographic Heat Map</h3>
                    <p className="text-gray-600">Interactive map showing order density and revenue by region</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.products.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-600">
                          {product.sales} units sold this month
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="font-bold">${product.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          +{product.growth}%
                        </div>
                        <div className="text-xs text-gray-600">Growth</div>
                      </div>
                      <Progress value={product.growth} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="text-sm">
                      <div className="font-medium">Low Driver Availability</div>
                      <div className="text-gray-600">Manhattan area needs 3 more drivers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div className="text-sm">
                      <div className="font-medium">System Maintenance</div>
                      <div className="text-gray-600">Scheduled for tonight 2-4 AM</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <div className="text-sm">
                      <div className="font-medium">All Systems Operational</div>
                      <div className="text-gray-600">99.9% uptime this month</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Real-Time Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">23</div>
                    <div className="text-sm text-gray-600">Active Drivers</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">67</div>
                    <div className="text-sm text-gray-600">Orders in Progress</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">Orders Today</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>System Health</span>
                      <span className="font-medium">98.5%</span>
                    </div>
                    <Progress value={98.5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Driver Satisfaction</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Revenue Target</span>
                      <span className="font-medium">87.3%</span>
                    </div>
                    <Progress value={87.3} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard; 