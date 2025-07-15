import React, { useRef, useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, VolumeX, Share2, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface VideoFeedItemProps {
  video: Product;
}

export function VideoFeedItem({ video }: VideoFeedItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { shareProduct } = useApp();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url}
            className="w-full h-full object-cover"
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
          </div>
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-white"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{video.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">${video.price.toFixed(2)}</div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => shareProduct(video)}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}