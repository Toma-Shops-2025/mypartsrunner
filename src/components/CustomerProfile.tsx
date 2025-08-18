import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Star,
  Package,
  CreditCard,
  Shield
} from 'lucide-react';
import { User as UserType } from '@/types';
import { toast } from '@/hooks/use-toast';

interface CustomerProfileProps {
  user: UserType;
  onUpdate: (updates: Partial<UserType>) => Promise<void>;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zipCode: user.zipCode || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      // Convert to base64 for demo (in production, you'd upload to a service)
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, profilePicture: result }));
        setUploading(false);
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated successfully"
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setUploading(false);
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      zipCode: user.zipCode || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || ''
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const first = formData.firstname || formData.name || '';
    const last = formData.lastname || '';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-purple-500 rounded-full blur-2xl"></div>
      </div>

      {/* Auto Parts Store Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className="absolute top-10 left-1/4 text-8xl opacity-10 text-gray-400">🔧</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-10 text-gray-400">⚙️</div>
        <div className="absolute bottom-1/3 left-1/6 text-7xl opacity-10 text-gray-400">🔩</div>
        <div className="absolute bottom-20 right-1/3 text-5xl opacity-10 text-gray-400">🛠️</div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-orange-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto">
                  <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-xl">
                    <AvatarImage src={formData.profilePicture} alt="Profile" />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-orange-500 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-white border-2 border-blue-500 hover:bg-blue-50"
                    onClick={handleProfilePictureClick}
                    disabled={uploading}
                  >
                    <Camera className="w-4 h-4 text-blue-600" />
                  </Button>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                <div className="mt-4">
                  <CardTitle className="text-xl">{formData.name || 'Customer'}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1 mt-1">
                    <Mail className="w-4 h-4" />
                    {formData.email}
                  </CardDescription>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified Customer
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Total Orders</span>
                    </div>
                    <span className="font-bold text-blue-600">12</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Customer Rating</span>
                    </div>
                    <span className="font-bold text-orange-600">4.9</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium">Member Since</span>
                    </div>
                    <span className="font-bold text-green-600">2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </div>
                  
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button 
                        onClick={handleCancel} 
                        variant="outline"
                        disabled={saving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstname">First Name</Label>
                      <Input
                        id="firstname"
                        value={formData.firstname}
                        onChange={(e) => handleInputChange('firstname', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lastname">Last Name</Label>
                      <Input
                        id="lastname"
                        value={formData.lastname}
                        onChange={(e) => handleInputChange('lastname', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        placeholder="(555) 123-4567"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                        placeholder="123 Main Street"
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Louisville"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          disabled={!isEditing}
                          placeholder="KY"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          disabled={!isEditing}
                          placeholder="40202"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* About Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">About Me</h3>
                  <div>
                    <Label htmlFor="bio">Bio (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell us a bit about yourself, your automotive interests, or anything else you'd like to share..."
                      rows={4}
                      className="mt-1 resize-none"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile; 