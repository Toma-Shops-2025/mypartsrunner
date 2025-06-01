import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, CreditCard } from 'lucide-react';

const PaymentTestGuide = () => {
  const testScenarios = [
    {
      title: 'Successful Payment',
      card: '4242424242424242',
      expected: 'Payment completes successfully',
      status: 'success'
    },
    {
      title: 'Card Declined',
      card: '4000000000000002',
      expected: 'Payment fails with decline message',
      status: 'error'
    },
    {
      title: 'Insufficient Funds',
      card: '4000000000009995',
      expected: 'Payment fails due to insufficient funds',
      status: 'error'
    },
    {
      title: 'Expired Card',
      card: '4000000000000069',
      expected: 'Payment fails due to expired card',
      status: 'error'
    }
  ];

  const preDeploymentChecklist = [
    'All test scenarios pass with expected results',
    'Error messages are user-friendly and informative',
    'Successful payments trigger order completion',
    'Failed payments do not create incomplete orders',
    'Payment status is properly communicated to users',
    'Stripe webhook endpoints are configured (production)',
    'Live API keys are set in production environment'
  ];

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Info className="h-5 w-5" />
            Payment Testing Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <p className="mb-4">
            This testing suite verifies that your Stripe payment integration is working correctly.
            Use the test cards below to simulate different payment scenarios.
          </p>
          <div className="bg-blue-100 p-3 rounded-lg">
            <p className="font-semibold mb-2">Important Notes:</p>
            <ul className="text-sm space-y-1">
              <li>• All tests use Stripe's test mode - no real money is charged</li>
              <li>• Test cards simulate real-world payment scenarios</li>
              <li>• Successful tests confirm your integration is ready for production</li>
              <li>• Use expiry date 12/25 and any 3-digit CVV for all test cards</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Test Card Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{scenario.title}</h3>
                  <Badge variant={scenario.status === 'success' ? 'default' : 'destructive'}>
                    {scenario.status === 'success' ? 'Success' : 'Failure'}
                  </Badge>
                </div>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-2">
                  {scenario.card}
                </p>
                <p className="text-sm text-gray-600">{scenario.expected}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Pre-Deployment Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {preDeploymentChecklist.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h4 className="font-semibold text-orange-900 mb-2">Production Deployment Notes:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Replace test Stripe keys with live keys in production</li>
              <li>• Configure webhook endpoints for real-time payment updates</li>
              <li>• Test with small real transactions before full launch</li>
              <li>• Monitor payment success rates and error patterns</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTestGuide;