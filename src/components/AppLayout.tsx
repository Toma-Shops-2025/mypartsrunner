import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { X, Home, ShoppingCart, User, Play, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
  showHero?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, showHero = false }) => {
  const { sidebarOpen, toggleSidebar } = useApp();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      toggleSidebar();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={handleMenuClick} />
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link to="/sell" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Plus className="w-5 h-5" />
                <span>Sell Item</span>
              </Link>
              <Link to="/feed" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Play className="w-5 h-5" />
                <span>Video Feed</span>
              </Link>
              <Link to="/cart" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </Link>
              <Link to="/profile" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
export { AppLayout };