import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Package, 
  Star, 
  Clock, 
  MapPin,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  Calendar,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

interface Delivery {
  id: string;
  customerName: string;
  address: string;
  items: string[];
  earnings: number;
  rating: number;
  feedback?: string;
  completedAt: Date;
  deliveryTime: number; // minutes
  distance: number; // miles
  status: 'completed' | 'rated';
}

const DriverDeliveryHistory: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Generate sample delivery data
  useEffect(() => {
    const sampleDeliveries: Delivery[] = [
      {
        id: '1',
        customerName: 'Sarah Johnson',
        address: '123 Oak St, Louisville, KY',
        items: ['Engine Oil', 'Air Filter', 'Brake Pads'],
        earnings: 24.50,
        rating: 5,
        feedback: 'Super fast delivery! Great service.',
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        deliveryTime: 18,
        distance: 3.2,
        status: 'rated'
      },
      {
        id: '2',
        customerName: 'Mike Chen',
        address: '456 Maple Ave, Louisville, KY',
        items: ['Windshield Wipers', 'Car Battery'],
        earnings: 32.00,
        rating: 5,
        feedback: 'Professional and courteous driver.',
        completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        deliveryTime: 25,
        distance: 4.8,
        status: 'rated'
      },
      {
        id: '3',
        customerName: 'Lisa Martinez',
        address: '789 Pine Rd, Louisville, KY',
        items: ['Tire Pressure Gauge', 'Emergency Kit'],
        earnings: 18.75,
        rating: 4,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        deliveryTime: 22,
        distance: 2.1,
        status: 'rated'
      },
      {
        id: '4',
        customerName: 'David Wilson',
        address: '321 Elm St, Louisville, KY',
        items: ['Motor Oil', 'Transmission Fluid', 'Coolant'],
        earnings: 28.25,
        rating: 5,
        feedback: 'Quick and efficient delivery!',
        completedAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
        deliveryTime: 19,
        distance: 3.9,
        status: 'rated'
      },
      {
        id: '5',
        customerName: 'Jennifer Brown',
        address: '654 Cedar Ln, Louisville, KY',
        items: ['Jump Starter', 'USB Charger'],
        earnings: 21.00,
        rating: 0, // Not rated yet
        completedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        deliveryTime: 16,
        distance: 2.7,
        status: 'completed'
      }
    ];

    setDeliveries(sampleDeliveries);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just completed';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getAverageRating = () => {
    const ratedDeliveries = deliveries.filter(d => d.rating > 0);
    if (ratedDeliveries.length === 0) return 0;
    return (ratedDeliveries.reduce((sum, d) => sum + d.rating, 0) / ratedDeliveries.length).toFixed(1);
  };

  const getTotalEarnings = () => {
    return deliveries.reduce((sum, d) => sum + d.earnings, 0).toFixed(2);
  };

  const displayedDeliveries = showAll ? deliveries : deliveries.slice(0, 3);

  const DeliveryCard = ({ delivery }: { delivery: Delivery }) => (
    <div className="p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{delivery.customerName}</h4>
            {delivery.status === 'rated' && delivery.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium text-yellow-600">{delivery.rating}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
            <MapPin className="h-3 w-3" />
            <span>{delivery.address}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(delivery.completedAt)}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <DollarSign className="h-3 w-3" />
            <span className="text-sm">{delivery.earnings.toFixed(2)}</span>
          </div>
          <Badge variant={delivery.status === 'rated' ? 'default' : 'secondary'} className="text-xs mt-1">
            {delivery.status === 'rated' ? 'Rated' : 'Completed'}
          </Badge>
        </div>
      </div>

      {/* Items */}
      <div className="mb-3">
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <Package className="h-3 w-3" />
          <span>Items delivered:</span>
        </div>
        <p className="text-xs text-gray-800">{delivery.items.join(', ')}</p>
      </div>

      {/* Performance Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
        <span>⏱️ {delivery.deliveryTime}min</span>
        <span>📍 {delivery.distance}mi</span>
        <span>💰 ${(delivery.earnings / delivery.distance).toFixed(2)}/mi</span>
      </div>

      {/* Customer Feedback */}
      {delivery.feedback && (
        <div className="p-2 bg-blue-50 rounded border-l-4 border-blue-200">
          <div className="flex items-center gap-1 mb-1">
            <MessageCircle className="h-3 w-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Customer Feedback</span>
          </div>
          <p className="text-xs text-blue-700 italic">"{delivery.feedback}"</p>
        </div>
      )}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            <CardTitle>Recent Deliveries</CardTitle>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard?tab=deliveries" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs">View All</span>
            </a>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-lg font-bold text-blue-800">{deliveries.length}</p>
            <p className="text-xs text-blue-600">Total Deliveries</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-lg font-bold text-yellow-600">{getAverageRating()}</p>
            <p className="text-xs text-yellow-600">Avg Rating</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-600">${getTotalEarnings()}</p>
            <p className="text-xs text-green-600">Total Earned</p>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="space-y-3">
          {displayedDeliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>

        {/* Show More/Less Button */}
        {deliveries.length > 3 && (
          <div className="text-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-xs"
            >
              {showAll ? 'Show Less' : `Show All ${deliveries.length} Deliveries`}
            </Button>
          </div>
        )}

        {/* Performance Tip */}
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Performance Insight</span>
          </div>
          <p className="text-xs text-green-700">
            Your average rating is {getAverageRating()}/5.0! Keep up the excellent customer service to maintain high ratings and earn more.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverDeliveryHistory; 