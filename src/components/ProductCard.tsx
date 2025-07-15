import React from 'react';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatDistance } from 'date-fns';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { shareProduct, likedProducts, toggleLike } = useApp();
  const isLiked = likedProducts.includes(product.id);

  const timeAgo = formatDistance(new Date(product.created_at), new Date(), { addSuffix: true });

  return (
    <Card className={`overflow-hidden group cursor-pointer hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.thumbnail_url || product.image_url || '/placeholder.svg'}
            alt={product.title}
            className="w-full aspect-square object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
          {product.video_url && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
              Video
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(product.id);
              }}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                shareProduct(product);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-base line-clamp-1">{product.title}</h3>
            <div className="text-lg font-bold whitespace-nowrap">${product.price.toFixed(2)}</div>
          </div>
          <div className="mt-1 flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">2.5 miles away</span>
          </div>
          <div className="mt-1 text-xs text-gray-400">{timeAgo}</div>
        </div>
      </CardContent>
    </Card>
  );
}