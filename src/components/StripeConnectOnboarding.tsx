import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Shield, 
  DollarSign,
  Clock,
  Zap,
  FileText,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Award,
  Truck,
  Package,
  BarChart3,
  Settings,
  RefreshCw,
  Copy,
  Eye,
  Download,
  Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';

interface StripeAccount {
  id: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: {
    currently_due: string[];
    eventually_due: string[];
    past_due: string[];
  };
  capabilities: {
    card_payments: string;
    transfers: string;
  };
  created: number;
  country: string;
  default_currency: string;
  email?: string;
  business_profile?: {
    name?: string;
    url?: string;
    support_phone?: string;
  };
}

interface OnboardingProps {
  userType: 'merchant' | 'driver';
  onComplete?: () => void;
}

export const StripeConnectOnboarding: React.FC<OnboardingProps> = ({ 
  userType, 
  onComplete 
}) => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<StripeAccount | null>(null);
  const [onboardingUrl, setOnboardingUrl] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [step, setStep] = useState<'check' | 'create' | 'onboard' | 'complete'>('check');

  useEffect(() => {
    checkExistingAccount();
  }, [user]);

  const checkExistingAccount = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch('/.netlify/functions/stripe-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_account',
          userId: user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.account) {
          setAccount(data.account);
          setStep(getStepFromAccount(data.account));
        } else {
          setStep('create');
        }
      } else {
        setStep('create');
      }
    } catch (error) {
      console.error('Error checking account:', error);
      setStep('create');
    } finally {
      setLoading(false);
    }
  };

  const getStepFromAccount = (account: StripeAccount) => {
    if (account.chargesEnabled && account.payoutsEnabled && account.detailsSubmitted) {
      return 'complete';
    } else if (account.id) {
      return 'onboard';
    } else {
      return 'create';
    }
  };

  const createConnectAccount = async () => {
    if (!user?.id || !user?.email) {
      toast({
        title: "Missing user information",
        description: "Please ensure your profile is complete",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/.netlify/functions/stripe-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_connect_account',
          userId: user.id,
          email: user.email,
          country: 'US',
          businessType: userType === 'merchant' ? 'company' : 'individual'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAccount(data.account);
        setOnboardingUrl(data.onboardingUrl);
        setStep('onboard');
        
        toast({
          title: "Account created successfully!",
          description: "Complete your onboarding to start receiving payments",
          variant: "default"
        });
      } else {
        throw new Error(data.error || 'Failed to create account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Account creation failed",
        description: error.message || "Please try again or contact support",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getOnboardingLink = async () => {
    if (!account?.id) return;

    try {
      setLoading(true);
      const response = await fetch('/.netlify/functions/stripe-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_onboarding_link',
          accountId: account.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOnboardingUrl(data.onboardingUrl);
        // Open in new window
        window.open(data.onboardingUrl, '_blank', 'width=800,height=600');
      } else {
        throw new Error(data.error || 'Failed to get onboarding link');
      }
    } catch (error) {
      console.error('Error getting onboarding link:', error);
      toast({
        title: "Error getting onboarding link",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshAccountStatus = async () => {
    if (!account?.id) return;

    try {
      setRefreshing(true);
      const response = await fetch('/.netlify/functions/stripe-connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'check_account_status',
          accountId: account.id
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAccount(data.account);
        const newStep = getStepFromAccount(data.account);
        setStep(newStep);
        
        if (newStep === 'complete' && onComplete) {
          onComplete();
        }

        toast({
          title: "Status updated",
          description: "Account information refreshed",
          variant: "default"
        });
      } else {
        throw new Error(data.error || 'Failed to refresh status');
      }
    } catch (error) {
      console.error('Error refreshing status:', error);
      toast({
        title: "Refresh failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!account) return 0;
    
    let completed = 0;
    const total = 4;
    
    if (account.detailsSubmitted) completed += 1;
    if (account.capabilities.card_payments === 'active') completed += 1;
    if (account.capabilities.transfers === 'active') completed += 1;
    if (account.chargesEnabled && account.payoutsEnabled) completed += 1;
    
    return Math.round((completed / total) * 100);
  };

  const getRequirementsText = () => {
    if (!account?.requirements) return '';
    
    const total = account.requirements.currently_due.length + 
                 account.requirements.past_due.length;
    
    if (total === 0) return 'All requirements completed';
    return `${total} requirement${total > 1 ? 's' : ''} remaining`;
  };

  const benefits = {
    merchant: [
      { icon: <DollarSign className="h-5 w-5" />, text: "Receive payments instantly" },
      { icon: <Shield className="h-5 w-5" />, text: "Secure payment processing" },
      { icon: <TrendingUp className="h-5 w-5" />, text: "Automatic sales tracking" },
      { icon: <BarChart3 className="h-5 w-5" />, text: "Detailed revenue analytics" }
    ],
    driver: [
      { icon: <Truck className="h-5 w-5" />, text: "Get paid for deliveries" },
      { icon: <Zap className="h-5 w-5" />, text: "Fast weekly payouts" },
      { icon: <Award className="h-5 w-5" />, text: "Bonus opportunities" },
      { icon: <Calendar className="h-5 w-5" />, text: "Flexible earning schedule" }
    ]
  };

  if (loading && !account) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p>Checking your payment setup...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {userType === 'merchant' ? 'Merchant Payment Setup' : 'Driver Payment Setup'}
              </CardTitle>
              <CardDescription>
                Secure payment processing powered by Stripe Connect
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress Card */}
      {account && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Setup Progress
              </CardTitle>
              <Badge variant={step === 'complete' ? 'default' : 'secondary'}>
                {getCompletionPercentage()}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={getCompletionPercentage()} className="mb-4" />
            
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                {account.detailsSubmitted ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm">Business details submitted</span>
              </div>
              
              <div className="flex items-center gap-2">
                {account.capabilities.card_payments === 'active' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm">Card payments enabled</span>
              </div>
              
              <div className="flex items-center gap-2">
                {account.capabilities.transfers === 'active' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm">Transfers enabled</span>
              </div>
              
              <div className="flex items-center gap-2">
                {account.chargesEnabled && account.payoutsEnabled ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm">Payouts enabled</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-gray-600">{getRequirementsText()}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshAccountStatus}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Status
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Action Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'create' && 'Set Up Payment Processing'}
            {step === 'onboard' && 'Complete Your Onboarding'}
            {step === 'complete' && '🎉 Payment Setup Complete!'}
          </CardTitle>
          <CardDescription>
            {step === 'create' && 'Create your Stripe Connect account to start receiving payments'}
            {step === 'onboard' && 'Finish your Stripe onboarding to activate payments'}
            {step === 'complete' && 'You\'re all set up and ready to receive payments!'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          
          {step === 'create' && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {benefits[userType].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-blue-500">{benefit.icon}</div>
                    <span className="text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Secure & Trusted:</strong> Your payment information is processed securely by Stripe, 
                  the same technology used by millions of businesses worldwide.
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  onClick={createConnectAccount}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Set Up Payments
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'onboard' && (
            <div className="space-y-6">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Action Required:</strong> Complete your Stripe onboarding to start receiving payments. 
                  This includes verifying your identity and providing business information.
                </AlertDescription>
              </Alert>

              {account && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-3">Account Information:</h4>
                  <div className="grid gap-2 text-sm">
                    <div><strong>Account ID:</strong> {account.id}</div>
                    <div><strong>Country:</strong> {account.country}</div>
                    <div><strong>Currency:</strong> {account.default_currency?.toUpperCase()}</div>
                    <div><strong>Created:</strong> {new Date(account.created * 1000).toLocaleDateString()}</div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  onClick={getOnboardingLink}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Getting Link...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Continue Onboarding
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={refreshAccountStatus}
                  disabled={refreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {onboardingUrl && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Onboarding Link:</strong> Click the button above or use this link:
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={onboardingUrl} 
                      readOnly 
                      className="flex-1 px-2 py-1 text-xs bg-white border rounded"
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(onboardingUrl);
                        toast({ title: "Link copied!", variant: "default" });
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'complete' && (
            <div className="space-y-6">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Payment Setup Complete!</h3>
                <p className="text-gray-600">
                  {userType === 'merchant' 
                    ? 'You can now receive payments from customers instantly.'
                    : 'You can now receive delivery payments and weekly payouts.'
                  }
                </p>
              </div>

              {account && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">✅ Charges Enabled</h4>
                    <p className="text-sm text-green-700">
                      {userType === 'merchant' 
                        ? 'Accept customer payments'
                        : 'Receive delivery earnings'
                      }
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">✅ Payouts Enabled</h4>
                    <p className="text-sm text-green-700">
                      {userType === 'merchant' 
                        ? 'Automatic daily transfers'
                        : 'Weekly payout schedule'
                      }
                    </p>
                  </div>
                </div>
              )}

              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>You're all set!</strong> Your payment processing is now active. 
                  {userType === 'merchant' 
                    ? ' You can start accepting delivery orders immediately.'
                    : ' You can start earning from deliveries right away.'
                  }
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button onClick={onComplete} className="px-8">
                  <Package className="mr-2 h-4 w-4" />
                  {userType === 'merchant' ? 'Go to Store Dashboard' : 'Start Taking Deliveries'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h4 className="font-medium mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-4">
              Our team is here to help you get set up quickly and securely.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email Support
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 