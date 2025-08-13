import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import StripeConnectOnboarding from '../components/StripeConnectOnboarding';

export default function StripeConnectTestPage() {
  const [userId, setUserId] = useState<string>('');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleStartOnboarding = () => {
    if (userId.trim()) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = () => {
    alert('🎉 Stripe Connect onboarding completed!');
    setShowOnboarding(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Stripe Connect Test Page</CardTitle>
          <CardDescription>
            Test the Stripe Connect onboarding flow for merchants and drivers
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!showOnboarding ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID (for testing)</Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter a test user ID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This would normally come from your authentication system
                </p>
              </div>
              
              <Button 
                onClick={handleStartOnboarding}
                disabled={!userId.trim()}
                className="w-full"
              >
                Start Stripe Connect Onboarding
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>What this will do:</strong></p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Create a Stripe Connect Express account</li>
                  <li>Generate an onboarding link</li>
                  <li>Redirect to Stripe's hosted onboarding</li>
                  <li>Handle account verification</li>
                  <li>Enable automatic payouts</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setShowOnboarding(false)}
                className="mb-4"
              >
                ← Back to Test Setup
              </Button>
              
              <StripeConnectOnboarding 
                userId={userId}
                onComplete={handleOnboardingComplete}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 