import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Star,
  MapPin,
  DollarSign,
  Package,
  Settings,
  X,
  Filter,
  Search
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'delivery' | 'earnings' | 'safety' | 'system' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface Message {
  id: string;
  from: 'support' | 'merchant' | 'customer' | 'system';
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  category: 'delivery' | 'billing' | 'support' | 'general';
}

interface DriverNotificationsProps {
  driver: any; // Replace with proper Driver type
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onDeleteNotification: (notificationId: string) => Promise<void>;
}

export const DriverNotifications: React.FC<DriverNotificationsProps> = ({ 
  driver, 
  onMarkAsRead, 
  onDeleteNotification 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'delivery',
      title: 'New Delivery Request',
      message: 'High-value delivery available in your area - $12.50 fee',
      timestamp: '2024-12-15T10:30:00Z',
      isRead: false,
      isUrgent: true,
      actionUrl: '/deliveries',
      actionText: 'View Details',
      priority: 'high'
    },
    {
      id: '2',
      type: 'earnings',
      title: 'Weekly Payout Processed',
      message: 'Your weekly payout of $89.75 has been sent to PayPal',
      timestamp: '2024-12-15T09:00:00Z',
      isRead: false,
      isUrgent: false,
      actionUrl: '/earnings',
      actionText: 'View Details',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'safety',
      title: 'Safety Alert',
      message: 'Heavy traffic reported on I-65 near your current location',
      timestamp: '2024-12-15T08:45:00Z',
      isRead: false,
      isUrgent: true,
      priority: 'high'
    },
    {
      id: '4',
      type: 'promotion',
      title: 'Bonus Opportunity',
      message: 'Earn 2x delivery fees this weekend in downtown Louisville',
      timestamp: '2024-12-15T08:00:00Z',
      isRead: true,
      isUrgent: false,
      actionUrl: '/promotions',
      actionText: 'Learn More',
      priority: 'medium'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'support',
      subject: 'Welcome to MyPartsRunner!',
      content: 'Thank you for joining our driver network. We\'re here to help you succeed!',
      timestamp: '2024-12-15T10:00:00Z',
      isRead: false,
      isUrgent: false,
      category: 'general'
    },
    {
      id: '2',
      from: 'merchant',
      subject: 'Delivery Instructions Update',
      content: 'Please use the back entrance for all deliveries to AutoZone on Main St.',
      timestamp: '2024-12-15T09:30:00Z',
      isRead: false,
      isUrgent: false,
      category: 'delivery'
    }
  ]);

  const [activeTab, setActiveTab] = useState('notifications');
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.isUrgent).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'urgent') return notification.isUrgent;
    return true;
  });

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await onMarkAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      toast({
        title: "Failed to mark as read",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await onDeleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: "Notification deleted",
        description: "Notification has been removed",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Package className="h-4 w-4" />;
      case 'earnings': return <DollarSign className="h-4 w-4" />;
      case 'safety': return <AlertTriangle className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'promotion': return <Star className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'delivery': return 'bg-blue-100 text-blue-800';
      case 'earnings': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-red-100 text-red-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'promotion': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header with counts */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications & Messages</h2>
          <p className="text-gray-600">Stay updated with important alerts and communications</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-xs text-gray-600">Unread</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
            <div className="text-xs text-gray-600">Urgent</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Messages
            {messages.filter(m => !m.isRead).length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {messages.filter(m => !m.isRead).length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No notifications to display</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`${
                    notification.isRead ? 'bg-gray-50' : 'bg-white'
                  } ${
                    notification.isUrgent ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${
                              notification.isRead ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            
                            {notification.isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <Badge className={getTypeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-3 ${
                          notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {notification.actionUrl && notification.actionText && (
                              <Button size="sm" variant="outline">
                                {notification.actionText}
                              </Button>
                            )}
                            
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No messages to display</p>
              </div>
            ) : (
              messages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`${
                    message.isRead ? 'bg-gray-50' : 'bg-white'
                  } ${
                    message.isUrgent ? 'border-red-200' : 'border-gray-200'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-semibold ${
                              message.isRead ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {message.subject}
                            </h4>
                            
                            {message.isUrgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          
                          <Badge className={getTypeColor(message.category)}>
                            {message.category}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-2">
                          From: {message.from.charAt(0).toUpperCase() + message.from.slice(1)}
                        </p>
                        
                        <p className={`text-sm mb-3 ${
                          message.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {message.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(message.timestamp)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {!message.isRead && (
                              <Button size="sm" variant="outline">
                                Mark as Read
                              </Button>
                            )}
                            
                            <Button size="sm" variant="outline">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
          <CardDescription>
            Customize how and when you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Delivery Notifications</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>New delivery requests</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery updates</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Route changes</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Earnings & Promotions</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Payout confirmations</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bonus opportunities</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Weekly summaries</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Enabled
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-2" />
              Customize All Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 