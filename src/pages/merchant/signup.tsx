import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SignupFormData {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  storeType: string;
  address: string;
  integrationPreference: string;
  additionalInfo: string;
}

export function MerchantSignup() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>();

  const onSubmit = async (data: SignupFormData) => {
    // TODO: Implement signup logic
    console.log('Form submitted:', data);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Merchant Sign Up</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                {...register('businessName', { required: 'Business name is required' })}
                placeholder="Your business name"
              />
              {errors.businessName && (
                <p className="text-red-500 text-sm mt-1">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                {...register('contactName', { required: 'Contact name is required' })}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone', { required: 'Phone is required' })}
                placeholder="(555) 555-5555"
              />
            </div>

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://your-store.com"
              />
            </div>

            <div>
              <Label htmlFor="storeType">Store Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select store type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto-parts">Auto Parts Store</SelectItem>
                  <SelectItem value="hardware">Hardware Store</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="address">Store Address</Label>
              <Textarea
                id="address"
                {...register('address', { required: 'Address is required' })}
                placeholder="Full store address"
              />
            </div>

            <div>
              <Label htmlFor="integrationPreference">Preferred Integration Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose integration method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="widget">Simple Widget</SelectItem>
                  <SelectItem value="api">API Integration</SelectItem>
                  <SelectItem value="undecided">Not Sure Yet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Textarea
                id="additionalInfo"
                {...register('additionalInfo')}
                placeholder="Any additional information or questions?"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Submit Application
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-8">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
          Our team will review your application and contact you within 1-2 business days.
        </p>
      </div>
    </div>
  );
} 