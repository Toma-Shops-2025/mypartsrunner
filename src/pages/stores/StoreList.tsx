import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Clock, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Store } from '@/types/store';
import { useMap } from '@/contexts/MapContext';

// This would come from your API
const fetchStores = async (query: string = '', filters: any = {}): Promise<Store[]> => {
  // Replace with actual API call
  const response = await fetch(`/api/stores?q=${query}&filters=${JSON.stringify(filters)}`);
  if (!response.ok) throw new Error('Failed to fetch stores');
  return response.json();
};

export default function StoreList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sortBy: 'distance'
  });
  
  const { data: stores, isLoading, error } = useQuery({
    queryKey: ['stores', searchQuery, filters],
    queryFn: () => fetchStores(searchQuery, filters)
  });

  const { userLocation } = useMap();

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground">Failed to load stores. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Find Local Stores</h1>

      {/* Search and Filters */}
      <div className="grid gap-6 md:grid-cols-[2fr,1fr,1fr] mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="auto">Auto Parts</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
            <SelectItem value="tools">Tools</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="distance">Distance</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="deliveryTime">Delivery Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Store List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : stores?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Stores Found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores?.map((store) => (
            <Link
              key={store.id}
              to={`/stores/${store.id}`}
              className="block bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                {store.logo ? (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">
                      {store.name.charAt(0)}
                    </span>
                  </div>
                )}
                {!store.isOpen && (
                  <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm">
                    Closed
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold">{store.name}</h3>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{store.address}</span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{store.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({store.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{store.estimatedDeliveryTime}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    ${store.minimumOrder} min order
                  </span>
                  <span className="text-muted-foreground">
                    ${store.deliveryFee.toFixed(2)} delivery
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 