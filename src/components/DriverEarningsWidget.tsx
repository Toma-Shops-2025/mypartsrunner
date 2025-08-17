import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Package, 
  Clock,
  Star,
  Target,
  Calendar,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface EarningsData {
  today: { amount: number; deliveries: number; hours: number; };
  week: { amount: number; deliveries: number; hours: number; };
  month: { amount: number; deliveries: number; hours: number; };
}

const DriverEarningsWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [earnings, setEarnings] = useState<EarningsData>({
    today: { amount: 0, deliveries: 0, hours: 0 },
    week: { amount: 247.50, deliveries: 15, hours: 12.5 },
    month: { amount: 1247.80, deliveries: 67, hours: 52.3 }
  });

  // Simulate real-time earnings updates
  useEffect(() => {
    const updateTodayEarnings = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Simulate earnings based on time of day
      if (hour >= 7 && hour <= 22) { // Active delivery hours
        const baseEarnings = Math.max(0, (hour - 7) * 15 + Math.random() * 20);
        const deliveries = Math.floor(baseEarnings / 18); // ~$18 per delivery
        const hours = Math.min(hour - 7, 8); // Max 8 hours shown
        
        setEarnings(prev => ({
          ...prev,
          today: {
            amount: baseEarnings,
            deliveries: deliveries,
            hours: hours
          }
        }));
      }
    };

    updateTodayEarnings();
    const interval = setInterval(updateTodayEarnings, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getHourlyRate = (amount: number, hours: number) => {
    return hours > 0 ? (amount / hours).toFixed(2) : '0.00';
  };

  const getPerDeliveryRate = (amount: number, deliveries: number) => {
    return deliveries > 0 ? (amount / deliveries).toFixed(2) : '0.00';
  };

  const EarningsTab = ({ period, data }: { period: string; data: { amount: number; deliveries: number; hours: number; } }) => (
    <div className="space-y-4">
      {/* Main Earnings Display */}
      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
        <h3 className="text-3xl font-bold text-green-800">${data.amount.toFixed(2)}</h3>
        <p className="text-green-600 capitalize">{period} Earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Deliveries</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{data.deliveries}</p>
          <p className="text-xs text-gray-600">${getPerDeliveryRate(data.amount, data.deliveries)} per delivery</p>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Hours</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{data.hours.toFixed(1)}</p>
          <p className="text-xs text-gray-600">${getHourlyRate(data.amount, data.hours)}/hour</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Star className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Performance Highlights</span>
        </div>
        
        <div className="space-y-2">
          {data.amount > 200 && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs text-blue-700">Excellent earnings! Keep it up!</span>
            </div>
          )}
          
          {data.deliveries > 10 && (
            <div className="flex items-center gap-2">
              <Target className="h-3 w-3 text-green-600" />
              <span className="text-xs text-blue-700">High delivery volume - great work!</span>
            </div>
          )}
          
          {parseFloat(getHourlyRate(data.amount, data.hours)) > 20 && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-green-600" />
              <span className="text-xs text-blue-700">Above average hourly rate!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            <CardTitle>Earnings Summary</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard?tab=earnings" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs">View Details</span>
            </a>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
            <TabsTrigger value="month" className="text-xs">This Month</TabsTrigger>
          </TabsList>
          
          <TabsContent value="today" className="mt-4">
            <EarningsTab period="today" data={earnings.today} />
          </TabsContent>
          
          <TabsContent value="week" className="mt-4">
            <EarningsTab period="week" data={earnings.week} />
          </TabsContent>
          
          <TabsContent value="month" className="mt-4">
            <EarningsTab period="month" data={earnings.month} />
          </TabsContent>
        </Tabs>

        {/* Quick Action */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">Earnings Tip</span>
          </div>
          <p className="text-xs text-amber-700">
            Peak hours are typically 11am-2pm and 5pm-8pm. 
            Going online during these times can boost your earnings!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverEarningsWidget; 