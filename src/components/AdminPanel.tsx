import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trash2, Star, StarOff, Users, ShoppingBag, Settings, Shield,
  BarChart2, AlertTriangle, DollarSign, Bell, Flag, Image
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { getAdAnalytics } from '@/lib/ad-analytics';

// Interfaces
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  featured: boolean;
  image_url?: string;
  seller_id: string;
  reported?: boolean;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  banned: boolean;
  role: string;
  total_sales?: number;
  total_purchases?: number;
}

interface Order {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  amount: number;
  created_at: string;
  disputed: boolean;
}

interface Report {
  id: string;
  type: 'user' | 'product';
  reported_id: string;
  reporter_id: string;
  reason: string;
  status: 'pending' | 'resolved';
  created_at: string;
}

interface Analytics {
  totalSales: number;
  activeListings: number;
  totalUsers: number;
  monthlyRevenue: number;
  disputeRate: number;
}

interface Advertisement {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
  start_date: string;
  end_date: string;
  advertiser_id: string;
  created_at: string;
  total_price: number;
}

interface AdStats {
  views: number;
  clicks: number;
  ctr: number;
}

interface AdWithStats extends Advertisement {
  stats?: AdStats;
}

export const AdminPanel: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSales: 0,
    activeListings: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    disputeRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [advertisements, setAdvertisements] = useState<AdWithStats[]>([]);
  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchUsers(),
        fetchOrders(),
        fetchReports(),
        fetchAnalytics(),
        fetchAdvertisements()
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Data fetching functions
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch orders',
        variant: 'destructive',
      });
    }
  };

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reports',
        variant: 'destructive',
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      // In a real application, you might want to calculate these on the backend
      const analytics = {
        totalSales: orders.length,
        activeListings: products.length,
        totalUsers: users.length,
        monthlyRevenue: orders.reduce((sum, order) => sum + order.amount, 0),
        disputeRate: orders.length ? (orders.filter(o => o.disputed).length / orders.length) * 100 : 0
      };
      setAnalytics(analytics);
    } catch (error) {
      console.error('Error calculating analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to calculate analytics',
        variant: 'destructive',
      });
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch stats for each ad
      const adsWithStats = await Promise.all(
        (data || []).map(async (ad) => {
          const stats = await getAdAnalytics(ad.id);
          return { ...ad, stats };
        })
      );

      setAdvertisements(adsWithStats);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch advertisements',
        variant: 'destructive',
      });
    }
  };

  // Action handlers
  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ featured: !currentFeatured })
        .eq('id', productId);

      if (error) throw error;

      setProducts(products.map(p => 
        p.id === productId ? { ...p, featured: !currentFeatured } : p
      ));
      
      toast({
        title: 'Success',
        description: `Product ${!currentFeatured ? 'featured' : 'unfeatured'} successfully`,
      });
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update featured status',
        variant: 'destructive',
      });
    }
  };

  const toggleUserBan = async (userId: string, currentBanned: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ banned: !currentBanned })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(u => 
        u.id === userId ? { ...u, banned: !currentBanned } : u
      ));

      toast({
        title: 'Success',
        description: `User ${!currentBanned ? 'banned' : 'unbanned'} successfully`,
      });
    } catch (error) {
      console.error('Error updating user ban status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user ban status',
        variant: 'destructive',
      });
    }
  };

  const resolveReport = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status: 'resolved' })
        .eq('id', reportId);

      if (error) throw error;

      setReports(reports.map(r => 
        r.id === reportId ? { ...r, status: 'resolved' } : r
      ));

      toast({
        title: 'Success',
        description: 'Report resolved successfully',
      });
    } catch (error) {
      console.error('Error resolving report:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve report',
        variant: 'destructive',
      });
    }
  };

  const handleDispute = async (orderId: string, resolution: 'refund' | 'deny') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: resolution === 'refund' ? 'refunded' : 'dispute_denied',
          disputed: false
        })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => 
        o.id === orderId ? { 
          ...o, 
          status: resolution === 'refund' ? 'refunded' : 'dispute_denied',
          disputed: false
        } : o
      ));

      toast({
        title: 'Success',
        description: `Dispute ${resolution === 'refund' ? 'refunded' : 'denied'} successfully`,
      });
    } catch (error) {
      console.error('Error handling dispute:', error);
      toast({
        title: 'Error',
        description: 'Failed to handle dispute',
        variant: 'destructive',
      });
    }
  };

  const handleAdStatus = async (adId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('ads')
        .update({ status })
        .eq('id', adId);

      if (error) throw error;

      setAdvertisements(advertisements.map(ad => 
        ad.id === adId ? { ...ad, status } : ad
      ));

      toast({
        title: 'Success',
        description: `Advertisement ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating ad status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update advertisement status',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchInitialData}>Refresh Data</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 gap-4 mb-6">
          <TabsTrigger value="dashboard">
            <BarChart2 className="w-4 h-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="products">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="w-4 h-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="orders">
            <DollarSign className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Flag className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="ads">
            <Image className="w-4 h-4 mr-2" />
            Ads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalSales}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeListings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${analytics.monthlyRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Add charts and graphs here */}
        </TabsContent>

        <TabsContent value="products">
          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {product.image_url && (
                      <img 
                        src={product.image_url} 
                        alt={product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{product.title}</h3>
                      <p className="text-sm text-gray-600">${product.price}</p>
                      <Badge variant="outline">{product.category}</Badge>
                      {product.featured && (
                        <Badge className="ml-2" variant="default">Featured</Badge>
                      )}
                      {product.reported && (
                        <Badge className="ml-2" variant="destructive">Reported</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant={product.featured ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleFeatured(product.id, product.featured)}
                    >
                      {product.featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      {product.featured ? 'Unfeature' : 'Feature'}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProduct(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid gap-4">
            {users.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{user.email}</h3>
                    <p className="text-sm text-gray-600">
                      Joined: {new Date(user.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{user.role}</Badge>
                      {user.banned && (
                        <Badge variant="destructive">Banned</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant={user.banned ? "default" : "destructive"}
                      size="sm"
                      onClick={() => toggleUserBan(user.id, user.banned)}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {user.banned ? 'Unban' : 'Ban'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      Amount: ${order.amount}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{order.status}</Badge>
                      {order.disputed && (
                        <Badge variant="destructive">Disputed</Badge>
                      )}
                    </div>
                  </div>
                  
                  {order.disputed && (
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleDispute(order.id, 'refund')}
                      >
                        Refund
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDispute(order.id, 'deny')}
                      >
                        Deny
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {report.type === 'user' ? 'User Report' : 'Product Report'}
                    </h3>
                    <p className="text-sm text-gray-600">{report.reason}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant={report.status === 'pending' ? "destructive" : "default"}>
                        {report.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {report.status === 'pending' && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => resolveReport(report.id)}
                    >
                      Resolve
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Commission Settings</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      className="border rounded p-2"
                      placeholder="Commission %"
                      min="0"
                      max="100"
                    />
                    <Button>Update</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Featured Listings</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      className="border rounded p-2"
                      placeholder="Max featured listings"
                      min="1"
                    />
                    <Button>Update</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Category Management</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="text"
                      className="border rounded p-2"
                      placeholder="New category name"
                    />
                    <Button>Add Category</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Platform Announcement</h3>
                  <div className="space-y-2">
                    <textarea
                      className="border rounded p-2 w-full"
                      placeholder="Enter announcement message"
                      rows={3}
                    />
                    <Button>Post Announcement</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads">
          <div className="grid gap-4">
            {advertisements.map((ad) => (
              <Card key={ad.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {ad.image_url && (
                      <img 
                        src={ad.image_url} 
                        alt={ad.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{ad.title}</h3>
                      <p className="text-sm text-gray-600">{ad.description}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{ad.location}</Badge>
                        <Badge 
                          variant={
                            ad.status === 'pending' ? 'secondary' :
                            ad.status === 'approved' ? 'default' : 'destructive'
                          }
                        >
                          {ad.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Views: {ad.stats?.views || 0}</span>
                        <span>Clicks: {ad.stats?.clicks || 0}</span>
                        <span>CTR: {((ad.stats?.ctr || 0) * 100).toFixed(2)}%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(ad.start_date).toLocaleDateString()} - {new Date(ad.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-medium mt-1">
                        Total Price: ${ad.total_price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  {ad.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAdStatus(ad.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAdStatus(ad.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}

            {advertisements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No advertisement submissions yet
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};