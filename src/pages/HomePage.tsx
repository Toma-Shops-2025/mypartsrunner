import React from 'react';
import { Hero } from '@/components/ui/hero';
import { FeatureSection } from '@/components/ui/feature-section';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeatureSection />
      
      {/* User Roles Section */}
      <section className="w-full py-12 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">Join MyPartsRunner™ Today</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed">
              Choose your role and become part of our growing community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Customer Card */}
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Customers</h3>
              <p className="text-gray-500 mb-4">Order auto parts and hardware supplies with fast delivery to your location.</p>
              <div className="mt-auto">
                <Link to="/register?role=customer">
                  <Button className="w-full">Sign Up as Customer</Button>
                </Link>
              </div>
            </div>
            
            {/* Driver Card */}
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Drivers</h3>
              <p className="text-gray-500 mb-4">Earn money delivering auto parts and hardware supplies in your area.</p>
              <div className="mt-auto">
                <Link to="/register?role=driver">
                  <Button className="w-full">Sign Up as Driver</Button>
                </Link>
              </div>
            </div>
            
            {/* Merchant Card */}
            <div className="flex flex-col p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Merchants</h3>
              <p className="text-gray-500 mb-4">List your auto parts or hardware store and reach more customers.</p>
              <div className="mt-auto">
                <Link to="/register?role=merchant">
                  <Button className="w-full">Sign Up as Merchant</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-12 bg-primary text-white">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started with MyPartsRunner™?</h2>
          <p className="max-w-[600px] mx-auto mb-6">Join our platform today and experience fast delivery of auto parts and hardware supplies.</p>
          <Link to="/register">
            <Button variant="secondary" size="lg">Sign Up Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
