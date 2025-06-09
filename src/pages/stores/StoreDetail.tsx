import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Phone, Mail, Star, Clock, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCart } from '@/contexts/CartContext';
import type { Store, Product } from '@/types/store';

// These would come from your API
const fetchStore = async (id: string): Promise<Store> => {
  const response = await fetch(`/api/stores/${id}`);
  if (!response.ok) throw new Error('Failed to fetch store');
  return response.json();
};

const fetchProducts = async (storeId: string, category?: string): Promise<Product[]> => {
  const response = await fetch(`/api/stores/${storeId}/products${category ? `?category=${category}` : ''}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export default function StoreDetail() {
  const { id } = useParams<{ id: string }>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, removeFromCart, getItemQuantity } = useCart();

  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: () => fetchStore(id!)
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', id, selectedCategory],
    queryFn: () => fetchProducts(id!, selectedCategory === 'all' ? undefined : selectedCategory)
  });

  if (storeLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
          <p className="text-muted-foreground">This store may no longer be available.</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Store Header */}
      <div className="bg-card border-b">
        <div className="container py-8">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted shrink-0">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-muted-foreground">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <p className="text-muted-foreground mb-4">{store.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{store.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{store.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{store.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{store.estimatedDeliveryTime}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="font-medium">{store.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({store.reviewCount} reviews)
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  ${store.minimumOrder} minimum • ${store.deliveryFee.toFixed(2)} delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Categories */}
          <div className="md:w-64 shrink-0">
            <h2 className="font-semibold mb-4">Categories</h2>
            <Tabs
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              orientation="vertical"
              className="w-full"
            >
              <TabsList className="flex flex-col h-auto">
                <TabsTrigger value="all">All Products</TabsTrigger>
                {store.categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-6">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {productsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : filteredProducts?.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
                <p className="text-muted-foreground">Try adjusting your search or selecting a different category.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts?.map((product) => {
                  const quantity = getItemQuantity(product.id);
                  
                  return (
                    <div key={product.id} className="bg-card rounded-lg p-4">
                      <div className="aspect-square rounded-md overflow-hidden bg-muted mb-4">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-2xl font-bold text-muted-foreground">
                              {product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {quantity > 0 ? (
                        <div className="flex items-center justify-between">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeFromCart(product.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => addToCart(product)}
                          disabled={!product.isAvailable}
                        >
                          {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 