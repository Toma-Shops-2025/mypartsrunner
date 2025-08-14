import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import { DocumentViewer } from '@/components/DocumentViewer';
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
  Eye,
  RefreshCw,
  Filter
} from 'lucide-react';

interface DriverApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
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
  license_plate: string;
  // License info
  license_number: string;
  license_state: string;
  license_expiry: string;
  has_commercial_license: boolean;
  // Insurance info
  insurance_company: string;
  policy_number: string;
  policy_expiry: string;
  has_commercial_insurance: boolean;
  // Experience
  driving_experience: string;
  preferred_areas: string;
  availability: string[];
  max_distance: string;
  // Payment
  payment_method: string;
  cash_app_username?: string;
  venmo_username?: string;
  // Background
  has_criminal_record: boolean;
  criminal_record_details?: string;
  emergency_contact: string;
  emergency_phone: string;
  // Documents
  driver_license_url?: string;
  insurance_card_url?: string;
  vehicle_registration_url?: string;
  background_check_consent_url?: string;
}

export default function AdminDriverReviewPage() {
  const { toast } = useToast();
  const { user } = useAppContext();
  
  const [applications, setApplications] = useState<DriverApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<DriverApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadApplications();
    } else {
      setIsLoading(false);
    }
  }, [user?.role, statusFilter]);

  const loadApplications = async () => {
    try {
      let query = supabase
        .from('driver_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading applications:', error);
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        });
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async () => {
    if (!selectedApplication || !newStatus || !adminNotes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a new status and admin notes",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('driver_applications')
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedApplication.id);

      if (error) {
        throw new Error(error.message);
      }

      // Send email notification
      await sendStatusUpdateEmail(selectedApplication, newStatus, adminNotes);

      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}`,
      });

      // Refresh applications and close modal
      await loadApplications();
      setSelectedApplication(null);
      setAdminNotes('');
      setNewStatus('');
      
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const sendStatusUpdateEmail = async (application: DriverApplication, status: string, notes: string) => {
    try {
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_update',
          to: application.email,
          applicationData: application,
          status: status,
          adminNotes: notes
        })
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'outline',
      under_review: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      on_hold: 'secondary'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status === status).length;
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You must be an admin to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading driver applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Driver Application Review</h1>
        <p className="text-muted-foreground">
          Review and manage driver applications for MyPartsRunner.
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getStatusCount('pending')}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{getStatusCount('under_review')}</div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getStatusCount('approved')}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{getStatusCount('on_hold')}</div>
            <div className="text-sm text-muted-foreground">On Hold</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={loadApplications}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No applications found with the current filters.</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">
                        {application.first_name} {application.last_name}
                      </h3>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <strong>Contact:</strong>
                        <div>{application.email}</div>
                        <div>{application.phone}</div>
                      </div>
                      <div>
                        <strong>Vehicle:</strong>
                        <div>{application.vehicle_year} {application.vehicle_make} {application.vehicle_model}</div>
                        <div>License: {application.license_plate}</div>
                      </div>
                      <div>
                        <strong>Experience:</strong>
                        <div>{application.driving_experience}</div>
                        <div>Max Distance: {application.max_distance}</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-muted-foreground">
                      Applied: {new Date(application.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedApplication(application)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review Application</CardTitle>
              <CardDescription>
                Review and update status for {selectedApplication.first_name} {selectedApplication.last_name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Application Details */}
              <div className="space-y-4">
                <h4 className="font-medium">Application Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Name:</strong> {selectedApplication.first_name} {selectedApplication.last_name}</div>
                  <div><strong>Email:</strong> {selectedApplication.email}</div>
                  <div><strong>Phone:</strong> {selectedApplication.phone}</div>
                  <div><strong>Vehicle:</strong> {selectedApplication.vehicle_year} {selectedApplication.vehicle_make} {selectedApplication.vehicle_model}</div>
                  <div><strong>License:</strong> {selectedApplication.license_number} ({selectedApplication.license_state})</div>
                  <div><strong>Insurance:</strong> {selectedApplication.insurance_company}</div>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h4 className="font-medium">Uploaded Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentViewer
                    title="Driver's License"
                    url={selectedApplication.driver_license_url}
                    required
                  />
                  <DocumentViewer
                    title="Insurance Card"
                    url={selectedApplication.insurance_card_url}
                    required
                  />
                  <DocumentViewer
                    title="Vehicle Registration"
                    url={selectedApplication.vehicle_registration_url}
                    required
                  />
                  <DocumentViewer
                    title="Background Check Consent"
                    url={selectedApplication.background_check_consent_url}
                    required
                  />
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-3">
                <h4 className="font-medium">Update Status</h4>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Admin Notes */}
              <div className="space-y-3">
                <h4 className="font-medium">Admin Notes</h4>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={updateApplicationStatus}
                  disabled={isUpdating || !newStatus || !adminNotes.trim()}
                  className="flex-1"
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedApplication(null);
                    setAdminNotes('');
                    setNewStatus('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 