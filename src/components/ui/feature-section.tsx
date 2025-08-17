import React from 'react';
import { Truck, ShoppingBag, Store, Clock, Zap, Shield, Heart, TrendingUp } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, gradient, delay }) => {
  return (
    <div className={`group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-3 ${delay}`}>
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
      
      {/* Floating icon */}
      <div className="relative z-10">
        <div className={`inline-flex p-4 rounded-2xl ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-500 mb-6`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
          {description}
        </p>
      </div>

      {/* Hover effect decoration */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-white" />,
      title: "Lightning Fast",
      description: "Get auto parts and hardware delivered in as little as 30 minutes. Our network of local drivers ensures the fastest possible delivery times.",
      gradient: "bg-gradient-to-br from-yellow-400 to-orange-500",
      delay: "animate-fade-in-up"
    },
    {
      icon: <ShoppingBag className="h-8 w-8 text-white" />,
      title: "Simple Ordering",
      description: "Browse thousands of products from local stores with our intuitive interface. Add to cart, checkout, and track - it's that easy.",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500",
      delay: "animate-fade-in-up animation-delay-200"
    },
    {
      icon: <Store className="h-8 w-8 text-white" />,
      title: "Trusted Partners",
      description: "Shop from your favorite local stores including AutoZone, O'Reilly Auto Parts, Home Depot, Lowe's, and many more.",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500",
      delay: "animate-fade-in-up animation-delay-400"
    },
    {
      icon: <Clock className="h-8 w-8 text-white" />,
      title: "Real-time Tracking",
      description: "Watch your order every step of the way with live GPS tracking. Know exactly when your parts will arrive.",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500",
      delay: "animate-fade-in-up animation-delay-600"
    },
    {
      icon: <Shield className="h-8 w-8 text-white" />,
      title: "Secure & Safe",
      description: "Your orders are protected with insurance and secure payment processing. Peace of mind with every delivery.",
      gradient: "bg-gradient-to-br from-red-500 to-rose-500",
      delay: "animate-fade-in-up animation-delay-800"
    },
    {
      icon: <Heart className="h-8 w-8 text-white" />,
      title: "Customer First",
      description: "24/7 customer support and satisfaction guarantee. We're here to help you get the parts you need, when you need them.",
      gradient: "bg-gradient-to-br from-pink-500 to-purple-500",
      delay: "animate-fade-in-up animation-delay-1000"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      title: "Growing Network",
      description: "Join thousands of satisfied customers across Louisville and expanding to new cities every month.",
      gradient: "bg-gradient-to-br from-indigo-500 to-blue-500",
      delay: "animate-fade-in-up animation-delay-1200"
    },
    {
      icon: <Truck className="h-8 w-8 text-white" />,
      title: "Professional Drivers",
      description: "Background-checked, insured drivers who care about your parts as much as you do. Reliable service every time.",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      delay: "animate-fade-in-up animation-delay-1400"
    }
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-orange-300 rounded-full blur-2xl"></div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg">
            <span className="font-semibold">Why Choose MyPartsRunner™</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent max-w-4xl">
            The Complete Solution for Auto Parts & Hardware Delivery
          </h2>
          
          <p className="max-w-3xl text-xl text-gray-600 leading-relaxed">
            We've revolutionized how you get the parts you need. Fast, reliable, and convenient - 
            experience the future of auto parts and hardware delivery.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-2xl shadow-xl p-6">
            <div className="flex -space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-4 border-white"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full border-4 border-white"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full border-4 border-white"></div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-white font-bold text-sm">5K+</span>
              </div>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Join 5,000+ happy customers</p>
              <p className="text-gray-600">Rated 4.9/5 stars across all platforms</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FeatureSection };
