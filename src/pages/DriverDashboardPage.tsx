import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useDriverStatus } from '@/hooks/use-driver-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Car, 
  DollarSign, 
  Package, 
  Clock, 
  Navigation, 
  Phone, 
  Camera,
  MapPin,
  TrendingUp,
  Star,
  Fuel,
  AlertTriangle,
  Battery,
  Signal
} from 'lucide-react';

const DriverDashboardPage: React.FC = () => {
  const { user } = useAppContext();
  const { isOnline, goOnline, goOffline, startLocationTracking, stopLocationTracking } = useDriverStatus();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [signalStrength, setSignalStrength] = useState<number>(4);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Simulate battery and signal for demo
  useEffect(() => {
    const updateDeviceStatus = () => {
      setBatteryLevel(Math.floor(Math.random() * 30) + 70); // 70-100%
      setSignalStrength(Math.floor(Math.random() * 2) + 3); // 3-4 bars
    };
    
    const interval = setInterval(updateDeviceStatus, 30000);
    updateDeviceStatus();
    return () => clearInterval(interval);
  }, []);

  const handleStatusToggle = async (checked: boolean) => {
    if (checked) {
      await goOnline();
    } else {
      await goOffline();
    }
  };

  // Mock data for demo
  const todayEarnings = 127.50;
  const activeDeliveries = 2;
  const completedToday = 8;
  const currentRating = 4.8;
  const weeklyTarget = 750;
  const weeklyProgress = 445;

  const quickActions = [
    { icon: Navigation, label: 'GPS', color: 'bg-blue-500', action: () => console.log('GPS') },
    { icon: Phone, label: 'Support', color: 'bg-green-500', action: () => console.log('Support') },
    { icon: Camera, label: 'Photo', color: 'bg-purple-500', action: () => console.log('Camera') },
    { icon: Fuel, label: 'Gas', color: 'bg-orange-500', action: () => console.log('Gas Stations') }
  ];

  const DeviceStatusBar = () => (
    <div className="flex items-center justify-between text-xs text-gray-600 mb-4 px-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <span>{signalStrength}/4</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="h-3 w-3" />
          <span>{batteryLevel}%</span>
        </div>
      </div>
      <div className="text-center font-medium">
        {currentTime.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}
      </div>
      <div className="text-right">
        {currentTime.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <DeviceStatusBar />
      
      {/* Driver Status Card */}
      <Card className="mb-6 border-l-4 border-l-blue-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isOnline ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Car className={`h-6 w-6 ${isOnline ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  {isOnline ? 'You\'re Online!' : 'You\'re Offline'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Ready to accept deliveries' : 'Go online to start earning'}
                </p>
              </div>
            </div>
            <Switch
              checked={isOnline}
              onCheckedChange={handleStatusToggle}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          
          {isOnline && (
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activeDeliveries}</div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completedToday}</div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-lg font-bold">{currentRating}</span>
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Earnings */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-green-600" />
            Today's Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-3xl font-bold text-green-600 mb-2">
            ${todayEarnings.toFixed(2)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Weekly Progress</span>
            <span className="font-medium">${weeklyProgress}/${weeklyTarget}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(weeklyProgress / weeklyTarget) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600 font-medium">
              {((weeklyProgress / weeklyTarget) * 100).toFixed(0)}% of weekly goal
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Active Deliveries */}
      {activeDeliveries > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5 text-blue-600" />
              Active Deliveries
              <Badge className="bg-red-500">{activeDeliveries}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="border rounded-lg p-3 bg-blue-50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Order #MP-2024-001</div>
                <Badge className="bg-blue-600">Priority</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>123 Main St, Downtown (0.8 mi)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Clock className="h-4 w-4" />
                <span>Pickup in 15 minutes</span>
              </div>
              <Button size="sm" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Navigate to Pickup
              </Button>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Order #MP-2024-002</div>
                <Badge variant="secondary">Standard</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>456 Oak Ave, Midtown (1.2 mi)</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Clock className="h-4 w-4" />
                <span>Pickup in 45 minutes</span>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 border-transparent hover:border-gray-200 transition-all"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Performance Today</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12.5</div>
              <div className="text-sm text-gray-600">Miles Driven</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4h 20m</div>
              <div className="text-sm text-gray-600">Online Time</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">On-Time Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <div className="font-medium text-orange-800">Safety Reminder</div>
              <div className="text-sm text-orange-700">
                Always wear your seatbelt and follow traffic laws. Stay safe out there!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDashboardPage; 