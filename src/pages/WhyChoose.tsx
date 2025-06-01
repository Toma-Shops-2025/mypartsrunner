import React from 'react';
import AppLayout from '@/components/AppLayout';
import WhyChooseSection from '@/components/WhyChooseSection';
import StandardAd from '@/components/StandardAd';

const WhyChoose: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Why Choose TomaShops™?</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what makes TomaShops™ the premier video-first marketplace for buyers and sellers worldwide.
          </p>
        </div>
        
        <StandardAd slot="7777777777" className="mb-8" />
        
        <WhyChooseSection />
        
        <StandardAd slot="8888888888" className="mt-8" />
      </div>
    </AppLayout>
  );
};

export default WhyChoose;