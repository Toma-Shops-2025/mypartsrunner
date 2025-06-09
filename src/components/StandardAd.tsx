import React from 'react';
import PlaceholderAd from './PlaceholderAd';

interface StandardAdProps {
  slot: string;
  title?: string;
  className?: string;
  isCursorAd?: boolean;
}

const StandardAd: React.FC<StandardAdProps> = ({ 
  slot, 
  title = 'Advertisement',
  className = '',
  isCursorAd = false
}) => {
  return <PlaceholderAd slot={slot} className={className} isCursorAd={isCursorAd} />;
};

export default StandardAd;