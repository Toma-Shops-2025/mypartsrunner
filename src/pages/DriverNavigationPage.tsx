import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  MapPin, 
  Route, 
  Fuel,
  Clock,
  AlertTriangle,
  Zap,
  Car,
  Phone,
  RefreshCw,
  Target,
  Map,
  Compass
} from 'lucide-react';

const DriverNavigationPage: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeOptimized, setRouteOptimized] = useState(false);

  // Mock active delivery for navigation
  const activeDelivery = {
    id: 'MP-2024-001',
    customerName: 'Sarah Johnson',
    pickupAddress: '123 Main St, Downtown',
    deliveryAddress: '789 Oak Avenue, Uptown',
    distance: '2.4 miles',
    estimatedTime: '15 mins',
    customerPhone: '+1 (555) 123-4567'
  };

  const nearbyServices = [
    { name: 'Shell Gas Station', distance: '0.3 mi', type: 'fuel', address: '456 First Ave' },
    { name: 'Subway Restaurant', distance: '0.5 mi', type: 'food', address: '789 Second St' },
    { name: 'AutoZone Parts', distance: '0.7 mi', type: 'parts', address: '321 Third Ave' },
    { name: 'CVS Pharmacy', distance: '0.4 mi', type: 'pharmacy', address: '654 Fourth St' }
  ];

  const routeOptimization = {
    originalRoute: '2.4 mi • 15 mins',
    optimizedRoute: '2.1 mi • 12 mins',
    timeSaved: '3 mins',
    distanceSaved: '0.3 mi'
  };

  const trafficAlerts = [
    { 
      type: 'construction', 
      message: 'Construction on Main St between 1st and 3rd Ave',
      impact: 'moderate',
      detour: 'Use Oak Ave instead'
    },
    { 
      type: 'accident', 
      message: 'Minor accident on Highway 101 southbound',
      impact: 'light',
      detour: 'Consider alternate route via State St'
    }
  ];

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handleStartNavigation = () => {
    setIsNavigating(true);
    // In a real app, this would integrate with Google Maps or Apple Maps
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeDelivery.pickupAddress)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleOptimizeRoute = () => {
    setRouteOptimized(true);
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'fuel': return Fuel;
      case 'food': return Target;
      case 'parts': return Car;
      case 'pharmacy': return Target;
      default: return MapPin;
    }
  };

  const getAlertColor = (impact: string) => {
    switch (impact) {
      case 'severe': return 'border-red-500 bg-red-50 text-red-800';
      case 'moderate': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
      case 'light': return 'border-blue-500 bg-blue-50 text-blue-800';
      default: return 'border-gray-500 bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Navigation</h1>
        <p className="text-gray-600">GPS navigation and route optimization</p>
      </div>

      {/* Current Location */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Compass className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Current Location</h3>
                <p className="text-sm text-gray-600">
                  {currentLocation ? 'Location acquired' : 'Getting your location...'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Delivery Navigation */}
      {activeDelivery && (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Active Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <div className="font-medium mb-1">{activeDelivery.customerName}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>{activeDelivery.pickupAddress}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Route className="h-4 w-4 text-blue-500" />
                    <span>{activeDelivery.distance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span>{activeDelivery.estimatedTime}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleStartNavigation}
                  className="w-full"
                  disabled={isNavigating}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {isNavigating ? 'Navigating...' : 'Start Navigation'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`tel:${activeDelivery.customerPhone}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Route Optimization */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Route Optimization
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {!routeOptimized ? (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Optimize your route to save time and fuel
              </p>
              <Button onClick={handleOptimizeRoute} className="w-full">
                <Zap className="h-4 w-4 mr-2" />
                Optimize Route
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Route Optimized!</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Original Route</div>
                    <div className="font-medium">{routeOptimization.originalRoute}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Optimized Route</div>
                    <div className="font-medium text-green-600">{routeOptimization.optimizedRoute}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Time Saved</div>
                    <div className="font-medium text-green-600">{routeOptimization.timeSaved}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Distance Saved</div>
                    <div className="font-medium text-green-600">{routeOptimization.distanceSaved}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traffic Alerts */}
      {trafficAlerts.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Traffic Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {trafficAlerts.map((alert, index) => (
              <div 
                key={index}
                className={`border-l-4 p-3 rounded ${getAlertColor(alert.impact)}`}
              >
                <div className="font-medium text-sm mb-1">{alert.message}</div>
                <div className="text-sm">
                  <strong>Suggested:</strong> {alert.detour}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Nearby Services */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Nearby Services
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {nearbyServices.map((service, index) => {
              const ServiceIcon = getServiceIcon(service.type);
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <ServiceIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{service.name}</div>
                      <div className="text-xs text-gray-600">{service.address}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{service.distance}</div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.name + ' ' + service.address)}`;
                        window.open(mapsUrl, '_blank');
                      }}
                    >
                      <Navigation className="h-3 w-3 mr-1" />
                      Go
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          className="h-12"
          onClick={() => {
            const mapsUrl = 'https://www.google.com/maps/search/gas+stations+near+me';
            window.open(mapsUrl, '_blank');
          }}
        >
          <Fuel className="h-4 w-4 mr-2" />
          Find Gas
        </Button>
        <Button 
          variant="outline" 
          className="h-12"
          onClick={() => {
            const mapsUrl = 'https://www.google.com/maps/search/food+near+me';
            window.open(mapsUrl, '_blank');
          }}
        >
          <Target className="h-4 w-4 mr-2" />
          Find Food
        </Button>
      </div>

      {/* Map Placeholder */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <Map className="h-12 w-12 mx-auto mb-2" />
            <p className="text-sm">Interactive map integration coming soon!</p>
            <p className="text-xs">For now, navigation opens in your default maps app</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverNavigationPage; 