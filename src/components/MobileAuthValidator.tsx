import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Smartphone, Wifi, WifiOff } from 'lucide-react';

interface MobileAuthValidatorProps {
  onValidationComplete?: (results: ValidationResults) => void;
}

interface ValidationResults {
  mobileDetection: boolean;
  authStateSync: boolean;
  pwaNativeFeatures: boolean;
  touchOptimization: boolean;
  offlineCapability: boolean;
  biometricSupport: boolean;
}

const MobileAuthValidator: React.FC<MobileAuthValidatorProps> = ({ onValidationComplete }) => {
  const { user, isAuthenticated, loading } = useAppContext();
  const isMobile = useIsMobile();
  const [validationResults, setValidationResults] = useState<ValidationResults>({
    mobileDetection: false,
    authStateSync: false,
    pwaNativeFeatures: false,
    touchOptimization: false,
    offlineCapability: false,
    biometricSupport: false,
  });
  const [isValidating, setIsValidating] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const runValidation = async () => {
    setIsValidating(true);
    const results: ValidationResults = {
      mobileDetection: false,
      authStateSync: false,
      pwaNativeFeatures: false,
      touchOptimization: false,
      offlineCapability: false,
      biometricSupport: false,
    };

    try {
      // Test 1: Mobile Detection
      results.mobileDetection = isMobile && window.innerWidth < 768;

      // Test 2: Authentication State Sync
      results.authStateSync = !loading && (isAuthenticated ? !!user : !user);

      // Test 3: PWA Native Features
      const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                    (window.navigator as any).standalone === true;
      const hasServiceWorker = 'serviceWorker' in navigator;
      const hasManifest = document.querySelector('link[rel="manifest"]') !== null;
      results.pwaNativeFeatures = hasServiceWorker && hasManifest;

      // Test 4: Touch Optimization
      const hasTouchEvents = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hasMetaViewport = document.querySelector('meta[name="viewport"]') !== null;
      results.touchOptimization = hasTouchEvents && hasMetaViewport;

      // Test 5: Offline Capability
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          results.offlineCapability = !!registration;
        } catch (error) {
          results.offlineCapability = false;
        }
      }

      // Test 6: Biometric Support
      if (window.PublicKeyCredential) {
        try {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          results.biometricSupport = available;
        } catch (error) {
          results.biometricSupport = false;
        }
      }

      setValidationResults(results);
      onValidationComplete?.(results);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    // Auto-run validation on mount if on mobile
    if (isMobile && !isValidating) {
      runValidation();
    }
  }, [isMobile]);

  const ValidationItem: React.FC<{ 
    label: string; 
    status: boolean; 
    description: string;
  }> = ({ label, status, description }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {status ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <span className="font-medium text-sm">{label}</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );

  if (!isMobile) {
    return null; // Only show on mobile devices
  }

  const allPassed = Object.values(validationResults).every(result => result);
  const totalTests = Object.keys(validationResults).length;
  const passedTests = Object.values(validationResults).filter(result => result).length;

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Smartphone className="h-5 w-5" />
          Mobile Authentication Status
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
        </CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {passedTests}/{totalTests} tests passed
          </span>
          {allPassed && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              Fully Optimized
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ValidationItem
          label="Mobile Detection"
          status={validationResults.mobileDetection}
          description="Device correctly identified as mobile"
        />
        
        <ValidationItem
          label="Auth State Sync"
          status={validationResults.authStateSync}
          description="Authentication state properly synchronized"
        />
        
        <ValidationItem
          label="PWA Features"
          status={validationResults.pwaNativeFeatures}
          description="Service worker and manifest configured"
        />
        
        <ValidationItem
          label="Touch Optimization"
          status={validationResults.touchOptimization}
          description="Touch events and viewport properly configured"
        />
        
        <ValidationItem
          label="Offline Capability"
          status={validationResults.offlineCapability}
          description="App can work offline with service worker"
        />
        
        <ValidationItem
          label="Biometric Support"
          status={validationResults.biometricSupport}
          description="Device supports biometric authentication"
        />

        {!allPassed && (
          <Button 
            onClick={runValidation}
            disabled={isValidating}
            variant="outline"
            className="w-full mt-4"
          >
            {isValidating ? 'Validating...' : 'Re-run Validation'}
          </Button>
        )}

        {isAuthenticated && user && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-900">Authenticated User</p>
            <p className="text-xs text-blue-700">{user.email}</p>
            <p className="text-xs text-blue-600">Role: {user.role}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MobileAuthValidator; 