import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { LocationDisplay } from '@/components/LocationDisplay';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  thumbnail_url?: string;
  video_url?: string;
  images?: string[];
  description: string;
  city?: string;
  state?: string;
  country?: string;
  shipping_available?: boolean;
  local_pickup?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Get the proper image URL
  const getImageUrl = () => {
    // Check if we have images array with URLs
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // If it's already a full URL, use it
      if (firstImage.startsWith('http')) {
        return firstImage;
      }
      // Otherwise, construct the Supabase storage URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(firstImage);
      return data.publicUrl;
    }
    
    // Fallback to thumbnail_url or image_url
    if (product.thumbnail_url && product.thumbnail_url.startsWith('http')) {
      return product.thumbnail_url;
    }
    
    if (product.image_url && product.image_url.startsWith('http')) {
      return product.image_url;
    }
    
    // If we have a path but not a full URL, construct it
    if (product.thumbnail_url && !product.thumbnail_url.startsWith('http')) {
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(product.thumbnail_url);
      return data.publicUrl;
    }
    
    return '/placeholder.svg';
  };

  const imageUrl = getImageUrl();
  const hasVideo = !!product.video_url;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      <div className="relative">
        <img 
          src={imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-t-lg">
            <Play className="w-12 h-12 text-white" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mb-3">
          <LocationDisplay
            city={product.city}
            state={product.state}
            country={product.country}
            shippingAvailable={product.shipping_available}
            localPickup={product.local_pickup}
            compact={true}
            showShippingOptions={false}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <Button size="sm" onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}>
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;