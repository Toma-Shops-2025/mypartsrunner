import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  X, 
  Save, 
  ArrowLeft,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { DatabaseService } from "@/lib/database";
import { useAppContext } from "@/contexts/AppContext";
import { toast } from "@/components/ui/use-toast";

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    partNumber: '',
    sku: '',
    stockQuantity: '',
    imageUrl: '',
    inStock: true,
    isActive: true
  });

  const categories = [
    'Brakes',
    'Engine',
    'Lighting',
    'Suspension',
    'Transmission',
    'Electrical',
    'Exhaust',
    'Cooling',
    'Fuel System',
    'Interior',
    'Exterior',
    'Tools',
    'Accessories'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // In a real app, you would upload to Supabase Storage here
      setFormData(prev => ({
        ...prev,
        imageUrl: file.name // This would be the uploaded URL
      }));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing product name",
        description: "Please enter a product name.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Missing description",
        description: "Please enter a product description.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Missing category",
        description: "Please select a product category.",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      toast({
        title: "Invalid stock quantity",
        description: "Please enter a valid stock quantity.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add products.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Get user's store (assuming they have one)
      const stores = await DatabaseService.getStoresByMerchant(user.id);
      if (stores.length === 0) {
        toast({
          title: "No store found",
          description: "Please create a store first before adding products.",
          variant: "destructive"
        });
        return;
      }

      const storeId = stores[0].id; // Use first store

      const productData = {
        storeId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim() || undefined,
        partNumber: formData.partNumber.trim() || undefined,
        sku: formData.sku.trim() || undefined,
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl || undefined,
        inStock: formData.inStock,
        isActive: formData.isActive
      };

      const product = await DatabaseService.createProduct(productData);

      if (product) {
        toast({
          title: "Product added successfully!",
          description: `${product.name} has been added to your store.`
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: "Failed to add product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={handleCancel} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Add New Product</h1>
            <p className="text-muted-foreground">
              Add a new product to your store inventory
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Essential product details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product"
                      rows={4}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Additional product information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Product brand"
                      />
                    </div>
                    <div>
                      <Label htmlFor="partNumber">Part Number</Label>
                      <Input
                        id="partNumber"
                        name="partNumber"
                        value={formData.partNumber}
                        onChange={handleInputChange}
                        placeholder="Part number"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Stock keeping unit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        name="stockQuantity"
                        type="number"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>
                    Upload a product image
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <Label htmlFor="image" className="cursor-pointer">
                        <div className="space-y-2">
                          <Button variant="outline" type="button">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            PNG, JPG up to 10MB
                          </p>
                        </div>
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Product Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inStock">In Stock</Label>
                    <Switch
                      id="inStock"
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleSwitchChange('inStock', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isActive">Active</Label>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => handleSwitchChange('isActive', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium">{formData.name || 'Product Name'}</p>
                      <p className="text-sm text-muted-foreground">
                        {formData.description || 'Product description will appear here'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        ${formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'}
                      </span>
                      {formData.category && (
                        <Badge variant="secondary">{formData.category}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Stock: {formData.stockQuantity || '0'} units
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Add Product
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
