import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Route, 
  Navigation, 
  MapPin, 
  Clock, 
  Fuel,
  Zap,
  RotateCcw,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Car,
  Target,
  Settings,
  BarChart3,
  DollarSign,
  Calendar
} from 'lucide-react';

interface DeliveryStop {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  coordinates: { lat: number; lng: number };
  timeWindow: { start: string; end: string };
  estimatedDuration: number; // minutes
  priority: 'high' | 'medium' | 'low';
  specialInstructions?: string;
  items: string[];
  value: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  actualArrival?: string;
  actualDeparture?: string;
}

interface RouteOptimization {
  id: string;
  name: string;
  stops: DeliveryStop[];
  totalDistance: number;
  totalDuration: number;
  totalValue: number;
  fuelCost: number;
  efficiency: number;
  optimizedOrder: string[];
  trafficFactor: number;
  created: string;
  status: 'draft' | 'active' | 'completed';
}

interface OptimizationConstraints {
  maxStops: number;
  maxDuration: number; // minutes
  maxDistance: number; // miles
  respectTimeWindows: boolean;
  prioritizeHighValue: boolean;
  minimizeFuelCost: boolean;
  avoidTraffic: boolean;
  vehicleType: 'car' | 'van' | 'truck';
  fuelEfficiency: number; // mpg
}

interface RouteOptimizerProps {
  driverId?: string;
  currentLocation?: { lat: number; lng: number };
  onRouteOptimized?: (route: RouteOptimization) => void;
}

const RouteOptimizer: React.FC<RouteOptimizerProps> = ({
  driverId = 'demo-driver',
  currentLocation = { lat: 40.7128, lng: -74.0060 },
  onRouteOptimized
}) => {
  const [availableStops, setAvailableStops] = useState<DeliveryStop[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteOptimization | null>(null);
  const [constraints, setConstraints] = useState<OptimizationConstraints>({
    maxStops: 8,
    maxDuration: 480, // 8 hours
    maxDistance: 100,
    respectTimeWindows: true,
    prioritizeHighValue: false,
    minimizeFuelCost: true,
    avoidTraffic: true,
    vehicleType: 'car',
    fuelEfficiency: 25
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RouteOptimization | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);

  // Mock delivery stops
  const mockStops: DeliveryStop[] = [
    {
      id: 'stop1',
      orderId: 'MP-2024-001',
      customerName: 'Sarah Johnson',
      address: '123 Main St, Downtown',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      timeWindow: { start: '09:00', end: '12:00' },
      estimatedDuration: 15,
      priority: 'high',
      specialInstructions: 'Call upon arrival',
      items: ['Brake Pads', 'Oil Filter'],
      value: 89.99,
      status: 'pending'
    },
    {
      id: 'stop2',
      orderId: 'MP-2024-002',
      customerName: 'Mike Rodriguez',
      address: '456 Oak Ave, Midtown',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      timeWindow: { start: '10:00', end: '14:00' },
      estimatedDuration: 10,
      priority: 'medium',
      items: ['Spark Plugs'],
      value: 31.96,
      status: 'pending'
    },
    {
      id: 'stop3',
      orderId: 'MP-2024-003',
      customerName: 'Lisa Chen',
      address: '789 Pine St, Uptown',
      coordinates: { lat: 40.7831, lng: -73.9712 },
      timeWindow: { start: '13:00', end: '17:00' },
      estimatedDuration: 20,
      priority: 'low',
      specialInstructions: 'Business hours only',
      items: ['Battery', 'Cables'],
      value: 149.99,
      status: 'pending'
    },
    {
      id: 'stop4',
      orderId: 'MP-2024-004',
      customerName: 'David Park',
      address: '321 Elm St, Brooklyn',
      coordinates: { lat: 40.6892, lng: -73.9442 },
      timeWindow: { start: '11:00', end: '15:00' },
      estimatedDuration: 12,
      priority: 'high',
      items: ['Air Filter', 'Cabin Filter'],
      value: 45.98,
      status: 'pending'
    },
    {
      id: 'stop5',
      orderId: 'MP-2024-005',
      customerName: 'Emma Wilson',
      address: '654 Cedar Ave, Queens',
      coordinates: { lat: 40.7282, lng: -73.7949 },
      timeWindow: { start: '14:00', end: '18:00' },
      estimatedDuration: 8,
      priority: 'medium',
      items: ['Wiper Blades'],
      value: 24.99,
      status: 'pending'
    }
  ];

  useEffect(() => {
    setAvailableStops(mockStops);
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Optimize route using AI algorithms
  const optimizeRoute = useCallback(async () => {
    if (selectedStops.length < 2) return;

    setIsOptimizing(true);
    
    try {
      // Simulate optimization processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const stops = availableStops.filter(stop => selectedStops.includes(stop.id));
      
      // Simple optimization algorithm (in production, use more sophisticated algorithms)
      let optimizedOrder: string[] = [];
      let unvisited = [...stops];
      let currentPos = currentLocation;
      let totalDistance = 0;
      let totalDuration = 0;
      let totalValue = 0;

      // Start from the closest stop
      while (unvisited.length > 0) {
        let closestIndex = 0;
        let closestDistance = Infinity;

        unvisited.forEach((stop, index) => {
          const distance = calculateDistance(currentPos, stop.coordinates);
          let score = distance;

          // Apply constraints and preferences
          if (constraints.prioritizeHighValue) {
            score = distance / (stop.value / 100); // Factor in value
          }

          if (constraints.respectTimeWindows) {
            const now = new Date();
            const startTime = new Date(`${now.toDateString()} ${stop.timeWindow.start}`);
            const endTime = new Date(`${now.toDateString()} ${stop.timeWindow.end}`);
            
            if (now > endTime) {
              score += 1000; // Penalize expired time windows
            }
          }

          if (stop.priority === 'high') {
            score *= 0.8; // Prioritize high priority stops
          } else if (stop.priority === 'low') {
            score *= 1.2;
          }

          if (score < closestDistance) {
            closestDistance = score;
            closestIndex = index;
          }
        });

        const selectedStop = unvisited[closestIndex];
        optimizedOrder.push(selectedStop.id);
        
        const distanceToStop = calculateDistance(currentPos, selectedStop.coordinates);
        totalDistance += distanceToStop;
        totalDuration += (distanceToStop / 25) * 60 + selectedStop.estimatedDuration; // Assume 25 mph average
        totalValue += selectedStop.value;
        
        currentPos = selectedStop.coordinates;
        unvisited.splice(closestIndex, 1);
      }

      // Calculate fuel cost
      const fuelCost = (totalDistance / constraints.fuelEfficiency) * 3.50; // $3.50/gallon

      // Calculate efficiency score
      const efficiency = Math.min(100, (totalValue / (totalDuration + fuelCost)) * 0.5);

      // Apply traffic factor
      const trafficFactor = constraints.avoidTraffic ? 
        Math.random() * 0.3 + 0.85 : // 85-115% of normal time
        Math.random() * 0.5 + 0.9;   // 90-140% of normal time

      const optimizedRoute: RouteOptimization = {
        id: `route_${Date.now()}`,
        name: `Route ${new Date().toLocaleDateString()}`,
        stops,
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalDuration: Math.round(totalDuration * trafficFactor),
        totalValue,
        fuelCost: Math.round(fuelCost * 100) / 100,
        efficiency: Math.round(efficiency),
        optimizedOrder,
        trafficFactor,
        created: new Date().toISOString(),
        status: 'draft'
      };

      setOptimizedRoute(optimizedRoute);
      
      if (onRouteOptimized) {
        onRouteOptimized(optimizedRoute);
      }

    } catch (error) {
      console.error('Route optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [selectedStops, availableStops, currentLocation, constraints, calculateDistance, onRouteOptimized]);

  // Start active route
  const startRoute = useCallback(() => {
    if (optimizedRoute) {
      setActiveRoute({
        ...optimizedRoute,
        status: 'active'
      });
      setCurrentStopIndex(0);
    }
  }, [optimizedRoute]);

  // Complete current stop
  const completeStop = useCallback((stopId: string) => {
    if (activeRoute) {
      const updatedStops = activeRoute.stops.map(stop =>
        stop.id === stopId 
          ? { 
              ...stop, 
              status: 'completed' as const,
              actualArrival: new Date().toISOString(),
              actualDeparture: new Date().toISOString()
            }
          : stop
      );
      
      setActiveRoute({
        ...activeRoute,
        stops: updatedStops
      });

      // Move to next stop
      const currentStopIdInOrder = activeRoute.optimizedOrder[currentStopIndex];
      if (stopId === currentStopIdInOrder && currentStopIndex < activeRoute.optimizedOrder.length - 1) {
        setCurrentStopIndex(prev => prev + 1);
      }
    }
  }, [activeRoute, currentStopIndex]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Route className="h-6 w-6 text-blue-600" />
            Route Optimizer
          </h2>
          <p className="text-gray-600">AI-powered multi-delivery route planning</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={optimizeRoute}
            disabled={selectedStops.length < 2 || isOptimizing}
            className="flex items-center gap-2"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Optimize Route
              </>
            )}
          </Button>
          {optimizedRoute && !activeRoute && (
            <Button onClick={startRoute} className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start Route
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="planning" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="active">Active Route</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="space-y-6">
          {/* Optimization Constraints */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Optimization Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Max Stops</label>
                  <Select 
                    value={constraints.maxStops.toString()} 
                    onValueChange={(value) => setConstraints(prev => ({ ...prev, maxStops: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 stops</SelectItem>
                      <SelectItem value="8">8 stops</SelectItem>
                      <SelectItem value="10">10 stops</SelectItem>
                      <SelectItem value="15">15 stops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <Select 
                    value={constraints.vehicleType} 
                    onValueChange={(value: 'car' | 'van' | 'truck') => setConstraints(prev => ({ ...prev, vehicleType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="car">Car (25 MPG)</SelectItem>
                      <SelectItem value="van">Van (18 MPG)</SelectItem>
                      <SelectItem value="truck">Truck (12 MPG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Max Duration</label>
                  <Select 
                    value={constraints.maxDuration.toString()} 
                    onValueChange={(value) => setConstraints(prev => ({ ...prev, maxDuration: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="240">4 hours</SelectItem>
                      <SelectItem value="360">6 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                      <SelectItem value="600">10 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Respect Time Windows</label>
                  <Switch
                    checked={constraints.respectTimeWindows}
                    onCheckedChange={(checked) => setConstraints(prev => ({ ...prev, respectTimeWindows: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Prioritize High Value</label>
                  <Switch
                    checked={constraints.prioritizeHighValue}
                    onCheckedChange={(checked) => setConstraints(prev => ({ ...prev, prioritizeHighValue: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Minimize Fuel Cost</label>
                  <Switch
                    checked={constraints.minimizeFuelCost}
                    onCheckedChange={(checked) => setConstraints(prev => ({ ...prev, minimizeFuelCost: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Avoid Traffic</label>
                  <Switch
                    checked={constraints.avoidTraffic}
                    onCheckedChange={(checked) => setConstraints(prev => ({ ...prev, avoidTraffic: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Stops */}
          <Card>
            <CardHeader>
              <CardTitle>Available Delivery Stops ({availableStops.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {availableStops.map((stop) => (
                  <div 
                    key={stop.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedStops.includes(stop.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setSelectedStops(prev => 
                        prev.includes(stop.id)
                          ? prev.filter(id => id !== stop.id)
                          : [...prev, stop.id]
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedStops.includes(stop.id)}
                            onChange={() => {}}
                            className="w-4 h-4"
                          />
                          <Badge className={getPriorityColor(stop.priority)}>
                            {stop.priority}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium">{stop.customerName}</h4>
                          <p className="text-sm text-gray-600">{stop.address}</p>
                          <p className="text-xs text-gray-500">
                            {stop.timeWindow.start} - {stop.timeWindow.end} • {stop.estimatedDuration}min • ${stop.value}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(stop.status)}>
                          {stop.status}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {stop.items.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {optimizedRoute ? (
            <>
              {/* Route Summary */}
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {optimizedRoute.stops.length}
                      </div>
                      <div className="text-sm text-gray-600">Stops</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {optimizedRoute.totalDistance.toFixed(1)} mi
                      </div>
                      <div className="text-sm text-gray-600">Total Distance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor(optimizedRoute.totalDuration / 60)}h {optimizedRoute.totalDuration % 60}m
                      </div>
                      <div className="text-sm text-gray-600">Total Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {optimizedRoute.efficiency}%
                      </div>
                      <div className="text-sm text-gray-600">Efficiency</div>
                      <Progress value={optimizedRoute.efficiency} className="w-full h-2 mt-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <div className="font-bold">${optimizedRoute.totalValue.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Total Value</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Fuel className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                      <div className="font-bold">${optimizedRoute.fuelCost.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">Fuel Cost</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold">{(optimizedRoute.trafficFactor * 100).toFixed(0)}%</div>
                      <div className="text-xs text-gray-600">Traffic Factor</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Optimized Route Order */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimized Route Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {optimizedRoute.optimizedOrder.map((stopId, index) => {
                      const stop = optimizedRoute.stops.find(s => s.id === stopId)!;
                      return (
                        <div key={stopId} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{stop.customerName}</h4>
                            <p className="text-sm text-gray-600">{stop.address}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge className={getPriorityColor(stop.priority)} variant="secondary">
                                {stop.priority}
                              </Badge>
                              <Badge variant="outline">
                                {stop.timeWindow.start} - {stop.timeWindow.end}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${stop.value}</div>
                            <div className="text-sm text-gray-600">{stop.estimatedDuration}min</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Optimized Route</h3>
                <p className="text-gray-600 mb-4">
                  Select at least 2 delivery stops and click "Optimize Route" to generate an efficient delivery plan.
                </p>
                <Button onClick={optimizeRoute} disabled={selectedStops.length < 2}>
                  <Zap className="h-4 w-4 mr-2" />
                  Optimize Route
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {activeRoute ? (
            <>
              {/* Active Route Progress */}
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Active Route Progress</h3>
                    <Badge className="bg-blue-600">In Progress</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {currentStopIndex + 1} / {activeRoute.stops.length}
                      </div>
                      <div className="text-sm text-gray-600">Current Stop</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {activeRoute.stops.filter(s => s.status === 'completed').length}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {Math.floor((currentStopIndex / activeRoute.stops.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">
                        {Math.floor(activeRoute.totalDuration * (1 - currentStopIndex / activeRoute.stops.length) / 60)}h {Math.floor(activeRoute.totalDuration * (1 - currentStopIndex / activeRoute.stops.length) % 60)}m
                      </div>
                      <div className="text-sm text-gray-600">Est. Remaining</div>
                    </div>
                  </div>

                  <Progress 
                    value={(currentStopIndex / activeRoute.stops.length) * 100} 
                    className="w-full h-3"
                  />
                </CardContent>
              </Card>

              {/* Current Stop */}
              {currentStopIndex < activeRoute.optimizedOrder.length && (
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-600" />
                      Current Stop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const currentStopId = activeRoute.optimizedOrder[currentStopIndex];
                      const currentStop = activeRoute.stops.find(s => s.id === currentStopId)!;
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold">{currentStop.customerName}</h3>
                              <p className="text-gray-600">{currentStop.address}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge className={getPriorityColor(currentStop.priority)}>
                                  {currentStop.priority} priority
                                </Badge>
                                <Badge variant="outline">
                                  {currentStop.timeWindow.start} - {currentStop.timeWindow.end}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">${currentStop.value}</div>
                              <div className="text-sm text-gray-600">{currentStop.estimatedDuration} minutes</div>
                            </div>
                          </div>

                          {currentStop.specialInstructions && (
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <div>
                                  <div className="font-medium text-yellow-800">Special Instructions</div>
                                  <div className="text-sm text-yellow-700">{currentStop.specialInstructions}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <Button 
                              className="flex-1"
                              onClick={() => {
                                // Open navigation
                                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(currentStop.address)}`;
                                window.open(mapsUrl, '_blank');
                              }}
                            >
                              <Navigation className="h-4 w-4 mr-2" />
                              Navigate
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => completeStop(currentStop.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete Stop
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}

              {/* All Stops Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>All Stops</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activeRoute.optimizedOrder.map((stopId, index) => {
                      const stop = activeRoute.stops.find(s => s.id === stopId)!;
                      const isCurrent = index === currentStopIndex;
                      const isCompleted = stop.status === 'completed';
                      
                      return (
                        <div 
                          key={stopId} 
                          className={`flex items-center gap-4 p-3 border rounded-lg ${
                            isCurrent ? 'border-orange-300 bg-orange-50' : 
                            isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            isCompleted ? 'bg-green-600' : 
                            isCurrent ? 'bg-orange-600' : 'bg-gray-400'
                          }`}>
                            {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{stop.customerName}</h4>
                            <p className="text-sm text-gray-600">{stop.address}</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(stop.status)}>
                              {stop.status}
                            </Badge>
                            {isCompleted && stop.actualArrival && (
                              <div className="text-xs text-gray-500 mt-1">
                                Completed at {new Date(stop.actualArrival).toLocaleTimeString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Route</h3>
                <p className="text-gray-600">
                  Start an optimized route to track your delivery progress in real-time.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Route Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Route Performance Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Track route efficiency, fuel savings, and delivery performance over time.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Efficiency Trends</h4>
                    <p className="text-sm text-gray-600">Track optimization improvements</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Fuel className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Fuel Savings</h4>
                    <p className="text-sm text-gray-600">Monitor cost reductions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <h4 className="font-medium">Time Analytics</h4>
                    <p className="text-sm text-gray-600">Delivery time optimization</p>
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

export default RouteOptimizer; 