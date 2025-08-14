import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { 
  Car, 
  User, 
  Shield, 
  FileText, 
  MapPin, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface DriverApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'on_hold';
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  // Vehicle info
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: string;
  // License info
  license_number: string;
  license_state: string;
  license_expiry: string;
}

export default function DriverStatusPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAppContext();
  
  const [application, setApplication] = useState<DriverApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user?.email) {
      loadApplication();
    } else {
      setIsLoading(false);
    }
  }, [user?.email]);

  const loadApplication = async () => {
    try {
      const { data, error } = await supabase
        .from('driver_applications')
        .select('*')
        .eq('email', user?.email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading application:', error);
        toast({
          title: "Error",
          description: "Failed to load application status",
          variant: "destructive",
        });
      } else if (data) {
        setApplication(data);
      }
    } catch (error) {
      console.error('Error loading application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    await loadApplication();
    setIsRefreshing(false);
    toast({
      title: "Status Updated",
      description: "Application status has been refreshed",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'under_review':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'on_hold':
        return <AlertCircle className="h-6 w-6 text-orange-500" />;
      default:
        return <Clock className="h-6 w-6 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your application has been submitted and is waiting for review. This typically takes 2-3 business days.';
      case 'under_review':
        return 'Our team is currently reviewing your application. We may contact you for additional information.';
      case 'approved':
        return 'Congratulations! Your application has been approved. You can now complete the onboarding process.';
      case 'rejected':
        return 'Your application was not approved at this time. Please review the notes below for more information.';
      case 'on_hold':
        return 'Your application is currently on hold. We may need additional information or documents.';
      default:
        return 'Your application status is being processed.';
    }
  };

  const getNextSteps = (status: string) => {
    switch (status) {
      case 'pending':
        return [
          'Wait for our team to review your application',
          'Ensure all submitted documents are current',
          'Check your email for any requests for additional information'
        ];
      case 'under_review':
        return [
          'Respond promptly to any requests for additional information',
          'Keep your contact information up to date',
          'Monitor your email for status updates'
        ];
      case 'approved':
        return [
          'Complete the driver onboarding process',
          'Submit required verification documents',
          'Complete driver training modules',
          'Set up your payment preferences',
          'Start accepting delivery requests'
        ];
      case 'rejected':
        return [
          'Review the rejection reason carefully',
          'Address any issues mentioned in the notes',
          'Consider reapplying in the future if circumstances change',
          'Contact support if you have questions'
        ];
      case 'on_hold':
        return [
          'Review any requests for additional information',
          'Submit missing documents if requested',
          'Contact support to understand what\'s needed',
          'Keep your application information current'
        ];
      default:
        return ['Please wait for further instructions.'];
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading your application status...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
            <CardDescription>
              Please log in to view your driver application status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>No Driver Application Found</CardTitle>
            <CardDescription>
              You haven't submitted a driver application yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              To become a MyPartsRunner driver, you'll need to submit an application first.
            </p>
            <Button onClick={() => navigate('/driver-application')} className="w-full">
              Apply to Become a Driver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Driver Application Status</h1>
        <p className="text-muted-foreground">
          Track your progress and see what's next in your journey to becoming a MyPartsRunner driver.
        </p>
      </div>

      {/* Status Overview */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(application.status)}
              <div>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Current status of your driver application
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={refreshStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Status:</span>
              <Badge className={getStatusColor(application.status)}>
                {application.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Application ID:</span>
              <span className="font-mono text-sm">{application.id}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Submitted:</span>
              <span>{new Date(application.created_at).toLocaleDateString()}</span>
            </div>
            
            {application.updated_at !== application.created_at && (
              <div className="flex items-center justify-between">
                <span className="font-medium">Last Updated:</span>
                <span>{new Date(application.updated_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>What This Status Means</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {getStatusDescription(application.status)}
          </p>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Here's what you need to do next
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getNextSteps(application.status).map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Personal Information
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Name:</strong> {application.first_name} {application.last_name}</div>
                <div><strong>Email:</strong> {application.email}</div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Car className="h-4 w-4" />
                Vehicle Information
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Vehicle:</strong> {application.vehicle_year} {application.vehicle_make} {application.vehicle_model}</div>
                <div><strong>License:</strong> {application.license_number} ({application.license_state})</div>
                <div><strong>Expires:</strong> {new Date(application.license_expiry).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Notes */}
      {application.admin_notes && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-orange-700">{application.admin_notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        {application.status === 'approved' && (
          <Button onClick={() => navigate('/dashboard')} className="flex-1">
            Complete Onboarding
          </Button>
        )}
        
        {application.status === 'rejected' && (
          <Button 
            variant="outline" 
            onClick={() => navigate('/driver-application')} 
            className="flex-1"
          >
            Apply Again
          </Button>
        )}
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/help')} 
          className="flex-1"
        >
          Get Help
        </Button>
      </div>
    </div>
  );
} 