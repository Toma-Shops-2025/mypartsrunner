import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Loader2, Star, MapPin, ArrowLeft, Search, Store, Globe, Truck, ExternalLink, Package } from "lucide-react";
import { Product } from "@/types";
import { DatabaseService } from "@/lib/database";
import { useCart } from "@/contexts/CartContext";
import { useAppContext } from "@/contexts/AppContext";
import AdvancedSearch from "@/components/AdvancedSearch";
import BackButton from "@/components/ui/back-button";

interface Merchant {
  id: string;
  name: string;
  description: string;
  website: string;
  storeType: 'auto' | 'hardware' | 'general';
  address: string;
  city: string;
  state: string;
  distance: number;
  rating: number;
  reviewCount: number;
  isIntegrated: boolean; // Whether we can search their inventory directly
  hasDeliveryButton: boolean; // Whether they have our delivery button
  logo?: string;
  categories: string[];
}

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
  merchantId: string;
  imageUrl: string;
  aiMatch?: number;
  tags: string[];
  compatibleVehicles?: string[];
}

const BrowsePage = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showManualDelivery, setShowManualDelivery] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isAuthenticated } = useAppContext();

  useEffect(() => {
    loadMerchants();
  }, []);

  const loadMerchants = async () => {
    try {
      setLoading(true);
      // In production, this would fetch from your database
      const mockMerchants: Merchant[] = [
        // AUTO PARTS STORES
        {
          id: '1',
          name: "AutoZone",
          description: "America's leading auto parts retailer with over 6,000 stores",
          website: "https://www.autozone.com",
          storeType: 'auto',
          address: '123 Auto Parts Way',
          city: 'Louisville',
          state: 'KY',
          distance: 2.1,
          rating: 4.6,
          reviewCount: 1247,
          isIntegrated: true, // We can search their inventory
          hasDeliveryButton: true, // They have our delivery button
          logo: '/api/placeholder/64/64',
          categories: ['Brakes', 'Engine', 'Electrical', 'Suspension', 'Exhaust']
        },
        {
          id: '2',
          name: "O'Reilly Auto Parts",
          description: "Professional auto parts and expert advice",
          website: "https://www.oreillyauto.com",
          storeType: 'auto',
          address: '456 Car Care Blvd',
          city: 'Louisville',
          state: 'KY',
          distance: 3.2,
          rating: 4.7,
          reviewCount: 892,
          isIntegrated: true,
          hasDeliveryButton: true,
          logo: '/api/placeholder/64/64',
          categories: ['Brakes', 'Engine', 'Electrical', 'Suspension', 'Exhaust']
        },
        {
          id: '3',
          name: "Advance Auto Parts",
          description: "Quality parts, expert advice, and fast delivery",
          website: "https://www.advanceautoparts.com",
          storeType: 'auto',
          address: '789 Parts Street',
          city: 'Louisville',
          state: 'KY',
          distance: 1.8,
          rating: 4.5,
          reviewCount: 567,
          isIntegrated: false, // We can't search their inventory yet
          hasDeliveryButton: false, // They don't have our delivery button yet
          logo: '/api/placeholder/64/64',
          categories: ['Brakes', 'Engine', 'Electrical', 'Suspension', 'Exhaust']
        },
        
        // HARDWARE STORES
        {
          id: '4',
          name: "Home Depot",
          description: "The world's largest home improvement retailer with tools, lumber, and supplies",
          website: "https://www.homedepot.com",
          storeType: 'hardware',
          address: '321 Hardware Ave',
          city: 'Louisville',
          state: 'KY',
          distance: 4.1,
          rating: 4.4,
          reviewCount: 2341,
          isIntegrated: true, // We can search their inventory
          hasDeliveryButton: true, // They have our delivery button
          logo: '/api/placeholder/64/64',
          categories: ['Tools', 'Lumber', 'Plumbing', 'Electrical', 'Garden', 'Paint', 'Hardware']
        },
        {
          id: '5',
          name: "Lowe's",
          description: "Home improvement and hardware supplies for DIY enthusiasts and professionals",
          website: "https://www.lowes.com",
          storeType: 'hardware',
          address: '654 Builders Blvd',
          city: 'Louisville',
          state: 'KY',
          distance: 3.8,
          rating: 4.3,
          reviewCount: 1892,
          isIntegrated: true,
          hasDeliveryButton: true,
          logo: '/api/placeholder/64/64',
          categories: ['Tools', 'Lumber', 'Plumbing', 'Electrical', 'Garden', 'Paint', 'Hardware']
        },
        {
          id: '6',
          name: "Menards",
          description: "Midwest's largest home improvement chain with competitive prices",
          website: "https://www.menards.com",
          storeType: 'hardware',
          address: '987 Contractor Way',
          city: 'Louisville',
          state: 'KY',
          distance: 5.2,
          rating: 4.2,
          reviewCount: 756,
          isIntegrated: false, // Not integrated yet
          hasDeliveryButton: false, // No delivery button yet
          logo: '/api/placeholder/64/64',
          categories: ['Tools', 'Lumber', 'Plumbing', 'Electrical', 'Garden', 'Paint', 'Hardware']
        },
        {
          id: '7',
          name: "Ace Hardware",
          description: "Local hardware store with personal service and expert advice",
          website: "https://www.acehardware.com",
          storeType: 'hardware',
          address: '147 Local Hardware St',
          city: 'Louisville',
          state: 'KY',
          distance: 1.2,
          rating: 4.8,
          reviewCount: 423,
          isIntegrated: false, // Local store, harder to integrate
          hasDeliveryButton: false, // No delivery button yet
          logo: '/api/placeholder/64/64',
          categories: ['Tools', 'Hardware', 'Garden', 'Paint', 'Plumbing', 'Electrical']
        },
        {
          id: '8',
          name: "Harbor Freight Tools",
          description: "Quality tools at discount prices for professionals and hobbyists",
          website: "https://www.harborfreight.com",
          storeType: 'hardware',
          address: '258 Tool Street',
          city: 'Louisville',
          state: 'KY',
          distance: 6.7,
          rating: 4.1,
          reviewCount: 892,
          isIntegrated: false, // Not integrated yet
          hasDeliveryButton: false, // No delivery button yet
          logo: '/api/placeholder/64/64',
          categories: ['Tools', 'Automotive Tools', 'Welding', 'Air Tools', 'Hand Tools', 'Power Tools']
        }
      ];
      
      setMerchants(mockMerchants);
    } catch (error) {
      console.error('Error loading merchants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMerchantSelect = async (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setSearchResults([]);
    
    if (merchant.isIntegrated) {
      // Search through integrated merchant's inventory
      await searchMerchantInventory(merchant);
    }
  };

  const searchMerchantInventory = async (merchant: Merchant) => {
    try {
      // In production, this would call the merchant's API or your database
      // For now, we'll simulate searching their inventory based on store type
      
      if (merchant.storeType === 'auto') {
        // Auto parts inventory
        const mockResults: SearchResult[] = [
          {
            id: '1',
            name: 'Brake Pads - Front Set',
            description: 'High-quality ceramic brake pads for front wheels',
            price: 89.99,
            originalPrice: 119.99,
            brand: 'Duralast',
            category: 'Brakes',
            condition: 'new',
            rating: 4.8,
            reviewCount: 156,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 95,
            tags: ['brakes', 'front', 'ceramic'],
            compatibleVehicles: ['2018-2023 Toyota Camry', '2019-2023 Honda Accord']
          },
          {
            id: '2',
            name: 'Oil Filter',
            description: 'Premium oil filter for extended engine life',
            price: 12.49,
            brand: 'Fram',
            category: 'Engine',
            condition: 'new',
            rating: 4.6,
            reviewCount: 89,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 92,
            tags: ['oil', 'filter', 'engine'],
            compatibleVehicles: ['Most vehicles 2010+']
          },
          {
            id: '3',
            name: 'Spark Plugs - Set of 4',
            description: 'Iridium spark plugs for better performance and fuel economy',
            price: 24.99,
            brand: 'NGK',
            category: 'Engine',
            condition: 'new',
            rating: 4.7,
            reviewCount: 234,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 88,
            tags: ['spark plugs', 'ignition', 'performance'],
            compatibleVehicles: ['Most 4-cylinder engines']
          }
        ];
        setSearchResults(mockResults);
      } else if (merchant.storeType === 'hardware') {
        // Hardware store inventory
        const mockResults: SearchResult[] = [
          {
            id: '1',
            name: 'DeWalt 20V MAX Cordless Drill',
            description: 'Professional grade cordless drill with 2 batteries and charger',
            price: 199.99,
            originalPrice: 249.99,
            brand: 'DeWalt',
            category: 'Power Tools',
            condition: 'new',
            rating: 4.9,
            reviewCount: 567,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 96,
            tags: ['drill', 'cordless', 'power tool', 'professional'],
            compatibleVehicles: ['N/A - Hardware item']
          },
          {
            id: '2',
            name: '2x4 Premium Pine Lumber - 8ft',
            description: 'Premium grade pine lumber, perfect for construction and DIY projects',
            price: 8.49,
            brand: 'Premium Pine',
            category: 'Lumber',
            condition: 'new',
            rating: 4.5,
            reviewCount: 123,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 94,
            tags: ['lumber', 'pine', 'construction', '2x4'],
            compatibleVehicles: ['N/A - Hardware item']
          },
          {
            id: '3',
            name: 'Milwaukee M18 Fuel Circular Saw',
            description: '18V cordless circular saw with 6-1/2 inch blade',
            price: 299.99,
            brand: 'Milwaukee',
            category: 'Power Tools',
            condition: 'new',
            rating: 4.8,
            reviewCount: 234,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 91,
            tags: ['circular saw', 'cordless', 'power tool', 'professional'],
            compatibleVehicles: ['N/A - Hardware item']
          },
          {
            id: '4',
            name: 'SharkBite Push-to-Connect Fitting',
            description: '1/2 inch push-to-connect copper fitting for easy plumbing',
            price: 4.99,
            brand: 'SharkBite',
            category: 'Plumbing',
            condition: 'new',
            rating: 4.7,
            reviewCount: 89,
            availability: 'in-stock',
            distance: merchant.distance,
            merchantName: merchant.name,
            merchantId: merchant.id,
            imageUrl: '/api/placeholder/300/200',
            aiMatch: 93,
            tags: ['plumbing', 'fitting', 'copper', 'push-to-connect'],
            compatibleVehicles: ['N/A - Hardware item']
          }
        ];
        setSearchResults(mockResults);
      }
    } catch (error) {
      console.error('Error searching merchant inventory:', error);
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

  const handleVisitMerchantWebsite = (merchant: Merchant) => {
    window.open(merchant.website, '_blank');
  };

  const handleRequestIntegration = (merchant: Merchant) => {
    // In production, this would open a form or contact system
    alert(`Integration request sent to ${merchant.name}. We'll contact them about adding our delivery button to their website.`);
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="glass-card p-8 border border-cyan-400/30 glow-card">
          <div className="flex items-center gap-4">
            <div className="neon-spinner w-8 h-8"></div>
            <span className="text-white text-lg">Loading merchants...</span>
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
            <span className="neon-text">Stores</span>
          </h1>
        </div>

        {!selectedMerchant ? (
          /* MERCHANT SELECTION VIEW */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-300 mb-4">
                Choose Your Store
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Select from auto parts stores, hardware stores, and more. 
                Integrated stores allow you to search and order through our platform, 
                while others provide direct links to their websites.
              </p>
            </div>

            {/* Manual Order Delivery - NEW FEATURE! */}
            <Card className="border-2 border-cyan-400/50 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">
                    🚀 Manual Order Delivery
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Already ordered from a store? We'll pick it up and deliver it to you!
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <h4 className="font-semibold text-cyan-400">Order Normally</h4>
                    <p className="text-sm text-gray-400">Shop and pay on any store's website</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <h4 className="font-semibold text-cyan-400">Request Delivery</h4>
                    <p className="text-sm text-gray-400">Tell us where to pick up and deliver</p>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <h4 className="font-semibold text-cyan-400">Get Delivered</h4>
                    <p className="text-sm text-gray-400">We pick up and deliver ASAP</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setShowManualDelivery(true)}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-3"
                  >
                    <Truck className="h-5 w-5 mr-2" />
                    Request Manual Delivery
                  </Button>
                  <p className="text-xs text-gray-400 mt-2">
                    Perfect for stores not yet integrated with our platform
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Store Type Filter */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs"
                >
                  All Stores
                </Button>
                <Button
                  variant={selectedCategory === 'auto' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory('auto')}
                  className="text-xs"
                >
                  🚗 Auto Parts
                </Button>
                <Button
                  variant={selectedCategory === 'hardware' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory('hardware')}
                  className="text-xs"
                >
                  🔧 Hardware
                </Button>
              </div>
            </div>

            {/* Merchant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {merchants
                .filter(merchant => selectedCategory === 'all' || merchant.storeType === selectedCategory)
                .map((merchant) => (
                <Card key={merchant.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                        <Store className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{merchant.name}</CardTitle>
                        <p className="text-sm text-gray-600">{merchant.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Store Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{merchant.address}, {merchant.city}, {merchant.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{merchant.rating} ({merchant.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>{merchant.distance} miles away</span>
                      </div>
                    </div>

                    {/* Integration Status */}
                    <div className="space-y-2">
                      {merchant.isIntegrated ? (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Integrated - Search Inventory
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600">
                          ⚠️ Not Integrated
                        </Badge>
                      )}
                      
                      {merchant.hasDeliveryButton ? (
                        <Badge className="bg-blue-100 text-blue-800">
                          ✓ Has Delivery Button
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          No Delivery Button
                        </Badge>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {merchant.isIntegrated ? (
                        <Button 
                          onClick={() => handleMerchantSelect(merchant)}
                          className="w-full"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Browse Inventory
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleVisitMerchantWebsite(merchant)}
                          variant="outline"
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      )}
                      
                      {!merchant.hasDeliveryButton && (
                        <Button 
                          onClick={() => handleRequestIntegration(merchant)}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          Request Delivery Button
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* MERCHANT INVENTORY VIEW */
          <div className="space-y-6">
            {/* Merchant Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedMerchant(null)}
                      className="p-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <Store className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMerchant.name}</h2>
                      <p className="text-gray-600">{selectedMerchant.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleVisitMerchantWebsite(selectedMerchant)}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    >
                      {showAdvancedSearch ? 'Hide Advanced Search' : 'Advanced Search'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder={`Search ${selectedMerchant.name} inventory...`}
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => searchMerchantInventory(selectedMerchant)}
                    className="px-8"
                  >
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Search */}
            {showAdvancedSearch && (
              <Card>
                <CardContent className="p-6">
                  <AdvancedSearch onSearchResults={handleSearchResults} />
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-300">
                  Search Results ({searchResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                        <h4 className="font-semibold mb-2">{result.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-bold">${result.price.toFixed(2)}</span>
                          {result.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              ${result.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{result.category}</Badge>
                          <Badge variant="outline">{result.brand}</Badge>
                        </div>
                        <Button 
                          onClick={() => handleAddToCart(result)}
                          className="w-full"
                          disabled={isInCart(result.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {isInCart(result.id) ? 'In Cart' : 'Add to Cart'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or browse categories
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Manual Delivery Modal */}
        {showManualDelivery && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-cyan-600">
                    🚀 Manual Order Delivery Request
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowManualDelivery(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center p-4 bg-cyan-50 rounded-lg">
                  <Truck className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                  <p className="text-sm text-cyan-800">
                    <strong>How it works:</strong> You order and pay on the store's website, 
                    then we pick it up and deliver it to you for a delivery fee.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Name *</label>
                    <Input placeholder="e.g., AutoZone, Home Depot" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Store Location *</label>
                    <Input placeholder="e.g., 123 Main St, Louisville, KY" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Order Details *</label>
                  <textarea 
                    className="w-full p-3 border rounded-lg h-24"
                    placeholder="Describe what you ordered (e.g., 'Brake pads, oil filter, 2 spark plugs')"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Total *</label>
                    <Input placeholder="$0.00" type="number" step="0.01" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pickup Time *</label>
                    <select className="w-full p-3 border rounded-lg">
                      <option>Ready now</option>
                      <option>Ready in 1 hour</option>
                      <option>Ready in 2 hours</option>
                      <option>Ready tomorrow</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Address *</label>
                  <Input placeholder="Your full delivery address" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Phone *</label>
                    <Input placeholder="Your phone number" type="tel" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Special Instructions</label>
                    <Input placeholder="e.g., 'Call when arriving', 'Leave at back door'" />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Delivery Fee Estimate:</h4>
                  <div className="flex justify-between items-center">
                    <span>Base delivery fee:</span>
                    <span className="font-semibold">$9.99</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Distance fee:</span>
                    <span className="font-semibold">$2.50</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-semibold">Total delivery fee:</span>
                    <span className="font-bold text-lg text-cyan-600">$12.49</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    * Final fee may vary based on actual distance and order size
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowManualDelivery(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      // In production, this would submit the delivery request
                      alert('Delivery request submitted! We\'ll contact you within 15 minutes to confirm details and arrange pickup.');
                      setShowManualDelivery(false);
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Submit Delivery Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;