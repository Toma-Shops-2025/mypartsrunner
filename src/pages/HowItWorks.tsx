import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import StandardAd from '@/components/StandardAd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, ShoppingCart, Video, Shield, DollarSign, Users, Star, CreditCard, Lock } from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handlePlayPause = () => {
    const video = document.getElementById('demo-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const demoVideoUrl = 'https://youtu.be/uS_JhdsZpcg?si=HVG30itYhJ33Ky98';

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How TomaShops™ Video 1st Marketplace Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to the future of online shopping where videos tell the story. 
            TomaShops™ revolutionizes e-commerce by putting video at the center of every transaction.
          </p>
        </div>
        
        <StandardAd slot="6666666666" className="mb-8" />
        
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">See TomaShops™ in Action</h2>
          <div className="relative bg-black rounded-lg overflow-hidden max-w-3xl mx-auto">
            {!videoError ? (
              <>
                <iframe
                  id="demo-video"
                  src="https://www.youtube.com/embed/uS_JhdsZpcg?si=HVG30itYhJ33Ky98"
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title="TomaShops Demo Video"
                  onError={() => setVideoError(true)}
                />
              </>
            ) : (
              <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-center text-white">
                  <p className="text-lg mb-2">TomaShops™ Demo Video</p>
                  <p className="text-sm opacity-75">Discover the Video 1st Marketplace experience</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Secure Payment Processing with Stripe</h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Enterprise-Grade Payment Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-green-600" />
                    Stripe Integration
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    TomaShops™ uses Stripe, the world's leading payment processor trusted by millions of businesses worldwide.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• PCI DSS Level 1 certified</li>
                    <li>• 256-bit SSL encryption</li>
                    <li>• Advanced fraud protection</li>
                    <li>• Real-time transaction monitoring</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Escrow Protection
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Your payments are held securely until you confirm receipt of your items.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Funds held in secure escrow</li>
                    <li>• Released only after confirmation</li>
                    <li>• Dispute resolution support</li>
                    <li>• Full buyer protection</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose TomaShops™?</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader>
                <Video className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                <CardTitle>Video-First Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Every product comes with detailed video demonstrations, giving you a complete understanding before you buy.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto text-green-600 mb-2" />
                <CardTitle>Secure Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Stripe-powered payments with escrow protection ensure your transactions are safe and secure.</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto text-purple-600 mb-2" />
                <CardTitle>Trusted Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Join thousands of verified buyers and sellers in our growing marketplace community.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Join TomaShops™?</h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're looking to buy unique products or sell to a global audience, 
            TomaShops™ Video 1st Marketplace is your gateway to a better e-commerce experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/video-feed')}
            >
              Start Shopping
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => navigate('/sell')}
            >
              Become a Seller
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HowItWorks;