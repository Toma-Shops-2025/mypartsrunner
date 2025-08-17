import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useDriverStatus } from '@/hooks/use-driver-status';
import { useAppContext } from '@/contexts/AppContext';
import { 
  Power, 
  MapPin, 
  Clock, 
  DollarSign, 
  Activity,
  Car,
  Zap,
  AlertCircle,
  CheckCircle2,
  Navigation,
  PhoneCall
} from 'lucide-react';

const DriverStatusWidget: React.FC = () => {
  const { user } = useAppContext();
  const { status, goOnline, goOffline } = useDriverStatus();
  const [isToggling, setIsToggling] = useState(false);
  const [lastActivity, setLastActivity] = useState<string>('');

  // Update last activity time
  useEffect(() => {
    const updateActivity = () => {
      const now = new Date();
      const lastActiveTime = status.lastActive;
      const diffMinutes = Math.floor((now.getTime() - lastActiveTime.getTime()) / 60000);
      
      if (diffMinutes < 1) {
        setLastActivity('Just now');
      } else if (diffMinutes < 60) {
        setLastActivity(`${diffMinutes}m ago`);
      } else {
        const hours = Math.floor(diffMinutes / 60);
        setLastActivity(`${hours}h ago`);
      }
    };

    updateActivity();
    const interval = setInterval(updateActivity, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [status.lastActive]);

  const handleStatusToggle = async () => {
    setIsToggling(true);
    try {
      if (status.isOnline) {
        await goOffline();
      } else {
        await goOnline();
      }
    } catch (error) {
      console.error('Status toggle error:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const getStatusInfo = () => {
    if (status.isOnline) {
      return {
        color: 'bg-green-500',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle2,
        status: 'ONLINE',
        message: 'Ready for deliveries'
      };
    } else {
      return {
        color: 'bg-gray-400',
        textColor: 'text-gray-700', 
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        icon: AlertCircle,
        status: 'OFFLINE',
        message: 'Not receiving requests'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className={`w-full border-2 ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Car className="h-6 w-6 text-blue-600" />
              <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${statusInfo.color} ring-2 ring-white`}></div>
            </div>
            <div>
              <CardTitle className="text-lg">Driver Status</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusIcon className={`h-4 w-4 ${statusInfo.textColor}`} />
                <Badge 
                  variant={status.isOnline ? "default" : "secondary"}
                  className="text-xs font-medium"
                >
                  {statusInfo.status}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Status Toggle */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-600">Quick Toggle</p>
              <Switch
                checked={status.isOnline}
                onCheckedChange={handleStatusToggle}
                disabled={isToggling}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status Message */}
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium">{statusInfo.message}</span>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white rounded-lg border">
            <MapPin className="h-4 w-4 mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-gray-600">Location</p>
            <p className="text-sm font-medium">
              {status.isTrackingLocation ? 'Active' : 'Inactive'}
            </p>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border">
            <Clock className="h-4 w-4 mx-auto mb-1 text-green-600" />
            <p className="text-xs text-gray-600">Last Active</p>
            <p className="text-sm font-medium">{lastActivity}</p>
          </div>
          
          <div className="text-center p-3 bg-white rounded-lg border">
            <DollarSign className="h-4 w-4 mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-gray-600">Today</p>
            <p className="text-sm font-medium">$0.00</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 text-xs"
              onClick={() => window.open('/map', '_blank')}
            >
              <Navigation className="h-3 w-3 mr-1" />
              View Map
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 text-xs"
              onClick={() => window.open('/help', '_blank')}
            >
              <PhoneCall className="h-3 w-3 mr-1" />
              Get Help
            </Button>
          </div>
        </div>

        {/* Main Action Button */}
        <Button
          onClick={handleStatusToggle}
          disabled={isToggling}
          className={`w-full h-12 font-medium ${
            status.isOnline 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isToggling ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Updating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Power className="h-4 w-4" />
              <span>{status.isOnline ? 'Go Offline' : 'Go Online'}</span>
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DriverStatusWidget; 