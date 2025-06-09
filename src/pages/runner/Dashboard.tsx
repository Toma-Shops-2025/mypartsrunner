import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Package, Clock, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useMap } from '@/contexts/MapContext';
import type { Order } from '@/types/order';

// This would come from your API
const fetchAvailableOrders = async (): Promise<Order[]> => {
  const response = await fetch('/api/runner/available-orders');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

const fetchMyOrders = async (): Promise<Order[]> => {
  const response = await fetch('/api/runner/my-orders');
  if (!response.ok) throw new Error('Failed to fetch orders');
  return response.json();
};

export default function RunnerDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const { initializeMap, addMarker, drawRoute, userLocation } = useMap();

  const {
    data: availableOrders,
    isLoading: isLoadingAvailable,
  } = useQuery({
    queryKey: ['available-orders'],
    queryFn: fetchAvailableOrders,
    enabled: isAvailable && !activeOrderId,
    refetchInterval: 5000, // Refresh every 5s
  });

  const {
    data: myOrders,
    isLoading: isLoadingMyOrders,
  } = useQuery({
    queryKey: ['my-orders'],
    queryFn: fetchMyOrders,
    enabled: !!activeOrderId,
    refetchInterval: 5000,
  });

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/runner/orders/${orderId}/accept`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to accept order');
      setActiveOrderId(orderId);
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/runner/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      if (status === 'delivered') {
        setActiveOrderId(null);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Runner Dashboard</h1>
          <div className="flex items-center gap-4">
            <Select
              value={isAvailable ? 'available' : 'unavailable'}
              onValueChange={(value) => setIsAvailable(value === 'available')}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoadingAvailable || isLoadingMyOrders ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : activeOrderId ? (
          <div className="space-y-6">
            {myOrders?.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {/* Store Info */}
                      <div>
                        <h3 className="font-semibold mb-2">Pickup Location</h3>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{order.store.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.store.address}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div>
                        <h3 className="font-semibold mb-2">Delivery Location</h3>
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {order.deliveryAddress.street}
                              {order.deliveryAddress.unit && `, ${order.deliveryAddress.unit}`}
                              <br />
                              {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                              {order.deliveryAddress.zip}
                            </p>
                            {order.deliveryAddress.instructions && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Note: {order.deliveryAddress.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h3 className="font-semibold mb-2">Order Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm">
                                {item.quantity}x {item.product.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status Actions */}
                      <div className="pt-4">
                        {order.status === 'confirmed' && (
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleUpdateStatus(order.id, 'picked_up')
                            }
                          >
                            Mark as Picked Up
                          </Button>
                        )}
                        {order.status === 'picked_up' && (
                          <Button
                            className="w-full"
                            onClick={() =>
                              handleUpdateStatus(order.id, 'delivered')
                            }
                          >
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Map */}
                    <div className="h-[400px] bg-muted rounded-lg" id="map" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Available Orders</h2>
            {availableOrders?.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No orders available at the moment
                </CardContent>
              </Card>
            ) : (
              availableOrders?.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{order.store.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Delivery Location</p>
                          <p className="text-sm text-muted-foreground">
                            {order.deliveryAddress.city},{' '}
                            {order.deliveryAddress.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">Estimated Time</p>
                          <p className="text-sm text-muted-foreground">
                            {order.estimatedDeliveryTime}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="mt-2"
                        onClick={() => handleAcceptOrder(order.id)}
                      >
                        Accept Order
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 