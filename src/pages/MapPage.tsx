import React from 'react';
import MapExample from '@/components/MapExample';
import DeliveryTracker from '@/components/DeliveryTracker';

const MapPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Location Services</h1>
      <p className="text-gray-600 mb-8">
        Find nearby auto parts stores, hardware suppliers, and track deliveries in real-time using our interactive map.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <MapExample />
        <DeliveryTracker />
      </div>
      
      <div className="mt-12 bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">How Our Map Services Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-card rounded-lg shadow">
            <div className="text-primary text-xl font-bold mb-2">1. Find Stores</div>
            <p>Locate nearby auto parts stores and hardware suppliers with real-time inventory information.</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow">
            <div className="text-primary text-xl font-bold mb-2">2. Track Orders</div>
            <p>Follow your order in real-time as our drivers pick up and deliver your parts.</p>
          </div>
          <div className="p-4 bg-card rounded-lg shadow">
            <div className="text-primary text-xl font-bold mb-2">3. Optimize Routes</div>
            <p>Our system calculates the fastest delivery routes to get your parts to you quickly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
