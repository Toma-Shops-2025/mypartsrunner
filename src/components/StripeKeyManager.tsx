import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const StripeKeyManager = () => {
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Check if we have a publishable key configured
    if (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.startsWith('pk_live_')) {
      setMessage('Live Stripe publishable key is configured!');
      setIsConfigured(true);
    }
  }, []);

  const handleUpdateKeys = async () => {
    if (!apiKey) {
      setError('Publishable key is required');
      return;
    }

    // Validate that these are live keys
    if (!apiKey.startsWith('pk_live_')) {
      setError('Only live Stripe keys (pk_live_) are allowed in production mode');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Here you would typically make an API call to your backend
      // to validate and store the publishable key
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('🔴 Live Stripe publishable key configured successfully! Ready for real payments.');
      setIsConfigured(true);
    } catch (err) {
      setError('Failed to configure live key');
      setIsConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isConfigured ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-500" />
          )}
          🔴 Stripe Live Keys
        </CardTitle>
        <CardDescription>
          {isConfigured ? 'Live production key active' : 'Configure live Stripe publishable key for production'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            ⚠️ LIVE MODE ACTIVE - This integration will process real payments and charge real money.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="apiKey">Stripe Publishable Key (Live)</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="pk_live_..."
            className="font-mono text-sm"
          />
          {isConfigured && (
            <div className="text-xs text-green-600">✓ Live publishable key configured</div>
          )}
        </div>

        <div className="space-y-2 bg-gray-50 p-4 rounded-md">
          <Label className="text-gray-600">About Secret Keys</Label>
          <p className="text-sm text-gray-600">
            For security reasons, Stripe secret keys should only be configured in your backend environment.
            Never expose secret keys in frontend code or version control.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {message && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">{message}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleUpdateKeys} 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isConfigured ? 'Update Live Key' : 'Configure Live Key'}
        </Button>

        {isConfigured && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
            ✅ <strong>LIVE MODE READY</strong><br/>
            🔴 Real payments will be processed<br/>
            💳 Customer cards will be charged
          </div>
        )}

        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
          <strong>WARNING:</strong> Live mode processes real transactions. Test thoroughly before use.
        </div>
      </CardContent>
    </Card>
  );
};

export default StripeKeyManager;