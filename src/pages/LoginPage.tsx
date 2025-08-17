import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import BiometricAuth from '@/components/BiometricAuth';
import MobileAuthValidator from '@/components/MobileAuthValidator';
import { Eye, EyeOff, Smartphone } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user, isAuthenticated, loading: contextLoading } = useAppContext();
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loading: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasBiometricCredential, setHasBiometricCredential] = useState(false);
  const [stuckLoading, setStuckLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (!contextLoading && isAuthenticated && user) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user, contextLoading, navigate]);

  useEffect(() => {
    // Check if user has registered biometric authentication
    const storedCredential = localStorage.getItem('biometricCredential');
    setHasBiometricCredential(!!storedCredential);
  }, []);

  // Add a timeout to detect stuck loading states (shorter on mobile for better UX)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let forceResetTimeout: NodeJS.Timeout;
    
    if (formData.loading) {
      const timeout = isMobile ? 6000 : 8000; // Shorter timeout on mobile
      timeoutId = setTimeout(() => {
        setStuckLoading(true);
      }, timeout);
      
      // Force reset loading state after 15 seconds to prevent infinite loading
      forceResetTimeout = setTimeout(() => {
        console.log('Force resetting stuck loading state');
        setFormData(prev => ({ ...prev, loading: false }));
        setStuckLoading(false);
        setLoginError('Login timeout. Please try again.');
      }, 15000);
    } else {
      setStuckLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (forceResetTimeout) clearTimeout(forceResetTimeout);
    };
  }, [formData.loading, isMobile]);

  // Mobile-specific: Prevent zoom on input focus
  useEffect(() => {
    if (isMobile) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        const originalContent = viewport.getAttribute('content');
        
        const handleFocus = () => {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        };
        
        const handleBlur = () => {
          viewport.setAttribute('content', originalContent || 'width=device-width, initial-scale=1.0');
        };
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
          input.addEventListener('focus', handleFocus);
          input.addEventListener('blur', handleBlur);
        });
        
        return () => {
          inputs.forEach(input => {
            input.removeEventListener('focus', handleFocus);
            input.removeEventListener('blur', handleBlur);
          });
        };
      }
    }
  }, [isMobile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLoginError(null); // Clear any previous errors
  };

  const handleRetry = () => {
    setFormData({ ...formData, loading: false });
    setStuckLoading(false);
    setLoginError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
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
    }
  };

  const handleBiometricSuccess = () => {
    // Navigation will be handled by the useEffect above when user state changes
  };

  // Show loading spinner if context is still loading (with timeout)
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  useEffect(() => {
    if (contextLoading) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // Show skip option after 5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setLoadingTimeout(false);
    }
  }, [contextLoading]);

  if (contextLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="w-full max-w-md space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-gray-600">Checking authentication status...</p>
                {loadingTimeout && (
                  <div className="text-center space-y-2">
                    <p className="text-xs text-amber-600">Taking longer than usual...</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="text-xs"
                    >
                      Refresh Page
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-4 md:py-10 flex justify-center ${isMobile ? 'px-4' : ''}`}>
      <div className="w-full max-w-md space-y-6">
        {/* Mobile PWA Install Prompt */}
        {isMobile && (
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
              <Smartphone className="h-4 w-4" />
              Install MyPartsRunner for the best mobile experience
            </p>
          </div>
        )}

        {/* Mobile Authentication Validator - for testing */}
        {isMobile && process.env.NODE_ENV === 'development' && (
          <MobileAuthValidator />
        )}

        {/* Biometric Authentication */}
        {hasBiometricCredential && (
          <BiometricAuth 
            mode="login" 
            onSuccess={handleBiometricSuccess}
          />
        )}

        {/* Traditional Login */}
        <Card>
          <CardHeader className={isMobile ? 'pb-4' : ''}>
            <CardTitle className={isMobile ? 'text-xl' : 'text-2xl'}>Log in to your account</CardTitle>
            <CardDescription>
              Welcome back to MyPartsRunner™
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Show login error if any */}
              {loginError && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {loginError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={formData.loading}
                  className={isMobile ? 'text-base' : ''} // Prevent zoom on iOS
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={formData.loading}
                    className={isMobile ? 'text-base pr-12' : 'pr-12'} // Prevent zoom on iOS
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={formData.loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              
              <Button 
                type="submit" 
                className={`w-full ${isMobile ? 'h-12 text-base' : ''}`}
                disabled={formData.loading}
              >
                {formData.loading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Logging in...</span>
                  </span>
                ) : (
                  'Log in'
                )}
              </Button>
              
              {/* Show retry option if loading gets stuck */}
              {stuckLoading && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-amber-600">
                    {isMobile ? 'Login taking longer than usual...' : 'Login seems to be taking longer than usual...'}
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleRetry}
                    className="text-xs"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Don't have an account?{' '}
              <a href="/register" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;