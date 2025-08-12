import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { usePayouts } from '@/hooks/use-payouts';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  DollarSign,
  Plus,
  Eye,
  Play,
  RefreshCw
} from 'lucide-react';

interface Order {
  id: string;
  merchant_id: string;
  driver_id?: string;
  customer_id: string;
  item_total: number;
  delivery_fee: number;
  service_fee: number;
  status: string;
  payout_status: string;
  created_at: string;
  completed_at?: string;
}

export const OrderManagement: React.FC = () => {
  const { user } = useAppContext();
  const { processOrderPayout, testPayout, loading } = usePayouts();
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState({
    item_total: '',
    delivery_fee: '',
    service_fee: ''
  });

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by user role
      if (user.role === 'merchant') {
        query = query.eq('merchant_id', user.id);
      } else if (user.role === 'driver') {
        query = query.eq('driver_id', user.id);
      } else if (user.role === 'customer') {
        query = query.eq('customer_id', user.id);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      toast({
        title: "Failed to load orders",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const createTestOrder = async () => {
    if (!user || !newOrder.item_total || !newOrder.delivery_fee || !newOrder.service_fee) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const orderData = {
        merchant_id: user.role === 'merchant' ? user.id : '00000000-0000-0000-0000-000000000000',
        driver_id: user.role === 'driver' ? user.id : null,
        customer_id: user.role === 'customer' ? user.id : '00000000-0000-0000-0000-000000000000',
        item_total: parseFloat(newOrder.item_total),
        delivery_fee: parseFloat(newOrder.delivery_fee),
        service_fee: parseFloat(newOrder.service_fee),
        status: 'pending',
        payout_status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Test order created!",
        description: `Order ${data.id} has been created successfully.`,
        variant: "default"
      });

      // Reset form and reload orders
      setNewOrder({ item_total: '', delivery_fee: '', service_fee: '' });
      loadOrders();
    } catch (error) {
      console.error('Failed to create order:', error);
      toast({
        title: "Failed to create order",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const completeOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      toast({
        title: "Order completed!",
        description: "The order has been marked as completed and payout will be processed automatically.",
        variant: "default"
      });

      // Reload orders to see updated status
      loadOrders();
    } catch (error) {
      console.error('Failed to complete order:', error);
      toast({
        title: "Failed to complete order",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPayoutStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-gray-600">Create and manage test orders for payment system testing</p>
        </div>
        
        <Button onClick={loadOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Create Test Order */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Test Order
          </CardTitle>
          <CardDescription>
            Create a test order to test the payment system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="item_total">Item Total ($)</Label>
              <Input
                id="item_total"
                type="number"
                step="0.01"
                min="0"
                value={newOrder.item_total}
                onChange={(e) => setNewOrder(prev => ({ ...prev, item_total: e.target.value }))}
                placeholder="100.00"
              />
            </div>
            
            <div>
              <Label htmlFor="delivery_fee">Delivery Fee ($)</Label>
              <Input
                id="delivery_fee"
                type="number"
                step="0.01"
                min="0"
                value={newOrder.delivery_fee}
                onChange={(e) => setNewOrder(prev => ({ ...prev, delivery_fee: e.target.value }))}
                placeholder="20.00"
              />
            </div>
            
            <div>
              <Label htmlFor="service_fee">Service Fee ($)</Label>
              <Input
                id="service_fee"
                type="number"
                step="0.01"
                min="0"
                value={newOrder.service_fee}
                onChange={(e) => setNewOrder(prev => ({ ...prev, service_fee: e.target.value }))}
                placeholder="5.00"
              />
            </div>
          </div>
          
          <Button 
            onClick={createTestOrder} 
            className="mt-4"
            disabled={loading || !newOrder.item_total || !newOrder.delivery_fee || !newOrder.service_fee}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Test Order
          </Button>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            {orders.length} order(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Order {order.id.slice(0, 8)}...</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPayoutStatusColor(order.payout_status)}>
                      {order.payout_status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Item Total</p>
                    <p className="font-semibold text-blue-700">${order.item_total}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Delivery Fee</p>
                    <p className="font-semibold text-green-700">${order.delivery_fee}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Service Fee</p>
                    <p className="font-semibold text-purple-700">${order.service_fee}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    Total: ${(order.item_total + order.delivery_fee + order.service_fee).toFixed(2)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {order.status === 'pending' && (
                      <Button
                        onClick={() => completeOrder(order.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Order
                      </Button>
                    )}
                    
                    {order.status === 'completed' && order.payout_status === 'pending' && (
                      <Button
                        onClick={() => testPayout(order.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Test Payout
                      </Button>
                    )}
                    
                    {order.status === 'completed' && order.payout_status === 'completed' && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Payout Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p>No orders found</p>
                <p className="text-sm">Create a test order to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 