import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  ShoppingCart,
  Truck,
  Clock,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  sellingPrice: number;
  location: string;
  supplier: string;
  lastRestocked: string;
  totalSold: number;
  averageMonthlySales: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  autoReorder: boolean;
  images: string[];
  tags: string[];
}

interface InventoryAnalytics {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  topSellers: InventoryItem[];
  slowMovers: InventoryItem[];
  reorderSuggestions: InventoryItem[];
  monthlyTrends: {
    month: string;
    sales: number;
    restocks: number;
    value: number;
  }[];
}

interface InventoryManagerProps {
  merchantId?: string;
  onInventoryChange?: (items: InventoryItem[]) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  merchantId = 'demo-merchant',
  onInventoryChange
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Mock inventory data
  const mockInventory: InventoryItem[] = [
    {
      id: '1',
      sku: 'BRK-001',
      name: 'Bosch QuietCast Premium Disc Brake Pad Set',
      description: 'Premium ceramic brake pads with superior stopping power',
      category: 'Brake System',
      brand: 'Bosch',
      currentStock: 45,
      minStockLevel: 10,
      maxStockLevel: 100,
      reorderPoint: 15,
      reorderQuantity: 50,
      unitCost: 65.99,
      sellingPrice: 89.99,
      location: 'A-1-05',
      supplier: 'Bosch Automotive',
      lastRestocked: '2024-01-15',
      totalSold: 234,
      averageMonthlySales: 28,
      status: 'in-stock',
      autoReorder: true,
      images: ['/api/placeholder/300/200'],
      tags: ['premium', 'ceramic', 'quiet']
    },
    {
      id: '2',
      sku: 'OIL-002',
      name: 'ACDelco Professional Oil Filter',
      description: 'OEM-quality oil filter for enhanced engine protection',
      category: 'Engine Parts',
      brand: 'ACDelco',
      currentStock: 8,
      minStockLevel: 15,
      maxStockLevel: 75,
      reorderPoint: 15,
      reorderQuantity: 40,
      unitCost: 8.99,
      sellingPrice: 12.49,
      location: 'B-2-12',
      supplier: 'ACDelco Direct',
      lastRestocked: '2024-01-10',
      totalSold: 456,
      averageMonthlySales: 52,
      status: 'low-stock',
      autoReorder: true,
      images: ['/api/placeholder/300/200'],
      tags: ['oem', 'professional']
    },
    {
      id: '3',
      sku: 'SPK-003',
      name: 'NGK Iridium IX Spark Plugs (Set of 4)',
      description: 'High-performance iridium spark plugs for improved fuel efficiency',
      category: 'Engine Parts',
      brand: 'NGK',
      currentStock: 0,
      minStockLevel: 20,
      maxStockLevel: 120,
      reorderPoint: 25,
      reorderQuantity: 60,
      unitCost: 22.99,
      sellingPrice: 31.96,
      location: 'C-1-08',
      supplier: 'NGK Automotive',
      lastRestocked: '2023-12-20',
      totalSold: 189,
      averageMonthlySales: 22,
      status: 'out-of-stock',
      autoReorder: false,
      images: ['/api/placeholder/300/200'],
      tags: ['iridium', 'high-performance']
    },
    {
      id: '4',
      sku: 'BAT-004',
      name: 'Interstate AGM Battery Group 35',
      description: 'Maintenance-free AGM battery for reliable starting power',
      category: 'Electrical',
      brand: 'Interstate',
      currentStock: 22,
      minStockLevel: 8,
      maxStockLevel: 40,
      reorderPoint: 12,
      reorderQuantity: 20,
      unitCost: 89.99,
      sellingPrice: 129.99,
      location: 'D-3-01',
      supplier: 'Interstate Batteries',
      lastRestocked: '2024-01-08',
      totalSold: 78,
      averageMonthlySales: 9,
      status: 'in-stock',
      autoReorder: true,
      images: ['/api/placeholder/300/200'],
      tags: ['agm', 'maintenance-free']
    }
  ];

  // Load inventory data
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setInventory(mockInventory);
      setFilteredInventory(mockInventory);
      generateAnalytics(mockInventory);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Generate analytics
  const generateAnalytics = useCallback((items: InventoryItem[]) => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
    const lowStockItems = items.filter(item => item.currentStock <= item.minStockLevel).length;
    const outOfStockItems = items.filter(item => item.currentStock === 0).length;
    
    const topSellers = [...items]
      .sort((a, b) => b.averageMonthlySales - a.averageMonthlySales)
      .slice(0, 5);
    
    const slowMovers = [...items]
      .sort((a, b) => a.averageMonthlySales - b.averageMonthlySales)
      .slice(0, 5);
    
    const reorderSuggestions = items.filter(item => 
      item.currentStock <= item.reorderPoint && item.status !== 'discontinued'
    );

    const monthlyTrends = [
      { month: 'Dec 2023', sales: 1234, restocks: 15, value: 45670 },
      { month: 'Jan 2024', sales: 1456, restocks: 18, value: 52340 },
      { month: 'Feb 2024', sales: 1123, restocks: 12, value: 41230 },
      { month: 'Mar 2024', sales: 1678, restocks: 22, value: 58990 }
    ];

    setAnalytics({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      topSellers,
      slowMovers,
      reorderSuggestions,
      monthlyTrends
    });
  }, []);

  // Filter and search inventory
  useEffect(() => {
    let filtered = inventory;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.currentStock - a.currentStock;
        case 'value':
          return (b.currentStock * b.unitCost) - (a.currentStock * a.unitCost);
        case 'sales':
          return b.averageMonthlySales - a.averageMonthlySales;
        default:
          return 0;
      }
    });

    setFilteredInventory(filtered);
  }, [inventory, searchQuery, selectedCategory, selectedStatus, sortBy]);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-500';
      case 'low-stock': return 'bg-yellow-500';
      case 'out-of-stock': return 'bg-red-500';
      case 'discontinued': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  // Get stock level indicator
  const getStockIndicator = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStockLevel) * 100;
    if (percentage <= 20) return { color: 'bg-red-500', level: 'Critical' };
    if (percentage <= 40) return { color: 'bg-yellow-500', level: 'Low' };
    if (percentage <= 70) return { color: 'bg-blue-500', level: 'Good' };
    return { color: 'bg-green-500', level: 'Excellent' };
  };

  // Auto-reorder function
  const triggerAutoReorder = useCallback(async (item: InventoryItem) => {
    setIsLoading(true);
    try {
      // Simulate API call for auto-reorder
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update inventory
      setInventory(prev => prev.map(inv => 
        inv.id === item.id 
          ? { 
              ...inv, 
              currentStock: inv.currentStock + inv.reorderQuantity,
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : inv
      ));
      
      alert(`Auto-reorder triggered for ${item.name}. ${item.reorderQuantity} units ordered from ${item.supplier}.`);
    } catch (error) {
      console.error('Auto-reorder failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600">Manage your auto parts inventory with real-time tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold">{analytics.totalItems}</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-3xl font-bold">${analytics.totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  <p className="text-3xl font-bold text-yellow-600">{analytics.lowStockItems}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Out of Stock</p>
                  <p className="text-3xl font-bold text-red-600">{analytics.outOfStockItems}</p>
                </div>
                <Truck className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reorders">Auto-Reorders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search inventory..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="stock">Stock Level</SelectItem>
                    <SelectItem value="value">Total Value</SelectItem>
                    <SelectItem value="sales">Sales Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Inventory List */}
          <div className="grid gap-4">
            {filteredInventory.map((item) => {
              const stockIndicator = getStockIndicator(item);
              const needsReorder = item.currentStock <= item.reorderPoint;

              return (
                <Card key={item.id} className={`${needsReorder ? 'border-yellow-300 bg-yellow-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
                      {/* Product Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              <Badge variant="outline" className="text-xs">{item.brand}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stock Level */}
                      <div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{item.currentStock}</div>
                          <div className="text-sm text-gray-600">Current Stock</div>
                          <div className={`w-full h-2 rounded-full mt-2 ${stockIndicator.color}`}>
                            <div 
                              className="h-full bg-white rounded-full opacity-30"
                              style={{ width: `${Math.max(0, 100 - (item.currentStock / item.maxStockLevel) * 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{stockIndicator.level}</div>
                        </div>
                      </div>

                      {/* Financial Info */}
                      <div className="text-center">
                        <div className="text-lg font-semibold">${item.sellingPrice}</div>
                        <div className="text-sm text-gray-600">Selling Price</div>
                        <div className="text-xs text-gray-500">Cost: ${item.unitCost}</div>
                        <div className="text-xs text-green-600">
                          Margin: {(((item.sellingPrice - item.unitCost) / item.sellingPrice) * 100).toFixed(1)}%
                        </div>
                      </div>

                      {/* Performance */}
                      <div className="text-center">
                        <div className="text-lg font-semibold">{item.averageMonthlySales}</div>
                        <div className="text-sm text-gray-600">Monthly Sales</div>
                        <div className="text-xs text-gray-500">Total: {item.totalSold}</div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace('-', ' ')}
                        </Badge>
                        
                        {needsReorder && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => triggerAutoReorder(item)}
                            className="text-yellow-600 border-yellow-300"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Reorder
                          </Button>
                        )}
                        
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topSellers.slice(0, 5).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-600">{item.averageMonthlySales} units/month</div>
                        </div>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reorder Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.reorderSuggestions.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">
                          Current: {item.currentStock} | Reorder at: {item.reorderPoint}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => triggerAutoReorder(item)}>
                        <Truck className="h-3 w-3 mr-1" />
                        Order
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reorders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Auto-Reorder Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Intelligent Auto-Reordering</h3>
                <p className="text-gray-600 mb-4">
                  Our AI-powered system monitors your inventory levels and automatically
                  suggests reorders based on sales patterns and lead times.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Smart Predictions</h4>
                    <p className="text-sm text-gray-600">AI predicts optimal reorder timing</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <h4 className="font-medium">Instant Orders</h4>
                    <p className="text-sm text-gray-600">Automatic supplier communication</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BarChart3 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <h4 className="font-medium">Cost Optimization</h4>
                    <p className="text-sm text-gray-600">Minimize carrying costs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Stock Level Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Sales Performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <DollarSign className="h-6 w-6" />
                  <span>Valuation Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Truck className="h-6 w-6" />
                  <span>Reorder History</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManager; 