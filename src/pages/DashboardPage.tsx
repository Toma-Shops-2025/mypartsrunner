import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAppContext();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>
              Please log in to access your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.firstName || user.name}!</h1>
          <p className="text-gray-500">Your MyPartsRunner™ Dashboard</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {user.role === 'customer' && (
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          )}
          {user.role === 'driver' && (
            <TabsTrigger value="deliveries">My Deliveries</TabsTrigger>
          )}
          {user.role === 'merchant' && (
            <TabsTrigger value="products">My Products</TabsTrigger>
          )}
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Overview</CardTitle>
              <CardDescription>
                You are logged in as a {user.role}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Welcome to your MyPartsRunner™ dashboard. This is where you can manage all your activities.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Account</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                  </CardContent>
                </Card>
                
                {user.role === 'customer' && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" onClick={() => navigate('/browse')}>
                        Browse Stores
                      </Button>
                      <Button className="w-full" variant="outline" onClick={() => navigate('/wishlist')}>
                        View Wishlist
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {user.role === 'driver' && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Driver Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">You're currently <span className="text-red-500 font-bold">Offline</span></p>
                      <Button className="w-full">
                        Go Online
                      </Button>
                    </CardContent>
                  </Card>
                )}
                
                {user.role === 'merchant' && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Store Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button className="w-full" onClick={() => navigate('/add-product')}>
                        Add New Product
                      </Button>
                      <Button className="w-full" variant="outline" onClick={() => navigate('/store-settings')}>
                        Store Settings
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Profile management features will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {user.role === 'customer' && (
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>
                  Track and manage your orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>You don't have any orders yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {user.role === 'driver' && (
          <TabsContent value="deliveries">
            <Card>
              <CardHeader>
                <CardTitle>Your Deliveries</CardTitle>
                <CardDescription>
                  Track and manage your deliveries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>You don't have any active deliveries.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        {user.role === 'merchant' && (
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Your Products</CardTitle>
                <CardDescription>
                  Manage your product listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>You don't have any products listed yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardPage;