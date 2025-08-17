import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Smartphone, 
  Download, 
  ExternalLink, 
  Zap, 
  MapPin,
  Camera,
  DollarSign,
  Clock,
  Wifi
} from 'lucide-react';

const DriverAppOptions: React.FC = () => {
  const isMobile = useIsMobile();
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Check if PWA is installable
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleOpenDriverPWA = () => {
    // For now, show a coming soon message until PWA is deployed
    alert('🚧 Driver PWA Coming Soon!\n\nWe\'re building a dedicated driver app experience. Stay tuned for launch!\n\nFor now, continue using the driver features here on MyPartsRunner.');
    // window.open('https://drivers.mypartsrunner.com', '_blank');
  };

  const driverAppFeatures = [
    { icon: MapPin, text: 'Real-time GPS tracking & route optimization' },
    { icon: Camera, text: 'One-tap delivery photo confirmations' },
    { icon: DollarSign, text: 'Live earnings dashboard & payment tracking' },
    { icon: Clock, text: 'Streamlined order acceptance & completion' },
    { icon: Wifi, text: 'Offline mode for poor connectivity areas' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-blue-600" />
          <CardTitle>MyPartsRunner Driver App</CardTitle>
        </div>
        <CardDescription>
          Get the optimized mobile experience designed specifically for drivers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* App Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {driverAppFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <feature.icon className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-blue-800">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Download Options */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="font-medium">Choose Your Preferred Experience:</span>
          </div>

          <div className="grid gap-3">
            {/* Native App Option (Coming Soon) */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Native Mobile App</h4>
                    <p className="text-sm text-gray-600">
                      Best performance, app store download
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Coming to Google Play Soon
                </Badge>
              </div>
            </div>

            {/* PWA Option */}
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Driver PWA</h4>
                    <p className="text-sm text-blue-700">
                      Full-featured web app, works on any device
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {isInstallable && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleInstallPWA}
                      className="text-xs"
                    >
                      Install
                    </Button>
                  )}
                  <Button
                    onClick={handleOpenDriverPWA}
                    size="sm"
                    className="text-xs"
                  >
                    Open PWA
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Site Option */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">Continue Here</h4>
                    <p className="text-sm text-gray-600">
                      Use the current MyPartsRunner driver features
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Current Choice
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium">Seamless Transition</p>
              <p className="text-amber-700">
                Your account, earnings, and delivery history sync across all platforms. 
                Try the driver app and switch back anytime!
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverAppOptions; 