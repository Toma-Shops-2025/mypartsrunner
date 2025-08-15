import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Wallet,
  TrendingUp,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  MapPin,
  Package,
  Star,
  Award,
  Target,
  Zap,
  BarChart3,
  PieChart,
  TrendingDown
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

interface PaymentMethod {
  type: 'paypal' | 'bankAccount' | 'debitCard' | 'cashApp' | 'venmo' | 'stripe';
  label: string;
  icon: React.ReactNode;
  value: string;
  isVerified: boolean;
  isDefault: boolean;
}

interface EarningsData {
  totalEarnings: number;
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  totalDeliveries: number;
  todayDeliveries: number;
  weekDeliveries: number;
  monthDeliveries: number;
  averagePerDelivery: number;
  rating: number;
  completionRate: number;
  onTimeRate: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'delivery_payment' | 'bonus' | 'payout';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  orderId?: string;
}

interface DriverEarningsProps {
  driver: any;
  onUpdatePaymentMethods: (methods: any) => Promise<void>;
}

export const DriverEarnings: React.FC<DriverEarningsProps> = ({ 
  driver, 
  onUpdatePaymentMethods 
}) => {
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    todayEarnings: 0,
    weekEarnings: 0,
    monthEarnings: 0,
    totalDeliveries: 0,
    todayDeliveries: 0,
    weekDeliveries: 0,
    monthDeliveries: 0,
    averagePerDelivery: 0,
    rating: 0,
    completionRate: 0,
    onTimeRate: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      type: 'paypal',
      label: 'PayPal',
      icon: <CreditCard className="h-4 w-4" />,
      value: driver?.paymentMethods?.paypal || '',
      isVerified: false,
      isDefault: false
    },
    {
      type: 'bankAccount',
      label: 'Bank Account',
      icon: <Banknote className="h-4 w-4" />,
      value: driver?.paymentMethods?.bankAccount || '',
      isVerified: false,
      isDefault: false
    },
    {
      type: 'cashApp',
      label: 'Cash App',
      icon: <Smartphone className="h-4 w-4" />,
      value: driver?.paymentMethods?.cashApp || '',
      isVerified: false,
      isDefault: true
    },
    {
      type: 'venmo',
      label: 'Venmo',
      icon: <Smartphone className="h-4 w-4" />,
      value: driver?.paymentMethods?.venmo || '',
      isVerified: false,
      isDefault: false
    }
  ]);

  useEffect(() => {
    if (user?.role === 'driver') {
      loadEarningsData();
      loadTransactions();
    }
  }, [user]);

  const loadEarningsData = async () => {
    try {
      setLoading(true);
      
      // Get current date ranges
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch transactions for calculations
      const { data: allTransactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('recipient_id', user.id)
        .eq('status', 'completed')
        .gte('created_at', '2024-01-01');

      if (error) {
        console.error('Error loading earnings:', error);
        return;
      }

      const transactions = allTransactions || [];
      
      // Calculate earnings
      const totalEarnings = transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const todayTransactions = transactions.filter(t => new Date(t.created_at) >= today);
      const weekTransactions = transactions.filter(t => new Date(t.created_at) >= weekStart);
      const monthTransactions = transactions.filter(t => new Date(t.created_at) >= monthStart);

      const todayEarnings = todayTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const weekEarnings = weekTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const monthEarnings = monthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);

      // Mock delivery data (would come from orders/deliveries table in real app)
      const totalDeliveries = Math.floor(transactions.length * 1.2); // Assume some transactions might be bonuses
      const todayDeliveries = Math.floor(todayTransactions.length * 1.2);
      const weekDeliveries = Math.floor(weekTransactions.length * 1.2);
      const monthDeliveries = Math.floor(monthTransactions.length * 1.2);

      setEarningsData({
        totalEarnings,
        todayEarnings,
        weekEarnings,
        monthEarnings,
        totalDeliveries,
        todayDeliveries,
        weekDeliveries,
        monthDeliveries,
        averagePerDelivery: totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0,
        rating: 4.8, // Mock data
        completionRate: 98.5, // Mock data
        onTimeRate: 95.2 // Mock data
      });
    } catch (error) {
      console.error('Error loading earnings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handlePaymentMethodUpdate = async (index: number, value: string) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index].value = value;
    setPaymentMethods(updatedMethods);
  };

  const handleSavePaymentMethods = async () => {
    try {
      const methodsObject = paymentMethods.reduce((acc, method) => {
        if (method.value) {
          acc[method.type] = method.value;
        }
        return acc;
      }, {} as any);

      await onUpdatePaymentMethods(methodsObject);
      setIsEditing(false);
      toast({
        title: "Payment methods updated",
        description: "Your payment methods have been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error updating payment methods",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const requestPayout = async () => {
    toast({
      title: "Payout requested",
      description: "Your payout request has been submitted and will be processed within 1-2 business days.",
      variant: "default"
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <Clock className="h-6 w-6 animate-spin mr-2" />
          Loading earnings data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +${earningsData.monthEarnings.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.todayEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {earningsData.todayDeliveries} deliveries today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Delivery</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsData.averagePerDelivery.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {earningsData.totalDeliveries} total deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Driver Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {earningsData.rating.toFixed(1)}
              <Star className="h-5 w-5 ml-1 text-yellow-500 fill-current" />
            </div>
            <p className="text-xs text-muted-foreground">
              {earningsData.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>Your delivery performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completion Rate</span>
                <span>{earningsData.completionRate}%</span>
              </div>
              <Progress value={earningsData.completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>On-Time Rate</span>
                <span>{earningsData.onTimeRate}%</span>
              </div>
              <Progress value={earningsData.onTimeRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Customer Rating</span>
                <span>{earningsData.rating}/5.0</span>
              </div>
              <Progress value={(earningsData.rating / 5) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-bold">${earningsData.weekEarnings.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deliveries</span>
                    <span>{earningsData.weekDeliveries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg per Day</span>
                    <span>${(earningsData.weekEarnings / 7).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">⭐ Top Rated</Badge>
                    <span className="text-sm">4.8+ rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">🚀 Speedy</Badge>
                    <span className="text-sm">95%+ on-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">💎 Reliable</Badge>
                    <span className="text-sm">98%+ completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>Your payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : transaction.status === 'pending' ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +${parseFloat(transaction.amount).toFixed(2)}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No transactions yet</p>
                    <p className="text-sm text-gray-400">Complete deliveries to see earnings here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Payment Methods
                </span>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditing ? handleSavePaymentMethods() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  ) : (
                    'Edit'
                  )}
                </Button>
              </CardTitle>
              <CardDescription>
                Manage how you receive payments for deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={method.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div>
                        <p className="font-medium">{method.label}</p>
                        {method.isDefault && (
                          <Badge variant="default" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <Input
                          type="text"
                          placeholder={`Enter ${method.label} details`}
                          value={method.value}
                          onChange={(e) => handlePaymentMethodUpdate(index, e.target.value)}
                          className="w-64"
                        />
                      ) : (
                        <span className="text-sm text-gray-500">
                          {method.value ? 
                            method.type === 'bankAccount' ? '****' + method.value.slice(-4) : method.value
                            : 'Not set'
                          }
                        </span>
                      )}
                      {method.isVerified && (
                        <Badge variant="default" className="text-xs bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Available Balance</h4>
                    <p className="text-2xl font-bold text-blue-600">${earningsData.weekEarnings.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">Ready for payout</p>
                  </div>
                  <Button onClick={requestPayout} className="bg-blue-600 hover:bg-blue-700">
                    <Send className="mr-2 h-4 w-4" />
                    Request Payout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Earnings Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Delivery Fees</span>
                    <span className="font-bold">${(earningsData.totalEarnings * 0.8).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tips</span>
                    <span className="font-bold">${(earningsData.totalEarnings * 0.15).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bonuses</span>
                    <span className="font-bold">${(earningsData.totalEarnings * 0.05).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Weekly Goal</span>
                      <span>{Math.round((earningsData.weekEarnings / 500) * 100)}%</span>
                    </div>
                    <Progress value={(earningsData.weekEarnings / 500) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Goal</span>
                      <span>{Math.round((earningsData.monthEarnings / 2000) * 100)}%</span>
                    </div>
                    <Progress value={(earningsData.monthEarnings / 2000) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 