import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Save,
  ArrowLeft,
  Upload,
  X,
  Plus,
  Package,
  DollarSign,
  BarChart3,
  Settings,
  Camera,
  Tag,
  AlertCircle,
  CheckCircle,
  Zap,
  TrendingUp,
  Star,
  Box,
  Layers,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';

interface Product {
  id?: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  imageUrl: string;
  additionalImages?: string[];
  inStock: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  sku: string;
  brand: string;
  partNumber: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  salePrice?: number;
  saleEndDate?: string;
  supplier?: string;
  costPrice?: number;
  margin?: number;
  warranty?: string;
  compatibleVehicles?: string[];
  specifications?: { [key: string]: string };
  createdAt?: string;
  updatedAt?: string;
}

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  topCategories: { category: string; count: number }[];
}

const categories = [
  { id: 'engine', name: 'Engine', subcategories: ['Oil & Filters', 'Belts & Hoses', 'Gaskets', 'Engine Parts'] },
  { id: 'brakes', name: 'Brakes', subcategories: ['Brake Pads', 'Brake Rotors', 'Brake Lines', 'Calipers'] },
  { id: 'suspension', name: 'Suspension', subcategories: ['Shocks', 'Struts', 'Springs', 'Bushings'] },
  { id: 'electrical', name: 'Electrical', subcategories: ['Batteries', 'Alternators', 'Starters', 'Wiring'] },
  { id: 'transmission', name: 'Transmission', subcategories: ['Transmission Fluid', 'Filters', 'Parts'] },
  { id: 'cooling', name: 'Cooling', subcategories: ['Radiators', 'Thermostats', 'Water Pumps', 'Hoses'] },
  { id: 'fuel', name: 'Fuel System', subcategories: ['Fuel Pumps', 'Injectors', 'Filters'] },
  { id: 'exhaust', name: 'Exhaust', subcategories: ['Mufflers', 'Catalytic Converters', 'Pipes'] },
  { id: 'body', name: 'Body & Exterior', subcategories: ['Bumpers', 'Lights', 'Mirrors', 'Trim'] },
  { id: 'interior', name: 'Interior', subcategories: ['Seats', 'Dashboard', 'Electronics'] },
  { id: 'tools', name: 'Tools & Equipment', subcategories: ['Hand Tools', 'Power Tools', 'Diagnostic'] },
  { id: 'maintenance', name: 'Maintenance', subcategories: ['Fluids', 'Cleaners', 'Accessories'] }
];

export default function AddProductPage() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<'form' | 'list' | 'bulk'>('form');
  
  const [product, setProduct] = useState<Product>({
    storeId: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    subcategory: '',
    imageUrl: '',
    additionalImages: [],
    inStock: true,
    stockQuantity: 0,
    lowStockThreshold: 5,
    sku: '',
    brand: '',
    partNumber: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    tags: [],
    isActive: true,
    isFeatured: false,
    supplier: '',
    costPrice: 0,
    margin: 0,
    warranty: '',
    compatibleVehicles: [],
    specifications: {}
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalValue: 0,
    topCategories: []
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [newTag, setNewTag] = useState('');
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [bulkUpdateData, setBulkUpdateData] = useState({
    priceIncrease: 0,
    stockUpdate: 0,
    category: '',
    isActive: true
  });

  useEffect(() => {
    loadUserStore();
    if (viewMode === 'list') {
      loadProducts();
      calculateStats();
    }
  }, [user, viewMode]);

  const loadUserStore = async () => {
    try {
      if (!user?.id) return;
      
      const { data: stores } = await supabase
        .from('stores')
        .select('id')
        .eq('merchantid', user.id)
        .limit(1);

      if (stores && stores.length > 0) {
        setProduct(prev => ({ ...prev, storeId: stores[0].id }));
      }
    } catch (error) {
      console.error('Error loading store:', error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Mock data for now - would fetch from database
      const mockProducts: Product[] = [
        {
          id: '1',
          storeId: product.storeId,
          name: 'Premium Motor Oil 5W-30',
          description: 'High-quality synthetic blend motor oil for optimal engine protection',
          price: 24.99,
          category: 'engine',
          subcategory: 'Oil & Filters',
          imageUrl: '/placeholder.svg',
          inStock: true,
          stockQuantity: 150,
          lowStockThreshold: 10,
          sku: 'MOT-5W30-001',
          brand: 'Mobil 1',
          partNumber: 'M1-5W30-5QT',
          tags: ['synthetic', 'premium', 'protection'],
          isActive: true,
          isFeatured: true,
          costPrice: 18.50,
          margin: 35,
          warranty: '1 Year',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          storeId: product.storeId,
          name: 'Brake Pads - Front Set',
          description: 'Ceramic brake pads for superior stopping power and reduced dust',
          price: 89.99,
          category: 'brakes',
          subcategory: 'Brake Pads',
          imageUrl: '/placeholder.svg',
          inStock: true,
          stockQuantity: 25,
          lowStockThreshold: 5,
          sku: 'BRK-PAD-FRONT-001',
          brand: 'Wagner',
          partNumber: 'WG-ZX1234',
          tags: ['ceramic', 'front', 'performance'],
          isActive: true,
          isFeatured: false,
          costPrice: 65.00,
          margin: 38,
          warranty: '2 Years',
          createdAt: '2024-01-10'
        },
        {
          id: '3',
          storeId: product.storeId,
          name: 'Air Filter',
          description: 'High-flow air filter for improved engine performance',
          price: 15.99,
          category: 'engine',
          subcategory: 'Oil & Filters',
          imageUrl: '/placeholder.svg',
          inStock: false,
          stockQuantity: 0,
          lowStockThreshold: 15,
          sku: 'AIR-FILT-001',
          brand: 'K&N',
          partNumber: 'KN-33-2304',
          tags: ['performance', 'washable', 'reusable'],
          isActive: true,
          isFeatured: false,
          costPrice: 12.00,
          margin: 33,
          warranty: '1 Million Mile',
          createdAt: '2024-01-05'
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const stats: ProductStats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.isActive).length,
      lowStockProducts: products.filter(p => p.stockQuantity <= p.lowStockThreshold && p.inStock).length,
      outOfStockProducts: products.filter(p => !p.inStock || p.stockQuantity === 0).length,
      totalValue: products.reduce((total, p) => total + (p.price * p.stockQuantity), 0),
      topCategories: []
    };

    // Calculate top categories
    const categoryCount: { [key: string]: number } = {};
    products.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    stats.topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setStats(stats);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-calculate margin if cost price and price are set
    if ((field === 'price' || field === 'costPrice') && product.costPrice && value) {
      const costPrice = field === 'costPrice' ? value : product.costPrice;
      const price = field === 'price' ? value : product.price;
      const margin = ((price - costPrice) / price) * 100;
      setProduct(prev => ({ ...prev, margin: Math.round(margin) }));
    }
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !product.tags.includes(newTag.trim())) {
      setProduct(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setProduct(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSpecAdd = () => {
    if (newSpec.key.trim() && newSpec.value.trim()) {
      setProduct(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpec.key.trim()]: newSpec.value.trim()
        }
      }));
      setNewSpec({ key: '', value: '' });
    }
  };

  const handleSpecRemove = (key: string) => {
    setProduct(prev => {
      const specs = { ...prev.specifications };
      delete specs[key];
      return { ...prev, specifications: specs };
    });
  };

  const handleImageUpload = async (files: FileList, isMain = true) => {
    setUploading(true);
    try {
      // Mock upload - would upload to Supabase storage
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      
      if (isMain) {
        setProduct(prev => ({ ...prev, imageUrl: urls[0] }));
      } else {
        setProduct(prev => ({
          ...prev,
          additionalImages: [...(prev.additionalImages || []), ...urls]
        }));
      }

      toast({
        title: "Images uploaded",
        description: `${files.length} image(s) uploaded successfully`,
        variant: "default"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Validation
      if (!product.name || !product.price || !product.category) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Mock save - would save to database
      console.log('Saving product:', product);

      toast({
        title: isEditing ? "Product updated" : "Product created",
        description: `${product.name} has been ${isEditing ? 'updated' : 'created'} successfully`,
        variant: "default"
      });

      // Reset form or navigate back
      if (!isEditing) {
        setProduct({
          storeId: product.storeId,
          name: '',
          description: '',
          price: 0,
          category: '',
          subcategory: '',
          imageUrl: '',
          additionalImages: [],
          inStock: true,
          stockQuantity: 0,
          lowStockThreshold: 5,
          sku: '',
          brand: '',
          partNumber: '',
          weight: 0,
          dimensions: { length: 0, width: 0, height: 0 },
          tags: [],
          isActive: true,
          isFeatured: false,
          supplier: '',
          costPrice: 0,
          margin: 0,
          warranty: '',
          compatibleVehicles: [],
          specifications: {}
        });
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdate = async () => {
    try {
      setLoading(true);
      
      // Mock bulk update
      console.log('Bulk updating products:', bulkUpdateData);
      
      toast({
        title: "Bulk update completed",
        description: `Updated ${products.length} products`,
        variant: "default"
      });
    } catch (error) {
      console.error('Bulk update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'active' && product.isActive) ||
                         (filterStatus === 'inactive' && !product.isActive) ||
                         (filterStatus === 'lowstock' && product.stockQuantity <= product.lowStockThreshold) ||
                         (filterStatus === 'outofstock' && (!product.inStock || product.stockQuantity === 0));
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (user?.role !== 'merchant') {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Access Denied</h2>
              <p className="text-gray-600">You need to be logged in as a merchant to access product management.</p>
              <Button className="mt-4" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-gray-600">Manage your store inventory and products</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'form' ? 'default' : 'outline'}
            onClick={() => setViewMode('form')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            <Package className="mr-2 h-4 w-4" />
            View Products
          </Button>
          <Button 
            variant={viewMode === 'bulk' ? 'default' : 'outline'}
            onClick={() => setViewMode('bulk')}
          >
            <Edit className="mr-2 h-4 w-4" />
            Bulk Edit
          </Button>
        </div>
      </div>

      {viewMode === 'list' && (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.activeProducts}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.lowStockProducts}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                  </div>
                  <X className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-green-600">${stats.totalValue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="lowstock">Low Stock</SelectItem>
                    <SelectItem value="outofstock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name}
                          className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{prod.name}</h3>
                            {prod.isFeatured && (
                              <Badge variant="secondary">
                                <Star className="mr-1 h-3 w-3" />
                                Featured
                              </Badge>
                            )}
                            <Badge variant={prod.isActive ? 'default' : 'secondary'}>
                              {prod.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            {prod.stockQuantity <= prod.lowStockThreshold && (
                              <Badge variant="destructive">
                                {prod.stockQuantity === 0 ? 'Out of Stock' : 'Low Stock'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{prod.brand} • {prod.sku}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-bold text-green-600">${prod.price}</span>
                            <span>Stock: {prod.stockQuantity}</span>
                            <span className="capitalize">{categories.find(c => c.id === prod.category)?.name}</span>
                            {prod.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {viewMode === 'bulk' && (
        <Card>
          <CardHeader>
            <CardTitle>Bulk Operations</CardTitle>
            <CardDescription>Apply changes to multiple products at once</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Price Adjustment (%)</Label>
                <Input
                  type="number"
                  value={bulkUpdateData.priceIncrease}
                  onChange={(e) => setBulkUpdateData(prev => ({
                    ...prev,
                    priceIncrease: parseFloat(e.target.value)
                  }))}
                  placeholder="Enter percentage"
                />
              </div>
              <div>
                <Label>Stock Adjustment</Label>
                <Input
                  type="number"
                  value={bulkUpdateData.stockUpdate}
                  onChange={(e) => setBulkUpdateData(prev => ({
                    ...prev,
                    stockUpdate: parseInt(e.target.value)
                  }))}
                  placeholder="Enter quantity change"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleBulkUpdate} disabled={loading}>
                {loading ? 'Processing...' : 'Apply Bulk Changes'}
              </Button>
              <Button variant="outline">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Import from CSV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'form' && (
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      value={product.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU *</Label>
                    <Input
                      id="sku"
                      value={product.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Product SKU"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={product.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed product description"
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={product.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      placeholder="Brand name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partNumber">Part Number</Label>
                    <Input
                      id="partNumber"
                      value={product.partNumber}
                      onChange={(e) => handleInputChange('partNumber', e.target.value)}
                      placeholder="Manufacturer part number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="warranty">Warranty</Label>
                    <Input
                      id="warranty"
                      value={product.warranty}
                      onChange={(e) => handleInputChange('warranty', e.target.value)}
                      placeholder="e.g., 1 Year, Lifetime"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={product.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={product.subcategory}
                      onValueChange={(value) => handleInputChange('subcategory', value)}
                      disabled={!product.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories
                          .find(cat => cat.id === product.category)
                          ?.subcategories.map(sub => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer">
                        {tag}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => handleTagRemove(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                    />
                    <Button type="button" onClick={handleTagAdd}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing">
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Costs</CardTitle>
                <CardDescription>Set pricing and calculate margins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      value={product.costPrice}
                      onChange={(e) => handleInputChange('costPrice', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Selling Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="margin">Margin (%)</Label>
                    <Input
                      id="margin"
                      type="number"
                      value={product.margin}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="salePrice">Sale Price (Optional)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      step="0.01"
                      value={product.salePrice}
                      onChange={(e) => handleInputChange('salePrice', parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="saleEndDate">Sale End Date</Label>
                    <Input
                      id="saleEndDate"
                      type="date"
                      value={product.saleEndDate}
                      onChange={(e) => handleInputChange('saleEndDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    value={product.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                    placeholder="Supplier name"
                  />
                </div>

                {product.costPrice && product.price && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium mb-2">Pricing Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Cost Price:</span>
                        <span className="font-medium ml-2">${product.costPrice.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Selling Price:</span>
                        <span className="font-medium ml-2">${product.price.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Profit:</span>
                        <span className="font-medium ml-2 text-green-600">
                          ${(product.price - product.costPrice).toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Margin:</span>
                        <span className="font-medium ml-2 text-blue-600">{product.margin}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Stock levels and tracking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="inStock"
                    checked={product.inStock}
                    onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                  />
                  <Label htmlFor="inStock">In Stock</Label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      type="number"
                      value={product.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', parseInt(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={product.lowStockThreshold}
                      onChange={(e) => handleInputChange('lowStockThreshold', parseInt(e.target.value))}
                      placeholder="5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={product.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <Label>Dimensions (inches)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      value={product.dimensions?.length}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...product.dimensions,
                        length: parseFloat(e.target.value)
                      })}
                      placeholder="Length"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={product.dimensions?.width}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...product.dimensions,
                        width: parseFloat(e.target.value)
                      })}
                      placeholder="Width"
                    />
                    <Input
                      type="number"
                      step="0.1"
                      value={product.dimensions?.height}
                      onChange={(e) => handleInputChange('dimensions', {
                        ...product.dimensions,
                        height: parseFloat(e.target.value)
                      })}
                      placeholder="Height"
                    />
                  </div>
                </div>

                {product.stockQuantity <= product.lowStockThreshold && product.inStock && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Low Stock Warning</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Current stock ({product.stockQuantity}) is below threshold ({product.lowStockThreshold})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media">
            <Card>
              <CardHeader>
                <CardTitle>Product Media</CardTitle>
                <CardDescription>Upload product images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Main Product Image</Label>
                  <div className="mt-2">
                    {product.imageUrl ? (
                      <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => handleInputChange('imageUrl', '')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <Camera className="h-12 w-12 text-gray-400 mb-4" />
                        <span className="text-sm text-gray-500">Click to upload main image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files, true)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Additional Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {product.additionalImages?.map((img, index) => (
                      <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                        <img 
                          src={img} 
                          alt={`Additional ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 w-6 h-6 p-0"
                          onClick={() => {
                            const newImages = [...(product.additionalImages || [])];
                            newImages.splice(index, 1);
                            handleInputChange('additionalImages', newImages);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    {(!product.additionalImages || product.additionalImages.length < 5) && (
                      <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                        <Plus className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files, false)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Additional product configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={product.isActive}
                    onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  />
                  <Label htmlFor="isActive">Product is Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={product.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <Label htmlFor="isFeatured">Featured Product</Label>
                </div>

                <div>
                  <Label>Product Specifications</Label>
                  <div className="space-y-2 mb-2">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 p-2 border rounded">
                        <span className="font-medium">{key}:</span>
                        <span>{value}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSpecRemove(key)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSpec.key}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                      placeholder="Specification name"
                    />
                    <Input
                      value={newSpec.value}
                      onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Value"
                    />
                    <Button onClick={handleSpecAdd}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Zap className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </Tabs>
      )}
    </div>
  );
}
