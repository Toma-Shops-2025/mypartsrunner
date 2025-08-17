import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SupabaseTest from '@/components/SupabaseTest';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading: contextLoading, isAuthenticated, user } = useAppContext();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loading: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [stuckLoading, setStuckLoading] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle stuck loading state
  useEffect(() => {
    if (contextLoading) {
      const timeout = setTimeout(() => {
        setStuckLoading(true);
      }, isMobile ? 6000 : 8000); // Longer timeout for mobile

      return () => clearTimeout(timeout);
    } else {
      setStuckLoading(false);
    }
  }, [contextLoading, isMobile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (loginError) setLoginError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    // Force reset timeout to avoid stuck state
    const forceResetTimeout = setTimeout(() => {
      setFormData(prev => ({ ...prev, loading: false }));
      setStuckLoading(false);
    }, 12000);
    
    try {
      setFormData({ ...formData, loading: true });
      setLoginError(null);
      setStuckLoading(false);
      
      await signIn(formData.email, formData.password);
      // Navigation will be handled by the useEffect above when user state changes
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      // Always reset loading state regardless of success or failure
      setFormData(prev => ({ ...prev, loading: false }));
      setStuckLoading(false);
      clearTimeout(forceResetTimeout);
    }
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@mypartsrunner.com',
      password: 'demo123',
      loading: false
    });
  };

  return (
    <div className="container mx-auto py-10 flex flex-col items-center space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>
            Welcome back to MyPartsRunner™
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contextLoading && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-blue-700">
                  Checking authentication status...
                </span>
              </div>
              {stuckLoading && (
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefreshPage}
                    className="text-xs"
                  >
                    Refresh Page
                  </Button>
                </div>
              )}
            </div>
          )}

          {loginError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={formData.loading || contextLoading}
                className="auth-form"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={formData.loading || contextLoading}
                  className="auth-form pr-10"
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={formData.loading || contextLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full mobile-button" 
              disabled={formData.loading || contextLoading}
            >
              {formData.loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0 h-auto"
              onClick={() => navigate('/register')}
            >
              Sign up
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDemoLogin}
            className="w-full text-sm"
          >
            🚀 Use Demo Account (demo@mypartsrunner.com)
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowDebug(!showDebug)}
            className="w-full text-xs"
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </Button>
        </CardFooter>
      </Card>

      {/* Debug Panel */}
      {showDebug && <SupabaseTest />}
    </div>
  );
};

export default LoginPage;