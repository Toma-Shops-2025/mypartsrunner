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
}

interface ProductGridProps {
  categoryId?: string;
  searchTerm?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoryId, searchTerm }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchTerm]);

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
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process products to ensure proper image URLs
      const processedProducts = (data || []).map(product => ({
        ...product,
        // Ensure images array is properly parsed if it's a string
        images: Array.isArray(product.images) ? product.images : 
                 (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : [])
      }));
      
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-2">
          {searchTerm ? `No results for "${searchTerm}"` : 'Try creating a new listing!'}
        </p>
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

export default ProductGrid;