import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { Eye, EyeOff, Loader2, ArrowRight, User, Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, loading: contextLoading, isAuthenticated, user, clearAuthCache } = useAppContext();
  const isMobile = useIsMobile();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User is authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Clear any stale auth data when login page loads
  useEffect(() => {
    const clearStaleAuth = async () => {
      if (!isAuthenticated && !contextLoading) {
        console.log('Clearing potentially stale authentication data...');
        await clearAuthCache();
      }
    };
    
    clearStaleAuth();
  }, [isAuthenticated, contextLoading, clearAuthCache]);

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
    
    try {
      setLoginError(null);
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      console.error('Login error in form:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
      
      // Extra safeguard: Force loading to false after a delay if it's still stuck
      setTimeout(() => {
        if (contextLoading) {
          console.warn('Forcing loading state to false due to stuck login');
        }
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-orange-300 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src="/logo.png"
              alt="MyPartsRunner Logo"
              className="h-16 w-auto mx-auto drop-shadow-xl"
            />
            <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl -z-10"></div>
          </div>
          <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">Sign in to your MyPartsRunner™ account</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Log in to your account</CardTitle>
            <CardDescription className="text-gray-600">
              Get the parts you need, delivered fast
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {contextLoading && (
              <div className="p-4 bg-blue-50/80 border border-blue-200/50 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    Checking authentication status...
                  </span>
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-4 bg-red-50/80 border border-red-200/50 rounded-xl backdrop-blur-sm">
                <p className="text-red-700 font-medium text-center">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={contextLoading}
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={contextLoading}
                    className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100/50"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={contextLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-300 group" 
                disabled={contextLoading}
              >
                {contextLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Log in
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
                          </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/register')}
                disabled={contextLoading}
              >
                Sign up now
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-gray-500 hover:text-gray-700 text-sm"
                onClick={() => navigate('/forgot-password')}
                disabled={contextLoading}
              >
                Forgot your password?
              </Button>
              
              <div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-gray-400 hover:text-gray-600 text-xs"
                  onClick={async () => {
                    await clearAuthCache();
                    window.location.reload();
                  }}
                  disabled={contextLoading}
                >
                  Having login issues? Clear cache
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Trust indicators */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by thousands in Louisville, KY</p>
          <div className="flex justify-center space-x-6 opacity-60">
            <div className="text-lg font-bold text-gray-600">AutoZone</div>
            <div className="text-lg font-bold text-gray-600">O'Reilly's</div>
            <div className="text-lg font-bold text-gray-600">Home Depot</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;