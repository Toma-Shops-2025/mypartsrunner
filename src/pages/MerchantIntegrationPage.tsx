import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import MerchantIntegration from '@/components/MerchantIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, Code, Settings, Zap, Store, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import StoreSetupForm from '@/components/StoreSetupForm';

export default function MerchantIntegrationPage() {
  const { user, isAuthenticated } = useAppContext();
  const [stores, setStores] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStore, setActiveStore] = useState(null);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'merchant') {
      loadMerchantData();
    }
  }, [isAuthenticated, user]);

  const loadMerchantData = async () => {
    try {
      // Load stores - use correct column name
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .eq('merchantid', user.id) // Use lowercase as per database schema
        .eq('isactive', true);

      if (storesError) {
        console.error('Error loading stores:', storesError);
      }

      setStores(storesData || []);
      
      if (storesData && storesData.length > 0) {
        setActiveStore(storesData[0]);
      } else {
        setShowSetup(true);
      }

      // Skip integrations table for now (may not exist)
      setIntegrations([]);
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (storeData) => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([{
          merchantid: user.id,
          name: storeData.name,
          description: storeData.description,
          storetype: storeData.storeType,
          address: storeData.address,
          city: storeData.city,
          state: storeData.state,
          zipcode: storeData.zipCode,
          phone: storeData.phone,
          email: storeData.email,
          isactive: true
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setStores([data]);
      setActiveStore(data);
      setShowSetup(false);
    } catch (error) {
      console.error('Error creating store:', error);
    }
  };

  if (!isAuthenticated || user?.role !== 'merchant') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to be logged in as a merchant to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading merchant data...</span>
        </div>
      </div>
    );
  }

  if (showSetup || stores.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Set Up Your Store
            </CardTitle>
            <CardDescription>
              Let's get your store set up on MyPartsRunner™
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreSetupForm onSubmit={handleCreateStore} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Merchant Integration</h1>
        <p className="text-gray-600 mt-2">
          Manage your store integrations and settings
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="payments">Payment Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.length}</div>
                <p className="text-xs text-muted-foreground">
                  Stores on MyPartsRunner™
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Setup Required</div>
                <p className="text-xs text-muted-foreground">
                  Complete Stripe verification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integration Status</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Ready</div>
                <p className="text-xs text-muted-foreground">
                  Store setup complete
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Setup Status</CardTitle>
              <CardDescription>
                Complete your payment setup to start receiving orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Stripe Connect Setup Required:</strong> We're waiting for Stripe platform verification to complete. 
                  Once approved, you'll be able to set up payment processing for your store.
                  <br /><br />
                  <strong>Current Status:</strong> Platform verification in progress
                  <br />
                  <strong>Next Steps:</strong> You'll receive an email when verification is complete
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  disabled
                  className="w-full"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Payment Setup (Available After Verification)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores">
          <Card>
            <CardHeader>
              <CardTitle>Your Stores</CardTitle>
              <CardDescription>
                Manage your store locations and details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stores.map((store) => (
                <div key={store.id} className="border rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {store.address}, {store.city}, {store.state} {store.zipcode}
                      </p>
                      <div className="mt-2">
                        <Badge variant={store.isactive ? "default" : "secondary"}>
                          {store.isactive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          {store.storetype === 'auto' ? 'Auto Parts' : 'Hardware'}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>
                Add and manage your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Product management coming soon!</p>
                <Button variant="outline" disabled>
                  Add Product
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                View and manage incoming orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No orders yet!</p>
                <p className="text-sm text-gray-400">Orders will appear here once customers start placing them.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Set up payment processing for your store
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Payment setup is currently unavailable while we complete Stripe platform verification. 
                  This process typically takes 1-2 business days.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 

// Store Setup Form Component
function StoreSetupForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    storeType: 'auto',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="My Auto Parts Store"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Store Type *
          </label>
          <select
            name="storeType"
            value={formData.storeType}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="auto">Auto Parts</option>
            <option value="hardware">Hardware</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Brief description of your store..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Los Angeles"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="90210"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 123-4567"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="store@example.com"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="px-6"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Store...
            </>
          ) : (
            <>
              <Store className="mr-2 h-4 w-4" />
              Create Store
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 