import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withText = true }) => {
  const logoUrl = "/logo.png";
  
  // Adjust size classes to make the logo image larger and more prominent
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'h-10';
      case 'large':
        return 'h-20';
      case 'medium':
      default:
        return 'h-16';
    }
  };

  return (
    <div className="flex items-center w-full">
      <div className="flex-shrink-0">
        <img 
          src={logoUrl} 
          alt="MyPartsRunner Logo" 
          className={`${getSizeClass()} w-auto`} 
        />
      </div>
      {withText && (
        <div className="flex-grow overflow-hidden">
          <span className="ml-3 font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary whitespace-nowrap inline-block transform scale-100 origin-left">
            MyPartsRunner™
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
