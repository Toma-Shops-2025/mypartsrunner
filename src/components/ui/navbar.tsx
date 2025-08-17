import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Menu } from 'lucide-react';
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
    setMobileMenuOpen(false); // Close menu after sign out
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false); // Close mobile menu when any link is clicked
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-28 items-center">
        <div className="flex items-center gap-2 flex-grow max-w-[90%] mr-4">
          <Link to="/" className="flex items-center gap-2 w-full">
            <Logo size="medium" withText={true} />
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <nav className="flex items-center gap-4">
            <Link to="/about" className="text-sm font-medium hover:underline">About</Link>
            <Link to="/how-it-works" className="text-sm font-medium hover:underline">How It Works</Link>
            <Link to="/help" className="text-sm font-medium hover:underline">Help</Link>
            <Link to="/contact" className="text-sm font-medium hover:underline">Contact</Link>
            <Link to="/driver-application" className="text-sm font-medium hover:underline text-blue-600 font-semibold">🚗 Become a Driver</Link>
            {isAuthenticated && (
              <Link to="/browse" className="text-sm font-medium hover:underline">Browse</Link>
            )}
          </nav>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {userRole === 'customer' && (
                <Link to="/cart" className="relative">
                  <Button variant="ghost" size="icon">
                    <span className="sr-only">Shopping cart</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <circle cx="8" cy="21" r="1"/>
                      <circle cx="19" cy="21" r="1"/>
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                    </svg>
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </Button>
                </Link>
              )}
              <Link to="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <div className="grid gap-6 py-6">
              {/* Mobile Auth Status */}
              {isAuthenticated && user && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">Welcome back!</p>
                  <p className="text-xs text-blue-700">{user.email}</p>
                  <p className="text-xs text-blue-600 capitalize">{user.role}</p>
                </div>
              )}
              
              <div className="space-y-4">
                <Link to="/about" className="block text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>About</Link>
                <Link to="/how-it-works" className="block text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>How It Works</Link>
                <Link to="/help" className="block text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>Help</Link>
                <Link to="/contact" className="block text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>Contact</Link>
                <Link to="/driver-application" className="block text-base font-semibold text-blue-600 hover:text-blue-700 transition-colors" onClick={handleMobileLinkClick}>🚗 Become a Driver</Link>
              </div>
              
              {isAuthenticated ? (
                <div className="space-y-4 pt-4 border-t">
                  {userRole === 'customer' && (
                    <Link to="/cart" className="flex justify-between items-center text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>
                      <span>Shopping Cart</span>
                      {getCartItemCount() > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                          {getCartItemCount()}
                        </span>
                      )}
                    </Link>
                  )}
                  <Link to="/browse" className="block text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>Browse Products</Link>
                  <Link to="/dashboard" className="block text-base font-medium hover:text-primary transition-colors" onClick={handleMobileLinkClick}>Dashboard</Link>
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full text-base mt-4"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t">
                  <Link to="/login" onClick={handleMobileLinkClick}>
                    <Button variant="ghost" className="w-full text-base">Log In</Button>
                  </Link>
                  <Link to="/register" onClick={handleMobileLinkClick}>
                    <Button className="w-full text-base">Sign Up</Button>
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
