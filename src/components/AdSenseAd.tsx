import React, { useEffect } from 'react';

interface AdSenseAdProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}) => {
  useEffect(() => {
    try {
      // Initialize AdSense when component mounts
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9061728347766564"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdSenseAd;