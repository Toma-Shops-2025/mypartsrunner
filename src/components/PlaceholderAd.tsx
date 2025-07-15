import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PlaceholderAdProps {
  slot: string;
  className?: string;
  isCursorAd?: boolean;
}

const PlaceholderAd: React.FC<PlaceholderAdProps> = ({
  slot,
  className = '',
  isCursorAd = false
}) => {
  const navigate = useNavigate();

  if (isCursorAd) {
    return (
      <div className={`w-full py-4 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-bold mb-2">Built with Cursor - The AI-First Code Editor</h3>
            <p className="text-sm mb-4">Experience the future of coding with AI pair programming</p>
            <a 
              href="https://cursor.sh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Try Cursor Free →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors duration-300">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your Ad Here</h3>
          <p className="text-sm text-gray-600 mb-4">
            Reach thousands of potential customers in the TomaShops marketplace
          </p>
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p>📍 Premium Ad Space (ID: {slot})</p>
            <p>✨ High-visibility placement</p>
            <p>🎯 Target engaged shoppers</p>
          </div>
          <Button 
            onClick={() => navigate('/advertise')} 
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-100"
          >
            Learn How to Advertise →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderAd; 