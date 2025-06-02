import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AdView {
  ad_id: string;
  timestamp: string;
  location: string;
  user_id?: string;
}

export interface AdClick {
  ad_id: string;
  timestamp: string;
  location: string;
  user_id?: string;
}

interface AdAnalyticsResponse {
  views_count: number;
  clicks_count: number;
  ctr: number;
}

export async function trackAdView(adId: string) {
  try {
    const ipAddress = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip);

    await supabase.from('ad_views').insert({
      ad_id: adId,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error('Error tracking ad view:', error);
  }
}

export async function trackAdClick(adId: string) {
  try {
    const ipAddress = await fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => data.ip);

    await supabase.from('ad_clicks').insert({
      ad_id: adId,
      ip_address: ipAddress,
    });
  } catch (error) {
    console.error('Error tracking ad click:', error);
  }
}

export async function getAdAnalytics(adId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_ad_analytics', { ad_id: adId })
      .single();

    if (error) throw error;

    const analytics = data as AdAnalyticsResponse;
    return {
      views: analytics.views_count,
      clicks: analytics.clicks_count,
      ctr: analytics.ctr,
    };
  } catch (error) {
    console.error('Error getting ad analytics:', error);
    throw error;
  }
}

export async function getRevenueAnalytics(userId: string, startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('amount, created_at')
      .eq('user_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .eq('status', 'succeeded');

    if (error) throw error;

    const totalRevenue = data.reduce((sum, payment) => sum + payment.amount, 0);
    const dailyRevenue = data.reduce((acc, payment) => {
      const date = new Date(payment.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRevenue,
      dailyRevenue,
    };
  } catch (error) {
    console.error('Error getting revenue analytics:', error);
    throw error;
  }
} 