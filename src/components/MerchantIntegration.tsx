import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink, Code, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface MerchantIntegrationProps {
  merchantId?: string;
  storeId?: string;
}

export default function MerchantIntegration({ merchantId, storeId }: MerchantIntegrationProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'widget' | 'api' | 'settings'>('widget');

  const widgetCode = `
<!-- MyPartsRunner Delivery Widget -->
<div id="mypartsrunner-widget" data-store-id="${storeId || 'YOUR_STORE_ID'}"></div>
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://mypartsrunner.com/widget.js';
  script.async = true;
  document.head.appendChild(script);
  
  script.onload = function() {
    window.MyPartsRunner.init({
      storeId: '${storeId || 'YOUR_STORE_ID'}',
      theme: 'light',
      position: 'bottom-right'
    });
  };
})();
</script>`;

  const apiExample = `
// Example API call to create external order
const createExternalOrder = async (orderData) => {
  const response = await fetch('https://mypartsrunner.com/api/external-orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      storeId: '${storeId || 'YOUR_STORE_ID'}',
      externalOrderId: 'ORDER_123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '502-555-0123',
      deliveryAddress: '123 Main St',
      deliveryCity: 'Louisville',
      deliveryState: 'KY',
      deliveryZipCode: '40202',
      items: [
        {
          name: 'Oil Filter',
          quantity: 2,
          price: 12.99
        }
      ],
      subtotal: 25.98,
      tax: 2.08,
      deliveryFee: 5.99,
      total: 34.05
    })
  });
  
  return response.json();
};`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Website Integration</h2>
          <p className="text-muted-foreground">
            Integrate MyPartsRunner delivery into your website
          </p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Active
        </Badge>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === 'widget' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('widget')}
          className="flex items-center gap-2"
        >
          <Code className="h-4 w-4" />
          Widget
        </Button>
        <Button
          variant={activeTab === 'api' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('api')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          API
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Widget Tab */}
      {activeTab === 'widget' && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery Widget</CardTitle>
            <CardDescription>
              Add a "GET IT DELIVERED" button to your website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Widget Code</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(widgetCode)}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                <code>{widgetCode}</code>
              </pre>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Widget Position</Label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>
              <div>
                <Label>Theme</Label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Tab */}
      {activeTab === 'api' && (
        <Card>
          <CardHeader>
            <CardTitle>API Integration</CardTitle>
            <CardDescription>
              Use our API to create delivery orders programmatically
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">API Key</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('sk_test_1234567890abcdef')}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Key'}
                </Button>
              </div>
              <Input
                value="sk_test_1234567890abcdef"
                readOnly
                className="font-mono text-sm"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Example Code</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(apiExample)}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
              <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
                <code>{apiExample}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
            <CardDescription>
              Configure your delivery integration preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website-url">Website URL</Label>
                <Input
                  id="website-url"
                  placeholder="https://yourstore.com"
                  defaultValue="https://yourstore.com"
                />
              </div>
              <div>
                <Label htmlFor="webhook-url">Webhook URL (Optional)</Label>
                <Input
                  id="webhook-url"
                  placeholder="https://yourstore.com/webhooks/delivery"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="delivery-notes">Default Delivery Notes</Label>
              <Textarea
                id="delivery-notes"
                placeholder="Enter default delivery instructions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Integration Features</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auto-delivery" defaultChecked />
                  <Label htmlFor="auto-delivery">Auto-create delivery orders</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="email-notifications" defaultChecked />
                  <Label htmlFor="email-notifications">Email notifications</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="tracking-updates" defaultChecked />
                  <Label htmlFor="tracking-updates">Real-time tracking updates</Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            See how the delivery button will appear on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Sample Product</h3>
                <p className="text-sm text-muted-foreground">Oil Filter - $12.99</p>
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <ExternalLink className="h-4 w-4 mr-2" />
                GET IT DELIVERED
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 