import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const DriverLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading, user } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loading: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Redirect if already authenticated and is a driver
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'driver') {
        navigate('/dashboard');
      } else {
        // Redirect non-drivers to main site
        window.location.href = 'https://mypartsrunner.com/login';
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setFormData(prev => ({ ...prev, loading: true }));

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.user) {
        // Check if user is a driver
        if (result.user.role !== 'driver') {
          setLoginError('Access denied. Driver credentials required.');
          setFormData(prev => ({ ...prev, loading: false }));
          return;
        }
        
        // Success - will be redirected by useEffect
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error: any) {
      console.error('Driver login error:', error);
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setFormData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@mypartsrunner.com',
      password: 'demo123',
      loading: false
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading Driver App...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Car className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Driver Login</h1>
          <p className="text-blue-100">MyPartsRunner™ Driver App</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-xl">Welcome Back, Driver!</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{loginError}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  disabled={formData.loading}
                  placeholder="driver@example.com"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    disabled={formData.loading}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={formData.loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg"
                disabled={formData.loading}
              >
                {formData.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In to Drive'
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12"
                onClick={handleDemoLogin}
                disabled={formData.loading}
              >
                Try Demo Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>Need help? Contact driver support:</p>
              <p className="font-medium text-blue-600">+1 (555) SUPPORT</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100 text-sm">
          <p>Not a driver yet?</p>
          <button
            onClick={() => window.location.href = 'https://mypartsrunner.com/driver-application'}
            className="text-white font-medium underline hover:no-underline"
          >
            Apply to become a driver →
          </button>
        </div>

        {/* PWA Install Hint */}
        <div className="text-center mt-6 text-blue-200 text-xs">
          <p>📱 Install this app for the best driver experience!</p>
        </div>
      </div>
    </div>
  );
};

export default DriverLogin; 