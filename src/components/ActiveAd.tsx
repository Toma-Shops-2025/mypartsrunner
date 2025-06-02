import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  destination_url: string;
  size: 'small' | 'medium' | 'large';
  location: 'sidebar' | 'header' | 'footer' | 'content';
  start_date: string;
  end_date: string;
  daily_rate: number;
  views_count: number;
  clicks_count: number;
  ctr: number;
}

interface AdAnalytics {
  views_count: number;
  clicks_count: number;
  ctr: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ActiveAd({ adId }: { adId: string }) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        // Fetch ad analytics
        const { data: adData, error: adError } = await supabase
          .rpc('get_ad_analytics', { ad_id: adId })
          .single();

        if (adError) throw adError;

        // Fetch ad details
        const { data: adDetails, error: detailsError } = await supabase
          .from('ads')
          .select('*')
          .eq('id', adId)
          .single();

        if (detailsError) throw detailsError;

        const analytics = adData as AdAnalytics;
        
        setAd({
          ...(adDetails as Ad),
          views_count: analytics.views_count,
          clicks_count: analytics.clicks_count,
          ctr: analytics.ctr,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [adId]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error || 'Ad not found'}
      </div>
    );
  }

  const daysRemaining = Math.ceil(
    (new Date(ad.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{ad.title}</h3>
          <p className="text-gray-600">{ad.description}</p>
        </div>
        <span className={`px-2 py-1 rounded text-sm ${
          daysRemaining > 7 ? 'bg-green-100 text-green-800' :
          daysRemaining > 3 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {daysRemaining} days remaining
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Views</div>
          <div className="text-xl font-semibold">{ad.views_count}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Clicks</div>
          <div className="text-xl font-semibold">{ad.clicks_count}</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">CTR</div>
          <div className="text-xl font-semibold">{ad.ctr.toFixed(2)}%</div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <div className="text-sm text-gray-600">Daily Rate</div>
          <div className="text-xl font-semibold">${ad.daily_rate}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Size: <span className="font-medium capitalize">{ad.size}</span>
        </div>
        <div>
          Location: <span className="font-medium capitalize">{ad.location}</span>
        </div>
        <a
          href={ad.destination_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View Landing Page
        </a>
      </div>
    </div>
  );
}

const sizeToClass = {
  small: 'h-[250px] w-[300px]',
  medium: 'h-[280px] w-[336px]',
  large: 'h-[400px] w-[970px]',
}; 