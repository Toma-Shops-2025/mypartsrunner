import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import DriverAppOptions from './DriverAppOptions';
import DriverStatusWidget from './DriverStatusWidget';
import DriverEarningsWidget from './DriverEarningsWidget';
import { 
  Car, 
  MapPin, 
  Clock, 
  DollarSign, 
  Activity, 
  Navigation,
  Zap,
  AlertCircle,
  CheckCircle,
  FileText,
  Eye,
  Calendar,
  User,
  Truck,
  Package,
  RefreshCw,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useDriverStatus } from '@/hooks/use-driver-status';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

interface DriverApplication {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  created_at: string;
  updated_at: string;
  admin_notes?: string;
}

export default function DriverDashboard() {
  const { user } = useAppContext();
  const { status, goOnline, goOffline, checkDriverApplicationStatus } = useDriverStatus();
  const [application, setApplication] = useState<DriverApplication | null>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  // Load application status on component mount
  useEffect(() => {
    loadApplicationStatus();
  }, []);

  const loadApplicationStatus = async () => {
    try {
      setLoadingApplication(true);
      const appStatus = await checkDriverApplicationStatus();
      setApplication(appStatus);
    } catch (error) {
      console.error('Error loading application status:', error);
    } finally {
      setLoadingApplication(false);
    }
  };

  const refreshApplicationStatus = async () => {
    try {
      setRefreshingStatus(true);
      await loadApplicationStatus();
      toast({
        title: "Status refreshed",
        description: "Application status has been updated",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Could not refresh application status",
        variant: "destructive"
      });
    } finally {
      setRefreshingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      case 'rejected': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (application: DriverApplication) => {
    const submittedDate = new Date(application.created_at).toLocaleDateString();
    
    switch (application.status) {
      case 'approved':
        return `Your application was approved! You can now go online to start accepting deliveries.`;
      case 'pending':
        return `Your application submitted on ${submittedDate} is pending review. You'll be notified once it's processed.`;
      case 'under_review':
        return `Your application is currently under review by our team. This usually takes 1-2 business days.`;
      case 'rejected':
        return `Your application was not approved. ${application.admin_notes ? `Reason: ${application.admin_notes}` : 'Please contact support for more information.'}`;
      default:
        return 'Unknown application status. Please contact support.';
    }
  };

  const mockEarnings = {
    today: 157.50,
    week: 832.25,
    month: 3247.80,
    deliveries: 23
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Driver Dashboard</h1>
        <p className="text-gray-600">Manage your deliveries and track your earnings</p>
      </div>

      {/* Enhanced Driver Status Widget */}
      <DriverStatusWidget />

      {/* Driver Earnings Widget */}
      <DriverEarningsWidget />

      {/* Application Status Card */}
      {loadingApplication ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
              <p>Checking your application status...</p>
            </div>
          </CardContent>
        </Card>
      ) : application ? (
        <Card className={`border-2 ${getStatusColor(application.status)}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon(application.status)}
                Driver Application Status
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={refreshApplicationStatus}
                  disabled={refreshingStatus}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshingStatus ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className={`${getStatusColor(application.status)} border-2`}>
              <AlertDescription>
                {getStatusMessage(application)}
              </AlertDescription>
            </Alert>

            {application.status === 'approved' && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">🎉 Congratulations!</span>
                </div>
                <p className="text-sm text-green-700">
                  You're approved to drive with MyPartsRunner! Click "Go Online" below to start accepting delivery requests.
                </p>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="mt-4 flex gap-3">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Reapply
                </Button>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
              Application submitted: {new Date(application.created_at).toLocaleString()}
              {application.updated_at !== application.created_at && (
                <> • Last updated: {new Date(application.updated_at).toLocaleString()}</>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              No Driver Application Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-orange-200 bg-orange-50">
              <AlertDescription>
                You need to submit a driver application before you can go online for deliveries.
              </AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button asChild>
                <a href="/driver-application">
                  <FileText className="mr-2 h-4 w-4" />
                  Submit Driver Application
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Online Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Driver Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="font-medium">
                {status.isOnline ? 'Online' : 'Offline'}
              </span>
              {status.isOnline && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Available for deliveries
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              {!status.isOnline ? (
                <Button onClick={goOnline} className="bg-green-600 hover:bg-green-700">
                  <Zap className="mr-2 h-4 w-4" />
                  Go Online
                </Button>
              ) : (
                <Button variant="outline" onClick={goOffline}>
                  <Activity className="mr-2 h-4 w-4" />
                  Go Offline
                </Button>
              )}
            </div>
          </div>

          {/* Status Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Last Active</div>
                <div className="text-sm text-gray-600">
                  {status.lastActive.toLocaleTimeString()}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <div className="font-medium">Location Tracking</div>
                <div className="text-sm text-gray-600">
                  {status.isTrackingLocation ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>

          {/* Go Online Instructions */}
          {!status.isOnline && application?.status !== 'approved' && (
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>How to Go Online:</strong> Click "Go Online" to check your application status and start accepting deliveries. 
                {!application && ' You\'ll be guided through the application process if needed.'}
                {application && application.status !== 'approved' && ' Your application status will be displayed automatically.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Earnings Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Today</div>
                <div className="text-xl font-bold">${mockEarnings.today}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">This Week</div>
                <div className="text-xl font-bold">${mockEarnings.week}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">This Month</div>
                <div className="text-xl font-bold">${mockEarnings.month}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Deliveries</div>
                <div className="text-xl font-bold">{mockEarnings.deliveries}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-12" asChild>
              <a href="/driver-earnings">
                <DollarSign className="mr-2 h-4 w-4" />
                View Earnings
              </a>
            </Button>
            
            <Button variant="outline" className="h-12" asChild>
              <a href="/driver-profile">
                <User className="mr-2 h-4 w-4" />
                Edit Profile
              </a>
            </Button>
            
            <Button variant="outline" className="h-12" asChild>
              <a href="/map">
                <Navigation className="mr-2 h-4 w-4" />
                View Map
              </a>
            </Button>
            
            <Button variant="outline" className="h-12" asChild>
              <a href="/help">
                <FileText className="mr-2 h-4 w-4" />
                Get Help
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Driver App Options */}
      <DriverAppOptions />
    </div>
  );
} 