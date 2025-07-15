import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { VideoFeedItem } from './VideoFeedItem';
import VideoFeedAd from './VideoFeedAd';
import { Link } from 'react-router-dom';

interface VideoFeedProps {
  categoryId?: string;
}

const AdPlaceholder = () => (
  <div className="absolute inset-0 bg-white flex items-center justify-center">
    <div className="max-w-md text-center p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Advertise Here
      </h2>
      <p className="text-gray-600 mb-6">
        Reach thousands of engaged shoppers on TomaShops' video marketplace.
      </p>
      <Link
        to="/advertise"
        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Learn About Advertising
      </Link>
    </div>
  </div>
);

export function VideoFeed({ categoryId }: VideoFeedProps) {
  const [videos, setVideos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [categoryId]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .not('video_url', 'is', null)
        .order('created_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-2" />
            <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
            <div className="bg-gray-200 h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map(video => (
        <VideoFeedItem key={video.id} video={video} />
      ))}
    </div>
  );
}

export default VideoFeed;