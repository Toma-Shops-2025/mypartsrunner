import React from 'react';
import AppLayout from '@/components/AppLayout';
import FAQSection from '@/components/FAQSection';
import StandardAd from '@/components/StandardAd';

const FAQ: React.FC = () => {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about TomaShops™ Video 1st Marketplace.
          </p>
        </div>
        
        <StandardAd slot="9999999999" className="mb-8" />
        
        <FAQSection />
        
        <StandardAd slot="1010101010" className="mt-8" />
      </div>
    </AppLayout>
  );
};

export default FAQ;