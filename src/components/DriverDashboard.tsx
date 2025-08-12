import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useDriverStatus } from '@/hooks/use-driver-status';
import { useDeliveryRequests } from '@/hooks/use-delivery-requests';
import { 
  Wifi, 
  WifiOff, 
  MapPin, 
  Clock, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Award,
  Navigation,
  Phone,
  MessageSquare,
  Settings,
  Bell,
  Zap
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DriverDashboard: React.FC = () => {
  const {
    isOnline,
    currentLocation,
    isTrackingLocation,
    lastActive,
    goOnline,
    goOffline,
    resetAutoOfflineTimer
  } = useDriverStatus();

  const {
    requests,
    loading,
    acceptRequest
  } = useDeliveryRequests();

  const [showNotifications, setShowNotifications] = useState(false);

  const handleStatusToggle = async () => {
    if (isOnline) {
      await goOffline();
    } else {
      await goOnline();
    }
  };

  const handleAcceptDelivery = async (requestId: string) => {
    await acceptRequest(requestId);
    toast({
      title: "Delivery Accepted! 🚗",
      description: "Navigate to pickup location and start your delivery",
      variant: "default"
    });
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

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="border-2 border-blue-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Driver Status</CardTitle>
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-8 w-8 text-green-500" />
            ) : (
              <WifiOff className="h-8 w-8 text-red-500" />
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold">
                {isOnline ? "You're Available for Deliveries" : "You're Not Available"}
              </p>
              <p className="text-sm text-gray-600">
                {isOnline 
                  ? "Location tracking active • Receiving delivery requests"
                  : "Go online to start receiving deliveries"
                }
              </p>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-lg font-semibold" 
            onClick={handleStatusToggle}
            variant={isOnline ? "outline" : "default"}
          >
            {isOnline ? "Go Offline" : "Go Online"}
          </Button>

          {isOnline && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                🎯 You're visible to customers and merchants
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location & Activity */}
      {isOnline && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Current Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentLocation ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Lat: {currentLocation.latitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lng: {currentLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Accuracy: ±{Math.round(currentLocation.accuracy)}m
                  </p>
                  <Badge variant="outline" className="text-green-600">
                    <Zap className="h-3 w-3 mr-1" />
                    Tracking Active
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Getting location...</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activity Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Last Active: {lastActive.toLocaleTimeString()}
                </p>
                <p className="text-sm text-gray-600">
                  Session: {Math.round((Date.now() - lastActive.getTime()) / 60000)}m
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetAutoOfflineTimer}
                  className="w-full"
                >
                  Reset Auto-Offline Timer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Available Deliveries */}
      {isOnline && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Available Deliveries</CardTitle>
                <CardDescription>
                  {requests.length} delivery requests available
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4 mr-2" />
                {showNotifications ? "Hide" : "Show"} Notifications
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading deliveries...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No delivery requests available</p>
                <p className="text-sm text-gray-500 mt-1">
                  New requests will appear here automatically
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.slice(0, 5).map((request) => (
                  <Card key={request.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{request.storeName}</h4>
                          <p className="text-sm text-gray-600">
                            {request.items.length} items • ${request.totalAmount}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-green-600">
                          ${request.deliveryFee}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{formatDistance(request.estimatedDistance)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{formatTime(request.estimatedTime)}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAcceptDelivery(request.id)}
                        >
                          Accept Delivery
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // TODO: Show delivery details modal
                            toast({
                              title: "Delivery Details",
                              description: "Detailed view coming soon",
                              variant: "default"
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {requests.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm">
                      View All {requests.length} Deliveries
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Navigation className="h-6 w-6" />
              <span className="text-sm">Navigation</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Phone className="h-6 w-6" />
              <span className="text-sm">Call Support</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Messages</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Settings className="h-6 w-6" />
              <span className="text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 