import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface DeliveryBlockingOverlayProps {
  children: React.ReactNode;
  showOverlay?: boolean;
}

export const DeliveryBlockingOverlay: React.FC<DeliveryBlockingOverlayProps> = ({ 
  children, 
  showOverlay = true 
}) => {
  const { user } = useAppContext();

  // Don't show overlay if user has completed onboarding
  if (user?.onboardingComplete || !showOverlay) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred background content */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4 border-2 border-orange-200 bg-orange-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-orange-800">
              Complete Onboarding Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>You're online and ready to drive!</strong> However, you need to complete your driver onboarding to accept deliveries and get paid.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold text-orange-800">Complete your onboarding to:</h4>
              <ul className="space-y-2 text-sm text-orange-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Accept delivery requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Get paid for deliveries
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Access all driver features
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button asChild className="flex-1 bg-orange-600 hover:bg-orange-700">
                <a href="/driver-application">
                  <FileText className="mr-2 h-4 w-4" />
                  Complete Application
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/dashboard">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
              </Button>
            </div>

            <div className="text-center">
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                Status: Online but Onboarding Incomplete
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryBlockingOverlay;
