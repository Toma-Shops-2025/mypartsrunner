import React from 'react';
import { Hero } from '@/components/ui/hero';
import { FeatureSection } from '@/components/ui/feature-section';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Truck, Store, ArrowRight, CheckCircle, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeatureSection />
      
      {/* User Roles Section - Redesigned */}
      <section className="w-full py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-1/3 w-24 h-24 bg-orange-300 rounded-full blur-2xl"></div>
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-lg">
              <span className="text-blue-600 font-semibold">Join the Revolution</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Choose Your Role, Start Earning
            </h2>
            <p className="max-w-3xl text-xl text-gray-600 leading-relaxed">
              Join thousands of satisfied customers, drivers, and merchants who trust MyPartsRunner™ for fast, reliable service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Customer Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-100 rounded-2xl group-hover:bg-blue-200 transition-colors">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">4.9/5 rating</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Customers</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Get auto parts and hardware supplies delivered fast. No more driving store to store - we bring everything to you.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Same-day delivery available</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Track your order in real-time</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Competitive prices guaranteed</span>
                  </div>
                </div>
                
                <Link to="/register?role=customer" className="block">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg group">
                    Start Shopping
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Driver Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-2 border-orange-200">
              <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-orange-100 rounded-2xl group-hover:bg-orange-200 transition-colors">
                    <Truck className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">$25+</div>
                    <span className="text-sm text-gray-500">per hour</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Drivers</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Earn great money delivering auto parts and hardware. Flexible schedule, instant payments, and growing demand.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Earn $20-$35+ per hour</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Weekly instant payouts</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Flexible schedule</span>
                  </div>
                </div>
                
                <Link to="/register?role=driver" className="block">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg group">
                    Start Driving
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Merchant Card */}
            <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="p-8 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-purple-100 rounded-2xl group-hover:bg-purple-200 transition-colors">
                    <Store className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">+40%</div>
                    <span className="text-sm text-gray-500">more sales</span>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Merchants</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Expand your reach and boost sales. List your store, manage inventory, and reach customers who need your products.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Reach new customers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Easy inventory management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600">Analytics & insights</span>
                  </div>
                </div>
                
                <Link to="/register?role=merchant" className="block">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg group">
                    List Your Store
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-20 text-center">
            <p className="text-gray-500 mb-8">Trusted by leading businesses in Louisville and surrounding areas</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold text-gray-700">AutoZone</div>
              <div className="text-2xl font-bold text-gray-700">O'Reilly's</div>
              <div className="text-2xl font-bold text-gray-700">Home Depot</div>
              <div className="text-2xl font-bold text-gray-700">Lowe's</div>
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
