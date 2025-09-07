import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle, Mail, FileText, Car, Shield, AlertCircle } from 'lucide-react';

const DriverApplicationPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, updateUserProfile } = useAppContext();
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Vehicle Information
    vehicleType: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    licensePlate: '',
    vehicleColor: '',
    
    // Payment Information
    paymentMethod: '',
    cashAppUsername: '',
    venmoUsername: '',
    
    // Emergency Contact
    emergencyContact: '',
    emergencyPhone: '',
    
    // Document Email Confirmation
    documentsSentViaEmail: false,
    
    // Agreements
    agreeToTerms: false,
    agreeToVehicleInspection: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(true);

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

  const handleChange = (field: string, value: any) => {
    console.log('handleChange called:', field, value);
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New form data:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = [
        { field: 'firstName', label: 'First Name' },
        { field: 'lastName', label: 'Last Name' },
        { field: 'email', label: 'Email' },
        { field: 'phone', label: 'Phone' },
        { field: 'address', label: 'Address' },
        { field: 'city', label: 'City' },
        { field: 'state', label: 'State' },
        { field: 'zipCode', label: 'ZIP Code' },
        { field: 'vehicleType', label: 'Vehicle Type' },
        { field: 'vehicleMake', label: 'Vehicle Make' },
        { field: 'vehicleModel', label: 'Vehicle Model' },
        { field: 'vehicleYear', label: 'Vehicle Year' },
        { field: 'licensePlate', label: 'License Plate' },
        { field: 'vehicleColor', label: 'Vehicle Color' },
        { field: 'paymentMethod', label: 'Payment Method' },
        { field: 'emergencyContact', label: 'Emergency Contact' },
        { field: 'emergencyPhone', label: 'Emergency Phone' },
      ];

      const missingField = requiredFields.find(({ field }) => !formData[field as keyof typeof formData]);
      if (missingField) {
        toast({
          title: "Missing Required Information",
          description: `Please fill in the ${missingField.label} field.`,
          variant: "destructive",
        });
        return;
      }

      // Validate document email confirmation
      if (!formData.documentsSentViaEmail) {
        toast({
          title: "Document Confirmation Required",
          description: "Please confirm that you have sent your driver's license and insurance documents via email.",
          variant: "destructive",
        });
        return;
      }

      // Validate required agreements
      if (!formData.agreeToTerms || !formData.agreeToVehicleInspection) {
        toast({
          title: "Agreements Required",
          description: "Please agree to all required terms and conditions.",
          variant: "destructive",
        });
        return;
      }

      // Prepare data for database
      const applicationData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        vehicle_type: formData.vehicleType,
        vehicle_make: formData.vehicleMake,
        vehicle_model: formData.vehicleModel,
        vehicle_year: formData.vehicleYear,
        license_plate: formData.licensePlate,
        vehicle_color: formData.vehicleColor,
        payment_method: formData.paymentMethod,
        cash_app_username: formData.cashAppUsername,
        venmo_username: formData.venmoUsername,
        emergency_contact: formData.emergencyContact,
        emergency_phone: formData.emergencyPhone,
        documents_sent_via_email: formData.documentsSentViaEmail,
        agree_to_terms: formData.agreeToTerms,
        agree_to_vehicle_inspection: formData.agreeToVehicleInspection,
        // Set default values for removed fields
        status: 'approved', // Auto-approve since we're simplifying
        is_active: true,
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
        description: `🎉 Congratulations! You're now fully onboarded and can accept deliveries. You can start earning money right away!`,
      });

      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Application submission error:', error);
      toast({
        title: "Application Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone && 
               formData.address && formData.city && formData.state && formData.zipCode;
      case 2:
        return formData.vehicleType && formData.vehicleMake && formData.vehicleModel && 
               formData.vehicleYear && formData.licensePlate && formData.vehicleColor && 
               formData.paymentMethod && formData.emergencyContact && formData.emergencyPhone;
      case 3:
        return formData.documentsSentViaEmail;
      case 4:
        return formData.agreeToTerms && formData.agreeToVehicleInspection;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isCurrentStepValid()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoadingApplication) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading application...</p>
        </div>
      </div>
    );
  }

  if (existingApplication) {
    return (
      <div className="min-h-screen animated-bg">
        <div className="container mx-auto py-10 px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Application Already Submitted</CardTitle>
              <CardDescription>
                You have already submitted a driver application. You can now go online and start accepting deliveries!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button onClick={() => navigate('/dashboard')} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mb-4 text-gray-300 hover:text-cyan-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Driver</span>{' '}
              <span className="neon-text">Application</span>
            </h1>
            <p className="text-gray-300">Complete your onboarding to start earning as a MyPartsRunner driver</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep 
                      ? 'bg-cyan-400 text-black' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Labels */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-16 text-sm">
              <span className={currentStep >= 1 ? 'text-cyan-400' : 'text-gray-500'}>Personal Info</span>
              <span className={currentStep >= 2 ? 'text-cyan-400' : 'text-gray-500'}>Vehicle Info</span>
              <span className={currentStep >= 3 ? 'text-cyan-400' : 'text-gray-500'}>Documents</span>
              <span className={currentStep >= 4 ? 'text-cyan-400' : 'text-gray-500'}>Review</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="bg-gray-900/90 border border-gray-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {currentStep === 1 && <Car className="h-5 w-5 text-cyan-400" />}
                  {currentStep === 2 && <Car className="h-5 w-5 text-cyan-400" />}
                  {currentStep === 3 && <FileText className="h-5 w-5 text-cyan-400" />}
                  {currentStep === 4 && <CheckCircle className="h-5 w-5 text-cyan-400" />}
                  {currentStep === 1 && 'Personal Information'}
                  {currentStep === 2 && 'Vehicle Information'}
                  {currentStep === 3 && 'Document Submission'}
                  {currentStep === 4 && 'Review & Submit'}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {currentStep === 1 && 'Tell us about yourself'}
                  {currentStep === 2 && 'Tell us about your vehicle'}
                  {currentStep === 3 && 'Submit your documents via email'}
                  {currentStep === 4 && 'Review your information and submit'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => {
                          console.log('firstName onChange:', e.target.value);
                          handleChange('firstName', e.target.value);
                        }}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                        placeholder="Enter your first name"
                      />
                      <p className="text-xs text-gray-400 mt-1">Current value: {formData.firstName}</p>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => {
                          console.log('lastName onChange:', e.target.value);
                          handleChange('lastName', e.target.value);
                        }}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                        placeholder="Enter your last name"
                      />
                      <p className="text-xs text-gray-400 mt-1">Current value: {formData.lastName}</p>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                        readOnly={!!user?.email}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address" className="text-white">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-white">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-white">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleChange('zipCode', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Vehicle Information */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="vehicleType" className="text-white">Vehicle Type *</Label>
                      <Select value={formData.vehicleType} onValueChange={(value) => handleChange('vehicleType', value)}>
                        <SelectTrigger className="bg-white text-black border-gray-300 focus:border-cyan-400">
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
                    <div>
                      <Label htmlFor="vehicleMake" className="text-white">Vehicle Make *</Label>
                      <Input
                        id="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={(e) => handleChange('vehicleMake', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleModel" className="text-white">Vehicle Model *</Label>
                      <Input
                        id="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={(e) => handleChange('vehicleModel', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleYear" className="text-white">Vehicle Year *</Label>
                      <Input
                        id="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={(e) => handleChange('vehicleYear', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="licensePlate" className="text-white">License Plate *</Label>
                      <Input
                        id="licensePlate"
                        value={formData.licensePlate}
                        onChange={(e) => handleChange('licensePlate', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vehicleColor" className="text-white">Vehicle Color *</Label>
                      <Input
                        id="vehicleColor"
                        value={formData.vehicleColor}
                        onChange={(e) => handleChange('vehicleColor', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="paymentMethod" className="text-white">Preferred Payment Method *</Label>
                      <Select value={formData.paymentMethod} onValueChange={(value) => handleChange('paymentMethod', value)}>
                        <SelectTrigger className="bg-white text-black border-gray-300 focus:border-cyan-400">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cashapp">Cash App</SelectItem>
                          <SelectItem value="venmo">Venmo</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {formData.paymentMethod === 'cashapp' && (
                      <div>
                        <Label htmlFor="cashAppUsername" className="text-white">Cash App Username</Label>
                        <Input
                          id="cashAppUsername"
                          value={formData.cashAppUsername}
                          onChange={(e) => handleChange('cashAppUsername', e.target.value)}
                          className="bg-white text-black border-gray-300 focus:border-cyan-400"
                        />
                      </div>
                    )}
                    {formData.paymentMethod === 'venmo' && (
                      <div>
                        <Label htmlFor="venmoUsername" className="text-white">Venmo Username</Label>
                        <Input
                          id="venmoUsername"
                          value={formData.venmoUsername}
                          onChange={(e) => handleChange('venmoUsername', e.target.value)}
                          className="bg-white text-black border-gray-300 focus:border-cyan-400"
                        />
                      </div>
                    )}
                    <div>
                      <Label htmlFor="emergencyContact" className="text-white">Emergency Contact Name *</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleChange('emergencyContact', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone" className="text-white">Emergency Contact Phone *</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                        required
                        className="bg-white text-black border-gray-300 focus:border-cyan-400"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Document Submission */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Mail className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-semibold text-blue-800 mb-2">Document Submission via Email</h3>
                          <p className="text-blue-700 mb-4">
                            Please send the following documents to <strong>infomypartsrunner@gmail.com</strong>:
                          </p>
                          <ul className="list-disc list-inside text-blue-700 space-y-1 mb-4">
                            <li>Driver's License (Front & Back)</li>
                            <li>Insurance Verification</li>
                          </ul>
                          <p className="text-sm text-blue-600">
                            Include your name and email address in the email subject line for faster processing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="documentsSentViaEmail"
                        checked={formData.documentsSentViaEmail}
                        onCheckedChange={(checked) => handleChange('documentsSentViaEmail', checked)}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="documentsSentViaEmail" className="text-sm font-medium">
                          I confirm that I have sent my driver's license and insurance documents to infomypartsrunner@gmail.com
                        </Label>
                        <p className="text-sm text-gray-500">
                          This confirmation is required to complete your application.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Personal Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                          <p><strong>Email:</strong> {formData.email}</p>
                          <p><strong>Phone:</strong> {formData.phone}</p>
                          <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-3">Vehicle Information</h3>
                        <div className="space-y-2 text-sm">
                          <p><strong>Vehicle:</strong> {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}</p>
                          <p><strong>Type:</strong> {formData.vehicleType}</p>
                          <p><strong>Color:</strong> {formData.vehicleColor}</p>
                          <p><strong>License Plate:</strong> {formData.licensePlate}</p>
                          <p><strong>Payment:</strong> {formData.paymentMethod}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-green-800">Documents Confirmed</span>
                      </div>
                      <p className="text-sm text-green-700">
                        You have confirmed that you sent your driver's license and insurance documents via email.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleChange('agreeToTerms', checked)}
                        />
                        <Label htmlFor="agreeToTerms" className="text-sm">
                          I agree to the <a href="/terms-of-service" className="text-cyan-400 hover:underline">Terms of Service</a> and <a href="/privacy-policy" className="text-cyan-400 hover:underline">Privacy Policy</a>
                        </Label>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreeToVehicleInspection"
                          checked={formData.agreeToVehicleInspection}
                          onCheckedChange={(checked) => handleChange('agreeToVehicleInspection', checked)}
                        />
                        <Label htmlFor="agreeToVehicleInspection" className="text-sm">
                          I agree to vehicle inspection requirements and safety standards
                        </Label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="border-gray-600 text-gray-300 hover:border-cyan-400 hover:text-cyan-400"
                  >
                    Previous
                  </Button>
                  {currentStep < 4 ? (
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      disabled={!isCurrentStepValid()}
                      className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 disabled:bg-gray-600 disabled:text-gray-400"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-green-400 hover:bg-green-500 text-black font-semibold px-8"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverApplicationPage;