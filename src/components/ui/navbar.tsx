import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Sheet, SheetContent, SheetTrigger } from './sheet';
import { Menu } from 'lucide-react';
import Logo from '../Logo';
import { useAppContext } from '@/contexts/AppContext';
import { useCart } from '@/contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, userRole, signOut } = useAppContext();
  const { getCartItemCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
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
        
        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="grid gap-4 py-4">
              <Link to="/about" className="text-sm font-medium hover:underline">About</Link>
              <Link to="/how-it-works" className="text-sm font-medium hover:underline">How It Works</Link>
              <Link to="/help" className="text-sm font-medium hover:underline">Help</Link>
              <Link to="/contact" className="text-sm font-medium hover:underline">Contact</Link>
              
              {isAuthenticated ? (
                <>
                  {userRole === 'customer' && (
                    <Link to="/cart" className="text-sm font-medium hover:underline">
                      Cart ({getCartItemCount()})
                    </Link>
                  )}
                  <Link to="/browse" className="text-sm font-medium hover:underline">Browse</Link>
                  <Link to="/dashboard" className="text-sm font-medium hover:underline">Dashboard</Link>
                  <button 
                    onClick={handleSignOut}
                    className="text-sm font-medium hover:underline text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium hover:underline">Log In</Link>
                  <Link to="/register" className="text-sm font-medium hover:underline">Sign Up</Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export { Navbar };
