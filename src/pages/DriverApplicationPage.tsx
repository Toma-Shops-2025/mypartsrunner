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
import { Car, User, Shield, FileText, MapPin, DollarSign } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const DriverApplicationPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAppContext();
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Driver Information
    licenseNumber: '',
    licenseState: '',
    licenseExpiry: '',
    hasCommercialLicense: false,
    
    // Vehicle Information
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    vehicleColor: '',
    
    // Insurance Information
    insuranceCompany: '',
    policyNumber: '',
    policyExpiry: '',
    hasCommercialInsurance: false,
    
    // Experience & Availability
    drivingExperience: '',
    preferredAreas: '',
    availability: [] as string[],
    maxDistance: '',
    
    // Payment Information
    paymentMethod: '',
    cashAppUsername: '',
    venmoUsername: '',
    
    // Background & References
    hasCriminalRecord: false,
    criminalRecordDetails: '',
    emergencyContact: '',
    emergencyPhone: '',
    
    // Agreements
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
    agreeToDrugTest: false,
    agreeToVehicleInspection: false
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: "Personal Information", icon: <User className="h-4 w-4" /> },
    { number: 2, title: "Driver License", icon: <Shield className="h-4 w-4" /> },
    { number: 3, title: "Vehicle Information", icon: <Car className="h-4 w-4" /> },
    { number: 4, title: "Insurance", icon: <FileText className="h-4 w-4" /> },
    { number: 5, title: "Experience & Availability", icon: <MapPin className="h-4 w-4" /> },
    { number: 6, title: "Payment & Background", icon: <DollarSign className="h-4 w-4" /> }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvailabilityChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: checked 
        ? [...prev.availability, day]
        : prev.availability.filter(d => d !== day)
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
        description: "Thank you for applying to be a MyPartsRunner driver. We'll review your application and contact you within 2-3 business days.",
      });
      
      // Reset form or redirect
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
        address: '', city: '', state: '', zipCode: '', licenseNumber: '',
        licenseState: '', licenseExpiry: '', hasCommercialLicense: false,
        vehicleType: '', vehicleMake: '', vehicleModel: '', vehicleYear: '',
        licensePlate: '', vehicleColor: '', insuranceCompany: '', policyNumber: '',
        policyExpiry: '', hasCommercialInsurance: false, drivingExperience: '',
        preferredAreas: '', availability: [], maxDistance: '', paymentMethod: '',
        cashAppUsername: '', venmoUsername: '', hasCriminalRecord: false,
        criminalRecordDetails: '', emergencyContact: '', emergencyPhone: '',
        agreeToTerms: false, agreeToBackgroundCheck: false, agreeToDrugTest: false,
        agreeToVehicleInspection: false
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licenseNumber">Driver's License Number *</Label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="licenseState">License State *</Label>
                <Input
                  id="licenseState"
                  value={formData.licenseState}
                  onChange={(e) => handleInputChange('licenseState', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="licenseExpiry">License Expiry Date *</Label>
              <Input
                id="licenseExpiry"
                type="date"
                value={formData.licenseExpiry}
                onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCommercialLicense"
                checked={formData.hasCommercialLicense}
                onCheckedChange={(checked) => handleInputChange('hasCommercialLicense', checked)}
              />
              <Label htmlFor="hasCommercialLicense">I have a commercial driver's license</Label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type *</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">Car</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="truck">Truck</SelectItem>
                  <SelectItem value="van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="vehicleMake">Make *</Label>
                <Input
                  id="vehicleMake"
                  value={formData.vehicleMake}
                  onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleModel">Model *</Label>
                <Input
                  id="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleYear">Year *</Label>
                <Input
                  id="vehicleYear"
                  type="number"
                  min="1990"
                  max="2024"
                  value={formData.vehicleYear}
                  onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="licensePlate">License Plate *</Label>
                <Input
                  id="licensePlate"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="vehicleColor">Color *</Label>
                <Input
                  id="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuranceCompany">Insurance Company *</Label>
                <Input
                  id="insuranceCompany"
                  value={formData.insuranceCompany}
                  onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="policyNumber">Policy Number *</Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => handleInputChange('policyNumber', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="policyExpiry">Policy Expiry Date *</Label>
              <Input
                id="policyExpiry"
                type="date"
                value={formData.policyExpiry}
                onChange={(e) => handleInputChange('policyExpiry', e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCommercialInsurance"
                checked={formData.hasCommercialInsurance}
                onCheckedChange={(checked) => handleInputChange('hasCommercialInsurance', checked)}
              />
              <Label htmlFor="hasCommercialInsurance">I have commercial insurance coverage</Label>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="drivingExperience">Years of Driving Experience *</Label>
              <Select value={formData.drivingExperience} onValueChange={(value) => handleInputChange('drivingExperience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredAreas">Preferred Delivery Areas</Label>
              <Textarea
                id="preferredAreas"
                placeholder="Describe the areas you'd like to deliver in..."
                value={formData.preferredAreas}
                onChange={(e) => handleInputChange('preferredAreas', e.target.value)}
              />
            </div>
            <div>
              <Label>Availability *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.availability.includes(day)}
                      onCheckedChange={(checked) => handleAvailabilityChange(day, checked as boolean)}
                    />
                    <Label htmlFor={day} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="maxDistance">Maximum Delivery Distance (miles)</Label>
              <Input
                id="maxDistance"
                type="number"
                min="5"
                max="100"
                value={formData.maxDistance}
                onChange={(e) => handleInputChange('maxDistance', e.target.value)}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">Preferred Payment Method *</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Direct Deposit (Stripe)</SelectItem>
                  <SelectItem value="cashApp">Cash App</SelectItem>
                  <SelectItem value="venmo">Venmo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.paymentMethod === 'cashApp' && (
              <div>
                <Label htmlFor="cashAppUsername">Cash App Username</Label>
                <Input
                  id="cashAppUsername"
                  value={formData.cashAppUsername}
                  onChange={(e) => handleInputChange('cashAppUsername', e.target.value)}
                />
              </div>
            )}
            {formData.paymentMethod === 'venmo' && (
              <div>
                <Label htmlFor="venmoUsername">Venmo Username</Label>
                <Input
                  id="venmoUsername"
                  value={formData.venmoUsername}
                  onChange={(e) => handleInputChange('venmoUsername', e.target.value)}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasCriminalRecord"
                checked={formData.hasCriminalRecord}
                onCheckedChange={(checked) => handleInputChange('hasCriminalRecord', checked)}
              />
              <Label htmlFor="hasCriminalRecord">I have a criminal record</Label>
            </div>
            {formData.hasCriminalRecord && (
              <div>
                <Label htmlFor="criminalRecordDetails">Please provide details</Label>
                <Textarea
                  id="criminalRecordDetails"
                  placeholder="Please provide details about your criminal record..."
                  value={formData.criminalRecordDetails}
                  onChange={(e) => handleInputChange('criminalRecordDetails', e.target.value)}
                />
              </div>
            )}
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                  required
                />
                <Label htmlFor="agreeToTerms">I agree to the Terms of Service and Driver Agreement *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToBackgroundCheck"
                  checked={formData.agreeToBackgroundCheck}
                  onCheckedChange={(checked) => handleInputChange('agreeToBackgroundCheck', checked)}
                  required
                />
                <Label htmlFor="agreeToBackgroundCheck">I consent to a background check *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToDrugTest"
                  checked={formData.agreeToDrugTest}
                  onCheckedChange={(checked) => handleInputChange('agreeToDrugTest', checked)}
                  required
                />
                <Label htmlFor="agreeToDrugTest">I consent to drug testing *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToVehicleInspection"
                  checked={formData.agreeToVehicleInspection}
                  onCheckedChange={(checked) => handleInputChange('agreeToVehicleInspection', checked)}
                  required
                />
                <Label htmlFor="agreeToVehicleInspection">I consent to vehicle inspection *</Label>
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
        <h1 className="text-4xl font-bold mb-4">Driver Application</h1>
        <p className="text-xl text-muted-foreground">
          Join our team of professional drivers and start earning money today
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
          <CardTitle>Why Drive with MyPartsRunner?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Great Pay</h4>
              <p className="text-sm text-muted-foreground">Earn $15-25 per hour including tips</p>
            </div>
            <div className="text-center">
              <Car className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold">Flexible Schedule</h4>
              <p className="text-sm text-muted-foreground">Work when you want, as much as you want</p>
            </div>
            <div className="text-center">
              <Shield className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold">Insurance Coverage</h4>
              <p className="text-sm text-muted-foreground">Comprehensive coverage while on deliveries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverApplicationPage; 