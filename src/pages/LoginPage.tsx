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

  useEffect(() => {
    // Check if user has registered biometric authentication
    const storedCredential = localStorage.getItem('biometricCredential');
    setHasBiometricCredential(!!storedCredential);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setFormData({ ...formData, loading: true });
      await signIn(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is already handled in the context
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