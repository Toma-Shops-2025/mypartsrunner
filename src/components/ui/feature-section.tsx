import React from 'react';
import { Truck, ShoppingBag, Store, Clock } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-4">
      <div className="rounded-full bg-primary/10 p-4 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: "Fast Delivery",
      description: "Get auto parts and hardware delivered quickly to your location."
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
      title: "Easy Ordering",
      description: "Browse and order from local stores with just a few clicks."
    },
    {
      icon: <Store className="h-6 w-6 text-primary" />,
      title: "Local Stores",
      description: "Connect with AutoZone, O'Reilly, Home Depot, and more."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Real-time Tracking",
      description: "Track your delivery in real-time from store to your door."
    }
  ];

  return (
    <section className="w-full py-12 bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How MyPartsRunner™ Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We connect you with local auto parts and hardware stores for fast, reliable delivery.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { FeatureSection };
