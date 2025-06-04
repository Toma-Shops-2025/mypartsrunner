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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products with params:', {
        categoryId,
        searchTerm,
        timestamp: new Date().toISOString()
      });
      
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
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Supabase query error:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }
      
      console.log('Products fetch result:', {
        count: data?.length || 0,
        hasData: !!data,
        timestamp: new Date().toISOString()
      });

      if (!data) {
        throw new Error('No data returned from Supabase');
      }
      
      // Process products to ensure proper image URLs
      const processedProducts = data.map(product => {
        try {
          return {
            ...product,
            // Ensure images array is properly parsed if it's a string
            images: Array.isArray(product.images) ? product.images : 
                    (typeof product.images === 'string' ? JSON.parse(product.images || '[]') : [])
          };
        } catch (parseError) {
          console.error('Error processing product:', {
            productId: product.id,
            error: parseError,
            imagesData: product.images
          });
          return {
            ...product,
            images: []
          };
        }
      });
      
      setProducts(processedProducts);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error fetching products';
      console.error('Error in fetchProducts:', {
        error,
        message: errorMessage,
        params: { categoryId, searchTerm }
      });
      setError(errorMessage);
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

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Error loading products</p>
        <p className="text-gray-400 text-sm mt-2">{error}</p>
        <button 
          onClick={() => fetchProducts()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
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