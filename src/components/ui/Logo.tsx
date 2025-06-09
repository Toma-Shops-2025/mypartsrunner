import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  imageClassName?: string;
}

export function Logo({ className = '', showText = true, imageClassName = 'h-8 w-auto' }: LogoProps) {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img
        src="/logo-new.png"
        alt="MyPartsRunner Logo"
        className={imageClassName}
      />
      {showText && (
        <span className="ml-2 text-xl font-bold text-gray-900">
          MyPartsRunner
        </span>
      )}
    </Link>
  );
} 