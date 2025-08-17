import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Car, 
  Star, 
  FileText, 
  Settings, 
  Bell,
  Shield,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Camera,
  Edit,
  Check,
  X,
  Download,
  Upload
} from 'lucide-react';

const DriverProfilePage: React.FC = () => {
  const { user, signOut } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: user?.firstName || 'Demo',
    lastName: user?.lastName || 'Driver',
    phone: '+1 (555) 123-4567',
    email: user?.email || 'demo@mypartsrunner.com',
    address: '123 Main St, Anytown, USA 12345'
  });

  // Mock driver data
  const driverStats = {
    rating: 4.8,
    totalDeliveries: 342,
    totalEarnings: 8967.45,
    memberSince: 'March 2024',
    completionRate: 98.5,
    onTimeRate: 96.2
  };

  const vehicleInfo = {
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    color: 'Silver',
    licensePlate: 'ABC-1234',
    insurance: 'Valid until Dec 2024'
  };

  const documents = [
    { name: 'Driver\'s License', status: 'verified', expiryDate: '2027-06-15' },
    { name: 'Vehicle Registration', status: 'verified', expiryDate: '2025-03-20' },
    { name: 'Insurance Certificate', status: 'verified', expiryDate: '2024-12-31' },
    { name: 'Background Check', status: 'verified', expiryDate: 'N/A' }
  ];

  const [notifications, setNotifications] = useState({
    newDeliveries: true,
    promoOffers: true,
    weeklyReports: true,
    safetyAlerts: true,
    paymentUpdates: true
  });

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile({
      firstName: user?.firstName || 'Demo',
      lastName: user?.lastName || 'Driver',
      phone: '+1 (555) 123-4567',
      email: user?.email || 'demo@mypartsrunner.com',
      address: '123 Main St, Anytown, USA 12345'
    });
    setIsEditing(false);
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-green-600">Active Driver</Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{driverStats.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xl font-bold text-blue-600">{driverStats.totalDeliveries}</div>
              <div className="text-sm text-gray-600">Total Deliveries</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-xl font-bold text-green-600">${driverStats.totalEarnings.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Total Earned</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-xl font-bold text-purple-600">{driverStats.completionRate}%</div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={editedProfile.firstName}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editedProfile.lastName}
                    onChange={(e) => setEditedProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedProfile.email}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={editedProfile.address}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSaveProfile} className="flex-1">
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancelEdit} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{editedProfile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{editedProfile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{editedProfile.address}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vehicle Information */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Make & Model</div>
              <div className="font-medium">{vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}</div>
            </div>
            <div>
              <div className="text-gray-600">Color</div>
              <div className="font-medium">{vehicleInfo.color}</div>
            </div>
            <div>
              <div className="text-gray-600">License Plate</div>
              <div className="font-medium">{vehicleInfo.licensePlate}</div>
            </div>
            <div>
              <div className="text-gray-600">Insurance</div>
              <div className="font-medium text-green-600">{vehicleInfo.insurance}</div>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Edit className="h-4 w-4 mr-2" />
            Update Vehicle Info
          </Button>
        </CardContent>
      </Card>

      {/* Documents */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getDocumentStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                  <div>
                    <div className="font-medium text-sm">{doc.name}</div>
                    {doc.expiryDate !== 'N/A' && (
                      <div className="text-xs text-gray-600">Expires: {doc.expiryDate}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-xs text-gray-600">
                    {key === 'newDeliveries' && 'Get notified when new delivery requests are available'}
                    {key === 'promoOffers' && 'Receive promotional offers and bonuses'}
                    {key === 'weeklyReports' && 'Weekly earnings and performance summaries'}
                    {key === 'safetyAlerts' && 'Important safety and traffic updates'}
                    {key === 'paymentUpdates' && 'Payment confirmations and account updates'}
                  </div>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full h-12">
          <CreditCard className="h-4 w-4 mr-2" />
          Payment Methods
        </Button>
        <Button variant="outline" className="w-full h-12">
          <Shield className="h-4 w-4 mr-2" />
          Privacy & Security
        </Button>
        <Button variant="outline" className="w-full h-12">
          <Settings className="h-4 w-4 mr-2" />
          App Settings
        </Button>
        <Button 
          variant="destructive" 
          className="w-full h-12"
          onClick={signOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default DriverProfilePage; 