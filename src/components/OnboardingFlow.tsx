import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Star,
  Car,
  Store,
  User,
  Shield,
  MapPin,
  Camera,
  CreditCard,
  Bell,
  Package,
  Smartphone,
  X,
  Play,
  Info,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  isOptional?: boolean;
  completionAction?: () => Promise<void>;
}

interface OnboardingFlowProps {
  userRole: 'customer' | 'driver' | 'merchant' | 'admin';
  onComplete: () => void;
  onSkip?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  userRole,
  onComplete,
  onSkip
}) => {
  const { user, updateUserProfile } = useAppContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isCompleting, setIsCompleting] = useState(false);

  // Define onboarding steps for each user role
  const getOnboardingSteps = (): OnboardingStep[] => {
    switch (userRole) {
      case 'customer':
        return [
          {
            id: 'welcome',
            title: 'Welcome to MyPartsRunner!',
            description: 'Let\'s get you started with finding and ordering auto parts',
            icon: User,
            content: (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Welcome to MyPartsRunner!</h3>
                <p className="text-gray-600">
                  Find auto parts from local stores and get them delivered quickly by verified drivers.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-sm">Find Parts</h4>
                    <p className="text-xs text-gray-600">Search from 1000+ products</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-sm">Fast Delivery</h4>
                    <p className="text-xs text-gray-600">Average 38 minutes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-sm">Rated 4.7★</h4>
                    <p className="text-xs text-gray-600">Customer satisfaction</p>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'profile',
            title: 'Complete Your Profile',
            description: 'Help us personalize your experience',
            icon: User,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <Input
                      value={formData.firstName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <Input
                      value={formData.lastName || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Information (Optional)</label>
                  <Input
                    value={formData.vehicle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicle: e.target.value }))}
                    placeholder="e.g., 2020 Honda Accord"
                  />
                </div>
              </div>
            )
          },
          {
            id: 'location',
            title: 'Add Your Address',
            description: 'For accurate delivery and nearby store recommendations',
            icon: MapPin,
            content: (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Street Address</label>
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      value={formData.city || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <Input
                      value={formData.zipCode || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="10001"
                    />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Why we need this</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Your address helps us find nearby auto parts stores and provide accurate delivery times.
                  </p>
                </div>
              </div>
            )
          },
          {
            id: 'notifications',
            title: 'Notification Preferences',
            description: 'Stay updated on your orders',
            icon: Bell,
            content: (
              <div className="space-y-4">
                <p className="text-gray-600">Choose how you'd like to receive updates:</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.emailNotifications !== false}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                    <div>
                      <label className="font-medium">Email notifications</label>
                      <p className="text-sm text-gray-600">Order confirmations and delivery updates</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.smsNotifications !== false}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                    <div>
                      <label className="font-medium">SMS notifications</label>
                      <p className="text-sm text-gray-600">Real-time delivery tracking</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={formData.pushNotifications !== false}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                    <div>
                      <label className="font-medium">Push notifications</label>
                      <p className="text-sm text-gray-600">Instant alerts on your device</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        ];

      case 'driver':
        return [
          {
            id: 'welcome',
            title: 'Welcome Driver!',
            description: 'Start earning with flexible delivery opportunities',
            icon: Car,
            content: (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Car className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Welcome to the Driver Program!</h3>
                <p className="text-gray-600">
                  Earn money delivering auto parts with flexible schedules and competitive rates.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">$25/hr</div>
                    <div className="text-sm text-gray-600">Average earnings</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">Flexible</div>
                    <div className="text-sm text-gray-600">Set your schedule</div>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'vehicle',
            title: 'Vehicle Information',
            description: 'Tell us about your delivery vehicle',
            icon: Car,
            content: (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                    <Select
                      value={formData.vehicleType || ''}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="pickup">Pickup Truck</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <Input
                      value={formData.vehicleYear || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleYear: e.target.value }))}
                      placeholder="2020"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Make</label>
                    <Input
                      value={formData.vehicleMake || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleMake: e.target.value }))}
                      placeholder="Honda"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Model</label>
                    <Input
                      value={formData.vehicleModel || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                      placeholder="Accord"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">License Plate</label>
                  <Input
                    value={formData.licensePlate || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value }))}
                    placeholder="ABC123"
                  />
                </div>
              </div>
            )
          },
          {
            id: 'documents',
            title: 'Upload Documents',
            description: 'Required for driver verification',
            icon: Camera,
            content: (
              <div className="space-y-4">
                <p className="text-gray-600">Upload the following documents for verification:</p>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium">Driver's License</h4>
                    <p className="text-sm text-gray-600 mb-3">Upload a clear photo of your driver's license</p>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload License
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium">Vehicle Registration</h4>
                    <p className="text-sm text-gray-600 mb-3">Upload your vehicle registration document</p>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Registration
                    </Button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium">Insurance Card</h4>
                    <p className="text-sm text-gray-600 mb-3">Upload proof of vehicle insurance</p>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Insurance
                    </Button>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'app-tour',
            title: 'Driver App Tour',
            description: 'Learn how to use the driver app effectively',
            icon: Smartphone,
            content: (
              <div className="space-y-4">
                <p className="text-gray-600">Get familiar with key driver app features:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Go Online/Offline</h4>
                      <p className="text-sm text-gray-600">Control when you receive delivery requests</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">GPS Navigation</h4>
                      <p className="text-sm text-gray-600">Optimized routes to pickup and delivery locations</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">Delivery Photos</h4>
                      <p className="text-sm text-gray-600">Take photos to confirm successful deliveries</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Start Interactive Tour
                </Button>
              </div>
            )
          }
        ];

      case 'merchant':
        return [
          {
            id: 'welcome',
            title: 'Welcome Partner!',
            description: 'Expand your reach with delivery services',
            icon: Store,
            content: (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Store className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">Welcome to MyPartsRunner!</h3>
                <p className="text-gray-600">
                  Reach more customers and increase sales with our delivery platform.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">+45%</div>
                    <div className="text-xs text-gray-600">Average sales increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">15mi</div>
                    <div className="text-xs text-gray-600">Delivery radius</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">24/7</div>
                    <div className="text-xs text-gray-600">Platform availability</div>
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'store-info',
            title: 'Store Information',
            description: 'Tell customers about your business',
            icon: Store,
            content: (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Business Name</label>
                  <Input
                    value={formData.businessName || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="AutoZone Downtown"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Description</label>
                  <Textarea
                    value={formData.businessDescription || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                    placeholder="Professional auto parts store serving the community since 1995..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      value={formData.businessPhone || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, businessPhone: e.target.value }))}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Website (Optional)</label>
                    <Input
                      value={formData.website || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="www.autozone.com"
                    />
                  </div>
                </div>
              </div>
            )
          },
          {
            id: 'inventory',
            title: 'Inventory Setup',
            description: 'Start adding your products',
            icon: Package,
            content: (
              <div className="space-y-4">
                <p className="text-gray-600">Choose how to add your inventory:</p>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Manual Entry</h4>
                        <p className="text-sm text-gray-600">Add products one by one</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Bulk Import</h4>
                        <p className="text-sm text-gray-600">Upload CSV file with your inventory</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">API Integration</h4>
                        <p className="text-sm text-gray-600">Connect your existing POS system</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700">
                    Don't worry! You can always add more products later or change your integration method.
                  </p>
                </div>
              </div>
            )
          },
          {
            id: 'payments',
            title: 'Payment Setup',
            description: 'Configure how you receive payments',
            icon: CreditCard,
            content: (
              <div className="space-y-4">
                <p className="text-gray-600">Set up Stripe Connect to receive payments:</p>
                <div className="bg-white border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Stripe Connect</h4>
                      <p className="text-sm text-gray-600">Secure payment processing</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Instant payment processing</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Automatic daily payouts</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Low transaction fees (2.9% + 30¢)</span>
                    </div>
                  </div>
                  <Button className="w-full">
                    Connect with Stripe
                  </Button>
                </div>
              </div>
            )
          }
        ];

      case 'admin':
        return [
          {
            id: 'welcome',
            title: 'Admin Dashboard',
            description: 'Platform management and oversight',
            icon: Shield,
            content: (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Admin Access Granted</h3>
                <p className="text-gray-600">
                  You have full access to platform management and monitoring tools.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-blue-600">15,420</div>
                    <div className="text-xs text-gray-600">Platform users</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-xl font-bold text-green-600">98.5%</div>
                    <div className="text-xs text-gray-600">System uptime</div>
                  </div>
                </div>
              </div>
            )
          }
        ];

      default:
        return [];
    }
  };

  const steps = getOnboardingSteps();
  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStepData?.completionAction) {
      setIsCompleting(true);
      try {
        await currentStepData.completionAction();
      } catch (error) {
        console.error('Step completion failed:', error);
      } finally {
        setIsCompleting(false);
      }
    }

    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Save onboarding data to user profile
      try {
        await updateUserProfile({
          ...formData,
          onboardingCompleted: true,
          onboardingCompletedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to save onboarding data:', error);
      }
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkipStep = () => {
    if (currentStepData?.isOptional) {
      handleNext();
    }
  };

  const canProceed = () => {
    // Add validation logic based on step requirements
    switch (currentStepData?.id) {
      case 'profile':
        return formData.firstName && formData.lastName;
      case 'location':
        return formData.address && formData.city && formData.zipCode;
      case 'vehicle':
        return formData.vehicleType && formData.vehicleYear;
      case 'store-info':
        return formData.businessName && formData.businessDescription;
      default:
        return true;
    }
  };

  if (!currentStepData) {
    return null;
  }

  const IconComponent = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-blue-100 text-sm">{currentStepData.description}</p>
              </div>
            </div>
            {onSkip && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="bg-white bg-opacity-20" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            {currentStepData.isOptional && (
              <Button variant="ghost" onClick={handleSkipStep}>
                Skip
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            {currentStep === steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isCompleting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed() || isCompleting}
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 