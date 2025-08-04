import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo size="medium" withText={true} />
            <p className="text-sm text-gray-600">
              Fast delivery of auto parts and hardware supplies.
            </p>
            <div className="text-sm text-gray-600">
              <p>Louisville, Kentucky</p>
              <p>(502) 812-2456</p>
              <p>support@mypartsrunner.com</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:underline">Terms of Service</Link></li>
              <li><Link to="/safety-guide" className="hover:underline">Safety Guide</Link></li>
              <li><Link to="/shipping-handling" className="hover:underline">Shipping & Handling</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Join Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register?role=customer" className="hover:underline">Become a Customer</Link></li>
              <li><Link to="/register?role=driver" className="hover:underline">Become a Driver</Link></li>
              <li><Link to="/register?role=merchant" className="hover:underline">Become a Merchant</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© {currentYear} MyPartsRunner™. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
