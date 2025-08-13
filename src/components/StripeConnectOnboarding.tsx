import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle, ExternalLink, CreditCard, Banknote } from 'lucide-react';

interface StripeConnectOnboardingProps {
  userId: string;
  onComplete?: () => void;
}

export default function StripeConnectOnboarding({ userId, onComplete }: StripeConnectOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] = useState<'none' | 'pending' | 'active' | 'error'>('none');
  const [accountId, setAccountId] = useState<string | null>(null);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkExistingAccount();
  }, [userId]);

  const checkExistingAccount = async () => {
    try {
      // Check if user already has a Stripe Connect account
      const response = await fetch('/.netlify/functions/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'check_account', userId })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.account_id) {
          setAccountId(data.account_id);
          setAccountStatus(data.status || 'pending');
        }
      }
    } catch (error) {
      console.error('Error checking account:', error);
    }
  };

  const createAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call your Netlify function to create Connect account
      const response = await fetch('/.netlify/functions/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'create_connect_account',
          userId,
          email: 'merchant@example.com', // You'll get this from user profile
          country: 'US'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAccountId(data.account_id);
        setOnboardingUrl(data.onboarding_url);
        setAccountStatus('pending');
      } else {
        throw new Error('Failed to create account');
      }

    } catch (error) {
      console.error('Error creating account:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account');
      setAccountStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccountStatus = async () => {
    if (!accountId) return;

    try {
      const response = await fetch('/.netlify/functions/webhooks/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'check_account_status',
          accountId 
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.charges_enabled && data.payouts_enabled) {
          setAccountStatus('active');
          if (onComplete) onComplete();
        }
      }
    } catch (error) {
      console.error('Error refreshing account status:', error);
    }
  };

  const getStatusBadge = () => {
    switch (accountStatus) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (accountStatus) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusDescription = () => {
    switch (accountStatus) {
      case 'active':
        return 'Your Stripe Connect account is fully activated! You can now receive automatic payouts to your bank account.';
      case 'pending':
        return 'Please complete your Stripe Connect setup to start receiving automatic payouts.';
      case 'error':
        return 'There was an error setting up your Stripe Connect account. Please try again.';
      default:
        return 'Set up your Stripe Connect account to receive automatic payouts from MyPartsRunner.';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Stripe Connect Setup
              {getStatusIcon()}
            </CardTitle>
            <CardDescription>
              {getStatusDescription()}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {accountStatus === 'none' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Stripe Connect allows you to receive automatic payouts directly to your bank account.</p>
              <p className="mt-2">Benefits:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Automatic payouts when orders are completed</li>
                <li>Direct deposits to your bank account</li>
                <li>Professional payment infrastructure</li>
                <li>Simplified tax reporting</li>
              </ul>
            </div>
            
            <Button 
              onClick={createAccount} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Banknote className="mr-2 h-4 w-4" />
                  Set Up Stripe Connect
                </>
              )}
            </Button>
          </div>
        )}

        {accountStatus === 'pending' && onboardingUrl && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Your Stripe Connect account has been created! Now complete the onboarding process.</p>
              <p className="mt-2">You'll need to provide:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Business information and verification</li>
                <li>Bank account details for payouts</li>
                <li>Identity verification documents</li>
                <li>Tax information</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.open(onboardingUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Complete Stripe Connect Onboarding
              </Button>
              
              <Button 
                variant="outline" 
                onClick={refreshAccountStatus}
                className="w-full"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Check Setup Status
              </Button>
            </div>
          </div>
        )}

        {accountStatus === 'active' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>🎉 Congratulations! Your Stripe Connect account is fully activated.</p>
              <p className="mt-2">You can now:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Receive automatic payouts to your bank account</li>
                <li>Get paid immediately when orders are completed</li>
                <li>Track all your earnings in Stripe Dashboard</li>
                <li>Access professional payment infrastructure</li>
              </ul>
            </div>
            
            <Button 
              variant="outline" 
              onClick={refreshAccountStatus}
              className="w-full"
            >
              <Loader2 className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          </div>
        )}

        {accountStatus === 'error' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>There was an error setting up your Stripe Connect account.</p>
              <p className="mt-2">This could be due to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Network connectivity issues</li>
                <li>Stripe service temporarily unavailable</li>
                <li>Invalid account information</li>
              </ul>
            </div>
            
            <Button 
              onClick={createAccount} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 