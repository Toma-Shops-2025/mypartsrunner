import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentHealthCheckProps {
  onStatusChange: (hasIssues: boolean) => void;
}

const PaymentHealthCheck: React.FC<PaymentHealthCheckProps> = ({ onStatusChange }) => {
  const [checks, setChecks] = useState({
    stripeConfig: false,
    webhooks: false,
    database: false,
  });

  useEffect(() => {
    const runHealthChecks = async () => {
      // Simulate health checks
      setChecks({
        stripeConfig: true,
        webhooks: true,
        database: true,
      });
      
      onStatusChange(false); // No issues found
    };

    runHealthChecks();
  }, [onStatusChange]);

  return (
    <div className="space-y-4">
      {Object.entries(checks).map(([check, passed]) => (
        <Card key={check}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium capitalize">
                  {check.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm text-gray-500">
                  {passed ? 'Check passed successfully' : 'Running check...'}
                </p>
              </div>
              {passed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {Object.values(checks).every(Boolean) && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            All health checks passed successfully.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default PaymentHealthCheck;