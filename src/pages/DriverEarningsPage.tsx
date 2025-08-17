import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Star,
  Package,
  Clock,
  Target,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';

const DriverEarningsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Mock earnings data
  const earningsData = {
    today: {
      total: 127.50,
      base: 89.25,
      tips: 38.25,
      bonus: 0,
      deliveries: 8,
      hours: 4.3,
      hourlyRate: 29.65,
      mileage: 12.5,
      perMile: 10.20
    },
    week: {
      total: 445.80,
      base: 312.40,
      tips: 133.40,
      bonus: 0,
      deliveries: 28,
      hours: 15.2,
      hourlyRate: 29.33,
      mileage: 42.8,
      perMile: 10.42
    },
    month: {
      total: 1876.45,
      base: 1324.50,
      tips: 451.95,
      bonus: 100.00,
      deliveries: 124,
      hours: 67.5,
      hourlyRate: 27.80,
      mileage: 186.3,
      perMile: 10.07
    }
  };

  const currentData = earningsData[selectedPeriod as keyof typeof earningsData];

  const weeklyBreakdown = [
    { day: 'Mon', earnings: 62.50, deliveries: 4, hours: 2.5 },
    { day: 'Tue', earnings: 78.25, deliveries: 5, hours: 3.2 },
    { day: 'Wed', earnings: 94.80, deliveries: 6, hours: 4.1 },
    { day: 'Thu', earnings: 83.75, deliveries: 5, hours: 3.8 },
    { day: 'Fri', earnings: 126.50, deliveries: 8, hours: 5.6 },
    { day: 'Sat', earnings: 0, deliveries: 0, hours: 0 },
    { day: 'Sun', earnings: 0, deliveries: 0, hours: 0 }
  ];

  const achievements = [
    { 
      icon: Star, 
      title: 'Top Performer', 
      description: '4.8+ rating this week',
      color: 'bg-yellow-500',
      earned: true 
    },
    { 
      icon: Zap, 
      title: 'Speed Demon', 
      description: '95% on-time delivery',
      color: 'bg-blue-500',
      earned: true 
    },
    { 
      icon: Target, 
      title: 'Goal Crusher', 
      description: 'Weekly target achieved',
      color: 'bg-green-500',
      earned: false 
    },
    { 
      icon: Award, 
      title: 'Customer Favorite', 
      description: '10+ 5-star reviews',
      color: 'bg-purple-500',
      earned: true 
    }
  ];

  const upcomingGoals = [
    { target: 'Weekly Goal', current: 445.80, goal: 750, color: 'bg-green-500' },
    { target: 'Monthly Goal', current: 1876.45, goal: 3000, color: 'bg-blue-500' },
    { target: 'Delivery Count', current: 124, goal: 150, color: 'bg-purple-500' }
  ];

  const maxEarningsDay = Math.max(...weeklyBreakdown.map(day => day.earnings));

  const StatCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProgressBar = ({ current, goal, color }: any) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Earnings</h1>
        <p className="text-gray-600">Track your performance and earnings</p>
      </div>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6 mt-6">
          {/* Main Earnings Card */}
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  ${currentData.total.toFixed(2)}
                </div>
                <div className="text-lg text-gray-600 capitalize">
                  {selectedPeriod === 'today' ? 'Today\'s' : selectedPeriod === 'week' ? 'This Week\'s' : 'This Month\'s'} Total
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">${currentData.base.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Base Pay</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">${currentData.tips.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Tips</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-xl font-bold text-purple-600">${currentData.bonus.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Bonuses</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Hourly Rate"
              value={`$${currentData.hourlyRate.toFixed(2)}`}
              subtitle={`${currentData.hours} hours worked`}
              icon={Clock}
              trend="up"
            />
            <StatCard
              title="Per Mile"
              value={`$${currentData.perMile.toFixed(2)}`}
              subtitle={`${currentData.mileage} miles driven`}
              icon={TrendingUp}
              trend="up"
            />
            <StatCard
              title="Deliveries"
              value={currentData.deliveries}
              subtitle={`${(currentData.total / currentData.deliveries).toFixed(2)} avg per delivery`}
              icon={Package}
              trend="up"
            />
            <StatCard
              title="Tips Rate"
              value={`${((currentData.tips / currentData.total) * 100).toFixed(0)}%`}
              subtitle="of total earnings"
              icon={Star}
              trend="up"
            />
          </div>

          {/* Weekly Breakdown (only show for week tab) */}
          {selectedPeriod === 'week' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Daily Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyBreakdown.map((day, index) => (
                    <div key={day.day} className="flex items-center gap-4">
                      <div className="w-12 text-sm font-medium text-gray-600">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            ${day.earnings.toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {day.deliveries} deliveries • {day.hours}h
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(day.earnings / maxEarningsDay) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Goals Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goals Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingGoals.map((goal, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{goal.target}</span>
                    <span className="text-sm text-gray-600">
                      ${goal.current.toFixed(2)} / ${goal.goal.toFixed(2)}
                    </span>
                  </div>
                  <ProgressBar 
                    current={goal.current} 
                    goal={goal.goal} 
                    color={goal.color}
                  />
                  <div className="text-xs text-gray-600 mt-1">
                    {((goal.current / goal.goal) * 100).toFixed(0)}% complete
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.earned 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-full ${achievement.color} ${
                        achievement.earned ? '' : 'opacity-50'
                      }`}>
                        <achievement.icon className="h-4 w-4 text-white" />
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-green-600">Earned</Badge>
                      )}
                    </div>
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button className="h-12">
              <Calendar className="h-4 w-4 mr-2" />
              View Pay Statements
            </Button>
            <Button variant="outline" className="h-12">
              <TrendingUp className="h-4 w-4 mr-2" />
              Earnings Report
            </Button>
          </div>

          {/* Motivational Tip */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-800">Pro Tip</div>
                  <div className="text-sm text-blue-700">
                    {selectedPeriod === 'today' 
                      ? "Peak hours are 11AM-2PM and 5PM-8PM. Go online during these times to maximize earnings!"
                      : selectedPeriod === 'week'
                      ? "You're doing great! Friday and Saturday typically have the highest earning potential."
                      : "Consistency is key! Try to maintain at least 20 hours per week for steady income."}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverEarningsPage; 