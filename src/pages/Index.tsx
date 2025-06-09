import React from 'react';
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import RecentListings from '@/components/RecentListings';
import FeaturedListings from '@/components/FeaturedListings';
import HowItWorksSection from '@/components/HowItWorksSection';
import StandardAd from '@/components/StandardAd';

const Index: React.FC = () => {
  return (
    <AppLayout>
      <HeroSection />
      <StandardAd slot="1111111111" title="Sponsored" isCursorAd={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Recent Listings</h2>
          <RecentListings />
        </div>
        <StandardAd slot="2222222222" className="my-8" />
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Listings</h2>
          <FeaturedListings />
        </div>
        <HowItWorksSection />
        <FeatureSection />
        <StandardAd slot="3333333333" className="mt-8" />
      </div>
    </AppLayout>
  );
};

export default Index;