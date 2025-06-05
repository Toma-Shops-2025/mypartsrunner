import React from 'react';
import { useAdLocation } from '../hooks/useAdLocation';
import { Link } from 'react-router-dom';

interface VideoFeedAdProps {
  position: 'top' | 'middle' | 'bottom';
}

const VideoFeedAd: React.FC<VideoFeedAdProps> = ({ position }) => {
  const { ad, isLoading, error } = useAdLocation(`video-feed-${position}`);

  // Simple loading state
  if (isLoading) {
    return (
      <div className="min-h-[300px] w-full bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // When no ad is available or there's an error
  if (error || !ad) {
    return (
      <div className="min-h-[300px] w-full bg-white p-8 flex flex-col items-center justify-center text-center">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Advertise Here
          </h2>
          <p className="text-gray-600 mb-6">
            Reach thousands of engaged shoppers on TomaShops' video marketplace.
          </p>
          <Link
            to="/advertise"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Learn About Advertising
          </Link>
        </div>
      </div>
    );
  }

  // When there is an active ad
  return (
    <div className="min-h-[300px] w-full bg-white p-8">
      <div className="max-w-md mx-auto">
        <Link to={ad.clickUrl} className="block">
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{ad.title}</h3>
          {ad.description && (
            <p className="text-gray-600">{ad.description}</p>
          )}
        </Link>
      </div>
    </div>
  );
};

export default VideoFeedAd;