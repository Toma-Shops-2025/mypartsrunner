import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { UserRole } from '@/types';
import { Eye, EyeOff } from 'lucide-react';

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
      // This will be handled by the context
      return;
    }

    try {
      const userData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role
      };

      // Handle role-specific name fields
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
      
      // Only navigate if signup was successful
      navigate('/login');
    } catch (error) {
      // Error is already handled in the context
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Join MyPartsRunner™ as a {formData.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selection moved to top */}
            <div className="space-y-2">
              <Label htmlFor="role">I want to register as a</Label>
              <Select 
                value={formData.role} 
                onValueChange={handleRoleChange}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="merchant">Merchant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role-specific name fields */}
            {formData.role === 'merchant' ? (
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  required 
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                {formData.role === 'customer' && (
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name (Optional)</Label>
                    <Input 
                      id="businessName" 
                      name="businessName" 
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter business name if applicable"
                    />
                  </div>
                )}
              </>
            )}
            
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  required 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={contextLoading}>
              {contextLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Log in
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;