import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  text?: string;
  onClick?: () => void;
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  variant = 'ghost',
  size = 'default',
  className = '',
  text = 'Back',
  onClick,
  fallbackPath = '/'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Try to go back, fallback to specified path if no history
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate(fallbackPath);
      }
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {text}
    </Button>
  );
};

export default BackButton; 