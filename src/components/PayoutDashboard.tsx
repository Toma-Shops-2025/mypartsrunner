import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  Users, 
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Download,
  Eye,
  Play,
  BarChart3,
  Calendar,
  Filter
} from 'lucide-react';
import { usePayouts } from '@/hooks/use-payouts';
import { useAppContext } from '@/contexts/AppContext';
import { PayoutResult, Transaction } from '@/lib/payment-processor';

export const PayoutDashboard: React.FC = () => {
  const { user } = useAppContext();
  const {
    loading,
    payoutHistory,
    walletBalance,
    processOrderPayout,
    testPayout,
    loadPayoutHistory,
    refreshWalletBalance,
    getTotalEarnings,
    getEarningsBreakdown,
    formatCurrency,
    canProcessPayouts,
    canViewPayoutHistory
  } = usePayouts();

  const [activeTab, setActiveTab] = useState('overview');
  const [testOrderId, setTestOrderId] = useState('');
  [testResult, setTestResult] = useState<PayoutResult | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // Load data on component mount
  useEffect(() => {
    if (canViewPayoutHistory()) {
      loadPayoutHistory();
    }
    refreshWalletBalance();
  }, [loadPayoutHistory, refreshWalletBalance, canViewPayoutHistory]);

  const handleTestPayout = async () => {
    if (!testOrderId.trim()) {
      return;
    }
    
    try {
      const result = await testPayout(testOrderId);
      setTestResult(result);
    } catch (error) {
      console.error('Test payout failed:', error);
    }
  };

  const handleProcessPayout = async (orderId: string) => {
    try {
      await processOrderPayout(orderId);
      // Refresh data after successful payout
      loadPayoutHistory();
      refreshWalletBalance();
    } catch (error) {
      console.error('Process payout failed:', error);
    }
  };

  const earningsBreakdown = getEarningsBreakdown();
  const totalEarnings = getTotalEarnings(selectedPeriod);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payout Dashboard</h1>
          <p className="text-gray-600">Manage your earnings and process payouts</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              loadPayoutHistory();
              refreshWalletBalance();
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              // Export payout data
              const dataStr = JSON.stringify(payoutHistory, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `payouts-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(walletBalance)}
            </div>
            <p className="text-xs text-gray-600 mt-1">Available for withdrawal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalEarnings)}
            </div>
            <p className="text-xs text-gray-600 mt-1">This {selectedPeriod}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {payoutHistory.length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Completed transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {payoutHistory.length > 0 ? '100%' : 'N/A'}
            </div>
            <p className="text-xs text-gray-600 mt-1">Successful payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="test">Test Mode</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earnings Breakdown</CardTitle>
                <CardDescription>Your earnings by role and period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(earningsBreakdown).map(([role, amount]) => (
                    <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          role === 'merchant' ? 'bg-blue-500' :
                          role === 'driver' ? 'bg-green-500' :
                          'bg-purple-500'
                        }`} />
                        <span className="font-medium capitalize">{role}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest payout transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payoutHistory.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {payoutHistory.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No payout history yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payout History</CardTitle>
              <CardDescription>Complete history of all payout transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payoutHistory.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.role === 'merchant' ? 'bg-blue-100' :
                        transaction.role === 'driver' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <Package className={`h-5 w-5 ${
                          transaction.role === 'merchant' ? 'text-blue-600' :
                          transaction.role === 'driver' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                      </div>
                      
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {transaction.role}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(transaction.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-bold">{formatCurrency(transaction.amount)}</p>
                      <p className="text-xs text-gray-500">Order: {transaction.order_id.slice(0, 8)}...</p>
                    </div>
                  </div>
                ))}
                
                {payoutHistory.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No payout transactions found</p>
                    <p className="text-sm">Complete orders to see payout history</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Earnings Analytics</CardTitle>
              <CardDescription>Detailed analysis of your earnings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Period Selector */}
                <div className="flex items-center gap-4">
                  <Label htmlFor="period">Time Period:</Label>
                  <select
                    id="period"
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="border rounded-md px-3 py-2"
                  >
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>

                {/* Earnings Chart Placeholder */}
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">Earnings chart will be displayed here</p>
                    <p className="text-sm text-gray-400">Integration with charting library coming soon</p>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalEarnings)}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Transaction Count</p>
                    <p className="text-2xl font-bold text-green-700">{payoutHistory.length}</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600">Average Payout</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {payoutHistory.length > 0 
                        ? formatCurrency(totalEarnings / payoutHistory.length)
                        : formatCurrency(0)
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Mode Tab */}
        <TabsContent value="test" className="space-y-4">
          {canProcessPayouts() ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Payout Calculation</CardTitle>
                <CardDescription>Test payout calculations without processing actual payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="testOrderId">Order ID to Test:</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="testOrderId"
                        value={testOrderId}
                        onChange={(e) => setTestOrderId(e.target.value)}
                        placeholder="Enter order ID to test payout calculation"
                      />
                      <Button onClick={handleTestPayout} disabled={!testOrderId.trim() || loading}>
                        <Play className="h-4 w-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>

                  {testResult && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-3">Test Results for Order: {testResult.order_id}</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Merchant Payout:</span>
                            <span className="font-semibold text-blue-600">
                              {formatCurrency(testResult.calculations.merchant_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Driver Payout:</span>
                            <span className="font-semibold text-green-600">
                              {formatCurrency(testResult.calculations.driver_amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>House Payout:</span>
                            <span className="font-semibold text-purple-600">
                              {formatCurrency(testResult.calculations.house_amount)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Service Fee Tax:</span>
                            <span className="font-semibold">
                              {formatCurrency(testResult.calculations.service_fee_tax)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Payout:</span>
                            <span className="font-semibold text-lg">
                              {formatCurrency(testResult.calculations.total_payout)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          onClick={() => handleProcessPayout(testResult.order_id)}
                          disabled={loading}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Process Actual Payout
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Test Mode Not Available</h3>
                <p className="text-gray-600">
                  Only merchants and administrators can test payout calculations.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}; 