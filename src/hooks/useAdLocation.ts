import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Ad {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  clickUrl: string;
  locationId: string;
  startDate: string;
  endDate: string;
}

export function useAdLocation(locationId: string) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchAd() {
      try {
        setIsLoading(true);
        
        // Get the ad_location_id first
        const { data: locationData, error: locationError } = await supabase
          .from('ad_locations')
          .select('id')
          .eq('name', locationId)
          .single();

        if (locationError) throw locationError;
        if (!locationData) throw new Error('Ad location not found');

        // Get the active booking for this location
        const now = new Date().toISOString();
        const { data: bookingData, error: bookingError } = await supabase
          .from('ad_location_bookings')
          .select(`
            id,
            title,
            description,
            image_url,
            click_url,
            start_date,
            end_date
          `)
          .eq('location_id', locationData.id)
          .lte('start_date', now)
          .gte('end_date', now)
          .eq('status', 'active')
          .single();

        if (bookingError) throw bookingError;
        
        if (bookingData) {
          setAd({
            id: bookingData.id,
            title: bookingData.title,
            description: bookingData.description,
            imageUrl: bookingData.image_url,
            clickUrl: bookingData.click_url,
            locationId: locationData.id,
            startDate: bookingData.start_date,
            endDate: bookingData.end_date
          });
        } else {
          setAd(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch ad'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAd();
  }, [locationId]);

  return { ad, isLoading, error };
} 