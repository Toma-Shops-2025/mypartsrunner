import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Shield, 
  MapPin, 
  Clock, 
  DollarSign, 
  Car,
  Smartphone,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Settings,
  Save
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DriverSettingsProps {
  driver: any; // Replace with proper Driver type
  onUpdateSettings: (settings: any) => Promise<void>;
}

export const DriverSettings: React.FC<DriverSettingsProps> = ({ 
  driver, 
  onUpdateSettings 
}) => {
  const [settings, setSettings] = useState({
    // Notification Preferences
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    deliveryAlerts: true,
    earningsUpdates: true,
    safetyAlerts: true,
    
    // Delivery Preferences
    maxDeliveryDistance: 25, // miles
    minDeliveryFee: 5.00,
    preferredDeliveryTimes: ['lunch', 'dinner'],
    autoAcceptDeliveries: false,
    allowLongDistance: true,
    
    // Safety Settings
    shareLocationWithSupport: true,
    emergencyContacts: true,
    backgroundCheckUpdates: true,
    insuranceExpiryAlerts: true,
    
    // Vehicle Settings
    vehicleType: driver.vehicleType || 'car',
    maxLoadCapacity: 100, // lbs
    allowMultipleDeliveries: true,
    
    // Earnings Preferences
    weeklyPayouts: true,
    instantPayouts: false,
    earningsGoal: 500, // weekly goal
    taxDocumentation: true
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      await onUpdateSettings(settings);
      setIsEditing(false);
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'car': return '🚗';
      case 'suv': return '🚙';
      case 'truck': return '🚛';
      case 'van': return '🚐';
      default: return '🚗';
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Driver Settings</h2>
          <p className="text-gray-600">Customize your delivery experience and preferences</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </>
          )}
        </Button>
      </div>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how and when you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-gray-600">App notifications</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Email updates</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsNotifications">SMS Notifications</Label>
                <p className="text-sm text-gray-600">Text messages</p>
              </div>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="deliveryAlerts">Delivery Alerts</Label>
                <p className="text-sm text-gray-600">New delivery requests</p>
              </div>
              <Switch
                id="deliveryAlerts"
                checked={settings.deliveryAlerts}
                onCheckedChange={(checked) => handleSettingChange('deliveryAlerts', checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Delivery Preferences
          </CardTitle>
          <CardDescription>
            Set your delivery parameters and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxDistance">Maximum Delivery Distance</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  id="maxDistance"
                  value={[settings.maxDeliveryDistance]}
                  onValueChange={(value) => handleSettingChange('maxDeliveryDistance', value[0])}
                  max={50}
                  min={5}
                  step={5}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">
                  {settings.maxDeliveryDistance} mi
                </span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="minFee">Minimum Delivery Fee</Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-gray-500">$</span>
                <Input
                  id="minFee"
                  type="number"
                  value={settings.minDeliveryFee}
                  onChange={(e) => handleSettingChange('minDeliveryFee', parseFloat(e.target.value))}
                  min="1"
                  step="0.50"
                  disabled={!isEditing}
                  className="w-20"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Preferred Delivery Times</Label>
              <Select
                value={settings.preferredDeliveryTimes[0]}
                onValueChange={(value) => handleSettingChange('preferredDeliveryTimes', [value])}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (6 AM - 11 AM)</SelectItem>
                  <SelectItem value="lunch">Lunch (11 AM - 2 PM)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (2 PM - 5 PM)</SelectItem>
                  <SelectItem value="dinner">Dinner (5 PM - 9 PM)</SelectItem>
                  <SelectItem value="late">Late Night (9 PM - 12 AM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoAccept">Auto-Accept Deliveries</Label>
                <p className="text-sm text-gray-600">Automatically accept suitable deliveries</p>
              </div>
              <Switch
                id="autoAccept"
                checked={settings.autoAcceptDeliveries}
                onCheckedChange={(checked) => handleSettingChange('autoAcceptDeliveries', checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety & Security
          </CardTitle>
          <CardDescription>
            Manage your safety preferences and emergency contacts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="shareLocation">Share Location with Support</Label>
                <p className="text-sm text-gray-600">For emergency assistance</p>
              </div>
              <Switch
                id="shareLocation"
                checked={settings.shareLocationWithSupport}
                onCheckedChange={(checked) => handleSettingChange('shareLocationWithSupport', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emergencyContacts">Emergency Contact Alerts</Label>
                <p className="text-sm text-gray-600">Notify emergency contacts</p>
              </div>
              <Switch
                id="emergencyContacts"
                checked={settings.emergencyContacts}
                onCheckedChange={(checked) => handleSettingChange('emergencyContacts', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="backgroundCheck">Background Check Updates</Label>
                <p className="text-sm text-gray-600">Status change notifications</p>
              </div>
              <Switch
                id="backgroundCheck"
                checked={settings.backgroundCheckUpdates}
                onCheckedChange={(checked) => handleSettingChange('backgroundCheckUpdates', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="insuranceAlerts">Insurance Expiry Alerts</Label>
                <p className="text-sm text-gray-600">30-day advance notice</p>
              </div>
              <Switch
                id="insuranceAlerts"
                checked={settings.insuranceExpiryAlerts}
                onCheckedChange={(checked) => handleSettingChange('insuranceExpiryAlerts', checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Settings
          </CardTitle>
          <CardDescription>
            Configure your vehicle preferences and capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Vehicle Type</Label>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl">{getVehicleIcon(settings.vehicleType)}</span>
                <Select
                  value={settings.vehicleType}
                  onValueChange={(value) => handleSettingChange('vehicleType', value)}
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
            </div>
            
            <div>
              <Label htmlFor="loadCapacity">Maximum Load Capacity</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  id="loadCapacity"
                  value={[settings.maxLoadCapacity]}
                  onValueChange={(value) => handleSettingChange('maxLoadCapacity', value[0])}
                  max={500}
                  min={50}
                  step={25}
                  disabled={!isEditing}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-16">
                  {settings.maxLoadCapacity} lbs
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="multipleDeliveries">Allow Multiple Deliveries</Label>
              <p className="text-sm text-gray-600">Accept multiple deliveries in one trip</p>
            </div>
            <Switch
              id="multipleDeliveries"
              checked={settings.allowMultipleDeliveries}
              onCheckedChange={(checked) => handleSettingChange('allowMultipleDeliveries', checked)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Earnings Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Earnings & Payouts
          </CardTitle>
          <CardDescription>
            Manage your earnings goals and payout preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weeklyPayouts">Weekly Payouts</Label>
                <p className="text-sm text-gray-600">Automatic weekly transfers</p>
              </div>
              <Switch
                id="weeklyPayouts"
                checked={settings.weeklyPayouts}
                onCheckedChange={(checked) => handleSettingChange('weeklyPayouts', checked)}
                disabled={!isEditing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="instantPayouts">Instant Payouts</Label>
                <p className="text-sm text-gray-600">Immediate transfers (2.5% fee)</p>
              </div>
              <Switch
                id="instantPayouts"
                checked={settings.instantPayouts}
                onCheckedChange={(checked) => handleSettingChange('instantPayouts', checked)}
                disabled={!isEditing}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="earningsGoal">Weekly Earnings Goal</Label>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">$</span>
              <Input
                id="earningsGoal"
                type="number"
                value={settings.earningsGoal}
                onChange={(e) => handleSettingChange('earningsGoal', parseInt(e.target.value))}
                min="100"
                step="50"
                disabled={!isEditing}
                className="w-32"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="taxDocs">Tax Documentation</Label>
              <p className="text-sm text-gray-600">Receive tax forms and summaries</p>
            </div>
            <Switch
              id="taxDocs"
              checked={settings.taxDocumentation}
              onCheckedChange={(checked) => handleSettingChange('taxDocumentation', checked)}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      )}
    </div>
  );
}; 