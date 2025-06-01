import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import VideoFeedItem from './VideoFeedItem';
import VideoFeedAd from './VideoFeedAd';

interface Product {
  id: string;
  title: string;
  price: string;
  video_url: string;
  image_url: string;
  seller_id: string;
  description: string;
}

interface VideoFeedProps {
  categoryId?: string;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const formattedProducts = (data || []).map(product => ({
        id: product.id,
        title: product.title,
        price: product.price.toString(),
        video_url: product.video_url || '',
        image_url: product.image_url || product.thumbnail_url || '/placeholder.svg',
        seller_id: product.seller_id,
        description: product.description || ''
      })).filter(product => product.video_url && product.video_url.trim() !== '');
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching video products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading videos...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-2">No videos available</p>
          <p className="text-gray-400">Check back later for new content</p>
        </div>
      </div>
    );
  }

  const shouldShowAd = (index: number) => {
    return index > 0 && index % 10 === 0;
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {products.map((product, index) => (
        <div key={product.id}>
          <VideoFeedItem
            product={{
              ...product,
              thumbnail_url: product.image_url
            }}
            isActive={index === currentIndex && !shouldShowAd(currentIndex)}
            onNext={goToNext}
            onPrevious={goToPrevious}
          />
          {shouldShowAd(index) && index === currentIndex && (
            <div className="absolute inset-0 z-20">
              <VideoFeedAd position="middle" />
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
                <Button onClick={goToNext} className="bg-white text-black">
                  Continue Watching
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10">
        <Button
          onClick={goToPrevious}
          size="sm"
          variant="ghost"
          className="rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          onClick={goToNext}
          size="sm"
          variant="ghost"
          className="rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideoFeed;