import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Menu, ShoppingCart, User, Zap, Star, MapPin } from 'lucide-react';
import Logo from '../Logo';
import { useAppContext } from '@/contexts/AppContext';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, userRole, signOut } = useAppContext();
  const { getCartItemCount } = useCart();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-cyan-400/20 shadow-2xl">
      <div className="container flex h-20 items-center px-4">
        {/* Logo Section */}
        <div className="flex items-center gap-2 flex-grow max-w-[90%] mr-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold">
                <span className="gradient-text">MyParts</span>
                <span className="neon-text">Runner</span>
              </h1>
              <p className="text-xs text-gray-400">Lightning Fast Delivery</p>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 ml-auto">
          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/how-it-works" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors relative group">
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/help" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors relative group">
              Help
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/contact" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/driver-application" className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors pulse-neon flex items-center gap-1">
              🚗 Drive & Earn
            </Link>
            {isAuthenticated && (
              <Link to="/browse" className="text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors relative group">
                Browse
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </nav>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {userRole === 'customer' && (
                <Link to="/cart" className="relative group">
                  <Button variant="ghost" size="icon" className="hover:bg-cyan-400/20 hover:text-cyan-400 transition-colors">
                    <ShoppingCart className="h-5 w-5" />
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {getCartItemCount()}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button className="neon-button text-sm px-4 py-2 h-auto">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/20 transition-colors">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="neon-button text-sm px-4 py-2 h-auto">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden ml-auto">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/20 transition-colors">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 glass-card border-l border-cyan-400/20">
            <div className="grid gap-6 py-6">
              {/* Mobile Auth Status */}
              {isAuthenticated && user && (
                <div className="glass-card p-4 border border-cyan-400/30 glow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Welcome back!</p>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-cyan-400 to-purple-600 text-black rounded-full font-bold capitalize">
                      {user.role}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <Star className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                  </div>
                  
                  {/* Driver App Promotion */}
                  {user.role === 'driver' && (
                    <div className="mt-3 pt-3 border-t border-cyan-400/30">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-cyan-400 font-medium">📱 Try our Driver PWA!</span>
                        <button 
                          onClick={() => alert('🚧 Driver PWA Coming Soon!\n\nWe\'re building a dedicated driver app experience. Stay tuned for launch!')}
                          className="text-xs text-cyan-400 hover:text-cyan-300 underline transition-colors"
                        >
                          Coming Soon
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Location Badge */}
              <div className="glass-card p-3 border border-gray-600">
                <div className="flex items-center gap-2 text-cyan-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Nationwide Service</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Service Area</p>
              </div>
              
              <div className="space-y-4">
                <Link to="/about" className="block text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                  About
                </Link>
                <Link to="/how-it-works" className="block text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                  How It Works
                </Link>
                <Link to="/help" className="block text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                  Help
                </Link>
                <Link to="/contact" className="block text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                  Contact
                </Link>
                <Link to="/driver-application" className="block text-base font-bold text-cyan-400 hover:text-cyan-300 transition-colors pulse-neon" onClick={handleMobileLinkClick}>
                  🚗 Become a Driver
                </Link>
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-4 pt-4 border-t border-gray-600">
                  {userRole === 'customer' && (
                    <Link to="/cart" className="flex justify-between items-center text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Shopping Cart
                      </span>
                      {getCartItemCount() > 0 && (
                        <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {getCartItemCount()}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link to="/browse" className="block text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                    Browse Products
                  </Link>
                  <Link to="/dashboard" className="block text-base font-medium text-gray-300 hover:text-cyan-400 transition-colors" onClick={handleMobileLinkClick}>
                    Dashboard
                  </Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full text-base mt-4 border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-gray-600">
                  <Link to="/login" onClick={handleMobileLinkClick}>
                    <Button variant="ghost" className="w-full text-base text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/20 transition-colors">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={handleMobileLinkClick}>
                    <Button className="neon-button w-full text-base">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export { Navbar };
