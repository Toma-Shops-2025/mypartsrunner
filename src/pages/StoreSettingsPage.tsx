import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Settings, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  ArrowLeft,
  Loader2,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { DatabaseService } from '@/lib/database';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface StoreData {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  isActive: boolean;
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  deliveryRadius: number;
  minimumOrderAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const [storeData, setStoreData] = useState<StoreData>({
    id: '',
    merchantId: '',
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    logoUrl: '',
    isActive: true,
    businessHours: {
      monday: { open: '09:00', close: '17:00', closed: false },
      tuesday: { open: '09:00', close: '17:00', closed: false },
      wednesday: { open: '09:00', close: '17:00', closed: false },
      thursday: { open: '09:00', close: '17:00', closed: false },
      friday: { open: '09:00', close: '17:00', closed: false },
      saturday: { open: '09:00', close: '15:00', closed: false },
      sunday: { open: '10:00', close: '14:00', closed: true }
    },
    deliveryRadius: 10,
    minimumOrderAmount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  useEffect(() => {
    if (user) {
      loadStoreData();
    }
  }, [user]);

  const loadStoreData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const stores = await DatabaseService.getStoresByMerchant(user.id);
      
      if (stores.length > 0) {
        const store = stores[0];
        setStoreData({
          ...store,
          businessHours: store.businessHours || storeData.businessHours,
          deliveryRadius: store.deliveryRadius || 10,
          minimumOrderAmount: store.minimumOrderAmount || 0
        });
        
        if (store.logoUrl) {
          setLogoPreview(store.logoUrl);
        }
      }
    } catch (error) {
      console.error('Error loading store data:', error);
      toast({
        title: "Error loading store",
        description: "Failed to load store information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setStoreData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleBusinessHoursChange = (day: string, field: string, value: string | boolean) => {
    setStoreData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value
        }
      }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setStoreData(prev => ({
        ...prev,
        logoUrl: file.name // This would be the uploaded URL
      }));
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setStoreData(prev => ({
      ...prev,
      logoUrl: ''
    }));
  };

  const validateForm = () => {
    if (!storeData.name.trim()) {
      toast({
        title: "Missing store name",
        description: "Please enter a store name.",
        variant: "destructive"
      });
      return false;
    }

    if (!storeData.address.trim()) {
      toast({
        title: "Missing address",
        description: "Please enter a store address.",
        variant: "destructive"
      });
      return false;
    }

    if (!storeData.phone.trim()) {
      toast({
        title: "Missing phone number",
        description: "Please enter a phone number.",
        variant: "destructive"
      });
      return false;
    }

    if (!storeData.email.trim()) {
      toast({
        title: "Missing email",
        description: "Please enter an email address.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save store settings.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        ...storeData,
        merchantId: user.id
      };

      let updatedStore;
      if (storeData.id) {
        updatedStore = await DatabaseService.updateStore(storeData.id, updateData);
      } else {
        updatedStore = await DatabaseService.createStore(updateData);
      }

      if (updatedStore) {
        toast({
          title: "Store settings saved!",
          description: "Your store information has been updated successfully."
        });
        setStoreData(prev => ({ ...prev, id: updatedStore.id }));
      }
    } catch (error) {
      console.error('Error saving store:', error);
      toast({
        title: "Error saving store",
        description: "Failed to save store settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading store settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleCancel} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Store Settings</h1>
            <p className="text-muted-foreground">
              Manage your store information and preferences
            </p>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hours">Business Hours</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Essential store details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Store Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={storeData.name}
                      onChange={handleInputChange}
                      placeholder="Enter store name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={storeData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your store"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={storeData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourstore.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>
                    How customers can reach you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={storeData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={storeData.email}
                      onChange={handleInputChange}
                      placeholder="store@example.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Store Address</CardTitle>
                  <CardDescription>
                    Your store's physical location
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      value={storeData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={storeData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        name="state"
                        value={storeData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={storeData.zipCode}
                        onChange={handleInputChange}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Business Hours */}
          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>
                  Set your store's operating hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(storeData.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-24">
                        <Label className="capitalize">{day}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={!hours.closed}
                          onCheckedChange={(checked) => handleBusinessHoursChange(day, 'closed', !checked)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {hours.closed ? 'Closed' : 'Open'}
                        </span>
                      </div>
                      {!hours.closed && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleBusinessHoursChange(day, 'open', e.target.value)}
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleBusinessHoursChange(day, 'close', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Settings */}
          <TabsContent value="delivery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Settings</CardTitle>
                  <CardDescription>
                    Configure delivery options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="deliveryRadius">Delivery Radius (miles)</Label>
                    <Input
                      id="deliveryRadius"
                      name="deliveryRadius"
                      type="number"
                      min="1"
                      max="50"
                      value={storeData.deliveryRadius}
                      onChange={(e) => setStoreData(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="minimumOrderAmount">Minimum Order Amount ($)</Label>
                    <Input
                      id="minimumOrderAmount"
                      name="minimumOrderAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={storeData.minimumOrderAmount}
                      onChange={(e) => setStoreData(prev => ({ ...prev, minimumOrderAmount: parseFloat(e.target.value) }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Store Status</CardTitle>
                  <CardDescription>
                    Control store availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Store Active</Label>
                    <Switch
                      id="isActive"
                      checked={storeData.isActive}
                      onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    When disabled, customers won't be able to place orders from your store.
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Logo</CardTitle>
                <CardDescription>
                  Upload your store logo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Store logo"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <Label htmlFor="logo" className="cursor-pointer">
                      <div className="space-y-2">
                        <Button variant="outline" type="button">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    </Label>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;
