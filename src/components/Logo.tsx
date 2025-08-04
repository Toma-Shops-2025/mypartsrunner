import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withText = true }) => {
  const logoUrl = "https://d64gsuwffb70l.cloudfront.net/6828bd34e19b9a417662c460_1747502820250_5dcc0c63.png";
  
  // Adjust size classes to make the logo image smaller relative to text
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-6';
      case 'large':
        return 'h-12';
      case 'medium':
      default:
        return 'h-8';
    }
  };

  return (
    <div className="flex items-center w-full">
      <div className="flex-shrink-0">
        <img 
          src={logoUrl} 
          alt="MyPartsRunner™ Logo" 
          className={`${getSizeClass()} w-auto`} 
        />
      </div>
      {withText && (
        <div className="flex-grow overflow-hidden">
          <span className="ml-2 font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary whitespace-nowrap inline-block transform scale-100 origin-left">
            MyPartsRunner™
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
