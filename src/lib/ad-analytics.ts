import { supabase } from './supabase';

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

export const trackAdView = async (adId: string, location: string) => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    await supabase.from('ad_views').insert([{
      ad_id: adId,
      location,
      user_id: userId,
      timestamp: new Date().toISOString()
    }]);
  } catch (error) {
    console.error('Error tracking ad view:', error);
  }
};

export const trackAdClick = async (adId: string, location: string) => {
  try {
    const user = await supabase.auth.getUser();
    const userId = user.data.user?.id;

    await supabase.from('ad_clicks').insert([{
      ad_id: adId,
      location,
      user_id: userId,
      timestamp: new Date().toISOString()
    }]);
  } catch (error) {
    console.error('Error tracking ad click:', error);
  }
};

export const getAdStats = async (adId: string) => {
  try {
    const [viewsResponse, clicksResponse] = await Promise.all([
      supabase
        .from('ad_views')
        .select('count', { count: 'exact' })
        .eq('ad_id', adId),
      supabase
        .from('ad_clicks')
        .select('count', { count: 'exact' })
        .eq('ad_id', adId)
    ]);

    return {
      views: viewsResponse.count || 0,
      clicks: clicksResponse.count || 0,
      ctr: viewsResponse.count ? (clicksResponse.count || 0) / viewsResponse.count : 0
    };
  } catch (error) {
    console.error('Error fetching ad stats:', error);
    return { views: 0, clicks: 0, ctr: 0 };
  }
}; 