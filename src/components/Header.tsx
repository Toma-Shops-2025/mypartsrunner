import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, ShoppingCart, User, Play, Plus, LogOut, Settings, TestTube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import { toast } from '@/components/ui/use-toast';

interface HeaderProps {
  onMenuClick: () => void;
  onVideoFeedClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onVideoFeedClick }) => {
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  const handleProfileClick = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/profile');
    }
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const handlePaymentTestingClick = () => {
    navigate('/payment-testing');
  };

  const handleSellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/sell');
  };

  const handleFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/feed');
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/cart');
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onMenuClick} className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
              <button onClick={handleLogoClick} className="flex items-center space-x-2">
                <img 
                  src="https://d64gsuwffb70l.cloudfront.net/682f036004a271a5767d0528_1748779913729_b424db9f.png" 
                  alt="TomaShops™ Logo" 
                  className="h-10 w-auto"
                />
              </button>
            </div>

            <div className="flex-1 max-w-lg mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search products, categories..."
                  className="pl-10 pr-4 w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="default" 
                size="sm" 
                className="hidden md:flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                onClick={handleSellClick}
              >
                <Plus className="w-4 h-4" />
                <span>Sell</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center space-x-2"
                onClick={handleFeedClick}
              >
                <Play className="w-4 h-4" />
                <span>Video Feed</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCartClick}>
                <ShoppingCart className="w-5 h-5" />
              </Button>
              {user ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="sm" onClick={handleAdminClick}>
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handlePaymentTestingClick}
                        title="Payment Testing"
                      >
                        <TestTube className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleProfileClick}>
                    <User className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleProfileClick}>
                  <User className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default Header;