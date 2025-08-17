import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Star,
  MapPin,
  Clock,
  Zap,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  RotateCcw
} from 'lucide-react';

interface SearchFilters {
  category: string[];
  priceRange: [number, number];
  brands: string[];
  condition: string[];
  availability: string[];
  location: string;
  radius: number;
  rating: number;
  sortBy: string;
  showAIRecommendations: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'vehicle';
  icon?: string;
  popularity?: number;
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
  imageUrl: string;
  aiMatch?: number;
  tags: string[];
  compatibleVehicles?: string[];
}

interface AdvancedSearchProps {
  onResultsChange?: (results: SearchResult[]) => void;
  initialQuery?: string;
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onResultsChange,
  initialQuery = '',
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    priceRange: [0, 1000],
    brands: [],
    condition: [],
    availability: [],
    location: '',
    radius: 25,
    rating: 0,
    sortBy: 'relevance',
    showAIRecommendations: true
  });
  
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock data for demonstration
  const mockCategories = [
    'Engine Parts', 'Brake System', 'Electrical', 'Suspension', 
    'Transmission', 'Exhaust', 'Body Parts', 'Interior', 'Wheels & Tires'
  ];

  const mockBrands = [
    'ACDelco', 'Bosch', 'Denso', 'Motorcraft', 'NGK', 'Gates', 
    'Mobil 1', 'Castrol', 'Wagner', 'Monroe'
  ];

  const mockResults: SearchResult[] = [
    {
      id: '1',
      name: 'Bosch QuietCast Premium Disc Brake Pad Set',
      description: 'Premium ceramic brake pads with superior stopping power and reduced noise',
      price: 89.99,
      originalPrice: 119.99,
      brand: 'Bosch',
      category: 'Brake System',
      condition: 'new',
      rating: 4.7,
      reviewCount: 324,
      availability: 'in-stock',
      distance: 2.3,
      merchantName: 'AutoZone Downtown',
      imageUrl: '/api/placeholder/300/200',
      aiMatch: 95,
      tags: ['premium', 'ceramic', 'quiet', 'oem-quality'],
      compatibleVehicles: ['2018-2023 Honda Accord', '2019-2023 Honda CR-V']
    },
    {
      id: '2',
      name: 'ACDelco Professional Oil Filter',
      description: 'OEM-quality oil filter for enhanced engine protection',
      price: 12.49,
      brand: 'ACDelco',
      category: 'Engine Parts',
      condition: 'new',
      rating: 4.5,
      reviewCount: 156,
      availability: 'in-stock',
      distance: 1.8,
      merchantName: 'Advance Auto Parts',
      imageUrl: '/api/placeholder/300/200',
      aiMatch: 88,
      tags: ['oem', 'professional', 'enhanced-protection'],
      compatibleVehicles: ['2015-2023 Toyota Camry', '2016-2023 Toyota RAV4']
    },
    {
      id: '3',
      name: 'NGK Iridium IX Spark Plugs (Set of 4)',
      description: 'High-performance iridium spark plugs for improved fuel efficiency',
      price: 31.96,
      originalPrice: 39.96,
      brand: 'NGK',
      category: 'Engine Parts',
      condition: 'new',
      rating: 4.8,
      reviewCount: 892,
      availability: 'low-stock',
      distance: 4.1,
      merchantName: 'O\'Reilly Auto Parts',
      imageUrl: '/api/placeholder/300/200',
      aiMatch: 92,
      tags: ['iridium', 'high-performance', 'fuel-efficiency'],
      compatibleVehicles: ['2017-2023 Ford F-150', '2018-2023 Ford Mustang']
    }
  ];

  // Debounced search function
  const performSearch = useCallback(async (query: string, currentFilters: SearchFilters) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock search logic with AI insights
      let filteredResults = mockResults.filter(result => {
        const matchesQuery = !query || 
          result.name.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase()) ||
          result.brand.toLowerCase().includes(query.toLowerCase()) ||
          result.category.toLowerCase().includes(query.toLowerCase()) ||
          result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
        
        const matchesCategory = currentFilters.category.length === 0 || 
          currentFilters.category.includes(result.category);
        
        const matchesBrand = currentFilters.brands.length === 0 || 
          currentFilters.brands.includes(result.brand);
        
        const matchesPrice = result.price >= currentFilters.priceRange[0] && 
          result.price <= currentFilters.priceRange[1];
        
        const matchesCondition = currentFilters.condition.length === 0 || 
          currentFilters.condition.includes(result.condition);
        
        const matchesAvailability = currentFilters.availability.length === 0 || 
          currentFilters.availability.includes(result.availability);
        
        const matchesRating = result.rating >= currentFilters.rating;
        
        const matchesDistance = result.distance <= currentFilters.radius;
        
        return matchesQuery && matchesCategory && matchesBrand && matchesPrice && 
               matchesCondition && matchesAvailability && matchesRating && matchesDistance;
      });

      // Sort results
      switch (currentFilters.sortBy) {
        case 'price-low':
          filteredResults.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredResults.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredResults.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
          filteredResults.sort((a, b) => a.distance - b.distance);
          break;
        case 'ai-match':
          filteredResults.sort((a, b) => (b.aiMatch || 0) - (a.aiMatch || 0));
          break;
        default: // relevance
          filteredResults.sort((a, b) => (b.aiMatch || 0) - (a.aiMatch || 0));
      }

      setResults(filteredResults);
      
      // Generate AI insights
      if (query && currentFilters.showAIRecommendations) {
        const insights = [
          `Found ${filteredResults.length} parts matching "${query}"`,
          'Tip: Consider ceramic brake pads for quieter performance',
          'Popular choice: Customers often buy oil filters with spark plugs',
          'Price alert: 15% off brake components this week'
        ];
        setAiInsights(insights);
      } else {
        setAiInsights([]);
      }
      
      if (onResultsChange) {
        onResultsChange(filteredResults);
      }
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onResultsChange]);

  // Generate search suggestions
  const generateSuggestions = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const suggestions: SearchSuggestion[] = [
      // Recent searches
      ...searchHistory
        .filter(h => h.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .map(h => ({ 
          id: `history_${h}`, 
          text: h, 
          type: 'product' as const, 
          icon: '🕒',
          popularity: 1
        })),
      
      // Product suggestions
      { id: 'brake_pads', text: 'brake pads', type: 'product', icon: '🛞', popularity: 95 },
      { id: 'oil_filter', text: 'oil filter', type: 'product', icon: '🛢️', popularity: 89 },
      { id: 'spark_plugs', text: 'spark plugs', type: 'product', icon: '⚡', popularity: 87 },
      { id: 'air_filter', text: 'air filter', type: 'product', icon: '💨', popularity: 82 },
      
      // Category suggestions
      { id: 'cat_engine', text: 'Engine Parts', type: 'category', icon: '🔧', popularity: 78 },
      { id: 'cat_brake', text: 'Brake System', type: 'category', icon: '🛞', popularity: 85 },
      
      // Brand suggestions
      { id: 'brand_bosch', text: 'Bosch', type: 'brand', icon: '🏭', popularity: 91 },
      { id: 'brand_acdelco', text: 'ACDelco', type: 'brand', icon: '🏭', popularity: 84 },
      
      // Vehicle suggestions
      { id: 'vehicle_honda', text: '2020 Honda Accord', type: 'vehicle', icon: '🚗', popularity: 76 },
      { id: 'vehicle_toyota', text: '2019 Toyota Camry', type: 'vehicle', icon: '🚗', popularity: 74 }
    ]
    .filter(s => s.text.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8);

    setSuggestions(suggestions);
  }, [searchHistory]);

  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    generateSuggestions(value);
    setShowSuggestions(true);

    // Debounce search
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        performSearch(value, filters);
      }
    }, 300);
  }, [filters, performSearch, generateSuggestions]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    if (searchQuery.trim()) {
      performSearch(searchQuery, newFilters);
    }
  }, [filters, searchQuery, performSearch]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setShowSuggestions(false);
    
    // Add to search history
    const newHistory = [suggestion.text, ...searchHistory.filter(h => h !== suggestion.text)].slice(0, 5);
    setSearchHistory(newHistory);
    
    performSearch(suggestion.text, filters);
  }, [searchHistory, filters, performSearch]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      category: [],
      priceRange: [0, 1000],
      brands: [],
      condition: [],
      availability: [],
      location: '',
      radius: 25,
      rating: 0,
      sortBy: 'relevance',
      showAIRecommendations: true
    });
  }, []);

  // Initial search
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, filters);
    }
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search Header */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for auto parts, brands, or part numbers..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 pr-4 h-12 text-lg"
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-4"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {(filters.category.length > 0 || filters.brands.length > 0) && (
                    <Badge className="ml-2 bg-blue-500">
                      {filters.category.length + filters.brands.length}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-1 shadow-lg">
                  <CardContent className="p-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
                      >
                        <span className="text-lg">{suggestion.icon}</span>
                        <div className="flex-1">
                          <span className="font-medium">{suggestion.text}</span>
                          <div className="text-xs text-gray-500 capitalize">
                            {suggestion.type}
                            {suggestion.popularity && (
                              <span className="ml-2">
                                🔥 {suggestion.popularity}% popular
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              {['brake pads', 'oil filter', 'spark plugs', 'air filter', 'battery'].map((quickFilter) => (
                <Button
                  key={quickFilter}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearchChange(quickFilter)}
                  className="text-xs"
                >
                  {quickFilter}
                </Button>
              ))}
            </div>

            {/* AI Insights */}
            {aiInsights.length > 0 && filters.showAIRecommendations && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">AI Insights</span>
                </div>
                <div className="space-y-1">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="text-sm text-blue-700 flex items-center gap-2">
                      <Target className="h-3 w-3" />
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div>
                <label className="font-medium text-sm mb-3 block">Categories</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={filters.category.includes(category)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...filters.category, category]
                            : filters.category.filter(c => c !== category);
                          handleFilterChange('category', newCategories);
                        }}
                      />
                      <label htmlFor={`cat-${category}`} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="font-medium text-sm mb-3 block">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={1000}
                  step={10}
                  className="mb-4"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="font-medium text-sm mb-3 block">Brands</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {mockBrands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={(checked) => {
                          const newBrands = checked
                            ? [...filters.brands, brand]
                            : filters.brands.filter(b => b !== brand);
                          handleFilterChange('brands', newBrands);
                        }}
                      />
                      <label htmlFor={`brand-${brand}`} className="text-sm">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="font-medium text-sm mb-3 block">Condition</label>
                <div className="space-y-2">
                  {['new', 'used', 'refurbished'].map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={filters.condition.includes(condition)}
                        onCheckedChange={(checked) => {
                          const newConditions = checked
                            ? [...filters.condition, condition]
                            : filters.condition.filter(c => c !== condition);
                          handleFilterChange('condition', newConditions);
                        }}
                      />
                      <label htmlFor={`condition-${condition}`} className="text-sm capitalize">
                        {condition}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="font-medium text-sm mb-3 block">Availability</label>
                <div className="space-y-2">
                  {['in-stock', 'low-stock', 'pre-order'].map((availability) => (
                    <div key={availability} className="flex items-center space-x-2">
                      <Checkbox
                        id={`avail-${availability}`}
                        checked={filters.availability.includes(availability)}
                        onCheckedChange={(checked) => {
                          const newAvailability = checked
                            ? [...filters.availability, availability]
                            : filters.availability.filter(a => a !== availability);
                          handleFilterChange('availability', newAvailability);
                        }}
                      />
                      <label htmlFor={`avail-${availability}`} className="text-sm">
                        {availability.replace('-', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort & Other Options */}
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm mb-3 block">Sort by</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="ai-match">AI Match</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Customer Rating</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ai-recommendations"
                    checked={filters.showAIRecommendations}
                    onCheckedChange={(checked) => handleFilterChange('showAIRecommendations', checked)}
                  />
                  <label htmlFor="ai-recommendations" className="text-sm">
                    Show AI Recommendations
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results Summary */}
      {results.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Found {results.length} results {searchQuery && `for "${searchQuery}"`}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            Search completed in 0.{Math.floor(Math.random() * 9) + 1}s
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch; 