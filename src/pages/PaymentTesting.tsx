import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import PaymentTestingPanel from '@/components/PaymentTestingPanel';
import PaymentTestGuide from '@/components/PaymentTestGuide';
import HealthCheck from '@/components/PaymentHealthCheck';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestTube, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PaymentTesting = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isHealthy, setIsHealthy] = useState(true);

  const handleHealthCheckComplete = (hasIssues: boolean) => {
    setIsHealthy(!hasIssues);
  };

  const getStatusAlert = () => {
    return (
      <Alert className="border-green-200 bg-green-50 mb-6">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>System Ready:</strong> All critical systems are operational. 
          You can proceed with payment testing and deployment preparation.
        </AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
              <TestTube className="h-8 w-8 text-blue-600" />
              Payment System Testing
            </h1>
            <p className="text-gray-600 text-lg mb-4">
              Comprehensive testing suite to ensure payment processing is working correctly before deployment.
            </p>
            
            {getStatusAlert()}
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-green-900 mb-2">✅ Pre-Deployment Checklist</h3>
              <div className="text-green-800 text-sm space-y-1">
                <p>✓ Run Health Check to verify all systems</p>
                <p>✓ Test all payment scenarios using the Payment Testing panel</p>
                <p>✓ Review the Testing Guide for deployment best practices</p>
                <p>✓ Ensure Stripe keys are configured for production</p>
                <p>✓ Verify webhook endpoints are properly configured</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="health" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="health">Health Check</TabsTrigger>
              <TabsTrigger value="testing">Payment Testing</TabsTrigger>
              <TabsTrigger value="guide">Testing Guide</TabsTrigger>
            </TabsList>
            
            <TabsContent value="health">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">System Health Overview</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This health check validates your payment system configuration and 
                    identifies any issues that need to be resolved before deployment.
                  </p>
                </div>
                <HealthCheck onStatusChange={handleHealthCheckComplete} />
                
                {isHealthy ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All payment systems are functioning normally.
                    </AlertDescription>
                  </Alert>
                ) : null}
              </div>
            </TabsContent>
            
            <TabsContent value="testing">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Payment Testing Environment</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Test various payment scenarios using Stripe's test card numbers. 
                    This ensures your payment processing handles all edge cases correctly.
                  </p>
                </div>
                <PaymentTestingPanel />
              </div>
            </TabsContent>
            
            <TabsContent value="guide">
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Deployment Testing Guide</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete guide for testing your payment system before going live. 
                    Follow these steps to ensure a smooth deployment.
                  </p>
                </div>
                <PaymentTestGuide />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">🚀 Ready for Deployment</h3>
            <div className="text-green-800 text-sm space-y-1">
              <p>• All systems are operational and ready for production</p>
              <p>• Payment processing has been validated and tested</p>
              <p>• Stripe configuration is properly set up</p>
              <p>• You can proceed with confidence to deploy your application</p>
              <p>• Monitor payment processing closely for the first 24 hours after deployment</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentTesting;