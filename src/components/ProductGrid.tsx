import React, { useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Product } from '@/types/product';
import { Filter, Search, MapPin, Grid, List, Video, Sliders } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState('');
  const searchTerm = useDebounce(searchInput, 300);
  const [sortBy, setSortBy] = useState('recent');
  const [category, setCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'all' || product.category_id === category;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="sticky top-16 z-10 bg-white border-b">
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
            >
              <Sliders className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-4">
              <Select
                value={category}
                onValueChange={setCategory}
                options={[
                  { value: 'all', label: 'All Categories' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'furniture', label: 'Furniture' },
                  { value: 'clothing', label: 'Clothing' },
                ]}
                className="flex-1"
              />
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                options={[
                  { value: 'recent', label: 'Most Recent' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                ]}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <div className={`p-4 ${view === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-4'}`}>
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found matching your search criteria
          </div>
        ) : (
          filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              className={view === 'list' ? 'flex gap-4' : ''}
            />
          ))
        )}
      </div>
    </div>
  );
}