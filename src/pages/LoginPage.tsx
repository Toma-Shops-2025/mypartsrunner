import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppContext } from '@/contexts/AppContext';
import BiometricAuth from '@/components/BiometricAuth';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    loading: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [hasBiometricCredential, setHasBiometricCredential] = useState(false);
  const [stuckLoading, setStuckLoading] = useState(false);

  useEffect(() => {
    // Check if user has registered biometric authentication
    const storedCredential = localStorage.getItem('biometricCredential');
    setHasBiometricCredential(!!storedCredential);
  }, []);

  // Add a timeout to detect stuck loading states
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (formData.loading) {
      timeoutId = setTimeout(() => {
        setStuckLoading(true);
      }, 8000); // Show retry option after 8 seconds
    } else {
      setStuckLoading(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [formData.loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRetry = () => {
    setFormData({ ...formData, loading: false });
    setStuckLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormData({ ...formData, loading: true });
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout - please try again')), 10000);
      });

      const loginPromise = signIn(formData.email, formData.password);
      
      await Promise.race([loginPromise, timeoutPromise]);
      navigate('/dashboard');
    } catch (error: any) {
      // Error is already handled in the context
      console.error('Login error:', error);
    } finally {
      setFormData({ ...formData, loading: false });
    }
  };

  const handleBiometricSuccess = () => {
    // Navigate to dashboard on successful biometric authentication
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Biometric Authentication */}
        {hasBiometricCredential && (
          <BiometricAuth 
            mode="login" 
            onSuccess={handleBiometricSuccess}
          />
        )}

        {/* Traditional Login */}
        <Card>
          <CardHeader>
            <CardTitle>Log in to your account</CardTitle>
            <CardDescription>
              Welcome back to MyPartsRunner™
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
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
              
              <Button type="submit" className="w-full" disabled={formData.loading}>
                {formData.loading ? 'Logging in...' : 'Log in'}
              </Button>
              
              {/* Show retry option if loading gets stuck */}
              {stuckLoading && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-amber-600">
                    Login seems to be taking longer than usual...
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
            <p className="text-sm text-gray-500">
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