import React from 'react';
import { Link } from 'react-router-dom';

const AdPricing = () => (
  <div className="grid md:grid-cols-3 gap-8 mt-12">
    {[
      {
        name: 'Basic',
        price: '299',
        duration: '30 days',
        features: [
          'Single video feed placement',
          'Basic analytics',
          'Standard support',
          'Monthly performance report'
        ]
      },
      {
        name: 'Premium',
        price: '799',
        duration: '30 days',
        featured: true,
        features: [
          'Multiple premium placements',
          'Advanced analytics dashboard',
          'Priority support',
          'Weekly performance reports',
          'A/B testing capability',
          'Custom ad scheduling'
        ]
      },
      {
        name: 'Enterprise',
        price: 'Custom',
        duration: 'Flexible',
        features: [
          'Custom placement strategy',
          'Real-time analytics',
          'Dedicated account manager',
          'Daily performance insights',
          'API access',
          'Custom integration options'
        ]
      }
    ].map((plan) => (
      <div 
        key={plan.name}
        className={`rounded-lg p-8 ${
          plan.featured 
            ? 'bg-blue-50 border-2 border-blue-500 relative' 
            : 'bg-white border border-gray-200'
        }`}
      >
        {plan.featured && (
          <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
            Most Popular
          </span>
        )}
        <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
          <span className="ml-2 text-gray-500">/{plan.duration}</span>
        </div>
        <ul className="mt-6 space-y-4">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        <button className={`mt-8 w-full py-3 px-6 rounded-md text-center font-medium ${
          plan.featured
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-800 text-white hover:bg-gray-900'
        }`}>
          Get Started
        </button>
      </div>
    ))}
  </div>
);

const Advertise: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Advertise on TomaShops
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Reach millions of engaged shoppers through our video-first marketplace. 
          Place your ads where they matter most.
        </p>
      </div>

      <div className="mt-16 grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Premium Placement',
            description: 'Your ads appear in high-visibility locations throughout our video marketplace.',
            icon: '🎯'
          },
          {
            title: 'Video-First Audience',
            description: 'Connect with shoppers who are actively engaged with video content.',
            icon: '📱'
          },
          {
            title: 'Performance Analytics',
            description: 'Get detailed insights into your ad performance and ROI.',
            icon: '📊'
          }
        ].map((feature) => (
          <div key={feature.title} className="text-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <AdPricing />

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-600 mb-6">
          Contact our advertising team to discuss your needs and get a customized advertising solution.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600">
            Contact Sales
          </button>
          <Link 
            to="/advertising-guidelines" 
            className="text-blue-500 hover:text-blue-700 px-6 py-3 font-medium"
          >
            View Advertising Guidelines
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Advertise; 