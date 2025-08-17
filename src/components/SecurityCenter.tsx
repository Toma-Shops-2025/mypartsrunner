import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Key,
  Bell,
  MapPin,
  Clock,
  Users,
  Activity,
  Fingerprint,
  Scan,
  Phone,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | 'suspicious_activity' | 'device_added' | 'emergency_alert';
  description: string;
  timestamp: string;
  location?: string;
  device?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

const SecurityCenter: React.FC = () => {
  const { user } = useAppContext();
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricEnabled: false,
    locationSharing: true,
    emergencyMode: false,
    notifyOnLogin: true,
    autoLogout: 30,
    sessionTimeout: 15
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);

  // Mock security events
  const mockSecurityEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      description: 'Successful login from new device',
      timestamp: '2024-01-15T10:30:00Z',
      location: 'New York, NY',
      device: 'iPhone 14 Pro',
      severity: 'medium',
      resolved: true
    },
    {
      id: '2',
      type: 'password_change',
      description: 'Password changed successfully',
      timestamp: '2024-01-14T15:45:00Z',
      location: 'New York, NY',
      device: 'Chrome Browser',
      severity: 'low',
      resolved: true
    },
    {
      id: '3',
      type: 'suspicious_activity',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-01-13T22:15:00Z',
      location: 'Unknown',
      device: 'Unknown',
      severity: 'high',
      resolved: false
    }
  ];

  const mockEmergencyContacts: EmergencyContact[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      phone: '(555) 123-4567',
      relationship: 'Spouse',
      isPrimary: true
    },
    {
      id: '2',
      name: 'Mike Johnson',
      phone: '(555) 987-6543',
      relationship: 'Parent',
      isPrimary: false
    }
  ];

  useEffect(() => {
    setSecurityEvents(mockSecurityEvents);
    setEmergencyContacts(mockEmergencyContacts);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'high': return AlertTriangle;
      case 'critical': return XCircle;
      default: return AlertTriangle;
    }
  };

  const activateEmergencyMode = () => {
    setEmergencyActive(true);
    setSecuritySettings(prev => ({ ...prev, emergencyMode: true }));
    
    // Simulate emergency actions
    console.log('Emergency mode activated');
    console.log('Notifying emergency contacts...');
    console.log('Sharing location with authorities...');
    console.log('Recording safety check-in...');
    
    // Auto-deactivate after 5 seconds for demo
    setTimeout(() => {
      setEmergencyActive(false);
      setSecuritySettings(prev => ({ ...prev, emergencyMode: false }));
    }, 5000);
  };

  const changePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    // Simulate password change
    console.log('Password changed successfully');
    setNewPassword('');
    setConfirmPassword('');
    
    // Add security event
    const newEvent: SecurityEvent = {
      id: Date.now().toString(),
      type: 'password_change',
      description: 'Password changed by user',
      timestamp: new Date().toISOString(),
      location: 'New York, NY',
      device: 'Current Device',
      severity: 'low',
      resolved: true
    };
    setSecurityEvents(prev => [newEvent, ...prev]);
  };

  const toggleTwoFactor = () => {
    setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
    
    if (!securitySettings.twoFactorEnabled) {
      // Simulate 2FA setup
      console.log('Setting up 2FA...');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Emergency Banner */}
      {emergencyActive && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 animate-pulse" />
              <div className="flex-1">
                <h3 className="font-bold text-red-800">EMERGENCY MODE ACTIVE</h3>
                <p className="text-red-700 text-sm">
                  Emergency contacts have been notified. Your location is being shared with support.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setEmergencyActive(false)}
                className="border-red-500 text-red-600"
              >
                Deactivate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600">Manage your account security and safety settings</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50"
            onClick={activateEmergencyMode}
            disabled={emergencyActive}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {emergencyActive ? 'Emergency Active' : 'Emergency Help'}
          </Button>
          <Button>
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>

      {/* Security Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Security Score</h3>
              <p className="text-gray-600">Your account security strength</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">85/100</div>
              <Badge className="bg-green-600">Good Security</Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Weak</span>
              <span>Strong</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Security Tabs */}
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          {/* Authentication Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div>
                <h4 className="font-medium mb-4">Change Password</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={changePassword} 
                  className="mt-2"
                  disabled={!newPassword || !confirmPassword}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  {securitySettings.twoFactorEnabled && (
                    <Badge className="bg-green-600">Enabled</Badge>
                  )}
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={toggleTwoFactor}
                  />
                </div>
              </div>

              {/* Biometric Authentication */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Biometric Authentication</h4>
                  <p className="text-sm text-gray-600">Use fingerprint or face recognition</p>
                </div>
                <div className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-gray-400" />
                  <Switch
                    checked={securitySettings.biometricEnabled}
                    onCheckedChange={(checked) => 
                      setSecuritySettings(prev => ({ ...prev, biometricEnabled: checked }))
                    }
                  />
                </div>
              </div>

              {/* Session Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Auto-logout (minutes)</label>
                    <Input
                      type="number"
                      value={securitySettings.autoLogout}
                      onChange={(e) => 
                        setSecuritySettings(prev => ({ ...prev, autoLogout: parseInt(e.target.value) }))
                      }
                      min="5"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Session timeout (minutes)</label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => 
                        setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))
                      }
                      min="5"
                      max="60"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Login Notifications</h4>
                  <p className="text-sm text-gray-600">Get notified of new logins</p>
                </div>
                <Switch
                  checked={securitySettings.notifyOnLogin}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, notifyOnLogin: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event) => {
                  const SeverityIcon = getSeverityIcon(event.severity);
                  return (
                    <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <SeverityIcon className={`h-5 w-5 mt-0.5 ${
                        event.severity === 'critical' ? 'text-red-500' :
                        event.severity === 'high' ? 'text-orange-500' :
                        event.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{event.description}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </span>
                          )}
                          {event.device && (
                            <span className="flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              {event.device}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                        {event.resolved ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Trusted Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-8 w-8 text-blue-600" />
                    <div>
                      <h4 className="font-medium">iPhone 14 Pro</h4>
                      <p className="text-sm text-gray-600">Last used: Today at 2:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-600">Current Device</Badge>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Scan className="h-8 w-8 text-purple-600" />
                    <div>
                      <h4 className="font-medium">Chrome Browser</h4>
                      <p className="text-sm text-gray-600">Last used: Yesterday at 6:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-6">
          {/* Emergency Contacts */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-8 w-8 text-green-600" />
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.relationship} • {contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.isPrimary && (
                        <Badge className="bg-blue-600">Primary</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Add Emergency Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Safety Features */}
          <Card>
            <CardHeader>
              <CardTitle>Safety Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Location Sharing</h4>
                  <p className="text-sm text-gray-600">Share location with emergency contacts during deliveries</p>
                </div>
                <Switch
                  checked={securitySettings.locationSharing}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, locationSharing: checked }))
                  }
                />
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Emergency Mode</h4>
                <p className="text-sm text-red-700 mb-4">
                  Activates automatic location sharing and notifies emergency contacts
                </p>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={activateEmergencyMode}
                  disabled={emergencyActive}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {emergencyActive ? 'Emergency Active' : 'Activate Emergency Mode'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Data Collection</h4>
                    <p className="text-sm text-gray-600">Allow analytics to improve service</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Marketing Communications</h4>
                    <p className="text-sm text-gray-600">Receive promotional emails and notifications</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Third-party Integrations</h4>
                    <p className="text-sm text-gray-600">Allow data sharing with partner services</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-4">Data Management</h4>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-300">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityCenter; 