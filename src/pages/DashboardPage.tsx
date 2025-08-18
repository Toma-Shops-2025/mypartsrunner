import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/contexts/AppContext';
import DriverProfile from '@/components/DriverProfile';
import DriverDashboard from '@/components/DriverDashboard';
import CustomerProfile from '@/components/CustomerProfile';
import { DriverEarnings } from '@/components/DriverEarnings';
import { DriverAnalytics } from '@/components/DriverAnalytics';
import { DriverSafety } from '@/components/DriverSafety';
import { DriverTraining } from '@/components/DriverTraining';
import { DriverNotifications } from '@/components/DriverNotifications';
import { PayoutDashboard } from '@/components/PayoutDashboard';
import OrderManagement from '@/components/OrderManagement';
import { Driver } from '@/types';
import { toast } from '@/hooks/use-toast';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signOut, updateUserProfile } = useAppContext();
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleToggleDriverStatus = async () => {
    if (!user || user.role !== 'driver') return;
    
    setIsTogglingStatus(true);
    try {
      const newStatus = !user.isAvailable;
      await updateUserProfile({ isAvailable: newStatus });
      
      toast({
        title: newStatus ? "You're now Online!" : "You're now Offline",
        description: newStatus 
          ? "You're available to receive delivery requests" 
          : "You're not receiving delivery requests",
        variant: newStatus ? "default" : "secondary"
      });
    } catch (error) {
      toast({
        title: "Failed to update status",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsTogglingStatus(false);
    }
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
    <div className="min-h-screen animated-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="container mx-auto py-10 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              <span className="neon-text">Welcome,</span>{' '}
              <span className="gradient-text">{user.firstName || user.name}!</span>
            </h1>
            <p className="text-gray-300">Your MyPartsRunner™ Dashboard</p>
          </div>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
          >
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="glass-card mb-4 bg-transparent border border-cyan-400/30 p-1">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-purple-600 data-[state=active]:text-black text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Overview
            </TabsTrigger>
            {user.role === 'customer' && (
              <TabsTrigger 
                value="orders"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-purple-600 data-[state=active]:text-black text-gray-300 hover:text-cyan-400 transition-colors"
              >
                My Orders
              </TabsTrigger>
            )}
          {user.role === 'driver' && (
            <>
              <TabsTrigger value="deliveries">My Deliveries</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </>
          )}
          {user.role === 'merchant' && (
            <>
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="orders">Order Management</TabsTrigger>
            </>
          )}
          {(user.role === 'driver' || user.role === 'merchant') && (
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          )}
            <TabsTrigger 
              value="profile"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-400 data-[state=active]:to-purple-600 data-[state=active]:text-black text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Profile
            </TabsTrigger>
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
                  <DriverDashboard />
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
                      <Button className="w-full" variant="outline" onClick={() => navigate('/stripe-connect-test')}>
                        🏦 Test Stripe Connect
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          {user.role === 'driver' ? (
            <DriverProfile 
              driver={user as Driver}
              onUpdate={async (updates) => {
                // TODO: Implement profile update logic
                console.log('Profile updates:', updates);
              }}
            />
          ) : (
            <CustomerProfile 
              user={user}
              onUpdate={updateUserProfile}
            />
          )}
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
        
        {/* Add Order Management tab content for merchants */}
        {user.role === 'merchant' && (
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
        )}

        {/* Add Payouts tab content */}
        {(user.role === 'driver' || user.role === 'merchant') && (
          <TabsContent value="payouts">
            <PayoutDashboard />
          </TabsContent>
        )}

        {/* Driver-specific tabs */}
        {user.role === 'driver' && (
          <>
            <TabsContent value="deliveries">
              <Card>
                <CardHeader>
                  <CardTitle>My Deliveries</CardTitle>
                  <CardDescription>Track your current and completed deliveries</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Delivery tracking features will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings">
              <DriverEarnings 
                driver={user}
                onUpdatePaymentMethods={async (methods) => {
                  // TODO: Implement payment method updates
                  console.log('Payment methods:', methods);
                }}
              />
            </TabsContent>
            
            <TabsContent value="analytics">
              <DriverAnalytics 
                stats={{
                  totalEarnings: 1250.75,
                  totalDeliveries: 47,
                  averageRating: 4.8,
                  totalDistance: 125000,
                  totalTime: 2840,
                  weeklyGoal: 500,
                  weeklyProgress: 325,
                  topEarningDay: 'Friday',
                  topEarningAmount: 89.50
                }}
              />
            </TabsContent>
            
            <TabsContent value="safety">
              <DriverSafety 
                driver={user}
                onReportIncident={async (incident) => {
                  // TODO: Implement incident reporting
                  console.log('Incident report:', incident);
                }}
                onUpdateEmergencyContacts={async (contacts) => {
                  // TODO: Implement emergency contact updates
                  console.log('Emergency contacts:', contacts);
                }}
              />
            </TabsContent>
            
            <TabsContent value="training">
              <DriverTraining 
                driver={user}
                onCompleteModule={async (moduleId, score) => {
                  // TODO: Implement module completion
                  console.log('Module completed:', moduleId, score);
                }}
              />
            </TabsContent>
            
            <TabsContent value="notifications">
              <DriverNotifications 
                driver={user}
                onMarkAsRead={async (notificationId) => {
                  // TODO: Implement mark as read
                  console.log('Mark as read:', notificationId);
                }}
                onDeleteNotification={async (notificationId) => {
                  // TODO: Implement delete notification
                  console.log('Delete notification:', notificationId);
                }}
              />
            </TabsContent>
          </>
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