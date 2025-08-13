import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { createConnectAccount, createAccountLink, getConnectAccount } from '../lib/stripe';
import { supabase } from '../lib/supabase';

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
      const { data: merchantProfile, error } = await supabase
        .from('merchant_profiles')
        .select('stripe_account_id, stripe_charges_enabled, stripe_payouts_enabled, stripe_details_submitted')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking merchant profile:', error);
        return;
      }

      if (merchantProfile?.stripe_account_id) {
        setAccountId(merchantProfile.stripe_account_id);
        
        if (merchantProfile.stripe_charges_enabled && merchantProfile.stripe_payouts_enabled) {
          setAccountStatus('active');
        } else if (merchantProfile.stripe_details_submitted) {
          setAccountStatus('pending');
        } else {
          setAccountStatus('pending');
        }
      }
    } catch (error) {
      console.error('Error checking existing account:', error);
    }
  };

  const createAccount = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user email from profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profileError || !profile?.email) {
        throw new Error('User email not found');
      }

      // Create Stripe Connect account
      const account = await createConnectAccount(profile.email, 'US', 'individual');
      setAccountId(account.id);

      // Create or update merchant profile
      const { error: upsertError } = await supabase
        .from('merchant_profiles')
        .upsert({
          user_id: userId,
          stripe_account_id: account.id,
          stripe_charges_enabled: account.charges_enabled,
          stripe_payouts_enabled: account.payouts_enabled,
          stripe_details_submitted: account.details_submitted,
          updated_at: new Date().toISOString()
        });

      if (upsertError) {
        throw new Error(`Failed to update merchant profile: ${upsertError.message}`);
      }

      // Create onboarding link
      const returnUrl = `${window.location.origin}/dashboard`;
      const refreshUrl = `${window.location.origin}/dashboard`;
      const link = await createAccountLink(account.id, refreshUrl, returnUrl);
      setOnboardingUrl(link);
      setAccountStatus('pending');

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
      const account = await getConnectAccount(accountId);
      
      // Update merchant profile
      const { error: updateError } = await supabase
        .from('merchant_profiles')
        .update({
          stripe_charges_enabled: account.charges_enabled,
          stripe_payouts_enabled: account.payouts_enabled,
          stripe_details_submitted: account.details_submitted,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_account_id', accountId);

      if (updateError) {
        console.error('Error updating merchant profile:', updateError);
      }

      if (account.charges_enabled && account.payouts_enabled) {
        setAccountStatus('active');
        if (onComplete) onComplete();
      } else if (account.details_submitted) {
        setAccountStatus('pending');
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
        return 'Your Stripe account is fully activated and ready to receive payments!';
      case 'pending':
        return 'Please complete your Stripe account setup to start receiving payments.';
      case 'error':
        return 'There was an error setting up your Stripe account. Please try again.';
      default:
        return 'Set up your Stripe account to start receiving payments from customers.';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
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
              <p>To receive payments from customers, you need to set up a Stripe Connect account.</p>
              <p className="mt-2">This will allow you to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accept credit card payments from customers</li>
                <li>Receive automatic payouts to your bank account</li>
                <li>Track all your transactions and earnings</li>
                <li>Comply with payment industry standards</li>
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
                'Set Up Stripe Account'
              )}
            </Button>
          </div>
        )}

        {accountStatus === 'pending' && onboardingUrl && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Your Stripe account has been created! Now you need to complete the onboarding process.</p>
              <p className="mt-2">Click the button below to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Verify your business information</li>
                <li>Connect your bank account</li>
                <li>Complete identity verification</li>
                <li>Set up your payout schedule</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.open(onboardingUrl, '_blank')}
                className="w-full"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Complete Stripe Onboarding
              </Button>
              
              <Button 
                variant="outline" 
                onClick={refreshAccountStatus}
                className="w-full"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Check Status
              </Button>
            </div>
          </div>
        )}

        {accountStatus === 'active' && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>🎉 Congratulations! Your Stripe account is fully activated.</p>
              <p className="mt-2">You can now:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Accept payments from customers immediately</li>
                <li>Receive automatic payouts to your bank account</li>
                <li>View detailed transaction reports</li>
                <li>Manage your payout schedule</li>
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
              <p>There was an error setting up your Stripe account. This could be due to:</p>
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