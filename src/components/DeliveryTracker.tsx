import React, { useState, useEffect } from 'react';
import { Map } from '@/components/ui/map';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Truck, Package, Clock, Navigation } from 'lucide-react';
import { formatCoordinates } from '@/lib/mapbox';

interface DeliveryLocation {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'delivered';
  longitude: number;
  latitude: number;
  estimatedArrival?: string;
}

const DeliveryTracker: React.FC = () => {
  const [deliveries, setDeliveries] = useState<DeliveryLocation[]>([
    {
      id: '1',
      name: 'Auto Parts Delivery',
      status: 'in-progress',
      longitude: -96.78,
      latitude: 32.77,
      estimatedArrival: '10:30 AM'
    },
    {
      id: '2',
      name: 'Hardware Supplies',
      status: 'pending',
      longitude: -96.8,
      latitude: 32.79,
      estimatedArrival: '11:45 AM'
    },
    {
      id: '3',
      name: 'Tool Delivery',
      status: 'delivered',
      longitude: -96.75,
      latitude: 32.76
    }
  ]);

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryLocation | null>(null);
  const [driverLocation, setDriverLocation] = useState({ longitude: -96.77, latitude: 32.78 });

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation(prev => ({
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getMarkers = () => {
    const deliveryMarkers = deliveries.map(delivery => ({
      longitude: delivery.longitude,
      latitude: delivery.latitude,
      color: getStatusColor(delivery.status),
      popup: delivery.name
    }));

    // Add driver marker
    return [
      ...deliveryMarkers,
      {
        longitude: driverLocation.longitude,
        latitude: driverLocation.latitude,
        color: '#4F46E5', // Driver color
        popup: 'Driver Location'
      }
    ];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#10B981'; // Green
      case 'in-progress': return '#F59E0B'; // Yellow
      case 'pending': return '#6B7280'; // Gray
      default: return '#EF4444'; // Red
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>;
      case 'in-progress':
        return <Badge variant="warning">In Progress</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="destructive">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          <span>Delivery Tracker</span>
        </CardTitle>
        <CardDescription>
          Track your parts deliveries in real-time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Map
          markers={getMarkers()}
          initialViewState={{
            longitude: -96.78,
            latitude: 32.77,
            zoom: 12
          }}
          className="mb-4"
        />

        <div className="space-y-4 mt-4">
          <h3 className="font-medium">Your Deliveries</h3>
          <div className="space-y-2">
            {deliveries.map((delivery) => (
              <div 
                key={delivery.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedDelivery?.id === delivery.id ? 'bg-muted border-primary' : 'hover:bg-muted/50'}`}
                onClick={() => setSelectedDelivery(delivery)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <span className="font-medium">{delivery.name}</span>
                  </div>
                  {getStatusBadge(delivery.status)}
                </div>
                {delivery.estimatedArrival && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>ETA: {delivery.estimatedArrival}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedDelivery && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-5 w-5 text-primary" />
                <h3 className="font-medium">{selectedDelivery.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Status:</span> {selectedDelivery.status}
                </div>
                {selectedDelivery.estimatedArrival && (
                  <div>
                    <span className="font-medium">ETA:</span> {selectedDelivery.estimatedArrival}
                  </div>
                )}
                <div className="col-span-2">
                  <span className="font-medium">Location:</span> {formatCoordinates(selectedDelivery.latitude, selectedDelivery.longitude)}
                </div>
              </div>
              <Button className="mt-3 w-full" size="sm">
                Contact Driver
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryTracker;
