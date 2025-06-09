import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useMap } from '../contexts/MapContext';
import { Database } from '../lib/database.types';
import Map from './Map';

type Order = Database['public']['Tables']['orders']['Row'];
type Store = Database['public']['Tables']['stores']['Row'];
type Runner = Database['public']['Tables']['runners']['Row'];

interface DeliveryTrackingProps {
  orderId: string;
}

export default function DeliveryTracking({ orderId }: DeliveryTrackingProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [runner, setRunner] = useState<Runner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Fetch order details
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;
        setOrder(orderData);

        // Fetch store details
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('*')
          .eq('id', orderData.store_id)
          .single();

        if (storeError) throw storeError;
        setStore(storeData);

        // Fetch runner details if assigned
        if (orderData.runner_id) {
          const { data: runnerData, error: runnerError } = await supabase
            .from('runners')
            .select('*')
            .eq('id', orderData.runner_id)
            .single();

          if (runnerError) throw runnerError;
          setRunner(runnerData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();

    // Subscribe to order updates
    const orderSubscription = supabase
      .channel(`order-${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    // Subscribe to runner location updates
    const runnerSubscription = supabase
      .channel(`runner-location`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'runners',
          filter: order?.runner_id ? `id=eq.${order.runner_id}` : undefined,
        },
        (payload) => {
          setRunner(payload.new as Runner);
        }
      )
      .subscribe();

    return () => {
      orderSubscription.unsubscribe();
      runnerSubscription.unsubscribe();
    };
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-blue border-t-transparent" />
      </div>
    );
  }

  if (error || !order || !store) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Order not found'}
      </div>
    );
  }

  const getStatusStep = () => {
    switch (order.status) {
      case 'pending':
        return 0;
      case 'accepted':
        return 1;
      case 'picked_up':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const statusStep = getStatusStep();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="h-0.5 w-full bg-gray-200" />
          </div>
          <div className="relative flex justify-between">
            {['Pending', 'Accepted', 'Picked Up', 'Delivered'].map((status, index) => (
              <div
                key={status}
                className={`flex flex-col items-center ${
                  index <= statusStep ? 'text-brand-blue' : 'text-gray-400'
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    index <= statusStep ? 'bg-brand-blue text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-sm">{status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96">
          <Map
            markers={[
              {
                coordinates: [store.location.lng, store.location.lat] as [number, number],
                color: '#00CC88',
                popup: {
                  title: store.name,
                  description: 'Pickup Location',
                },
              },
              ...(runner?.current_location
                ? [
                    {
                      coordinates: [
                        runner.current_location.lng,
                        runner.current_location.lat,
                      ] as [number, number],
                      color: '#6600FF',
                      popup: {
                        title: 'Runner',
                        description: `Status: ${runner.status}`,
                      },
                    },
                  ]
                : []),
            ]}
            route={
              runner?.current_location
                ? [
                    [runner.current_location.lng, runner.current_location.lat] as [number, number],
                    [store.location.lng, store.location.lat] as [number, number],
                  ]
                : undefined
            }
          />
        </div>
      </div>

      {runner && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Runner Details</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div
                className={`h-3 w-3 rounded-full mr-2 ${
                  runner.status === 'available'
                    ? 'bg-green-500'
                    : runner.status === 'busy'
                    ? 'bg-yellow-500'
                    : 'bg-gray-500'
                }`}
              />
              <span className="text-sm text-gray-600">
                {runner.status.charAt(0).toUpperCase() + runner.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Vehicle:</span>
              <span className="ml-2 text-sm font-medium">
                {runner.vehicle_type.charAt(0).toUpperCase() + runner.vehicle_type.slice(1)}
                {runner.vehicle_info && ` - ${runner.vehicle_info}`}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">Rating:</span>
              <div className="ml-2 flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 ${
                      i < Math.floor(runner.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3.314l2.12-1.542a1 1 0 011.173 1.607l-1.715 1.666.404 2.36a1 1 0 01-1.451 1.054L10 7.868l-2.03.591a1 1 0 01-1.452-1.054l.404-2.36-1.715-1.666a1 1 0 011.173-1.607L10 3.314z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">
                  ({runner.rating.toFixed(1)})
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 