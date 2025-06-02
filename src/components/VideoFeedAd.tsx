import React from 'react';
import AdSenseAd from './AdSenseAd';

interface VideoFeedAdProps {
  position: 'top' | 'middle' | 'bottom';
}

const VideoFeedAd: React.FC<VideoFeedAdProps> = ({ position }) => {
  // Replace these placeholder slots with your actual AdSense ad unit IDs after approval
  const getAdSlot = () => {
    switch (position) {
      case 'top': return 'VIDEO-FEED-TOP'; // Replace with actual ad unit ID
      case 'middle': return 'VIDEO-FEED-MIDDLE'; // Replace with actual ad unit ID
      case 'bottom': return 'VIDEO-FEED-BOTTOM'; // Replace with actual ad unit ID
      default: return 'VIDEO-FEED-DEFAULT'; // Replace with actual ad unit ID
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-center">
      <div className="max-w-sm w-full">
        <AdSenseAd 
          slot={getAdSlot()}
          format="rectangle"
          className="text-center"
        />
        <p className="text-xs text-gray-500 text-center mt-2">Advertisement</p>
      </div>
    </div>
  );
};

export default VideoFeedAd;