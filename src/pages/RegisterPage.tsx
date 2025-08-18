import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { UserRole } from '@/types';
import { 
  Eye, 
  EyeOff, 
  Zap, 
  Shield, 
  Star, 
  Clock, 
  Users, 
  Car, 
  Store,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';
  const navigate = useNavigate();
  const { signUp, loading: contextLoading } = useAppContext();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    businessName: '',
    role: defaultRole as UserRole
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as UserRole });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      const userData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      };

      if (formData.role === 'merchant') {
        userData.name = formData.companyName;
        userData.businessName = formData.companyName;
      } else {
        userData.name = `${formData.firstName} ${formData.lastName}`.trim();
        if (formData.role === 'customer' && formData.businessName) {
          userData.businessName = formData.businessName;
        }
      }
      
      await signUp(formData.email, formData.password, userData);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'customer': return <Users className="w-5 h-5" />;
      case 'driver': return <Car className="w-5 h-5" />;
      case 'merchant': return <Store className="w-5 h-5" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer': return 'text-cyan-400 border-cyan-400/30';
      case 'driver': return 'text-green-400 border-green-400/30';
      case 'merchant': return 'text-purple-400 border-purple-400/30';
      default: return 'text-cyan-400 border-cyan-400/30';
    }
  };

  const benefits = [
    { icon: <Shield className="w-4 h-4" />, text: 'Secure & Safe' },
    { icon: <Clock className="w-4 h-4" />, text: '30 Min Delivery' },
    { icon: <Star className="w-4 h-4" />, text: '4.9★ Rating' },
    { icon: <CheckCircle className="w-4 h-4" />, text: 'Verified Parts' }
  ];

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 pulse-neon">
            <Zap className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">MyParts</span>
            <span className="neon-text">Runner</span>
          </h1>
          <p className="text-gray-400">Join Louisville's fastest delivery service</p>
        </div>

        <Card className="glass-card border-0 shadow-2xl glow-card">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-gray-300 text-base">
              Join MyPartsRunner™ as a <span className={`font-semibold ${getRoleColor(formData.role).split(' ')[0]}`}>
                {formData.role}
              </span>
            </CardDescription>
            
            {/* Benefits Bar */}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-gray-600">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-1 text-xs text-gray-300">
                  <span className="text-cyan-400">{benefit.icon}</span>
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label htmlFor="role" className="text-white text-sm font-medium">
                  I want to register as a
                </Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger 
                    id="role" 
                    className={`neon-input h-12 ${getRoleColor(formData.role)}`}
                  >
                    <div className="flex items-center gap-2">
                      {getRoleIcon(formData.role)}
                      <SelectValue placeholder="Select role" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="glass-card border border-cyan-400/30">
                    <SelectItem value="customer" className="text-gray-300 hover:text-cyan-400">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Customer
                      </div>
                    </SelectItem>
                    <SelectItem value="driver" className="text-gray-300 hover:text-green-400">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        Driver
                      </div>
                    </SelectItem>
                    <SelectItem value="merchant" className="text-gray-300 hover:text-purple-400">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        Merchant
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role-specific Name Fields */}
              {formData.role === 'merchant' ? (
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-white text-sm font-medium">
                    Company Name *
                  </Label>
                  <Input 
                    id="companyName" 
                    name="companyName" 
                    required 
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className="neon-input h-12"
                  />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white text-sm font-medium">
                        First Name *
                      </Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        required 
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="neon-input h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white text-sm font-medium">
                        Last Name *
                      </Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        required 
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="neon-input h-12"
                      />
                    </div>
                  </div>
                  {formData.role === 'customer' && (
                    <div className="space-y-2">
                      <Label htmlFor="businessName" className="text-white text-sm font-medium">
                        Business Name (Optional)
                      </Label>
                      <Input 
                        id="businessName" 
                        name="businessName" 
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter business name if applicable"
                        className="neon-input h-12"
                      />
                    </div>
                  )}
                </>
              )}
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-sm font-medium">
                  Email Address *
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="neon-input h-12"
                />
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-sm font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"}
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                    className="neon-input h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-cyan-400 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"}
                    required 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="neon-input h-12 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 text-gray-400 hover:text-cyan-400 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button 
                type="submit" 
                className="neon-button w-full h-12 text-base font-semibold" 
                disabled={contextLoading}
              >
                {contextLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="neon-spinner w-4 h-4"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col items-center space-y-4 pt-6">
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-400" />
                <span>Secure Registration</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-blue-400" />
                <span>Email Verified</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;