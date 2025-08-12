import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Package, 
  Star, 
  Clock, 
  MapPin,
  Target,
  Award,
  Zap
} from 'lucide-react';

interface DriverStats {
  totalEarnings: number;
  totalDeliveries: number;
  averageRating: number;
  totalDistance: number;
  totalTime: number;
  weeklyGoal: number;
  weeklyProgress: number;
  topEarningDay: string;
  topEarningAmount: number;
}

interface DriverAnalyticsProps {
  stats: DriverStats;
}

export const DriverAnalytics: React.FC<DriverAnalyticsProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (rating: number) => {
    if (rating >= 4.8) return { text: 'Elite Driver', variant: 'default' as const };
    if (rating >= 4.5) return { text: 'Top Driver', variant: 'default' as const };
    if (rating >= 4.0) return { text: 'Good Driver', variant: 'secondary' as const };
    return { text: 'Improving', variant: 'outline' as const };
  };

  const performanceBadge = getPerformanceBadge(stats.averageRating);

  return (
    <div className="space-y-6">
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(stats.totalEarnings)}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Lifetime earnings from {stats.totalDeliveries} deliveries
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Total Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalDeliveries}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Successful deliveries completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-purple-600" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-purple-600">
                {stats.averageRating.toFixed(1)}
              </div>
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
            <Badge variant={performanceBadge.variant} className="mt-2">
              {performanceBadge.text}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Distance</span>
              <span className="font-semibold">{formatDistance(stats.totalDistance)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Time</span>
              <span className="font-semibold">{formatTime(stats.totalTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Earnings per Delivery</span>
              <span className="font-semibold">
                {formatCurrency(stats.totalEarnings / Math.max(stats.totalDeliveries, 1))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Earnings per Hour</span>
              <span className="font-semibold">
                {formatCurrency((stats.totalEarnings / Math.max(stats.totalTime / 60, 1)))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Weekly Earnings Goal</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(stats.weeklyGoal)}
                </span>
              </div>
              <Progress 
                value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
                className="h-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(stats.weeklyProgress)} of {formatCurrency(stats.weeklyGoal)}
              </p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <Target className="h-4 w-4 inline mr-1" />
                Best Day: {stats.topEarningDay} - {formatCurrency(stats.topEarningAmount)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.totalDeliveries >= 10 && (
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-green-700">First 10</p>
                <p className="text-xs text-green-600">10 deliveries</p>
              </div>
            )}
            
            {stats.totalDeliveries >= 50 && (
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-blue-700">Veteran</p>
                <p className="text-xs text-blue-600">50 deliveries</p>
              </div>
            )}
            
            {stats.totalDeliveries >= 100 && (
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Package className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-purple-700">Century</p>
                <p className="text-xs text-purple-600">100 deliveries</p>
              </div>
            )}
            
            {stats.averageRating >= 4.8 && (
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-yellow-700">Elite</p>
                <p className="text-xs text-yellow-600">4.8+ rating</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips for Improvement */}
      <Card className="border-2 border-orange-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-600" />
            Tips to Boost Your Earnings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Go online during peak hours (lunch 11-2, dinner 5-8)
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Accept deliveries in high-demand areas
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Maintain a 4.8+ rating for priority access
              </p>
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                Complete deliveries quickly and safely
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 