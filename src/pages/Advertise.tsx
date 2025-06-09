import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';

const Advertise: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advertise on TomaShops</h1>
          <p className="text-lg text-gray-600">
            Reach thousands of engaged shoppers and sellers in our vibrant marketplace
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Ad Spaces Available</h2>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Hero Section</h3>
                  <p className="text-gray-600">Prime visibility at the top of our homepage</p>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Maximum exposure</li>
                    <li>Above the fold placement</li>
                    <li>Slot ID: 1111111111</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Featured Listings</h3>
                  <p className="text-gray-600">Alongside our most popular products</p>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>High engagement area</li>
                    <li>Targeted audience</li>
                    <li>Slot ID: 2222222222</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Advertise with Us?</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Targeted Reach</h3>
                <p className="text-gray-600">Connect with buyers actively looking for products like yours</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Premium Placement</h3>
                <p className="text-gray-600">Strategic ad positions throughout the marketplace</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-2">Flexible Options</h3>
                <p className="text-gray-600">Choose from various ad spaces to fit your budget</p>
              </div>
            </div>
          </section>

          <section className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              Contact us to discuss advertising opportunities and pricing
            </p>
            <Button
              onClick={() => window.location.href = 'mailto:ads@tomashops.com'}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Contact Advertising Team
            </Button>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Advertise; 