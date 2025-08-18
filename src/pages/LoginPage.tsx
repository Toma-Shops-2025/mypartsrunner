import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import { Eye, EyeOff, Loader2, ArrowRight, User, Lock, Zap, Shield, Star } from 'lucide-react';
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
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-green-400 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-3000"></div>
      </div>

      {/* Auto Parts Store Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-1/4 text-8xl text-cyan-400">🔧</div>
        <div className="absolute top-1/3 right-1/4 text-6xl text-pink-500">⚙️</div>
        <div className="absolute bottom-1/3 left-1/6 text-7xl text-green-400">🔩</div>
        <div className="absolute bottom-20 right-1/3 text-5xl text-purple-500">🛠️</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center shadow-2xl mb-4">
              <Zap className="w-10 h-10 text-black" />
            </div>
            <div className="absolute -inset-4 bg-cyan-400/20 rounded-full blur-xl -z-10 pulse-neon"></div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="gradient-text">Welcome</span>{' '}
            <span className="neon-text pulse-neon">Back</span>
          </h1>
          <p className="text-gray-300">Sign in to your MyPartsRunner™ account</p>
        </div>

        <Card className="glass-card border-0 shadow-2xl glow-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">Access Your Account</CardTitle>
            <CardDescription className="text-gray-300">
              Get the parts you need, delivered lightning fast ⚡
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {contextLoading && (
              <div className="glass-card p-4 border border-cyan-400/30">
                <div className="flex items-center space-x-3">
                  <div className="neon-spinner"></div>
                  <span className="text-cyan-400 font-medium">
                    Checking authentication status...
                  </span>
                </div>
              </div>
            )}

            {loginError && (
              <div className="glass-card p-4 border border-pink-500/50 bg-pink-500/10">
                <p className="text-pink-400 font-medium text-center">{loginError}</p>
                {(loginError.includes('timeout') || loginError.includes('connection') || loginError.includes('network')) && (
                  <p className="text-pink-300 text-sm text-center mt-2">
                    If this problem persists, try the "Clear cache" button below.
                  </p>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 font-medium">Email Address</Label>
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
                    className="neon-input pl-10 h-12"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
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
                    className="neon-input pl-10 pr-12 h-12"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-700/50 text-gray-400 hover:text-cyan-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={contextLoading}
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
                className="neon-button w-full h-12 text-lg font-semibold"
                disabled={contextLoading}
              >
                {contextLoading ? (
                  <>
                    <div className="neon-spinner w-5 h-5 mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center">
              <span className="text-gray-400">Don't have an account? </span>
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                onClick={() => navigate('/register')}
                disabled={contextLoading}
              >
                Sign up now
              </Button>
            </div>
            
            <div className="text-center space-y-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-gray-500 hover:text-gray-300 text-sm transition-colors"
                onClick={() => navigate('/forgot-password')}
                disabled={contextLoading}
              >
                Forgot your password?
              </Button>
              
              <div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-gray-600 hover:text-gray-400 text-xs transition-colors"
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
          <p className="text-gray-400 text-sm mb-6">Trusted by thousands in Louisville, KY</p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4 text-center glow-card">
              <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Secure</p>
            </div>
            <div className="glass-card p-4 text-center glow-card">
              <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Fast</p>
            </div>
            <div className="glass-card p-4 text-center glow-card">
              <Star className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-xs text-gray-300">Rated 4.9★</p>
            </div>
          </div>
          
          {/* Store partners */}
          <div className="flex justify-center space-x-6 opacity-60">
            <div className="text-lg font-bold text-gray-500 hover:text-cyan-400 transition-colors">AutoZone</div>
            <div className="text-lg font-bold text-gray-500 hover:text-pink-400 transition-colors">O'Reilly's</div>
            <div className="text-lg font-bold text-gray-500 hover:text-green-400 transition-colors">Home Depot</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;