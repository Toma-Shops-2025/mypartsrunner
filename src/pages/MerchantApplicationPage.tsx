import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Store, Building2, FileText, MapPin, DollarSign, Users } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const MerchantApplicationPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    // Business Information
    businessName: '',
    businessType: '',
    storeType: '',
    businessEmail: user?.email || '',
    businessPhone: '',
    website: '',
    
    // Business Address
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    businessLatitude: '',
    businessLongitude: '',
    
    // Business Details
    businessLicense: '',
    taxId: '',
    yearsInBusiness: '',
    numberOfEmployees: '',
    annualRevenue: '',
    
    // Store Information
    storeHours: '',
    deliveryRadius: '',
    minimumOrder: '',
    averageOrderValue: '',
    inventorySize: '',
    
    // Product Information
    primaryCategories: [] as string[],
    estimatedProducts: '',
    hasOnlineInventory: false,
    inventorySystem: '',
    
    // Delivery Preferences
    deliveryHours: '',
    preparationTime: '',
    packagingMaterials: false,
    specialHandling: false,
    specialHandlingDetails: '',
    
    // Payment & Billing
    preferredPaymentMethod: '',
    bankAccountInfo: '',
    stripeAccountId: '',
    
    // Contact Information
    primaryContact: '',
    primaryPhone: '',
    secondaryContact: '',
    secondaryPhone: '',
    
    // Agreements
    agreeToTerms: false,
    agreeToPricing: false,
    agreeToQualityStandards: false,
    agreeToBackgroundCheck: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: "Business Information", icon: <Store className="h-4 w-4" /> },
    { number: 2, title: "Business Details", icon: <Building2 className="h-4 w-4" /> },
    { number: 3, title: "Store Setup", icon: <MapPin className="h-4 w-4" /> },
    { number: 4, title: "Products & Inventory", icon: <FileText className="h-4 w-4" /> },
    { number: 5, title: "Delivery Setup", icon: <Users className="h-4 w-4" /> },
    { number: 6, title: "Payment & Agreements", icon: <DollarSign className="h-4 w-4" /> }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primaryCategories: checked 
        ? [...prev.primaryCategories, category]
        : prev.primaryCategories.filter(c => c !== category)
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would submit the application to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted!",
        description: "Thank you for applying to partner with MyPartsRunner. We'll review your application and contact you within 2-3 business days.",
      });
      
      // Reset form or redirect
      setFormData({
        businessName: '', businessType: '', storeType: '', businessEmail: '',
        businessPhone: '', website: '', businessAddress: '', businessCity: '',
        businessState: '', businessZipCode: '', businessLatitude: '',
        businessLongitude: '', businessLicense: '', taxId: '', yearsInBusiness: '',
        numberOfEmployees: '', annualRevenue: '', storeHours: '', deliveryRadius: '',
        minimumOrder: '', averageOrderValue: '', inventorySize: '', primaryCategories: [],
        estimatedProducts: '', hasOnlineInventory: false, inventorySystem: '',
        deliveryHours: '', preparationTime: '', packagingMaterials: false,
        specialHandling: false, specialHandlingDetails: '', preferredPaymentMethod: '',
        bankAccountInfo: '', stripeAccountId: '', primaryContact: '', primaryPhone: '',
        secondaryContact: '', secondaryPhone: '', agreeToTerms: false, agreeToPricing: false,
        agreeToQualityStandards: false, agreeToBackgroundCheck: false
      });
      setCurrentStep(1);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="llc">LLC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="storeType">Store Type *</Label>
                <Select value={formData.storeType} onValueChange={(value) => handleInputChange('storeType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto Parts Store</SelectItem>
                    <SelectItem value="hardware">Hardware Store</SelectItem>
                    <SelectItem value="both">Both Auto Parts & Hardware</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessEmail">Business Email *</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessPhone">Business Phone *</Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={formData.businessPhone}
                  onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourstore.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessAddress">Business Address *</Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="businessCity">City *</Label>
                <Input
                  id="businessCity"
                  value={formData.businessCity}
                  onChange={(e) => handleInputChange('businessCity', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessState">State *</Label>
                <Input
                  id="businessState"
                  value={formData.businessState}
                  onChange={(e) => handleInputChange('businessState', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="businessZipCode">ZIP Code *</Label>
                <Input
                  id="businessZipCode"
                  value={formData.businessZipCode}
                  onChange={(e) => handleInputChange('businessZipCode', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="businessLicense">Business License Number *</Label>
                <Input
                  id="businessLicense"
                  value={formData.businessLicense}
                  onChange={(e) => handleInputChange('businessLicense', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="taxId">Tax ID / EIN *</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  type="number"
                  min="0"
                  value={formData.yearsInBusiness}
                  onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                <Input
                  id="numberOfEmployees"
                  type="number"
                  min="1"
                  value={formData.numberOfEmployees}
                  onChange={(e) => handleInputChange('numberOfEmployees', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualRevenue">Annual Revenue Range</Label>
                <Select value={formData.annualRevenue} onValueChange={(value) => handleInputChange('annualRevenue', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100k">Under $100K</SelectItem>
                    <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                    <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                    <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                    <SelectItem value="over-5m">Over $5M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeHours">Store Hours *</Label>
              <Textarea
                id="storeHours"
                placeholder="e.g., Mon-Fri: 8AM-6PM, Sat: 9AM-5PM, Sun: Closed"
                value={formData.storeHours}
                onChange={(e) => handleInputChange('storeHours', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryRadius">Delivery Radius (miles) *</Label>
                <Input
                  id="deliveryRadius"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.deliveryRadius}
                  onChange={(e) => handleInputChange('deliveryRadius', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="minimumOrder">Minimum Order Amount ($) *</Label>
                <Input
                  id="minimumOrder"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minimumOrder}
                  onChange={(e) => handleInputChange('minimumOrder', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="averageOrderValue">Average Order Value ($)</Label>
                <Input
                  id="averageOrderValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.averageOrderValue}
                  onChange={(e) => handleInputChange('averageOrderValue', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="inventorySize">Inventory Size</Label>
                <Select value={formData.inventorySize} onValueChange={(value) => handleInputChange('inventorySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (Under 1,000 items)</SelectItem>
                    <SelectItem value="medium">Medium (1,000-5,000 items)</SelectItem>
                    <SelectItem value="large">Large (5,000-10,000 items)</SelectItem>
                    <SelectItem value="very-large">Very Large (Over 10,000 items)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Primary Product Categories *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {[
                  'Brakes', 'Engine Parts', 'Electrical', 'Suspension', 'Exhaust',
                  'Tools', 'Hardware', 'Plumbing', 'Electrical Supplies', 'Paint',
                  'Garden', 'Automotive Fluids', 'Filters', 'Lighting', 'Safety Equipment'
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.primaryCategories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                    />
                    <Label htmlFor={category} className="text-sm">{category}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="estimatedProducts">Estimated Number of Products</Label>
              <Input
                id="estimatedProducts"
                type="number"
                min="1"
                value={formData.estimatedProducts}
                onChange={(e) => handleInputChange('estimatedProducts', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasOnlineInventory"
                checked={formData.hasOnlineInventory}
                onCheckedChange={(checked) => handleInputChange('hasOnlineInventory', checked)}
              />
              <Label htmlFor="hasOnlineInventory">I have an online inventory system</Label>
            </div>
            {formData.hasOnlineInventory && (
              <div>
                <Label htmlFor="inventorySystem">What inventory system do you use?</Label>
                <Input
                  id="inventorySystem"
                  placeholder="e.g., QuickBooks, Square, custom system"
                  value={formData.inventorySystem}
                  onChange={(e) => handleInputChange('inventorySystem', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="deliveryHours">Delivery Hours *</Label>
              <Textarea
                id="deliveryHours"
                placeholder="e.g., Mon-Fri: 9AM-7PM, Sat: 10AM-6PM"
                value={formData.deliveryHours}
                onChange={(e) => handleInputChange('deliveryHours', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="preparationTime">Order Preparation Time (minutes) *</Label>
              <Input
                id="preparationTime"
                type="number"
                min="5"
                max="120"
                value={formData.preparationTime}
                onChange={(e) => handleInputChange('preparationTime', e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="packagingMaterials"
                checked={formData.packagingMaterials}
                onCheckedChange={(checked) => handleInputChange('packagingMaterials', checked)}
              />
              <Label htmlFor="packagingMaterials">I can provide packaging materials</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="specialHandling"
                checked={formData.specialHandling}
                onCheckedChange={(checked) => handleInputChange('specialHandling', checked)}
              />
              <Label htmlFor="specialHandling">I have items requiring special handling</Label>
            </div>
            {formData.specialHandling && (
              <div>
                <Label htmlFor="specialHandlingDetails">Please describe special handling requirements</Label>
                <Textarea
                  id="specialHandlingDetails"
                  placeholder="Describe any special handling, storage, or delivery requirements..."
                  value={formData.specialHandlingDetails}
                  onChange={(e) => handleInputChange('specialHandlingDetails', e.target.value)}
                />
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="preferredPaymentMethod">Preferred Payment Method *</Label>
              <Select value={formData.preferredPaymentMethod} onValueChange={(value) => handleInputChange('preferredPaymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Stripe (Recommended)</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.preferredPaymentMethod === 'stripe' && (
              <div>
                <Label htmlFor="stripeAccountId">Stripe Account ID (Optional)</Label>
                <Input
                  id="stripeAccountId"
                  placeholder="acct_..."
                  value={formData.stripeAccountId}
                  onChange={(e) => handleInputChange('stripeAccountId', e.target.value)}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryContact">Primary Contact Name *</Label>
                <Input
                  id="primaryContact"
                  value={formData.primaryContact}
                  onChange={(e) => handleInputChange('primaryContact', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="primaryPhone">Primary Contact Phone *</Label>
                <Input
                  id="primaryPhone"
                  type="tel"
                  value={formData.primaryPhone}
                  onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="secondaryContact">Secondary Contact Name</Label>
                <Input
                  id="secondaryContact"
                  value={formData.secondaryContact}
                  onChange={(e) => handleInputChange('secondaryContact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="secondaryPhone">Secondary Contact Phone</Label>
                <Input
                  id="secondaryPhone"
                  type="tel"
                  value={formData.secondaryPhone}
                  onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  required
                />
                <Label htmlFor="agreeToTerms">I agree to the Merchant Terms of Service *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToPricing"
                  checked={formData.agreeToPricing}
                  onCheckedChange={(checked) => handleInputChange('agreeToPricing', checked)}
                  required
                />
                <Label htmlFor="agreeToPricing">I agree to the pricing structure (no platform fees) *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToQualityStandards"
                  checked={formData.agreeToQualityStandards}
                  onCheckedChange={(checked) => handleInputChange('agreeToQualityStandards', checked)}
                  required
                />
                <Label htmlFor="agreeToQualityStandards">I agree to maintain quality standards *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToBackgroundCheck"
                  checked={formData.agreeToBackgroundCheck}
                  onCheckedChange={(checked) => handleInputChange('agreeToBackgroundCheck', checked)}
                  required
                />
                <Label htmlFor="agreeToBackgroundCheck">I consent to business verification *</Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Merchant Application</h1>
        <p className="text-xl text-muted-foreground">
          Partner with MyPartsRunner and grow your business with fast, reliable delivery
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background border-muted-foreground'
                }`}>
                  {currentStep > step.number ? (
                    <Checkbox className="h-4 w-4" checked />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">Step {step.number}</p>
                  <p className="text-xs text-muted-foreground">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Form */}
      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            Please provide accurate information. All fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={isSubmitting}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Benefits Reminder */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Partner with MyPartsRunner?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Zero Platform Fees</h4>
              <p className="text-sm text-muted-foreground">No monthly fees or commission on sales</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">Increased Sales</h4>
              <p className="text-sm text-muted-foreground">Reach customers who prefer delivery</p>
            </div>
            <div className="text-center">
              <Store className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold">Easy Integration</h4>
              <p className="text-sm text-muted-foreground">Simple setup with your existing systems</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantApplicationPage; 