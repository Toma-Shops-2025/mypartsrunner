import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import MediaUpload from '@/components/MediaUpload';
import StandardAd from '@/components/StandardAd';
import { LocationPicker } from '@/components/LocationPicker';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface MediaData {
  images: string[];
  video_url: string | null;
  thumbnail_url: string | null;
}

const SellItem = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState<MediaData>({
    images: [],
    video_url: null,
    thumbnail_url: null
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
    shippingAvailable: true,
    localPickup: true
  });
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    country: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!location) {
      toast({ title: 'Error', description: 'Please select a location', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Ensure images is an array
      const imageUrls = Array.isArray(mediaData.images) ? mediaData.images : [];
      
      const productData: {
        title: string;
        description: string;
        price: number;
        condition: string;
        seller_id: string;
        status: string;
        images: string[];
        video_url: string | null;
        thumbnail_url: string | null;
        latitude: number;
        longitude: number;
        address: string;
        city: string;
        state: string;
        country: string;
        shipping_available: boolean;
        local_pickup: boolean;
        category_id?: string;
      } = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        condition: formData.condition,
        seller_id: user.id,
        status: 'active',
        images: imageUrls,
        video_url: mediaData.video_url,
        thumbnail_url: mediaData.thumbnail_url,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        shipping_available: formData.shippingAvailable,
        local_pickup: formData.localPickup
      };

      if (formData.category && formData.category.trim() !== '') {
        productData.category_id = formData.category;
      }

      const { error } = await supabase.from('products').insert(productData);

      if (error) throw error;

      toast({ title: 'Success', description: 'Product listed successfully!' });
      setFormData({ title: '', description: '', price: '', category: '', condition: 'new', shippingAvailable: true, localPickup: true });
      setMediaData({ images: [], video_url: null, thumbnail_url: null });
      setLocation(null);
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({ title: 'Error', description: 'Failed to create listing', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Item</h1>
            <p className="text-gray-600">Create a listing to sell your item on TomaShops</p>
          </div>

          <StandardAd slot="4444444444" className="mb-8" />

          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <MediaUpload 
                  onMediaUpload={setMediaData} 
                  maxFiles={5} 
                  initialMedia={mediaData}
                />

                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your item..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like-new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Item Location *</Label>
                  <LocationPicker onLocationSelect={setLocation} />
                </div>

                <div className="space-y-3">
                  <Label>Delivery Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shipping"
                      checked={formData.shippingAvailable}
                      onCheckedChange={(checked) => setFormData({ ...formData, shippingAvailable: !!checked })}
                    />
                    <Label htmlFor="shipping">Available for shipping</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pickup"
                      checked={formData.localPickup}
                      onCheckedChange={(checked) => setFormData({ ...formData, localPickup: !!checked })}
                    />
                    <Label htmlFor="pickup">Available for local pickup</Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Listing...' : user ? 'Create Listing' : 'Sign In to List Item'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <StandardAd slot="5555555555" className="mt-8" />
        </div>
      </AppLayout>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default SellItem;