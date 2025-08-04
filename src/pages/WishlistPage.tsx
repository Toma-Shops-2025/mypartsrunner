import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search, 
  Filter,
  Loader2,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '@/types';
import { DatabaseService } from '@/lib/database';
import { useCart } from '@/contexts/CartContext';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

const WishlistPage: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<Product[]>([]);
  const { addToCart, isInCart } = useCart();
  const { user, isAuthenticated } = useAppContext();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    filterItems();
  }, [wishlistItems, searchTerm]);

  const loadWishlist = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // This would be implemented in the database service
      // For now, we'll use a mock implementation
      const mockWishlist = [
        {
          id: '1',
          storeId: 'store1',
          name: 'Premium Brake Pads',
          description: 'High-quality brake pads for optimal stopping power',
          price: 89.99,
          category: 'Brakes',
          imageUrl: '/images/brake-pads.jpg',
          inStock: true,
          stockQuantity: 50,
          sku: 'BP001',
          brand: 'Premium Auto',
          partNumber: 'BP-001',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          storeId: 'store1',
          name: 'LED Headlight Bulbs',
          description: 'Bright LED headlight bulbs for better visibility',
          price: 45.00,
          category: 'Lighting',
          imageUrl: '/images/headlight-bulbs.jpg',
          inStock: true,
          stockQuantity: 75,
          sku: 'LH002',
          brand: 'BrightLight',
          partNumber: 'LH-002',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setWishlistItems(mockWishlist);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      toast({
        title: "Error loading wishlist",
        description: "Failed to load your wishlist items.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = wishlistItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`
      });
    } catch (error) {
      toast({
        title: "Error adding to cart",
        description: "Failed to add item to your cart.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      // This would be implemented in the database service
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist."
      });
    } catch (error) {
      toast({
        title: "Error removing item",
        description: "Failed to remove item from wishlist.",
        variant: "destructive"
      });
    }
  };

  const handleAddAllToCart = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    try {
      for (const product of filteredItems) {
        if (!isInCart(product.id)) {
          await addToCart(product);
        }
      }
      toast({
        title: "Added all to cart",
        description: "All wishlist items have been added to your cart."
      });
    } catch (error) {
      toast({
        title: "Error adding items",
        description: "Failed to add some items to your cart.",
        variant: "destructive"
      });
    }
  };

  const handleClearWishlist = async () => {
    try {
      setWishlistItems([]);
      toast({
        title: "Wishlist cleared",
        description: "All items have been removed from your wishlist."
      });
    } catch (error) {
      toast({
        title: "Error clearing wishlist",
        description: "Failed to clear your wishlist.",
        variant: "destructive"
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign in to view your wishlist</h2>
          <p className="text-muted-foreground mb-6">
            Create an account or sign in to save your favorite products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/register">Create Account</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground">
          Save your favorite products for later
        </p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search wishlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {filteredItems.length > 0 && (
            <Button onClick={handleAddAllToCart} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add All to Cart
            </Button>
          )}
          {wishlistItems.length > 0 && (
            <Button onClick={handleClearWishlist} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredItems.length} of {wishlistItems.length} items
        </p>
      </div>

      {/* Wishlist Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          {wishlistItems.length === 0 ? (
            <>
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding products to your wishlist while browsing.
              </p>
              <Button asChild>
                <a href="/browse">Browse Products</a>
              </Button>
            </>
          ) : (
            <>
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">No items found</h2>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
                  {product.stockQuantity !== undefined && (
                    <span className={`text-sm ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => handleAddToCart(product)}
                    disabled={isInCart(product.id) || (product.stockQuantity !== undefined && product.stockQuantity <= 0)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                  </Button>
                  {product.brand && (
                    <p className="text-xs text-muted-foreground">
                      Brand: {product.brand}
                    </p>
                  )}
                  {product.sku && (
                    <p className="text-xs text-muted-foreground">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {wishlistItems.length > 0 && (
        <div className="mt-12 bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <a href="/browse">Continue Shopping</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/cart">View Cart</a>
            </Button>
            <Button variant="outline" onClick={handleAddAllToCart}>
              <Plus className="h-4 w-4 mr-2" />
              Add All to Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;