import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { AdSpace } from './AdSpace';
import { trackAdView, trackAdClick } from '@/lib/ad-analytics';

interface ActiveAdProps {
  location: 'sidebar' | 'header' | 'footer' | 'content';
  size: 'small' | 'medium' | 'large';
}

interface Ad {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  status: 'approved';
  location: string;
  start_date: string;
  end_date: string;
}

export const ActiveAd: React.FC<ActiveAdProps> = ({ location, size }) => {
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  useEffect(() => {
    fetchActiveAd();
    // Refresh ad every 5 minutes
    const interval = setInterval(fetchActiveAd, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    if (currentAd && !hasTrackedView) {
      trackAdView(currentAd.id, location);
      setHasTrackedView(true);
    }
  }, [currentAd, location, hasTrackedView]);

  const fetchActiveAd = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'approved')
        .eq('location', location)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No ads found
          setCurrentAd(null);
        } else {
          throw error;
        }
      } else {
        setCurrentAd(data);
        setHasTrackedView(false); // Reset view tracking for new ad
      }
    } catch (error) {
      console.error('Error fetching active ad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (currentAd) {
      trackAdClick(currentAd.id, location);
      window.open(currentAd.link_url, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <Card className={`animate-pulse bg-muted ${sizeToClass[size]}`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </Card>
    );
  }

  if (!currentAd) {
    return <AdSpace location={location} size={size} />;
  }

  return (
    <button
      onClick={handleAdClick}
      className="block w-full transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
    >
      <Card className={sizeToClass[size]}>
        <img
          src={currentAd.image_url}
          alt={currentAd.title}
          className="w-full h-full object-cover rounded"
        />
      </Card>
    </button>
  );
};

const sizeToClass = {
  small: 'h-[250px] w-[300px]',
  medium: 'h-[280px] w-[336px]',
  large: 'h-[400px] w-[970px]',
}; 