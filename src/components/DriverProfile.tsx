import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Upload, Eye, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Driver } from '@/types';

interface DriverProfileProps {
  driver: Driver;
  onUpdate: (updates: Partial<Driver>) => Promise<void>;
}

const DriverProfile: React.FC<DriverProfileProps> = ({ driver, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<Driver>>(driver);

  const handleInputChange = (field: keyof Driver, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData(driver);
    setIsEditing(false);
  };

  const handleFileUpload = async (type: string, file: File) => {
    setIsUploading(true);
    try {
      // TODO: Implement file upload to Supabase storage
      // For now, we'll simulate the upload
      const fakeUrl = URL.createObjectURL(file);
      
      const newDocument = {
        id: Date.now().toString(),
        type: type as any,
        fileName: file.name,
        fileUrl: fakeUrl,
        uploadedAt: new Date().toISOString(),
        verified: false
      };

      const updatedDocuments = [...(driver.documents || []), newDocument];
      await onUpdate({ documents: updatedDocuments });
    } catch (error) {
      console.error('Failed to upload file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentStatus = (type: string) => {
    const doc = driver.documents?.find(d => d.type === type);
    if (!doc) return { status: 'missing', icon: <AlertCircle className="h-4 w-4 text-red-500" />, text: 'Missing' };
    if (doc.verified) return { status: 'verified', icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: 'Verified' };
    return { status: 'pending', icon: <AlertCircle className="h-4 w-4 text-yellow-500" />, text: 'Pending Verification' };
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Driver Profile</CardTitle>
              <CardDescription>
                Manage your driver information and documents
              </CardDescription>
            </div>
            <div className="space-x-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} disabled={isUploading}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
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
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ''}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={!isEditing}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={formData.zipCode || ''}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver License Information */}
      <Card>
        <CardHeader>
          <CardTitle>Driver License Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="licenseState">License State</Label>
              <Input
                id="licenseState"
                value={formData.licenseState || ''}
                onChange={(e) => handleInputChange('licenseState', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="licenseExpiryDate">Expiry Date</Label>
              <Input
                id="licenseExpiryDate"
                type="date"
                value={formData.licenseExpiryDate || ''}
                onChange={(e) => handleInputChange('licenseExpiryDate', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>License Front</Label>
              <div className="mt-2">
                {getDocumentStatus('license_front').icon}
                <span className="ml-2">{getDocumentStatus('license_front').text}</span>
                {isEditing && (
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('license_front', e.target.files[0])}
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>License Back</Label>
              <div className="mt-2">
                {getDocumentStatus('license_back').icon}
                <span className="ml-2">{getDocumentStatus('license_back').text}</span>
                {isEditing && (
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('license_back', e.target.files[0])}
                      disabled={isUploading}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select
                value={formData.vehicleType || 'car'}
                onValueChange={(value) => handleInputChange('vehicleType', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
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
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="vehicleMake">Make</Label>
              <Input
                id="vehicleMake"
                value={formData.vehicleMake || ''}
                onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="vehicleModel">Model</Label>
              <Input
                id="vehicleModel"
                value={formData.vehicleModel || ''}
                onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="vehicleYear">Year</Label>
              <Input
                id="vehicleYear"
                value={formData.vehicleYear || ''}
                onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="vehicleColor">Color</Label>
              <Input
                id="vehicleColor"
                value={formData.vehicleColor || ''}
                onChange={(e) => handleInputChange('vehicleColor', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Information */}
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="insuranceCompany">Insurance Company</Label>
              <Input
                id="insuranceCompany"
                value={formData.insuranceCompany || ''}
                onChange={(e) => handleInputChange('insuranceCompany', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="insurancePolicyNumber">Policy Number</Label>
              <Input
                id="insurancePolicyNumber"
                value={formData.insurancePolicyNumber || ''}
                onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="insuranceExpiryDate">Expiry Date</Label>
              <Input
                id="insuranceExpiryDate"
                type="date"
                value={formData.insuranceExpiryDate || ''}
                onChange={(e) => handleInputChange('insuranceExpiryDate', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div>
            <Label>Insurance Policy Copy</Label>
            <div className="mt-2">
              {getDocumentStatus('insurance_policy').icon}
              <span className="ml-2">{getDocumentStatus('insurance_policy').text}</span>
              {isEditing && (
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('insurance_policy', e.target.files[0])}
                    disabled={isUploading}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName || ''}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
              <Input
                id="emergencyContactPhone"
                value={formData.emergencyContactPhone || ''}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactRelationship">Relationship</Label>
              <Input
                id="emergencyContactRelationship"
                value={formData.emergencyContactRelationship || ''}
                onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cashApp">Cash App</Label>
              <Input
                id="cashApp"
                value={formData.paymentMethods?.cashApp || ''}
                onChange={(e) => handleInputChange('paymentMethods', { ...formData.paymentMethods, cashApp: e.target.value })}
                disabled={!isEditing}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="venmo">Venmo</Label>
              <Input
                id="venmo"
                value={formData.paymentMethods?.venmo || ''}
                onChange={(e) => handleInputChange('paymentMethods', { ...formData.paymentMethods, venmo: e.target.value })}
                disabled={!isEditing}
                placeholder="@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver Status */}
      <Card>
        <CardHeader>
          <CardTitle>Driver Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Availability</Label>
              <div className="mt-2">
                <Badge variant={driver.isAvailable ? "default" : "secondary"}>
                  {driver.isAvailable ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
            <div>
              <Label>Rating</Label>
              <div className="mt-2">
                <span className="text-lg font-semibold">
                  {driver.rating ? `${driver.rating}/5.0` : 'No rating yet'}
                </span>
              </div>
            </div>
            <div>
              <Label>Total Deliveries</Label>
              <div className="mt-2">
                <span className="text-lg font-semibold">
                  {driver.totalDeliveries || 0}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverProfile; 