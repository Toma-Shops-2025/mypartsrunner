import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  documentsSentViaEmail: boolean;
  agreeToTerms: boolean;
  agreeToVehicleInspection: boolean;
}

const DriverApplicationPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    documentsSentViaEmail: false,
    agreeToTerms: false,
    agreeToVehicleInspection: false,
  });

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email && formData.phone && formData.address && formData.city && formData.state && formData.zipCode);
      case 2:
        return !!(formData.vehicleYear && formData.vehicleMake && formData.vehicleModel && formData.vehicleColor && formData.licensePlate);
      case 3:
        return formData.documentsSentViaEmail;
      case 4:
        return formData.agreeToTerms && formData.agreeToVehicleInspection;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid(4)) {
      toast({
        title: "Please complete all required fields",
        description: "Make sure all steps are completed before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to database
      const { error } = await supabase
        .from('driver_applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          vehicle_year: formData.vehicleYear,
          vehicle_make: formData.vehicleMake,
          vehicle_model: formData.vehicleModel,
          vehicle_color: formData.vehicleColor,
          license_plate: formData.licensePlate,
          documents_sent_via_email: formData.documentsSentViaEmail,
          agree_to_terms: formData.agreeToTerms,
          agree_to_vehicle_inspection: formData.agreeToVehicleInspection,
          status: 'approved',
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (error) {
        throw error;
      }

      // Update user profile to mark onboarding complete
      await updateUserProfile({ onboardingComplete: true });

      toast({
        title: "🎉 Onboarding Complete!",
        description: "You're now approved and can start accepting deliveries immediately!",
      });

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Driver Onboarding</h1>
          <p className="text-gray-300">Complete your application to start driving</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step <= currentStep ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-cyan-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Personal Info</span>
            <span>Vehicle Info</span>
            <span>Documents</span>
            <span>Review</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white text-2xl">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Vehicle Information"}
              {currentStep === 3 && "Document Submission"}
              {currentStep === 4 && "Review & Submit"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Tell us about your vehicle"}
              {currentStep === 3 && "Submit your documents via email"}
              {currentStep === 4 && "Review your information and submit"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white block mb-2">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white block mb-2">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white block mb-2">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your email"
                    readOnly={!!user?.email}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white block mb-2">Phone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-white block mb-2">Address *</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="text-white block mb-2">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-white block mb-2">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode" className="text-white block mb-2">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your ZIP code"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Vehicle Information */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleYear" className="text-white block mb-2">Vehicle Year *</Label>
                  <Input
                    id="vehicleYear"
                    type="text"
                    value={formData.vehicleYear}
                    onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="e.g., 2020"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleMake" className="text-white block mb-2">Vehicle Make *</Label>
                  <Input
                    id="vehicleMake"
                    type="text"
                    value={formData.vehicleMake}
                    onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="e.g., Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel" className="text-white block mb-2">Vehicle Model *</Label>
                  <Input
                    id="vehicleModel"
                    type="text"
                    value={formData.vehicleModel}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="e.g., Camry"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleColor" className="text-white block mb-2">Vehicle Color *</Label>
                  <Input
                    id="vehicleColor"
                    type="text"
                    value={formData.vehicleColor}
                    onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="e.g., Silver"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="licensePlate" className="text-white block mb-2">License Plate *</Label>
                  <Input
                    id="licensePlate"
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    className="bg-white text-black border-gray-300"
                    placeholder="Enter your license plate number"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Document Submission */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Document Submission Required:</strong> Please email the following documents to <strong>infomypartsrunner@gmail.com</strong>
                  </AlertDescription>
                </Alert>

                <div className="bg-white/10 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Required Documents:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Driver's License (Front & Back)</li>
                    <li>• Vehicle Insurance Card</li>
                  </ul>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentsSentViaEmail"
                    checked={formData.documentsSentViaEmail}
                    onCheckedChange={(checked) => handleInputChange('documentsSentViaEmail', checked as boolean)}
                  />
                  <Label htmlFor="documentsSentViaEmail" className="text-white">
                    I have sent my documents to infomypartsrunner@gmail.com
                  </Label>
                </div>
              </div>
            )}

            {/* Step 4: Review & Submit */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">Personal Information</h3>
                    <div className="text-gray-300 space-y-1">
                      <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <h3 className="text-white font-semibold mb-3">Vehicle Information</h3>
                    <div className="text-gray-300 space-y-1">
                      <p><strong>Vehicle:</strong> {formData.vehicleYear} {formData.vehicleMake} {formData.vehicleModel}</p>
                      <p><strong>Color:</strong> {formData.vehicleColor}</p>
                      <p><strong>License Plate:</strong> {formData.licensePlate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms" className="text-white">
                      I agree to the Terms of Service and Driver Agreement
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToVehicleInspection"
                      checked={formData.agreeToVehicleInspection}
                      onCheckedChange={(checked) => handleInputChange('agreeToVehicleInspection', checked as boolean)}
                    />
                    <Label htmlFor="agreeToVehicleInspection" className="text-white">
                      I agree to vehicle inspection requirements
                    </Label>
                  </div>
                </div>

                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Auto-Approval:</strong> Upon submission, you will be automatically approved and can start accepting deliveries immediately!
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/20">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-transparent border-white/30 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid(4) || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DriverApplicationPage;