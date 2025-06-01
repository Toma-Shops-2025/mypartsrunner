import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, MessageCircle, ShoppingCart, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LocationDisplay } from '@/components/LocationDisplay';
import { useAppContext } from '@/contexts/AppContext';
import { supabase } from '@/lib/supabase';
import ContactSellerModal from '@/components/ContactSellerModal';

interface Product {
  id: string;
  title: string;
  price: string;
  seller_id: string;
  category: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  image_url?: string;
  images?: string[];
  status: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  shipping_available?: boolean;
  local_pickup?: boolean;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleLike, shareProduct, likedProducts } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactSeller, setShowContactSeller] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      if (id === '550e8400-e29b-41d4-a716-446655440000') {
        setProduct({
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Demo Product - Video Feed',
          price: '29.99',
          seller_id: '550e8400-e29b-41d4-a716-446655440001',
          category: 'Demo',
          description: 'This is a demo product showcasing our video feed functionality',
          video_url: 'https://drive.google.com/file/d/13e3wz4RKUEI_7K8ZyxSW1BbYJulWjzMd/view?usp=drivesdk',
          thumbnail_url: '/placeholder.svg',
          image_url: '/placeholder.svg',
          status: 'active',
          created_at: new Date().toISOString(),
          city: 'San Francisco',
          state: 'CA',
          country: 'United States',
          shipping_available: true,
          local_pickup: true
        });
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .maybeSingle();

        if (error) throw error;
        if (!data) {
          navigate('/video-feed');
          return;
        }
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/video-feed');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    navigate('/cart');
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const getVideoUrl = (videoPath: string) => {
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    const { data } = supabase.storage
      .from('product-videos')
      .getPublicUrl(videoPath);
    return data.publicUrl;
  };

  const getEmbeddableUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[1]}/preview`;
      }
    }
    return url;
  };

  const getDisplayImages = () => {
    if (!product) return [];
    
    const images = [];
    
    if (product.images && product.images.length > 0) {
      images.push(...product.images.map(img => getImageUrl(img)));
    }
    
    if (product.thumbnail_url && !images.some(img => img.includes(product.thumbnail_url))) {
      images.push(getImageUrl(product.thumbnail_url));
    }
    
    if (product.image_url && !images.some(img => img.includes(product.image_url!))) {
      images.push(getImageUrl(product.image_url));
    }
    
    return images.length > 0 ? images : ['/placeholder.svg'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Button onClick={() => navigate('/video-feed')} className="mt-4">
            Back to Video Feed
          </Button>
        </div>
      </div>
    );
  }

  const isLiked = likedProducts.includes(product.id);
  const displayImages = getDisplayImages();
  const hasVideo = product.video_url && product.video_url.trim() !== '';
  const videoUrl = hasVideo ? getVideoUrl(product.video_url) : '';
  const embeddableUrl = hasVideo ? getEmbeddableUrl(videoUrl) : '';
  const isGoogleDrive = videoUrl.includes('drive.google.com');

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <Button 
            onClick={() => navigate('/video-feed')} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Feed
          </Button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                {hasVideo ? (
                  <div className="space-y-4">
                    {isGoogleDrive ? (
                      <iframe
                        src={embeddableUrl}
                        className="w-full h-64 md:h-96"
                        allow="autoplay"
                        title={product.title}
                      />
                    ) : (
                      <video
                        src={videoUrl}
                        poster={displayImages[0]}
                        className="w-full h-64 md:h-96 object-cover"
                        controls
                        autoPlay
                        loop
                        onError={(e) => {
                          console.error('Video failed to load:', product.video_url);
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div>
                    <img
                      src={displayImages[currentImageIndex] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-64 md:h-96 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2 p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="font-medium">{product.seller_id.slice(0, 12)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Location & Delivery</p>
                    <LocationDisplay
                      address={product.address}
                      city={product.city}
                      state={product.state}
                      country={product.country}
                      shippingAvailable={product.shipping_available}
                      localPickup={product.local_pickup}
                      showShippingOptions={true}
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm mt-1">{product.description}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleBuyNow} className="flex-1 bg-green-500 hover:bg-green-600">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                    <Button 
                      onClick={() => addToCart(product)}
                      variant="outline" 
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setShowContactSeller(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => toggleLike(product.id)}
                      variant="outline" 
                      size="icon"
                      className={isLiked ? 'bg-red-50 border-red-200' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button 
                      onClick={() => shareProduct(product)}
                      variant="outline" 
                      size="icon"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ContactSellerModal
        isOpen={showContactSeller}
        onClose={() => setShowContactSeller(false)}
        sellerId={product.seller_id}
        productId={product.id}
        productTitle={product.title}
      />
    </>
  );
};

export default ProductDetail;