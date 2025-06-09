import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function MerchantPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Grow Your Business with MyPartsRunner™
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Offer same-day delivery to your customers without the overhead. Easy setup, no upfront costs, and flexible integration options.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="mr-4">
            <Link to="/merchant/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/merchant/demo">Request Demo</Link>
          </Button>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors">
          <h3 className="text-xl font-semibold mb-3">No Upfront Costs</h3>
          <p className="text-gray-600">Pay only for completed deliveries. No monthly fees or commitments required.</p>
        </div>
        <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors">
          <h3 className="text-xl font-semibold mb-3">Easy Integration</h3>
          <p className="text-gray-600">Simple API or widget options to add delivery to your existing website or system.</p>
        </div>
        <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors">
          <h3 className="text-xl font-semibold mb-3">Expanded Reach</h3>
          <p className="text-gray-600">Serve customers beyond your usual delivery radius with our network of runners.</p>
        </div>
      </div>

      {/* Integration Options */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Integration Options</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-lg bg-gray-50">
            <h3 className="text-2xl font-semibold mb-4">Simple Widget</h3>
            <p className="mb-4">Add delivery to your website with one line of code:</p>
            <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
              {`<script src="https://mypartsrunner.com/widget.js" 
  data-merchant-id="YOUR_ID">
</script>`}
            </pre>
          </div>
          <div className="p-8 rounded-lg bg-gray-50">
            <h3 className="text-2xl font-semibold mb-4">API Integration</h3>
            <p className="mb-4">Full control with our REST API:</p>
            <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
              {`fetch('https://api.mypartsrunner.com/v1/delivery', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
  body: JSON.stringify({ order_id: '123', ... })
})`}
            </pre>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">1</div>
            <h3 className="font-semibold mb-2">Sign Up</h3>
            <p className="text-gray-600">Quick registration process with basic store details</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">2</div>
            <h3 className="font-semibold mb-2">Choose Integration</h3>
            <p className="text-gray-600">Select widget or API based on your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">3</div>
            <h3 className="font-semibold mb-2">Add Delivery</h3>
            <p className="text-gray-600">Implement delivery option on your platform</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4">4</div>
            <h3 className="font-semibold mb-2">Start Delivering</h3>
            <p className="text-gray-600">Begin offering same-day delivery to customers</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gray-50 p-12 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8">Join the growing network of merchants offering same-day delivery</p>
        <Button asChild size="lg" className="mr-4">
          <Link to="/merchant/signup">Sign Up Now</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/merchant/contact">Contact Sales</Link>
        </Button>
      </div>
    </div>
  );
} 