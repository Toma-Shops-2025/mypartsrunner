import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Bell, MapPin, Package, Clock, DollarSign } from 'lucide-react';

export interface DeliveryRequest {
  id: string;
  customerId: string;
  merchantId: string;
  storeName: string;
  pickupAddress: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  deliveryFee: number;
  estimatedDistance: number;
  estimatedTime: number;
  createdAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
}

export const useDeliveryRequests = () => {
  const { user } = useAppContext();
  const [requests, setRequests] = useState<DeliveryRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available delivery requests
  const fetchRequests = useCallback(async () => {
    if (user?.role !== 'driver' || !user.isAvailable) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('delivery_requests')
        .select(`
          *,
          customer:profiles!customer_id(*),
          merchant:profiles!merchant_id(*),
          store:stores(*)
        `)
        .eq('status', 'pending')
        .order('createdAt', { ascending: false });

      if (fetchError) throw fetchError;

      setRequests(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching delivery requests:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.role, user?.isAvailable]);

  // Accept a delivery request
  const acceptRequest = useCallback(async (requestId: string) => {
    if (user?.role !== 'driver') return;

    try {
      const { error: updateError } = await supabase
        .from('delivery_requests')
        .update({
          status: 'accepted',
          driverId: user.id,
          acceptedAt: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('status', 'pending');

      if (updateError) throw updateError;

      // Remove from available requests
      setRequests(prev => prev.filter(req => req.id !== requestId));

      toast({
        title: "Delivery Accepted! 🎯",
        description: "You're now responsible for this delivery. Head to the pickup location.",
        variant: "default"
      });

      // TODO: Navigate to delivery tracking page
    } catch (err: any) {
      toast({
        title: "Failed to accept delivery",
        description: err.message,
        variant: "destructive"
      });
    }
  }, [user?.role, user?.id]);

  // Real-time subscription for new requests
  useEffect(() => {
    if (user?.role !== 'driver' || !user.isAvailable) return;

    const subscription = supabase
      .channel('delivery_requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'delivery_requests',
          filter: `status=eq.pending`
        },
        (payload) => {
          const newRequest = payload.new as DeliveryRequest;
          
          // Show notification for new request
          toast({
            title: "New Delivery Request! 📦",
            description: `$${newRequest.deliveryFee} delivery from ${newRequest.storeName} - Click to view details`,
            variant: "default"
          });

          // Add to requests list
          setRequests(prev => [newRequest, ...prev]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.role, user?.isAvailable, acceptRequest]);

  // Auto-refresh requests every 30 seconds
  useEffect(() => {
    if (user?.role !== 'driver' || !user.isAvailable) return;

    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, [user?.role, user?.isAvailable, fetchRequests]);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    requests,
    loading,
    error,
    acceptRequest,
    fetchRequests
  };
}; 