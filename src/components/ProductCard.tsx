import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { LocationDisplay } from '@/components/LocationDisplay';
import { supabase } from '@/lib/supabase';
import { Database } from '../lib/database.types';
import { useApp } from '../contexts/AppContext';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useApp();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  // Get the proper image URL
  const getImageUrl = () => {
    if (product.image_url && product.image_url.startsWith('http')) {
      return product.image_url;
    }
    
    if (product.image_url) {
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(product.image_url);
      return data.publicUrl;
    }
    
    return '/placeholder.svg';
  };

  const imageUrl = getImageUrl();
  const hasVideo = false;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={imageUrl}
          alt={product.name}
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
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mb-3">
          {/* Remove LocationDisplay component since it requires unavailable props */}
        </div>
        
        <div className="mt-2">
          <span className="text-lg font-medium text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {product.quantity} in stock
          </span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.max(1, quantity - 1));
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="text-gray-700">{quantity}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(Math.min(product.quantity, quantity + 1));
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;