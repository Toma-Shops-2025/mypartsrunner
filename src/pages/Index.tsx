import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/ProductGrid';
import { VideoFeed } from '@/components/VideoFeed';
import { Plus, Video, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import AppLayout from '@/components/AppLayout';
import { useMap } from '@/contexts/MapContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Initialize Mapbox
mapboxgl.accessToken = process.env.VITE_MAPBOX_TOKEN || '';

export function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoFeed, setShowVideoFeed] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { map, addMarker, removeMarker, fitBounds } = useMap();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize map when showMap changes
  useEffect(() => {
    if (!showMap || !map) return;

    // Add markers for all products with locations
    const bounds = new mapboxgl.LngLatBounds();
    const markers: mapboxgl.Marker[] = [];

    products.forEach(product => {
      if (product.location) {
        const { lat, lng } = product.location;
        bounds.extend([lng, lat]);

        const marker = addMarker(
          { lat, lng },
          {
            color: '#FF385C',
            scale: 0.8
          }
        );

        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <img src="${product.thumbnail_url || product.image_url || '/placeholder.svg'}" 
                 alt="${product.title}" 
                 class="w-32 h-32 object-cover mb-2 rounded"
            />
            <h3 class="font-medium">${product.title}</h3>
            <p class="text-lg font-bold">$${product.price.toFixed(2)}</p>
          </div>
        `);

        marker.setPopup(popup);
        markers.push(marker);
      }
    });

    // Fit map to bounds if there are markers
    if (!bounds.isEmpty()) {
      fitBounds(bounds);
    }

    // Cleanup markers when component unmounts or showMap changes
    return () => {
      markers.forEach(marker => removeMarker(marker));
    };
  }, [showMap, map, products, addMarker, removeMarker, fitBounds]);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Buttons */}
        <div className="flex justify-between items-center py-4 sticky top-0 bg-white z-10 border-b">
          <Button
            variant={showVideoFeed ? 'default' : 'outline'}
            size="lg"
            className="flex-1 mr-2"
            onClick={() => {
              setShowVideoFeed(!showVideoFeed);
              setShowMap(false);
            }}
          >
            <Video className="h-5 w-5 mr-2" />
            Video Feed
          </Button>
          <Button
            variant={showMap ? 'default' : 'outline'}
            size="lg"
            className="flex-1 mx-2"
            onClick={() => {
              setShowMap(!showMap);
              setShowVideoFeed(false);
            }}
          >
            <MapPin className="h-5 w-5 mr-2" />
            Map View
          </Button>
          <Button
            variant="default"
            size="lg"
            className="flex-1 ml-2"
            onClick={() => window.location.href = '/sell'}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Listing
          </Button>
        </div>

        {/* Content */}
        <div className="mt-4">
          {showVideoFeed ? (
            <VideoFeed />
          ) : showMap ? (
            <div className="h-[calc(100vh-200px)] rounded-lg overflow-hidden">
              <div id="map" className="w-full h-full" />
            </div>
          ) : (
            <ProductGrid products={products} isLoading={loading} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default Index;