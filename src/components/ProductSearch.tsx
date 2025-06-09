import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useApp } from '../contexts/AppContext';
import { Database } from '../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductSearchProps {
  storeId?: string;
  onSelect?: (product: Product) => void;
}

export default function ProductSearch({ storeId, onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useApp();

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    const searchProducts = async () => {
      setIsLoading(true);
      try {
        let productQuery = supabase
          .from('products')
          .select('*')
          .eq('status', 'in_stock')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
          .order('name')
          .limit(10);

        if (storeId) {
          productQuery = productQuery.eq('store_id', storeId);
        }

        const { data, error } = await productQuery;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error searching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query, storeId]);

  const handleProductSelect = (product: Product) => {
    if (onSelect) {
      onSelect(product);
    } else {
      addToCart(product, 1);
    }
    setQuery('');
    setProducts([]);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for parts..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
      />

      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-brand-blue border-t-transparent" />
        </div>
      )}

      {products.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          <ul className="max-h-60 overflow-auto">
            {products.map((product) => (
              <li
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <div className="flex items-center">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      ${product.price.toFixed(2)} - {product.category}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 