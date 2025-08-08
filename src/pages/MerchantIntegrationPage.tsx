import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AppContext';
import MerchantIntegration from '@/components/MerchantIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, Code, Settings, Zap } from 'lucide-react';

export default function MerchantIntegrationPage() {
  const { user, isAuthenticated } = useAuth();
  const [stores, setStores] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStore, setActiveStore] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'merchant') {
      loadMerchantData();
    }
  }, [isAuthenticated, user]);

  const loadMerchantData = async () => {
    try {
      // Load stores
      const { data: storesData } = await supabase
        .from('stores')
        .select('*')
        .eq('merchantId', user.id)
        .eq('isActive', true);

      setStores(storesData || []);
      
      if (storesData && storesData.length > 0) {
        setActiveStore(storesData[0]);
      }

      // Load integrations
      const { data: integrationsData } = await supabase
        .from('merchant_integrations')
        .select('*')
        .eq('merchantId', user.id);

      setIntegrations(integrationsData || []);
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            Please log in to access merchant integrations.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (user?.role !== 'merchant') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            This page is only available for merchants.
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
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  if (!stores.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert>
          <AlertDescription>
            You need to create a store first before setting up integrations.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Website Integration</h1>
        <p className="text-muted-foreground">
          Integrate MyPartsRunner delivery into your website
        </p>
      </div>

      {/* Store Selection */}
      {stores.length > 1 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Store</CardTitle>
            <CardDescription>
              Choose which store to configure integrations for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((store) => (
                <Card
                  key={store.id}
                  className={`cursor-pointer transition-all ${
                    activeStore?.id === store.id
                      ? 'ring-2 ring-primary'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveStore(store)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{store.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {store.storeType} • {store.city}, {store.state}
                        </p>
                      </div>
                      {activeStore?.id === store.id && (
                        <Badge variant="secondary">Active</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeStore && (
        <Tabs defaultValue="widget" className="space-y-6">
          <TabsList>
            <TabsTrigger value="widget" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Widget
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="widget">
            <MerchantIntegration
              merchantId={user.id}
              storeId={activeStore.id}
            />
          </TabsContent>

          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Use our REST API to integrate delivery functionality into your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">API Endpoints</h3>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded">
                        <code className="text-sm">
                          POST /api/external-orders
                        </code>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <code className="text-sm">
                          GET /api/stores/{activeStore.id}/orders
                        </code>
                      </div>
                      <div className="bg-muted p-3 rounded">
                        <code className="text-sm">
                          GET /api/stores/{activeStore.id}/analytics
                        </code>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use your API key in the Authorization header
                    </p>
                    <div className="bg-muted p-3 rounded">
                      <code className="text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </code>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Example Request</h3>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`curl -X POST https://mypartsrunner.com/api/external-orders \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "storeId": "${activeStore.id}",
    "externalOrderId": "ORDER_123",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "502-555-0123",
    "deliveryAddress": "123 Main St",
    "deliveryCity": "Louisville",
    "deliveryState": "KY",
    "deliveryZipCode": "40202",
    "items": [
      {
        "name": "Oil Filter",
        "quantity": 2,
        "price": 12.99
      }
    ],
    "subtotal": 25.98,
    "tax": 2.08,
    "deliveryFee": 5.99,
    "total": 34.05
  }'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>
                  Configure your delivery integration preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Default Delivery Fee
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        defaultValue="5.99"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Minimum Order Amount
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        defaultValue="0"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Delivery Areas
                    </label>
                    <textarea
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Enter delivery areas (e.g., Louisville, KY - 50 mile radius)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Business Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Open Time
                        </label>
                        <input
                          type="time"
                          className="w-full p-2 border rounded"
                          defaultValue="08:00"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Close Time
                        </label>
                        <input
                          type="time"
                          className="w-full p-2 border rounded"
                          defaultValue="18:00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Integration Analytics</CardTitle>
                <CardDescription>
                  Track the performance of your delivery integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-sm text-muted-foreground">
                      External Orders This Month
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">$1,247</div>
                    <div className="text-sm text-muted-foreground">
                      Revenue from External Orders
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">89%</div>
                    <div className="text-sm text-muted-foreground">
                      Conversion Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
} 