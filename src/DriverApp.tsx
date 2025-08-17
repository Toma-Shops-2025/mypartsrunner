import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  BarChart3, 
  Package, 
  User, 
  Navigation, 
  HelpCircle,
  Power,
  Menu,
  X
} from 'lucide-react';

const DriverApp: React.FC = () => {
  const { user, isAuthenticated, loading } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Check if user is a driver
  useEffect(() => {
    if (user && user.role !== 'driver') {
      // Redirect non-drivers to main site
      window.location.href = 'https://mypartsrunner.com/login';
    }
  }, [user]);

  const navigationItems = [
    {
      icon: Car,
      label: 'Dashboard',
      path: '/dashboard',
      badge: null
    },
    {
      icon: Package,
      label: 'Deliveries',
      path: '/deliveries',
      badge: '2' // Active deliveries count
    },
    {
      icon: BarChart3,
      label: 'Earnings',
      path: '/earnings',
      badge: null
    },
    {
      icon: Navigation,
      label: 'GPS',
      path: '/navigation',
      badge: null
    },
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      badge: null
    },
    {
      icon: HelpCircle,
      label: 'Support',
      path: '/support',
      badge: null
    }
  ];

  const NavItem = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <button
        onClick={() => {
          navigate(item.path);
          setMobileMenuOpen(false);
        }}
        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
          isActive 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <div className="relative">
          <item.icon className="h-5 w-5 mb-1" />
          {item.badge && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
            >
              {item.badge}
            </Badge>
          )}
        </div>
        <span className="text-xs font-medium">{item.label}</span>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Driver App...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Driver App</h1>
              <p className="text-xs text-gray-600">Welcome, {user?.firstName || 'Driver'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {user?.isAvailable ? (
              <Badge className="bg-green-600">Online</Badge>
            ) : (
              <Badge variant="secondary">Offline</Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-white w-80 h-full shadow-xl p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900">Navigation</h2>
            </div>
            
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.path} className="w-full">
                  <NavItem item={item} />
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Handle logout
                  window.location.href = 'https://mypartsrunner.com';
                }}
              >
                <Power className="h-4 w-4 mr-2" />
                Back to Main Site
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation - Desktop Hidden */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="grid grid-cols-6 px-2 py-2">
          {navigationItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar - Mobile Hidden */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:bg-white md:border-r md:border-gray-200">
        <div className="flex-1 flex flex-col min-h-0 pt-5 pb-4">
          <div className="flex items-center gap-3 px-4 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Driver App</h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-4 space-y-2">
            {navigationItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Desktop Content Area */}
      <div className="hidden md:pl-64">
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DriverApp; 