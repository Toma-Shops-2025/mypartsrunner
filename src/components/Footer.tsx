import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }
    
    // Simulate subscription success
    toast({
      title: 'Subscribed!',
      description: 'Thank you for subscribing to our newsletter.'
    });
    setEmail('');
    
    // Navigate to contact page after subscription
    navigate('/contact');
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div>
              <Link to="/">
                <img 
                  src="https://d64gsuwffb70l.cloudfront.net/682f036004a271a5767d0528_1748779913729_b424db9f.png" 
                  alt="TomaShops™ Logo" 
                  className="h-16 w-auto mb-2"
                />
              </Link>
            </div>
            <p className="text-gray-300 text-sm">
              The future of online marketplace where videos showcase products better than photos ever could.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/why-choose" className="text-gray-300 hover:text-white transition-colors">Why Choose TomaShops</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/safety" className="text-gray-300 hover:text-white transition-colors">Safety Guide</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Handling</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Popular Categories</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/feed" className="text-gray-300 hover:text-white transition-colors">Electronics</Link></li>
              <li><Link to="/feed" className="text-gray-300 hover:text-white transition-colors">Fashion</Link></li>
              <li><Link to="/feed" className="text-gray-300 hover:text-white transition-colors">Vehicles</Link></li>
              <li><Link to="/feed" className="text-gray-300 hover:text-white transition-colors">Home & Garden</Link></li>
              <li><Link to="/feed" className="text-gray-300 hover:text-white transition-colors">Sports & Outdoors</Link></li>
              <li><Link to="/feed" className="text-gray-300 hover:text-white transition-colors">Collectibles</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-sm text-gray-300">
              Get the latest deals and new listings delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@tomashops.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>1-800-TOMASHOP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 TomaShops™ Video 1st Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;