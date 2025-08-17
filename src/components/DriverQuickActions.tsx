import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Navigation, 
  MapPin, 
  Phone, 
  MessageCircle,
  Gas,
  Tool,
  Camera,
  FileText,
  HelpCircle,
  Settings,
  Car,
  Coffee
} from 'lucide-react';

const DriverQuickActions: React.FC = () => {
  const quickActions = [
    {
      icon: Navigation,
      label: 'GPS Navigation',
      description: 'Open maps for directions',
      action: () => window.open('/map', '_blank'),
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: Phone,
      label: 'Customer Support',
      description: 'Get immediate help',
      action: () => window.open('/help', '_blank'),
      color: 'text-green-600 bg-green-50 hover:bg-green-100'
    },
    {
      icon: Camera,
      label: 'Delivery Photo',
      description: 'Take delivery confirmation',
      action: () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => alert('📸 Camera ready! Feature coming soon in driver PWA.'))
            .catch(() => alert('📸 Camera not available. Please enable camera permissions.'));
        } else {
          alert('📸 Camera feature coming soon in dedicated driver app!');
        }
      },
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
    },
    {
      icon: MessageCircle,
      label: 'Customer Chat',
      description: 'Message customers directly',
      action: () => alert('💬 In-app messaging coming soon! For now, use provided phone numbers.'),
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100'
    },
    {
      icon: Gas,
      label: 'Find Gas Stations',
      description: 'Locate nearby fuel stops',
      action: () => {
        const gasQuery = 'gas+stations+near+me';
        window.open(`https://www.google.com/maps/search/${gasQuery}`, '_blank');
      },
      color: 'text-red-600 bg-red-50 hover:bg-red-100'
    },
    {
      icon: Coffee,
      label: 'Break Timer',
      description: 'Track break time',
      action: () => {
        const breakStart = new Date().toLocaleTimeString();
        alert(`☕ Break started at ${breakStart}\n\nDon't forget to go offline if taking a long break!`);
      },
      color: 'text-amber-600 bg-amber-50 hover:bg-amber-100'
    },
    {
      icon: Tool,
      label: 'Emergency Kit',
      description: 'Roadside assistance info',
      action: () => alert('🚗 Emergency Numbers:\n\nRoadside: (502) 555-0199\nMyPartsRunner Support: (502) 812-2456\n\nStay safe out there!'),
      color: 'text-gray-600 bg-gray-50 hover:bg-gray-100'
    },
    {
      icon: FileText,
      label: 'Report Issue',
      description: 'Report delivery problems',
      action: () => window.open('/help?topic=report-issue', '_blank'),
      color: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
    }
  ];

  const QuickActionButton = ({ action }: { action: typeof quickActions[0] }) => (
    <Button
      variant="ghost"
      onClick={action.action}
      className={`h-auto p-4 flex flex-col items-center gap-2 border-2 border-transparent hover:border-current transition-all ${action.color}`}
    >
      <action.icon className="h-6 w-6" />
      <div className="text-center">
        <p className="text-sm font-medium">{action.label}</p>
        <p className="text-xs opacity-75">{action.description}</p>
      </div>
    </Button>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-blue-600" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <QuickActionButton key={index} action={action} />
          ))}
        </div>

        {/* Pro Tips */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Pro Driver Tips</span>
          </div>
          <div className="space-y-1 text-xs text-blue-700">
            <p>• Always confirm customer phone number before starting delivery</p>
            <p>• Take photos at delivery location for your records</p>
            <p>• Use the GPS navigation for optimized routes</p>
            <p>• Keep emergency contacts handy for roadside assistance</p>
          </div>
        </div>

        {/* Driver PWA Promotion */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Coming Soon</span>
          </div>
          <p className="text-xs text-purple-700 mb-2">
            Many of these features will be enhanced in our dedicated Driver PWA with offline support, 
            camera integration, and real-time messaging!
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => alert('🚧 Driver PWA in development! Stay tuned for launch.')}
            className="text-xs border-purple-300 text-purple-700 hover:bg-purple-100"
          >
            Learn More About Driver PWA
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverQuickActions; 