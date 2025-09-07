import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';
import { DocumentUpload } from '@/components/DocumentUpload';
import DriverAppOptions from '@/components/DriverAppOptions';

const DriverApplicationPage: React.FC = () => {
  const { toast } = useToast();
  const { user, updateUserProfile } = useAppContext();
  
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
    emergencyContact: '',
    emergencyPhone: '',
    
    // Agreements
    agreeToTerms: false,
    agreeToVehicleInspection: false,
    
    // Document Uploads
    driverLicenseUrl: '',
    insuranceCardUrl: '',
    vehicleRegistrationUrl: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);

  const steps = [
    { number: 1, title: "Personal Information", icon: <User className="h-4 w-4" /> },
    { number: 2, title: "Driver License", icon: <Shield className="h-4 w-4" /> },
    { number: 3, title: "Vehicle Information", icon: <Car className="h-4 w-4" /> },
    { number: 4, title: "Insurance", icon: <FileText className="h-4 w-4" /> },
    { number: 5, title: "Experience & Availability", icon: <MapPin className="h-4 w-4" /> },
    { number: 6, title: "Payment & Agreements", icon: <DollarSign className="h-4 w-4" /> }
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

  // Check for existing application when component loads
  useEffect(() => {
    const checkExistingApplication = async () => {
      if (!user?.email) {
        setIsLoadingApplication(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('driver_applications')
          .select('*')
          .eq('email', user.email)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking existing application:', error);
        } else if (data) {
          setExistingApplication(data);
        }
      } catch (error) {
        console.error('Error checking existing application:', error);
      } finally {
        setIsLoadingApplication(false);
      }
    };

    checkExistingApplication();
  }, [user?.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required agreements
      if (!formData.agreeToTerms || !formData.agreeToVehicleInspection) {
        toast({
          title: "Agreements Required",
          description: "Please agree to all required terms and conditions.",
          variant: "destructive",
        });
        return;
      }

      // Prepare minimal data for database (test with basic fields only)
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        agree_to_terms: formData.agreeToTerms,
        agree_to_vehicle_inspection: formData.agreeToVehicleInspection,
      };

      // Insert application into database
      const { data, error } = await supabase
        .from('driver_applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Failed to save application: ${error.message}`);
      }

        // Update user's onboarding status to complete
        try {
          await updateUserProfile({ onboardingComplete: true });
        } catch (profileError) {
          console.warn('Could not update onboarding status:', profileError);
        }

        toast({
          title: "Application Submitted Successfully!",
          description: `🎉 Congratulations! You're now fully onboarded and can accept deliveries. Your application ID is: ${data.id}. You can start earning money right away!`,
        });
      
      // Reset form
      setFormData({
        firstName: '', lastName: '', email: '', phone: '', dateOfBirth: '',
            address: '', city: '', state: '', zipCode: '', licenseNumber: '',
    licenseState: '', licenseExpiry: '', hasCommercialLicense: false,
    vehicleType: '', vehicleMake: '', vehicleModel: '', vehicleYear: '',
    licensePlate: '', vehicleColor: '', insuranceCompany: '', policyNumber: '',
    policyExpiry: '', hasCommercialInsurance: false, drivingExperience: '',
    preferredAreas: '', availability: [], maxDistance: '', paymentMethod: '',
        cashAppUsername: '', venmoUsername: '', emergencyContact: '', emergencyPhone: '',
        agreeToTerms: false,
        agreeToVehicleInspection: false, driverLicenseUrl: '', insuranceCardUrl: '',
        vehicleRegistrationUrl: ''
      });
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting your application. Please try again.",
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
            
            <DocumentUpload
              label="Driver's License Photo"
              description="Upload a clear photo of your driver's license (front only)"
              required
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={5}
              value={formData.driverLicenseUrl}
              onChange={(url) => handleInputChange('driverLicenseUrl', url)}
              onRemove={() => handleInputChange('driverLicenseUrl', '')}
              placeholder="Upload your driver's license photo"
              folder="drivers-license"
            />
            
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you see an error message but your license photo appears in the viewer below, 
                your upload was successful and you can continue to the next step.
              </p>
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
            
            <DocumentUpload
              label="Vehicle Registration"
              description="Upload a photo of your vehicle registration document"
              required
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
              maxSizeMB={5}
              value={formData.vehicleRegistrationUrl}
              onChange={(url) => handleInputChange('vehicleRegistrationUrl', url)}
              onRemove={() => handleInputChange('vehicleRegistrationUrl', '')}
              placeholder="Upload your vehicle registration"
              folder="vehicle-registration"
            />
            
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you see an error message but your registration document appears in the viewer below, 
                your upload was successful and you can continue to the next step.
              </p>
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
            
            <DocumentUpload
              label="Insurance Card"
              description="Upload a photo of your insurance card or policy document"
              required
              acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
              maxSizeMB={5}
              value={formData.insuranceCardUrl}
              onChange={(url) => handleInputChange('insuranceCardUrl', url)}
              onRemove={() => handleInputChange('insuranceCardUrl', '')}
              placeholder="Upload your insurance card"
              folder="insurance"
            />
            
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> If you see an error message but your insurance card appears in the viewer below, 
                your upload was successful and you can continue to the next step.
              </p>
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

      {/* Auto-Approval Notice */}
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="bg-green-100 rounded-full p-3">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-3">
              🚀 Automatic Approval Process
            </h2>
            <div className="text-green-700 space-y-2 max-w-4xl mx-auto">
              <p className="text-lg font-medium">
                Once your onboarding application is completely finished and submitted, you will automatically be approved to go online and start driving and delivering immediately while your application is being processed.
              </p>
              <p className="text-base">
                If any problems occur during this process, you will be notified promptly and decisive action will occur depending on the level of severity.
              </p>
              <p className="text-lg font-bold text-green-800 mt-4">
                Welcome to the MyPartsRunner delivery team. You can go online immediately!!!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Status */}
      {!isLoadingApplication && existingApplication && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Shield className="h-5 w-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge 
                  variant={
                    existingApplication.status === 'approved' ? 'default' :
                    existingApplication.status === 'rejected' ? 'destructive' :
                    existingApplication.status === 'under_review' ? 'secondary' :
                    'outline'
                  }
                >
                  {existingApplication.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Application ID:</span>
                <span className="font-mono text-sm">{existingApplication.id}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="font-medium">Submitted:</span>
                <span>{new Date(existingApplication.created_at).toLocaleDateString()}</span>
              </div>
              
              {existingApplication.admin_notes && (
                <div className="mt-3 p-3 bg-white rounded border">
                  <span className="font-medium text-sm">Admin Notes:</span>
                  <p className="text-sm mt-1">{existingApplication.admin_notes}</p>
                </div>
              )}
              
              {existingApplication.status === 'pending' && (
                <p className="text-sm text-blue-700 mt-2">
                  Your application is being reviewed. We'll contact you within 2-3 business days.
                </p>
              )}
              
              {existingApplication.status === 'approved' && (
                <div className="mt-3 p-3 bg-green-100 rounded border border-green-200">
                  <p className="text-green-800 font-medium">🎉 Congratulations! Your application has been approved!</p>
                  <p className="text-green-700 text-sm mt-1">
                    Please check your email for next steps to complete your driver onboarding.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
      {!existingApplication && (
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
      )}

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

      {/* Driver App Options */}
      <DriverAppOptions />
    </div>
  );
};

export default DriverApplicationPage; 