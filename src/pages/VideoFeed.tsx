import React from 'react';
import { AppProvider } from '@/contexts/AppContext';
import VideoFeedPage from '@/components/VideoFeedPage';

const VideoFeed: React.FC = () => {
  return (
    <AppProvider>
      <VideoFeedPage />
    </AppProvider>
  );
};

export default VideoFeed;