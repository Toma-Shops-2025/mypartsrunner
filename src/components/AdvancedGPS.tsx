import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Navigation, 
  MapPin, 
  Route, 
  Compass,
  Clock,
  Zap,
  AlertTriangle,
  RefreshCw,
  Target,
  Car,
  Phone,
  Map
} from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  maneuver: string;
}

interface NavigationRoute {
  distance: string;
  duration: string;
  steps: RouteStep[];
  optimized: boolean;
  traffic: 'light' | 'moderate' | 'heavy';
}

interface AdvancedGPSProps {
  destination: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  onLocationUpdate?: (location: Location) => void;
  onNavigationStart?: () => void;
  onNavigationEnd?: () => void;
  deliveryId?: string;
}

const AdvancedGPS: React.FC<AdvancedGPSProps> = ({
  destination,
  onLocationUpdate,
  onNavigationStart,
  onNavigationEnd,
  deliveryId
}) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [navigationActive, setNavigationActive] = useState(false);
  const [route, setRoute] = useState<NavigationRoute | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [batteryOptimized, setBatteryOptimized] = useState(false);

  const watchIdRef = useRef<number | null>(null);
  const locationHistoryRef = useRef<Location[]>([]);

  // Get high-accuracy location
  const getCurrentLocation = useCallback((): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(location);
        },
        (error) => {
          let message = 'Location access denied';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out';
              break;
          }
          reject(new Error(message));
        },
        options
      );
    });
  }, []);

  // Start location tracking
  const startTracking = useCallback(async () => {
    try {
      setLocationError(null);
      
      // Get initial location
      const initialLocation = await getCurrentLocation();
      setCurrentLocation(initialLocation);
      locationHistoryRef.current = [initialLocation];
      
      if (onLocationUpdate) {
        onLocationUpdate(initialLocation);
      }

      // Start continuous tracking
      const options: PositionOptions = {
        enableHighAccuracy: !batteryOptimized,
        timeout: 15000,
        maximumAge: batteryOptimized ? 30000 : 5000
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const location: Location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };

          setCurrentLocation(location);
          setAccuracy(position.coords.accuracy);
          
          // Update speed if available
          if (position.coords.speed !== null) {
            setSpeed(position.coords.speed * 2.237); // Convert m/s to mph
          }

          // Update heading if available
          if (position.coords.heading !== null) {
            setHeading(position.coords.heading);
          }

          // Store location history
          locationHistoryRef.current.push(location);
          if (locationHistoryRef.current.length > 100) {
            locationHistoryRef.current = locationHistoryRef.current.slice(-50);
          }

          if (onLocationUpdate) {
            onLocationUpdate(location);
          }
        },
        (error) => {
          console.error('Location tracking error:', error);
          setLocationError(error.message);
        },
        options
      );

      setIsTracking(true);
    } catch (error: any) {
      setLocationError(error.message);
    }
  }, [batteryOptimized, getCurrentLocation, onLocationUpdate]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setNavigationActive(false);
  }, []);

  // Calculate route
  const calculateRoute = useCallback(async () => {
    if (!currentLocation) return;

    try {
      // Mock route calculation (in real app, use Google Directions API)
      const mockRoute: NavigationRoute = {
        distance: '2.4 miles',
        duration: '12 minutes',
        traffic: Math.random() > 0.7 ? 'heavy' : Math.random() > 0.4 ? 'moderate' : 'light',
        optimized: true,
        steps: [
          {
            instruction: 'Head north on Main Street',
            distance: '0.3 mi',
            duration: '2 min',
            maneuver: 'straight'
          },
          {
            instruction: 'Turn right onto Oak Avenue',
            distance: '0.8 mi',
            duration: '4 min',
            maneuver: 'turn-right'
          },
          {
            instruction: 'Continue straight through downtown',
            distance: '1.1 mi',
            duration: '5 min',
            maneuver: 'straight'
          },
          {
            instruction: 'Turn left onto destination street',
            distance: '0.2 mi',
            duration: '1 min',
            maneuver: 'turn-left'
          },
          {
            instruction: 'Arrive at destination on the right',
            distance: '0 mi',
            duration: '0 min',
            maneuver: 'arrive'
          }
        ]
      };

      setRoute(mockRoute);
    } catch (error) {
      console.error('Route calculation failed:', error);
    }
  }, [currentLocation]);

  // Start navigation
  const startNavigation = useCallback(async () => {
    try {
      if (!currentLocation) {
        await startTracking();
      }
      
      await calculateRoute();
      setNavigationActive(true);
      
      if (onNavigationStart) {
        onNavigationStart();
      }

      // Open external maps app
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination.address)}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
    } catch (error) {
      console.error('Navigation start failed:', error);
    }
  }, [currentLocation, startTracking, calculateRoute, onNavigationStart, destination.address]);

  // Stop navigation
  const stopNavigation = useCallback(() => {
    setNavigationActive(false);
    setRoute(null);
    
    if (onNavigationEnd) {
      onNavigationEnd();
    }
  }, [onNavigationEnd]);

  // Get distance to destination
  const getDistanceToDestination = useCallback(() => {
    if (!currentLocation || !destination.latitude || !destination.longitude) {
      return null;
    }

    const R = 3959; // Earth radius in miles
    const dLat = (destination.latitude - currentLocation.latitude) * Math.PI / 180;
    const dLon = (destination.longitude - currentLocation.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(currentLocation.latitude * Math.PI / 180) * Math.cos(destination.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  }, [currentLocation, destination]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  const distance = getDistanceToDestination();
  const trafficColor = route?.traffic === 'heavy' ? 'text-red-600' : route?.traffic === 'moderate' ? 'text-yellow-600' : 'text-green-600';

  return (
    <div className="space-y-4">
      {/* Location Status */}
      <Card className={`border-l-4 ${isTracking ? 'border-l-green-500' : 'border-l-gray-400'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Compass className={`h-5 w-5 ${isTracking ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="font-medium">
                {isTracking ? 'GPS Active' : 'GPS Inactive'}
              </span>
            </div>
            <Badge variant={isTracking ? 'default' : 'secondary'}>
              {accuracy ? `±${accuracy.toFixed(0)}m` : 'No signal'}
            </Badge>
          </div>

          {currentLocation && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Location</div>
                <div className="font-mono text-xs">
                  {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Speed</div>
                <div className="font-medium">
                  {speed ? `${speed.toFixed(0)} mph` : 'Stationary'}
                </div>
              </div>
              {heading !== null && (
                <div>
                  <div className="text-gray-600">Heading</div>
                  <div className="font-medium">{heading.toFixed(0)}°</div>
                </div>
              )}
              {distance && (
                <div>
                  <div className="text-gray-600">Distance</div>
                  <div className="font-medium">{distance.toFixed(1)} miles</div>
                </div>
              )}
            </div>
          )}

          {locationError && (
            <Alert variant="destructive" className="mt-3">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2 mt-4">
            {!isTracking ? (
              <Button onClick={startTracking} className="flex-1">
                <Compass className="h-4 w-4 mr-2" />
                Start GPS
              </Button>
            ) : (
              <Button onClick={stopTracking} variant="outline" className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Stop GPS
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBatteryOptimized(!batteryOptimized)}
              className={batteryOptimized ? 'bg-green-50' : ''}
            >
              🔋 {batteryOptimized ? 'Eco' : 'High'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Destination Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Destination
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="text-sm">{destination.address}</div>
            
            {route && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Route className="h-4 w-4 text-blue-500" />
                  <span>{route.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>{route.duration}</span>
                </div>
                <Badge className={trafficColor}>
                  {route.traffic} traffic
                </Badge>
                {route.optimized && (
                  <Badge variant="outline">
                    <Zap className="h-3 w-3 mr-1" />
                    Optimized
                  </Badge>
                )}
              </div>
            )}

            <div className="flex gap-2">
              {!navigationActive ? (
                <Button onClick={startNavigation} className="flex-1">
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
              ) : (
                <Button onClick={stopNavigation} variant="destructive" className="flex-1">
                  Stop Navigation
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => {
                  const tel = prompt('Customer phone number:');
                  if (tel) window.open(`tel:${tel}`);
                }}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Steps */}
      {route && navigationActive && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5" />
              Turn-by-Turn Directions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {route.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-blue-600' : 'bg-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step.instruction}</div>
                    <div className="text-xs text-gray-600">
                      {step.distance} • {step.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => {
            const mapsUrl = 'https://www.google.com/maps/search/gas+stations+near+me';
            window.open(mapsUrl, '_blank');
          }}
        >
          ⛽ Find Gas
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const mapsUrl = 'https://www.google.com/maps/search/parking+near+me';
            window.open(mapsUrl, '_blank');
          }}
        >
          🅿️ Find Parking
        </Button>
      </div>

      {/* Driver Stats */}
      {locationHistoryRef.current.length > 5 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Trip Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold">
                  {locationHistoryRef.current.length}
                </div>
                <div className="text-xs text-gray-600">GPS Points</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {speed ? speed.toFixed(0) : '0'}
                </div>
                <div className="text-xs text-gray-600">Current MPH</div>
              </div>
              <div>
                <div className="text-lg font-bold">
                  {accuracy ? accuracy.toFixed(0) : 'N/A'}
                </div>
                <div className="text-xs text-gray-600">Accuracy (m)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdvancedGPS; 