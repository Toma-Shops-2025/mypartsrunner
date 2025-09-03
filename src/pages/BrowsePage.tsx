import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Loader2, Star, MapPin, ArrowLeft } from "lucide-react";
import { Product } from "@/types";
import { DatabaseService } from "@/lib/database";
import { useCart } from "@/contexts/CartContext";
import { useAppContext } from "@/contexts/AppContext";
import AdvancedSearch from "@/components/AdvancedSearch";
import BackButton from "@/components/ui/back-button";

interface SearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  category: string;
  condition: 'new' | 'used' | 'refurbished';
  rating: number;
  reviewCount: number;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
  distance: number;
  merchantName: string;
  imageUrl: string;
  aiMatch?: number;
  tags: string[];
  compatibleVehicles?: string[];
}

const BrowsePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(true);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await DatabaseService.getProducts();
      setProducts(productsData);
      
      // Convert products to search results format
      const results: SearchResult[] = productsData.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand || 'Generic',
        category: product.category,
        condition: 'new' as const,
        rating: product.rating || 4.5,
        reviewCount: Math.floor(Math.random() * 200) + 10,
        availability: product.inStock ? 'in-stock' as const : 'out-of-stock' as const,
        distance: Math.round(Math.random() * 15 + 1),
        merchantName: `${product.brand || 'Auto'} Parts Store`,
        imageUrl: product.imageUrl || '/api/placeholder/300/200',
        aiMatch: Math.floor(Math.random() * 20) + 80,
        tags: [product.category.toLowerCase()],
        compatibleVehicles: [`2018-2023 ${product.brand || 'Generic'} Models`]
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const handleAddToCart = (result: SearchResult) => {
    // Convert search result back to product for cart
    const product: Product = {
      id: result.id,
      name: result.name,
      price: result.price,
      originalPrice: result.originalPrice,
      category: result.category,
      brand: result.brand,
      imageUrl: result.imageUrl,
      inStock: result.availability !== 'out-of-stock',
      rating: result.rating,
      description: result.description
    };
    
    addToCart(product);
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'bg-green-500';
      case 'low-stock': return 'bg-yellow-500';
      case 'out-of-stock': return 'bg-red-500';
      case 'pre-order': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'used': return 'bg-yellow-100 text-yellow-800';
      case 'refurbished': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-10 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with Back Button */}
        <div className="flex items-center mb-8">
          <BackButton 
            variant="ghost" 
            className="mr-4 text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/20 transition-colors"
          />
          <h1 className="text-4xl font-bold">
            <span className="gradient-text">Browse</span>{' '}
            <span className="neon-text">Products</span>
          </h1>
        </div>

        {/* Advanced Search */}
        {showAdvancedSearch && (
          <AdvancedSearch
            onResultsChange={handleSearchResults}
            initialQuery=""
            className="mb-8"
          />
        )}

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {searchResults.length > 0 ? `${searchResults.length} Products Found` : 'All Products'}
            </h2>
            <p className="text-gray-600 text-sm">
              {searchResults.length > 0 && 'Sorted by relevance and AI match score'}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? 'Hide' : 'Show'} Advanced Search
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((result) => (
            <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={result.imageUrl}
                  alt={result.name}
                  className="w-full h-48 object-cover"
                />
                {result.aiMatch && result.aiMatch > 90 && (
                  <Badge className="absolute top-2 right-2 bg-blue-600">
                    AI Match: {result.aiMatch}%
                  </Badge>
                )}
                {result.originalPrice && result.originalPrice > result.price && (
                  <Badge className="absolute top-2 left-2 bg-red-600">
                    Sale
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{result.name}</h3>
                    <p className="text-sm text-gray-600">{result.brand}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getAvailabilityColor(result.availability)}>
                      {result.availability.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getConditionColor(result.condition)}>
                      {result.condition}
                    </Badge>
                    <Badge variant="outline">
                      {result.category}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2">{result.description}</p>

                  {/* Tags */}
                  {result.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{result.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">({result.reviewCount} reviews)</span>
                  </div>

                  {/* Merchant and Distance */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{result.merchantName} • {result.distance} miles</span>
                  </div>

                  {/* Compatible Vehicles */}
                  {result.compatibleVehicles && result.compatibleVehicles.length > 0 && (
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <span className="font-medium text-blue-800">Compatible: </span>
                      <span className="text-blue-600">{result.compatibleVehicles[0]}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          ${result.price.toFixed(2)}
                        </span>
                        {result.originalPrice && result.originalPrice > result.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${result.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      {result.originalPrice && result.originalPrice > result.price && (
                        <div className="text-sm text-green-600">
                          Save ${(result.originalPrice - result.price).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleAddToCart(result)}
                      disabled={result.availability === 'out-of-stock' || isInCart(result.id)}
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isInCart(result.id) ? 'In Cart' : 
                       result.availability === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {searchResults.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search filters or search terms.</p>
          </div>
        )}

        {/* Load More */}
        {searchResults.length > 0 && (
          <div className="text-center pt-8">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;