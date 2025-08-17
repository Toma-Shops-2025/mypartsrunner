import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Users,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  X,
  Eye,
  Settings,
  Target,
  Zap,
  Calendar,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'push' | 'email' | 'sms' | 'in-app';
  category: 'order' | 'delivery' | 'system' | 'promotion' | 'safety';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  recipient: {
    id: string;
    name: string;
    role: 'customer' | 'driver' | 'merchant' | 'admin';
    contact: string;
  };
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  sentAt?: string;
  readAt?: string;
  metadata?: Record<string, any>;
}

interface NotificationTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  content: string;
  channels: string[];
  triggers: string[];
  variables: string[];
  enabled: boolean;
}

interface NotificationSettings {
  push: {
    enabled: boolean;
    vapidKey?: string;
    showBadge: boolean;
    playSound: boolean;
    vibrate: boolean;
  };
  email: {
    enabled: boolean;
    provider: 'sendgrid' | 'mailgun' | 'aws-ses';
    fromEmail: string;
    fromName: string;
  };
  sms: {
    enabled: boolean;
    provider: 'twilio' | 'aws-sns';
    fromNumber: string;
  };
  inApp: {
    enabled: boolean;
    autoMarkRead: boolean;
    showToast: boolean;
    persistDuration: number;
  };
}

interface NotificationSystemProps {
  userId?: string;
  userRole?: 'admin' | 'merchant' | 'driver' | 'customer';
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  userId = 'demo-admin',
  userRole = 'admin'
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    push: {
      enabled: true,
      showBadge: true,
      playSound: true,
      vibrate: true
    },
    email: {
      enabled: true,
      provider: 'sendgrid',
      fromEmail: 'notifications@mypartsrunner.com',
      fromName: 'MyPartsRunner'
    },
    sms: {
      enabled: true,
      provider: 'twilio',
      fromNumber: '+1-555-PARTS'
    },
    inApp: {
      enabled: true,
      autoMarkRead: false,
      showToast: true,
      persistDuration: 7
    }
  });

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [newNotification, setNewNotification] = useState({
    type: 'push',
    category: 'system',
    title: '',
    message: '',
    priority: 'medium',
    recipients: 'all'
  });

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: 'notif1',
      type: 'push',
      category: 'order',
      title: 'New Order Received',
      message: 'Order #MP-2024-001 from Sarah Johnson for brake pads',
      priority: 'high',
      recipient: {
        id: 'driver1',
        name: 'Alex Rodriguez',
        role: 'driver',
        contact: 'alex@example.com'
      },
      status: 'delivered',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      sentAt: new Date(Date.now() - 3500000).toISOString(),
      readAt: new Date(Date.now() - 3000000).toISOString()
    },
    {
      id: 'notif2',
      type: 'email',
      category: 'delivery',
      title: 'Delivery Completed',
      message: 'Your order has been successfully delivered to 123 Main St',
      priority: 'medium',
      recipient: {
        id: 'customer1',
        name: 'Sarah Johnson',
        role: 'customer',
        contact: 'sarah@example.com'
      },
      status: 'sent',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      sentAt: new Date(Date.now() - 7000000).toISOString()
    },
    {
      id: 'notif3',
      type: 'sms',
      category: 'safety',
      title: 'Weather Alert',
      message: 'Heavy rain expected. Drive safely and consider postponing non-urgent deliveries.',
      priority: 'critical',
      recipient: {
        id: 'driver2',
        name: 'Mike Chen',
        role: 'driver',
        contact: '+1-555-0123'
      },
      status: 'delivered',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      sentAt: new Date(Date.now() - 1700000).toISOString()
    },
    {
      id: 'notif4',
      type: 'in-app',
      category: 'system',
      title: 'System Maintenance',
      message: 'Scheduled maintenance tonight from 2-4 AM. App may be temporarily unavailable.',
      priority: 'medium',
      recipient: {
        id: 'merchant1',
        name: 'AutoZone Downtown',
        role: 'merchant',
        contact: 'manager@autozone.com'
      },
      status: 'pending',
      createdAt: new Date(Date.now() - 900000).toISOString()
    }
  ];

  const mockTemplates: NotificationTemplate[] = [
    {
      id: 'template1',
      name: 'Order Confirmation',
      category: 'order',
      subject: 'Order Confirmed - #{order_id}',
      content: 'Hi {customer_name}, your order #{order_id} for {items} has been confirmed and will be delivered to {address}.',
      channels: ['email', 'push'],
      triggers: ['order_created'],
      variables: ['customer_name', 'order_id', 'items', 'address'],
      enabled: true
    },
    {
      id: 'template2',
      name: 'Driver Assignment',
      category: 'delivery',
      subject: 'New Delivery Assignment',
      content: 'You have been assigned delivery #{order_id}. Pickup from {merchant_name} and deliver to {customer_address}.',
      channels: ['push', 'sms'],
      triggers: ['driver_assigned'],
      variables: ['order_id', 'merchant_name', 'customer_address'],
      enabled: true
    },
    {
      id: 'template3',
      name: 'Delivery Status Update',
      category: 'delivery',
      subject: 'Your order is {status}',
      content: 'Hi {customer_name}, your order #{order_id} is now {status}. {additional_info}',
      channels: ['email', 'push', 'sms'],
      triggers: ['status_update'],
      variables: ['customer_name', 'order_id', 'status', 'additional_info'],
      enabled: true
    },
    {
      id: 'template4',
      name: 'Low Stock Alert',
      category: 'system',
      subject: 'Low Stock Alert - {product_name}',
      content: 'Stock alert: {product_name} is running low ({current_stock} remaining). Consider reordering.',
      channels: ['email'],
      triggers: ['low_stock'],
      variables: ['product_name', 'current_stock'],
      enabled: true
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
    setTemplates(mockTemplates);
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send notification
  const sendNotification = useCallback(async (notification: Partial<Notification>) => {
    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      type: notification.type || 'push',
      category: notification.category || 'system',
      title: notification.title || '',
      message: notification.message || '',
      priority: notification.priority || 'medium',
      recipient: notification.recipient || {
        id: 'all',
        name: 'All Users',
        role: 'customer',
        contact: ''
      },
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotif, ...prev]);

    // Simulate sending
    setTimeout(() => {
      setNotifications(prev => 
        prev.map(n => 
          n.id === newNotif.id 
            ? { ...n, status: 'sent', sentAt: new Date().toISOString() }
            : n
        )
      );

      // Show browser notification if enabled and permission granted
      if (newNotif.type === 'push' && settings.push.enabled && Notification.permission === 'granted') {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.png',
          badge: '/favicon.png',
          vibrate: settings.push.vibrate ? [200, 100, 200] : undefined,
          silent: !settings.push.playSound
        });
      }

      // Simulate delivery after a delay
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(n => 
            n.id === newNotif.id 
              ? { ...n, status: 'delivered' }
              : n
          )
        );
      }, 2000);
    }, 1000);

    return newNotif;
  }, [settings]);

  // Mark as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, status: 'read', readAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  // Bulk actions
  const markSelectedAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => 
        selectedNotifications.includes(n.id) 
          ? { ...n, status: 'read', readAt: new Date().toISOString() }
          : n
      )
    );
    setSelectedNotifications([]);
  }, [selectedNotifications]);

  const deleteSelected = useCallback(() => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
  }, [selectedNotifications]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const statusMatch = filterStatus === 'all' || notification.status === filterStatus;
    const typeMatch = filterType === 'all' || notification.type === filterType;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'sent': return 'bg-blue-500';
      case 'read': return 'bg-purple-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'push': return Bell;
      case 'email': return Mail;
      case 'sms': return MessageSquare;
      case 'in-app': return Smartphone;
      default: return Bell;
    }
  };

  const stats = {
    total: notifications.length,
    sent: notifications.filter(n => n.status === 'sent').length,
    delivered: notifications.filter(n => n.status === 'delivered').length,
    read: notifications.filter(n => n.status === 'read').length,
    failed: notifications.filter(n => n.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification System</h1>
          <p className="text-gray-600">Manage all communication channels</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={requestNotificationPermission} variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Enable Push
          </Button>
          <Button onClick={() => {
            const testNotif = {
              type: 'push' as const,
              category: 'system' as const,
              title: 'Test Notification',
              message: 'This is a test notification from MyPartsRunner!',
              priority: 'medium' as const,
              recipient: {
                id: 'test',
                name: 'Test User',
                role: 'admin' as const,
                contact: 'test@example.com'
              }
            };
            sendNotification(testNotif);
          }}>
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.sent}</div>
            <div className="text-sm text-gray-600">Sent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
            <div className="text-sm text-gray-600">Delivered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.read}</div>
            <div className="text-sm text-gray-600">Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          {/* Filters and Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="push">Push</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="in-app">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedNotifications.length > 0 && (
                  <div className="flex gap-2">
                    <Button onClick={markSelectedAsRead} variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Read ({selectedNotifications.length})
                    </Button>
                    <Button onClick={deleteSelected} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Delete ({selectedNotifications.length})
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications ({filteredNotifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const TypeIcon = getTypeIcon(notification.type);
                  
                  return (
                    <div 
                      key={notification.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg ${
                        notification.status === 'read' ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNotifications(prev => [...prev, notification.id]);
                          } else {
                            setSelectedNotifications(prev => prev.filter(id => id !== notification.id));
                          }
                        }}
                        className="w-4 h-4"
                      />

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <Badge className={getStatusColor(notification.status)}>
                              {notification.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>To: {notification.recipient.name} ({notification.recipient.role})</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleString()}</span>
                            {notification.readAt && (
                              <>
                                <span>•</span>
                                <span>Read: {new Date(notification.readAt).toLocaleString()}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {notification.status !== 'read' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose New Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select 
                    value={newNotification.type} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="in-app">In-App</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select 
                    value={newNotification.category} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Order</SelectItem>
                      <SelectItem value="delivery">Delivery</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="promotion">Promotion</SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <Select 
                    value={newNotification.priority} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Recipients</label>
                  <Select 
                    value={newNotification.recipients} 
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipients: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="customers">All Customers</SelectItem>
                      <SelectItem value="drivers">All Drivers</SelectItem>
                      <SelectItem value="merchants">All Merchants</SelectItem>
                      <SelectItem value="admins">All Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message..."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    sendNotification({
                      type: newNotification.type as any,
                      category: newNotification.category as any,
                      title: newNotification.title,
                      message: newNotification.message,
                      priority: newNotification.priority as any,
                      recipient: {
                        id: 'all',
                        name: newNotification.recipients,
                        role: 'customer',
                        contact: ''
                      }
                    });
                    setNewNotification({
                      type: 'push',
                      category: 'system',
                      title: '',
                      message: '',
                      priority: 'medium',
                      recipients: 'all'
                    });
                  }}
                  disabled={!newNotification.title || !newNotification.message}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Notification
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={template.enabled}
                        onCheckedChange={(enabled) => {
                          setTemplates(prev => prev.map(t => 
                            t.id === template.id ? { ...t, enabled } : t
                          ));
                        }}
                      />
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{template.category}</Badge>
                          {template.channels.map(channel => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Push Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Enable Push Notifications</label>
                  <Switch
                    checked={settings.push.enabled}
                    onCheckedChange={(enabled) => 
                      setSettings(prev => ({ ...prev, push: { ...prev.push, enabled } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Show Badge</label>
                  <Switch
                    checked={settings.push.showBadge}
                    onCheckedChange={(showBadge) => 
                      setSettings(prev => ({ ...prev, push: { ...prev.push, showBadge } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Play Sound</label>
                  <Switch
                    checked={settings.push.playSound}
                    onCheckedChange={(playSound) => 
                      setSettings(prev => ({ ...prev, push: { ...prev.push, playSound } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Vibrate</label>
                  <Switch
                    checked={settings.push.vibrate}
                    onCheckedChange={(vibrate) => 
                      setSettings(prev => ({ ...prev, push: { ...prev.push, vibrate } }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Enable Email</label>
                  <Switch
                    checked={settings.email.enabled}
                    onCheckedChange={(enabled) => 
                      setSettings(prev => ({ ...prev, email: { ...prev.email, enabled } }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Email</label>
                  <Input
                    value={settings.email.fromEmail}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, email: { ...prev.email, fromEmail: e.target.value } }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Name</label>
                  <Input
                    value={settings.email.fromName}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, email: { ...prev.email, fromName: e.target.value } }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Enable SMS</label>
                  <Switch
                    checked={settings.sms.enabled}
                    onCheckedChange={(enabled) => 
                      setSettings(prev => ({ ...prev, sms: { ...prev.sms, enabled } }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">From Number</label>
                  <Input
                    value={settings.sms.fromNumber}
                    onChange={(e) => 
                      setSettings(prev => ({ ...prev, sms: { ...prev.sms, fromNumber: e.target.value } }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  In-App Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Enable In-App</label>
                  <Switch
                    checked={settings.inApp.enabled}
                    onCheckedChange={(enabled) => 
                      setSettings(prev => ({ ...prev, inApp: { ...prev.inApp, enabled } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Show Toast</label>
                  <Switch
                    checked={settings.inApp.showToast}
                    onCheckedChange={(showToast) => 
                      setSettings(prev => ({ ...prev, inApp: { ...prev.inApp, showToast } }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="font-medium">Auto Mark Read</label>
                  <Switch
                    checked={settings.inApp.autoMarkRead}
                    onCheckedChange={(autoMarkRead) => 
                      setSettings(prev => ({ ...prev, inApp: { ...prev.inApp, autoMarkRead } }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationSystem; 