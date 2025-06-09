import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CopyIcon, CheckIcon, Code2Icon, LayoutTemplateIcon, SmartphoneIcon } from 'lucide-react';

export function MerchantIntegration() {
  const [copiedWidget, setCopiedWidget] = useState(false);
  const [copiedAPI, setCopiedAPI] = useState(false);

  const copyToClipboard = (text: string, type: 'widget' | 'api') => {
    navigator.clipboard.writeText(text);
    if (type === 'widget') {
      setCopiedWidget(true);
      setTimeout(() => setCopiedWidget(false), 2000);
    } else {
      setCopiedAPI(true);
      setTimeout(() => setCopiedAPI(false), 2000);
    }
  };

  const navigateToSetup = () => {
    const setupTab = document.querySelector('[value="setup"]') as HTMLElement;
    setupTab?.click();
  };

  const merchantId = "DEMO_123"; // This would come from auth context in real app

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Integration Setup</h1>

      <Tabs defaultValue="choose" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="choose">Choose</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="test">Test</TabsTrigger>
        </TabsList>

        <TabsContent value="choose" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Choose Your Integration Method</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Widget Option */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <LayoutTemplateIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Simple Widget</h3>
                <p className="text-gray-600">
                  Add our delivery option to your website with a single line of code.
                  No technical expertise required.
                </p>
                <Button onClick={navigateToSetup}>
                  Choose Widget
                </Button>
              </div>
            </Card>

            {/* API Option */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Code2Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">API Integration</h3>
                <p className="text-gray-600">
                  Full control over the delivery experience with our REST API.
                  Perfect for custom implementations.
                </p>
                <Button onClick={navigateToSetup}>
                  Choose API
                </Button>
              </div>
            </Card>

            {/* Mobile App Option */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <SmartphoneIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Mobile App</h3>
                <p className="text-gray-600">
                  Manage deliveries directly from our mobile app.
                  No technical setup required.
                </p>
                <Button onClick={navigateToSetup}>
                  Choose App
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="setup" className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Integration Setup</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Widget Setup */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Widget Installation</h3>
              <p className="mb-4">Add this code to your website's checkout page:</p>
              <div className="relative">
                <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                  {`<script src="https://mypartsrunner.com/widget.js"
  data-merchant-id="${merchantId}"
  data-theme="light"
  data-position="checkout">
</script>`}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`<script src="https://mypartsrunner.com/widget.js" data-merchant-id="${merchantId}" data-theme="light" data-position="checkout"></script>`, 'widget')}
                >
                  {copiedWidget ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
            </Card>

            {/* API Setup */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">API Setup</h3>
              <p className="mb-4">Use this code to integrate with our API:</p>
              <div className="relative">
                <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                  {`// Initialize MyPartsRunner
const delivery = new MyPartsRunner({
  merchantId: '${merchantId}',
  apiKey: 'YOUR_API_KEY'
});

// Request delivery
const quote = await delivery.getQuote({
  pickup: storeAddress,
  dropoff: customerAddress,
  items: orderItems
});`}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`const delivery = new MyPartsRunner({
  merchantId: '${merchantId}',
  apiKey: 'YOUR_API_KEY'
});`, 'api')}
                >
                  {copiedAPI ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                </Button>
              </div>
            </Card>
          </div>

          <div className="bg-primary/5 p-6 rounded-lg mt-8">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="mb-4">Our integration team is here to help you get set up:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>Schedule a call with our integration specialist</li>
              <li>Check out our detailed documentation</li>
              <li>Join our developer community</li>
            </ul>
            <div className="mt-6 flex gap-4">
              <Button variant="outline">Schedule Call</Button>
              <Button variant="outline">View Docs</Button>
              <Button variant="outline">Join Community</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Test Your Integration</h2>
          
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Integration Status</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Test Orders</h3>
                <p className="text-gray-600 mb-4">
                  Send test orders to verify your integration is working correctly:
                </p>
                <div className="space-y-4">
                  <Button className="w-full sm:w-auto">Send Test Order</Button>
                  <Button variant="outline" className="w-full sm:w-auto">View Test History</Button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Webhook Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Order Updates</span>
                    <span className="text-green-600">✓ Working</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Status</span>
                    <span className="text-green-600">✓ Working</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Runner Location</span>
                    <span className="text-green-600">✓ Working</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 