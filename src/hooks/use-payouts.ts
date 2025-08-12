import { useState, useCallback } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { 
  processPayout, 
  testPayoutCalculation, 
  getUserPayoutHistory, 
  getUserWalletBalance,
  PayoutResult,
  Transaction
} from '@/lib/payment-processor';
import { toast } from '@/hooks/use-toast';

export const usePayouts = () => {
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  /**
   * Process payout for a completed order
   */
  const processOrderPayout = useCallback(async (orderId: string): Promise<PayoutResult> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to process payouts",
        variant: "destructive"
      });
      throw new Error("User not authenticated");
    }

    setLoading(true);
    try {
      const result = await processPayout(orderId);
      
      if (result.success) {
        toast({
          title: "Payout processed successfully! 🎉",
          description: `Order ${orderId} has been paid out to all parties.`,
          variant: "default"
        });
        
        // Refresh wallet balance if user is involved
        if (user.id === result.transactions.find(t => t.recipient_id === user.id)?.recipient_id) {
          await refreshWalletBalance();
        }
      } else {
        toast({
          title: "Payout failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process payout";
      toast({
        title: "Payout error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Test payout calculation without processing
   */
  const testPayout = useCallback(async (orderId: string): Promise<PayoutResult> => {
    setLoading(true);
    try {
      const result = await testPayoutCalculation(orderId);
      
      if (result.success) {
        toast({
          title: "Test calculation successful",
          description: `Payout calculation preview for order ${orderId}`,
          variant: "default"
        });
      } else {
        toast({
          title: "Test calculation failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to test payout";
      toast({
        title: "Test error",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Load user's payout history
   */
  const loadPayoutHistory = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const history = await getUserPayoutHistory(user.id);
      setPayoutHistory(history);
    } catch (error) {
      console.error('Failed to load payout history:', error);
      toast({
        title: "Failed to load payout history",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Refresh user's wallet balance
   */
  const refreshWalletBalance = useCallback(async () => {
    if (!user) return;

    try {
      const balance = await getUserWalletBalance(user.id);
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to refresh wallet balance:', error);
    }
  }, [user]);

  /**
   * Get total earnings for a specific time period
   */
  const getTotalEarnings = useCallback((period: 'day' | 'week' | 'month' | 'year' = 'month') => {
    if (!payoutHistory.length) return 0;

    const now = new Date();
    let cutoffDate: Date;

    switch (period) {
      case 'day':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        cutoffDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return payoutHistory
      .filter(transaction => new Date(transaction.created_at) >= cutoffDate)
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [payoutHistory]);

  /**
   * Get earnings breakdown by role
   */
  const getEarningsBreakdown = useCallback(() => {
    if (!payoutHistory.length) return {};

    return payoutHistory.reduce((breakdown, transaction) => {
      const role = transaction.role;
      if (!breakdown[role]) {
        breakdown[role] = 0;
      }
      breakdown[role] += transaction.amount;
      return breakdown;
    }, {} as Record<string, number>);
  }, [payoutHistory]);

  /**
   * Format currency for display
   */
  const formatCurrency = useCallback((amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }, []);

  /**
   * Check if user can process payouts
   */
  const canProcessPayouts = useCallback((): boolean => {
    if (!user) return false;
    
    // Only merchants and admins can process payouts
    return ['merchant', 'admin'].includes(user.role);
  }, [user]);

  /**
   * Check if user can view payout history
   */
  const canViewPayoutHistory = useCallback((): boolean => {
    if (!user) return false;
    
    // All authenticated users can view their own payout history
    return true;
  }, [user]);

  return {
    // State
    loading,
    payoutHistory,
    walletBalance,
    
    // Actions
    processOrderPayout,
    testPayout,
    loadPayoutHistory,
    refreshWalletBalance,
    
    // Computed values
    getTotalEarnings,
    getEarningsBreakdown,
    formatCurrency,
    
    // Permissions
    canProcessPayouts,
    canViewPayoutHistory
  };
}; 