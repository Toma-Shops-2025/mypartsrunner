import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  Code, 
  Zap, 
  ShoppingCart, 
  Copy, 
  ExternalLink, 
  Settings, 
  Eye, 
  Download,
  Smartphone,
  Monitor,
  Tablet,
  Palette,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
  CreditCard,
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Layers,
  Link,
  Webhook,
  Database,
  Wifi,
  Customize
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface MerchantStore {
  id: string;
  name: string;
  website: string;
  description: string;
  category: string;
  address: string;
  phone: string;
  email: string;
}

interface IntegrationSettings {
  embeddedStore: {
    enabled: boolean;
    customDomain: string;
    theme: 'light' | 'dark' | 'auto';
    primaryColor: string;
    logoUrl: string;
    headerText: string;
    deliveryZone: number; // miles
    minimumOrder: number;
    estimatedDelivery: string;
  };
  deliveryWidget: {
    enabled: boolean;
    buttonText: string;
    buttonColor: string;
    position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    showEstimatedTime: boolean;
    showPricing: boolean;
    autoDetectProducts: boolean;
  };
  apiIntegration: {
    enabled: boolean;
    apiKey: string;
    webhookUrl: string;
    syncProducts: boolean;
    syncInventory: boolean;
    syncPricing: boolean;
  };
}

interface WidgetAnalytics {
  totalClicks: number;
  conversions: number;
  revenue: number;
  topProducts: { name: string; orders: number }[];
  trafficSources: { source: string; visits: number }[];
}

export default function MerchantIntegration() {
  const { user } = useAppContext();
  const [store, setStore] = useState<MerchantStore | null>(null);
  const [settings, setSettings] = useState<IntegrationSettings>({
    embeddedStore: {
      enabled: true,
      customDomain: '',
      theme: 'light',
      primaryColor: '#2563eb',
      logoUrl: '',
      headerText: 'Get Your Parts Delivered Fast!',
      deliveryZone: 15,
      minimumOrder: 25,
      estimatedDelivery: '1-2 hours'
    },
    deliveryWidget: {
      enabled: true,
      buttonText: 'DELIVER WITH MYPARTSRUNNER',
      buttonColor: '#2563eb',
      position: 'bottom-right',
      showEstimatedTime: true,
      showPricing: true,
      autoDetectProducts: true
    },
    apiIntegration: {
      enabled: false,
      apiKey: '',
      webhookUrl: '',
      syncProducts: true,
      syncInventory: true,
      syncPricing: true
    }
  });
  const [analytics, setAnalytics] = useState<WidgetAnalytics>({
    totalClicks: 1247,
    conversions: 89,
    revenue: 3456.78,
    topProducts: [
      { name: 'Brake Pads', orders: 23 },
      { name: 'Motor Oil', orders: 19 },
      { name: 'Air Filter', orders: 15 }
    ],
    trafficSources: [
      { source: 'Direct', visits: 456 },
      { source: 'Google', visits: 234 },
      { source: 'Social', visits: 123 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');

  useEffect(() => {
    loadMerchantStore();
    generateApiKey();
  }, [user]);

  const loadMerchantStore = async () => {
    // Mock store data - would fetch from database
    setStore({
      id: '1',
      name: 'AutoZone Store #1523',
      website: 'https://www.autozone.com/store/1523',
      description: 'Complete auto parts and accessories',
      category: 'Auto Parts',
      address: '123 Main St, Los Angeles, CA 90210',
      phone: '(555) 123-4567',
      email: 'store1523@autozone.com'
    });
  };

  const generateApiKey = () => {
    if (!settings.apiIntegration.apiKey) {
      const apiKey = 'mpr_' + Math.random().toString(36).substr(2, 24);
      setSettings(prev => ({
        ...prev,
        apiIntegration: { ...prev.apiIntegration, apiKey }
      }));
    }
  };

  const handleSettingChange = (section: keyof IntegrationSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied`,
      variant: "default"
    });
  };

  const generateEmbedCode = () => {
    const embedUrl = `https://mypartsrunner.com/embed/${store?.id}`;
    return `<iframe 
  src="${embedUrl}"
  width="100%" 
  height="600"
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>`;
  };

  const generateWidgetCode = () => {
    const config = {
      storeId: store?.id,
      buttonText: settings.deliveryWidget.buttonText,
      buttonColor: settings.deliveryWidget.buttonColor,
      position: settings.deliveryWidget.position,
      showEstimatedTime: settings.deliveryWidget.showEstimatedTime,
      showPricing: settings.deliveryWidget.showPricing,
      autoDetectProducts: settings.deliveryWidget.autoDetectProducts
    };

    return `<!-- MyPartsRunner Delivery Widget -->
<script>
  window.MyPartsRunnerConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://mypartsrunner.com/widget.js" async></script>`;
  };

  const previewUrl = store ? `https://mypartsrunner.com/stores/${store.id}` : '';

  if (!store) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Loading merchant store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🚀 Revolutionary Store Integration</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get your entire website embedded in MyPartsRunner AND add our delivery widget to your existing site. 
          No manual product entry required!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Widget Clicks</p>
                <p className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-green-600">{analytics.conversions}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">${analytics.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {((analytics.conversions / analytics.totalClicks) * 100).toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="setup">Store Setup</TabsTrigger>
          <TabsTrigger value="embedded">Embedded Store</TabsTrigger>
          <TabsTrigger value="widget">Delivery Widget</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Store Information
                </CardTitle>
                <CardDescription>Your store details on MyPartsRunner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Store Name</Label>
                  <Input value={store.name} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label>Website URL</Label>
                  <div className="flex gap-2">
                    <Input value={store.website} readOnly className="bg-gray-50" />
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Input value={store.category} readOnly className="bg-gray-50" />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input value={store.address} readOnly className="bg-gray-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Integration Status
                </CardTitle>
                <CardDescription>Current integration setup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Embedded Store</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Delivery Widget</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span>API Integration</span>
                  </div>
                  <Badge variant="secondary">Optional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Analytics Tracking</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="embedded">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Embedded Store Settings
                </CardTitle>
                <CardDescription>
                  Your entire website will appear inside MyPartsRunner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.embeddedStore.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingChange('embeddedStore', 'enabled', checked)
                    }
                  />
                  <Label>Enable Embedded Store</Label>
                </div>

                <div>
                  <Label>Custom Header Text</Label>
                  <Input
                    value={settings.embeddedStore.headerText}
                    onChange={(e) => 
                      handleSettingChange('embeddedStore', 'headerText', e.target.value)
                    }
                    placeholder="Get Your Parts Delivered Fast!"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Delivery Zone (miles)</Label>
                    <Input
                      type="number"
                      value={settings.embeddedStore.deliveryZone}
                      onChange={(e) => 
                        handleSettingChange('embeddedStore', 'deliveryZone', parseInt(e.target.value))
                      }
                    />
                  </div>
                  <div>
                    <Label>Minimum Order ($)</Label>
                    <Input
                      type="number"
                      value={settings.embeddedStore.minimumOrder}
                      onChange={(e) => 
                        handleSettingChange('embeddedStore', 'minimumOrder', parseFloat(e.target.value))
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Estimated Delivery Time</Label>
                  <Input
                    value={settings.embeddedStore.estimatedDelivery}
                    onChange={(e) => 
                      handleSettingChange('embeddedStore', 'estimatedDelivery', e.target.value)
                    }
                    placeholder="1-2 hours"
                  />
                </div>

                <div>
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.embeddedStore.primaryColor}
                      onChange={(e) => 
                        handleSettingChange('embeddedStore', 'primaryColor', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.embeddedStore.primaryColor}
                      onChange={(e) => 
                        handleSettingChange('embeddedStore', 'primaryColor', e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview & Implementation
                </CardTitle>
                <CardDescription>
                  See how your store looks and get embed code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <Globe className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-4">
                    Your store will appear here on MyPartsRunner
                  </p>
                  <Button variant="outline" className="mb-2">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Store
                  </Button>
                  <p className="text-xs text-gray-500">
                    Live at: mypartsrunner.com/stores/{store.id}
                  </p>
                </div>

                <div>
                  <Label>Your MyPartsRunner Store URL</Label>
                  <div className="flex gap-2">
                    <Input
                      value={previewUrl}
                      readOnly
                      className="bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(previewUrl, 'Store URL')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Embed Code (For Your Website)</Label>
                  <Textarea
                    value={generateEmbedCode()}
                    readOnly
                    className="bg-gray-50 text-xs font-mono"
                    rows={6}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => copyToClipboard(generateEmbedCode(), 'Embed Code')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Embed Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="widget">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Delivery Widget Settings
                </CardTitle>
                <CardDescription>
                  Add a "Deliver with MyPartsRunner" button to your existing website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.deliveryWidget.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingChange('deliveryWidget', 'enabled', checked)
                    }
                  />
                  <Label>Enable Delivery Widget</Label>
                </div>

                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={settings.deliveryWidget.buttonText}
                    onChange={(e) => 
                      handleSettingChange('deliveryWidget', 'buttonText', e.target.value)
                    }
                    placeholder="DELIVER WITH MYPARTSRUNNER"
                  />
                </div>

                <div>
                  <Label>Button Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.deliveryWidget.buttonColor}
                      onChange={(e) => 
                        handleSettingChange('deliveryWidget', 'buttonColor', e.target.value)
                      }
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.deliveryWidget.buttonColor}
                      onChange={(e) => 
                        handleSettingChange('deliveryWidget', 'buttonColor', e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Widget Position</Label>
                  <select
                    value={settings.deliveryWidget.position}
                    onChange={(e) => 
                      handleSettingChange('deliveryWidget', 'position', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.deliveryWidget.showEstimatedTime}
                      onCheckedChange={(checked) => 
                        handleSettingChange('deliveryWidget', 'showEstimatedTime', checked)
                      }
                    />
                    <Label>Show Estimated Delivery Time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.deliveryWidget.showPricing}
                      onCheckedChange={(checked) => 
                        handleSettingChange('deliveryWidget', 'showPricing', checked)
                      }
                    />
                    <Label>Show Delivery Pricing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.deliveryWidget.autoDetectProducts}
                      onCheckedChange={(checked) => 
                        handleSettingChange('deliveryWidget', 'autoDetectProducts', checked)
                      }
                    />
                    <Label>Auto-detect Products on Page</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Widget Implementation
                </CardTitle>
                <CardDescription>
                  Copy this code to your website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Widget Preview</span>
                  </div>
                  <div className="relative">
                    <div 
                      className="inline-block px-6 py-3 rounded-lg text-white font-medium cursor-pointer shadow-lg"
                      style={{ backgroundColor: settings.deliveryWidget.buttonColor }}
                    >
                      🚚 {settings.deliveryWidget.buttonText}
                    </div>
                    {settings.deliveryWidget.showEstimatedTime && (
                      <div className="text-xs text-gray-600 mt-1">
                        ⚡ Fast delivery in {settings.embeddedStore.estimatedDelivery}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Widget Code</Label>
                  <Textarea
                    value={generateWidgetCode()}
                    readOnly
                    className="bg-gray-50 text-xs font-mono"
                    rows={8}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => copyToClipboard(generateWidgetCode(), 'Widget Code')}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Widget Code
                  </Button>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Simply paste this code before the closing &lt;/body&gt; tag on your website. 
                    The widget will automatically appear and detect products on your pages!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  API Integration
                </CardTitle>
                <CardDescription>
                  Automatically sync products from your existing systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.apiIntegration.enabled}
                    onCheckedChange={(checked) => 
                      handleSettingChange('apiIntegration', 'enabled', checked)
                    }
                  />
                  <Label>Enable API Integration</Label>
                </div>

                <div>
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      value={settings.apiIntegration.apiKey}
                      readOnly
                      className="bg-gray-50 font-mono text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(settings.apiIntegration.apiKey, 'API Key')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Webhook URL (Optional)</Label>
                  <Input
                    value={settings.apiIntegration.webhookUrl}
                    onChange={(e) => 
                      handleSettingChange('apiIntegration', 'webhookUrl', e.target.value)
                    }
                    placeholder="https://your-site.com/webhooks/mypartsrunner"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sync Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.apiIntegration.syncProducts}
                      onCheckedChange={(checked) => 
                        handleSettingChange('apiIntegration', 'syncProducts', checked)
                      }
                    />
                    <Label>Sync Products</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.apiIntegration.syncInventory}
                      onCheckedChange={(checked) => 
                        handleSettingChange('apiIntegration', 'syncInventory', checked)
                      }
                    />
                    <Label>Sync Inventory Levels</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.apiIntegration.syncPricing}
                      onCheckedChange={(checked) => 
                        handleSettingChange('apiIntegration', 'syncPricing', checked)
                      }
                    />
                    <Label>Sync Pricing</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  API Documentation
                </CardTitle>
                <CardDescription>
                  Integration endpoints and examples
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Available Endpoints:</h4>
                  <div className="space-y-2 text-sm font-mono">
                    <div>GET /api/v1/products</div>
                    <div>POST /api/v1/products</div>
                    <div>PUT /api/v1/products/:id</div>
                    <div>POST /api/v1/sync/inventory</div>
                    <div>POST /api/v1/orders/webhook</div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Popular Integrations:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Shopify</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>WooCommerce</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Magento</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Custom APIs</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download API Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Widget Performance
                </CardTitle>
                <CardDescription>
                  How your delivery widget is performing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Clicks</span>
                    <span className="font-bold">{analytics.totalClicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversions</span>
                    <span className="font-bold text-green-600">{analytics.conversions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Conversion Rate</span>
                    <span className="font-bold text-blue-600">
                      {((analytics.conversions / analytics.totalClicks) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Revenue</span>
                    <span className="font-bold text-green-600">${analytics.revenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg Order Value</span>
                    <span className="font-bold">${(analytics.revenue / analytics.conversions).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Products
                </CardTitle>
                <CardDescription>
                  Most delivered products this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <span>{product.name}</span>
                      </div>
                      <Badge variant="secondary">{product.orders} orders</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>
                  Where your delivery requests come from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span>{source.source}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(source.visits / analytics.trafficSources[0].visits) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{source.visits}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Delivery Metrics
                </CardTitle>
                <CardDescription>
                  Average delivery performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Avg Delivery Time</span>
                    <span className="font-bold">1.3 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>On-Time Rate</span>
                    <span className="font-bold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-bold">4.8</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Repeat Customers</span>
                    <span className="font-bold text-blue-600">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 