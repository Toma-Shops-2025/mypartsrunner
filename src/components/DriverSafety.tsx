import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Phone, 
  MapPin, 
  Clock, 
  FileText,
  Send,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  User,
  Camera,
  MessageSquare
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

interface IncidentReport {
  id: string;
  type: 'accident' | 'harassment' | 'vehicle_issue' | 'safety_concern' | 'other';
  description: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface DriverSafetyProps {
  driver: any; // Replace with proper Driver type
  onReportIncident: (incident: Partial<IncidentReport>) => Promise<void>;
  onUpdateEmergencyContacts: (contacts: EmergencyContact[]) => Promise<void>;
}

export const DriverSafety: React.FC<DriverSafetyProps> = ({ 
  driver, 
  onReportIncident, 
  onUpdateEmergencyContacts 
}) => {
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {
      name: driver.emergencyContactName || '',
      phone: driver.emergencyContactPhone || '',
      relationship: driver.emergencyContactRelationship || '',
      isPrimary: true
    }
  ]);

  const [isReportingIncident, setIsReportingIncident] = useState(false);
  const [incidentForm, setIncidentForm] = useState({
    type: 'safety_concern' as IncidentReport['type'],
    description: '',
    location: '',
    priority: 'medium' as IncidentReport['priority']
  });

  const [recentIncidents, setRecentIncidents] = useState<IncidentReport[]>([
    {
      id: '1',
      type: 'vehicle_issue',
      description: 'Flat tire on delivery route',
      location: '123 Main St, Louisville, KY',
      timestamp: '2024-12-15T10:30:00Z',
      status: 'resolved',
      priority: 'medium'
    }
  ]);

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleReportIncident = async () => {
    if (!incidentForm.description || !incidentForm.location) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const incident: Partial<IncidentReport> = {
        ...incidentForm,
        timestamp: new Date().toISOString()
      };

      await onReportIncident(incident);
      
      // Add to recent incidents
      const newIncident: IncidentReport = {
        id: Date.now().toString(),
        ...incident,
        status: 'pending'
      } as IncidentReport;
      
      setRecentIncidents(prev => [newIncident, ...prev]);
      
      // Reset form
      setIncidentForm({
        type: 'safety_concern',
        description: '',
        location: '',
        priority: 'medium'
      });
      
      setIsReportingIncident(false);
      
      toast({
        title: "Incident reported",
        description: "Your safety report has been submitted. Support will contact you shortly.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Report failed",
        description: "Failed to submit incident report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'accident': return '🚗💥';
      case 'harassment': return '⚠️';
      case 'vehicle_issue': return '🔧';
      case 'safety_concern': return '🛡️';
      default: return '📝';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Emergency Contacts */}
      <Card className="border-2 border-red-100">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>
            Quick access to emergency contacts and support
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold">{contact.name || 'Not set'}</p>
                    <p className="text-sm text-gray-600">
                      {contact.relationship} • {contact.phone || 'No phone'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {contact.phone && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleEmergencyCall(contact.phone)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  )}
                  {contact.isPrimary && (
                    <Badge variant="default" className="bg-red-100 text-red-800">
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Add Emergency Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Safety Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-orange-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-700">
              <Shield className="h-5 w-5" />
              Safety Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleEmergencyCall('911')}
            >
              <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
              Emergency: Call 911
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleEmergencyCall('5028122456')}
            >
              <Phone className="h-4 w-4 mr-2 text-blue-600" />
              MyPartsRunner Support
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setIsReportingIncident(true)}
            >
              <FileText className="h-4 w-4 mr-2 text-orange-600" />
              Report Safety Issue
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
              <MapPin className="h-5 w-5" />
              Location Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Location sharing active</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Emergency contacts notified</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Support team monitoring</span>
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              Share Current Location
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Incident Reporting */}
      {isReportingIncident && (
        <Card className="border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Safety Incident
            </CardTitle>
            <CardDescription>
              Report any safety concerns, accidents, or issues you encounter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="incidentType">Incident Type</Label>
                <Select
                  value={incidentForm.type}
                  onValueChange={(value) => setIncidentForm(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accident">Vehicle Accident</SelectItem>
                    <SelectItem value="harassment">Harassment/Threat</SelectItem>
                    <SelectItem value="vehicle_issue">Vehicle Problem</SelectItem>
                    <SelectItem value="safety_concern">Safety Concern</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <Select
                  value={incidentForm.priority}
                  onValueChange={(value) => setIncidentForm(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={incidentForm.location}
                onChange={(e) => setIncidentForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Street address or location description"
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={incidentForm.description}
                onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happened in detail..."
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div className="flex gap-3">
              <Button onClick={handleReportIncident} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Report
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsReportingIncident(false)}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Safety Reports
          </CardTitle>
          <CardDescription>
            Track the status of your reported incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentIncidents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No incidents reported yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="text-2xl">{getIncidentIcon(incident.type)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold capitalize">
                        {incident.type.replace('_', ' ')}
                      </h4>
                      <Badge className={getPriorityColor(incident.priority)}>
                        {incident.priority}
                      </Badge>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {incident.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(incident.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Update
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safety Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Safety Guidelines
          </CardTitle>
          <CardDescription>
            Important safety tips and best practices for drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Always verify customer identity</p>
                  <p className="text-gray-600">Ask for ID or confirmation code</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Trust your instincts</p>
                  <p className="text-gray-600">If something feels wrong, don't proceed</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Keep doors locked</p>
                  <p className="text-gray-600">Especially in unfamiliar areas</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Report suspicious activity</p>
                  <p className="text-gray-600">Immediately contact support</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Maintain vehicle safety</p>
                  <p className="text-gray-600">Regular maintenance and inspections</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Stay alert and focused</p>
                  <p className="text-gray-600">Avoid distractions while driving</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 