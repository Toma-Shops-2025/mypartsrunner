import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  thumbnail_url?: string;
  video_url?: string;
  images?: string[];
  description: string;
  status: string;
  created_at: string;
  featured?: boolean;
}

const FeaturedListings: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const processedProducts = (data || []).map(product => ({
        ...product,
        images: Array.isArray(product.images) ? product.images : 
                (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : [])
      }));
      
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No featured listings found</p>
        <p className="text-gray-400 text-sm mt-2">Admin can mark listings as featured</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default FeaturedListings;