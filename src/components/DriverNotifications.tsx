import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
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
  Search,
  BellRing,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Trash2,
  MarkAsRead,
  Smartphone,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Shield,
  Zap,
  Target,
  Users
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

interface Notification {
  id: string;
  type: 'delivery' | 'earnings' | 'safety' | 'system' | 'promotion' | 'achievement' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  data?: any;
}

interface Message {
  id: string;
  from: 'support' | 'merchant' | 'customer' | 'system' | 'admin';
  fromName?: string;
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isUrgent: boolean;
  category: 'delivery' | 'billing' | 'support' | 'general' | 'feedback';
  attachments?: string[];
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  deliveryAlerts: boolean;
  earningsUpdates: boolean;
  systemAnnouncements: boolean;
  promotions: boolean;
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface DriverNotificationsProps {
  driver: any;
  onMarkAsRead: (notificationId: string) => Promise<void>;
  onDeleteNotification: (notificationId: string) => Promise<void>;
}

export const DriverNotifications: React.FC<DriverNotificationsProps> = ({
  driver,
  onMarkAsRead,
  onDeleteNotification
}) => {
  const { user } = useAppContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    deliveryAlerts: true,
    earningsUpdates: true,
    systemAnnouncements: true,
    promotions: false,
    soundEnabled: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  useEffect(() => {
    loadNotifications();
    loadMessages();
    loadSettings();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('driver_notifications')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `recipient_id=eq.${user?.id}`
        }, 
        (payload) => {
          console.log('New notification:', payload);
          handleNewNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const loadNotifications = async () => {
    try {
      // Generate mock notifications with realistic data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'delivery',
          title: 'New Delivery Request',
          message: 'You have a new delivery request from AutoZone. Pickup at 123 Main St, delivery to 456 Oak Ave. Estimated earnings: $12.50',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          isRead: false,
          isUrgent: true,
          priority: 'high',
          actionText: 'Accept Delivery',
          actionUrl: '/deliveries/new',
          data: { orderId: 'ORD-001', earnings: 12.50 }
        },
        {
          id: '2',
          type: 'earnings',
          title: 'Payment Processed',
          message: 'Your weekly earnings of $347.50 have been processed and will be deposited within 1-2 business days.',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isRead: false,
          isUrgent: false,
          priority: 'medium',
          data: { amount: 347.50, period: 'weekly' }
        },
        {
          id: '3',
          type: 'achievement',
          title: '🏆 Milestone Reached!',
          message: 'Congratulations! You\'ve completed 100 deliveries and earned the "Century Driver" badge. Keep up the great work!',
          timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          isRead: true,
          isUrgent: false,
          priority: 'low',
          data: { badge: 'century_driver', milestone: 100 }
        },
        {
          id: '4',
          type: 'safety',
          title: 'Weather Alert',
          message: 'Heavy rain expected in your area from 3-6 PM. Please drive safely and consider adjusting your delivery schedule.',
          timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
          isRead: true,
          isUrgent: true,
          priority: 'high',
          category: 'weather'
        },
        {
          id: '5',
          type: 'system',
          title: 'App Update Available',
          message: 'A new version of MyPartsRunner is available with improved navigation and new features. Update now for the best experience.',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          isRead: false,
          isUrgent: false,
          priority: 'medium',
          actionText: 'Update Now',
          actionUrl: '/update'
        },
        {
          id: '6',
          type: 'promotion',
          title: 'Bonus Weekend!',
          message: 'Earn 20% bonus on all deliveries this weekend! Complete 5+ deliveries to qualify for additional incentives.',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          isRead: true,
          isUrgent: false,
          priority: 'medium',
          data: { bonusRate: 0.2, minDeliveries: 5 }
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadMessages = async () => {
    try {
      // Generate mock messages
      const mockMessages: Message[] = [
        {
          id: '1',
          from: 'support',
          fromName: 'MyPartsRunner Support',
          subject: 'Welcome to the Driver Community!',
          content: 'Welcome to MyPartsRunner! We\'re excited to have you as part of our driver community. Here are some tips to get started...',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          isRead: false,
          isUrgent: false,
          category: 'general'
        },
        {
          id: '2',
          from: 'merchant',
          fromName: 'AutoZone Store #1523',
          subject: 'Thank you for the delivery!',
          content: 'Thank you for the quick and professional delivery today. Our customer was very satisfied with the service.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          isRead: true,
          isUrgent: false,
          category: 'feedback'
        },
        {
          id: '3',
          from: 'customer',
          fromName: 'John D.',
          subject: 'Delivery feedback',
          content: 'Great service! The driver was on time and very professional. Will definitely use MyPartsRunner again.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          isRead: false,
          isUrgent: false,
          category: 'feedback'
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = () => {
    // Load from localStorage or user preferences
    const savedSettings = localStorage.getItem('driverNotificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleNewNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // Show browser notification if enabled
    if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png'
      });
    }

    // Play sound if enabled
    if (settings.soundEnabled && notification.isUrgent) {
      // Would play notification sound
      console.log('🔔 Notification sound would play here');
    }

    // Show toast for urgent notifications
    if (notification.isUrgent) {
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.priority === 'critical' ? 'destructive' : 'default'
      });
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      // Would call API to mark all as read
      toast({
        title: "All notifications marked as read",
        variant: "default"
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      await onDeleteNotification(notificationId);
      toast({
        title: "Notification deleted",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleSettingChange = (setting: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem('driverNotificationSettings', JSON.stringify(newSettings));
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: "Notifications enabled",
          description: "You'll now receive browser notifications for important updates.",
          variant: "default"
        });
      }
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesReadStatus = !showOnlyUnread || !notification.isRead;
    
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadStatus = !showOnlyUnread || !message.isRead;
    
    return matchesSearch && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.isUrgent && !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'delivery': return <Package className="h-4 w-4" />;
      case 'earnings': return <DollarSign className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      case 'promotion': return <Star className="h-4 w-4" />;
      case 'achievement': return <Award className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="h-6 w-6 animate-spin mr-2" />
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-gray-600">
            {unreadCount} unread notifications
            {urgentCount > 0 && (
              <span className="ml-2 text-orange-600 font-medium">
                ({urgentCount} urgent)
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            <MarkAsRead className="mr-2 h-4 w-4" />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={requestNotificationPermission}>
            <BellRing className="mr-2 h-4 w-4" />
            Enable Browser Notifications
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-orange-500">{unreadCount}</p>
              </div>
              <EyeOff className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent</p>
                <p className="text-2xl font-bold text-red-500">{urgentCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold">{messages.filter(m => !m.isRead).length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  All Notifications
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showOnlyUnread}
                    onCheckedChange={setShowOnlyUnread}
                  />
                  <Label>Unread only</Label>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="delivery">Delivery</option>
                  <option value="earnings">Earnings</option>
                  <option value="safety">Safety</option>
                  <option value="system">System</option>
                  <option value="promotion">Promotions</option>
                  <option value="achievement">Achievements</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`border rounded-lg p-4 ${
                        !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      } ${notification.isUrgent ? 'ring-2 ring-orange-200' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-2 rounded-full ${
                            notification.type === 'delivery' ? 'bg-blue-100 text-blue-600' :
                            notification.type === 'earnings' ? 'bg-green-100 text-green-600' :
                            notification.type === 'safety' ? 'bg-red-100 text-red-600' :
                            notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h4>
                              <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
                              {notification.isUrgent && (
                                <Badge variant="destructive" className="text-xs">Urgent</Badge>
                              )}
                              {!notification.isRead && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>{new Date(notification.timestamp).toLocaleString()}</span>
                              <span className="capitalize">{notification.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {notification.actionText && (
                        <div className="mt-3 pt-3 border-t">
                          <Button size="sm">
                            {notification.actionText}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`border rounded-lg p-4 ${
                        !message.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${!message.isRead ? 'font-bold' : ''}`}>
                              {message.subject}
                            </h4>
                            {!message.isRead && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                            {message.isUrgent && (
                              <Badge variant="destructive" className="text-xs">Urgent</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">From: {message.fromName || message.from}</p>
                          <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{new Date(message.timestamp).toLocaleString()}</span>
                            <span className="capitalize">{message.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-4">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No messages found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Notification Channels</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Browser and mobile app notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Important updates via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Critical alerts via text message</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings.soundEnabled ? (
                      <Volume2 className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <VolumeX className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">Sound Alerts</p>
                      <p className="text-sm text-gray-500">Audio alerts for urgent notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delivery Alerts</p>
                    <p className="text-sm text-gray-500">New delivery requests and updates</p>
                  </div>
                  <Switch
                    checked={settings.deliveryAlerts}
                    onCheckedChange={(checked) => handleSettingChange('deliveryAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Earnings Updates</p>
                    <p className="text-sm text-gray-500">Payment processing and earnings reports</p>
                  </div>
                  <Switch
                    checked={settings.earningsUpdates}
                    onCheckedChange={(checked) => handleSettingChange('earningsUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Announcements</p>
                    <p className="text-sm text-gray-500">App updates and maintenance notices</p>
                  </div>
                  <Switch
                    checked={settings.systemAnnouncements}
                    onCheckedChange={(checked) => handleSettingChange('systemAnnouncements', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotions & Bonuses</p>
                    <p className="text-sm text-gray-500">Special offers and bonus opportunities</p>
                  </div>
                  <Switch
                    checked={settings.promotions}
                    onCheckedChange={(checked) => handleSettingChange('promotions', checked)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Quiet Hours</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable Quiet Hours</p>
                    <p className="text-sm text-gray-500">Reduce notifications during specified hours</p>
                  </div>
                  <Switch
                    checked={settings.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingChange('quietHours', { ...settings.quietHours, enabled: checked })
                    }
                  />
                </div>
                
                {settings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.start}
                        onChange={(e) => 
                          handleSettingChange('quietHours', { 
                            ...settings.quietHours, 
                            start: e.target.value 
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>End Time</Label>
                      <Input
                        type="time"
                        value={settings.quietHours.end}
                        onChange={(e) => 
                          handleSettingChange('quietHours', { 
                            ...settings.quietHours, 
                            end: e.target.value 
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 