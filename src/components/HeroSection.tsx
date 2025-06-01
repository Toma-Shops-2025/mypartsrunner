import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    navigate(`/feed?${params.toString()}`);
  };

  const handleVideoFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/feed');
  };

  const handleSellClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/sell');
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/682f036004a271a5767d0528_1748779913729_b424db9f.png" 
              alt="TomaShops™ Video 1st Marketplace" 
              className="h-80 md:h-[32rem] lg:h-[36rem] w-auto mx-auto max-w-full"
            />
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Buy and sell with confidence using videos and photos. 
            Discover amazing deals in your neighborhood.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="pl-10 pr-4 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Location"
                  className="pl-10 pr-4 h-12 w-full sm:w-48"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              onClick={handleVideoFeedClick}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Video Feed
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3"
              onClick={handleSellClick}
            >
              Start Selling Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;