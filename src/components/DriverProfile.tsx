import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Eye, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Car, 
  FileText, 
  Settings, 
  Star,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Camera,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Driver } from '@/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface DriverProfileProps {
  driver: Driver;
  onUpdate: (updates: Partial<Driver>) => Promise<void>;
}

interface ProfileStats {
  totalDeliveries: number;
  rating: number;
  totalEarnings: number;
  joinDate: string;
  completionRate: number;
  onTimeRate: number;
}

interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  expiresAt?: string;
}

const DriverProfile: React.FC<DriverProfileProps> = ({ driver, onUpdate }) => {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Driver>>(driver);
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalDeliveries: 0,
    rating: 0,
    totalEarnings: 0,
    joinDate: '',
    completionRate: 0,
    onTimeRate: 0
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [vehiclePhotos, setVehiclePhotos] = useState<string[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    loadProfileStats();
    loadDocuments();
    calculateProfileCompletion();
  }, [driver]);

  const loadProfileStats = async () => {
    try {
      // Get profile stats from database
      const { data: profile } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (profile) {
        setProfileStats({
          totalDeliveries: profile.totalDeliveries || 0,
          rating: profile.rating || 0,
          totalEarnings: 0, // Would be calculated from transactions
          joinDate: profile.createdAt || '',
          completionRate: 98.5, // Mock data
          onTimeRate: 95.2 // Mock data
        });
      }
    } catch (error) {
      console.error('Error loading profile stats:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      // Mock documents - would come from driver_applications or documents table
      setDocuments([
        {
          id: '1',
          type: 'drivers_license',
          name: "Driver's License",
          url: '',
          status: 'approved',
          uploadedAt: '2024-01-15',
          expiresAt: '2026-01-15'
        },
        {
          id: '2',
          type: 'insurance',
          name: 'Insurance Certificate',
          url: '',
          status: 'approved',
          uploadedAt: '2024-01-15',
          expiresAt: '2024-12-31'
        },
        {
          id: '3',
          type: 'vehicle_registration',
          name: 'Vehicle Registration',
          url: '',
          status: 'pending',
          uploadedAt: '2024-01-20'
        }
      ]);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const calculateProfileCompletion = () => {
    let completion = 0;
    const fields = [
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.phone,
      formData.vehicleType,
      formData.vehicleMake,
      formData.vehicleModel,
      formData.vehicleYear,
      formData.licensePlate
    ];

    const filledFields = fields.filter(field => field && field.toString().trim() !== '').length;
    completion = (filledFields / fields.length) * 100;

    // Add bonus for verified documents
    const verifiedDocs = documents.filter(doc => doc.status === 'approved').length;
    completion += (verifiedDocs / 3) * 20; // Up to 20% bonus for documents

    setProfileCompletion(Math.min(completion, 100));
  };

  const handleInputChange = (field: keyof Driver, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(formData);
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
        variant: "default"
      });
      calculateProfileCompletion();
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData(driver);
    setIsEditing(false);
  };

  const handleFileUpload = async (type: string, file: File) => {
    setIsUploading(true);
    try {
      // TODO: Implement actual file upload to Supabase storage
      const fakeUrl = URL.createObjectURL(file);
      
      const newDocument: Document = {
        id: Date.now().toString(),
        type,
        name: file.name,
        url: fakeUrl,
        status: 'pending',
        uploadedAt: new Date().toISOString().split('T')[0]
      };

      setDocuments(prev => [...prev.filter(doc => doc.type !== type), newDocument]);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and is pending review.",
        variant: "default"
      });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Upload failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const documentTypes = [
    { id: 'drivers_license', name: "Driver's License", required: true },
    { id: 'insurance', name: 'Insurance Certificate', required: true },
    { id: 'vehicle_registration', name: 'Vehicle Registration', required: true },
    { id: 'background_check', name: 'Background Check', required: false },
    { id: 'vehicle_inspection', name: 'Vehicle Inspection', required: false }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {formData.firstName?.[0]}{formData.lastName?.[0]}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <p className="text-gray-600">{formData.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{profileStats.rating.toFixed(1)}</span>
                  <span className="text-gray-500">• {profileStats.totalDeliveries} deliveries</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2">Profile Completion</div>
              <div className="flex items-center gap-2">
                <Progress value={profileCompletion} className="w-24 h-2" />
                <span className="text-sm font-medium">{Math.round(profileCompletion)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Manage your personal details</CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell customers a bit about yourself..."
                  rows={3}
                />
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
              <CardDescription>Manage your delivery vehicle details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => handleInputChange('vehicleType', value)}
                    disabled={!isEditing}
                  >
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
                <div>
                  <Label htmlFor="licensePlate">License Plate</Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate || ''}
                    onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                    disabled={!isEditing}
                    placeholder="ABC-1234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vehicleMake">Make</Label>
                  <Input
                    id="vehicleMake"
                    value={formData.vehicleMake || ''}
                    onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Model</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel || ''}
                    onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Camry"
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleYear">Year</Label>
                  <Input
                    id="vehicleYear"
                    type="number"
                    value={formData.vehicleYear || ''}
                    onChange={(e) => handleInputChange('vehicleYear', parseInt(e.target.value))}
                    disabled={!isEditing}
                    placeholder="2020"
                  />
                </div>
              </div>

              <div>
                <Label>Vehicle Photos</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {vehiclePhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img src={photo} alt={`Vehicle ${index + 1}`} className="w-full h-full object-cover" />
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2 w-6 h-6 p-0"
                          onClick={() => setVehiclePhotos(prev => prev.filter((_, i) => i !== index))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {isEditing && vehiclePhotos.length < 4 && (
                    <label className="aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <Plus className="h-6 w-6 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setVehiclePhotos(prev => [...prev, url]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents & Verification
              </CardTitle>
              <CardDescription>Manage your required documents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {documentTypes.map((docType) => {
                const existingDoc = documents.find(doc => doc.type === docType.id);
                return (
                  <div key={docType.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${existingDoc ? getStatusColor(existingDoc.status) : 'bg-gray-200'} text-white`}>
                          {existingDoc ? getStatusIcon(existingDoc.status) : <FileText className="h-4 w-4" />}
                        </div>
                        <div>
                          <h4 className="font-medium">{docType.name}</h4>
                          {docType.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                          {existingDoc && (
                            <p className="text-sm text-gray-500">
                              Uploaded: {new Date(existingDoc.uploadedAt).toLocaleDateString()}
                              {existingDoc.expiresAt && (
                                <span> • Expires: {new Date(existingDoc.expiresAt).toLocaleDateString()}</span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {existingDoc ? (
                          <>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <label>
                              <Button variant="outline" size="sm" disabled={isUploading}>
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(docType.id, file);
                                }}
                              />
                            </label>
                          </>
                        ) : (
                          <label>
                            <Button size="sm" disabled={isUploading}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </Button>
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(docType.id, file);
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Driver Settings
              </CardTitle>
              <CardDescription>Configure your driver preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto-accept orders</h4>
                    <p className="text-sm text-gray-500">Automatically accept orders within your delivery radius</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications for new delivery requests</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Location tracking</h4>
                    <p className="text-sm text-gray-500">Share your location with customers during deliveries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Delivery Preferences</h4>
                
                <div>
                  <Label htmlFor="maxDistance">Maximum delivery distance (miles)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    defaultValue="15"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input type="time" defaultValue="08:00" placeholder="Start time" />
                    <Input type="time" defaultValue="20:00" placeholder="End time" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Performance Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Deliveries</span>
                  <span className="font-bold">{profileStats.totalDeliveries}</span>
                </div>
                <div className="flex justify-between">
                  <span>Completion Rate</span>
                  <span className="font-bold">{profileStats.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>On-Time Rate</span>
                  <span className="font-bold">{profileStats.onTimeRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Rating</span>
                  <span className="font-bold flex items-center gap-1">
                    {profileStats.rating.toFixed(1)}
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Member Since</span>
                  <span className="font-medium">
                    {profileStats.joinDate ? new Date(profileStats.joinDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Account Status</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Verification Status</span>
                  <Badge variant="default">
                    <Shield className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Profile Completion</span>
                  <span className="font-medium">{Math.round(profileCompletion)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DriverProfile; 