import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Navigation, 
  Phone, 
  Camera, 
  MapPin, 
  Clock, 
  DollarSign,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  User,
  Truck
} from 'lucide-react';

const DriverDeliveriesPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('active');

  // Mock delivery data
  const activeDeliveries = [
    {
      id: 'MP-2024-001',
      customerName: 'Sarah Johnson',
      customerPhone: '+1 (555) 123-4567',
      pickupAddress: '123 Main St, Downtown',
      deliveryAddress: '789 Oak Avenue, Uptown',
      distance: '2.4 miles',
      estimatedTime: '15 mins',
      priority: 'high',
      payAmount: 12.50,
      tips: 3.00,
      items: ['Auto Parts Kit', 'Oil Filter', 'Spark Plugs'],
      status: 'pickup_ready',
      orderTime: '2:30 PM',
      specialInstructions: 'Call upon arrival. Apartment 4B.'
    },
    {
      id: 'MP-2024-002',
      customerName: 'Mike Rodriguez',
      customerPhone: '+1 (555) 987-6543',
      pickupAddress: '456 Pine St, Midtown',
      deliveryAddress: '321 Elm Street, Eastside',
      distance: '1.8 miles',
      estimatedTime: '12 mins',
      priority: 'normal',
      payAmount: 8.75,
      tips: 2.00,
      items: ['Brake Pads', 'Brake Fluid'],
      status: 'in_progress',
      orderTime: '1:45 PM',
      specialInstructions: 'Leave with front desk if not available.'
    }
  ];

  const pendingDeliveries = [
    {
      id: 'MP-2024-003',
      customerName: 'Lisa Chen',
      customerPhone: '+1 (555) 456-7890',
      pickupAddress: '789 First Ave, Downtown',
      deliveryAddress: '555 Second St, Westside',
      distance: '3.2 miles',
      estimatedTime: '18 mins',
      priority: 'normal',
      payAmount: 15.00,
      tips: 0.00,
      items: ['Engine Oil', 'Air Filter', 'Cabin Filter'],
      status: 'scheduled',
      orderTime: '4:00 PM',
      scheduledPickup: '3:45 PM',
      specialInstructions: 'Business hours only. Ring doorbell twice.'
    }
  ];

  const completedDeliveries = [
    {
      id: 'MP-2024-004',
      customerName: 'David Park',
      customerPhone: '+1 (555) 234-5678',
      pickupAddress: '111 Market St, Downtown',
      deliveryAddress: '999 Broadway, Northside',
      distance: '2.1 miles',
      completedTime: '1:20 PM',
      payAmount: 10.25,
      tips: 4.00,
      customerRating: 5,
      items: ['Windshield Wipers', 'Washer Fluid'],
      deliveryTime: '22 mins'
    },
    {
      id: 'MP-2024-005',
      customerName: 'Emma Wilson',
      customerPhone: '+1 (555) 345-6789',
      pickupAddress: '222 State St, Midtown',
      deliveryAddress: '777 Park Ave, Southside',
      distance: '1.5 miles',
      completedTime: '12:45 PM',
      payAmount: 7.50,
      tips: 2.50,
      customerRating: 4,
      items: ['Motor Oil'],
      deliveryTime: '15 mins'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pickup_ready': return 'text-orange-600 bg-orange-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const DeliveryCard = ({ delivery, isActive = false }: { delivery: any, isActive?: boolean }) => (
    <Card className="mb-4 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{delivery.id}</h3>
            <Badge className={getPriorityColor(delivery.priority)}>
              {delivery.priority === 'high' ? 'Priority' : 'Standard'}
            </Badge>
            {isActive && (
              <Badge className={getStatusColor(delivery.status)}>
                {delivery.status === 'pickup_ready' ? 'Ready for Pickup' : 
                 delivery.status === 'in_progress' ? 'In Progress' : 'Scheduled'}
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="font-bold text-green-600">${(delivery.payAmount + (delivery.tips || 0)).toFixed(2)}</div>
            <div className="text-xs text-gray-600">
              ${delivery.payAmount.toFixed(2)} + ${(delivery.tips || 0).toFixed(2)} tip
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{delivery.customerName}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1 h-8 w-8"
              onClick={() => window.open(`tel:${delivery.customerPhone}`)}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-blue-500 mt-1" />
              <div>
                <div className="text-sm font-medium">Pickup</div>
                <div className="text-sm text-gray-600">{delivery.pickupAddress}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-500 mt-1" />
              <div>
                <div className="text-sm font-medium">Delivery</div>
                <div className="text-sm text-gray-600">{delivery.deliveryAddress}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Navigation className="h-4 w-4" />
              <span>{delivery.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{delivery.estimatedTime || delivery.deliveryTime}</span>
            </div>
            {delivery.completedTime && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{delivery.completedTime}</span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium mb-1">Items ({delivery.items.length})</div>
            <div className="text-sm text-gray-600">
              {delivery.items.join(', ')}
            </div>
          </div>

          {delivery.specialInstructions && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-yellow-800">Special Instructions</div>
                  <div className="text-sm text-yellow-700">{delivery.specialInstructions}</div>
                </div>
              </div>
            </div>
          )}

          {delivery.customerRating && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Customer Rating:</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < delivery.customerRating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="text-sm font-medium ml-1">{delivery.customerRating}/5</span>
              </div>
            </div>
          )}
        </div>

        {isActive && (
          <div className="grid grid-cols-2 gap-3">
            {delivery.status === 'pickup_ready' && (
              <>
                <Button className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate to Pickup
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Customer
                </Button>
              </>
            )}
            {delivery.status === 'in_progress' && (
              <>
                <Button className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate to Drop-off
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </>
            )}
            {delivery.status === 'scheduled' && (
              <>
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Pickup at {delivery.scheduledPickup}
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Customer
                </Button>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Deliveries</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{activeDeliveries.length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{pendingDeliveries.length}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{completedDeliveries.length}</div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="active" className="relative">
            Active
            {activeDeliveries.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
                {activeDeliveries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingDeliveries.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-purple-500">
                {pendingDeliveries.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDeliveries.length > 0 ? (
            <>
              {activeDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} isActive={true} />
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Deliveries</h3>
                <p className="text-gray-600">
                  You're all caught up! Check back for new delivery requests.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingDeliveries.length > 0 ? (
            <>
              {pendingDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} isActive={true} />
              ))}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Deliveries</h3>
                <p className="text-gray-600">
                  No scheduled deliveries at the moment. Stay tuned for new orders!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedDeliveries.length > 0 ? (
            <>
              {completedDeliveries.map((delivery) => (
                <DeliveryCard key={delivery.id} delivery={delivery} />
              ))}
              
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-bold text-green-800">Great Job Today!</h3>
                    <p className="text-sm text-green-700 mb-3">
                      You've completed {completedDeliveries.length} deliveries with an average rating of{' '}
                      {(completedDeliveries.reduce((acc, d) => acc + d.customerRating, 0) / completedDeliveries.length).toFixed(1)}/5
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-bold text-green-600">
                          ${completedDeliveries.reduce((acc, d) => acc + d.payAmount + d.tips, 0).toFixed(2)}
                        </div>
                        <div className="text-green-700">Total Earned</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600">
                          {(completedDeliveries.reduce((acc, d) => acc + parseFloat(d.distance), 0)).toFixed(1)} mi
                        </div>
                        <div className="text-green-700">Miles Driven</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Deliveries Today</h3>
                <p className="text-gray-600">
                  Start accepting deliveries to see your completed orders here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverDeliveriesPage; 