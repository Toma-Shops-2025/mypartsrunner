import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

interface BiometricAuthProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  mode?: 'login' | 'register';
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({ 
  onSuccess, 
  onError, 
  mode = 'login' 
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAppContext();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        setIsSupported(false);
        return;
      }

      // Check if biometric authentication is available
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setIsSupported(true);
      setIsAvailable(available);
    } catch (error) {
      console.error('Biometric support check failed:', error);
      setIsSupported(false);
    }
  };

  const registerBiometric = async () => {
    if (!isSupported || !isAvailable) {
      setError('Biometric authentication is not supported on this device');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Generate a challenge for registration
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'MyPartsRunner',
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(16),
          name: 'user@example.com',
          displayName: 'MyPartsRunner User',
        },
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7, // ES256
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions,
      });

      if (credential) {
        // Store the credential for future use
        localStorage.setItem('biometricCredential', JSON.stringify({
          id: credential.id,
          type: credential.type,
        }));
        
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Biometric registration failed:', error);
      setError(error.message || 'Biometric registration failed');
      onError?.(error.message || 'Biometric registration failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const authenticateBiometric = async () => {
    if (!isSupported || !isAvailable) {
      setError('Biometric authentication is not supported on this device');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      // Get stored credential
      const storedCredential = localStorage.getItem('biometricCredential');
      if (!storedCredential) {
        setError('No biometric credential found. Please register first.');
        return;
      }

      const { id } = JSON.parse(storedCredential);

      // Generate a challenge for authentication
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const assertionOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        rpId: window.location.hostname,
        allowCredentials: [
          {
            id: new Uint8Array(Buffer.from(id, 'base64')),
            type: 'public-key',
          },
        ],
        userVerification: 'required',
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: assertionOptions,
      });

      if (assertion) {
        // Biometric authentication successful
        // Here you would typically verify with your backend
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      setError(error.message || 'Biometric authentication failed');
      onError?.(error.message || 'Biometric authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleBiometricAction = () => {
    if (mode === 'register') {
      registerBiometric();
    } else {
      authenticateBiometric();
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>
            Biometric authentication is not supported on this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please use your email and password to sign in.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isAvailable) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5" />
            Biometric Authentication
          </CardTitle>
          <CardDescription>
            Biometric authentication is not available on this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Please use your email and password to sign in.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5" />
          Biometric Authentication
        </CardTitle>
        <CardDescription>
          {mode === 'register' 
            ? 'Register biometric authentication for quick login'
            : 'Use biometric authentication to sign in quickly'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <XCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
        
        <Button
          onClick={handleBiometricAction}
          disabled={isAuthenticating}
          className="w-full"
          variant="outline"
        >
          {isAuthenticating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              {mode === 'register' ? 'Registering...' : 'Authenticating...'}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4" />
              {mode === 'register' ? 'Register Biometric' : 'Sign in with Biometric'}
            </div>
          )}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          {mode === 'register' 
            ? 'This will allow you to sign in using your fingerprint or face ID'
            : 'Use your fingerprint or face ID to sign in quickly'
          }
        </p>
      </CardContent>
    </Card>
  );
};

export default BiometricAuth; 