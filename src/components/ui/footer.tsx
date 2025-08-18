import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './badge';
import { Button } from './button';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Zap, 
  Star, 
  Shield, 
  Truck,
  Package,
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Browse Parts', href: '/browse' },
    { label: 'Help Center', href: '/help' },
    { label: 'Contact', href: '/contact' },
    { label: 'Safety Guide', href: '/safety-guide' }
  ];

  const businessLinks = [
    { label: 'Become a Driver', href: '/driver-application' },
    { label: 'Merchant Application', href: '/merchant-application' },
    { label: 'Business Accounts', href: '/business' },
    { label: 'API Documentation', href: '/api-docs' },
    { label: 'Partnership', href: '/partnership' }
  ];

  const legalLinks = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Shipping & Handling', href: '/shipping' },
    { label: 'Returns & Refunds', href: '/returns' }
  ];

  const stats = [
    { icon: <Package className="w-5 h-5" />, value: '10K+', label: 'Parts Available' },
    { icon: <Truck className="w-5 h-5" />, value: '500+', label: 'Deliveries Daily' },
    { icon: <Users className="w-5 h-5" />, value: '5K+', label: 'Happy Customers' },
    { icon: <Star className="w-5 h-5" />, value: '4.9★', label: 'Average Rating' }
  ];

  return (
    <footer className="animated-bg border-t border-cyan-400/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-10"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    <span className="gradient-text">MyParts</span>
                    <span className="neon-text">Runner</span>
                  </h3>
                  <p className="text-xs text-gray-400">Lightning Fast Delivery</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Louisville's premier auto parts and hardware delivery service. 
                Get what you need in 30 minutes or less, guaranteed.
              </p>

              {/* Service Area */}
              <div className="glass-card p-4 border border-cyan-400/30 glow-card mb-6">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="font-semibold">Service Area</span>
                </div>
                <p className="text-gray-300 text-sm">Louisville, KY Metro Area</p>
                <p className="text-gray-400 text-xs mt-1">More cities coming soon!</p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">(502) 555-PARTS</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">support@mypartsrunner.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm">24/7 Delivery Available</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-cyan-400" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Business
              </h4>
              <ul className="space-y-3">
                {businessLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Driver CTA */}
              <div className="mt-6 glass-card p-4 border border-purple-500/30 glow-card">
                <h5 className="text-purple-400 font-bold text-sm mb-2">🚗 Earn with MyPartsRunner</h5>
                <p className="text-gray-300 text-xs mb-3">Join our driver fleet and start earning today!</p>
                <Link to="/driver-application">
                  <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0">
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* Legal & Support */}
            <div>
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Legal & Support
              </h4>
              <ul className="space-y-3 mb-6">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.href} 
                      className="text-gray-300 hover:text-cyan-400 transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-cyan-400 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Newsletter Signup */}
              <div className="glass-card p-4 border border-green-400/30 glow-card">
                <h5 className="text-green-400 font-bold text-sm mb-2">📧 Stay Updated</h5>
                <p className="text-gray-300 text-xs mb-3">Get delivery updates and special offers!</p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Email"
                    className="neon-input flex-1 text-xs h-8 px-2"
                  />
                  <Button size="sm" className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white border-0 px-3">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="glass-card p-6 border border-cyan-400/30 glow-card mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-cyan-400 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold neon-text mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Stores */}
          <div className="text-center mb-12">
            <h4 className="text-lg font-bold text-white mb-6">🏪 Partner Stores</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-xl font-bold text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">AutoZone</div>
              <div className="text-xl font-bold text-gray-400 hover:text-pink-400 transition-colors cursor-pointer">O'Reilly's</div>
              <div className="text-xl font-bold text-gray-400 hover:text-green-400 transition-colors cursor-pointer">Home Depot</div>
              <div className="text-xl font-bold text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">Lowe's</div>
              <div className="text-xl font-bold text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">Advance Auto</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cyan-400/20 py-6">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © {currentYear} MyPartsRunner™. All rights reserved.
                </p>
                <Badge className="bg-gradient-to-r from-cyan-400 to-purple-600 text-black text-xs font-bold">
                  Made in Louisville, KY
                </Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Powered by</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-cyan-400 text-cyan-400 text-xs">
                    ⚡ Lightning Tech
                  </Badge>
                  <Badge variant="outline" className="border-purple-400 text-purple-400 text-xs">
                    🔒 Secure Payments
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
