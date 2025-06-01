import React from 'react';
import AppLayout from '@/components/AppLayout';
import StripeKeyManager from '@/components/StripeKeyManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CreditCard, Key } from 'lucide-react';

const StripeSettings = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stripe API Settings</h1>
            <p className="text-gray-600">
              Manage your Stripe API keys for secure payment processing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Security Information
                  </CardTitle>
                  <CardDescription>
                    Important security guidelines for API keys
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Key className="h-4 w-4 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">API Keys</p>
                      <p className="text-sm text-gray-600">Never share your secret keys publicly</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CreditCard className="h-4 w-4 text-purple-600 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Test vs Live</p>
                      <p className="text-sm text-gray-600">Use test keys for development</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">API Key:</span>
                      <span className="text-sm text-green-600">Configured</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Secret Key:</span>
                      <span className="text-sm text-green-600">Configured</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <StripeKeyManager />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StripeSettings;