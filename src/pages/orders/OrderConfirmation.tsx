import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Clock, CheckCircle2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useMap } from '@/contexts/MapContext';
import type { Order } from '@/types/order';

const fetchOrder = async (id: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${id}`);
  if (!response.ok) throw new Error('Failed to fetch order');
  return response.json();
};

const statusSteps = [
  { status: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
  { status: 'preparing', label: 'Preparing Order', icon: Package },
  { status: 'ready_for_pickup', label: 'Ready for Pickup', icon: Package },
  { status: 'picked_up', label: 'Out for Delivery', icon: Package },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
] as const;

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id!),
    refetchInterval: (query) => 
      query.state.data?.status === 'delivered' ? false : 10000, // Refresh every 10s until delivered
  });

  const { initializeMap, addMarker, drawRoute } = useMap();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground">This order may no longer be available.</p>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(step => step.status === order.status);

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-muted-foreground">
            Order #{order.id} • {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Order Status */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Order Status</h2>
          <div className="relative">
            <div className="absolute left-[17px] top-0 h-full w-0.5 bg-muted" />
            <div className="space-y-8 relative">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.status}
                    className={`flex items-start gap-4 ${
                      isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{step.label}</p>
                      {isCurrent && order.statusHistory[currentStepIndex] && (
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            order.statusHistory[currentStepIndex].timestamp
                          ).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Delivery Address</p>
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
              {order.runner && (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                      {order.runner.avatar ? (
                        <img
                          src={order.runner.avatar}
                          alt={order.runner.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-muted-foreground">
                            {order.runner.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{order.runner.name}</p>
                      <p className="text-sm text-muted-foreground">Your Runner</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <p>{order.runner.phone}</p>
                  </div>
                </>
              )}
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p>Estimated delivery by {order.estimatedDeliveryTime}</p>
              </div>
            </div>
            <div className="h-[200px] bg-muted rounded-lg" id="map" />
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-md overflow-hidden shrink-0">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-muted-foreground">
                        {item.product.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium pt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 