import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Shield, Users, CreditCard, Lock } from 'lucide-react';

const HowItWorksSection = () => {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="mt-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">How TomaShops™ Video 1st Marketplace Works</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to the future of online shopping where videos tell the story.
        </p>
      </div>
      
      <div className="mb-12">
        <h3 className="text-3xl font-bold mb-6 text-center">See TomaShops™ in Action</h3>
        <div className="relative bg-black rounded-lg overflow-hidden max-w-3xl mx-auto">
          {!videoError ? (
            <iframe
              src="https://www.youtube.com/embed/uS_JhdsZpcg?si=HVG30itYhJ33Ky98"
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="TomaShops Demo Video"
              onError={() => setVideoError(true)}
            />
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
        <h3 className="text-3xl font-bold text-center mb-8">Secure Payment Processing</h3>
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
                  TomaShops™ uses Stripe, the world's leading payment processor.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Escrow Protection
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your payments are held securely until you confirm receipt.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h3 className="text-3xl font-bold mb-4">Ready to Join TomaShops™?</h3>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Whether you're looking to buy unique products or sell to a global audience.
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
  );
};

export default HowItWorksSection;